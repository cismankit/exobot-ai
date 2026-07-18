import { EarlyOrdersAdminPanel } from "@/components/admin/early-orders-panel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Early orders admin | Exobod.ai",
  robots: { index: false, follow: false },
};

export default function AdminEarlyOrdersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <EarlyOrdersAdminPanel />
    </div>
  );
}
