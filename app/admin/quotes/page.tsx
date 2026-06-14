import { QuotesAdminPanel } from "@/components/admin/quotes-panel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quote admin | Exobod.ai",
  robots: { index: false, follow: false },
};

export default function AdminQuotesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <QuotesAdminPanel />
    </div>
  );
}
