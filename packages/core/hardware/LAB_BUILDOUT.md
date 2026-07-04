# RobotBod Lab Buildout — Machines & Phasing

## Reality check on "printing chips"

Silicon ICs cannot be fabricated outside a semiconductor fab — no desktop machine does this. What IS achievable in a home lab, in ascending order of investment:

1. **Order fabricated + assembled PCBs** (JLCPCB, PCBWay): $5–30/board, ~1 week, including SMT assembly of your chips. This is what 95% of hardware startups do through prototyping. **Start here.**
2. **Mill PCBs in-lab** for same-day iteration: Carvera Air (~$2,000) or Bantam Tools (~$3,500). Single/double-sided, you hand-solder components.
3. **Print conductive-ink PCBs**: Voltera V-One (~$4,500). Fast but trace resolution and durability are worse than milling. Niche.
4. **Custom silicon** (much later, if ever): TinyTapeout / Efabless chipIgnite shuttle runs — you design the chip, a real fab prints it, ~$300–10K depending on program. This is the actual path to "our own chip."

## Lab phases

### Phase 1 — Prototype bench (~$1,100–1,300) — buy now
| Machine/Tool | Model | Price |
|---|---|---|
| FDM 3D printer | Bambu Lab P1S (enclosed — needed for PETG/ABS) | ~$600 |
| Soldering station | Pinecil v2 + stand, or Hakko FX-888D | $40–130 |
| Hot air rework | Quick 861DW clone / Atten | $60–120 |
| Multimeter | Aneng/Uni-T mid-range | $30 |
| Bench power supply | 30V/10A adjustable | $60 |
| Filament dryer | Sunlu S2 | $40 |
| Consumables | Filament (PETG, PLA+), solder, flux, wick, IPA, heat-set inserts, tip set | $120 |
| Hand tools | Flush cutters, precision drivers, deburring tool, calipers (digital) | $60 |

### Phase 2 — Finishing & quality (~$700–1,000) — after first assembled body
| Machine/Tool | Model | Price |
|---|---|---|
| Resin printer | Elegoo Mars 5 Ultra | ~$250 |
| Wash & cure station | Elegoo Mercury | ~$100 |
| Airbrush + compressor | For primer/paint on shells | ~$120 |
| Oscilloscope | Rigol DHO804 / FNIRSI (budget) | $150–350 |
| Rotary tool + sanding kit | Dremel or clone | $60 |
| Ventilation | Fume extractor + resin printing in ventilated space — non-negotiable | $80 |

### Phase 3 — Iteration speed (~$2,000–3,000) — only when PCB turnaround becomes the bottleneck
| Machine | Price |
|---|---|
| Carvera Air desktop CNC (PCB milling + aluminum parts) | ~$2,000 |
| Reflow hotplate + stencil jig (in-lab SMT) | ~$150 |
| Logic analyzer (8ch) | $30 |

## Space & safety
- Separate zones: printing / soldering / assembly. Resin gets its own ventilated corner with nitrile gloves always.
- Fire: ABC extinguisher near printers; never print unattended overnight until you trust the machine.
- ESD mat + wrist strap at the electronics bench ($25).

## Suppliers
- PCBs: JLCPCB (cheapest, parts library), PCBWay (better for odd stackups)
- Components: LCSC (pairs with JLCPCB), DigiKey/Mouser (everything, fast), AliExpress (modules, 2–4wk)
- Mechanical: McMaster-Carr (US), Misumi (precision), Amazon (fasteners kits)
