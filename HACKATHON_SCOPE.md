# Original hackathon scope (archived)

This document records the project’s earlier Agentic Commerce Hackathon framing for provenance. The application was not accepted into that event. Current product and competition scope is defined in `XPRIZE_SCOPE.md`.

ShiftSecure is a new independent product and repository created for this build. Got2Get2Work is neither inspected nor used as a code or runtime dependency.

Implemented: original brand/UI, deterministic CNA rescue, explainable candidate gates/ranking, commerce policy, server-enforced demo-role approval gate, typed mock payment and transportation providers, SQLite persistence, ordered downloadable audit ledger, idempotency behavior, legal state transitions, six deterministic success/recovery demonstrations, guided judge mode, health/API routes, validated Prisma target model, tests, Docker build recipe, and submission documentation.

Integration status: payment and mobility are **MOCK**. Prava, Uber Guest Rides, and Lyft Concierge are adapter-only until official contracts and credentials are verified. No live charge, ride, notification, or worker-location tracking occurs.

Post-hackathon: durable orchestration, outbox and reconciliation workers, secure authentication/RBAC, real scheduling/outreach connectors, signed webhooks, provider certification, PostgreSQL migration, production observability, and compliance work.
