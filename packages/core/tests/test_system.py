"""
Exobod test suite — run: pytest tests/ -v

Covers the three seams where LLM-robotics systems actually break:
  1. intent extraction from messy model output
  2. reflex safety invariants (limits, clamping, estop latching, heartbeat)
  3. the FULL pipeline: orchestrator -> intent -> zmq link -> reflex sim
"""

import asyncio
import json
import sys
import threading
import time
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "orchestrator"))
sys.path.insert(0, str(ROOT))

from orchestrator.intent import extract_intents                # noqa: E402
from orchestrator.core import Orchestrator, TaskType           # noqa: E402
from orchestrator.persona_state import PersonaState            # noqa: E402
from reflex.reflex_sim import ReflexCore, LIMITS               # noqa: E402
from transport.link import ZmqLink                             # noqa: E402


# ===================================================================== #
#  1. Intent extraction                                                 #
# ===================================================================== #
class TestIntentExtraction:
    def test_clean_intent(self):
        speech, intents = extract_intents(
            'Sure. {"intent": {"action": "gaze", "params": {"pan": 30}}}')
        assert speech == "Sure."
        assert len(intents) == 1
        assert intents[0].action == "gaze"
        assert intents[0].params == {"pan": 30}

    def test_markdown_fenced(self):
        text = 'Okay!\n```json\n{"intent": {"action": "nod", "params": {}}}\n```'
        speech, intents = extract_intents(text)
        assert intents[0].action == "nod"
        assert "```" not in speech or "nod" not in speech

    def test_single_quotes(self):
        _, intents = extract_intents(
            "{'intent': {'action': 'shake', 'params': {}}}")
        assert intents and intents[0].action == "shake"

    def test_disallowed_action_dropped(self):
        _, intents = extract_intents(
            '{"intent": {"action": "self_destruct", "params": {}}}')
        assert intents == []

    def test_malformed_json_never_raises(self):
        speech, intents = extract_intents('{"intent": {"action": "gaze", ')
        assert intents == []
        assert isinstance(speech, str)

    def test_multiple_intents(self):
        text = ('{"intent": {"action": "gaze", "params": {"pan": 10}}} then '
                '{"intent": {"action": "nod", "params": {}}}')
        _, intents = extract_intents(text)
        assert [i.action for i in intents] == ["gaze", "nod"]

    def test_prose_json_without_action_ignored(self):
        _, intents = extract_intents('Config is {"debug": true} by the way.')
        assert intents == []


# ===================================================================== #
#  2. Reflex safety invariants                                          #
# ===================================================================== #
class TestReflexSafety:
    def make(self):
        rc = ReflexCore()
        rc.last_hb = time.monotonic()
        return rc

    def intent(self, action, **params):
        return {"t": "intent", "action": action, "params": params, "seq": 1}

    def test_gaze_within_limits(self):
        rc = self.make()
        ack = rc.handle(self.intent("gaze", pan=20, tilt=10))
        assert ack["executed"] and ack["pose"] == {"pan": 20.0, "tilt": 10.0}

    def test_gaze_clamped_to_joint_limits_and_step(self):
        rc = self.make()
        ack = rc.handle(self.intent("gaze", pan=200, tilt=-90))
        assert ack["executed"] and ack["reason"] == "clamped"
        # step limit: one command can move at most max_step_deg
        assert abs(ack["pose"]["pan"]) <= LIMITS["max_step_deg"]
        assert abs(ack["pose"]["tilt"]) <= LIMITS["max_step_deg"]
        # repeated commands converge but never exceed joint limits
        for _ in range(20):
            ack = rc.handle(self.intent("gaze", pan=200, tilt=-90))
        assert ack["pose"]["pan"] == LIMITS["pan"][1]
        assert ack["pose"]["tilt"] == LIMITS["tilt"][0]

    def test_non_numeric_params_rejected(self):
        rc = self.make()
        ack = rc.handle(self.intent("gaze", pan="LEFT"))
        assert not ack["executed"]

    def test_estop_latches_and_blocks_motion(self):
        rc = self.make()
        rc.handle({"t": "estop"})
        ack = rc.handle(self.intent("gaze", pan=10))
        assert not ack["executed"] and "estopped" in ack["reason"]
        # expression still allowed while estopped (speak/led/face)
        ack = rc.handle(self.intent("speak", text="I'm locked"))
        assert ack["executed"]

    def test_drive_speed_clamped(self):
        rc = self.make()
        ack = rc.handle(self.intent("drive", vx=5.0, wz=-9.0))
        assert ack["executed"]
        assert abs(ack["drive"]["vx"]) <= LIMITS["drive_vx_max"]
        assert abs(ack["drive"]["wz"]) <= LIMITS["drive_wz_max"]

    def test_heartbeat_timeout_neutralizes_drive(self):
        rc = self.make()
        rc.handle(self.intent("drive", vx=0.2, wz=0))
        assert rc.drive["vx"] == 0.2
        rc.last_hb = time.monotonic() - 5.0        # simulate silence
        rc.handle(self.intent("gaze", pan=5))       # any traffic triggers check
        assert rc.drive == {"vx": 0.0, "wz": 0.0}

    def test_unknown_action_nacked(self):
        rc = self.make()
        ack = rc.handle(self.intent("launch"))
        assert not ack["executed"]


# ===================================================================== #
#  3. End-to-end: orchestrator -> link -> live reflex sim               #
# ===================================================================== #
@pytest.fixture(scope="module")
def reflex_server():
    """Run the real reflex sim (zmq REP) in a background thread."""
    import zmq
    ready = threading.Event()

    def serve():
        ctx = zmq.Context()
        sock = ctx.socket(zmq.REP)
        sock.bind("tcp://127.0.0.1:5599")
        core = ReflexCore()
        ready.set()
        while True:
            msg = json.loads(sock.recv_string())
            if msg.get("t") == "__shutdown__":
                sock.send_string("{}")
                break
            sock.send_string(json.dumps(core.handle(msg)))

    t = threading.Thread(target=serve, daemon=True)
    t.start()
    ready.wait(3)
    yield "tcp://127.0.0.1:5599"


@pytest.fixture()
def orchestrator(tmp_path, reflex_server):
    identity = tmp_path / "identity.json"
    identity.write_text(json.dumps({
        "name": "Exo", "disposition": "test", "values": ["honesty"],
        "voice": "terse", "hard_rules": [], "boot_greeting": "", 
        "version": "t"}))
    persona = PersonaState.load(identity, tmp_path / "mem.db")

    async def build():
        link = ZmqLink(reflex_server)
        assert await link.connect()
        return Orchestrator(persona, link, {"providers": ["mock"]})
    return asyncio.run(build())


class TestEndToEnd:
    def run(self, orch, stimulus, task=TaskType.CONVERSATION):
        async def go():
            r = await orch.handle(stimulus, task)
            await orch.drain()
            return r
        return asyncio.run(go())

    def test_stimulus_to_actuation(self, orchestrator):
        r = self.run(orchestrator, "please look left")
        assert r["intents"][0]["action"] == "gaze"
        ack = r["body_acks"][0]
        assert ack["executed"]
        assert ack["pose"]["pan"] < 0            # actually moved left

    def test_unsafe_request_clamped_by_body(self, orchestrator):
        r = self.run(orchestrator, "whip your head around fast")
        ack = r["body_acks"][0]
        assert ack["executed"] and ack["reason"] == "clamped"
        assert abs(ack["pose"]["pan"]) <= LIMITS["max_step_deg"]

    def test_estop_flows_through_and_latches(self, orchestrator):
        r = self.run(orchestrator, "emergency stop now")
        assert r["intents"][0]["action"] == "estop"
        assert r["body_acks"][0]["estop"] is True
        # any later motion request must be blocked by the SAME body
        r2 = self.run(orchestrator, "please look right")
        assert r2["body_acks"][0]["executed"] is False

    def test_memory_persists_facts(self, orchestrator):
        self.run(orchestrator, "my name is Ankit and I like Kabir dohas")
        facts = orchestrator.persona.facts()
        assert facts.get("user_name", "").startswith("Ankit")

    def test_consensus_mode_returns_answer(self, orchestrator):
        r = self.run(orchestrator, "look right please", TaskType.CONSENSUS)
        assert r["speech"] or r["intents"]

    def test_episode_recorded(self, orchestrator):
        self.run(orchestrator, "hello there")
        rows = orchestrator.persona.db.execute(
            "SELECT COUNT(*) FROM episodes").fetchone()[0]
        assert rows >= 1
