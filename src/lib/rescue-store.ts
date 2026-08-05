import { DatabaseSync } from "node:sqlite";
import path from "node:path";

export type Scenario = "success" | "payment_rejected" | "ride_cancelled" | "worker_withdrawal" | "late_arrival" | "provider_uncertain";
export type AuditRecord = {
  sequence: number;
  timestamp: string;
  actorType: "AGENT" | "HUMAN" | "PROVIDER" | "SYSTEM";
  actorId: string;
  action: string;
  previousState: string;
  newState: string;
  policyResult: string;
  approvalStatus: string;
  summary: string;
  correlationId: string;
  operationKey: string;
};
export type RescueSnapshot = {
  id: string;
  state: string;
  scenario: Scenario;
  approvalStatus: string;
  paymentStatus: string;
  bookingStatus: string;
  authorizedCents: number;
  spentCents: number;
  events: AuditRecord[];
};

const databasePath = process.env.SHIFTSECURE_DB_PATH ?? path.join(process.cwd(), "prisma", "dev.db");
let database: DatabaseSync | undefined;

function getDatabase(): DatabaseSync {
  if (database) return database;

  const db = new DatabaseSync(databasePath);
  db.exec(`
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS rescue_case (
      id TEXT PRIMARY KEY, state TEXT NOT NULL, scenario TEXT NOT NULL,
      approval_status TEXT NOT NULL, payment_status TEXT NOT NULL,
      booking_status TEXT NOT NULL, authorized_cents INTEGER NOT NULL,
      spent_cents INTEGER NOT NULL, updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS audit_event (
      id INTEGER PRIMARY KEY AUTOINCREMENT, rescue_case_id TEXT NOT NULL,
      sequence INTEGER NOT NULL, timestamp TEXT NOT NULL, actor_type TEXT NOT NULL,
      actor_id TEXT NOT NULL, action TEXT NOT NULL, previous_state TEXT NOT NULL,
      new_state TEXT NOT NULL, policy_result TEXT NOT NULL,
      approval_status TEXT NOT NULL, summary TEXT NOT NULL,
      correlation_id TEXT NOT NULL, operation_key TEXT NOT NULL,
      UNIQUE(rescue_case_id, sequence), UNIQUE(rescue_case_id, operation_key)
    );
  `);
  database = db;
  return db;
}

const rescueId = "rescue-hv-0700";
const initialEvents = [
  ["SHIFT_RECEIVED", "SHIFT_UNCOVERED", "Shift callout received"],
  ["CANDIDATES_EVALUATED", "CANDIDATES_RANKED", "Four candidates evaluated"],
  ["WORKER_ACCEPTED", "WORKER_ACCEPTED", "Maria ranked first and accepted"],
  ["TRANSPORT_REQUIRED", "TRANSPORT_REQUIRED", "Transportation required"],
  ["OPTION_SELECTED", "POLICY_REVIEW", "UberX selected for on-time arrival"],
  ["APPROVAL_REQUESTED", "APPROVAL_PENDING", "Manager approval required ($36 > $30)"],
] as const;

function appendEvent(input: Omit<AuditRecord, "sequence" | "timestamp">) {
  const db = getDatabase();
  const last = db.prepare("SELECT COALESCE(MAX(sequence), 0) AS sequence FROM audit_event WHERE rescue_case_id = ?").get(rescueId) as { sequence: number };
  db.prepare(`INSERT INTO audit_event
    (rescue_case_id, sequence, timestamp, actor_type, actor_id, action, previous_state, new_state, policy_result, approval_status, summary, correlation_id, operation_key)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(rescueId, last.sequence + 1, new Date().toISOString(), input.actorType, input.actorId, input.action, input.previousState, input.newState, input.policyResult, input.approvalStatus, input.summary, input.correlationId, input.operationKey);
}

export function resetRescue(): RescueSnapshot {
  const db = getDatabase();
  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare("DELETE FROM audit_event WHERE rescue_case_id = ?").run(rescueId);
    db.prepare("DELETE FROM rescue_case WHERE id = ?").run(rescueId);
    db.prepare(`INSERT INTO rescue_case VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(rescueId, "APPROVAL_PENDING", "success", "PENDING", "NOT_REQUESTED", "NOT_REQUESTED", 0, 0, new Date().toISOString());
    for (const [action, state, summary] of initialEvents) {
      appendEvent({
        actorType: action === "APPROVAL_REQUESTED" ? "SYSTEM" : "AGENT",
        actorId: "shift-rescue-agent",
        action,
        previousState: action === "SHIFT_RECEIVED" ? "NONE" : state,
        newState: state,
        policyResult: action === "APPROVAL_REQUESTED" ? "REQUIRES_APPROVAL" : "PASSED",
        approvalStatus: "PENDING",
        summary,
        correlationId: "corr-hv-0700",
        operationKey: `seed-${action.toLowerCase()}`,
      });
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return getRescue();
}

export function getRescue(): RescueSnapshot {
  const db = getDatabase();
  const row = db.prepare("SELECT * FROM rescue_case WHERE id = ?").get(rescueId) as Record<string, string | number> | undefined;
  if (!row) return resetRescue();
  const events = db.prepare("SELECT * FROM audit_event WHERE rescue_case_id = ? ORDER BY sequence").all(rescueId) as Record<string, string | number>[];
  return {
    id: String(row.id), state: String(row.state), scenario: row.scenario as Scenario,
    approvalStatus: String(row.approval_status), paymentStatus: String(row.payment_status),
    bookingStatus: String(row.booking_status), authorizedCents: Number(row.authorized_cents),
    spentCents: Number(row.spent_cents),
    events: events.map(event => ({
      sequence: Number(event.sequence), timestamp: String(event.timestamp),
      actorType: event.actor_type as AuditRecord["actorType"], actorId: String(event.actor_id),
      action: String(event.action), previousState: String(event.previous_state),
      newState: String(event.new_state), policyResult: String(event.policy_result),
      approvalStatus: String(event.approval_status), summary: String(event.summary),
      correlationId: String(event.correlation_id), operationKey: String(event.operation_key),
    })),
  };
}

const scenarioEvents: Record<Scenario, Array<[string, string, string, AuditRecord["actorType"]]>> = {
  success: [
    ["APPROVED", "APPROVED", "Manager approved restricted $40 maximum", "HUMAN"],
    ["PAYMENT_AUTHORIZED", "PAYMENT_AUTHORIZED", "Controlled mock expense authorization created", "PROVIDER"],
    ["BOOKING_CONFIRMED", "BOOKING_CONFIRMED", "Mock Uber Guest Ride booked", "PROVIDER"],
    ["WORKER_DEPARTED", "WORKER_DEPARTED", "Maria departed · ETA 6:42 AM", "PROVIDER"],
    ["ARRIVAL_CONFIRMED", "ARRIVAL_CONFIRMED", "Arrival confirmed", "PROVIDER"],
    ["RECEIPT_RECONCILED", "RECONCILED", "Receipt reconciled · $36.00", "SYSTEM"],
    ["RESCUE_COMPLETED", "RESCUE_COMPLETED", "Rescue completed · 8 minute arrival buffer", "SYSTEM"],
  ],
  payment_rejected: [
    ["APPROVED", "APPROVED", "Manager approved restricted $40 maximum", "HUMAN"],
    ["PAYMENT_REJECTED", "RESCUE_FAILED", "Payment authorization declined; booking blocked", "PROVIDER"],
  ],
  ride_cancelled: [
    ["APPROVED", "APPROVED", "Manager approved restricted $40 maximum", "HUMAN"],
    ["PAYMENT_AUTHORIZED", "PAYMENT_AUTHORIZED", "Controlled mock expense authorization created", "PROVIDER"],
    ["BOOKING_CONFIRMED", "BOOKING_CONFIRMED", "Mock Uber Guest Ride booked", "PROVIDER"],
    ["RIDE_CANCELLED", "OPTIONS_DISCOVERED", "Provider cancelled ride; authorization closure requested", "PROVIDER"],
  ],
  worker_withdrawal: [["WORKER_WITHDREW", "CANDIDATES_RANKED", "Maria withdrew; booking and authorization cancellation requested", "HUMAN"]],
  late_arrival: [["LATE_ARRIVAL_BLOCKED", "RESCUE_FAILED", "Projected lateness exceeds policy; automatic purchase denied", "SYSTEM"]],
  provider_uncertain: [["PROVIDER_UNCERTAIN", "MANUAL_REVIEW", "Provider result was ambiguous; success not claimed", "PROVIDER"]],
};

export function runScenario(scenario: Scenario, operationKey: string, actorId: string): RescueSnapshot {
  const db = getDatabase();
  const prior = db.prepare("SELECT 1 AS found FROM audit_event WHERE rescue_case_id = ? AND operation_key LIKE ? LIMIT 1").get(rescueId, `${operationKey}-%`) as { found?: number } | undefined;
  if (prior) return getRescue();
  resetRescue();
  const correlationId = crypto.randomUUID();
  let previousState = "APPROVAL_PENDING";
  for (const [action, newState, summary, actorType] of scenarioEvents[scenario]) {
    appendEvent({
      actorType, actorId: actorType === "HUMAN" ? actorId : actorType.toLowerCase(),
      action, previousState, newState,
      policyResult: action === "LATE_ARRIVAL_BLOCKED" ? "DENIED" : "REQUIRES_APPROVAL",
      approvalStatus: action === "APPROVED" ? "APPROVED" : previousState === "APPROVAL_PENDING" ? "PENDING" : "APPROVED",
      summary, correlationId, operationKey: `${operationKey}-${action.toLowerCase()}`,
    });
    previousState = newState;
  }
  const paymentStatus = scenario === "payment_rejected" ? "DECLINED" : ["success","ride_cancelled"].includes(scenario) ? "AUTHORIZED" : "NOT_REQUESTED";
  const bookingStatus = scenario === "success" ? "COMPLETED" : scenario === "ride_cancelled" ? "CANCELLED" : "NOT_REQUESTED";
  db.prepare(`UPDATE rescue_case SET state=?, scenario=?, approval_status=?, payment_status=?, booking_status=?, authorized_cents=?, spent_cents=?, updated_at=? WHERE id=?`)
    .run(previousState, scenario, scenario === "late_arrival" ? "NOT_REQUIRED" : "APPROVED", paymentStatus, bookingStatus, paymentStatus === "AUTHORIZED" ? 4000 : 0, scenario === "success" ? 3600 : 0, new Date().toISOString(), rescueId);
  return getRescue();
}
