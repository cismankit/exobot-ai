import { verifyAdminRequest } from "@/lib/admin/auth";
import { evaluateQCChecklist } from "@/lib/manufacturing/qc-templates";
import {
  createWorkOrderFromOrderId,
  ensureDemoOrder,
  getOrderById,
  listEligibleOrders,
  listOrders,
  listWorkOrders,
  updateWorkOrder,
} from "@/lib/manufacturing/store";
import { assignSerialToWorkOrder } from "@/lib/manufacturing/work-order";
import { NextResponse } from "next/server";
import { z } from "zod";

const workOrderStatuses = [
  "queued",
  "printing",
  "assembly",
  "qc",
  "ready",
  "shipped",
] as const;

const createSchema = z.object({
  orderId: z.string().uuid(),
});

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(workOrderStatuses).optional(),
  assignedStation: z.string().optional(),
  qcChecklist: z
    .object({
      bodyTypeSlug: z.enum(["walker", "desk-assistant", "rover", "utility-helper"]),
      items: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
          description: z.string().optional(),
          pass: z.boolean().nullable(),
          notes: z.string().optional(),
          testedAt: z.string().optional(),
        }),
      ),
      overallPass: z.boolean().nullable(),
      completedAt: z.string().optional(),
      completedBy: z.string().optional(),
    })
    .optional(),
});

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!verifyAdminRequest(request)) {
    return unauthorized();
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search") ?? undefined;
  const includeOrders = searchParams.get("includeOrders") === "true";

  await ensureDemoOrder();

  const workOrders = await listWorkOrders({
    status:
      status && workOrderStatuses.includes(status as (typeof workOrderStatuses)[number])
        ? (status as (typeof workOrderStatuses)[number])
        : undefined,
    search,
  });

  const payload: {
    ok: true;
    workOrders: typeof workOrders;
    eligibleOrders?: Awaited<ReturnType<typeof listEligibleOrders>>;
    orders?: Awaited<ReturnType<typeof listOrders>>;
  } = { ok: true, workOrders };

  if (includeOrders) {
    payload.eligibleOrders = await listEligibleOrders();
    payload.orders = await listOrders();
  }

  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  if (!verifyAdminRequest(request)) {
    return unauthorized();
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const workOrder = await createWorkOrderFromOrderId(parsed.data.orderId);
    return NextResponse.json({ ok: true, workOrder }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create work order";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  if (!verifyAdminRequest(request)) {
    return unauthorized();
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { id, qcChecklist, ...rest } = parsed.data;
  const updates = {
    ...rest,
    ...(qcChecklist ? { qcChecklist: evaluateQCChecklist(qcChecklist) } : {}),
  };

  let workOrder = await updateWorkOrder(id, updates);
  if (!workOrder) {
    return NextResponse.json({ ok: false, error: "Work order not found" }, { status: 404 });
  }

  if (rest.status === "ready" && !workOrder.serialNumber) {
    const order = await getOrderById(workOrder.orderId);
    if (order) {
      const { workOrder: withSerial, serialNumber } = await assignSerialToWorkOrder(
        workOrder,
        order,
      );
      workOrder =
        (await updateWorkOrder(id, { serialNumber })) ?? withSerial;
    }
  }

  return NextResponse.json({ ok: true, workOrder });
}
