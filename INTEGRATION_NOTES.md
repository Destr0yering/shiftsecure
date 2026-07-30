# Integration notes

## Gemini

ShiftSecure uses the official `@google/genai` SDK behind a server-only module. The same implementation can use Google AI Studio during development and Vertex AI in production. Structured JSON output is validated with Zod before it reaches the UI.

Gemini is advisory: it summarizes sanitized operational state, identifies risk, and recommends a human action. Deterministic services remain authoritative for worker qualification, state transitions, approvals, spending, bookings, and audit history.

## Mobility and expense controls

The working build intentionally uses mock transportation and expense providers. Live API URLs, payloads, authentication, funding assumptions, and unsupported capabilities are not invented.

- Uber Guest Rides: adapter boundary only; obtain approved business access and the official request/status/webhook contract.
- Lyft Concierge: adapter boundary only; obtain organization access and the official request/status/webhook contract.

Production must normalize uncertain provider results, reconcile expenses separately from rideshare business-account billing, and never report a booking or payment as successful without provider confirmation.
