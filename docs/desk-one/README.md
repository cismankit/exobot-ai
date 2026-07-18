# Desk One (EXB-D1) — Builder Kit

**Status:** invent / buy / build in parallel with software demos.  
**Not status:** product that ships, SKU you can order finished, or something to market as “available now.”

Desk One is a **desk-scale 2-DOF phone mount body**: ESP32-S3 + PCA9685 + two metal-gear servos, USB-C power, hardware e-stop, printed base + mount. The phone stays the brain; this kit is only the body and the USB NDJSON reflex path.

## What it is

| Piece | Role |
|-------|------|
| ESP32-S3 DevKit | MCU running `packages/core/firmware/exobod_mcu` |
| PCA9685 | 16-ch PWM driver for pan/tilt servos |
| 2× metal-gear micro servos | Pan (yaw) + tilt (pitch) |
| Printed base + phone cradle | Geometry you invent this weekend |
| USB serial @115200 | Same NDJSON protocol as `reflex_sim.py` |
| Hardware e-stop | Cuts / latches motion; software cannot clear |

Use it to:

1. Order parts while demos run on the laptop.
2. Print a crude mount and ballast the base.
3. Flash firmware over USB and nod a phone dummy from a serial console.
4. Validate joint limits, estop, and heartbeat behavior on real actuators.

## What it is NOT

- **Not a shipping Exobod SKU.** No fulfillment promise, no serial registry claim, no companion-app QR claim until those systems exist and pass QC.
- **Not BLE Week 1.** v0.1 is USB-CDC only. BLE pairing is a later milestone.
- **Not a Jetson / Pi brain on the desk.** The existing web + `packages/core` stack drives intents; the phone (or laptop REPL) is the mind.
- **Not production servo truth.** EVT may use MG90S clones; production-facing builds should plan for Hitec (or equivalent rated) servos — see [BOM.md](./BOM.md).
- **Not marketing copy.** See [CLAIMS.md](./CLAIMS.md) before saying anything public.

## How software sim relates to hardware

```
┌─────────────────────────────┐     identical NDJSON      ┌──────────────────────┐
│ packages/core/run.py         │ ───────────────────────► │ reflex_sim.py (ZMQ)  │
│ (orchestrator / REPL)        │                          │ soft body            │
└─────────────────────────────┘                           └──────────────────────┘
              │
              │  --link serial --port /dev/ttyACM0
              ▼
┌─────────────────────────────┐     USB @115200           ┌──────────────────────┐
│ same intents + heartbeat     │ ───────────────────────► │ exobod_mcu (ESP32)   │
│ same joint limits / clamp    │                          │ PCA9685 → servos     │
└─────────────────────────────┘                           └──────────────────────┘
```

**Contract:** limits and protocol live in the body (sim **or** MCU). The brain emits intents; it never out-argues the constitution. Behavior validated in sim is meant to transfer 1:1 over USB.

| Layer | Path | When to use |
|-------|------|-------------|
| Soft body | `python reflex/reflex_sim.py` + `python run.py` | No hardware yet |
| Hard body | Flash MCU → `python run.py --link serial --port …` | After Week 1 flash |
| Web demos | Marketing / console UI | Visualization; does not replace MCU constitution |

## Package map

| Doc | Purpose |
|-----|---------|
| [BOM.md](./BOM.md) | Buy list, 1× + 3× EVT, clone vs production |
| [WIRING.md](./WIRING.md) | ESP32 → PCA9685 → servos, e-stop, power |
| [FIRMWARE.md](./FIRMWARE.md) | Flash, pins, gaps, what to fix first |
| [WEEK1.md](./WEEK1.md) | This-weekend path (no BLE) |
| [CLAIMS.md](./CLAIMS.md) | Forbidden marketing claims until evidence |
| [PAYMENTS.md](./PAYMENTS.md) | Stripe founder reservation + env setup |

## CAD status

No checked-in CAD for Desk One yet. [WEEK1.md](./WEEK1.md) and [BOM.md](./BOM.md) describe printable geometry in words (≈170 mm base, pan yoke, tilt cradle) suitable for FreeCAD or Onshape. Treat prints as EVT fixtures, not product shells.

## Roadmap note (manufacturing)

Desk One builder kits feed learning into Phase E (work orders, QC, serial registry). Do **not** generate production work orders from this kit alone. Contracted orders + pinned catalog version remain prerequisites for real fulfillment.
