"""PlatformMockProvider — the core MockProvider, extended by SUBCLASSING
(packages/core stays byte-identical) with the platform demo vocabulary:
wave / point / drive. Same contract as the original: deterministic,
keyless, instant, always emits well-formed intents that the reflex layer
still validates. Unknown phrases fall through to the core behavior.
"""

import time

from core_bridge import MockProvider
from orchestrator.providers import ModelResponse


class PlatformMockProvider(MockProvider):
    async def complete(self, context: dict) -> ModelResponse:
        user = context.get("user", "").lower()
        if "wave" in user:
            text = 'Hello there. {"intent": {"action": "wave", "params": {}}}'
        elif "point" in user:
            text = ('At that. {"intent": {"action": "point", "params": {}}}')
        elif "roll forward" in user or "drive" in user or "come here" in user:
            text = ('Rolling. {"intent": {"action": "drive", '
                    '"params": {"vx": 0.2, "wz": 0}}}')
        else:
            return await super().complete(context)
        return ModelResponse(self.name, text, 1, None)


def install_platform_mock(orchestrator) -> None:
    """Swap the core mock instance for the platform one on a built
    Orchestrator. Attribute replacement only — core code untouched."""
    if "mock" in orchestrator.providers:
        orchestrator.providers["mock"] = PlatformMockProvider()
