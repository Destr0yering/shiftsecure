import Link from "next/link";

const features = [
  ["Qualify", "Hard gates verify credentials, availability, and arrival feasibility."],
  ["Authorize", "A deterministic policy engine requires a manager when risk or cost crosses policy."],
  ["Transport", "Provider adapters compare arrival confidence—not just price—and remain clearly simulated."],
  ["Prove", "Every command, approval, authorization, booking, and outcome is auditable."],
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <nav><span className="brand"><i>SS</i> ShiftSecure</span><span className="pill">Hackathon MVP · Simulated</span></nav>
        <div className="heroGrid">
          <div>
            <p className="eyebrow">WORKFORCE CONTINUITY, WITH CONTROL</p>
            <h1>A shift is not filled until the worker <em>arrives.</em></h1>
            <p className="lede">ShiftSecure finds a qualified replacement, secures employer-funded transportation, controls spending, and verifies arrival—all without replacing your scheduling system.</p>
            <div className="actions"><Link className="primary" href="/demo">Launch live demo →</Link><Link className="secondary" href="/dashboard">View operations</Link></div>
            <p className="trust">✓ Human approval &nbsp; ✓ Restricted spend &nbsp; ✓ Immutable event trail</p>
          </div>
          <div className="signalCard">
            <div className="cardTop"><span>RESCUE #HV-0700</span><b>IN PROGRESS</b></div>
            <h3>Certified Nursing Assistant</h3><p>Harbor View Senior Living · starts 7:00 AM</p>
            <div className="route"><span>Maria Santos<br/><small>Pickup 6:21 AM</small></span><strong>→</strong><span>Harbor View<br/><small>Arrival 6:42 AM</small></span></div>
            <div className="metricRow"><span><small>RIDE</small><b>$36.00</b></span><span><small>ARRIVAL BUFFER</small><b>8 min</b></span><span><small>CONFIDENCE</small><b>94%</b></span></div>
            <div className="approved">✓ Manager approved · Controlled expense authorization secured</div>
          </div>
        </div>
      </section>
      <section className="featureSection"><p className="eyebrow">ONE CONTROLLED COMMERCIAL WORKFLOW</p><h2>From callout to confirmed arrival.</h2><div className="featureGrid">{features.map(([title, text], i)=><article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <footer><span className="brand"><i>SS</i> ShiftSecure</span><span>Simulated worker, payment, and transportation data. <Link href="/terms">Terms</Link> · <Link href="/privacy">Privacy</Link> · <Link href="/acceptable-use">Acceptable use</Link></span></footer>
    </main>
  );
}
