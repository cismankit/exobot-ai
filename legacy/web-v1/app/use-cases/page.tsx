import { redirect } from "next/navigation";

/** Folded into homepage #use-cases — keep URL as a stable alias. */
export default function UseCasesPage() {
  redirect("/#use-cases");
}
