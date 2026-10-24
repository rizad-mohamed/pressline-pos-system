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
