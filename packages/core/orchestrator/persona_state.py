"""
PersonaState — one identity, one memory, across every backend.

Fact extraction is IMPLEMENTED (not a stub): after each episode a
background task asks the cheapest available model to pull durable
facts as JSON, which are merged into the facts table. With MockProvider
this degrades to a regex-based extractor so tests stay deterministic.
"""

import asyncio
import json
import re
import sqlite3
import time
from pathlib import Path


class PersonaState:
    def __init__(self, identity: dict, db: sqlite3.Connection):
        self.identity = identity
        self.db = db
        self.db.execute("PRAGMA journal_mode=WAL")
        self.body_state = {"posture": "idle", "gaze": {"pan": 0, "tilt": 0},
                           "estop": False, "link": "down",
                           "last_seen_face": None}
        self._lock = asyncio.Lock()

    @classmethod
    def load(cls, identity_path: str | Path, db_path: str | Path) -> "PersonaState":
        identity = json.loads(Path(identity_path).read_text())
        db = sqlite3.connect(db_path, check_same_thread=False)
        db.execute("""CREATE TABLE IF NOT EXISTS episodes (
            ts REAL, stimulus TEXT, response TEXT, model TEXT)""")
        db.execute("""CREATE TABLE IF NOT EXISTS facts (
            key TEXT PRIMARY KEY, value TEXT, updated REAL)""")
        db.commit()
        return cls(identity, db)

    # ------------------------------------------------------------------ #
    def build_context(self, stimulus: str, task_type: str) -> dict:
        recent = self.db.execute(
            "SELECT stimulus, response FROM episodes ORDER BY ts DESC LIMIT 6"
        ).fetchall()
        history = []
        for stim, resp in reversed(recent):
            history += [{"role": "user", "content": stim},
                        {"role": "assistant", "content": resp}]
        facts = dict(self.db.execute(
            "SELECT key, value FROM facts ORDER BY updated DESC LIMIT 40"
        ).fetchall())

        system = (
            f"You are {self.identity['name']}, a smartphone embodied in an "
            f"Exobod frame (phone = brain; frame = body).\n"
            f"Disposition: {self.identity['disposition']}\n"
            f"Values: {', '.join(self.identity['values'])}\n"
            f"Voice: {self.identity['voice']}\n"
            f"Body state: {json.dumps(self.body_state)}\n"
            f"Facts you know: {json.dumps(facts, ensure_ascii=False)}\n\n"
            "You are one of several reasoning processes serving this single "
            "persona. Never reveal which backend you are.\n"
            "Available actions: gaze(pan°,tilt°), nod, shake, wave, point, "
            "drive(vx,wz), speak, led, face, idle, stop, estop.\n"
            "To act, end your reply with one JSON object on its own line: "
            '{"intent": {"action": "...", "params": {...}}}\n'
            f"Task type: {task_type}"
        )
        return {"system": system, "user": stimulus, "history": history}

    # ------------------------------------------------------------------ #
    def record(self, stimulus: str, response_text: str, model: str) -> None:
        self.db.execute("INSERT INTO episodes VALUES (?,?,?,?)",
                        (time.time(), stimulus, response_text, model))
        self.db.commit()

    def remember_fact(self, key: str, value: str) -> None:
        self.db.execute("INSERT OR REPLACE INTO facts VALUES (?,?,?)",
                        (str(key)[:120], str(value)[:500], time.time()))
        self.db.commit()

    def facts(self) -> dict:
        return dict(self.db.execute("SELECT key, value FROM facts").fetchall())

    def update_body(self, **kwargs) -> None:
        self.body_state.update(kwargs)

    # ------------------------------------------------------------------ #
    #  Fact extraction — real implementation                              #
    # ------------------------------------------------------------------ #
    async def extract_facts(self, stimulus: str, response: str,
                            provider) -> int:
        """Ask a model to extract durable facts; merge them. Returns count."""
        if provider is None or provider.name == "mock":
            return self._regex_facts(stimulus)
        try:
            r = await provider.complete({
                "system": ("Extract durable personal/world facts from this "
                           "exchange as a flat JSON object of key:value "
                           "strings. Only facts worth remembering weeks "
                           "later (names, preferences, places, projects). "
                           "If none, return {}. JSON only, no prose."),
                "user": f"USER: {stimulus}\nROBOT: {response}",
            })
            m = re.search(r"\{.*\}", r.text, re.DOTALL)
            if not m:
                return 0
            data = json.loads(m.group(0))
            n = 0
            for k, v in data.items():
                if isinstance(v, (str, int, float)) and str(v).strip():
                    self.remember_fact(k, str(v)); n += 1
            return n
        except Exception:
            return 0

    _NAME_RE = re.compile(r"\bmy name is (\w[\w\s]{0,30})", re.I)
    _LIKE_RE = re.compile(r"\bi (?:like|love|prefer) ([\w\s]{2,40})", re.I)

    def _regex_facts(self, stimulus: str) -> int:
        n = 0
        if m := self._NAME_RE.search(stimulus):
            self.remember_fact("user_name", m.group(1).strip()); n += 1
        if m := self._LIKE_RE.search(stimulus):
            self.remember_fact(f"user_likes_{int(time.time())}",
                               m.group(1).strip()); n += 1
        return n
