"use client";

import { SelectField } from "@/components/form/select-field";
import { SuccessState } from "@/components/form/success-state";
import { TextArea } from "@/components/form/text-area";
import { TextField } from "@/components/form/text-field";
import { trackEvent } from "@/lib/analytics";
import { partnerFormSchema, partnerTypes, type PartnerFormValues } from "@/lib/schema/partner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const partnerTypeOptions = partnerTypes.map((value) => ({ value, label: value }));

function readTrackingParams(): Pick<
  PartnerFormValues,
  "utmSource" | "utmMedium" | "utmCampaign" | "affiliateRef" | "sourcePage"
> {
  if (typeof window === "undefined") {
    return {
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      affiliateRef: "",
      sourcePage: "",
    };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
    affiliateRef: params.get("ref") ?? "",
    sourcePage: window.location.pathname,
  };
}

export function PartnerForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [tracking, setTracking] = useState(readTrackingParams);

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      organization: "",
      contactName: "",
      email: "",
      phone: "",
      partnerType: "School / district",
      estimatedUnits: "",
      message: "",
      website: "",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      affiliateRef: "",
      sourcePage: "",
    },
  });

  useEffect(() => {
    const params = readTrackingParams();
    setTracking(params);
    form.setValue("utmSource", params.utmSource);
    form.setValue("utmMedium", params.utmMedium);
    form.setValue("utmCampaign", params.utmCampaign);
    form.setValue("affiliateRef", params.affiliateRef);
    form.setValue("sourcePage", params.sourcePage);
  }, [form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    const res = await fetch("/api/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        phone: values.phone?.trim() || undefined,
        message: values.message?.trim() || undefined,
        website: values.website || undefined,
        utmSource: values.utmSource?.trim() || tracking.utmSource || undefined,
        utmMedium: values.utmMedium?.trim() || tracking.utmMedium || undefined,
        utmCampaign: values.utmCampaign?.trim() || tracking.utmCampaign || undefined,
        affiliateRef: values.affiliateRef?.trim() || tracking.affiliateRef || undefined,
        sourcePage: values.sourcePage?.trim() || tracking.sourcePage || undefined,
      }),
    });

    if (!res.ok) {
      setServerError("We could not send your request. Please try again shortly.");
      return;
    }

    trackEvent("form_submitted", { source: "partner_form", partnerType: values.partnerType });
    setSubmitted(true);
  });

  if (submitted) {
    return <SuccessState />;
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <TextField label="Website" tabIndex={-1} autoComplete="off" {...form.register("website")} />
      </div>
      <TextField
        label="Organization"
        autoComplete="organization"
        {...form.register("organization")}
        error={form.formState.errors.organization?.message}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Contact name"
          autoComplete="name"
          {...form.register("contactName")}
          error={form.formState.errors.contactName?.message}
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          {...form.register("email")}
          error={form.formState.errors.email?.message}
        />
      </div>
      <TextField
        label="Phone (optional)"
        type="tel"
        autoComplete="tel"
        {...form.register("phone")}
        error={form.formState.errors.phone?.message}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="Partner type"
          options={partnerTypeOptions}
          {...form.register("partnerType")}
          error={form.formState.errors.partnerType?.message}
        />
        <TextField
          label="Estimated batch / cohort size"
          placeholder="e.g. 12 EDU kits, 50 shell sets"
          {...form.register("estimatedUnits")}
          error={form.formState.errors.estimatedUnits?.message}
        />
      </div>
      <TextArea
        label="Project details"
        rows={4}
        placeholder="Timeline, finish preferences, white-label needs, procurement constraints…"
        {...form.register("message")}
        error={form.formState.errors.message?.message}
      />
      <input type="hidden" {...form.register("utmSource")} />
      <input type="hidden" {...form.register("utmMedium")} />
      <input type="hidden" {...form.register("utmCampaign")} />
      <input type="hidden" {...form.register("affiliateRef")} />
      <input type="hidden" {...form.register("sourcePage")} />
      {serverError ? <p className="text-sm text-warning">{serverError}</p> : null}
      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-background transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-70"
      >
        {form.formState.isSubmitting ? "Sending..." : "Request partner quote"}
      </button>
    </form>
  );
}
