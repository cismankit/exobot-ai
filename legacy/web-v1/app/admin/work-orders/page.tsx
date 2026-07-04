import { WorkOrdersAdminPanel } from "@/components/admin/work-orders-panel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work orders | Exobod.ai",
  robots: { index: false, follow: false },
};

export default function AdminWorkOrdersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <WorkOrdersAdminPanel />
    </div>
  );
}
