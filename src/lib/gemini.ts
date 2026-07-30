import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import type { RescueSnapshot } from "./rescue-store";

export const operationsAnalysisSchema = z.object({
  situation: z.string(),
  operationalRisk: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  recommendedHumanAction: z.string(),
  evidence: z.array(z.string()).min(1).max(5),
  tradeoff: z.string(),
  confidence: z.number().min(0).max(1),
});
export type OperationsAnalysis = z.infer<typeof operationsAnalysisSchema>;
export type AnalysisResult = {
  analysis: OperationsAnalysis;
  generatedBy: "GEMINI" | "DETERMINISTIC_FALLBACK";
  model: string;
  provider: "GOOGLE_AI_STUDIO" | "VERTEX_AI" | "FALLBACK";
  latencyMs: number;
};

function deterministicAnalysis(snapshot: RescueSnapshot): OperationsAnalysis {
  const failed = snapshot.state.includes("FAILED") || snapshot.state === "MANUAL_REVIEW";
  return {
    situation: failed
      ? `The rescue is in ${snapshot.state.replaceAll("_", " ").toLowerCase()} and requires supervised recovery.`
      : `The rescue is in ${snapshot.state.replaceAll("_", " ").toLowerCase()} with ${snapshot.events.length} audited events.`,
    operationalRisk: failed ? "HIGH" : snapshot.state === "RESCUE_COMPLETED" ? "LOW" : "MEDIUM",
    recommendedHumanAction: failed
      ? "Review the latest provider or policy event before authorizing another external action."
      : snapshot.state === "RESCUE_COMPLETED"
        ? "Confirm the arrival record and review the reconciled expense."
        : "Keep the manager approval gate active and monitor the arrival timeline.",
    evidence: [
      `Current state: ${snapshot.state}`,
      `Approval: ${snapshot.approvalStatus}`,
      `Payment: ${snapshot.paymentStatus}`,
      `Booking: ${snapshot.bookingStatus}`,
    ],
    tradeoff: "Arrival reliability is prioritized while deterministic policy retains authority over eligibility and spending.",
    confidence: failed ? 0.82 : 0.9,
  };
}

function buildClient() {
  if (process.env.GEMINI_API_KEY) {
    return {
      client: new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }),
      provider: "GOOGLE_AI_STUDIO" as const,
    };
  }
  if (process.env.GOOGLE_CLOUD_PROJECT) {
    return {
      client: new GoogleGenAI({
        vertexai: true,
        project: process.env.GOOGLE_CLOUD_PROJECT,
        location: process.env.GOOGLE_CLOUD_LOCATION ?? "global",
        apiVersion: "v1",
      }),
      provider: "VERTEX_AI" as const,
    };
  }
  return null;
}

export async function analyzeRescue(snapshot: RescueSnapshot): Promise<AnalysisResult> {
  const started = performance.now();
  const configured = buildClient();
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  if (!configured) {
    return {
      analysis: deterministicAnalysis(snapshot),
      generatedBy: "DETERMINISTIC_FALLBACK",
      model: "template-v1",
      provider: "FALLBACK",
      latencyMs: Math.round(performance.now() - started),
    };
  }
  try {
    const response = await configured.client.models.generateContent({
      model,
      contents: `Analyze this sanitized workforce rescue record for an authorized operations manager.
Do not make employment decisions, approve spending, or claim an external action occurred.
Identify operational risk and recommend the next HUMAN action using only the supplied facts.

${JSON.stringify({
  state: snapshot.state,
  scenario: snapshot.scenario,
  approvalStatus: snapshot.approvalStatus,
  paymentStatus: snapshot.paymentStatus,
  bookingStatus: snapshot.bookingStatus,
  authorizedCents: snapshot.authorizedCents,
  spentCents: snapshot.spentCents,
  recentEvents: snapshot.events.slice(-5).map(event => ({
    action: event.action,
    summary: event.summary,
    policyResult: event.policyResult,
  })),
})}`,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: {
          type: "object",
          required: ["situation", "operationalRisk", "recommendedHumanAction", "evidence", "tradeoff", "confidence"],
          properties: {
            situation: { type: "string" },
            operationalRisk: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
            recommendedHumanAction: { type: "string" },
            evidence: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
            tradeoff: { type: "string" },
            confidence: { type: "number", minimum: 0, maximum: 1 },
          },
        },
      },
    });
    return {
      analysis: operationsAnalysisSchema.parse(JSON.parse(response.text ?? "{}")),
      generatedBy: "GEMINI",
      model,
      provider: configured.provider,
      latencyMs: Math.round(performance.now() - started),
    };
  } catch {
    return {
      analysis: deterministicAnalysis(snapshot),
      generatedBy: "DETERMINISTIC_FALLBACK",
      model: "template-v1",
      provider: "FALLBACK",
      latencyMs: Math.round(performance.now() - started),
    };
  }
}
