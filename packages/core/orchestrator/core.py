"""
Exobod Orchestrator — the federation brain.

Full pipeline per stimulus:
  1. build persona context (one identity/memory for all backends)
  2. route to providers (priority chain) or fan out (consensus + arbitration)
  3. extract intents defensively from model text
  4. ship intents over the Link (zmq sim or serial MCU); firmware clamps
  5. record episode; background task extracts durable facts

Everything degrades: cloud→local→mock; link down→speech-only mode.
"""

import asyncio
import json
from enum import Enum

from providers import build_providers, ModelResponse
from persona_state import PersonaState
from intent import extract_intents, Intent

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from transport.link import Link  # noqa: E402


class TaskType(Enum):
    CONVERSATION = "conversation"
    REASONING = "reasoning"
    PLANNING = "planning"
    CODE = "code"
    PERCEPTION = "perception"
    CONSENSUS = "consensus"


DEFAULT_ROUTES = {
    TaskType.CONVERSATION: ["claude", "ollama", "mock"],
    TaskType.REASONING:    ["claude", "deepseek", "ollama", "mock"],
    TaskType.PLANNING:     ["claude", "openai", "ollama", "mock"],
    TaskType.CODE:         ["deepseek", "claude", "ollama", "mock"],
    TaskType.PERCEPTION:   ["ollama", "mock"],
    TaskType.CONSENSUS:    ["claude", "openai", "deepseek", "glm",
                            "ollama", "mock"],
}


class Orchestrator:
    def __init__(self, persona: PersonaState, link: Link | None = None,
                 config: dict | None = None):
        cfg = config or {}
        self.persona = persona
        self.link = link
        self.providers = build_providers(cfg.get("providers"))
        self.routes = {
            TaskType(k): v for k, v in cfg.get("routes", {}).items()
        } if cfg.get("routes") else DEFAULT_ROUTES
        self.timeout_s = cfg.get("timeout_s", 25.0)
        self._bg: set[asyncio.Task] = set()

    # ------------------------------------------------------------------ #
    async def handle(self, stimulus: str,
                     task_type: TaskType = TaskType.CONVERSATION) -> dict:
        context = self.persona.build_context(stimulus, task_type.value)

        if task_type == TaskType.CONSENSUS:
            response = await self._consensus(context)
        else:
            response = await self._route(context, self.routes[task_type])

        speech, intents = extract_intents(response.text, response.model)
        ack_results = await self._dispatch_intents(intents)

        self.persona.record(stimulus, speech or response.text, response.model)
        self._spawn_fact_extraction(stimulus, speech or response.text)

        return {"model": response.model, "latency_ms": response.latency_ms,
                "speech": speech, "intents": [i.to_wire() for i in intents],
                "body_acks": ack_results}

    # ------------------------------------------------------------------ #
    async def _route(self, context: dict, route: list[str]) -> ModelResponse:
        for name in route:
            p = self.providers.get(name)
            if p is None or not p.available():
                continue
            try:
                return await asyncio.wait_for(p.complete(context),
                                              timeout=self.timeout_s)
            except (asyncio.TimeoutError, Exception) as e:  # noqa: BLE001
                print(f"[orch] {name} failed ({type(e).__name__}); next")
        return ModelResponse("none", "(no reasoning backend reachable)", 0)

    async def _consensus(self, context: dict) -> ModelResponse:
        live = [(n, p) for n, p in self.providers.items()
                if n in self.routes[TaskType.CONSENSUS] and p.available()]
        tasks = {n: asyncio.create_task(p.complete(context)) for n, p in live}
        await asyncio.wait(tasks.values(), timeout=self.timeout_s)
        candidates = []
        for n, t in tasks.items():
            if t.done() and not t.cancelled() and t.exception() is None:
                r = t.result(); r.model = n; candidates.append(r)
            else:
                t.cancel()
        if not candidates:
            return ModelResponse("none", "(consensus: no backends)", 0)
        if len(candidates) == 1:
            return candidates[0]
        return await self._arbitrate(context, candidates)

    async def _arbitrate(self, context, candidates) -> ModelResponse:
        judge = next((self.providers[n] for n in
                      ("claude", "ollama", "mock")
                      if n in self.providers and self.providers[n].available()),
                     None)
        ballot = "\n\n".join(f"--- {c.model} ---\n{c.text}" for c in candidates)
        verdict = await judge.complete({
            "system": ("You are the arbitration function of one robot "
                       "persona. Synthesize the single best response in the "
                       "persona's voice from these internal candidates. "
                       "Final answer only; keep any intent JSON if present."),
            "user": f"Context: {context.get('user','')}\n\n{ballot}",
        })
        verdict.model = f"consensus[{','.join(c.model for c in candidates)}]"
        return verdict

    # ------------------------------------------------------------------ #
    async def _dispatch_intents(self, intents: list[Intent]) -> list[dict]:
        if not intents:
            return []
        if self.link is None or not self.link.connected:
            self.persona.update_body(link="down")
            return [{"executed": False, "reason": "no body link"}
                    for _ in intents]
        acks = []
        for it in intents:
            ack = await self.link.send_intent(it.to_wire())
            acks.append(ack)
            if pose := ack.get("pose"):
                self.persona.update_body(gaze=pose, link="up",
                                         estop=ack.get("estop", False))
        return acks

    def _spawn_fact_extraction(self, stimulus: str, response: str):
        extractor = next((self.providers[n] for n in ("ollama", "mock")
                          if n in self.providers and
                          self.providers[n].available()), None)
        task = asyncio.create_task(
            self.persona.extract_facts(stimulus, response, extractor))
        self._bg.add(task)
        task.add_done_callback(self._bg.discard)

    async def drain(self):
        if self._bg:
            await asyncio.gather(*self._bg, return_exceptions=True)
