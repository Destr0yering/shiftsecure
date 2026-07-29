import {rankCandidates} from "./domain";
export const candidates=rankCandidates([
 {id:"w-maria",name:"Maria Santos",active:true,available:true,qualified:true,qualificationExpires:"2027-05-01",arrivalMinutes:32,reliability:94,costCents:3600},
 {id:"w-jordan",name:"Jordan Lee",active:true,available:false,qualified:true,qualificationExpires:"2027-02-01",arrivalMinutes:25,reliability:97,costCents:2800},
 {id:"w-taylor",name:"Taylor Brooks",active:true,available:true,qualified:true,qualificationExpires:"2026-06-01",arrivalMinutes:20,reliability:89,costCents:2400},
 {id:"w-devon",name:"Devon Price",active:true,available:true,qualified:true,qualificationExpires:"2027-03-01",arrivalMinutes:61,reliability:91,costCents:4300},
]);
export const timeline=["Shift callout received","Four candidates evaluated","Maria ranked first and accepted","Transportation required","UberX selected for on-time arrival","Manager approval required ($36 > $30)"];
