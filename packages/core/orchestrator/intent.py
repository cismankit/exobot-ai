"""
Intent extraction — the seam between language and motion.

Models are ASKED to end responses with {"intent": {...}} but real models
misbehave: markdown fences, prose after JSON, multiple JSON objects,
single quotes. This module extracts intents defensively so a malformed
model response NEVER produces malformed motion — worst case, no intent.
"""

import json
import re
from dataclasses import dataclass, field

ALLOWED_ACTIONS = {
    "gaze", "nod", "shake", "speak", "idle", "led", "face",
    "wave", "point", "drive", "stop", "estop",
}

# Actions that involve locomotion — require higher confidence & explicit params
MOTION_ACTIONS = {"drive", "wave", "point"}


@dataclass
class Intent:
    action: str
    params: dict = field(default_factory=dict)
    source_model: str = ""
    confidence: float = 0.5

    def to_wire(self) -> dict:
        return {"action": self.action, "params": self.params,
                "src": self.source_model, "conf": self.confidence}


def _find_json_blocks(text: str) -> list[str]:
    """Brace-balanced scan — handles arbitrary nesting, skips strings."""
    blocks, i, n = [], 0, len(text)
    while i < n:
        if text[i] == "{":
            depth, j, in_str, esc = 0, i, False, False
            while j < n:
                c = text[j]
                if in_str:
                    if esc:
                        esc = False
                    elif c == "\\":
                        esc = True
                    elif c == '"':
                        in_str = False
                else:
                    if c == '"':
                        in_str = True
                    elif c == "{":
                        depth += 1
                    elif c == "}":
                        depth -= 1
                        if depth == 0:
                            blocks.append(text[i:j + 1])
                            i = j
                            break
                j += 1
        i += 1
    return blocks


def extract_intents(text: str, source_model: str = "") -> tuple[str, list[Intent]]:
    """Return (clean_speech_text, intents). Never raises."""
    intents: list[Intent] = []
    clean = text

    for candidate in _find_json_blocks(text):
        obj = _try_parse(candidate)
        if obj is None:
            continue
        payload = obj.get("intent", obj if "action" in obj else None)
        if not isinstance(payload, dict):
            continue
        action = payload.get("action")
        if action not in ALLOWED_ACTIONS:
            continue
        params = payload.get("params", {})
        if not isinstance(params, dict):
            params = {}
        intents.append(Intent(
            action=action,
            params=params,
            source_model=source_model,
            confidence=float(payload.get("confidence", 0.7)),
        ))
        clean = clean.replace(candidate, "")

    # strip leftover markdown fences / whitespace from the speech text
    clean = re.sub(r"```(?:json)?\s*```", "", clean)
    clean = re.sub(r"\n{3,}", "\n\n", clean).strip()
    return clean, intents


def _try_parse(s: str):
    for attempt in (s, s.replace("'", '"')):
        try:
            obj = json.loads(attempt)
            if isinstance(obj, dict):
                return obj
        except (json.JSONDecodeError, ValueError):
            continue
    return None
