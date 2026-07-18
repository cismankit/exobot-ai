import { DemoBookingPage } from "@/components/demo-booking";
import { isCalConfigured } from "@/lib/demo/cal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a demo | Exobod.ai",
  description:
    "Request a live Exobod build desk demo. Attach a saved configuration ID so we open with your options.",
};

export default function DemoPage() {
  return <DemoBookingPage calConfigured={isCalConfigured()} />;
}
