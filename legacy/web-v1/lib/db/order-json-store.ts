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
import { buildMilestoneSchedule } from "@/lib/orders/milestones";
import { buildQuoteLineItems, quoteTotals } from "@/lib/orders/build-line-items";
import { getSavedConfig } from "@/lib/adapters/configStore";
import { randomBytes, randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const OPPORTUNITIES_FILE = path.join(DATA_DIR, "opportunities.json");
const QUOTES_FILE = path.join(DATA_DIR, "quotes.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

let writeLock: Promise<void> = Promise.resolve();

async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeLock.then(fn, fn);
  writeLock = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readJson<T>(file: string): Promise<T[]> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeJson<T>(file: string, data: T[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

function newToken(): string {
  return randomBytes(24).toString("hex");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export class JsonOrderStore {
  async createOpportunity(input: OpportunityCreateInput): Promise<Opportunity> {
    return withLock(async () => {
      const opportunities = await readJson<Opportunity>(OPPORTUNITIES_FILE);
      const now = new Date().toISOString();
      const opportunity: Opportunity = {
        id: randomUUID(),
        createdAt: now,
        updatedAt: now,
        status: "open",
        ...input,
        customerEmail: normalizeEmail(input.customerEmail),
      };
      opportunities.unshift(opportunity);
      await writeJson(OPPORTUNITIES_FILE, opportunities);
      return opportunity;
    });
  }

  async findOpportunityById(id: string): Promise<Opportunity | null> {
    const opportunities = await readJson<Opportunity>(OPPORTUNITIES_FILE);
    return opportunities.find((o) => o.id === id) ?? null;
  }

  async findOpportunityByLeadId(leadId: string): Promise<Opportunity | null> {
    const opportunities = await readJson<Opportunity>(OPPORTUNITIES_FILE);
    return opportunities.find((o) => o.leadId === leadId) ?? null;
  }

  async updateOpportunity(
    id: string,
    patch: Partial<Pick<Opportunity, "status" | "owner" | "notes">>,
  ): Promise<Opportunity | null> {
    return withLock(async () => {
      const opportunities = await readJson<Opportunity>(OPPORTUNITIES_FILE);
      const index = opportunities.findIndex((o) => o.id === id);
      if (index === -1) return null;
      opportunities[index] = {
        ...opportunities[index],
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      await writeJson(OPPORTUNITIES_FILE, opportunities);
      return opportunities[index];
    });
  }

  async listOpportunities(): Promise<Opportunity[]> {
    return readJson<Opportunity>(OPPORTUNITIES_FILE);
  }

  async createQuote(input: QuoteCreateInput): Promise<Quote | null> {
    return withLock(async () => {
      const opportunity = await this.findOpportunityById(input.opportunityId);
      if (!opportunity) return null;

      const configId = opportunity.configurationId;
      const saved = configId ? await getSavedConfig(configId) : null;
      if (!saved?.config) {
        return null;
      }

      const lineItems = buildQuoteLineItems(saved.config);
      const { subtotalUsd, totalUsd } = quoteTotals(lineItems);
      const validDays = input.validDays ?? 30;
      const validUntil = new Date(Date.now() + validDays * 24 * 60 * 60 * 1000).toISOString();
      const now = new Date().toISOString();

      const quotes = await readJson<Quote>(QUOTES_FILE);
      const priorRevisions = quotes.filter((q) => q.opportunityId === opportunity.id);
      const revision = priorRevisions.length + 1;

      for (const q of priorRevisions) {
        if (q.status === "sent" || q.status === "viewed" || q.status === "draft") {
          q.status = "superseded";
          q.updatedAt = now;
        }
      }

      const quote: Quote = {
        id: randomUUID(),
        token: newToken(),
        createdAt: now,
        updatedAt: now,
        opportunityId: opportunity.id,
        leadId: opportunity.leadId,
        revision,
        status: "sent",
        lineItems,
        subtotalUsd,
        totalUsd,
        currency: "USD",
        validUntil,
        configurationId: opportunity.configurationId,
        configurationSummary: opportunity.configurationSummary ?? saved.summary,
        customerName: opportunity.customerName,
        customerEmail: opportunity.customerEmail,
      };

      quotes.unshift(quote);
      await writeJson(QUOTES_FILE, quotes);

      const opportunities = await readJson<Opportunity>(OPPORTUNITIES_FILE);
      const oppIdx = opportunities.findIndex((o) => o.id === opportunity.id);
      if (oppIdx >= 0) {
        opportunities[oppIdx] = {
          ...opportunities[oppIdx],
          status: "quoting",
          updatedAt: now,
        };
        await writeJson(OPPORTUNITIES_FILE, opportunities);
      }

      return quote;
    });
  }

  async findQuoteById(id: string): Promise<Quote | null> {
    const quotes = await readJson<Quote>(QUOTES_FILE);
    return quotes.find((q) => q.id === id) ?? null;
  }

  async findQuoteByToken(token: string): Promise<Quote | null> {
    const quotes = await readJson<Quote>(QUOTES_FILE);
    return quotes.find((q) => q.token === token) ?? null;
  }

  async updateQuote(id: string, patch: QuoteUpdateInput): Promise<Quote | null> {
    return withLock(async () => {
      const quotes = await readJson<Quote>(QUOTES_FILE);
      const index = quotes.findIndex((q) => q.id === id);
      if (index === -1) return null;
      quotes[index] = {
        ...quotes[index],
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      await writeJson(QUOTES_FILE, quotes);
      return quotes[index];
    });
  }

  async listQuotes(filters?: QuoteFilters): Promise<Quote[]> {
    const quotes = await readJson<Quote>(QUOTES_FILE);
    return quotes.filter((q) => {
      if (filters?.status && q.status !== filters.status) return false;
      if (filters?.opportunityId && q.opportunityId !== filters.opportunityId) return false;
      return true;
    });
  }

  async createOrderFromQuote(quote: Quote): Promise<Order> {
    return withLock(async () => {
      const now = new Date().toISOString();
      const orderId = randomUUID();
      const order: Order = {
        id: orderId,
        token: newToken(),
        createdAt: now,
        updatedAt: now,
        quoteId: quote.id,
        opportunityId: quote.opportunityId,
        leadId: quote.leadId,
        configurationId: quote.configurationId,
        status: "contracted",
        customerName: quote.customerName,
        customerEmail: quote.customerEmail,
        totalUsd: quote.totalUsd,
        currency: "USD",
        milestones: buildMilestoneSchedule(orderId, quote.totalUsd),
      };

      const orders = await readJson<Order>(ORDERS_FILE);
      orders.unshift(order);
      await writeJson(ORDERS_FILE, orders);
      return order;
    });
  }

  async findOrderById(id: string): Promise<Order | null> {
    const orders = await readJson<Order>(ORDERS_FILE);
    return orders.find((o) => o.id === id) ?? null;
  }

  async findOrderByToken(token: string): Promise<Order | null> {
    const orders = await readJson<Order>(ORDERS_FILE);
    return orders.find((o) => o.token === token) ?? null;
  }

  async findOrderByQuoteId(quoteId: string): Promise<Order | null> {
    const orders = await readJson<Order>(ORDERS_FILE);
    return orders.find((o) => o.quoteId === quoteId) ?? null;
  }

  async updateOrder(id: string, patch: OrderUpdateInput): Promise<Order | null> {
    return withLock(async () => {
      const orders = await readJson<Order>(ORDERS_FILE);
      const index = orders.findIndex((o) => o.id === id);
      if (index === -1) return null;
      orders[index] = {
        ...orders[index],
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      await writeJson(ORDERS_FILE, orders);
      return orders[index];
    });
  }

  async listOrders(): Promise<Order[]> {
    return readJson<Order>(ORDERS_FILE);
  }
}
