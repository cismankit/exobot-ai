import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type EarlyOrderStatus = "pending" | "paid" | "canceled" | "refunded";

export interface EarlyOrder {
  id: string;
  email: string;
  name?: string;
  product: "desk-one";
  sku: "EXB-D1";
  amountCents: number;
  currency: "usd";
  status: EarlyOrderStatus;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  paidAt?: string;
  updatedAt: string;
  source?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "early-orders.json");

let writeLock: Promise<void> = Promise.resolve();

async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeLock.then(fn, fn);
  writeLock = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readAll(): Promise<EarlyOrder[]> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as EarlyOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(orders: EarlyOrder[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(FILE, JSON.stringify(orders, null, 2), "utf8");
}

export async function createEarlyOrder(input: {
  email: string;
  name?: string;
  amountCents: number;
  source?: string;
}): Promise<EarlyOrder> {
  return withLock(async () => {
    const orders = await readAll();
    const now = new Date().toISOString();
    const order: EarlyOrder = {
      id: randomUUID(),
      email: input.email.trim().toLowerCase(),
      name: input.name?.trim() || undefined,
      product: "desk-one",
      sku: "EXB-D1",
      amountCents: input.amountCents,
      currency: "usd",
      status: "pending",
      createdAt: now,
      updatedAt: now,
      source: input.source,
    };
    orders.push(order);
    await writeAll(orders);
    return order;
  });
}

export async function attachStripeSession(
  orderId: string,
  stripeSessionId: string,
): Promise<EarlyOrder | null> {
  return withLock(async () => {
    const orders = await readAll();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx < 0) return null;
    const now = new Date().toISOString();
    orders[idx] = {
      ...orders[idx],
      stripeSessionId,
      updatedAt: now,
    };
    await writeAll(orders);
    return orders[idx];
  });
}

export async function markEarlyOrderPaid(input: {
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  email?: string;
  name?: string;
  amountCents?: number;
  earlyOrderId?: string;
}): Promise<EarlyOrder> {
  return withLock(async () => {
    const orders = await readAll();
    let idx = orders.findIndex((o) => o.stripeSessionId === input.stripeSessionId);
    if (idx < 0 && input.earlyOrderId) {
      idx = orders.findIndex((o) => o.id === input.earlyOrderId);
    }
    const now = new Date().toISOString();

    if (idx < 0) {
      // Upsert when checkout ran on another instance (ephemeral FS on Vercel).
      const order: EarlyOrder = {
        id: input.earlyOrderId || randomUUID(),
        email: (input.email ?? "unknown@exobod.ai").trim().toLowerCase(),
        name: input.name?.trim() || undefined,
        product: "desk-one",
        sku: "EXB-D1",
        amountCents: input.amountCents ?? 9900,
        currency: "usd",
        status: "paid",
        stripeSessionId: input.stripeSessionId,
        stripePaymentIntentId: input.stripePaymentIntentId,
        createdAt: now,
        paidAt: now,
        updatedAt: now,
        source: "webhook-upsert",
      };
      orders.push(order);
      await writeAll(orders);
      return order;
    }

    if (orders[idx].status === "paid") return orders[idx];
    orders[idx] = {
      ...orders[idx],
      status: "paid",
      paidAt: now,
      updatedAt: now,
      stripeSessionId: input.stripeSessionId,
      stripePaymentIntentId: input.stripePaymentIntentId ?? orders[idx].stripePaymentIntentId,
      email: input.email?.trim().toLowerCase() || orders[idx].email,
      name: input.name?.trim() || orders[idx].name,
      amountCents: input.amountCents ?? orders[idx].amountCents,
    };
    await writeAll(orders);
    return orders[idx];
  });
}

export async function markEarlyOrderCanceled(stripeSessionId: string): Promise<EarlyOrder | null> {
  return withLock(async () => {
    const orders = await readAll();
    const idx = orders.findIndex((o) => o.stripeSessionId === stripeSessionId);
    if (idx < 0) return null;
    if (orders[idx].status === "paid") return orders[idx];
    const now = new Date().toISOString();
    orders[idx] = { ...orders[idx], status: "canceled", updatedAt: now };
    await writeAll(orders);
    return orders[idx];
  });
}

export async function findEarlyOrderBySessionId(
  stripeSessionId: string,
): Promise<EarlyOrder | null> {
  const orders = await readAll();
  return orders.find((o) => o.stripeSessionId === stripeSessionId) ?? null;
}

export async function listEarlyOrders(): Promise<EarlyOrder[]> {
  const orders = await readAll();
  return orders.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
