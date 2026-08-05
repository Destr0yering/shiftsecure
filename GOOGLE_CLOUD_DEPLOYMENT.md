# Google Cloud deployment

## Current deployment

- Service: `shiftsecure`
- Region: `us-east1`
- Public URL: <https://shiftsecure-4p6aiypj2a-ue.a.run.app>
- Runtime: Cloud Run
- AI provider: Vertex AI
- Model: `gemini-2.5-flash`
- Last health verification: August 5, 2026

The deployment remains a demonstration environment using simulated people, transportation, and expense activity. It is not approved for real worker or customer data.

## Required services

1. Create or select a Google Cloud project with billing enabled.
2. Enable Cloud Run, Cloud Build, Artifact Registry, and Vertex AI APIs.
3. Use a dedicated service account with least privilege.
4. Configure `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION=global`, `GOOGLE_GENAI_USE_VERTEXAI=true`, and `GEMINI_MODEL=gemini-2.5-flash`.
5. Store secrets in Secret Manager; never commit them.

## Deploy

```bash
gcloud config set project PROJECT_ID
gcloud run deploy shiftsecure --source . --region us-east1 --allow-unauthenticated
```

Cloud Run injects `PORT`; Next.js reads it automatically. Verify `/api/health`, then call `/api/ai/decision-summary` as an authenticated manager and confirm the response header reports `VERTEX_AI`.

## Production blockers

The local SQLite database is ephemeral on Cloud Run and is not suitable for shared production state. Migrate to PostgreSQL/Cloud SQL, implement real authentication and organization isolation, add rate limiting, and configure observability before onboarding customers.
