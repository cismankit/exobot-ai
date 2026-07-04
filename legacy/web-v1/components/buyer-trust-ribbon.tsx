"use client";

import { MotionReveal } from "@/components/motion-reveal";
import { FileText, Landmark, Shield, Video, Wallet } from "lucide-react";
import Link from "next/link";

const items = [
  { icon: Video, title: "Demo first", body: "Live or recorded prototype motion before major funds move." },
  { icon: FileText, title: "Written scope", body: "Build agreement with milestones, acceptance, and change control." },
  { icon: Wallet, title: "No blind full pay", body: "Milestone billing or escrow when contractually agreed." },
  { icon: Shield, title: "Evidence pack", body: "CAD/BOM references under NDA for qualified builds." },
  { icon: Landmark, title: "Identity on paper", body: "Legal entity, policies, and support routes documented." },
] as const;

export function BuyerTrustRibbon() {
  return (
    <section className="border-y border-line/55 bg-gradient-to-r from-accent/10 via-surface/40 to-background py-6 sm:py-7">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <MotionReveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-text-main">Buying custom hardware should feel boringly safe.</p>
            <Link
              href="/trust"
              className="text-sm font-semibold text-accent-soft underline-offset-2 hover:underline"
            >
              Read buyer protections
            </Link>
          </div>
        </MotionReveal>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-xl border border-line/60 bg-background/50 px-3 py-3 text-xs text-text-muted"
              >
                <Icon className="mb-2 size-4 text-accent" />
                <p className="font-semibold text-text-main">{item.title}</p>
                <p className="mt-1 leading-snug">{item.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
