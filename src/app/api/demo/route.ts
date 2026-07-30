import { z } from "zod";
import { getRescue, resetRescue, runScenario } from "@/lib/rescue-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const commandSchema = z.object({
  scenario: z.enum(["success", "payment_rejected", "ride_cancelled", "worker_withdrawal", "late_arrival", "provider_uncertain"]),
  operationKey: z.string().min(8).max(100).regex(/^[a-zA-Z0-9_-]+$/),
});

export function GET() {
  return Response.json(getRescue(), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (request.headers.get("x-demo-role") !== "MANAGER") {
    return Response.json({ type: "forbidden", title: "Manager approval is required." }, { status: 403 });
  }
  const parsed = commandSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ type: "validation_error", title: "Invalid rescue command", errors: parsed.error.flatten() }, { status: 400 });
  }
  return Response.json(runScenario(parsed.data.scenario, parsed.data.operationKey, "manager@shiftsecure.demo"));
}

export function DELETE(request: Request) {
  if (request.headers.get("x-demo-role") !== "MANAGER") {
    return Response.json({ type: "forbidden", title: "Manager role required." }, { status: 403 });
  }
  return Response.json(resetRescue());
}
