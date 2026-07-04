# exobod-core

The software stack behind [exobod.ai](https://exobod.ai): **your phone stays the brain, Exobod becomes the body.** A multi-model federation (Claude · ChatGPT · GLM · DeepSeek · local Ollama) speaks as one persona and drives a servo body through a safety-clamping MCU — exactly the "phone AI + Exobod app + onboard MCU with manual estop" control stack on the site, implemented.

```
 voice/text ──► Orchestrator ──► route / consensus ──► [claude|openai|glm|deepseek|ollama|mock]
                    │                                          │
                    ▼                                          ▼
              PersonaState  ◄──── one identity, one memory, one voice
                    │
                    ▼  intents (NDJSON)
             Link (zmq sim │ USB/BLE serial)
                    │
                    ▼
     ┌──────────────────────────────────┐
     │ Exobod MCU (ESP32 firmware)      │  joint limits · step clamp
     │ = reflex_sim.py, same protocol   │  heartbeat watchdog · HW estop
     └──────────────────────────────────┘
```

## Status: working end-to-end, tested

`pytest tests/` — **20/20 passing**, including live pipeline tests that boot the body simulator and verify: stimulus→actuation, unsafe commands clamped by the body (not the brain), estop latching across turns, fact memory persistence, consensus arbitration.

## Quick start (zero API keys needed)

```bash
pip install -r requirements.txt
python reflex/reflex_sim.py          # terminal 1: the body
python run.py                        # terminal 2: the brain (REPL)
```

Try: `please look left` · `whip your head around fast` (watch it clamp) · `emergency stop` then `look right` (watch it refuse). With no keys and no Ollama, the deterministic `mock` mind keeps the whole pipeline alive — add `ANTHROPIC_API_KEY` etc. and the routing chain upgrades itself automatically.

```bash
# real models
export ANTHROPIC_API_KEY=... OPENAI_API_KEY=... DEEPSEEK_API_KEY=... GLM_API_KEY=...
ollama pull qwen2.5:3b
python run.py                        # cloud + local federation
python run.py --voice                # wake word / STT / TTS (see voice/pipeline.py header)
python run.py --link serial --port /dev/ttyACM0   # real MCU
```

## Real hardware path

1. Flash `firmware/exobod_mcu/` to an ESP32-S3 (`pio run -t upload`). Wiring in the file header: PCA9685 on I2C, pan/tilt MG90S on ch0/ch1, estop button on GPIO4.
2. The firmware speaks the **identical NDJSON protocol** as `reflex_sim.py` with the **identical limits** — everything validated in sim transfers directly.
3. Safety contract in silicon: joint limits, ≤25°/command step clamp, drive speed caps, 1s heartbeat watchdog (brain silent → body neutralizes), and a hardware estop that software can trigger but **only a physical 2s button hold can release**.

## Layout
- `run.py` — single entry point (REPL / voice / serial), config-driven
- `orchestrator/` — core (routing, consensus+arbitration, dispatch), providers (5 backends + mock, retry, availability caching), persona_state (shared memory + implemented fact extraction), intent (brace-balanced defensive parser)
- `transport/` — one wire protocol over ZMQ (dev) or serial (MCU), heartbeat
- `reflex/` — body simulator, behavioral mirror of the firmware
- `firmware/exobod_mcu/` — ESP32 Arduino/PlatformIO firmware
- `voice/` — openwakeword + faster-whisper + piper, capability-detected, degrades gracefully
- `tests/` — 20 tests across the three seams that actually break
- `hardware/` — BOM + lab buildout docs

## Design laws
1. **Body-schema-first:** models emit intents; only the MCU touches motors, and it validates every intent against its own limits. The brain can never out-argue the body's constitution.
2. **One memory:** every backend reads/writes the same PersonaState — the self is the continuity, not the model.
3. **Degrade, never die:** cloud→local→mock; link down→speech-only; brain silent→body neutralizes.
