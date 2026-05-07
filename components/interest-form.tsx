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

export function InterestForm({
  defaultBodyType,
  configurationSummary,
  submitLabel = "Submit interest",
}: {
  defaultBodyType?: string | null;
  configurationSummary?: string;
  submitLabel?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

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
    },
  });

  useEffect(() => {
    if (configurationSummary !== undefined) {
      form.setValue("configurationSummary", configurationSummary);
    }
  }, [configurationSummary, form]);

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

    setSubmitted(true);
  });

  if (submitted) {
    return <SuccessState />;
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
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
      {serverError ? <p className="text-sm text-warning">{serverError}</p> : null}
      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-background transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-70"
      >
        {form.formState.isSubmitting ? "Sending..." : submitLabel}
      </button>
      <p className="text-xs leading-relaxed text-text-muted">
        By submitting, you agree we may email you about preorder interest, prototype milestones, and scoped
        engineering consults. Exobod is concept-stage hardware—not a medical device, not a safety-certified
        appliance, and not a guarantee of autonomy, gait success, or retail availability.
      </p>
    </form>
  );
}
