import { CardShell } from "@/components/card-shell";
import { OrderMilestonePayments } from "@/components/order-milestone-payments";
import { getDb } from "@/lib/db";
import { isStripeConfigured } from "@/lib/payments/stripe";
import type { OrderStatus } from "@/lib/orders/types";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ token: string }> };

const ORDER_TIMELINE: { status: OrderStatus; label: string }[] = [
  { status: "contracted", label: "Contract signed" },
  { status: "in_production", label: "In production" },
  { status: "qa", label: "Quality check" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
  { status: "support", label: "Support window" },
];

function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusIndex(status: OrderStatus): number {
  const idx = ORDER_TIMELINE.findIndex((s) => s.status === status);
  return idx >= 0 ? idx : 0;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Your Exobod order",
    description: "Track build progress and milestone payments for your custom Exobod.",
    robots: { index: false, follow: false },
  };
}

export default async function CustomerOrderPage({ params }: Props) {
  const { token } = await params;
  const db = getDb();
  const order = await db.findOrderByToken(token);

  if (!order) {
    notFound();
  }

  const currentIdx = statusIndex(order.status);
  const stripeConfigured = isStripeConfigured();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <div className="mb-8 space-y-2">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
          Order portal
        </p>
        <h1 className="font-display text-3xl font-semibold text-text-main">
          Hello, {order.customerName}
        </h1>
        <p className="text-sm text-text-muted">
          Order placed {formatDate(order.createdAt)} · {formatUsd(order.totalUsd)} total
        </p>
        {order.configurationId ? (
          <p className="text-sm">
            <Link
              href={`/customize/summary/${order.configurationId}`}
              className="font-semibold text-accent-soft underline-offset-4 hover:underline"
            >
              Configuration spec
            </Link>
          </p>
        ) : null}
      </div>

      <CardShell hover={false} className="mb-6 p-5">
        <h2 className="text-sm font-semibold text-text-main">Build timeline</h2>
        <p className="mt-1 text-xs text-text-muted">
          Manufacturing handoff begins after deposit clearance.
        </p>
        <ol className="mt-4 space-y-3">
          {ORDER_TIMELINE.map((step, idx) => {
            const done = idx <= currentIdx;
            const active = idx === currentIdx;
            return (
              <li key={step.status} className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    done
                      ? "bg-accent text-background"
                      : "border border-line bg-surface-soft text-text-muted",
                    active && "ring-2 ring-accent/40",
                  )}
                >
                  {idx + 1}
                </span>
                <div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      done ? "text-text-main" : "text-text-muted",
                    )}
                  >
                    {step.label}
                  </p>
                  {active ? (
                    <p className="text-xs text-accent-soft">Current stage</p>
                  ) : done ? (
                    <p className="text-xs text-text-muted">Complete (stub)</p>
                  ) : (
                    <p className="text-xs text-text-muted">Upcoming</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </CardShell>

      <CardShell hover={false} className="p-5">
        <h2 className="text-sm font-semibold text-text-main">Milestone payments</h2>
        <OrderMilestonePayments
          orderToken={token}
          milestones={order.milestones}
          stripeConfigured={stripeConfigured}
        />
      </CardShell>

      <p className="mt-8 text-center text-xs text-text-muted">
        Questions? Reply to your build desk thread,{" "}
        <Link href="/report-incident" className="underline underline-offset-4">
          report an incident
        </Link>
        , or visit{" "}
        <Link href="/legal/refund" className="underline underline-offset-4">
          refund policy
        </Link>
        .
      </p>
    </div>
  );
}
