"""WS e2e — mirrors packages/core/tests TestEndToEnd over the wire:
look-left moves the head, the whip gets clamped BY THE BODY, estop latches.
Runs keyless: mock provider + in-process ReflexCore sim.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest
from fastapi.testclient import TestClient

from core_bridge import LIMITS
from main import app


def drain_until(ws, mtype: str, limit: int = 20) -> tuple[dict, list[dict]]:
    """Read messages until one of the given type arrives."""
    seen = []
    for _ in range(limit):
        msg = ws.receive_json()
        seen.append(msg)
        if msg["type"] == mtype:
            return msg, seen
    raise AssertionError(f"never saw {mtype!r}; got {[m['type'] for m in seen]}")


@pytest.fixture()
def client():
    with TestClient(app) as c:
        yield c


class TestConsoleWS:
    def test_full_safety_story_over_ws(self, client):
        with client.websocket_connect("/ws/console/e2e-test-session") as ws:
            hello = ws.receive_json()
            assert hello["type"] == "hello"
            assert hello["link"] == "sim"
            assert "mock" in hello["providers"]

            # 1) look left → thinking → answer (verbatim shape) → pose pan<0
            ws.send_json({"type": "stimulus", "text": "please look left"})
            thinking, _ = drain_until(ws, "thinking")
            assert thinking["providers"] == ["mock"]
            answer, _ = drain_until(ws, "answer")
            assert set(answer) >= {"model", "latency_ms", "speech",
                                   "intents", "body_acks"}
            assert answer["intents"][0]["action"] == "gaze"
            assert answer["body_acks"][0]["executed"] is True
            pose, _ = drain_until(ws, "pose")
            assert pose["pan"] < 0

            # 2) violent whip → the BODY clamps it (reason from ReflexCore)
            ws.send_json({"type": "stimulus",
                          "text": "whip your head around fast"})
            answer, _ = drain_until(ws, "answer")
            ack = answer["body_acks"][0]
            assert ack["executed"] is True
            assert ack["reason"] == "clamped"
            pose, _ = drain_until(ws, "pose")
            assert abs(pose["pan"]) <= LIMITS["pan"][1]

            # 3) estop latches → subsequent motion is blocked
            ws.send_json({"type": "estop"})
            pose, _ = drain_until(ws, "pose")
            assert pose["estop"] is True
            answer, _ = drain_until(ws, "answer")
            assert answer["body_acks"][0]["estop"] is True

            ws.send_json({"type": "stimulus", "text": "please look right"})
            answer, _ = drain_until(ws, "answer")
            assert answer["body_acks"][0]["executed"] is False
            assert "estopped" in answer["body_acks"][0]["reason"]

    def test_task_type_switch_and_consensus(self, client):
        with client.websocket_connect("/ws/console/e2e-consensus") as ws:
            ws.receive_json()  # hello
            ws.send_json({"type": "set_task", "task_type": "consensus"})
            msg = ws.receive_json()
            assert msg == {"type": "task_set", "task_type": "consensus"}
            ws.send_json({"type": "stimulus", "text": "look right please"})
            thinking, _ = drain_until(ws, "thinking")
            assert "mock" in thinking["providers"]
            answer, _ = drain_until(ws, "answer")
            assert answer["speech"] or answer["intents"]

    def test_bad_input_never_kills_the_socket(self, client):
        with client.websocket_connect("/ws/console/e2e-errors") as ws:
            ws.receive_json()
            ws.send_text("not json at all")
            assert ws.receive_json()["type"] == "error"
            ws.send_json({"type": "stimulus", "text": ""})
            assert ws.receive_json()["type"] == "error"
            ws.send_json({"type": "wat"})
            assert ws.receive_json()["type"] == "error"
            # still alive
            ws.send_json({"type": "stimulus", "text": "nod"})
            answer, _ = drain_until(ws, "answer")
            assert answer["intents"][0]["action"] == "nod"


class TestRestSurface:
    def test_health(self, client):
        r = client.get("/health")
        assert r.status_code == 200 and r.json()["ok"] is True

    def test_waitlist_dedupe_and_position(self, client):
        import uuid

        email = f"ws-test-{uuid.uuid4().hex[:8]}@example.com"
        r1 = client.post("/waitlist", json={"email": email})
        assert r1.status_code == 200
        pos = r1.json()["position"]
        r2 = client.post("/waitlist", json={"email": email})
        assert r2.json() == {"position": pos, "already_joined": True}

    def test_me_and_providers_dev_auth(self, client):
        me = client.get("/me")
        assert me.status_code == 200
        assert me.json()["email"] == "dev@exobod.local"
        provs = client.get("/me/providers").json()
        names = {p["provider"] for p in provs}
        assert names == {"claude", "openai", "glm", "deepseek", "ollama", "mock"}
        # keys never come back raw
        put = client.put("/me/providers", json={
            "provider": "claude", "enabled": True,
            "api_key": "sk-ant-supersecret-abcd1234"})
        assert put.status_code == 200
        claude = next(p for p in put.json() if p["provider"] == "claude")
        assert claude["has_key"] is True
        assert "supersecret" not in str(put.json())
        assert claude["key_masked"].endswith("1234")

    def test_persona_crud_and_preview(self, client):
        identity = {"name": "Testa", "disposition": "curt", "values": ["x"],
                    "voice": "flat", "hard_rules": [], "boot_greeting": "hi",
                    "version": "t"}
        created = client.post("/personas", json={
            "name": "Testa", "identity": identity, "is_default": True})
        assert created.status_code == 200
        pid = created.json()["id"]
        prev = client.post("/personas/preview", json={
            "identity": identity, "stimulus": "please nod"})
        assert prev.status_code == 200
        assert prev.json()["intents"][0]["action"] == "nod"
        assert client.delete(f"/personas/{pid}").status_code == 200

    def test_device_pair_and_fleet(self, client):
        r = client.post("/devices/pair", json={"name": "bench unit"})
        assert r.status_code == 200
        code = r.json()["pairing_code"]
        assert code.startswith("EXO-")
        fleet = client.get("/devices").json()
        assert any(d["pairing_code"] == code for d in fleet)
        # estop on an offline device is a clean 409, not a fake success
        dev_id = r.json()["id"]
        assert client.post(f"/devices/{dev_id}/estop").status_code == 409
        assert client.delete(f"/devices/{dev_id}").status_code == 200
