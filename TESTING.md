# Testing

`npm run test:all` covers qualification gates, ranking, policy allow/approve/deny/manual-review outcomes, state-transition enforcement, provider idempotency, and live-provider uncertainty. Playwright covers a visible success and payment failure.

Production additions: database transaction/concurrency tests, RBAC and tenant isolation, stale webhook ordering, audit sequence/completeness, secret-pattern scans, accessibility automation, provider contract suites, load tests, and recovery drills.
