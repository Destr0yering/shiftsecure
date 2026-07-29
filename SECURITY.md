# Security

Threats include approval bypass, duplicate charge/booking, tenant data leakage, forged provider events, stale updates, credential disclosure, PII overcollection, and fabricated success. Current controls include server-side validation on the demo API, explicit legal transitions, deterministic policy, idempotent mock providers, normalized uncertain results, masked references, and visible simulation labels.

Production requirements: passwordless/OIDC or hashed credentials; HttpOnly SameSite sessions; server-derived tenant/role; per-command RBAC; CSRF protection; rate limiting; PostgreSQL constraints; transactional intent/outbox; signed webhooks; replay protection; CSP/security headers; secret manager; encrypted location data; allowlisted audit summaries; monitoring; backups; and independent review. SQLite and service-layer append-only rules do not establish immutable audit storage. No HIPAA, SOC 2, or PCI DSS certification is claimed.
