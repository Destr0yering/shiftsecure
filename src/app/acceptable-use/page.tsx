import Link from "next/link";

export default function AcceptableUsePage() {
  return <main className="legalPage"><Link href="/">← ShiftSecure</Link><h1>Acceptable Use</h1><p className="legalNotice">Pilot policy — final contractual language requires counsel review.</p><p>Do not use ShiftSecure to discriminate, retaliate, harass, surveil, fabricate records, bypass approval or audit controls, collect unnecessary sensitive data, or make unsafe or unlawful employment or transportation decisions.</p><p>Customers must maintain required worker notices and consent, verify qualifications, protect credentials, and report security, fraud, privacy, or safety incidents promptly. ShiftSecure may suspend activity presenting material legal, security, fraud, or safety risk.</p><p><Link href="/terms">Terms of Service</Link> · <Link href="/privacy">Privacy Notice</Link></p></main>;
}
