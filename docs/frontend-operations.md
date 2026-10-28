# Frontend reliability and backend handoff

This is a browser-local demonstration with fictional records. Availability, recovery and security for a hosted transactional service are not implemented or certified. No production monitoring, backend operation or authentication work was added by this optimization.

## Critical journeys and provisional objectives

The following are proposed targets for owner/backend approval, not agreed production SLOs. Browser regression results are synthetic evidence, not a production success-rate estimate.

| Journey / SLI                                        | Provisional objective                                                        | Current evidence boundary                                                                       |
| ---------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Valid draft → review → one saved order               | At least 99.9% successful valid submissions; zero duplicate financial events | Deterministic browser scenarios and request-ID/command guards; no field monitoring              |
| Order, payment, customer ledger and report reconcile | Zero cent discrepancies in accepted operations                               | Integer LKR cents, immutable snapshots and pure-domain/mock integration regressions             |
| Confirmed actual material usage                      | Exactly one event per plan; no unintended or negative stock movement         | Explicit confirmation, aggregate branch units, stable duplicate guard and full-store validation |
| Failed local save                                    | Preserve previous durable/published records and retain entered form          | Quota, corruption and stale-tab fault tests; no multi-device or database guarantee              |
| Responsive interaction                               | Field p75 LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 on agreed supported devices        | Local production Lighthouse/runtime diagnostics; field INP and physical devices unmeasured      |
| Hosted availability                                  | Define an owner-approved availability/error-budget target before release     | No hosting/service availability claim; CI cannot measure uptime                                 |

## Existing failure behavior

Route errors have a recoverable Retry view/account-selection boundary. Loading skeletons represent real script/hydration delays. Drawers retain input on validation/save failures and guard dirty dismissal. Mobile review reveals and focuses invalid form fields instead of leaving an unexplained blocked modal. The shared repository validates the entire envelope, preserves v1 records through in-memory migration, and never silently resets corrupt data.

Quota/permission failures return typed errors without publishing success. Serialization comparison rejects many stale-tab changes, including deletion/reset; reload to inspect the authoritative local record before retrying. The command hook has an immediate in-flight guard; order/payment/material request and plan identities prevent supported duplicate operations. This is browser-local consistency, not durable database locking or trusted idempotency across devices.

No network retry adapter exists because no production API is implemented. Future integration must preserve drafts, distinguish transport uncertainty from a rejected operation, use server-issued idempotency and conflict versions, and reconcile authoritative state before replaying non-idempotent writes. Never turn a timeout into an automatic second charge, material use or transfer.

## Diagnosis

1. Record route, build/commit, browser/viewport, fictional branch context and typed error code. Do not log contact details, free-text notes, payment secrets or storage contents into monitoring.
2. Reproduce with a production build on a free validated loopback port. Preserve an owner's separate development server. Run production builds sequentially on constrained machines.
3. For validation failures, inspect the labeled invalid control. For save failures, inspect storage availability and stale-tab state; keep the form open. Corrupt records remain read-only until an explicit user reset.
4. For a regression, retain a minimal fictional fixture, failed trace and screenshot. Navigation-cancelled Next prefetches are distinguished from page exceptions or failed required document/assets; do not hide unexpected failures.
5. Compare deployed/remote commit with the verified revision and inspect the corresponding GitHub Actions run. A green older run does not certify newer code.

Browser-storage exports and resets need explicit owner handling when real data is introduced. No backup or recovery procedure for real customer information is supplied by this demo.

## Release and rollback

Use the retained topic → `develop` → reviewed pull request to `main` workflow, no force push, no history rewrite and no bypass of required reviews/checks. Current authorization requests delivery to the named repository; it does not authorize deployment or changing branch protection. Inspect required checks and review policy on the actual remote before merging. Verify the final `origin/main` commit and the Actions run for that exact commit.

For a confirmed regression, create a new rollback topic from the current integration branch, revert the relevant integration merge with its first parent, run the same gates and submit a reviewed rollback PR. Do not use reset/clean to erase published work. A frontend rollback does not reverse historical payments or used stock; compensating domain operations and future server reconciliation must preserve those events.

## Backend responsibilities

Keep the [existing integration contracts](backend-integration-contracts.md). A future trusted implementation must supply real identity and branch authorization, minimal authorized projections, SQL constraints/transactions/locking, server price validation and immutable effective snapshots, durable idempotency, compensating stock corrections, secure sessions/storage, RLS or equivalent authorization, audit retention, backups/restores, service availability monitoring and incident ownership.

Centralized diagnostics, field web-vitals/error telemetry and alerting require approved privacy/retention and hosting decisions. No monitoring SDK, external analytics, private key, backend endpoint, database transaction, SMS dispatch or payment integration was introduced. CSP/secure transport and deployment headers must be tested against the actual hosting configuration and Next runtime; absence of deployment evidence is not a demonstrated exploit. Browser role restrictions and mock adapter interfaces never establish production authorization, IDOR resistance or RLS.
