# Deployment

Local demo: copy `.env.example` to `.env`, run `npm install`, then `npm run dev`. Build with `npm run build`; containerize with the included Dockerfile.

Do not deploy the SQLite target model as a multi-user serverless production database. Before hosting, move to PostgreSQL, configure durable migrations and backups, secure session/RBAC, secrets, rate limiting, signed webhooks, outbox workers, logging/redaction, observability, and a health/readiness strategy. The current app is a hackathon demo, not a production deployment.
