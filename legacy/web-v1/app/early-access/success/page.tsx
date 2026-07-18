import { MotionReveal } from "@/components/motion-reveal";
import { findEarlyOrderBySessionId } from "@/lib/payments/early-access-store";
import { formatUsdFromCents } from "@/lib/payments/early-access";
import { retrieveCheckoutSession } from "@/lib/payments/stripe";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reservation received | Exobod Desk One",
  description: "Thank you for your Exobod Desk One founder reservation.",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams?: Promise<{ session_id?: string }>;
};

export default async function EarlyAccessSuccessPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const sessionId = params.session_id?.trim();
  const order = sessionId ? await findEarlyOrderBySessionId(sessionId) : null;
  const stripeSession =
    !order && sessionId ? await retrieveCheckoutSession(sessionId) : null;
  const paid =
    order?.status === "paid" || stripeSession?.paymentStatus === "paid";
  const displayEmail = order?.email ?? stripeSession?.customerEmail;
  const displayCents = order?.amountCents ?? stripeSession?.amountTotal;

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
      <MotionReveal>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
          Desk One · EXB-D1
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.02em] text-text-main sm:text-5xl">
          {paid ? "Reservation received." : "Thanks — confirming your deposit."}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-text-muted">
          {paid
            ? "Your founder reservation deposit cleared through Stripe. You will get program updates by email."
            : "If you just finished Stripe Checkout, payment confirmation can take a few seconds (webhook). Check your email for the Stripe receipt."}
        </p>

        {paid || order || stripeSession ? (
          <dl className="mt-8 space-y-2 rounded-2xl border border-line/70 bg-surface/60 px-5 py-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Status</dt>
              <dd className="font-medium capitalize text-text-main">
                {paid ? "paid" : order?.status ?? stripeSession?.paymentStatus ?? "pending"}
              </dd>
            </div>
            {typeof displayCents === "number" ? (
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Amount</dt>
                <dd className="font-medium text-text-main">
                  {formatUsdFromCents(displayCents)}
                </dd>
              </div>
            ) : null}
            {displayEmail ? (
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Email</dt>
                <dd className="font-medium text-text-main">{displayEmail}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        <section className="mt-10 space-y-3 text-sm leading-relaxed text-text-muted">
          <h2 className="text-base font-semibold text-text-main">What happens next</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>We keep you on the EXB-D1 early-access list for the Desk One EVT program.</li>
            <li>Updates cover builder progress — BOM, firmware, hardware milestones — not a calendar ship date.</li>
            <li>
              Refund and milestone rules live on the{" "}
              <Link href="/legal/refund" className="text-accent-soft hover:underline">
                refunds page
              </Link>
              .
            </li>
            <li>No walker / walking-robot claims apply to Desk One — it is a desk mount body.</li>
          </ul>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/desk-one"
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-background hover:bg-accent-soft"
          >
            Back to Desk One
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-text-main hover:bg-surface-soft"
          >
            Home
          </Link>
        </div>
      </MotionReveal>
    </div>
  );
}
