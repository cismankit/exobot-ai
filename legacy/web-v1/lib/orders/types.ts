/** Quote → order pipeline entities — Phase D */

export type OpportunityStatus = "open" | "quoting" | "won" | "lost" | "closed";

export type QuoteStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "accepted"
  | "declined"
  | "change_requested"
  | "expired"
  | "superseded";

export type OrderStatus =
  | "draft"
  | "contracted"
  | "in_production"
  | "qa"
  | "shipped"
  | "delivered"
  | "support"
  | "cancelled";

export type MilestoneStatus = "pending" | "invoiced" | "paid" | "waived";

export type CustomerQuoteResponse = "accept" | "decline" | "request_changes";

export interface QuoteLineItem {
  id: string;
  label: string;
  description?: string;
  quantity: number;
  unitPriceUsd: number;
  totalUsd: number;
}

export interface Milestone {
  id: string;
  orderId: string;
  sequence: number;
  name: string;
  trigger: string;
  percentOfTotal: number;
  amountUsd: number;
  status: MilestoneStatus;
  dueAt?: string;
  paidAt?: string;
}

export interface Opportunity {
  id: string;
  createdAt: string;
  updatedAt: string;
  leadId: string;
  configurationId?: string;
  configurationSummary?: string;
  customerName: string;
  customerEmail: string;
  status: OpportunityStatus;
  owner?: string;
  notes?: string;
}

export interface Quote {
  id: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  opportunityId: string;
  leadId: string;
  revision: number;
  status: QuoteStatus;
  lineItems: QuoteLineItem[];
  subtotalUsd: number;
  totalUsd: number;
  currency: "USD";
  validUntil: string;
  configurationId?: string;
  configurationSummary?: string;
  customerName: string;
  customerEmail: string;
  customerResponse?: CustomerQuoteResponse;
  customerResponseAt?: string;
  customerChangeNotes?: string;
  orderId?: string;
}

export interface Order {
  id: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  quoteId: string;
  opportunityId: string;
  leadId: string;
  configurationId?: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  totalUsd: number;
  currency: "USD";
  milestones: Milestone[];
  safetyAcknowledgedAt?: string;
  safetyAckVersion?: string;
  eduSupervision?: {
    learnerAgeBand: "under-13" | "13-17" | "18-plus";
    supervisorName?: string;
    supervisorEmail?: string;
    confirmedAt: string;
  };
}

export interface OpportunityCreateInput {
  leadId: string;
  configurationId?: string;
  configurationSummary?: string;
  customerName: string;
  customerEmail: string;
  owner?: string;
  notes?: string;
}

export interface QuoteCreateInput {
  opportunityId: string;
  validDays?: number;
}

export interface QuoteUpdateInput {
  status?: QuoteStatus;
  customerResponse?: CustomerQuoteResponse;
  customerResponseAt?: string;
  customerChangeNotes?: string;
  orderId?: string;
}

export interface OrderUpdateInput {
  status?: OrderStatus;
  milestones?: Milestone[];
  safetyAcknowledgedAt?: string;
  safetyAckVersion?: string;
  eduSupervision?: Order["eduSupervision"];
}

export interface QuoteFilters {
  status?: QuoteStatus;
  opportunityId?: string;
}
