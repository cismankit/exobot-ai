"""
Reflex simulator — bit-for-bit behavioral mirror of the ESP32 firmware.

Same protocol, same limits, same clamping and estop semantics, so
everything you validate here holds when you flash the real MCU.
Run:  python reflex/reflex_sim.py
"""

import json
import time

# ---- The body's constitution (KEEP IN SYNC with firmware/config.h) ---- #
LIMITS = {
    "pan": (-80.0, 80.0), "tilt": (-30.0, 45.0),
    "max_step_deg": 25.0,            # per intent, servo whip protection
    "drive_vx_max": 0.25,            # m/s — desk-safe
    "drive_wz_max": 1.0,             # rad/s
    "hb_timeout_s": 1.0,
}
ALLOWED = {"gaze", "nod", "shake", "speak", "idle", "led", "face",
           "wave", "point", "drive", "stop", "estop"}


class ReflexCore:
    """Pure logic — shared by the zmq server below and by unit tests."""

    def __init__(self):
        self.pose = {"pan": 0.0, "tilt": 0.0}
        self.drive = {"vx": 0.0, "wz": 0.0}
        self.estopped = False
        self.last_hb = time.monotonic()
        self.vbat = 7.9

    # ------------------------------------------------------------------ #
    def handle(self, msg: dict) -> dict:
        t = msg.get("t")
        if t == "hb":
            self.last_hb = time.monotonic()
            return {"t": "ack", "executed": True, "reason": "hb",
                    "pose": self.pose, "vbat": self.vbat,
                    "estop": self.estopped}
        if t == "estop":
            return self._do_estop("remote estop")
        if t == "intent":
            self._check_hb()
            return self._execute(msg)
        return {"t": "ack", "executed": False, "reason": f"unknown type {t}"}

    def _check_hb(self):
        if time.monotonic() - self.last_hb > LIMITS["hb_timeout_s"]:
            self._neutralize()

    def _do_estop(self, reason: str) -> dict:
        self.estopped = True
        self._neutralize()
        return {"t": "ack", "executed": True, "reason": reason,
                "pose": self.pose, "estop": True}

    def _neutralize(self):
        self.drive = {"vx": 0.0, "wz": 0.0}
        # servos hold last pose (no torque snap); motion commands blocked

    # ------------------------------------------------------------------ #
    def _execute(self, msg: dict) -> dict:
        action = msg.get("action")
        p = msg.get("params", {}) or {}

        if action == "estop":
            return self._do_estop("intent estop")
        if action not in ALLOWED:
            return self._nack(f"unknown action '{action}'")
        if self.estopped and action not in ("stop", "idle", "speak",
                                            "led", "face"):
            return self._nack("estopped — motion locked (send estop reset "
                              "via physical button only)")

        if action == "gaze":
            return self._gaze(p)
        if action in ("nod", "shake", "wave", "point"):
            # canned gestures run within the same joint limits by design
            return self._ack(f"gesture:{action}")
        if action == "drive":
            return self._drive(p)
        if action in ("stop", "idle"):
            self._neutralize()
            return self._ack("stopped")
        if action in ("speak", "led", "face"):
            return self._ack(f"expr:{action}:{str(p)[:60]}")
        return self._nack("unhandled")

    def _gaze(self, p: dict) -> dict:
        try:
            pan_req = float(p.get("pan", self.pose["pan"]))
            tilt_req = float(p.get("tilt", self.pose["tilt"]))
        except (TypeError, ValueError):
            return self._nack("non-numeric gaze params")

        pan_t = _clamp(pan_req, *LIMITS["pan"])
        tilt_t = _clamp(tilt_req, *LIMITS["tilt"])
        # whip protection: bounded step toward target, never a jump
        pan_new = _step(self.pose["pan"], pan_t, LIMITS["max_step_deg"])
        tilt_new = _step(self.pose["tilt"], tilt_t, LIMITS["max_step_deg"])
        clamped = (pan_new != pan_req) or (tilt_new != tilt_req)
        self.pose = {"pan": round(pan_new, 1), "tilt": round(tilt_new, 1)}
        return self._ack("clamped" if clamped else "ok")

    def _drive(self, p: dict) -> dict:
        try:
            vx = _clamp(float(p.get("vx", 0)), -LIMITS["drive_vx_max"],
                        LIMITS["drive_vx_max"])
            wz = _clamp(float(p.get("wz", 0)), -LIMITS["drive_wz_max"],
                        LIMITS["drive_wz_max"])
        except (TypeError, ValueError):
            return self._nack("non-numeric drive params")
        self.drive = {"vx": vx, "wz": wz}
        return self._ack("driving")

    def _ack(self, reason: str) -> dict:
        return {"t": "ack", "executed": True, "reason": reason,
                "pose": self.pose, "drive": self.drive,
                "vbat": self.vbat, "estop": self.estopped}

    def _nack(self, reason: str) -> dict:
        return {"t": "ack", "executed": False, "reason": reason,
                "pose": self.pose, "estop": self.estopped}


def _clamp(v, lo, hi):
    return max(lo, min(hi, v))


def _step(cur, target, max_step):
    d = target - cur
    return cur + max(-max_step, min(max_step, d))


def serve(endpoint: str = "tcp://*:5555"):
    import zmq
    ctx = zmq.Context()
    sock = ctx.socket(zmq.REP)
    sock.bind(endpoint)
    core = ReflexCore()
    print(f"[reflex-sim] body online at {endpoint} "
          f"(limits: pan±80° tilt -30/+45° step≤25°)")
    while True:
        try:
            msg = json.loads(sock.recv_string())
        except json.JSONDecodeError:
            sock.send_string(json.dumps(
                {"t": "ack", "executed": False, "reason": "bad json"}))
            continue
        reply = core.handle(msg)
        sock.send_string(json.dumps(reply))
        if msg.get("t") == "intent":
            print(f"[reflex-sim] {msg.get('action')}({msg.get('params')}) "
                  f"-> {reply['reason']} pose={reply.get('pose')}")


if __name__ == "__main__":
    serve()
