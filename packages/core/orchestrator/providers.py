"""
Provider adapters — Claude, OpenAI, GLM, DeepSeek, Ollama + MockProvider.

Real-world hardening vs a naive implementation:
  * availability cached with TTL (don't ping Ollama on every stimulus)
  * single retry with backoff on 429/5xx
  * per-provider timeout budgets (reflex path must stay fast)
  * MockProvider: deterministic, keyless — makes the ENTIRE pipeline
    testable end-to-end on any machine, including CI.
"""

import asyncio
import os
import time
from dataclasses import dataclass

import httpx


@dataclass
class ModelResponse:
    model: str
    text: str
    latency_ms: int
    raw: dict | None = None


class BaseProvider:
    name = "base"
    env_key = ""
    timeout_s = 45.0
    _avail_cache: tuple[float, bool] | None = None
    AVAIL_TTL = 30.0

    def available(self) -> bool:
        now = time.monotonic()
        if self._avail_cache and now - self._avail_cache[0] < self.AVAIL_TTL:
            return self._avail_cache[1]
        ok = self._check_available()
        self._avail_cache = (now, ok)
        return ok

    def _check_available(self) -> bool:
        return bool(os.getenv(self.env_key))

    async def complete(self, context: dict) -> ModelResponse:
        raise NotImplementedError

    async def _post_with_retry(self, client: httpx.AsyncClient, url: str,
                               **kw) -> httpx.Response:
        for attempt in (0, 1):
            r = await client.post(url, **kw)
            if r.status_code in (429, 500, 502, 503) and attempt == 0:
                await asyncio.sleep(1.5)
                continue
            r.raise_for_status()
            return r
        r.raise_for_status()
        return r

    @staticmethod
    def _msgs(context: dict) -> tuple[str, list[dict]]:
        return (context.get("system", ""),
                context.get("history", []) +
                [{"role": "user", "content": context.get("user", "")}])


class ClaudeProvider(BaseProvider):
    name = "claude"
    env_key = "ANTHROPIC_API_KEY"
    model_id = os.getenv("CLAUDE_MODEL", "claude-sonnet-4-6")

    async def complete(self, context: dict) -> ModelResponse:
        system, messages = self._msgs(context)
        t0 = time.monotonic()
        async with httpx.AsyncClient(timeout=self.timeout_s) as client:
            r = await self._post_with_retry(
                client, "https://api.anthropic.com/v1/messages",
                headers={"x-api-key": os.environ[self.env_key],
                         "anthropic-version": "2023-06-01"},
                json={"model": self.model_id, "max_tokens": 1024,
                      "system": system, "messages": messages},
            )
        data = r.json()
        text = "".join(b.get("text", "") for b in data.get("content", []))
        return ModelResponse(self.name, text,
                             int((time.monotonic() - t0) * 1000), data)


class OpenAICompatProvider(BaseProvider):
    base_url = ""
    model_id = ""

    async def complete(self, context: dict) -> ModelResponse:
        system, messages = self._msgs(context)
        if system:
            messages = [{"role": "system", "content": system}] + messages
        t0 = time.monotonic()
        async with httpx.AsyncClient(timeout=self.timeout_s) as client:
            r = await self._post_with_retry(
                client, f"{self.base_url}/chat/completions",
                headers={"Authorization": f"Bearer {os.environ[self.env_key]}"},
                json={"model": self.model_id, "messages": messages,
                      "max_tokens": 1024},
            )
        data = r.json()
        return ModelResponse(self.name, data["choices"][0]["message"]["content"],
                             int((time.monotonic() - t0) * 1000), data)


class OpenAIProvider(OpenAICompatProvider):
    name, env_key = "openai", "OPENAI_API_KEY"
    base_url, model_id = "https://api.openai.com/v1", os.getenv("OPENAI_MODEL", "gpt-4o")


class GLMProvider(OpenAICompatProvider):
    name, env_key = "glm", "GLM_API_KEY"
    base_url = "https://open.bigmodel.cn/api/paas/v4"
    model_id = os.getenv("GLM_MODEL", "glm-4-plus")


class DeepSeekProvider(OpenAICompatProvider):
    name, env_key = "deepseek", "DEEPSEEK_API_KEY"
    base_url = "https://api.deepseek.com/v1"
    model_id = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")


class OllamaProvider(BaseProvider):
    name = "ollama"
    timeout_s = 120.0

    def __init__(self):
        self.host = os.getenv("OLLAMA_HOST", "http://localhost:11434")
        self.model_id = os.getenv("OLLAMA_MODEL", "qwen2.5:3b")

    def _check_available(self) -> bool:
        try:
            return httpx.get(f"{self.host}/api/tags", timeout=1.5).status_code == 200
        except httpx.HTTPError:
            return False

    async def complete(self, context: dict) -> ModelResponse:
        system, messages = self._msgs(context)
        if system:
            messages = [{"role": "system", "content": system}] + messages
        t0 = time.monotonic()
        async with httpx.AsyncClient(timeout=self.timeout_s) as client:
            r = await client.post(f"{self.host}/api/chat",
                                  json={"model": self.model_id,
                                        "messages": messages, "stream": False})
            r.raise_for_status()
            data = r.json()
        return ModelResponse(self.name, data["message"]["content"],
                             int((time.monotonic() - t0) * 1000), data)


class MockProvider(BaseProvider):
    """Deterministic offline brain. Understands a few stimulus patterns and
    emits well-formed intents, so the WHOLE stack (orchestrator → intent
    extraction → transport → reflex/firmware) runs and can be tested with
    zero API keys and zero network."""
    name = "mock"

    def _check_available(self) -> bool:
        return True

    async def complete(self, context: dict) -> ModelResponse:
        user = context.get("user", "").lower()
        if "look left" in user:
            text = ('Turning to look. {"intent": {"action": "gaze", '
                    '"params": {"pan": -45, "tilt": 0}}}')
        elif "look right" in user:
            text = ('On it. {"intent": {"action": "gaze", '
                    '"params": {"pan": 45, "tilt": 0}}}')
        elif "nod" in user or "agree" in user:
            text = ('Agreed. {"intent": {"action": "nod", "params": {}}}')
        elif "whip" in user or "fast" in user:
            # deliberately unsafe request — reflex layer must clamp/refuse
            text = ('Trying. {"intent": {"action": "gaze", '
                    '"params": {"pan": 200, "tilt": -90}}}')
        elif "stop" in user:
            text = ('Stopping. {"intent": {"action": "estop", "params": {}}}')
        else:
            text = f"(mock federation) I heard: {context.get('user','')}"
        return ModelResponse(self.name, text, 1, None)


def build_providers(enabled: list[str] | None = None) -> dict[str, BaseProvider]:
    registry = {
        "claude": ClaudeProvider, "openai": OpenAIProvider,
        "glm": GLMProvider, "deepseek": DeepSeekProvider,
        "ollama": OllamaProvider, "mock": MockProvider,
    }
    names = enabled or list(registry)
    return {n: registry[n]() for n in names if n in registry}
