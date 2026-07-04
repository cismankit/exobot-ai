import type { Metadata } from "next";
import { ConsoleShell } from "@/components/console/shell";

export const metadata: Metadata = { title: "Console — Exobod" };

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConsoleShell>{children}</ConsoleShell>;
}
