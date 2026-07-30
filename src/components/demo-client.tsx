"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { candidates } from "@/lib/demo";
import type { RescueSnapshot, Scenario } from "@/lib/rescue-store";

const scenarios: Array<[Scenario,string]> = [
  ["success","Run successful rescue"],["payment_rejected","Payment rejection"],["ride_cancelled","Ride cancellation"],
  ["worker_withdrawal","Worker withdrawal"],["late_arrival","Late-arrival block"],["provider_uncertain","Provider uncertainty"],
];
const guide = [
  "An urgent CNA shift begins at 7:00 AM. Coverage alone is not enough—the worker must arrive.",
  "Job-relevant hard gates exclude unavailable, expired-credential, and late candidates. Maria ranks first.",
  "The $36 option is not cheapest, but it protects the 6:50 AM required arrival.",
  "Deterministic policy sees $36 above the $30 threshold and pauses for a manager.",
  "Only the server-authorized manager command can approve, authorize, and book.",
  "Arrival and the $36 receipt close the commercial loop with an exportable audit record.",
];

export function DemoClient(){
 const [snapshot,setSnapshot]=useState<RescueSnapshot|null>(null); const [busy,setBusy]=useState(false); const [guideStep,setGuideStep]=useState(0);
 useEffect(()=>{void fetch("/api/demo",{cache:"no-store"}).then(r=>r.json()).then(setSnapshot)},[]);
 const run=async(scenario:Scenario)=>{setBusy(true);const response=await fetch("/api/demo",{method:"POST",headers:{"Content-Type":"application/json","x-demo-role":"MANAGER"},body:JSON.stringify({scenario,operationKey:`ui-${scenario}-${events.length}`})});setSnapshot(await response.json());setBusy(false)};
 const reset=async()=>{setBusy(true);const response=await fetch("/api/demo",{method:"DELETE",headers:{"x-demo-role":"MANAGER"}});setSnapshot(await response.json());setGuideStep(0);setBusy(false)};
 const events=snapshot?.events??[];
 return <div className="appShell"><header className="topbar"><Link className="brand" href="/"><i>SS</i> ShiftSecure</Link><span className="pill">SIMULATED · PERSISTED SQLITE DEMO</span></header><main className="content">
  <p className="eyebrow">RESCUE COMMAND CENTER · HARBOR VIEW</p><h2>CNA shift · 7:00 AM <span className={`status ${snapshot?.state.includes("FAILED")?"danger":""}`}>{snapshot?.state.replaceAll("_"," ")??"Loading…"}</span></h2>
  <section className="guide" aria-live="polite"><div><span>JUDGE MODE · {guideStep+1}/6</span><p>{guide[guideStep]}</p></div><div><button className="alt" disabled={guideStep===0} onClick={()=>setGuideStep(s=>s-1)}>← Back</button><button onClick={()=>setGuideStep(s=>Math.min(5,s+1))}>{guideStep===5?"Ready to run":"Next point →"}</button></div></section>
  <div className="statGrid"><div className="stat"><span>Arrival buffer</span><b>{snapshot?.scenario==="success"&&snapshot.state==="RESCUE_COMPLETED"?"8 min":"—"}</b></div><div className="stat"><span>Authorized</span><b>${((snapshot?.authorizedCents??0)/100).toFixed(0)}</b></div><div className="stat"><span>Final spend</span><b>${((snapshot?.spentCents??0)/100).toFixed(0)}</b></div><div className="stat"><span>Audit events</span><b>{events.length}</b></div></div>
  <div className="demoControls">{scenarios.map(([id,label])=><button className={id==="success"?"":"alt"} disabled={busy} key={id} onClick={()=>run(id)}>{label}</button>)}<button className="alt" disabled={busy} onClick={reset}>Reset</button><a className="primary" href="/api/audit">Export audit JSON</a></div>
  <div className="grid2"><section className="panel"><h3>Qualified candidate ranking</h3><table className="table"><thead><tr><th>Candidate</th><th>Score</th><th>Decision</th><th>Decision summary</th></tr></thead><tbody>{candidates.map(c=><tr key={c.id}><td><b>{c.name}</b></td><td>{c.score||"—"}</td><td><span className={`status ${!c.eligible?"danger":""}`}>{c.eligible?"ELIGIBLE":"EXCLUDED"}</span></td><td>{c.explanation}</td></tr>)}</tbody></table>
  <h3>Transportation comparison</h3><table className="table"><tbody><tr><td><b>Uber Guest Rides · UberX</b><br/>Arrival 6:42 AM</td><td>$36</td><td><span className="status">SELECTED · MOCK</span></td></tr><tr><td>Lyft Concierge · Standard<br/>Arrival 6:58 AM</td><td>$31</td><td>Late risk</td></tr><tr><td>Metro Taxi<br/>Arrival 6:47 AM</td><td>$41</td><td>Higher cost</td></tr></tbody></table></section>
  <aside className="panel"><div className="auditHead"><h3>Persisted audit ledger</h3><span>Correlation: {events.at(-1)?.correlationId??"—"}</span></div><ol className="timeline" aria-live="polite">{events.map(e=><li key={e.sequence}><b>{e.summary}</b><br/><small>#{e.sequence} · {e.actorType} · {e.action} · {e.approvalStatus}</small></li>)}</ol></aside></div>
 </main></div>
}
