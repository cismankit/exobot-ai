"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  Brain,
  CreditCard,
  Cpu,
  Database,
  LayoutDashboard,
  UserRound,
} from "lucide-react";
import { cn } from "@exobod/ui";
import { CLERK_ENABLED } from "@/lib/config";
import { ClerkGate } from "./clerk-gate";

const NAV = [
  { href: "/console", label: "Overview", icon: LayoutDashboard },
  { href: "/console/live", label: "Live Console", icon: Activity },
  { href: "/console/persona", label: "Persona", icon: UserRound },
  { href: "/console/minds", label: "Minds", icon: Brain },
  { href: "/console/devices", label: "Devices", icon: Cpu },
  { href: "/console/memory", label: "Memory", icon: Database },
  { href: "/console/billing", label: "Billing", icon: CreditCard },
  { href: "/docs", label: "Docs", icon: BookOpen },
];

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ClerkGate>
      <div className="flex min-h-screen">
        <aside className="fixed inset-y-0 left-0 z-40 flex w-52 flex-col border-r border-line bg-surface">
          <Link
            href="/"
            className="flex h-14 items-center gap-2.5 border-b border-line px-4"
          >
            <Image
              src="/branding/logo-mark-transparent.png"
              alt=""
              width={22}
              height={22}
            />
            <span className="display text-[15px]">exobod</span>
            <span className="telemetry ml-auto text-[10px] text-muted">
              console
            </span>
          </Link>
          <nav className="flex-1 space-y-0.5 p-2" aria-label="Console">
            {NAV.map((item) => {
              const active =
                item.href === "/console"
                  ? pathname === "/console"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-colors",
                    active
                      ? "bg-signal-dim text-signal"
                      : "text-muted hover:bg-surface-2 hover:text-fg",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {!CLERK_ENABLED && (
            <p className="telemetry border-t border-line p-3 text-[10.5px] leading-relaxed text-muted">
              dev-auth mode — set Clerk keys to enable real sign-in
            </p>
          )}
        </aside>
        <main className="ml-52 min-h-screen flex-1 bg-bg p-6">{children}</main>
      </div>
    </ClerkGate>
  );
}
