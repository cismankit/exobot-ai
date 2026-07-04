import type { DbAdapter } from "@/lib/db/adapter";
import { JsonOrderStore } from "@/lib/db/order-json-store";
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
import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

let writeLock: Promise<void> = Promise.resolve();

async function ensureStore(): Promise<Lead[]> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(LEADS_FILE, "utf8");
    const parsed = JSON.parse(raw) as Lead[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeLock.then(fn, fn);
  writeLock = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function matchesFilters(lead: Lead, filters?: LeadFilters): boolean {
  if (!filters) return true;
  if (filters.status && lead.status !== filters.status) return false;
  if (filters.owner && lead.owner !== filters.owner) return false;
  if (filters.search) {
    const q = filters.search.toLowerCase();
    const haystack = [lead.name, lead.email, lead.phone, lead.message, lead.configurationSummary]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

export class JsonLeadStore implements DbAdapter {
  private orders = new JsonOrderStore();

  createOpportunity(input: OpportunityCreateInput): Promise<Opportunity> {
    return this.orders.createOpportunity(input);
  }

  findOpportunityById(id: string): Promise<Opportunity | null> {
    return this.orders.findOpportunityById(id);
  }

  findOpportunityByLeadId(leadId: string): Promise<Opportunity | null> {
    return this.orders.findOpportunityByLeadId(leadId);
  }

  updateOpportunity(
    id: string,
    patch: Partial<Pick<Opportunity, "status" | "owner" | "notes">>,
  ): Promise<Opportunity | null> {
    return this.orders.updateOpportunity(id, patch);
  }

  listOpportunities(): Promise<Opportunity[]> {
    return this.orders.listOpportunities();
  }

  createQuote(input: QuoteCreateInput): Promise<Quote | null> {
    return this.orders.createQuote(input);
  }

  findQuoteById(id: string): Promise<Quote | null> {
    return this.orders.findQuoteById(id);
  }

  findQuoteByToken(token: string): Promise<Quote | null> {
    return this.orders.findQuoteByToken(token);
  }

  updateQuote(id: string, patch: QuoteUpdateInput): Promise<Quote | null> {
    return this.orders.updateQuote(id, patch);
  }

  listQuotes(filters?: QuoteFilters): Promise<Quote[]> {
    return this.orders.listQuotes(filters);
  }

  createOrderFromQuote(quote: Quote): Promise<Order> {
    return this.orders.createOrderFromQuote(quote);
  }

  findOrderById(id: string): Promise<Order | null> {
    return this.orders.findOrderById(id);
  }

  findOrderByToken(token: string): Promise<Order | null> {
    return this.orders.findOrderByToken(token);
  }

  findOrderByQuoteId(quoteId: string): Promise<Order | null> {
    return this.orders.findOrderByQuoteId(quoteId);
  }

  updateOrder(id: string, patch: OrderUpdateInput): Promise<Order | null> {
    return this.orders.updateOrder(id, patch);
  }

  listOrders(): Promise<Order[]> {
    return this.orders.listOrders();
  }

  async createLead(input: LeadCreateInput): Promise<Lead> {
    return withLock(async () => {
      const leads = await ensureStore();
      const lead: Lead = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        status: "new",
        ...input,
        email: normalizeEmail(input.email),
      };
      leads.unshift(lead);
      await writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf8");
      return lead;
    });
  }

  async findLeadById(id: string): Promise<Lead | null> {
    const leads = await ensureStore();
    return leads.find((l) => l.id === id) ?? null;
  }

  async findRecentLeadByEmail(email: string, withinDays: number): Promise<Lead | null> {
    const leads = await ensureStore();
    const normalized = normalizeEmail(email);
    const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000;
    return (
      leads.find(
        (l) =>
          normalizeEmail(l.email) === normalized && new Date(l.createdAt).getTime() >= cutoff,
      ) ?? null
    );
  }

  async updateLead(id: string, input: LeadUpdateInput): Promise<Lead | null> {
    return withLock(async () => {
      const leads = await ensureStore();
      const index = leads.findIndex((l) => l.id === id);
      if (index === -1) return null;
      leads[index] = { ...leads[index], ...input };
      await writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf8");
      return leads[index];
    });
  }

  async listLeads(filters?: LeadFilters): Promise<Lead[]> {
    const leads = await ensureStore();
    return leads.filter((lead) => matchesFilters(lead, filters));
  }
}
