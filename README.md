# Pressline · printing shop POS frontend

A polished local frontend demonstration for two fictional Sri Lankan printing branches. Cashier and Administrator accounts share one validated browser-local dataset. **No real authentication, financial settlement, SMS delivery, cloud synchronization, or printer bridge is implemented.** Use fictional data only.

## Run locally

Tested on Windows with **Node 24.14.1** and **npm 11.11.0**. JavaScript and browser storage are required. `.node-version` records the tested runtime. The Windows PowerShell examples use npm.cmd/npx.cmd; other platforms use npm/npx. Use npm and the committed lockfile; no environment variables, account passwords, Supabase keys, or other credentials are needed.

```powershell
npm.cmd ci
npm.cmd run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). Choose **Branch 1 cashier**, **Branch 2 cashier**, or **Demo Administrator**. IDs are `cashier-b1`, `cashier-b2`, and `admin`; there is no independent Owner role. Branch 1/Colombo and Branch 2/Kandy are fictional, editable demonstration labels.

For the production build of this frontend:

```powershell
npm.cmd run build
npm.cmd run start
```

## Review the workflows

1. Enter a cashier account. Search/filter the active managed service catalogue (initially six original services) or use the manual editor. Configure a New order with several items: paper size, black & white/color, sides, binding, finishing, printed-sheet quantity and instructions. Customer details are optional and must be fictional. Valid drafts survive navigation/reload in the same tab for the current demo account.
2. Use the current-order panel (or View order sheet on mobile) to edit/remove items; Undo restores a removed item. Empty tab drafts are allowed, while saving an order requires a valid item. Review the itemized price and optional simulated advance, then save. The order appears in dashboard/history/jobs; no paper or toner is consumed automatically.
3. Open an order directly or through its contextual drawer. Search/filter/sort history, edit permitted customer/notes fields, record later simulated payments, and advance `New → In Progress → Ready → Completed`. Production and payment states are independent. Completed order metadata is read-only; collection remains available. Cancellation/refunds are visibly unavailable pending policy approval.
4. Open **Customer receipt** and **Production ticket** separately. Use their Print action and the native browser dialog. Receipt prices are saved snapshots; the internal ticket contains print instructions without customer financial totals. Choose paper and printer yourself. Physical printing is not confirmed by this app; tax/fiscal/thermal hardware requirements are not assumed.
5. Enter Administrator for material creation/edit/deactivation/reactivation, branch quantities/thresholds, reasoned adjustments and movement history. Transfers validate both branches, preserve combined stock, and write two movements together. Instant acceptance is a demo assumption.
6. Manage **Services & pricing** as Administrator: create/edit/archive services and categories, configure print options or exact unit/setup rates, and map optional stock suggestions. Edit global demo print prices below the catalogue. New orders use the next version; existing orders/receipts retain their own rates. Reports support daily, Monday-based weekly, monthly and custom ranges with branch/all scopes. SMS preview uses the same reporting engine and always says **NOT SENT**.
7. Settings edits receipt/SMS shop labels, the two branch labels and fixed-role demo team availability. Profile saves compact-table and reduced-motion preferences for this browser. **Settings → Reset demonstration data** confirms replacement of customers, services/categories, orders, payments, plans/usage, materials, movements, transfers, prices, configuration and drafts. The current account stays selected.

## Calculations and demo assumptions

- All arithmetic uses integer LKR cents. Sheet unit rates are multiplied by printed sheets; binding and finishing are charged once per line. Duplex multiplies the sheet rate and rounds up to the next cent once per unit. No tax/discount/refund convention is invented.
- Seed prices are **DEMO PRICE — NOT APPROVED**: A4 B&W LKR 15, A4 color 60, A3 B&W 30, A3 color 120; duplex 1.80×; spiral 150, comb 100, lamination 80, trimming 50 per line. Administrators can edit these samples.
- Payments are separate events. Zero advance means unpaid; partial/full/advance/subsequent events are supported. Negative, non-finite, fractional-cent, duplicate and excessive payments are rejected. No customer is charged.
- Order value uses orders **created in the period**; collections use payments **recorded in the period**, even for older orders. Outstanding is cumulative for orders created through period end, less payments through that endpoint. Status breakdowns show the **current** production state of the selected creation cohort. These are demo reporting definitions, not approved accounting recognition rules.
- Dates and cutoffs use `Asia/Colombo`; currency/labels use `Intl` / `en-LK`. Fixtures are deterministic relative to the Colombo date when initialized/reset. Today's seeded orders start at midnight, so early-day payments remain chronologically valid.

## Checks

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run format:check
npm.cmd run test
npx.cmd playwright install chromium
npm.cmd run test:e2e
node scripts/check-design.mjs
node scripts/bundle-report.mjs
node scripts/verify-git.mjs
```

Playwright builds/starts the production frontend when no server is running. It reuses an existing local server outside CI; stop dev first to reproduce production verification. Test reports, screenshots, traces and print PDFs live in ignored `test-results/` and `playwright-report/` and may be replaced by the next run. The bundle report measures **all generated JS/CSS assets**, not initial-page traffic or a Lighthouse score. See [validation evidence](docs/validation-log.md) and [current status](FRONTEND_STATUS.md) for actual results and limits.

## Recovery, privacy and boundaries

Only fictional/non-sensitive demo content belongs in storage. `pressline.demo.v1` stores validated records and account selection; `pressline.draft.v1` is a tab draft. Schema-corrupt data is not silently overwritten: read-only fixtures and an explicit reset recovery are shown. Save failures preserve the previous saved snapshot and entered form. Stale saved-data changes/removal produce a reload instruction. This is not trustworthy financial persistence, authentication, real-time synchronization, or a database lock.

Real prices, tax/legal requirements, refunds/cancellations, production stock policy, transfer acceptance, financial recognition, payment channels, SMS recipient/schedule/metrics/provider and printer format/hardware remain open business decisions. Supabase Auth/PostgreSQL/RLS, trusted server transactions/idempotency, Realtime reconciliation, secure scheduler/SMS, production audits, backup/restore, monitoring and launch operations are future work.

The available HCI handbook was read in full; no participant research, real screen-reader/device/printer testing, or full accessibility/legal/production certification is claimed. The final master prompt, supplied engineering handbook and all three screenshots were reviewed for this enhancement. The original exact per-ID FR/NFR baseline, supplemental 18-gate source and IDE Pasted text attachment remain unavailable; no unavailable text is claimed as verified. ESLint 9.39.5 is peer-compatible with the selected Next plugin stack but upstream EOL; maintain/update lint tooling when those plugins support ESLint 10.

## Visual system and evidence

The paper/charcoal/lime interface uses canonical tokens, locally hosted OFL Manrope and owned shadcn/Radix components. No runtime font or image CDN is needed. [Design system](docs/visual-design-system.md) records responsive behavior, tool use and accessibility decisions; the [production gallery](docs/visual-evidence/README.md) shows actual screens and PDFs.

For the optional six-sample local runtime lab, keep the production server running and execute `node scripts/measure-ui.mjs`. It requires installed Playwright Chromium, writes ignored `.local/premium-performance/production-pos-lab.json`, and measures account-primed navigation with simulated throttling. It is not cold startup or field performance.

## Engineering records

- [Architecture](docs/frontend-architecture.md) and [backend contracts](docs/backend-integration-contracts.md)
- [Requirements coverage](docs/requirements-coverage.md), [HCI matrix](docs/hci-acceptance-matrix.md), [decisions](docs/decisions.md)
- [Git workflow](docs/git-workflow.md), [feature register](docs/feature-register.md), [chronological changes](docs/change-log.md), [Git audit](docs/git-audit.md)

`main` retains the initial baseline. Development was integrated locally through retained focused branches and non-fast-forward merges into `develop`. Nothing is pushed, deployed, remotely protected or merged to main. Exact branch tips and final clean-tree evidence are available from Git and the delivery report.

## Connected customer, service and material demonstration

1. Administrator → Customers → Add customer: create fictional **ABC Company** (Business); all contact details may stay blank. Cashiers can also quick-create customers. Directory is shared, cashier amounts/history are scoped to their branch.
2. Administrator → Services & pricing → Add service: **Banner Printing**, unique code, Unit pricing, **LKR 3,500.00** per job, setup 0; optionally add a banner-roll material suggestion of 2 per job. These are fictional rates. Fresh fixtures have Branch 1 banner rolls 20 and Branch 2 12. A preserved legacy store keeps its original inventory; add an appropriate fictional stock material/opening balance if needed.
3. Branch 1 cashier → New order: find ABC Company, configure Banner Printing, advance 1,000 and save. Customer outstanding is 2,500. Saving/planning/production does not deduct stock.
4. Open order → Materials for this job → Edit material plan: actual quantity **5 rolls**, Save plan. Review usage shows **20→15** at Branch 1 only. Acknowledge the impact and **Confirm & record material usage**. Order and Inventory show the same movement ID. Reload preserves 15 and the original event.
5. Record another simulated payment of **500**: customer/order/receipt outstanding becomes **2,000**. Stock movements do not change these figures or report definitions.
6. Administrator → order → **Correct recorded usage**: reasoned full-event compensation restores the erroneous event with new movements; original history stays. **Plan additional usage** records a corrected actual quantity as a separate event. Insufficient stock and invalid units/counts are rejected without partial changes. Transfers remain separate.

Existing saved prices/names survive catalogue/customer rename/archive. Legacy orders are **Unlinked** until explicitly associated; original customer text remains. V1 storage upgrades safely without reset or hydration writes. Reset demonstration data is optional and replaces all local demo entities; use fictional data only.

For isolated production verification while the dev server remains running:

```powershell
npm.cmd run build
npm.cmd run start -- --port 3001
# In a second terminal:
$env:PRESSLINE_TEST_PORT='3001'
npm.cmd run test:e2e
```

Current evidence: **84 unit/component and 44 production browser tests passed**. See FRONTEND_STATUS.md and docs/validation-log.md. `node scripts/capture-followup.mjs` captures the local production build at port 3001; it additionally requires the already-reviewed local Taste skill pinned by skills-lock.json. It uses an isolated fictional browser context. No deploy or backend is involved.
