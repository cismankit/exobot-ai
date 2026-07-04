import {
  accessories,
  buildTiers,
  catalogVersion,
  finishes,
  getBOMTemplate,
  getBodyArchetypeById,
  getPhoneModelById,
  phoneModels,
  skillPacks,
} from "@/lib/catalog/products";
import type { ProductConfiguration } from "@/lib/catalog/types";
import { getFirmwareProfile } from "./firmware-profiles";
import { createQCChecklist } from "./qc-templates";
import { createSerialForOrder } from "./serial";
import { randomUUID } from "crypto";
import type { BOMLine, Order, PackagingBOM, WorkOrder } from "./types";

const SERVO_VENDOR_SKU = "SRV-MG996R-EXB";
const MCU_VENDOR_SKU = "MCU-ESP32-S3-EXB";
const FASTENER_KIT_SKU = "FST-M3-ASSY-EXB";

function bodySlugFromId(bodyArchetypeId: string): string {
  return getBodyArchetypeById(bodyArchetypeId)?.slug ?? "walker";
}

function explodeBOM(config: ProductConfiguration): BOMLine[] {
  const lines: BOMLine[] = [];
  const template = getBOMTemplate(config.bodyArchetypeId, config.tierId);
  const body = getBodyArchetypeById(config.bodyArchetypeId);
  const tier = buildTiers.find((t) => t.id === config.tierId);
  const phone = getPhoneModelById(config.phoneModelId);
  const finish = finishes.find((f) => f.id === config.finishId);
  const accessory = accessories.find((a) => a.id === config.accessoryId);
  const skillPack = skillPacks.find((s) => s.id === config.skillPackId);

  if (template) {
    for (const material of template.materials) {
      lines.push({
        sku: `MAT-${body?.slug.toUpperCase() ?? "GEN"}`,
        name: material,
        category: material.toLowerCase().includes("shell") ? "shell" : "other",
        quantity: 1,
        notes: `From BOM template ${template.id}`,
      });
    }

    const servoQty = template.servoCount.max;
    if (servoQty > 0) {
      lines.push({
        sku: "SRV-MG996R",
        name: "Digital servo (MG996R class)",
        category: "servo",
        quantity: servoQty,
        vendorSku: SERVO_VENDOR_SKU,
        notes: `Range ${template.servoCount.min}–${template.servoCount.max} per template`,
      });
      lines.push({
        sku: MCU_VENDOR_SKU,
        name: "ESP32-S3 motion controller",
        category: "mcu",
        quantity: 1,
        vendorSku: MCU_VENDOR_SKU,
      });
      lines.push({
        sku: FASTENER_KIT_SKU,
        name: "M3 fastener assortment",
        category: "fastener",
        quantity: Math.max(1, Math.ceil(servoQty / 4)),
        vendorSku: FASTENER_KIT_SKU,
      });
      if (template.materials.some((m) => m.toLowerCase().includes("lipo"))) {
        lines.push({
          sku: "BAT-LIPO-3S",
          name: "3S LiPo pack (lab tier)",
          category: "battery",
          quantity: 1,
          vendorSku: "BAT-LIPO-3S-2200",
        });
      }
    }
  }

  if (phone) {
    lines.push({
      sku: phone.sku,
      name: `${phone.name} mount core`,
      category: "mount",
      quantity: 1,
      vendorSku: phone.mountCoreId,
      notes: `Platform: ${phone.platform}`,
    });
  }

  if (finish) {
    lines.push({
      sku: finish.sku,
      name: `${finish.name} finish kit`,
      category: "finish",
      quantity: 1,
      notes: finish.engineeringSignOff ? "Engineering sign-off required" : undefined,
    });
  }

  if (accessory) {
    lines.push({
      sku: accessory.sku,
      name: accessory.name,
      category: "accessory",
      quantity: 1,
      notes: accessory.engineeringSignOff ? "Engineering sign-off required" : undefined,
    });
  }

  if (skillPack) {
    lines.push({
      sku: skillPack.sku,
      name: `${skillPack.name} skill pack (firmware bundle)`,
      category: "other",
      quantity: 1,
      notes: `Skills: ${skillPack.skills.join(", ")}`,
    });
  }

  if (body && tier) {
    lines.push({
      sku: `STL-${body.slug.toUpperCase()}-${tier.slug.toUpperCase()}`,
      name: `${body.name} shell STL package (${tier.name})`,
      category: "shell",
      quantity: 1,
      notes: "CAD/STL package from template library — v1 manual export",
    });
  }

  return lines;
}

function buildPackagingBOM(config: ProductConfiguration): PackagingBOM {
  const phone = getPhoneModelById(config.phoneModelId);
  return {
    lines: [
      { sku: "PKG-FOAM-EXB", name: "Custom foam insert", quantity: 1 },
      { sku: phone?.mountCoreId ?? "core-universal-v1", name: "Spare mount core", quantity: 1 },
      { sku: "PKG-TOOL-M3", name: "M3 hex key + spare screws", quantity: 1 },
      { sku: "PKG-QS-CARD", name: "Quickstart card (QR → companion app)", quantity: 1 },
      { sku: "PKG-BOX-EXB", name: "Exobod branded ship box", quantity: 1 },
    ],
  };
}

function buildInstructions(config: ProductConfiguration): string[] {
  const body = getBodyArchetypeById(config.bodyArchetypeId);
  const tier = buildTiers.find((t) => t.id === config.tierId);
  const slug = body?.slug ?? "walker";

  const common = [
    "Verify BOM against pinned catalog version before parts pull.",
    "Print shell STLs — inspect layer adhesion and dimensional fit on mount core.",
    "Route harness per body wiring diagram; label estop loop.",
    "Torque shoulder/hip blocks to 3.0 N·m unless template specifies otherwise.",
    "Run estop test before powering servos.",
    "Capture photo at each build station step.",
  ];

  const bodySpecific: Record<string, string[]> = {
    walker: [
      "Align hip linkage pins; verify bilateral symmetry before gait test.",
      "Set gait speed cap per firmware profile before ROM test.",
    ],
    "desk-assistant": [
      "Secure weighted base; confirm desk clamp if supplied.",
      "Limit arm extension test to firmware profile payload cap.",
    ],
    rover: [
      "Encoder harness polarity check before drive test.",
      "Wheel set balanced; verify caster orientation.",
    ],
    "utility-helper": [
      "T-slot rails torqued to 2.5 N·m.",
      "Accessory bus taps labeled before skill pack flash.",
    ],
  };

  const tierNote =
    tier?.slug === "concept-render"
      ? ["Concept render tier — no physical assembly; deliver CAD package only."]
      : tier?.slug === "prototype-shell"
        ? ["Prototype shell tier — static fit check; limited or no actuation."]
        : [];

  return [...common, ...(bodySpecific[slug] ?? []), ...tierNote];
}

export interface GenerateWorkOrderInput {
  order: Order;
}

export function generateWorkOrderFromOrder(input: GenerateWorkOrderInput): Omit<
  WorkOrder,
  "id" | "createdAt" | "updatedAt" | "serialNumber"
> {
  const { order } = input;
  const config = order.configurationSnapshot;
  const bodySlug = bodySlugFromId(config.bodyArchetypeId) as
    | "walker"
    | "desk-assistant"
    | "rover"
    | "utility-helper";
  const firmware = getFirmwareProfile(config.bodyArchetypeId, config.tierId);

  return {
    orderId: order.id,
    configurationId: order.configurationId,
    configurationSnapshot: { ...config },
    catalogVersion: order.catalogVersion,
    status: "queued",
    bomLines: explodeBOM(config),
    packagingBom: buildPackagingBOM(config),
    buildInstructions: buildInstructions(config),
    qcChecklist: createQCChecklist(bodySlug),
    firmwareProfileId: firmware.id,
  };
}

/** Seed a demo order when store is empty (dev / first-run) */
export function createDemoOrder(): Order {
  const defaultConfig: ProductConfiguration = {
    phoneModelId: "phone-iphone-15-pro",
    bodyArchetypeId: "body-walker",
    finishId: "finish-graphite-orange",
    skillPackId: "pack-companion",
    accessoryId: "acc-tray-hand",
    tierId: "tier-moving-prototype",
  };

  return {
    id: randomUUID(),
    configurationId: "CFG-DEMO-001",
    configurationSnapshot: defaultConfig,
    catalogVersion: catalogVersion.version,
    customerName: "Demo Customer",
    customerEmail: "demo@exobod.ai",
    status: "contracted",
    createdAt: new Date().toISOString(),
  };
}

export async function assignSerialToWorkOrder(
  workOrder: WorkOrder,
  order: Order,
): Promise<{ workOrder: WorkOrder; serialNumber: string }> {
  const serial = await createSerialForOrder({
    orderId: order.id,
    workOrderId: workOrder.id,
    configurationId: order.configurationId,
    configurationSnapshot: order.configurationSnapshot,
    catalogVersion: order.catalogVersion,
    firmwareProfileId: workOrder.firmwareProfileId,
  });

  return {
    serialNumber: serial.serialNumber,
    workOrder: {
      ...workOrder,
      serialNumber: serial.serialNumber,
    },
  };
}

export { phoneModels, catalogVersion };
