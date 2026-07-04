"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@exobod/ui";
import { api } from "@/lib/api";

function SuccessInner() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const { data, isLoading } = useQuery({
    queryKey: ["preorder", sessionId],
    queryFn: () => api.preorderStatus(sessionId!),
    enabled: Boolean(sessionId),
    refetchInterval: (q) =>
      q.state.data?.status === "paid" ? false : 3000,
  });

  const paid = data?.status === "paid";

  return (
    <div className="mx-auto max-w-xl px-5 pb-28 pt-40 text-center">
      <p className="telemetry text-[12px] uppercase tracking-[0.3em] text-signal">
        preorder
      </p>
      <h1 className="display mt-4 text-4xl sm:text-5xl">
        {paid ? "Body reserved." : "Confirming your deposit…"}
      </h1>
      <p className="telemetry mt-6 text-sm text-muted">
        {isLoading || !data
          ? "checking order status…"
          : `order ${data.order_id.slice(0, 8)} · status: ${data.status}`}
      </p>
      <p className="mt-4 text-muted">
        {paid
          ? "You'll get build updates by email. Refundable any time until your unit ships."
          : "Stripe is finishing up — this page refreshes automatically."}
      </p>
      <div className="mt-10 flex justify-center gap-3">
        <Link href="/console">
          <Button>Open the console</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Back home</Button>
        </Link>
      </div>
    </div>
  );
}

export default function PreorderSuccess() {
  return (
    <Suspense fallback={null}>
      <SuccessInner />
    </Suspense>
  );
}
