import type { Milestone } from "@/lib/orders/types";
import { randomUUID } from "crypto";

/** Default milestone schedule: deposit 40%, mid 40%, final 20% */
const DEFAULT_SCHEDULE = [
  { sequence: 1, name: "Deposit", trigger: "Quote accepted / SOW signed", percentOfTotal: 40 },
  { sequence: 2, name: "Mid build", trigger: "Build start / parts ordered", percentOfTotal: 40 },
  { sequence: 3, name: "Final", trigger: "Pre-ship QC pass", percentOfTotal: 20 },
] as const;

export function buildMilestoneSchedule(orderId: string, totalUsd: number): Milestone[] {
  return DEFAULT_SCHEDULE.map((m) => ({
    id: randomUUID(),
    orderId,
    sequence: m.sequence,
    name: m.name,
    trigger: m.trigger,
    percentOfTotal: m.percentOfTotal,
    amountUsd: Math.round((totalUsd * m.percentOfTotal) / 100),
    status: "pending" as const,
  }));
}

/** Next milestone eligible for payment (pending or invoiced, lowest sequence first). */
export function getNextUnpaidMilestone(milestones: Milestone[]): Milestone | null {
  return (
    milestones
      .filter((m) => m.status === "pending" || m.status === "invoiced")
      .sort((a, b) => a.sequence - b.sequence)[0] ?? null
  );
}
