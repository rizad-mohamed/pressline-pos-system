# Future backend integration contracts

These are typed boundaries and responsibilities, **not a working backend, database schema or security policy**. The implementation intentionally contains no Supabase client, production endpoint, SQL/migration/RLS implementation, live scheduler, gateway call or private server credential.

## Types and ports

`src/domain/model.ts` defines branch, demo user, optional customer, line input/saved quote, order, payment, stock material, movement, transfer, pricing, SMS configuration, preferences and typed command/Result errors. `reports.ts` defines ReportQuery/ReportResult/ReportRow. `data/contracts.ts` defines PosRepository, DemoRepository, UserSession/FutureIdentityPort, RealtimeContract, PrintJob and unsent SmsPreview.

- `PosRepository.read(): Promise<Result<DemoData>>`
- `PosRepository.execute(command: Command): Promise<Result<DemoData>>`
- `PosRepository.subscribe(onChange): unsubscribe`
- `FutureIdentityPort.current()/signOut()` and `RealtimeContract.start()/reconcile()` are declarations only.

The adapter owns identity context. A production server must derive the user/role/branch from trusted authentication and authorized membership; never trust browser role, actor ID, totals, stock balances or eligibility. DemoData includes fixture/session-selector metadata and is not an approved production wire schema. Replace that envelope with minimal authorized projections when integrating; preserve domain concepts and Result handling without exposing all branches/users to a cashier.

## Command expectations

| Command concept                | Frontend demo input/outcome                                                                                    | Required trusted operation                                                                                                                                                                                       |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create order                   | One branch, optional fictional customer, lines/options/notes, advance cents, request ID; saved prices/order ID | Authorize branch; validate catalogue/options; issue/recheck an authoritative quote/version; calculate prices, create order/lines and advance in one transaction; unique idempotency key; authoritative IDs/times |
| Record payment                 | Order reference, positive cents, note, request ID                                                              | Authorize order branch; lock/validate current balance; reject overpayment and duplicate requests; atomically append immutable payment/audit events; integrate settlement only after approved channels            |
| Update order info              | Permitted customer/notes while not completed                                                                   | Enforce lifecycle/change rules and privacy requirements; preserve financial snapshots; cancellation/refunds remain separately unapproved                                                                         |
| Advance production             | Order and next provisional state                                                                               | Validate approved transitions and authorization; preserve payment independence; audit author/time; define conflicts and permitted reversals                                                                      |
| Material metadata/availability | Name/SKU/unit/thresholds and optional opening quantities                                                       | Validate uniqueness, unit semantics, authorization and history; no destructive deletion of referenced materials; approved opening/audit process                                                                  |
| Adjust stock                   | One branch, signed whole quantity and reason                                                                   | Transactional non-negative validation/locking, immutable movement and audit; formal adjustment permissions and approvals                                                                                         |
| Transfer stock                 | Active material, distinct source/target, whole quantity, note, request ID                                      | Approved dispatch/acceptance workflow; authorize both branches; source capacity; atomic linked movements/balances and idempotency; never rely on browser locking                                                 |
| Price configuration            | New demo catalogue version                                                                                     | Admin authorization, effective dates/version conflicts, approved prices/discount/tax rules, immutable existing quotes                                                                                            |
| Reports                        | Inclusive Colombo date range, branch/all read scope, optional same-day cutoff                                  | Server-authorized aggregation using approved financial cohorts, no double counting, explicit as-of semantics and trusted timestamps                                                                              |
| SMS preview settings           | Fictional recipient/cutoff with enabled=false                                                                  | Separate protected owner-recipient configuration; validated provider and metrics/schedule; never let a preview claim delivery                                                                                    |
| App/team/preferences           | Demo labels, fixed identities and non-sensitive preferences                                                    | Real identity lifecycle, invitations/recovery and server role/branch authorization; preferences isolated to appropriate users                                                                                    |

## Security, persistence and real time

Supabase Auth plus server-side authorization and appropriate PostgreSQL RLS are future mandatory boundaries. Trusted transactions, constraints, authoritative money validation, idempotency and audit events must enforce consistency. Design reconciliation for stale data, concurrent changes, disconnects, re-subscriptions and missed Realtime events. Authorized Realtime is an invalidation/update channel, not a guarantee that client state or financial operations are correct.

The mock clone-and-save operation and serialization comparison do not provide database locks, cross-device state, real audit immutability, secure storage or backup/recovery. Production requires approved backups/restores, monitoring, incident/support process, retention/data access controls, encryption/session policies, legal/privacy review and deployment/rollback evidence. Browser local storage must not hold private keys or actual session/payment/customer secrets. Service-role/provider credentials belong only in protected server environments.

## SMS and scheduling ledger

The frontend derives a **NOT SENT** message from the same report engine. Nothing is transmitted, scheduled, queued or assigned a delivery receipt. Notify.lk or Text.lk are future candidates awaiting validation, not integrated providers. A managed server scheduler needs an approved owner timezone/date cutoff, schedule, metrics, recipient, idempotency, retry policy and delivery/audit semantics. Keep provider credentials out of browser forms/storage. No independent Owner role is introduced: owner reporting is authorized Administrator access.

## Printing ledger

Browser preview/print is independent of database commits and SMS delivery. Do not mark a payment/order/job as physically printed based on `window.print()`. Validate real printers, paper/thermal dimensions, pagination, fonts, copy counts and statutory receipt fields with approved hardware/legal requirements. A future bridge is not included or selected.

## Open decisions

Actual selling prices and catalogue options; tax/statutory fields; discounts; refund/cancellation and reversal permissions; financial recognition/cohorts; payment channels; customer-data/retention requirements; printer hardware/formats; automatic stock consumption timing/mapping; negative-stock/adjustment policies; transfer dispatch/acceptance; owner SMS recipient/schedule/metrics/provider; offline support; availability, performance, recovery and hosting targets. Seed rates, units, current flow, instant transfers and Monday-start weeks remain explicitly provisional demonstration conventions.
