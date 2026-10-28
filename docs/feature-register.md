# Feature register

## Frontend optimization lifecycle · 2026-10-29

| ID      | Scope                                                                  | Branch                             | State / evidence                                                                                                                                           |
| ------- | ---------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OPT-000 | Inspect preserved history/modules and actual production baseline       | docs/opt-000-readiness-baseline    | Baseline verified: 91 tests, strict gates/build, reproduced hidden branch validation; [record](frontend-optimization.md)                                   |
| OPT-001 | Mobile Review Order validation and functional regression               | fix/opt-001-mobile-review          | Verified: new regression fails before fix; four widths plus four preserved workflow/viewport tests pass in production. Source/merge backfilled next event. |
| OPT-002 | Visible, consistent operational mobile card states                     | fix/opt-002-mobile-status-cards    | Verified: 9 card/action/axe cases; 30 preserved responsive checks. Source/merge backfilled next event.                                                     |
| OPT-003 | Measured cleanup/performance and comprehensive regression              | chore/opt-003-verified-cleanup     | Verified: clean install, strict gates, 91 unit/component and 15 CI-mode production Chromium checks; net 24 fewer lock packages.                            |
| OPT-004 | Security/accessibility/Lighthouse/release and backend handoff evidence | docs/opt-004-readiness-handover    | Planned                                                                                                                                                    |
| OPT-006 | Dynamic customer-order history mobile statuses and snapshot regression | fix/opt-006-customer-history-cards | Verified: 2 production customer/history reflow regressions; unchanged accepted snapshots and balances at 320px/200% text                                   |

OPT-007 - `fix/opt-007-pos-validation-click`: correct stale quantity errors before pointer activation, preserve delayed initial validation and one-click Add/remove/undo; Verified: production build and 15 quantity/mobile-review checks across Chromium, Firefox and WebKit pass, retries=0.

OPT-008 - `fix/opt-008-enlarged-card-reflow`: font-aware phone card columns and capped spacing retain readable labels/status words/amounts at 320px and 200% text. Original production readability assertion fails (Production needs 127.6px; only 58px available). Verified: production build and all 30 card/customer-history checks pass in Chromium, Firefox and WebKit (5.8m, retries=0); focused lint passes.

Date: 2026-10-24. Requirement group meanings come only from the supplied prompt; per-ID approved baseline unavailable. All 25 HCI pages were read; evidence is scoped, not a 238-practice certification.

| ID        | Scope / dependencies                                                  | Priority | Branch                               | State                                                 | Checks / references                                |
| --------- | --------------------------------------------------------------------- | -------- | ------------------------------------ | ----------------------------------------------------- | -------------------------------------------------- |
| INIT-001  | Empty repository baseline                                             | P0       | main                                 | integrated e0b62dc                                    | inspected empty workspace                          |
| DOC-001   | Governance and reference inventory / INIT-001                         | P0       | docs/doc-001-governance              | integrated; e6fe30e / merge 7a24251                   | staged diff review                                 |
| INIT-002  | Next.js, strict TS, Tailwind, test/build tooling / DOC-001            | P0       | chore/init-002-nextjs-foundation     | integrated; 1db8851 / merge bbf89eb                   | typecheck, lint, build                             |
| UI-001    | Brand tokens and accessible primitives / INIT-002                     | P0       | feat/ui-001-design-system            | integrated; ca8225c / merge 3450f1f                   | component tests, responsive QA                     |
| DOM-001   | Pricing, payments, stock, reporting, fixtures, persistence / INIT-002 | P0       | feat/dom-001-demo-domain             | integrated; 5222108 / merge 8a16d16                   | Vitest domain invariants                           |
| FR-001    | Demo accounts, role shell, dashboard / UI-001, DOM-001                | P0       | feat/fr-001-demo-access              | integrated; 09a63ef / merge 3496cb1                   | role and route checks                              |
| FR-015    | Multi-item POS and review / FR-001                                    | P0       | feat/fr-015-order-composer           | integrated; 5d194a9 / merge 170515b                   | pricing/order tests                                |
| FR-021    | History, details, payments, production states / FR-015                | P0       | feat/fr-021-order-operations         | integrated; ec365a9, b8fc128 / merge f2c643f          | payments/status isolation                          |
| FR-024    | Receipt and separate job ticket / FR-021                              | P0       | feat/fr-024-print-documents          | integrated; c179434 / merge 26cfa80                   | print/E2E checks                                   |
| FR-033    | Inventory CRUD, adjustments, low stock / FR-001                       | P0       | feat/fr-033-branch-inventory         | integrated; a48906d / merge 61d10a4                   | validation/movements                               |
| FR-035    | Atomic mock transfers / FR-033                                        | P0       | feat/fr-035-stock-transfers          | integrated; 29f4eef / merge cec4b70                   | transfer invariants                                |
| FR-013    | Price configuration / DOM-001                                         | P0       | feat/fr-013-price-settings           | integrated; 4dd4c30 / merge 9d76688                   | historical snapshots                               |
| FR-042    | Period reports, branch/all scopes / FR-021                            | P0       | feat/fr-042-financial-reports        | integrated; 236276f / merge a5bc9de                   | date/cohort tests                                  |
| FR-047    | SMS config and unsent preview / FR-042                                | P0       | feat/fr-047-sms-preview              | integrated; bce92d2 / merge 6aeae5e                   | report consistency                                 |
| FR-008    | Team/branch/app/profile demo settings / FR-001                        | P1       | feat/fr-008-demo-settings            | integrated; 245e733 / merge 9da908d                   | persistence/reset                                  |
| TEST-001  | E2E, responsive, keyboard, accessibility review / all features        | P0       | test/test-001-workflow-validation    | integrated; 8a1e71f, dbf0e8c, b2027e7 / merge a7ad68c | Playwright + RTL                                   |
| DOC-002   | Coverage, handover, audit / TEST-001                                  | P0       | docs/doc-002-delivery-evidence       | integrated; b5a55b0 / merge b0e97df                   | history cross-check                                |
| DOM-002   | Correct future-dated current-day fixtures / DOM-001                   | P0       | fix/dom-002-fixture-timestamps       | integrated; 1f16dac / merge d091653                   | Early-day payment regression; HCI 03.09            |
| DOM-003   | Align typed read/command adapter contract / all features              | P0       | refactor/dom-003-repository-contract | integrated; f1c8aa9 / merge 4e38d19                   | Typed adapter parity and existing repository tests |
| DOM-004   | Guard saved-data changes across reset/removal / DOM-003               | P0       | fix/dom-004-reset-conflicts          | integrated; f93b732 / merge 5e0cdc5                   | Stale-tab reset/deletion regressions               |
| UI-002    | Form recovery, focus and responsive refinement / all features         | P0       | fix/ui-002-accessible-recovery       | integrated; afbdec8 / merge 4e17416                   | Keyboard, invalid quantity, zoom and layout checks |
| STYLE-001 | Consistent formatting / all source                                    | P1       | style/ui-003-source-formatting       | integrated; 500874a / merge 35beb00                   | Prettier, typecheck and lint                       |
| INIT-003  | Align tested Node prerequisites and clean unused tooling / INIT-002   | P0       | fix/init-003-supported-tooling       | integrated; aaa16dc, 6842180 / merge 312e165          | Engine/peer metadata, install, typecheck and lint  |
| UI-004    | Split POS presentation from orchestration / FR-015                    | P1       | refactor/ui-004-pos-composition      | integrated; 093dab5 / merge a67330b                   | Typecheck, lint, order and input recovery E2E      |
| UI-005    | Contain mobile table labels and keyboard scrolling / UI-001           | P0       | fix/ui-005-mobile-table-reflow       | integrated; 958ad70 / merge eb90b82                   | Document-width and ArrowRight scrolling regression |

## Premium enhancement lifecycle

All units are P0 for this authorized enhancement; lifecycle describes actual source events, not the original priority column. Completed topics are retained and integrated; the primary handover source/merge hashes are recorded below. The final audit-only commit follows that snapshot and is identifiable from the delivered tip.

| ID       | Change                                        | Lifecycle                         | Branch                                 | Source commits   | No-ff merges     | Evidence                                                                                    |
| -------- | --------------------------------------------- | --------------------------------- | -------------------------------------- | ---------------- | ---------------- | ------------------------------------------------------------------------------------------- |
| PREM-001 | Discovery and preservation audit              | created                           | docs/prem-001-redesign-audit           | eb20d7e          | f57771a          | Baseline/ref/tool inspection                                                                |
| PREM-002 | Reviewed skills and shadcn primitives         | created / updated                 | chore/prem-002-design-tooling          | b559192          | 8d7920a          | Config reused; source/license and CLI review                                                |
| PREM-003 | Premium tokens, type, entry and shell         | created / updated                 | feat/prem-003-premium-shell            | cf858b8          | a00dd86          | Responsive/keyboard and visual review                                                       |
| PREM-004 | Service workspace and responsive summary      | created / updated                 | feat/prem-004-service-workspace        | a4bbb44          | aefd582          | Existing rules, search/filter/edit/empty recovery                                           |
| PREM-005 | Operational and print craft                   | updated / deleted obsolete chrome | style/prem-005-operational-screens     | f80e521          | e802124          | Tables/chart/drawers, preserved workflows                                                   |
| PREM-008 | Long-content, focus and contrast repairs      | fixed                             | fix/prem-008-long-content-reflow       | 3603fbc          | c925c05          | Unicode/320px/landscape/reduced motion                                                      |
| PREM-006 | Premium production regression evidence        | created / updated                 | test/prem-006-visual-regression        | a7fbe66          | 7ce0aa5          | Responsive/keyboard/contrast/lab; full suite                                                |
| PREM-009 | Persistent desktop review footer              | fixed                             | fix/prem-009-summary-visibility        | 8808589, 53bb11c | 232c67d, f228a49 | New viewport regression, formatter-only correction                                          |
| PREM-010 | Keyboard-test focus synchronization           | fixed                             | test/prem-010-keyboard-synchronization | cdca073          | 5bbdef5          | Wait for Radix deferred focus; five repeated checks and full suite                          |
| PREM-011 | Natural active rail labels and edge clearance | updated                           | style/prem-011-navigation-labels       | a9e8fe7, a8c4c27 | 173ffec, 2182df5 | Complete words, adequate clearance, 33 production E2E and 21 final Taste combinations clear |
| PREM-007 | Final design/evidence/coverage handover       | created / updated                 | docs/prem-007-redesign-handover        | 965665f          | 4ead4f2          | 33 browser / 58 unit; gallery / Git audit                                                   |

## Connected frontend follow-up lifecycle

Requirements below come from the owner-approved follow-up; original FR/NFR references remain. Each requirement is registered before implementation. Exact source/merge references and final evidence are backfilled in the handover audit.

| ID       | Acceptance                                                                         | Topic                           | State / evidence                                                              |
| -------- | ---------------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------- |
| CUST-001 | Customer records and archive                                                       | feat/cust-001-directory         | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| CUST-002 | Fast POS selection and walk-in                                                     | feat/svc-004-pos-integration    | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| CUST-003 | Derived scoped customer history/balances                                           | feat/cust-001-directory         | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| CUST-004 | Derived scoped customer history/balances                                           | feat/cust-001-directory         | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| CUST-005 | Versioned migration and legacy preservation                                        | feat/cust-005-storage-evolution | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| CUST-006 | Accessible customer recovery and privacy                                           | feat/cust-001-directory         | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| SVC-001  | Managed catalogue, categories and safe rates                                       | feat/svc-001-managed-catalogue  | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| SVC-002  | Managed catalogue, categories and safe rates                                       | feat/svc-001-managed-catalogue  | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| SVC-003  | Managed catalogue, categories and safe rates                                       | feat/svc-001-managed-catalogue  | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| SVC-004  | Data-driven POS and historical snapshots                                           | feat/svc-004-pos-integration    | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| SVC-005  | Safe category changes and banner acceptance                                        | feat/svc-001-managed-catalogue  | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| SVC-006  | Safe category changes and banner acceptance                                        | feat/svc-001-managed-catalogue  | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| MAT-001  | Whole-unit service material recipes                                                | feat/svc-001-managed-catalogue  | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| MAT-002  | Explicit planned/confirmed job usage, atomic movements, idempotency and correction | feat/mat-003-confirmed-usage    | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| MAT-003  | Explicit planned/confirmed job usage, atomic movements, idempotency and correction | feat/mat-003-confirmed-usage    | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| MAT-004  | Explicit planned/confirmed job usage, atomic movements, idempotency and correction | feat/mat-003-confirmed-usage    | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| MAT-005  | Explicit planned/confirmed job usage, atomic movements, idempotency and correction | feat/mat-003-confirmed-usage    | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| MAT-006  | Explicit planned/confirmed job usage, atomic movements, idempotency and correction | feat/mat-003-confirmed-usage    | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| MAT-007  | Explicit planned/confirmed job usage, atomic movements, idempotency and correction | feat/mat-003-confirmed-usage    | verified frontend; exact files/source/merge/tests in requirements-coverage.md |
| MAT-008  | Explicit planned/confirmed job usage, atomic movements, idempotency and correction | feat/mat-003-confirmed-usage    | verified frontend; exact files/source/merge/tests in requirements-coverage.md |

Cross-feature verification: test/fup-001-connected-workflows. Final documentation: docs/fup-001-handover. Scope audit: docs/fup-000-scope.

FUP-002 · `fix/fup-002-drawer-notifications`: reproduce and correct success-toast overlap of a subsequent mobile drawer action; focused browser regression and production gate required.

FUP-003 · `fix/cust-006-long-name-reflow`: repair the observed long customer-name overflow at 200% text; preserve the failing assertion and verify mobile and focus recovery.

FUP-004 · `fix/mat-004-service-evidence`: preserve the accepted catalogue service name in material evidence even if staff customize the job description or the catalogue is later renamed.

FUP-005 · `fix/svc-004-print-specification-labels`: restore explicit Binding / Finishing print-job labels while preserving unit-service specifications; original printing assertion must pass unchanged.

FUP-006 · `fix/fup-006-workflow-orientation`: classify customer detail under Customers for breadcrumb/current-link orientation and use sentence case for material context; preserve customer reflow assertions.

Final follow-up: all 20 exact IDs verified in the connected local frontend; 84 unit/component and 44 production browser tests pass. FUP-002/003/004/005/006 are corrected and included in the final gate. `test/fup-001-connected-workflows` is verified/integrated. `docs/fup-001-handover` maintains this handover and subsequent hash backfill; its own final hash is reported at delivery.

Follow-up handover provenance backfilled: `docs/fup-001-handover` primary source `06da62a0a8f7ca8fbe999ad1143e1b0c13e741b7`, develop merge `d1c3e900448c22fbc4990c5dbb4911f5e8633b5f`. Actual primary snapshot: 50 registered/integrated retained branches and clean tree. The final audit-only commit follows on this same topic and is reported at delivery; application behavior and test counts are unchanged.

## CI continuation · 2026-10-25

| ID      | Scope                                                                          | Branch                     | State                                             | Validation                                                                                    |
| ------- | ------------------------------------------------------------------------------ | -------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| CI-001  | Repeatable locked frontend quality workflow and clean-checkout type generation | chore/ci-001-quality-gates | integrated; 817327f / merge 41a97ef               | Fresh install, zero advisories, strict gates, 84 unit and 44 production Chromium tests passed |
| AUD-001 | Final CI provenance, source security review and honest limits                  | docs/aud-001-final-review  | verified documentation; final integration follows | Fresh CI evidence, Git audit and documentation checks                                         |

## Mobile refinement · current state 2026-10-28

Opened 2026-10-25; recovered 2026-10-27. Final shared gate: 91 unit/component and 78 CI-mode production Chromium checks, strict gates and focused Chromium/Firefox/WebKit checks passed. Exact full hashes, failed checkpoints and physical/hosted-CI limits are in [Git audit](git-audit.md), [implementation](mobile-refinement.md) and [validation](validation-log.md). Handover commit/integration hashes necessarily follow this document snapshot and are reported at delivery.

| Unit                    | Retained branch                                    | Source              | Integration         | State                                                |
| ----------------------- | -------------------------------------------------- | ------------------- | ------------------- | ---------------------------------------------------- |
| MOB-000                 | `docs/mob-000-scope`                               | `fdf5e69`           | `bda704a`           | Completed and integrated                             |
| MOB-001/MOB-002/TAB-001 | `feat/mob-001-center-dashboard-bottom-tabs`        | `eeb6577`           | `9a29ad4`           | Completed and integrated                             |
| MOB-003                 | `feat/mob-003-mobile-pos-order-experience`         | `30fc5ac`           | `a08211c`           | Completed and integrated                             |
| MOB-004                 | `feat/mob-004-mobile-management-screens`           | `e2504c2`           | `eaaab28`           | Completed and integrated                             |
| MOB-005 reflow          | `fix/mob-005-enlarged-text-and-labels`             | `9749220`           | `06b3f82`           | Completed and integrated                             |
| MOB-005 focus           | `fix/mob-005-webkit-focus-return`                  | `2eb89d8`           | `29160a7`           | Completed and integrated                             |
| MOB-005 More            | `fix/mob-005-more-sheet-height`                    | `3a77cfa`           | `c51b4c0`           | Completed and integrated                             |
| MOB-005 landscape       | `fix/mob-005-landscape-safe-gutters`               | `6cefbee`           | `65e8f63`           | Completed and integrated                             |
| MOB-006                 | `test/mob-006-responsive-accessibility-regression` | `12d41fe`           | `bb27c36`           | Completed and integrated                             |
| MOB-007                 | `docs/mob-007-mobile-handover`                     | Final handoff / Git | Final handoff / Git | Verified handover; integration follows this snapshot |
