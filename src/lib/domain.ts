export const rescueStates = [
  "SHIFT_UNCOVERED","RESCUE_CREATED","CANDIDATES_IDENTIFIED","CANDIDATES_RANKED","OUTREACH_IN_PROGRESS",
  "WORKER_ACCEPTED","TRANSPORT_REQUIRED","OPTIONS_DISCOVERED","OPTION_SELECTED","POLICY_REVIEW",
  "APPROVAL_PENDING","APPROVED","PAYMENT_AUTHORIZED","BOOKING_CONFIRMED","WORKER_DEPARTED",
  "RESCUE_IN_PROGRESS","ARRIVAL_CONFIRMED","RECONCILED","RESCUE_COMPLETED","RESCUE_FAILED","RESCUE_CANCELLED"
] as const;
export type RescueState = typeof rescueStates[number];
export type Candidate = {id:string;name:string;active:boolean;available:boolean;qualified:boolean;qualificationExpires:string;arrivalMinutes:number;reliability:number;costCents:number};
export type CandidateResult = Candidate & {eligible:boolean;score:number;explanation:string};

export function rankCandidates(candidates: Candidate[], now = new Date("2026-07-29T10:00:00Z")): CandidateResult[] {
  return candidates.map(c => {
    const expired = new Date(c.qualificationExpires) <= now;
    const reasons = [!c.active&&"inactive",!c.available&&"unavailable",(!c.qualified||expired)&&"qualification missing or expired",c.arrivalMinutes>50&&"projected late"].filter(Boolean);
    const eligible = reasons.length === 0;
    const score = eligible ? Math.round(Math.max(0,30-c.arrivalMinutes*.3)+20+c.reliability*.2+15+Math.max(0,10-c.costCents/1000)+5) : 0;
    return {...c,eligible,score,explanation: eligible ? `On-time arrival feasible; ${c.reliability}% reliability; required qualification verified.` : `Excluded: ${reasons.join(", ")}.`};
  }).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}

export type PolicyInput={costCents:number;approvalThresholdCents:number;maximumCents:number;provider:string;allowedProviders:string[];lateMinutes:number;confidence:number};
export type PolicyDecision="ALLOWED_AUTOMATICALLY"|"REQUIRES_APPROVAL"|"DENIED"|"REQUIRES_MANUAL_REVIEW";
export function evaluatePolicy(p:PolicyInput):PolicyDecision {
  if(!Number.isFinite(p.costCents)||p.maximumCents<=0) return "REQUIRES_MANUAL_REVIEW";
  if(p.costCents>p.maximumCents||p.lateMinutes>10) return "DENIED";
  if(!p.allowedProviders.includes(p.provider)||p.confidence<.8) return "REQUIRES_MANUAL_REVIEW";
  return p.costCents>p.approvalThresholdCents?"REQUIRES_APPROVAL":"ALLOWED_AUTOMATICALLY";
}

const legal:Partial<Record<RescueState,RescueState[]>>={
  SHIFT_UNCOVERED:["RESCUE_CREATED"],RESCUE_CREATED:["CANDIDATES_IDENTIFIED"],CANDIDATES_IDENTIFIED:["CANDIDATES_RANKED"],
  CANDIDATES_RANKED:["OUTREACH_IN_PROGRESS"],OUTREACH_IN_PROGRESS:["WORKER_ACCEPTED","RESCUE_FAILED"],WORKER_ACCEPTED:["TRANSPORT_REQUIRED"],
  TRANSPORT_REQUIRED:["OPTIONS_DISCOVERED"],OPTIONS_DISCOVERED:["OPTION_SELECTED"],OPTION_SELECTED:["POLICY_REVIEW"],POLICY_REVIEW:["APPROVAL_PENDING","PAYMENT_AUTHORIZED","RESCUE_FAILED"],
  APPROVAL_PENDING:["APPROVED","RESCUE_CANCELLED"],APPROVED:["PAYMENT_AUTHORIZED"],PAYMENT_AUTHORIZED:["BOOKING_CONFIRMED","RESCUE_FAILED"],
  BOOKING_CONFIRMED:["WORKER_DEPARTED","OPTIONS_DISCOVERED"],WORKER_DEPARTED:["RESCUE_IN_PROGRESS"],RESCUE_IN_PROGRESS:["ARRIVAL_CONFIRMED","RESCUE_FAILED"],
  ARRIVAL_CONFIRMED:["RECONCILED"],RECONCILED:["RESCUE_COMPLETED"]
};
export function transition(from:RescueState,to:RescueState){if(!legal[from]?.includes(to))throw new Error(`Invalid transition: ${from} → ${to}`);return {previous:from,current:to};}
