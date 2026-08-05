import { afterEach, describe, expect, it } from "vitest";
import { analyzeRescue, operationsAnalysisSchema } from "@/lib/gemini";
import { resetRescue } from "@/lib/rescue-store";

const originalApiKey = process.env.GEMINI_API_KEY;
const originalProject = process.env.GOOGLE_CLOUD_PROJECT;
afterEach(() => {
  process.env.GEMINI_API_KEY = originalApiKey;
  process.env.GOOGLE_CLOUD_PROJECT = originalProject;
});

describe("Gemini operations analyst", () => {
  it("uses a validated, clearly labeled fallback when credentials are absent", async () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_CLOUD_PROJECT;
    const result = await analyzeRescue(resetRescue());
    expect(result.generatedBy).toBe("DETERMINISTIC_FALLBACK");
    expect(result.provider).toBe("FALLBACK");
    expect(operationsAnalysisSchema.parse(result.analysis)).toEqual(result.analysis);
  });
});
