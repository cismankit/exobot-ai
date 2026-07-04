import { privacyModel } from "@/lib/privacy/model";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy | Exobod.ai",
  description: "How Exobod.ai handles information you submit through forms and correspondence.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-4 px-4 py-8 text-sm leading-relaxed text-text-muted sm:px-6 sm:py-10">
      <h1 className="text-3xl font-semibold text-text-main">Privacy policy</h1>
      <p className="text-sm">Last updated: {privacyModel.lastUpdated}. Working draft for transparency.</p>

      <h2 className="pt-2 text-lg font-semibold text-text-main">Data we collect</h2>
      <ul className="list-disc space-y-1 pl-5">
        {privacyModel.dataCategories.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>
        Order inquiry forms collect contact and configuration details you provide. Server logs may
        include IP and timestamps for abuse prevention.
      </p>

      <h2 className="pt-2 text-lg font-semibold text-text-main">{privacyModel.voiceAndCamera.heading}</h2>
      <p>{privacyModel.voiceAndCamera.summary}</p>
      <ul className="list-disc space-y-1 pl-5">
        {privacyModel.voiceAndCamera.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>
        Companion app behavior is governed by on-device settings and your institutional agreement.
        See also{" "}
        <Link href="/legal/safety" className="text-accent-soft underline underline-offset-4">
          safety &amp; limitations
        </Link>
        .
      </p>

      <h2 className="pt-2 text-lg font-semibold text-text-main">How we use it</h2>
      <p>To respond to inquiries, prepare quotes, operate the program, and investigate safety incidents. We do not sell personal data.</p>

      <h2 className="pt-2 text-lg font-semibold text-text-main">Retention</h2>
      <p>{privacyModel.retention}</p>

      <h2 className="pt-2 text-lg font-semibold text-text-main">Incident reporting</h2>
      <p>
        You may submit safety or privacy incidents via{" "}
        <Link href="/report-incident" className="text-accent-soft underline underline-offset-4">
          report an incident
        </Link>
        . Reports are stored for traceability and reviewed by our safety team.
      </p>

      <h2 className="pt-2 text-lg font-semibold text-text-main">Contact</h2>
      <p>
        Privacy requests:{" "}
        <a href={`mailto:${privacyModel.contactEmail}`} className="text-accent-soft">
          {privacyModel.contactEmail}
        </a>
      </p>
    </article>
  );
}
