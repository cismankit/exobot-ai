import type { Lead } from "@/lib/db/types";
import type { Order } from "@/lib/orders/types";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface SendEmailResult {
  ok: true;
  id: string;
  provider: "resend" | "console";
}

function logEmail(kind: string, payload: EmailPayload): SendEmailResult {
  const id = `dev-${Date.now()}`;
  if (process.env.NODE_ENV !== "production") {
    console.info(`[exobod email:${kind}]`, {
      id,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
    });
  } else {
    console.info(`[exobod email:${kind}]`, { id, to: payload.to, subject: payload.subject });
  }
  return { ok: true, id, provider: "console" };
}

async function sendViaResend(kind: string, payload: EmailPayload): Promise<SendEmailResult | null> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;

  const from = process.env.RESEND_FROM_EMAIL?.trim() ?? "Exobod <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });

  const data = (await response.json()) as { id?: string; message?: string };

  if (!response.ok || !data.id) {
    console.error(`[exobod email:${kind}] Resend failed`, data.message ?? response.status);
    return null;
  }

  return { ok: true, id: data.id, provider: "resend" };
}

async function dispatchEmail(kind: string, payload: EmailPayload): Promise<SendEmailResult> {
  const sent = await sendViaResend(kind, payload);
  if (sent) return sent;
  return logEmail(kind, payload);
}

export async function sendLeadConfirmation(lead: Lead): Promise<SendEmailResult> {
  const payload: EmailPayload = {
    to: lead.email,
    subject: "We received your Exobod interest",
    text: [
      `Hi ${lead.name},`,
      "",
      "Thanks for your interest in Exobod. Our team will review your configuration and follow up with next steps.",
      "",
      `Body type: ${lead.bodyType}`,
      `Use case: ${lead.useCase}`,
      `Budget: ${lead.budget}`,
      lead.configurationSummary ? `\nConfiguration:\n${lead.configurationSummary}` : "",
      "",
      "— Exobod Labs",
    ]
      .filter(Boolean)
      .join("\n"),
    html: `<p>Hi ${lead.name},</p><p>Thanks for your interest in Exobod. Our team will review your configuration and follow up with next steps.</p>`,
  };

  return dispatchEmail("lead-confirmation", payload);
}

export async function sendTeamAlert(lead: Lead): Promise<SendEmailResult> {
  const teamEmail = process.env.TEAM_ALERT_EMAIL ?? "ops@exobod.ai";
  const payload: EmailPayload = {
    to: teamEmail,
    subject: `New Exobod lead: ${lead.name} (${lead.bodyType})`,
    text: [
      `New lead ${lead.id}`,
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Phone: ${lead.phone ?? "—"}`,
      `Body: ${lead.bodyType}`,
      `Use case: ${lead.useCase}`,
      `Budget: ${lead.budget}`,
      lead.message ? `Message: ${lead.message}` : "",
      lead.configurationSummary ? `Config: ${lead.configurationSummary}` : "",
      lead.utmSource ? `UTM: ${lead.utmSource}/${lead.utmMedium}/${lead.utmCampaign}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    html: `<p>New lead <strong>${lead.name}</strong> — ${lead.email}</p>`,
  };

  return dispatchEmail("team-alert", payload);
}

export async function sendQuoteAcceptedEmail(input: {
  order: Order;
  orderUrl: string;
}): Promise<SendEmailResult> {
  const { order, orderUrl } = input;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://exobod.ai";
  const fullOrderUrl = orderUrl.startsWith("http") ? orderUrl : `${baseUrl}${orderUrl}`;

  const payload: EmailPayload = {
    to: order.customerEmail,
    subject: "Exobod quote accepted — next steps",
    text: [
      `Hi ${order.customerName},`,
      "",
      "Thank you for accepting your Exobod quote. Your order is confirmed.",
      "",
      `Order total: $${order.totalUsd.toLocaleString("en-US")} USD`,
      `View your order portal: ${fullOrderUrl}`,
      "",
      "Your deposit milestone will appear in the order portal. Our build desk will follow up with production scheduling.",
      "",
      "— Exobod Labs",
    ].join("\n"),
    html: [
      `<p>Hi ${order.customerName},</p>`,
      `<p>Thank you for accepting your Exobod quote. Your order is confirmed.</p>`,
      `<p><a href="${fullOrderUrl}">Open your order portal</a> to view milestones and build progress.</p>`,
    ].join(""),
  };

  return dispatchEmail("quote-accepted", payload);
}

export async function sendIncidentAlert(input: {
  reportId: string;
  reporterName: string;
  reporterEmail: string;
  category: string;
  severity: string;
  description: string;
  serialNumber?: string;
  orderToken?: string;
  region?: string;
}): Promise<SendEmailResult> {
  const teamEmail = process.env.TEAM_ALERT_EMAIL ?? "ops@exobod.ai";
  const payload: EmailPayload = {
    to: teamEmail,
    subject: `[INCIDENT ${input.severity}] ${input.category} — ${input.reporterName}`,
    text: [
      `Incident report ${input.reportId}`,
      `Reporter: ${input.reporterName} <${input.reporterEmail}>`,
      `Category: ${input.category}`,
      `Severity: ${input.severity}`,
      input.serialNumber ? `Serial: ${input.serialNumber}` : "",
      input.orderToken ? `Order token: ${input.orderToken}` : "",
      input.region ? `Region: ${input.region}` : "",
      "",
      input.description,
    ]
      .filter(Boolean)
      .join("\n"),
    html: `<p><strong>Incident ${input.reportId}</strong> from ${input.reporterName}</p><pre>${input.description}</pre>`,
  };

  return dispatchEmail("incident-alert", payload);
}
