import { CtaPair } from "@/components/cta-pair";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-5 px-4 py-16 text-center sm:py-20">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">404</p>
      <h1 className="text-2xl font-semibold text-text-main sm:text-3xl">This route is not part of the Exobod launch.</h1>
      <p className="text-sm text-text-muted">
        Return to the product overview or continue a handset embodiment request.
      </p>
      <CtaPair className="justify-center" />
      <Link href="/" className="text-xs font-semibold text-text-muted underline-offset-4 hover:text-accent-soft hover:underline">
        Back to home
      </Link>
    </div>
  );
}
