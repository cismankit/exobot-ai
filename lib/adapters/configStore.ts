import type { SavedConfigPayload, SavedConfigRecord } from "@/lib/types/config";
import { promises as fs } from "fs";
import path from "path";

export interface ConfigStoreResult {
  ok: true;
  id: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "saved-configs.json");

async function readRecords(): Promise<SavedConfigRecord[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as SavedConfigRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeRecords(records: SavedConfigRecord[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), "utf8");
}

/**
 * Persists saved configuration snapshots (email + config).
 * Mirrors interestStore boundary — swap for Supabase when configured.
 */
export async function persistSavedConfig(
  data: SavedConfigPayload,
): Promise<ConfigStoreResult> {
  const record: SavedConfigRecord = {
    id: data.configId,
    ...data,
  };

  const records = await readRecords();
  const existingIdx = records.findIndex((r) => r.id === record.id);
  if (existingIdx >= 0) {
    records[existingIdx] = record;
  } else {
    records.push(record);
  }

  await writeRecords(records);

  if (process.env.NODE_ENV !== "production") {
    console.info("[exobod config saved]", JSON.stringify(record, null, 2));
  } else {
    console.info("[exobod config saved]", {
      configId: record.configId,
      email: record.email,
    });
  }

  return { ok: true, id: record.id };
}

export async function getSavedConfig(
  configId: string,
): Promise<SavedConfigRecord | null> {
  const records = await readRecords();
  return records.find((r) => r.id === configId) ?? null;
}
