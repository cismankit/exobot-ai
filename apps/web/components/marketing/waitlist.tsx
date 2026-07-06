"use client";

/** Waitlist + preorder — real endpoints. Waitlist stores + dedupes and
 * returns your position; preorder opens a live Stripe Checkout (test or
 * live mode per the API's keys). */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input } from "@exobod/ui";
import { api, ApiError } from "@/lib/api";
import { Reveal } from "./reveal";

const schema = z.object({ email: z.string().email("enter a real email") });
type FormData = z.infer<typeof schema>;

export function Waitlist() {
  const [result, setResult] = useState<string | null>(null);
  const [preorderMsg, setPreorderMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function join(data: FormData) {
    setResult(null);
    try {
      const r = await api.joinWaitlist(data.email);
      setResult(
        r.already_joined
          ? `already on the list — position #${r.position}`
          : `you're in — position #${r.position}`,
      );
    } catch (e) {
      setResult(e instanceof ApiError ? e.detail : "network error — try again");
    }
  }

  async function preorder() {
    const email = getValues("email");
    if (!email || !schema.safeParse({ email }).success) {
      setPreorderMsg("enter your email above first");
      return;
    }
    setBusy(true);
    setPreorderMsg(null);
    try {
      const r = await api.preorderCheckout(email);
      window.location.href = r.checkout_url;
    } catch (e) {
      setPreorderMsg(
        e instanceof ApiError ? e.detail : "network error — try again",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="waitlist" className="border-t border-line bg-surface/40 py-20">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <h2 className="display text-4xl sm:text-6xl">
            Reserve a body
            <br />
            for your brain.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">
            The waitlist is free. The dev-kit preorder is a refundable deposit
            through Stripe.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit(join)}
            className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <div className="flex-1 text-left">
              <label htmlFor="waitlist-email" className="sr-only">
                Email
              </label>
              <Input
                id="waitlist-email"
                type="email"
                placeholder="you@domain.com"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-danger">
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              Join the waitlist
            </Button>
          </form>
          {result && (
            <p className="telemetry mt-4 text-sm text-brand">{result}</p>
          )}
          <div className="mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={preorder}
              disabled={busy}
            >
              Preorder the dev kit
            </Button>
            {preorderMsg && (
              <p className="telemetry mt-3 text-sm text-danger">{preorderMsg}</p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
