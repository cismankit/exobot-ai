import type { DbAdapter } from "@/lib/db/adapter";
import { JsonLeadStore } from "@/lib/db/json-store";

let adapter: DbAdapter | null = null;

export function getDb(): DbAdapter {
  if (!adapter) {
    adapter = new JsonLeadStore();
  }
  return adapter;
}

export type { DbAdapter } from "@/lib/db/adapter";
export type {
  Lead,
  LeadCreateInput,
  LeadFilters,
  LeadStatus,
  LeadUpdateInput,
  LeadWithSla,
} from "@/lib/db/types";
export type {
  CustomerQuoteResponse,
  Milestone,
  MilestoneStatus,
  Opportunity,
  OpportunityCreateInput,
  OpportunityStatus,
  Order,
  OrderStatus,
  OrderUpdateInput,
  Quote,
  QuoteCreateInput,
  QuoteFilters,
  QuoteLineItem,
  QuoteStatus,
  QuoteUpdateInput,
} from "@/lib/orders/types";
