# RobotBod ONE — v1 Desktop Toy: Bill of Materials

Target: expressive desktop head/torso unit, local model on-device, cloud federation over WiFi. Prices approximate (July 2026, USD); verify current pricing before ordering.

## Compute (pick one path)

| Item | Price | Notes |
|---|---|---|
| **Path A: Jetson Orin Nano Super Dev Kit** | $249 | 67 TOPS. Runs 7–8B quantized models locally at usable speed. The serious choice — buy this. |
| Path B: Raspberry Pi 5 (8GB) + active cooler | ~$95 | Runs 1–3B models only. Fine for reflex layer; deliberation stays cloud. |
| microSD 128GB (A2) or NVMe SSD 256GB | $15–30 | NVMe strongly preferred on both platforms |

## Sensors & Expression

| Item | Price | Notes |
|---|---|---|
| Camera: Pi Camera Module 3 (wide) or IMX219 CSI cam | $25–35 | Face detection feeds the gaze reflex |
| ReSpeaker 2-Mic HAT (or USB conference mic) | $12–25 | Wake word + direction of arrival |
| GC9A01 1.28" round LCD ×2 (eyes) | $18 | SPI, animatable pupils — huge expressiveness per dollar |
| Speaker 3W + MAX98357A I2S amp | $10 | Piper TTS output |
| IMU: MPU6050 | $4 | Knows when it's picked up/tilted — grounding data |
| Time-of-flight: VL53L0X | $6 | "Someone is close" reflex |

## Actuation

| Item | Price | Notes |
|---|---|---|
| MG90S metal-gear servos ×3 (pan, tilt, nod) | $15 | Metal gear — SG90 plastic strips fast |
| PCA9685 16-ch PWM driver | $6 | Clean servo control off the main board |
| 5V 4A PSU + buck converter (servos on separate rail) | $18 | Servos on the compute rail = brownouts. Don't. |

## Fasteners & Wiring

| Item | Price |
|---|---|
| M2/M2.5/M3 screw + heat-set insert assortment | $20 |
| Dupont/JST jumper kit, silicone wire 22–26AWG | $15 |
| Slip ring 6-wire (if head rotates >180°) — optional | $12 |

**v1 subtotal: ~$380–450 (Jetson path) / ~$230–290 (Pi path)**

## Body — fully 3D printed

Print plan (design in Fusion 360 or Onshape, both free tiers):

| Part | Material | Notes |
|---|---|---|
| Head shell (2-piece, front/back) | PETG | Heat-set inserts for eye displays |
| Neck gimbal (pan base + tilt bracket) | PETG or PC blend | Load-bearing; 40%+ infill |
| Torso/base shell | PLA+ | Weighted base plate cavity (fill with steel BBs + epoxy) |
| Servo horns adapters, cable clips | PETG | |
| Face bezel / cosmetic ring | Resin | Post v1 — surface quality |

Design rules that will save you weeks: 0.2mm clearance on mating parts, no printed threads (heat-set inserts everywhere), split shells on natural seam lines, design cable channels before printing, print a servo-mount test coupon first.
