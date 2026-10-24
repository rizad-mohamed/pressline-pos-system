# CODEX FOLLOW-UP — Customer Directory, Dynamic Service Catalogue & Order-Linked Material Consumption

**Project:** Pressline — Two-Branch Printing-Shop POS, Sri Lanka
**Mode:** Implement now, in the existing repository. **Frontend demonstration only.**
**Integration target:** Existing local `develop` branch. **Never modify `main`.**
**New feature IDs:** `CUST-001` to `CUST-006`, `SVC-001` to `SVC-006`, `MAT-001` to `MAT-008` (register and trace these IDs; retain existing FR/NFR references).

## 1. Mission and non-negotiable boundaries

The polished frontend demonstration is already implemented. **Extend it in place**, rather than rebuilding or re-theming it. Deliver three **working, interconnected** capabilities:

1. **Saved/recurring customers:** staff can rapidly select a previously saved customer, inspect their historical orders, payment activity and properly computed outstanding balances.
2. **Administrator-managed service catalogue:** administrators can add, modify, categorize, price, activate and archive printing services. Replace the **hard-coded six POS service presets** with data-driven records, while preserving their existing behavior and demo seed examples.
3. **Order-linked inventory consumption:** printing jobs can declare materials actually used (e.g., **five banner-paper rolls**) and explicitly record usage, reducing the inventory of the correct branch once, with a traceable movement history.

These three capabilities must use the **existing shared, typed browser-demo domain/store** so changes are visible across POS, orders, customers, inventory, reports and printing without inconsistent independent mock datasets.

**ABSOLUTE FRONTEND-ONLY RULE:** No live API calls, Supabase access, database/SQL/migrations, server actions that write data, backend route handlers, hosted Auth, payment processing, Realtime subscriptions, external SMS requests, scheduler, deployment, cloud configuration, or other production side effects. It is appropriate to extend `src/domain`, client-side `src/data`/mock repositories, local persistence and UI features because these are **frontend demonstration code, not a backend**. Keep any existing production/backend files untouched. Never label demo actions as real business transactions or claim real multi-device synchronization, financial settlement or database-level atomicity.

**Reference precedence:** this follow-up's explicitly approved customer/catalogue/material features and strict frontend-only boundary → existing POS requirements/master prompts → relevant **Complete Production-Grade Full-Stack Engineering Handbook** and production-readiness guidance → **HCI Principles Handbook 2026** → existing architecture, `AGENTS.md`, brand/design standards and source conventions. These new requirements **supersede the earlier provisional instruction not to link orders with inventory**; only the **frontend demo consumption behavior** is now authorized. Inspect accessible references; never claim to have read unavailable ones. Keep other unresolved business rules identified as demo assumptions rather than inventing tax, refunds, pricing, accounting or stock policies.

## 2. First inspect the actual repository

Before writing code:

- Examine Git status, current branch, HEAD, local/remote branch topology, uncommitted work, `AGENTS.md`, actual route tree, tests and current frontend. Keep unrelated work untouched; do not silently stash/reset/clean.
- Understand current `src/domain`, `src/data`, Zod validation, local browser persistence, demo role/branch enforcement, printing/pricing calculations, payment status, order snapshots, inventory movements and transfer logic. Read `FRONTEND_STATUS.md`, `docs/frontend-architecture.md`, `docs/visual-design-system.md`, `docs/feature-register.md`, `docs/git-workflow.md`, `docs/requirements-coverage.md` and `docs/decisions.md` when present.
- Retain the existing **Pressline paper/ink visual language**: charcoal rail, warm paper/white content surfaces, restrained lime emphasis, self-hosted Manrope, centralized `src/styles/brand.css`, shadcn/ui primitives and accessible drawer-first editing. Reuse already installed shadcn and Taste skills; **do not reinitialize shadcn or reinstall skill dependencies blindly**.
- Identify the exact existing support for customer text, six fixed service cards, price catalogue, printing line specifications, stock ledger and order state transitions. Record initial tests and affected requirements.

## 3. CUST — Persistent recurring-customer directory (frontend demo)

### CUST-001 — Customer records and management

Create an appropriate **Customers** destination in the existing navigation, with a high-quality, searchable and responsive customer list and detail experience. Allow authorized administrators to **add, inspect, edit and archive/reactivate** records. Where the current frontend role policy permits, give cashiers a lightweight **Add new customer** action from POS; otherwise preserve the established permission convention and document that decision. **Do not invent a new Owner role.**

Model at least:

- Stable immutable customer ID; customer kind **Individual** or **Business/Company**.
- Display name / company name, optional contact person, phone, email, address and notes as useful; creation/update metadata and active/archived state.
- Optional fields remain optional. Use clear validation, normalizing harmless phone formatting but **do not impose US phone/name assumptions**. Warn on likely duplicate contacts/names; do not destructively merge unrelated customers.
- Use **fictional** demo records only. Customer data is browser-local; state that this is **not secure production customer storage**.
- Archiving must not delete or corrupt previous orders or payment history; prevent invalid destructive deletion of referenced customers.

### CUST-002 — Fast selection during POS checkout

Replace the current unstructured customer-only entry with a **searchable customer selector** that is fast by name, business/company and phone; show enough context to distinguish matches. Support **Walk-in / Not linked** without forcing personal data collection. Provide a short Quick view, selection confirmation and clear **Change/Remove customer** handling. Use the same customer ID throughout the created order; preserve a readable customer-name snapshot on each order/print view for historical clarity.

### CUST-003 — Customer detail and history

In the customer details view, show:

- Customer profile; active/archived status; useful contact data.
- **Previous orders** with dates, branch, order reference, service summary, production status and payment status.
- **Financial summary** with total applicable order value, total recorded payments, and **outstanding balance**; clearly labeled and derived from current order/payment records.
- Order-level balance, payments already made, and payment history where supported; search/filter history, open the existing order-details route, and offer **New order for this customer**.

**Do not create a separate mutable customer-balance field.** Calculate outstanding using existing authoritative-for-demo order snapshots, recorded payments, and any supported adjustments. Payments update the customer summary; archiving does not erase the ledger. Keep **production status separate from payment status**. Do not mislabel order value as collected cash, and do not invent fees, tax or credit limits.

### CUST-004 — Two-branch visibility

Customers may be reused across the two business branches (explicit **provisional demo policy**). The Administrator may see business-wide customer orders and balances; a Branch 1 or Branch 2 cashier can access **only their own branch's permitted orders and amounts**, even when the customer has transactions at the other branch. Label cashier figures **“At this branch”** rather than presenting a partial balance as company-wide. Demo-only UI scoping is **not real backend authorization**.

### CUST-005 — Backward compatibility and local persistence

Safely extend versioned mock storage; preserve browser-local orders, customer free-text fields, prices, payments and sample fixtures created before this change. Legacy orders without a reliable customer ID should remain **Unlinked**, not silently matched/merged by ambiguous names. Allow explicit linking where safe and authorized. Never auto-reset saved demonstration data as a migration strategy. Include deterministic reset fixtures for new customer records and recover gracefully from older or malformed local state.

### CUST-006 — Customer usability and privacy

Implement empty, loading/processing, validation, archive, no-matches and recoverable failure states; meaningful keyboard/focus behaviors, sensible table density and responsive layouts. Prefer drawers for create/edit and an appropriate detail page or wide drawer for comprehensive history. No real customer data in fixtures, screenshots, logs or test evidence.

## 4. SVC — Editable Administrator Service Catalogue, fully connected to POS

### SVC-001 — Administration interface

Expand **Administrator → Pricing / Price catalogue** into a coherent **Services & Pricing** area (using tabs or sub-navigation if better for the existing layout). Provide working **Create, View, Edit, Activate/Deactivate and Archive** functionality plus search, category filtering and sensible sorting. Enable configurable **service categories** where supported by a clear UI. Do not scatter separate inconsistent management screens or leave dead CRUD buttons.

### SVC-002 — Service record

A service should have stable ID/code, name, short description, category, status, applicable printing/specification options, **supported pricing model** and optional printing-appropriate icon/illustration. Include the available existing combinations (paper size, B&W/color, duplex, quantity, binding/finishing) where the service actually supports them. Do not require every service to have paper size or duplex. Keep optional notes/lead-time fields only if justified; do not invent production deadlines or taxes.

### SVC-003 — Flexible but safe demo pricing

The Administrator must be able to establish usable pricing for a newly created service **without editing source code**. Preserve the current exact-money calculation engine and allow a compatible basic rate/quantity pricing path, with supported configurable options and surcharges where already modeled. Prevent unsupported pricing configurations through clear validation rather than displaying a non-working advanced editor. Keep all seeded prices explicitly **demo** and make the pricing formula visible or understandable. Do not rewrite historical orders when prices change.

### SVC-004 — Data-driven POS service selection

Convert the six fixed preset cards to **seeded records in the catalogue**, not hard-coded source-of-truth UI cards. The POS must render active services and their current usable configurations from the shared mock repository. Newly added or modified services appear promptly in the cashier POS after save. Archived/inactive services cannot be selected for **new** orders, but old order/receipt/job-ticket snapshots remain readable and correct. Existing manual line configuration and print workflows must not regress.

### SVC-005 — Category administration and safe changes

Changes to service/category names, status or default rates must not delete or silently rewrite historical information. Use safe archival semantics for referenced services/categories; handle references consistently. Avoid opaque dynamic formulas, unsafe user-entered expressions or evaluation of executable strings. No backend mutations.

### SVC-006 — Service acceptance

The Administrator can create a **new banner-printing service**, assign a category and a demonstrative price, save it, switch to a cashier demo session, select the service, configure a valid order, and see accurate totals, printable item descriptions, and service snapshots; then update the service price and prove historical orders stay unchanged.

## 5. MAT — Order-linked material consumption and branch inventory

### MAT-001 — Existing stock items, units and service relationships

Reuse existing inventory items and **branch-specific** balances. Add an optional **materials required/consumed** configuration to each service (a simple material recipe or bill-of-materials template, not a separate manufacturing ERP): select existing inventory material(s), quantity per service unit or per job, and its **unit of measure** (e.g., roll, sheet, piece, meter). Require compatible units; **five rolls means quantity 5 roll units, not LKR 5,000 or five sheets**. Use controlled whole-unit quantities for count-based stock; if existing inventory supports measured materials, use explicit precision rules rather than unsafe floating-point conversions.

### MAT-002 — Explicit per-order / per-job usage input

In POS or production job details, show an understandable **Materials for this job** section. Pre-fill suggested material lines from the configured service template, but permit authorized users to select/add materials, inspect branch availability and adjust the **actual quantity needed** for a specific job. This supports the client's example where a custom banner job uses five rolls, even if the catalogue has another suggested amount. Make material costs **separate from sales prices** unless an approved pricing rule explicitly links them. A service without a recipe remains orderable without fabricated stock use.

### MAT-003 — Exact deduction trigger: confirm actual usage

**Do not deduct inventory merely because a service was selected, an order form was edited, a quote was prepared, or a draft was saved.** Use an explicit, prominent action such as **“Confirm & record material usage”** at an appropriate order confirmation/production step. A confirmed action records **actual consumption** in the same logical client-side mock-store mutation as the associated usage record; if insufficient stock, reject the operation without leaving partial updates. If the application offers one combined **Save order & record usage** action, it must clearly preview the stock impact and only commit after explicit confirmation. If stock consumption has not been confirmed, label quantities **Planned / Not deducted**.

### MAT-004 — Deductions and movement evidence

For each confirmed consumption, record a uniquely identified immutable-in-demo movement with **order ID, job/line reference, service, inventory item ID, branch, unit, quantity, demo actor, timestamp, reason and before/after quantity**. Reduce stock **only at the order's production branch**. Reflect the new quantity immediately in Inventory, stock movement history, low-stock indicators and the relevant job detail. Do not move stock between branches; existing **stock transfers** are a separate operation. Show per-order material consumption history.

### MAT-005 — Idempotency, re-entry and correction

Ensure double-clicks, retrying a submission, reopening a job, re-rendering, refreshing or reloading **cannot deduct the same confirmed usage twice**. Use a stable usage/event key and duplicate prevention in the mock domain/repository. Editing an **unconfirmed planned** quantity is free. A **confirmed actual usage** entry is a recorded historical event: changing the order or cancelling it must **not silently restore physically used materials**. Instead, provide a clearly labeled, authorized **Correct recorded usage** action that creates a traceable compensating movement with a reason (for example, correct an erroneously recorded quantity). Any additional actual use is a separate event. No destructive rewriting of movement history.

### MAT-006 — Stock safety and edge cases

Reject zero/negative/invalid usage, wrong units, unknown/archived stock items where inappropriate, mismatched branches, insufficient branch stock and duplicate posting. Apply a documented **no-negative-stock** demo default unless an explicitly existing approved policy says otherwise. Consider multiple order lines using the same material: aggregate and validate the total against available stock before committing consumption. Maintain consistency with manual stock adjustments/transfers, including after a customer switches branches or an order is edited. Never fabricate a successful save when the local operation failed.

### MAT-007 — Traceability without inventing accounting

Customer outstanding balances come **only from customer charges and payments**; raw-material consumption must **not** reduce or increase a customer's receivable by itself. Avoid inventing profit/cost-of-goods calculations or automatic purchasing. Keep branch stock availability separate from service pricing and from company-wide stock totals.

### MAT-008 — Core example and acceptance

Use a **fictional example**, not real business rates:

1. Branch 1 has **20 banner rolls** in demo stock (or an equivalent controlled fixture).
2. Administrator creates/edits the **Banner Printing** service and optionally maps banner rolls as a suggested material.
3. Administrator creates **ABC Company** as a saved Business customer.
4. Branch 1 cashier selects ABC Company, creates a banner order and records **5 rolls** as the confirmed actual material used.
5. **Only upon confirmation**, Branch 1 roll stock changes from **20 → 15**; Branch 2 is unchanged. Order and inventory history show the same movement ID/reference.
6. Reload the browser and revisit the order: stock remains **15**, not 10; repeated confirmation cannot duplicate the event.
7. If the order total is a fictional **LKR 3,500** and ABC pays **LKR 1,000**, the customer order outstanding is **LKR 2,500**. A later recorded payment of **LKR 500** updates it to **LKR 2,000**. Reports, order details and customer views agree.
8. Correct an erroneous material entry through an explicitly reasoned compensating event; demonstrate safe invalid-stock rejection and preservation of movements.

## 6. Cross-module consistency and architecture requirements

Keep existing Next.js App Router, TypeScript strict mode, React, Tailwind, shadcn/ui, React Hook Form/Zod where used, feature-oriented modular organization, centralized tokens and pure deterministic domain functions. **Extend existing files/contracts carefully** instead of parallel customer lists, separate POS price engines, disconnected catalogue fixtures or independent stock counters.

- Use **stable IDs** for customers/services/materials and immutable snapshots for historical line descriptions and accepted prices. Let foreign-key-like references remain resolvable in demo state after archive.
- Treat a full action affecting related mock entities as one **validated, consistent logical state transition**; do not present this as a real ACID database transaction. Preserve the repository's existing stale-write/reset protection.
- Add versioned browser-storage migration/validation, backward-compatible fixtures and an explicit **Reset demo data** path. Recover safely from missing/legacy references, without silent data loss.
- Preserve role/branch-aware UI, current search/filter routes, printable receipts and production tickets. Receipts show customer name where applicable and accepted prices; job tickets may show planned/confirmed materials and their units when operationally useful. Avoid exposing internal-only notes on customer receipts.
- Ensure existing daily/weekly/monthly and branch reports still use the authoritative-for-demo order/payment records; do not invent customer debt totals or alter financial reporting definitions due to inventory use.
- Confirm responsiveness at 320, 360, 390, 430, 768, 1024, 1280, 1440 and 1920px when browser tools permit; keyboard, focus return, accessible drawers, 200% text, error recovery, touch targets, reduced-motion and meaningful statuses. Apply **WCAG 2.2 AA** where relevant, ISO 9241/Nielsen/HCI handbook guidance and applicable engineering handbook quality controls. No blanket compliance claim.
- Maintain Pressline's premium, calm visual language. Make the workflows exceptional for nontechnical shop workers: fast returning-customer lookup, clear outstanding figures, understandable service setup, visible material quantities/units and safe confirmation of stock impact.

## 7. Git governance — execute, don't merely describe

**Do not change, checkout for editing, or merge into `main`.** Before changes, record actual `main` and `develop` SHAs and protect unrelated uncommitted work. Create separate meaningful topic branches from the inspected local integration tip, for example:

```text
feat/CUST-001-customer-directory
feat/CUST-002-pos-customer-lookup
feat/CUST-003-customer-history-balances
feat/SVC-001-admin-service-catalogue
feat/SVC-004-dynamic-pos-services
feat/MAT-001-service-material-mapping
feat/MAT-003-record-inventory-consumption
fix/MAT-005-duplicate-consumption-guard
test/CUST-SVC-MAT-end-to-end
docs/CUST-SVC-MAT-handover
```

Choose repository-compatible branch names (trim the illustrative leading spaces above). A single feature can have multiple **atomic commits**; do not make one huge final commit or one meaningless commit per keystroke. **Track every meaningful functionality creation, update, edit, fix, removal, refactor or revert** with a precise Conventional Commit message including the affected feature IDs and actual validation evidence, e.g.:

```text
feat(customers): add searchable saved-customer directory

Requirement: CUST-001, CUST-002
Why: allow repeat-company selection without re-entering details
Behavior: editable demo customer records and POS customer selection
Validation: <list only tests actually executed>
Limitations: browser-local demo; no production customer database
```

```text
feat(inventory): record order-linked material usage once

Requirement: MAT-002, MAT-003, MAT-004, MAT-005
Why: a banner job consuming five rolls must update branch stock
Behavior: confirmed movement debits only the correct branch; duplicates blocked
Validation: <list only tests actually executed>
Limitations: browser-local stock ledger; no backend transaction or device sync
```

Stage intended paths explicitly; review `git diff --cached` and `git diff --cached --check` before commits. Test feature branches, then integrate them into **local `develop` with traceable non-fast-forward merges** when consistent with the existing project workflow. Keep topic branches and their commit history; **no push, remote PR, auto-merge, history rewrite or deployment** without separate authorization.

Update as changes occur: `docs/feature-register.md`, `docs/change-log.md`, `docs/requirements-coverage.md`, `docs/git-audit.md`, `docs/decisions.md`, `docs/hci-acceptance-matrix.md` and `FRONTEND_STATUS.md` where present. Each requirement must map to files/UI, branch, actual commit SHA, merge SHA, tests and final status. Record SHA references in **subsequent ledger commits** (a commit cannot include its own final hash). Preserve historical audit entries; don't retroactively invent successful tests. Report the actual final clean/dirty status and SHA values.

## 8. Mandatory verification and acceptance gates

**Run and repair actual checks**, using repository scripts and supported environments: install/build as appropriate, TypeScript, ESLint, formatting, existing unit/component tests, new focused domain tests and Playwright end-to-end tests. Capture real screenshot evidence for customer selection/detail, admin service creation, POS selection, job materials and inventory movement, desktop/mobile. Do not merely duplicate earlier reported test counts; report the **new totals actually executed** and distinguish baseline failures from regressions.

At minimum verify:

- Add/modify/archive customer; reload; quick-select returning individual/company; walk-in remains possible; wrong-branch cashier cannot view other-branch financial history.
- Create a customer order; record advance and later payment; order details, customer outstanding and reports recalculate identically; older orders and price snapshots survive customer/service renames and archiving.
- Add/modify/archive a service and category; newly added active service appears in POS; disabled service disappears from new-order choices but stays in old tickets/orders; original six services still function.
- Configure a material suggestion; override job consumption to 5 rolls; confirm and debit Branch 1 only, record movement; reload/retry without double-debit; reject insufficient stock and mixed units; correct posted mistakes using traceable compensating entries; transfers still work independently.
- Existing POS, payment, inventory, transfers, charts/reports, SMS preview, browser print, settings and demo reset regression suites remain valid.
- HCI: keyboard navigation, drawer focus/dirty-state behavior, understandable labels/errors, contrast, mobile reflow and no dead controls. Keep demo-vs-live labels truthful.

**Definition of Done:** A returning customer can be selected in seconds; an Administrator can manage service names/descriptions/categories/prices/material templates without touching code; a cashier can use that service for the customer, record a payment and confirmed inventory usage; customer history/receivable and branch stock agree everywhere; existing workflows and history are preserved; automated checks and visual inspection are documented; **all changes are Git-traceable and `main` is unchanged**. If any gate remains unverified, describe it precisely rather than claiming full completion.

## 9. Execute now

Proceed directly with repository audit → safe feature branches → shared demo model/storage evolution → Customers → Service Catalogue → POS integration → material consumption → integrated UX polish → regression tests → documentation and Git handover. Prioritize **working connected behavior** over adding more decorative UI. Do not stop after planning, scaffolding, unconnected screens or placeholder CRUD. Where an unconfirmed business policy materially affects real operations, use a **visible, reversible frontend-demo convention**, document it and keep backend integration decisions for a later approved phase.

**Deliver the implemented local frontend demonstration and a concise final report with changed modules, actual commands/test outcomes, branch/commit/merge references, `main` SHA verification and explicit confirmation that no backend operation was performed.**
