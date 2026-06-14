export type LeadStatus =
  | "new"
  | "triaged"
  | "qualified"
  | "quoted"
  | "won"
  | "lost"
  | "spam";

export interface Lead {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  bodyType: string;
  useCase: string;
  budget: string;
  message?: string;
  configurationSummary?: string;
  configurationId?: string;
  status: LeadStatus;
  owner?: string;
  internalNotes?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  affiliateRef?: string;
  referrer?: string;
  sourcePage?: string;
}

export interface LeadCreateInput {
  name: string;
  email: string;
  phone?: string;
  bodyType: string;
  useCase: string;
  budget: string;
  message?: string;
  configurationSummary?: string;
  configurationId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  affiliateRef?: string;
  referrer?: string;
  sourcePage?: string;
}

export interface LeadUpdateInput {
  status?: LeadStatus;
  owner?: string;
  internalNotes?: string;
  phone?: string;
  bodyType?: string;
  useCase?: string;
  budget?: string;
  message?: string;
  configurationSummary?: string;
  configurationId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  affiliateRef?: string;
  referrer?: string;
  sourcePage?: string;
}

export interface LeadFilters {
  status?: LeadStatus;
  owner?: string;
  search?: string;
}

export interface LeadWithSla extends Lead {
  isOverdue24h: boolean;
  isOverdue72h: boolean;
}
