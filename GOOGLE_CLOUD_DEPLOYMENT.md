# Google Cloud deployment

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
