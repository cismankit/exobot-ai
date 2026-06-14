const COUNTER_KEY = "exobod-cfg-counter";

function readCounter(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(COUNTER_KEY);
    return raw ? Number.parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function writeCounter(n: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(COUNTER_KEY, String(n));
  } catch {
    // ignore
  }
}

/** Client-side CFG-YYYY-NNNN id; counter persists in localStorage. */
export function generateConfigId(): string {
  const year = new Date().getFullYear();
  const next = readCounter() + 1;
  writeCounter(next);
  return `CFG-${year}-${String(next).padStart(4, "0")}`;
}

export function isValidConfigId(id: string): boolean {
  return /^CFG-\d{4}-\d{4}$/.test(id);
}
