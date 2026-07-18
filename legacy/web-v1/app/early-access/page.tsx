import { redirect } from "next/navigation";

/** Canonical product page is /desk-one — keep /early-access as a stable alias. */
export default function EarlyAccessPage() {
  redirect("/desk-one");
}
