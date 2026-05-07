import { persistInterest } from "@/lib/adapters/interestStore";
import { interestFormSchema } from "@/lib/schema/interest";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = interestFormSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;
  await persistInterest({
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone?.trim() || undefined,
    bodyType: data.bodyType,
    useCase: data.useCase,
    budget: data.budget,
    message: data.message?.trim() || undefined,
    configurationSummary: data.configurationSummary?.trim() || undefined,
  });

  return NextResponse.json({ ok: true });
}
