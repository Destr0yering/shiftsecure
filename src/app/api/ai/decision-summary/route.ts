import { analyzeRescue } from "@/lib/gemini";
import { getRescue } from "@/lib/rescue-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (request.headers.get("x-demo-role") !== "MANAGER") {
    return Response.json({ type: "forbidden", title: "Manager role required." }, { status: 403 });
  }
  const result = await analyzeRescue(getRescue());
  return Response.json(result, {
    headers: {
      "Cache-Control": "no-store",
      "X-ShiftSecure-AI-Provider": result.provider,
    },
  });
}
