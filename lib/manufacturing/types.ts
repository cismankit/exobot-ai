import type { BodyArchetypeSlug, ProductConfiguration } from "@/lib/catalog/types";

/** Work order pipeline status — admin list view */
export type WorkOrderStatus =
  | "queued"
  | "printing"
  | "assembly"
  | "qc"
  | "ready"
  | "shipped";

export type BOMLineCategory =
  | "shell"
  | "servo"
  | "mcu"
  | "fastener"
  | "battery"
  | "accessory"
  | "finish"
  | "mount"
  | "packaging"
  | "other";

export interface BOMLine {
  sku: string;
  name: string;
  category: BOMLineCategory;
  quantity: number;
  vendorSku?: string;
  notes?: string;
}

export interface QCCheckItem {
  id: string;
  label: string;
  description?: string;
  /** null = not yet tested */
  pass: boolean | null;
  notes?: string;
  testedAt?: string;
}

export interface QCChecklist {
  bodyTypeSlug: BodyArchetypeSlug;
  items: QCCheckItem[];
  overallPass: boolean | null;
  completedAt?: string;
  completedBy?: string;
}

export interface SerialRegistryEntry {
  serialNumber: string;
  orderId: string;
  workOrderId: string;
  configurationId: string;
  configurationSnapshot: ProductConfiguration;
  catalogVersion: string;
  firmwareProfileId: string;
  manufacturedAt?: string;
  shippedAt?: string;
  createdAt: string;
}

export interface PackagingBOMLine {
  sku: string;
  name: string;
  quantity: number;
}

export interface PackagingBOM {
  lines: PackagingBOMLine[];
}

export interface WorkOrder {
  id: string;
  orderId: string;
  configurationId: string;
  configurationSnapshot: ProductConfiguration;
  catalogVersion: string;
  status: WorkOrderStatus;
  serialNumber?: string;
  bomLines: BOMLine[];
  packagingBom: PackagingBOM;
  buildInstructions: string[];
  qcChecklist: QCChecklist;
  firmwareProfileId: string;
  assignedStation?: string;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
}

/** Minimal order entity for Phase D → E handoff */
export type OrderStatus =
  | "contracted"
  | "in_production"
  | "qa"
  | "shipped"
  | "delivered";

export interface Order {
  id: string;
  leadId?: string;
  configurationId: string;
  configurationSnapshot: ProductConfiguration;
  catalogVersion: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  workOrderId?: string;
  createdAt: string;
}

export interface WorkOrderFilters {
  status?: WorkOrderStatus;
  orderId?: string;
  search?: string;
}

export interface WorkOrderUpdateInput {
  status?: WorkOrderStatus;
  assignedStation?: string;
  qcChecklist?: QCChecklist;
  serialNumber?: string;
  shippedAt?: string;
}
