# Exobod Companion App

Phase F foundation (roadmap steps 73–86): post-delivery phone-as-face control experience.

## Features

- **Onboarding** — QR scan or manual serial entry (`EXB-YYYY-NNNN`) → claim unit via platform API
- **BLE pairing stub** — scan/connect flow with troubleshooting checklist
- **Expressive face UI** — eyes, mouth, LISTENING waveform (matches website concept)
- **Voice pipeline stub** — mic button queues intents (wave, nod, patrol, estop)
- **Motion primitives** — wave, nod, patrol, etc. mapped per body type from firmware profiles
- **Safety governor** — speed caps, BLE gate, big red E-STOP always visible
- **Skill pack display** — unlocked/locked packs from serial registry API

## Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (optional — `npx expo` works)
- Main Exobod website running for API stubs (port 3000)

## Quick start

### 1. Start the platform API (from repo root)

```bash
npm install
npm run dev
```

The companion app calls:

- `POST /api/companion/claim` — claim a unit by serial
- `GET /api/companion/unit/[serial]` — unit profile + skill packs

### 2. Install and run companion app

```bash
cd apps/companion
npm install
npm start
```

Then press:

- `w` — web (fastest for dev)
- `i` — iOS simulator
- `a` — Android emulator
- Scan QR with Expo Go on a physical device

### 3. Demo serials

Use any of these stub registry serials (first claim wins until server restart):

| Serial         | Body            |
|----------------|-----------------|
| EXB-2026-0001  | Walker          |
| EXB-2026-0002  | Rover           |
| EXB-2026-0003  | Desk Assistant  |
| EXB-2026-0004  | Utility Helper  |

## API base URL

Default: `http://localhost:3000`

For physical device testing, set in `apps/companion/.env`:

```
EXPO_PUBLIC_API_BASE=http://YOUR_LAN_IP:3000
```

Or add to `app.json` under `expo.extra.apiBaseUrl`.

## Project structure

```
apps/companion/
├── app/                    # Expo Router screens
│   ├── index.tsx           # Route guard → onboarding / BLE / face
│   ├── onboarding.tsx      # QR + serial claim
│   ├── ble-pairing.tsx     # BLE stub + troubleshooting
│   └── face.tsx            # Main control surface
├── src/
│   ├── components/         # Face, E-STOP, waveform, etc.
│   ├── lib/                # API, motion primitives, safety governor
│   └── theme/colors.ts     # Exobod brand tokens
└── README.md
```

## Roadmap alignment

| Step | Status |
|------|--------|
| 73 Companion app repo | ✅ `apps/companion/` |
| 74 Serial claim flow | ✅ onboarding + claim API |
| 75 BLE pairing | ✅ stub UI |
| 76 Expressive face | ✅ ExpressiveFace component |
| 77 Voice → intent | ✅ stub pipeline |
| 78 Motion primitives | ✅ per body type |
| 79 Safety governor | ✅ UI + checks |
| 80 Skill pack unlock | ✅ SkillPackDisplay + API |
| 81–86 OTA, telemetry, store | 🔜 post-MVP |

## Build

```bash
# Web export (static)
cd apps/companion && npx expo export --platform web

# Native (requires EAS or local toolchains)
npx expo prebuild
```

## Notes

- BLE and voice are **stubs** — no real hardware or cloud STT yet
- Claim registry is in-memory; restart Next.js dev server to reset demo serials
- E-STOP is always visible on the face screen; motion is blocked when active or BLE disconnected
