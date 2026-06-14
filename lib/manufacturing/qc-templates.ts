import type { BodyArchetypeSlug } from "@/lib/catalog/types";
import type { QCCheckItem, QCChecklist } from "./types";

const BASE_ITEMS: Omit<QCCheckItem, "pass">[] = [
  {
    id: "qc-estop",
    label: "E-stop test",
    description: "Emergency stop cuts all motion within 200 ms.",
  },
  {
    id: "qc-ble-pair",
    label: "BLE pair",
    description: "Unit pairs to test handset and maintains link for 60 s.",
  },
  {
    id: "qc-rom",
    label: "Range of motion",
    description: "All joints move within catalog limits for tier without binding.",
  },
  {
    id: "qc-mount-retention",
    label: "Phone mount retention",
    description: "Phone retained under 3-axis shake test per mount core spec.",
  },
  {
    id: "qc-visual",
    label: "Visual inspection",
    description: "Finish, cable routing, and assembly match work order spec sheet.",
  },
];

const BODY_EXTRA: Partial<Record<BodyArchetypeSlug, Omit<QCCheckItem, "pass">[]>> = {
  walker: [
    {
      id: "qc-walker-gait",
      label: "Gait stability (lab)",
      description: "Static pose hold and single-step lab gait without fall.",
    },
  ],
  rover: [
    {
      id: "qc-rover-drive",
      label: "Drive train test",
      description: "Wheels spin freely; encoder feedback within tolerance.",
    },
  ],
  "desk-assistant": [
    {
      id: "qc-desk-base",
      label: "Base stability",
      description: "Weighted base resists tip during full arm extension.",
    },
  ],
  "utility-helper": [
    {
      id: "qc-utility-rail",
      label: "Accessory rail torque",
      description: "T-slot rails torqued to 2.5 N·m; no play at bus taps.",
    },
  ],
};

function blankItem(item: Omit<QCCheckItem, "pass">): QCCheckItem {
  return { ...item, pass: null };
}

export function createQCChecklist(bodyTypeSlug: BodyArchetypeSlug): QCChecklist {
  const extras = BODY_EXTRA[bodyTypeSlug] ?? [];
  const items = [...BASE_ITEMS, ...extras].map(blankItem);
  return {
    bodyTypeSlug,
    items,
    overallPass: null,
  };
}

export function evaluateQCChecklist(checklist: QCChecklist): QCChecklist {
  const allTested = checklist.items.every((i) => i.pass !== null);
  const allPass = checklist.items.every((i) => i.pass === true);
  return {
    ...checklist,
    overallPass: allTested ? allPass : null,
    completedAt: allTested ? new Date().toISOString() : checklist.completedAt,
  };
}
