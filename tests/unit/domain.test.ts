import {describe,expect,it} from "vitest";
import {evaluatePolicy,rankCandidates,transition} from "@/lib/domain";
describe("candidate engine",()=>{
 it("hard-excludes unavailable, expired, and late candidates while ranking eligible workers",()=>{
  const rows=rankCandidates([
   {id:"a",name:"Maria",active:true,available:true,qualified:true,qualificationExpires:"2027-01-01",arrivalMinutes:30,reliability:94,costCents:3600},
   {id:"b",name:"Expired",active:true,available:true,qualified:true,qualificationExpires:"2026-01-01",arrivalMinutes:10,reliability:99,costCents:1000},
  ]);
  expect(rows[0].name).toBe("Maria");expect(rows[1].eligible).toBe(false);expect(rows[1].explanation).toContain("expired");
 });
});
describe("policy engine",()=>{
 const base={costCents:2900,approvalThresholdCents:3000,maximumCents:4500,provider:"Uber",allowedProviders:["Uber"],lateMinutes:0,confidence:.9};
 it("allows within policy",()=>expect(evaluatePolicy(base)).toBe("ALLOWED_AUTOMATICALLY"));
 it("requires approval above threshold",()=>expect(evaluatePolicy({...base,costCents:3600})).toBe("REQUIRES_APPROVAL"));
 it("denies above maximum or excessive lateness",()=>{expect(evaluatePolicy({...base,costCents:4600})).toBe("DENIED");expect(evaluatePolicy({...base,lateMinutes:11})).toBe("DENIED")});
 it("fails closed for unknown providers and bad data",()=>{expect(evaluatePolicy({...base,provider:"unknown"})).toBe("REQUIRES_MANUAL_REVIEW");expect(evaluatePolicy({...base,costCents:Number.NaN})).toBe("REQUIRES_MANUAL_REVIEW")});
});
describe("state machine",()=>{it("accepts legal transitions",()=>expect(transition("SHIFT_UNCOVERED","RESCUE_CREATED").current).toBe("RESCUE_CREATED"));it("rejects browser-style state jumps",()=>expect(()=>transition("SHIFT_UNCOVERED","PAYMENT_AUTHORIZED")).toThrow("Invalid transition"))});
