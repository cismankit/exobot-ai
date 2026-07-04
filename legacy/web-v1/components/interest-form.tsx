"use client";

import { SelectField } from "@/components/form/select-field";
import { SuccessState } from "@/components/form/success-state";
import { TextArea } from "@/components/form/text-area";
import { TextField } from "@/components/form/text-field";
import type { InterestBodyType } from "@/lib/types/interest";
import {
  interestBodyTypes,
  interestBudgets,
  interestFormSchema,
  interestUseCases,
  type InterestFormValues,
} from "@/lib/schema/interest";
import { trackEvent } from "@/lib/analytics";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const bodyOptions = interestBodyTypes.map((value) => ({ value, label: value }));
const useCaseOptions = interestUseCases.map((value) => ({ value, label: value }));
const budgetOptions = interestBudgets.map((value) => ({ value, label: value }));

function mapDefaultBody(body?: string | null): InterestBodyType {
  if (!body) return "Not Sure";
  const normalized = body.toLowerCase();
  const match: Record<string, InterestBodyType> = {
    walker: "Walker",
    "desk-assistant": "Desk Assistant",
    rover: "Rover",
    "utility-helper": "Utility Helper",
  };
  return match[normalized] ?? "Not Sure";
}

function readUtmParams(): Pick<
  InterestFormValues,
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

export function InterestForm({
  defaultBodyType,
  configurationSummary,
  configurationId,
  submitLabel = "Submit interest",
}: {
  defaultBodyType?: string | null;
  configurationSummary?: string;
  configurationId?: string | null;
  submitLabel?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [utm, setUtm] = useState(readUtmParams);

  const form = useForm<InterestFormValues>({
    resolver: zodResolver(interestFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      bodyType: mapDefaultBody(defaultBodyType),
      useCase: "Personal",
      budget: "Not Sure",
      message: "",
      configurationSummary: configurationSummary ?? "",
      configurationId: configurationId ?? undefined,
      website: "",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      affiliateRef: "",
      sourcePage: "",
    },
  });

  useEffect(() => {
    const params = readUtmParams();
    setUtm(params);
    form.setValue("utmSource", params.utmSource);
    form.setValue("utmMedium", params.utmMedium);
    form.setValue("utmCampaign", params.utmCampaign);
    form.setValue("affiliateRef", params.affiliateRef);
    form.setValue("sourcePage", params.sourcePage);
  }, [form]);

  useEffect(() => {
    if (configurationSummary !== undefined) {
      form.setValue("configurationSummary", configurationSummary);
    }
  }, [configurationSummary, form]);

  useEffect(() => {
    if (configurationId) {
      form.setValue("configurationId", configurationId);
    }
  }, [configurationId, form]);

  useEffect(() => {
    if (defaultBodyType) {
      form.setValue("bodyType", mapDefaultBody(defaultBodyType));
    }
  }, [defaultBodyType, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    const payload = {
      ...values,
      phone: values.phone?.trim() || undefined,
      message: values.message?.trim() || undefined,
      configurationSummary: values.configurationSummary?.trim() || undefined,
      configurationId: values.configurationId?.trim() || undefined,
      website: values.website || undefined,
      utmSource: values.utmSource?.trim() || utm.utmSource || undefined,
      utmMedium: values.utmMedium?.trim() || utm.utmMedium || undefined,
      utmCampaign: values.utmCampaign?.trim() || utm.utmCampaign || undefined,
      affiliateRef: values.affiliateRef?.trim() || utm.affiliateRef || undefined,
      sourcePage: values.sourcePage?.trim() || utm.sourcePage || undefined,
    };

    const res = await fetch("/api/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setServerError("We could not send your request. Please try again shortly.");
      return;
    }

    trackEvent("form_submitted", {
      source: "interest_form",
      bodyType: values.bodyType,
      configurationId: values.configurationId ?? null,
      affiliateRef: values.affiliateRef ?? null,
    });

    setSubmitted(true);
  });

  if (submitted) {
    return <SuccessState />;
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <TextField
          label="Website"
          tabIndex={-1}
          autoComplete="off"
          {...form.register("website")}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Name" autoComplete="name" {...form.register("name")} error={form.formState.errors.name?.message} />
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
          label="Interested body type"
          options={bodyOptions}
          {...form.register("bodyType")}
          error={form.formState.errors.bodyType?.message}
        />
        <SelectField
          label="Use case"
          options={useCaseOptions}
          {...form.register("useCase")}
          error={form.formState.errors.useCase?.message}
        />
      </div>
      <SelectField
        label="Budget range"
        options={budgetOptions}
        {...form.register("budget")}
        error={form.formState.errors.budget?.message}
      />
      <TextArea label="Message" rows={4} {...form.register("message")} error={form.formState.errors.message?.message} />
      {configurationSummary ? (
        <input type="hidden" {...form.register("configurationSummary")} />
      ) : null}
      {configurationId ? (
        <input type="hidden" {...form.register("configurationId")} />
      ) : null}
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
        {form.formState.isSubmitting ? "Sending..." : submitLabel}
      </button>
      <p className="text-xs leading-relaxed text-text-muted">
        By submitting, you agree we may email you with configuration guidance, quote follow-up, and order
        planning details. Exobod systems are custom hardware builds and are reviewed case-by-case for scope and
        safety.
      </p>
    </form>
  );
}
