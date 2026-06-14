import { DemoBookingPage } from "@/components/demo-booking";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Demo | Exobod.ai",
  description:
    "Schedule a live Exobod build desk demo. Your saved configuration ID attaches to the prep packet automatically.",
};

export default function DemoPage() {
  return <DemoBookingPage />;
}
