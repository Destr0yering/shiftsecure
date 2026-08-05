# Vanta review and ShiftSecure recommendation

Reviewed July 31, 2026. Vanta describes Trust Center as a branded portal for sharing security and compliance information, and its broader platform covers continuous controls, risk management, vendor assessments, and questionnaire workflows. See [Vanta Trust Center](https://www.vanta.com/products/trust-center), [Risk Management](https://help.vanta.com/en/articles/11345378-risk-management-product-overview), and [Third Party Risk Management](https://help.vanta.com/en/articles/11345557-vendor-risk-management).

## Recommendation

Do not make Vanta a runtime dependency for the MVP. Use ShiftSecure's own legal-readiness documents and audit events now. Revisit Vanta when a customer security review, insurance requirement, or SOC 2 readiness program justifies the cost and operational overhead.

## What to borrow now

- A trust-center structure: security overview, privacy notice, terms, subprocessors, incident process, and contact path.
- A control register with owner, evidence, status, last review, and remediation date.
- A vendor register covering Google Cloud/Vertex AI, transportation, payments, messaging, scheduling, and mapping providers.
- Evidence snapshots: Cloud Run deployment, IAM configuration, test results, secret scan, access reviews, and incident exercises.
- A security-questionnaire response pack that makes no unsupported certification claims.

## What not to claim

Vanta's own certifications or Trust Center are not ShiftSecure certifications. ShiftSecure must not claim SOC 2, ISO 27001, HIPAA, PCI DSS, GDPR compliance, or equivalent status without an independent assessment and verified scope.

## Minimum control register before a pilot

| Control | Owner | Evidence | Status |
|---|---|---|---|
| Least-privilege access | Product owner | Role checks and demo accounts | Implemented for MVP |
| Secret handling | Engineering | `.env.example`, secret scan, Secret Manager plan | MVP / hardening pending |
| AI decision boundaries | Engineering | Gemini adapter and policy separation | Implemented |
| Audit integrity | Engineering | Audit events and immutable-event design | MVP / production review pending |
| Vendor review | Product/security | Provider inventory and terms | In progress |
| Incident response | Product/security | `SECURITY.md` and runbook | Draft |
| Data retention/deletion | Legal/product | Privacy notice and DPA | Counsel review pending |
| Business continuity | Engineering | Backups, recovery test, Cloud SQL plan | Pending |

The right immediate deliverable is a lightweight ShiftSecure trust center and evidence pack, not a premature certification claim or an unverified Vanta integration.
