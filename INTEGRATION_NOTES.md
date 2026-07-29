# Integration notes

The working build intentionally uses mock providers. Live API URLs, payloads, authentication, card-funding assumptions, and unsupported capabilities are not invented.

- Prava: adapter boundary only; verify restricted-spend, expiration, cancellation, and transaction-reconciliation contracts with official hackathon documentation.
- Uber Guest Rides: adapter boundary only; obtain approved business access and official request/status/webhook contract.
- Lyft Concierge: adapter boundary only; obtain organization access and official request/status/webhook contract.

Important: rideshare business-account billing and a Prava authorization may be separate commercial records. Production must reconcile them and must not claim a generated payment instrument can be inserted into a ride request until verified.
