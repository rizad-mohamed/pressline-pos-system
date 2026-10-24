# Connected customer, service and material follow-up

Date: 2026-10-24, Asia/Colombo. Authorized source: references/Pressline_Followup_Specification.md. Starting develop 60ef6695c34cc6d0e8d3caea8d74f1fc33c1ddfa; unchanged main e0b62dcb03330778fcdc8b6b1a4e5cc421beb604. Clean working tree and retained local branch topology inspected; no remotes. Preserve the working application and premium design. No backend/provider/database/deployment operations.

## Approved evolution and working conventions

The follow-up explicitly authorizes extending the frontend domain/store and recording confirmed actual stock use. This supersedes the earlier no-consumption convention. Selecting a service, preparing a quote, saving an order and advancing production do not debit inventory. Only explicit confirmed usage does so.

One v2 browser-demo envelope retains the existing storage key and safely migrates validated v1 records in memory without resetting or silently matching free-text customers. Preserve legacy prices, payments, order snapshots and stale-write protection. Malformed data stays untouched behind recovery. Migration is saved only by a successful explicit local operation.

Customers are reusable across both branches. Cashiers may create customers for checkout; only administrators edit/archive/reactivate profiles. All customer financial projections use permitted order/payment records; cashier figures say At this branch, administrator figures are business-wide. Archiving preserves history. Explicit linking of a legacy order changes association, not its historical name snapshot. Fictional data only; browser storage is not secure production storage.

Services use either existing print-rate/options calculations or a transparent integer-cent unit rate plus per-line setup. No executable formula or new accounting rule. Catalogue versions and accepted service/name/category/material snapshots preserve old orders. Inactive/archived services and categories cannot be used for new selections. Existing manual printing remains.

Stock remains whole units for every existing material, including meters: no fractional conversion is introduced. A material recipe suggests quantity per service unit or per job. Actual planned quantities can be overridden in a saved job plan. The confirmed plan ID is a stable duplicate guard across refresh/re-entry; additional use requires a new explicit plan. Usage and movements commit together in the existing validated local clone. No-negative-stock default and aggregate checks across shared materials apply. Administrator correction explicitly reverses an erroneous event with a compensating movement/reason; a corrected actual amount is a separate recorded event. Physical use is never silently restored.

## UI and verification direction

Reuse installed shadcn/Taste and canonical Pressline paper/ink tokens, local Manrope, labeled rail, flat tables, scoped figures and accessible dirty-guarded Radix sheets. Customers answer who owes what in the permitted scope; service setup answers what staff can sell and how it is quoted; job material review answers exactly what branch stock changes on confirmation. No new dashboard decoration.

Baseline tests are running; record their actual completion separately. Extend meaningful domain/migration/repository and production browser checks for the complete ABC Company / Banner Printing / five-roll scenario, later payment, snapshot survival, archive, invalid units/aggregate stock, correction, duplicates/reload, branch isolation and existing workflows. Inspect desktop/mobile and nine widths, 200% text, keyboard/dirty drawers, axe, print and reduced motion. No real AT/device/printer or production-conformity claim.

## Storage foundation checkpoint

Baseline completed: 58/58 tests. Added v2 entity/snapshot schemas, six seeded service records, fictional customer records and banner-roll stock, plus a pure validated v1 upgrade that keeps legacy orders unlinked and never writes during hydration. Existing storage key, financial records and stale-write protection remain. Three new migration/recovery tests passed with the seven repository tests. Typecheck and lint passed.

First full 61-test checkpoint had four failures: three assumed A4 remained the first fixture material, and one used now-supported version 2 as its unsupported-version case. Preserved A4 ordering by appending banner rolls; changed the unsupported-version boundary to 99 without weakening corrupt financial/ledger checks. Complete rerun: 61/61 across 15 files passed. Material posting and its cross-record invariants remain a later acceptance unit; no consumption action exists yet.

## Customer directory checkpoint

Customer commands now validate optional/international contact data, immutable IDs, likely duplicates with explicit separate-record acknowledgment, admin-only profile editing/archive/reactivation, optimistic edit metadata and safe branch-authorized legacy linking without rewriting name snapshots. Customer ledger projections derive solely from permitted orders and payments. The directory/detail routes and create/edit sheets reuse existing UI and role conventions; cashier creation is allowed and labeled.

Actual checks: typecheck and scoped ESLint pass with no warning after replacing RHF watch with useWatch. Five customer domain and three migration tests pass. Two customer browser journeys pass on the existing dev server, including persistence, rename/archive/reactivation, optional contact and dirty/Escape behavior. One earlier navigation timeout occurred while source/HMR was changing; trace retained, stable-source rerun passed without weakening assertions. Final production verification is still required. Desktop directory/editor and desktop/mobile profile visually inspected; no page errors captured. POS lookup and the New order query handoff are the next integration unit, not yet claimed verified.

## Managed catalogue checkpoint

Administrator services/category commands and sheets support create/view/edit, unique codes/names, optimistic versions, active/inactive/archive/reactivation, configurable existing print options, transparent unit-rate/setup pricing and compatible whole-unit material suggestions. The old global print-rate editor remains in Services & pricing. Accepted line snapshots now support service name/code/category/version and material template snapshots without rewriting earlier orders. No new POS selection source is claimed until the next unit replaces the fixed cards.

Actual checks: typecheck and scoped ESLint pass. All 29 service/original pricing/domain tests pass, including six new catalogue cases for exact banner pricing, historical snapshots, stale versions, archive/category safety, invalid rates/units/recipes and supported print defaults. Two browser journeys pass: the original price-version scenario and full category/service/recipe CRUD. Desktop and 390px service editors visually inspected with persistent save footer. Existing dev server is reused; installed Next 16 docs confirm dev output is separate, so later production can run on another port without stopping it.

## POS/customer/catalogue integration checkpoint

Removed the fixed six-card source array; the original six examples are seeded shared records. Active catalogue/category records now render and price the POS. Custom unit services omit irrelevant paper/duplex controls; accepted service specifications and sales units appear consistently in order history/details/review/receipts/tickets. Manual printing and the original current-order controls remain. Saved-customer search/quick view, optional walk-in, quick creation, change/remove, profile-to-POS handoff and explicit legacy linking are connected to the shared customer ID with historical name snapshots.

Actual checks: typecheck/scoped lint pass, 15 focused sheet/form/service/customer tests pass, and all six connected/original premium POS browser scenarios pass. The fictional banner order is LKR 3,500, advance 1,000, balance 2,500; a later 500 payment changes the customer/order balance to 2,000. Branch 2 sees no Branch 1 amount; service/customer rename and archive leave receipt snapshots unchanged. Quick-add initially exposed a real portal-submit bug (five of six scenarios passed): the child form also opened POS review. Stop submit propagation at the shared Sheet boundary; the added component regression verifies child submits once and parent never submits. All six browser scenarios then passed. This follows React's documented [portal event propagation](https://react.dev/reference/react-dom/createPortal); no assertion was weakened. Failed trace retained locally. An initial test invocation was interrupted to correct its payment-label locator to the inspected existing Payment amount label; no pass claimed for that interruption.

## Explicit material usage checkpoint

Saved jobs now carry an editable plan, populated from accepted recipe snapshots. Planning, checkout and production never debit stock. Review combines all quantities per material at the order branch; explicit confirmation records one stable event and all before/after movements in the same validated mock-store transition. Posted plans cannot be edited or posted again. Additional use is a separate plan. Administrator correction fully compensates one erroneous event with a required reason; original evidence remains, and corrected actual use is a new event. Counts remain whole stock units (including meters), with no conversion or negative stock. Up to 600 recipe rows cover 30 order items × 20 suggestions.

Ten material domain/repository tests cover aggregate stock, invalid units/counts, stale plans/tabs, branch scope, immutable corrections, reload duplicate guards, failed durable saves, transfers and financial independence. All 23 focused material/service/repository tests passed; a full checkpoint passed 83 tests across 18 files. Typecheck and lint passed after correcting a Map key type, test helper signature and escaped apostrophe; the unused test parameter warning was removed and lint reran clean. After the final validation refinement, all ten material tests and scoped formatting passed again. Final production integration remains pending.

The full browser banner workflow passed: stock 20→15 at Branch 1, Branch 2 unchanged, reload once, later payment 500 and balance 2,000, order metadata edit without restoration, cashier correction hidden, administrator compensating correction, separate corrected actual use, insufficient stock rejected, matching job/inventory movement, unchanged report metrics and receipt amounts. Initial browser run stopped at an incorrect test-only Save information locator; inspected existing Save order information, repaired the locator, preserved the failed trace, and reran successfully (48.6 seconds). Three-width material review/history images were captured with no page exceptions. Visual inspection found an existing success toast can overlap the mobile drawer footer during rapid successive operations; a dedicated follow-up fix and regression will resolve this before final delivery.

## Drawer notification correction

FUP-002 sets the canonical toast layer to 40, above navigation (30) and below modal overlays/sheets (50/51). A first center-point-only browser assertion passed despite the captured overlap; strengthened the regression to inspect the live layer order as well as bounds/hit testing. It failed before correction (80 above 51), then passed at 390/320/768 with the real confirmation action. Failed trace retained locally. All 22 token contrast checks and scoped formatting passed. Modal success feedback now appears after the closing drawer rather than covering the next drawer's action.

## Long customer-name correction

FUP-003 reproduced 3076px document width at a 1440px viewport/200% text in a focused browser test. The shared heading's flex child retained an unbroken name's intrinsic width. Constrain the child and selected-customer block to the available width and permit emergency word wrapping, preserving normal word boundaries. The same test then passed 200% profile text, 320px profile and selected POS customer; scoped formatting passed. Trace before correction is retained locally. The expanded QA topic remains unmerged until its unchanged assertions and complete production suite pass.

## Accepted service evidence correction · 2026-10-25

FUP-004 adds a domain regression for a custom job description followed by a catalogue rename. Before correction, 10 material tests passed and the new test failed: the event incorrectly labeled the service with the custom job description. Prefer the accepted service snapshot name, retaining manual-job descriptions as the fallback. All 11 material tests passed after correction; historical accepted catalogue identity, custom job text and current catalogue name remain distinct. The final gate sequence was interrupted before build to apply this correction; earlier completed typecheck/lint/format passed, and no completion is claimed for the interrupted unit run.

## Print specification label correction · 2026-10-25

FUP-005 restores explicit Binding: / Finishing: labels for print-model and legacy lines, alongside size/color/sides and the existing quantity/unit column. Unit-model jobs retain their accepted service summary and do not receive irrelevant print options. All three focused browser scenarios passed on the development server: the original unchanged receipt/ticket test and both connected customer/catalogue tests. No price, financial-privacy or print-media assertion was weakened. The complete 43/44 production failure trace remains retained; rebuild and rerun all 44 tests before final integration.
