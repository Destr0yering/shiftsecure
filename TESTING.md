# Testing

`npm run test:all` covers qualification gates, ranking, policy allow/approve/deny/manual-review outcomes, state-transition enforcement, provider idempotency, live-provider uncertainty, SQLite persistence, audit ordering, spend totals, duplicate command replay, and every recovery scenario. Playwright covers visible success, payment failure, and an approval-bypass attempt.

Production additions: database transaction/concurrency tests, RBAC and tenant isolation, stale webhook ordering, audit sequence/completeness, secret-pattern scans, accessibility automation, provider contract suites, load tests, and recovery drills.
