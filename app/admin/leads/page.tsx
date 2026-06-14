import { LeadsAdminPanel } from "@/components/admin/leads-panel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lead admin | Exobod.ai",
  robots: { index: false, follow: false },
};

export default function AdminLeadsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <LeadsAdminPanel />
    </div>
  );
}
