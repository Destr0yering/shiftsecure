import { beforeEach, describe, expect, it } from "vitest";
import { getRescue, resetRescue, runScenario } from "@/lib/rescue-store";

describe("durable rescue repository", () => {
  beforeEach(() => resetRescue());
  it("persists the complete commercial outcome and ordered audit ledger", () => {
    const result = runScenario("success", "test-success-001", "manager@shiftsecure.demo");
    expect(result.state).toBe("RESCUE_COMPLETED");
    expect(result.authorizedCents).toBe(4000);
    expect(result.spentCents).toBe(3600);
    expect(result.events.map(event => event.sequence)).toEqual(result.events.map((_, index) => index + 1));
    expect(getRescue()).toEqual(result);
  });
  it("blocks booking on payment rejection", () => {
    const result = runScenario("payment_rejected", "test-decline-001", "manager@shiftsecure.demo");
    expect(result.paymentStatus).toBe("DECLINED");
    expect(result.bookingStatus).toBe("NOT_REQUESTED");
  });
  it("replays duplicate operation keys without duplicate events", () => {
    const first = runScenario("success", "test-idempotent-001", "manager@shiftsecure.demo");
    const replay = runScenario("success", "test-idempotent-001", "manager@shiftsecure.demo");
    expect(replay.events).toHaveLength(first.events.length);
  });
  it.each([
    ["ride_cancelled", "OPTIONS_DISCOVERED"],
    ["worker_withdrawal", "CANDIDATES_RANKED"],
    ["late_arrival", "RESCUE_FAILED"],
    ["provider_uncertain", "MANUAL_REVIEW"],
  ] as const)("handles %s safely", (scenario, state) => {
    expect(runScenario(scenario, `test-${scenario}`, "manager@shiftsecure.demo").state).toBe(state);
  });
});
