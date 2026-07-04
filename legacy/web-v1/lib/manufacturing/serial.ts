import type { ProductConfiguration } from "@/lib/catalog/types";
import type { SerialRegistryEntry } from "./types";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SERIAL_FILE = path.join(DATA_DIR, "serial-registry.json");

let writeLock: Promise<void> = Promise.resolve();

async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeLock.then(fn, fn);
  writeLock = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readRegistry(): Promise<SerialRegistryEntry[]> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(SERIAL_FILE, "utf8");
    const parsed = JSON.parse(raw) as SerialRegistryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeRegistry(entries: SerialRegistryEntry[]): Promise<void> {
  await writeFile(SERIAL_FILE, JSON.stringify(entries, null, 2), "utf8");
}

/** Format: EXB-YYYY-NNNN — sequential per calendar year */
export async function generateSerialNumber(): Promise<string> {
  return withLock(async () => {
    const entries = await readRegistry();
    const year = new Date().getFullYear();
    const prefix = `EXB-${year}-`;

    const yearEntries = entries.filter((e) => e.serialNumber.startsWith(prefix));
    const maxSeq = yearEntries.reduce((max, e) => {
      const seq = parseInt(e.serialNumber.slice(prefix.length), 10);
      return Number.isFinite(seq) && seq > max ? seq : max;
    }, 0);

    const next = String(maxSeq + 1).padStart(4, "0");
    return `${prefix}${next}`;
  });
}

export async function registerSerial(entry: SerialRegistryEntry): Promise<SerialRegistryEntry> {
  return withLock(async () => {
    const entries = await readRegistry();
    if (entries.some((e) => e.serialNumber === entry.serialNumber)) {
      throw new Error(`Serial ${entry.serialNumber} already registered`);
    }
    entries.push(entry);
    await writeRegistry(entries);
    return entry;
  });
}

export async function getSerialByNumber(
  serialNumber: string,
): Promise<SerialRegistryEntry | null> {
  const entries = await readRegistry();
  return entries.find((e) => e.serialNumber === serialNumber) ?? null;
}

export async function getSerialByOrderId(orderId: string): Promise<SerialRegistryEntry | null> {
  const entries = await readRegistry();
  return entries.find((e) => e.orderId === orderId) ?? null;
}

export async function listSerialRegistry(): Promise<SerialRegistryEntry[]> {
  return readRegistry();
}

export interface SerialRegistrationInput {
  orderId: string;
  workOrderId: string;
  configurationId: string;
  configurationSnapshot: ProductConfiguration;
  catalogVersion: string;
  firmwareProfileId: string;
}

export async function createSerialForOrder(
  input: SerialRegistrationInput,
): Promise<SerialRegistryEntry> {
  const serialNumber = await generateSerialNumber();
  const entry: SerialRegistryEntry = {
    serialNumber,
    ...input,
    createdAt: new Date().toISOString(),
  };
  return registerSerial(entry);
}
