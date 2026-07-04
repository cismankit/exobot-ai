import type { Lead, LeadCreateInput, LeadFilters, LeadUpdateInput } from "@/lib/db/types";
import type {
  Opportunity,
  OpportunityCreateInput,
  Order,
  OrderUpdateInput,
  Quote,
  QuoteCreateInput,
  QuoteFilters,
  QuoteUpdateInput,
} from "@/lib/orders/types";

export interface DbAdapter {
  createLead(input: LeadCreateInput): Promise<Lead>;
  findLeadById(id: string): Promise<Lead | null>;
  findRecentLeadByEmail(email: string, withinDays: number): Promise<Lead | null>;
  updateLead(id: string, input: LeadUpdateInput): Promise<Lead | null>;
  listLeads(filters?: LeadFilters): Promise<Lead[]>;

  createOpportunity(input: OpportunityCreateInput): Promise<Opportunity>;
  findOpportunityById(id: string): Promise<Opportunity | null>;
  findOpportunityByLeadId(leadId: string): Promise<Opportunity | null>;
  updateOpportunity(
    id: string,
    patch: Partial<Pick<Opportunity, "status" | "owner" | "notes">>,
  ): Promise<Opportunity | null>;
  listOpportunities(): Promise<Opportunity[]>;

  createQuote(input: QuoteCreateInput): Promise<Quote | null>;
  findQuoteById(id: string): Promise<Quote | null>;
  findQuoteByToken(token: string): Promise<Quote | null>;
  updateQuote(id: string, patch: QuoteUpdateInput): Promise<Quote | null>;
  listQuotes(filters?: QuoteFilters): Promise<Quote[]>;

  createOrderFromQuote(quote: Quote): Promise<Order>;
  findOrderById(id: string): Promise<Order | null>;
  findOrderByToken(token: string): Promise<Order | null>;
  findOrderByQuoteId(quoteId: string): Promise<Order | null>;
  updateOrder(id: string, patch: OrderUpdateInput): Promise<Order | null>;
  listOrders(): Promise<Order[]>;
}
