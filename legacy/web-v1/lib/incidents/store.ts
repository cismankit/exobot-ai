import type { IncidentCreateInput, IncidentReport } from "@/lib/incidents/types";
import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const INCIDENTS_FILE = path.join(DATA_DIR, "incidents.json");

let writeLock: Promise<void> = Promise.resolve();

async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeLock.then(fn, fn);
  writeLock = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readIncidents(): Promise<IncidentReport[]> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(INCIDENTS_FILE, "utf8");
    const parsed = JSON.parse(raw) as IncidentReport[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeIncidents(reports: IncidentReport[]): Promise<void> {
  await writeFile(INCIDENTS_FILE, JSON.stringify(reports, null, 2), "utf8");
}

export async function createIncidentReport(input: IncidentCreateInput): Promise<IncidentReport> {
  return withLock(async () => {
    const reports = await readIncidents();
    const report: IncidentReport = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      ...input,
      reporterEmail: input.reporterEmail.trim().toLowerCase(),
    };
    reports.unshift(report);
    await writeIncidents(reports);
    return report;
  });
}
