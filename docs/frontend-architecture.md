# Frontend architecture

## Boundaries and state flow

Next.js App Router routes in `src/app` are thin server wrappers. Interactive feature modules are client components. Root `DemoProvider` exposes one external-store snapshot with `useSyncExternalStore`; a stable empty server snapshot prevents SSR/local-storage hydration mismatches. The shell gates client rendering by selected demo role and branch. Static HTML does not contain a preloaded real customer dataset.

| Layer              | Actual implementation                                    | Responsibility                                                                                                                                            |
| ------------------ | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Routes/layouts     | `src/app`, `components/layout/shell.tsx`                 | Real URLs, loading/error/not-found routes, landmarks and role-aware navigation                                                                            |
| Shared UI          | `components/ui`, `components/shared`, `styles/brand.css` | Official shadcn primitives and owned Button/Sheet/confirmation wrappers over Radix, labels, feedback, tables, skeletons, focus, tokens and reduced motion |
| Features           | `src/features/*`                                         | Cashier POS/history/jobs/payments; administrator inventory/transfers/pricing/reports/SMS/settings; profile/print views                                    |
| Domain             | `src/domain`                                             | Zod schemas, exact cents, quotes, order/payment states, branch rules, inventory/transfer invariants, report cohorts and configuration commands            |
| Adapter            | `src/data/repository.ts`, `contracts.ts`                 | Typed `read/execute/subscribe`, local persistence and recoverable Result errors; adapter owns demo identity context                                       |
| Fixtures/integrity | `seed.ts`, `validation.ts`                               | Fictional source dataset and cross-record references, totals, payment chronology, stock ledger and transfer validation                                    |

Flow: form → Zod validation → typed command → current demo account → pure domain calculation/mutation on a clone → full integrity validation → durable browser save → publish one new snapshot → all subscribed modules update → success feedback. Failure leaves the previous published/saved data intact. No page maintains independent financial fixture numbers.

## Domain invariants

- `OrderLine` stores options, quantity, effective unit/setup cents, total and price-rule version. Catalogue edits affect only future quotes. Monetary summation is centralized; binary floating point is used only for display division, not transaction arithmetic.
- `Payment` events reference orders independently. Sum of payments determines Unpaid/Partial/Paid and balance. Production follows the separately controlled provisional four-state flow; completion does not settle a balance.
- One production-job projection exists per order; there is no contradictory second job dataset. Receipts/tickets derive from that order and its payment events.
- Inventory quantities must reconcile with movements. A transfer changes source, destination, transfer reference and two movements inside one cloned demo update or fails without publishing. Inactive materials remain referenced by history. Units cannot be silently converted.
- Reports use Colombo calendar dates. Creation-cohort value, payment-date collections and cumulative end-of-period outstanding are distinct. SMS uses exactly that report engine, with a validated reporting-date cutoff.
- Cashier commands/checks are branch-scoped; administrator reads may select all branches, while transaction commands require one explicit branch. These are demo restrictions, not a real authorization boundary.

## Persistence and resilience

The browser envelope has schema version 1 and a local revision. Hydration validates JSON, schema, unique references, financial snapshots, payment chronology, stock movement sums and paired transfers. Corruption exposes read-only fixtures and explicit reset; it does not silently overwrite saved content. Storage quota/permission failure returns a typed error before state publication. The adapter compares the exact last loaded/saved serialization to detect many stale-tab writes, including deletion/reset; this is not cross-process locking or cloud reconciliation.

Tab-local POS drafts are validated and associated with a demo account. Only valid drafts are restored; sensitive real data is prohibited. Navigation/resizing preserves suitable work; dirty drawer closure asks whether to discard. Reset replaces only the app's own demo keys/records and keeps the account selected.

## UI, motion and performance

Canonical color, typography, spacing, radius, shadow, focus and motion tokens live in `src/styles/brand.css`. Tailwind v4 is configured; feature classes consume the same tokens. Manrope is self-hosted with next/font/local and an OFL license; Nirmala UI/Segoe UI/Arial supply fallback glyphs without remote font fetching. Native labeled controls, Radix modal primitives and Lucide icons provide consistent interaction. POS is a workspace; contextual forms/details are sheets. Forms use React Hook Form/Zod and preserve input on errors.

SVG charts add no charting dependency; exact values and zero baselines are exposed. Skeletons represent actual hydration/route loading. Small control/sheet transitions honor system and saved reduced motion. Desktop/tablet/mobile use shared semantic tables inside intentional scrolling containers. Build assets are measured by `scripts/bundle-report.mjs`; this does not claim real-device runtime performance.

## Future replacement

`PosRepository` is structurally implemented by the mock adapter and returns typed Results. The current DemoData envelope, account selector, fixture cardinalities and local persistence are deliberately demo-specific. A future remote adapter must map authorized server projections into UI state, replace account entry with trusted identity, replace local transactional execution with server operations, and replace local invalidation with authenticated Realtime plus authoritative refetch/reconciliation. Types do not make the demo a drop-in secure production backend.

Keep the target a Next.js/Supabase modular monolith. No SQL, migrations, RLS policies, endpoints, SMS dispatch, deployment or production integration is supplied in this phase.

## Premium presentation composition

The 104px labeled navigation rail, warm paper canvas, controlled lime actions and shared numeric typography use canonical brand.css roles. Thin routes and business modules remain in place. Official shadcn Tooltip/ToggleGroup/Card/Input/Badge/Skeleton/Separator use the existing local class utility and token mapping; tested Button/Sheet/confirmation interfaces remain compatible. Current single ToggleGroup renders radio semantics.

Service catalogue presets compose existing print options and quoteLine; they replace only the untouched initial line, otherwise append. They do not create a new price catalogue or stock behavior. Empty tab drafts are valid; submitted order validation still requires at least one item. Desktop/mobile render one summary instance. Mobile edit transfers focus after Radix close; the desktop summary measures available height, scrolls its named body and preserves total/balance/review footer, with page scrolling for short windows. These are presentation/draft changes; domain and data modules have no redesign diff.

No route entrance animation, third-party font/image requests, chart package, backend handler or provider integration was introduced. See visual-design-system.md and the production gallery for the final component/responsive contract.
