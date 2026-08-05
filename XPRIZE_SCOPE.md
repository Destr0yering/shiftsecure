# Build with Gemini XPRIZE scope

ShiftSecure is pivoting from a hackathon prototype into an AI-native workforce-continuity business for essential-service employers.

## Primary category

- Small Business Services

ShiftSecure helps essential-service employers compete by reducing the operational cost and disruption of urgent vacancies. It protects work opportunities by helping an employer identify a qualified replacement, understand transportation feasibility, maintain human control over consequential decisions, and verify arrival.

The product also supports job continuity, but Entrepreneurship & Job Creation is a secondary impact—not the submission category.

## AI and human responsibilities

Gemini analyzes sanitized operational state, summarizes risk, cites the facts it considered, and recommends the next human action. Deterministic services remain authoritative for qualification gates, state transitions, approval requirements, spending limits, bookings, and audit records. Gemini cannot hire, reject, approve spending, book transportation, or mark a rescue successful.

## Google Cloud implementation

- Gemini through the official Google Gen AI SDK
- Vertex AI for production model access
- Cloud Run for the Next.js service
- PostgreSQL on Cloud SQL before multi-user production
- Cloud Logging and Error Reporting for operational evidence
- Secret Manager for provider credentials

The public demo is deployed on Cloud Run and has been verified with Gemini through Vertex AI. The local demo uses SQLite and can call either the Gemini Developer API or Vertex AI when configured. Without credentials it uses a visibly labeled deterministic fallback.

## Evidence required before submission

- a production deployment with Gemini returning live structured analyses;
- agent execution logs and API-usage evidence;
- at least one real pilot organization;
- documented customer feedback;
- revenue evidence and a simple profit-and-loss statement;
- a three-minute video;
- a 500–1,000-word human-versus-AI operating narrative.

No customer, revenue, production, or compliance claim should be made without evidence.
