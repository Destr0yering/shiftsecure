"use client";
import {useState} from "react";
import Link from "next/link";
import {candidates,timeline as initial} from "@/lib/demo";
const success=["Manager approved restricted $40 maximum","Mock Prava authorization created","Mock Uber Guest Ride booked","Maria departed · ETA 6:42 AM","Arrival confirmed","Receipt reconciled · $36.00","Rescue completed"];
export function DemoClient(){
 const [events,setEvents]=useState(initial);const [scenario,setScenario]=useState("Approval pending");const [busy,setBusy]=useState(false);
 const run=async(type:"success"|"payment"|"ride")=>{setBusy(true);if(type==="success"){for(const event of success){await new Promise(r=>setTimeout(r,220));setEvents(e=>[...e,event])}setScenario("Arrival confirmed")}else if(type==="payment"){setEvents([...initial,"Manager approved","Payment authorization declined","Booking blocked · manual recovery required"]);setScenario("Payment rejected")}else{setEvents([...initial,...success.slice(0,3),"Provider cancelled ride","Authorization closure requested","Returned to option discovery"]);setScenario("Ride cancelled")}setBusy(false)};
 const reset=()=>{setEvents(initial);setScenario("Approval pending")};
 return <div className="appShell"><header className="topbar"><Link className="brand" href="/"><i>SS</i> ShiftSecure</Link><span className="pill">SIMULATED · HARBOR VIEW</span></header><main className="content">
  <p className="eyebrow">RESCUE COMMAND CENTER</p><h2>CNA shift · 7:00 AM <span className={`status ${scenario.includes("rejected")||scenario.includes("cancelled")?"danger":""}`}>{scenario}</span></h2>
  <div className="demoControls"><button disabled={busy} onClick={()=>run("success")}>Run successful rescue</button><button className="alt" onClick={()=>run("payment")}>Inject payment rejection</button><button className="alt" onClick={()=>run("ride")}>Inject ride cancellation</button><button className="alt" onClick={reset}>Reset</button></div>
  <div className="grid2"><section className="panel"><h3>Qualified candidate ranking</h3><table className="table"><thead><tr><th>Candidate</th><th>Score</th><th>Decision</th><th>Explanation</th></tr></thead><tbody>{candidates.map(c=><tr key={c.id}><td><b>{c.name}</b></td><td>{c.score||"—"}</td><td><span className={`status ${!c.eligible?"danger":""}`}>{c.eligible?"ELIGIBLE":"EXCLUDED"}</span></td><td>{c.explanation}</td></tr>)}</tbody></table>
  <h3>Transportation comparison</h3><table className="table"><tbody><tr><td><b>Uber Guest Rides · UberX</b><br/>Arrival 6:42 AM</td><td>$36</td><td><span className="status">SELECTED · MOCK</span></td></tr><tr><td>Lyft Concierge · Standard<br/>Arrival 6:58 AM</td><td>$31</td><td>Late risk</td></tr><tr><td>Metro Taxi<br/>Arrival 6:47 AM</td><td>$41</td><td>Higher cost</td></tr></tbody></table></section>
  <aside className="panel"><h3>Auditable event trail</h3><ol className="timeline" aria-live="polite">{events.map((e,i)=><li key={`${e}-${i}`}><b>{e}</b><br/><small>Actor: {e.includes("Manager")?"manager@shiftsecure.demo":"Shift Rescue Agent"} · MOCK</small></li>)}</ol></aside></div>
 </main></div>
}
