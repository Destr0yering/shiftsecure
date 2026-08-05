import { getRescue } from "@/lib/rescue-store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function GET() {
  const snapshot = getRescue();
  return new Response(JSON.stringify({
    exportedAt: new Date().toISOString(),
    notice: "Contains simulated, sanitized hackathon data only.",
    rescueCaseId: snapshot.id,
    finalState: snapshot.state,
    events: snapshot.events,
  }, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="shiftsecure-${snapshot.id}-audit.json"`,
      "Cache-Control": "no-store",
    },
  });
}
