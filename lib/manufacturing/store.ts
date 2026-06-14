import type {
  Order,
  WorkOrder,
  WorkOrderFilters,
  WorkOrderUpdateInput,
} from "./types";
import { createDemoOrder, generateWorkOrderFromOrder } from "./work-order";
import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const WORK_ORDERS_FILE = path.join(DATA_DIR, "work-orders.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

let writeLock: Promise<void> = Promise.resolve();

async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeLock.then(fn, fn);
  writeLock = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readJsonFile<T>(file: string): Promise<T[]> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeJsonFile<T>(file: string, data: T[]): Promise<void> {
  await writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

function matchesWorkOrderFilters(wo: WorkOrder, filters?: WorkOrderFilters): boolean {
  if (!filters) return true;
  if (filters.status && wo.status !== filters.status) return false;
  if (filters.orderId && wo.orderId !== filters.orderId) return false;
  if (filters.search) {
    const q = filters.search.toLowerCase();
    const haystack = [
      wo.id,
      wo.orderId,
      wo.configurationId,
      wo.serialNumber,
      wo.assignedStation,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

const ELIGIBLE_ORDER_STATUSES = new Set(["contracted", "in_production"]);

export async function listOrders(): Promise<Order[]> {
  return readJsonFile<Order>(ORDERS_FILE);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await listOrders();
  return orders.find((o) => o.id === id) ?? null;
}

export async function ensureDemoOrder(): Promise<Order> {
  return withLock(async () => {
    let orders = await readJsonFile<Order>(ORDERS_FILE);
    if (orders.length === 0) {
      const demo = createDemoOrder();
      orders = [demo];
      await writeJsonFile(ORDERS_FILE, orders);
      return demo;
    }
    return orders[0];
  });
}

export async function listWorkOrders(filters?: WorkOrderFilters): Promise<WorkOrder[]> {
  const workOrders = await readJsonFile<WorkOrder>(WORK_ORDERS_FILE);
  return workOrders.filter((wo) => matchesWorkOrderFilters(wo, filters));
}

export async function getWorkOrderById(id: string): Promise<WorkOrder | null> {
  const workOrders = await readJsonFile<WorkOrder>(WORK_ORDERS_FILE);
  return workOrders.find((wo) => wo.id === id) ?? null;
}

export async function getWorkOrderByOrderId(orderId: string): Promise<WorkOrder | null> {
  const workOrders = await readJsonFile<WorkOrder>(WORK_ORDERS_FILE);
  return workOrders.find((wo) => wo.orderId === orderId) ?? null;
}

export async function createWorkOrderFromOrderId(orderId: string): Promise<WorkOrder> {
  return withLock(async () => {
    const orders = await readJsonFile<Order>(ORDERS_FILE);
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    if (!ELIGIBLE_ORDER_STATUSES.has(order.status)) {
      throw new Error(`Order status "${order.status}" is not eligible for work order creation`);
    }

    const workOrders = await readJsonFile<WorkOrder>(WORK_ORDERS_FILE);
    const existing = workOrders.find((wo) => wo.orderId === orderId);
    if (existing) {
      throw new Error("Work order already exists for this order");
    }

    const now = new Date().toISOString();
    const generated = generateWorkOrderFromOrder({ order });
    const workOrder: WorkOrder = {
      id: randomUUID(),
      ...generated,
      createdAt: now,
      updatedAt: now,
    };

    workOrders.unshift(workOrder);

    const orderIndex = orders.findIndex((o) => o.id === orderId);
    orders[orderIndex] = {
      ...orders[orderIndex],
      status: "in_production",
      workOrderId: workOrder.id,
    };

    await writeJsonFile(WORK_ORDERS_FILE, workOrders);
    await writeJsonFile(ORDERS_FILE, orders);

    return workOrder;
  });
}

export async function updateWorkOrder(
  id: string,
  input: WorkOrderUpdateInput,
): Promise<WorkOrder | null> {
  return withLock(async () => {
    const workOrders = await readJsonFile<WorkOrder>(WORK_ORDERS_FILE);
    const index = workOrders.findIndex((wo) => wo.id === id);
    if (index === -1) return null;

    const updated: WorkOrder = {
      ...workOrders[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    if (input.status === "shipped" && !updated.shippedAt) {
      updated.shippedAt = new Date().toISOString();
    }

    workOrders[index] = updated;
    await writeJsonFile(WORK_ORDERS_FILE, workOrders);
    return updated;
  });
}

export async function listEligibleOrders(): Promise<Order[]> {
  const orders = await readJsonFile<Order>(ORDERS_FILE);
  const workOrders = await readJsonFile<WorkOrder>(WORK_ORDERS_FILE);
  const withWorkOrder = new Set(workOrders.map((wo) => wo.orderId));

  return orders.filter(
    (o) => ELIGIBLE_ORDER_STATUSES.has(o.status) && !withWorkOrder.has(o.id),
  );
}
