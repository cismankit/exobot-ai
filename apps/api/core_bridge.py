"""
Bridge into packages/core — the exobod brain, imported UNCHANGED.

The core package uses flat sibling imports internally (the same way
run.py and its test suite load it), so we replicate that sys.path setup
here once. Every other API module imports core symbols from this file,
never from the core directly. Nothing in packages/core is modified.
"""

import sys
from pathlib import Path

CORE_DIR = Path(__file__).resolve().parents[2] / "packages" / "core"
for p in (str(CORE_DIR / "orchestrator"), str(CORE_DIR)):
    if p not in sys.path:
        sys.path.insert(0, p)

from orchestrator.core import Orchestrator, TaskType, DEFAULT_ROUTES  # noqa: E402,F401
from orchestrator.persona_state import PersonaState                   # noqa: E402,F401
from orchestrator.providers import (                                  # noqa: E402,F401
    build_providers,
    ClaudeProvider,
    OpenAIProvider,
    GLMProvider,
    DeepSeekProvider,
    OllamaProvider,
    MockProvider,
)
from orchestrator.intent import ALLOWED_ACTIONS                       # noqa: E402,F401
from reflex.reflex_sim import ReflexCore, LIMITS                      # noqa: E402,F401
from transport.link import Link, ZmqLink, SerialLink, make_link       # noqa: E402,F401

DEFAULT_IDENTITY_PATH = CORE_DIR / "persona" / "identity.json"

PROVIDER_REGISTRY = {
    "claude": ClaudeProvider,
    "openai": OpenAIProvider,
    "glm": GLMProvider,
    "deepseek": DeepSeekProvider,
    "ollama": OllamaProvider,
    "mock": MockProvider,
}
