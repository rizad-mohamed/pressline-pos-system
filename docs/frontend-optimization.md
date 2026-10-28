# Frontend optimization and readiness · 2026-10-29

## Inspected baseline

Starting revision: `develop` c52a3e27d2bc8df5ce63c613f607b3bbc1066d07, clean tree. `main` remains the initial e0b62dc baseline. All retained mobile topics are integrated; interrupted MOB-003 was subsequently completed, tested and handed over by MOB-007. No prior work was discarded. Inspected source/routes, branch graph, feature register, validation history, mobile implementation/gallery, HCI matrix/handbook transcription, engineering handbook, architecture and backend contracts.

Node 24.14.1 / npm 11.11.0; Next 16.4.3 / React 19.3.1; strict TypeScript, npm lock, Vitest/jsdom, Playwright. PowerShell requires `npm.cmd`/`npx.cmd`. Baseline typecheck, lint, formatting, production build and 91 unit/component tests across 20 files passed. Generated assets: 34 JS files, 1,250,747 bytes / 397,703 gzip; CSS 60,120 / 12,262 gzip. These are aggregate assets, not initial transfer. Current npm advisory audit: zero known advisories. Prior 78 Chromium passes remain historical until rerun.

## Actual module inventory

Thirteen user-facing areas are implemented, rather than an assumed eight. Final results are recorded after execution.

| Area                     | Implemented behavior                                                             | Existing regression evidence to rerun                 |
| ------------------------ | -------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Dashboard                | Branch/all summaries, independent production/payment totals                      | foundation, integrated, mobile navigation             |
| POS                      | Manual/service lines, saved customers, tab draft, advance, review/save           | pos, premium-pos, summary-visibility, mobile-viewport |
| Orders and payments      | Search/filter/sort, details/edit, balances, payment history                      | orders, integrated, resilience                        |
| Production and materials | Separate production flow, plans, confirmed use and compensating correction       | materials, connected-workflows                        |
| Customers                | Shared directory, archive/reactivate, explicit linking, branch financial history | customers, customer-reflow, connected-workflows       |
| Services and pricing     | Categories, availability, versioned prices/recipes, accepted snapshots           | services, pricing, connected-workflows                |
| Inventory                | Branch balances, materials, adjustment, movement history, no-negative default    | inventory, materials                                  |
| Transfers                | Validated instant mock transfer and paired movements                             | transfers, integrated                                 |
| Reports                  | Colombo date cohorts, collected and outstanding independently                    | reports, domain report tests                          |
| Printing                 | Separate receipt and production ticket                                           | printing, connected-workflows                         |
| SMS preview              | Unsent fictional preview from report engine                                      | sms                                                   |
| Settings                 | Demo labels/preferences/reset, fixed team display                                | settings, resilience                                  |
| Profile/access shell     | Demo selector/preferences, branch UI restrictions, navigation                    | foundation, mobile-navigation, access/entry tests     |

Authentication and User Management remain unfinished production responsibilities. There are no backend endpoints, Supabase clients, SQL/migrations/RLS, payment/SMS integrations or production API operations to test. Mock integration coverage is not backend security verification.

## Confirmed defects and planned corrections

- OPT-001: Production Chromium at 390×844 reproduced administrator Review Order remaining in Current order when no branch is selected. The required branch field is behind the modal; the valid cashier test does not cover this path. Preserve desktop submission, share the validated review callback, and return focus to invalid underlying fields after closing the summary. Keep advance errors within the summary.
- OPT-002: Operational mobile rows remain wide tables; production/payment/availability badges lie outside the initial viewport. Adapt the same semantic rows to labeled mobile cards, showing statuses without horizontal scrolling. Preserve desktop cards/tables and financial projections.
- OPT-003: Establish production measurements, import/dependency reachability, cross-engine and responsive QA; remove only proven unused source/dependencies. No speculative memoization or architecture changes.
- OPT-004: Record source security/secret/dependency review, Lighthouse and operational handoff. Full security-skill execution is incomplete because its isolated OS sandbox and Windows artifact validation are unavailable; ordinary frontend QA is separate.

## Delivery boundary

No remote was configured at baseline; GitHub CLI is absent and the GitHub plugin is not connected. Read-only `git ls-remote` against the supplied repository succeeds but advertises no HEAD/main/develop references. This does not establish protections, required reviews, write access or hosted Actions success. Main integration must await verified checks and the approved review workflow; local results cannot substitute for hosted CI. No deployment is in scope.
