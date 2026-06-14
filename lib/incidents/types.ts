export type IncidentSeverity = "low" | "medium" | "high" | "urgent";

export type IncidentCategory =
  | "injury"
  | "near_miss"
  | "hardware_failure"
  | "software_bug"
  | "privacy"
  | "other";

export interface IncidentReport {
  id: string;
  createdAt: string;
  reporterName: string;
  reporterEmail: string;
  serialNumber?: string;
  orderToken?: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  description: string;
  occurredAt?: string;
  region?: string;
}

export interface IncidentCreateInput {
  reporterName: string;
  reporterEmail: string;
  serialNumber?: string;
  orderToken?: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  description: string;
  occurredAt?: string;
  region?: string;
}
