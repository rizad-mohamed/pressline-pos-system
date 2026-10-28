# Frontend optimization and production-readiness report - 2026-10-29

## 1. Executive summary

The frontend candidate `cb10f459bffd0203ffad9ea8c0445cbd729ca1eb` passes the complete hosted Chromium/Firefox/WebKit matrix: **274 browser passes, two documented capability skips**, plus 91 unique unit/component tests across 20 files and all strict gates. [Actual candidate run](https://github.com/rizad-mohamed/pressline-pos-system/actions/runs/40776712433). Final PR/main checks and remote synchronization must also pass; their exact release SHA/run are recorded in the PR and final delivery because this source document precedes its own integration.

**Overall production readiness is NOT PASS.** Mobile Lighthouse performance misses the 90 aim on three sampled routes; the full security audit lacks its required OS isolation; physical-device/assistive-technology/field-INP evidence is absent; production identity, APIs, transactions and hosting remain deliberately unimplemented. This is a verified frontend demonstration and controlled backend handoff, not certification of a live transactional system.

| Requirement                        | Evidence-supported result                                                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile Review Order                | PASS: original failure reproduced; corrected branch validation, focus and complete save/balance regression across four widths and three engines |
| Phone cards / desktop presentation | PASS: consistent statuses, values and actions; enlarged text readability; desktop/tablet preserved                                              |
| Responsive functional verification | PASS for automated engine/viewport scenarios, including 320-1920px; physical hardware NOT VERIFIED                                              |
| Proven cleanup                     | PASS: unused wrappers removed; 24 fewer locked packages; retained versions/contracts preserved                                                  |
| Measured performance               | Request reduction verified; no bundle or runtime-speedup claim; mobile Lighthouse 90 aim NOT MET on three routes                                |
| Security                           | Static, secret and advisory checks completed; full audit/production security NOT VERIFIED                                                       |
| Comprehensive frontend QA          | PASS in the fresh hosted candidate; failed local checkpoints remain explicitly failed                                                           |
| Delivery to main                   | Gated PR workflow; verify final exact-SHA Actions and remote state in delivery record                                                           |

## 2. Repository analysis and preserved work

Started from clean `develop` `c52a3e27d2bc8df5ce63c613f607b3bbc1066d07`; `main` was the root `e0b62dcb03330778fcdc8b6b1a4e5cc421beb604`. No remote was configured. The interrupted mobile task had already been completed and integrated through MOB-007; all retained work and topic references were preserved. Reviewed source, branch graph, feature/change/validation registers, mobile recovery/gallery, engineering handbook, HCI transcription/matrix, architecture and backend contracts. Prior HCI records are not a new certification of every handbook practice.

Node 24.14.1 / npm 11.11.0; Next 16.4.3 / React 19.3.1; strict TypeScript, locked npm, Vitest/jsdom and Playwright. Baseline typecheck/lint/format/build and 91 tests passed. Installed Next guides and reviewed shadcn/Taste guidance informed the narrow changes. No reinitialization, redesign or unsupported prices were introduced.

| Actual frontend area | Implemented behavior verified by hosted regression                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| Dashboard            | Branch/all projections and independent production/payment totals                                     |
| POS                  | Manual/service lines, saved customers, tab draft, advance, review/back/edit/save                     |
| Orders/payments      | Search/filter/sort, details/edit, outstanding amounts and payment history                            |
| Production/materials | Separate production transitions, plans, confirmed usage, additional use and compensating corrections |
| Customers            | Shared directory, archive/reactivate, explicit linking and branch financial history                  |
| Services/pricing     | Categories, availability, effective prices/recipes and immutable accepted snapshots                  |
| Inventory            | Branch balances, materials, adjustments, history and no-negative safeguards                          |
| Transfers            | Validated mock transfer and paired balance/movement evidence                                         |
| Reports              | Colombo date cohorts, branch scope, collections and outstanding amounts                              |
| Printing             | Separate receipt and production ticket; Chromium PDFs and all-engine print-media checks              |
| SMS preview          | Fictional unsent preview using the report engine; no sending integration                             |
| Settings             | Demo configuration/preferences/reset and fixed team display                                          |
| Profile/access shell | Demo personas/preferences, branch UI restrictions and complete role navigation                       |

Authentication and User Management are not finalized. No backend endpoint, SQL/RLS/migration, production API, payment/SMS provider, real credential or deployment was implemented or executed. `src/domain`, `src/data`, canonical brand tokens and licensed local fonts retain their initial task bytes. Navigation receives only the measured Link loading prop; Dashboard remains centered.

## 3. Changes and defect evidence

- **OPT-001:** Administrator All branches leaves a required branch behind Current order. Review appeared inert although valid cashier review already worked. Share the validated review callback; close the summary for underlying errors and focus them after Radix closes. Advance errors remain inside the summary. Four new width regressions failed before correction and pass through edit/save/exact balance.
- **OPT-002/006:** Wide phone tables put operational statuses offscreen. Adapt the same semantic rows into labeled cards through 680px, including customer linked-order history. Keep one authoritative set of badges, values and actions; tablets/desktops retain their existing presentation.
- **OPT-003:** TypeScript-AST reachability found no unreachable source files. Remove only unreferenced CardAction and standalone Toggle wrappers, retaining used variants and public contracts. Replace the Radix umbrella with the same already-reviewed primitive versions; the fresh install also exposed and corrected Badge's remaining umbrella Slot import.
- **OPT-007:** Firefox event capture proves correction on blur removes an old error and moves Add item 30.4px between pointer down/up, swallowing the first click. Touched validation preserves delayed initial errors and revalidates corrected input before the next click. Strengthened stale-error/single-add/remove/undo assertions fail on the old build and pass after correction.
- **OPT-008:** Visual inspection exposed fragmented labels/statuses at 320px/200% despite no overflow. Production needed 127.6px but had 58px. Cap existing decorative spacing and use at most two font-aware columns that stack when needed. New word/amount readability assertions pass across all engines.
- **OPT-009:** Existing WebKit pointer-focus normalization covered only mobile. Extend it to desktop so the unchanged 1440px dirty/focus-return regression passes. Keep primary-button, disabled, prevent-scroll, Radix Escape and unsaved-change contracts.
- **OPT-010:** Measured speculative route traffic and cancelled-prefetch exceptions justify native `prefetch={false}` at 38 Link sites. Preserve hrefs/client navigation without a new wrapper/dependency. First route visits load on demand; no authentication/role/data logic changes.
- **OPT-011:** Hosted tests exposed account redirect and drawer-entry-animation races. Await the dashboard URL before eleven further second navigations and full action visibility before the existing exact drawer bounds/unobscured assertions. No retries, fixed test delays or relaxed thresholds.
- **OPT-005:** Extend the existing immutable, read-only quality workflow to main PR/push and all three engines. Preserve unsupported-capability boundaries; retain failure diagnostics for seven days with a verified pinned official action. No release safeguard is bypassed.

Financial calculations, integer LKR cents, branch isolation, v1-to-v2 migration, accepted customer/service/name/category/price/material snapshots, production/payment separation and actual-use stock rules were not rewritten. Domain/data source equality and connected regressions support preservation; browser restrictions still do not establish server security.

## 4. QA and actual verification

| Executed verification                  | Actual result                                                                                                                     |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Fresh hosted candidate, all three jobs | Install/advisory/typecheck/lint/format, 91 tests, 22 contrast pairs, production build and complete browser workflows pass         |
| Chromium                               | 92 passed; zero skips; 4.6m                                                                                                       |
| Firefox                                | 91 passed; one unsupported CDP inset-emulation skip; 7.9m                                                                         |
| WebKit                                 | 91 passed; one unsupported CDP inset-emulation skip; 5.7m                                                                         |
| Local OPT-007                          | 15 three-engine quantity/mobile-review checks pass, retries=0                                                                     |
| Local OPT-008                          | 30 three-engine card/history/readability/selected-axe checks pass, retries=0                                                      |
| Local OPT-009                          | Nine three-engine dirty/focus/keyboard/current-order checks pass                                                                  |
| Local OPT-010                          | 24 WebKit complete-role-navigation and 320-1920px reflow checks pass                                                              |
| Local OPT-011                          | All three drawer checks pass; representative run 14 pass / one locator-injection failure                                          |
| Final touch/pointer smoke              | Chromium 156.0.8078.4 and WebKit 27.2 emulated touch; Firefox 157 pointer; all pass, no page errors                               |
| Final visual capture                   | 16 phone/desktop captures; zero page/failed/external requests; all 16 match the prior normal-size card checkpoint pixel-for-pixel |
| Enlarged customer history              | Clean 320px/200% viewport captures show New/Partial and LKR 3,500 / 1,000 / 2,500; archive retains accepted snapshots             |
| Design probes                          | 129 source files, 29 contextual WARNs; 24 live views, three reviewed spacing WARNs and no blocking findings                       |

The matrix covers realistic connected customer/service/order/payment/report/printing journeys, historical snapshots, branch isolation, stock/transfer/material consistency, duplicate guards, malformed input, corrupt/quota/stale storage, loading, recovery and navigation. All shared print assertions run in every engine; PDF export is Chromium-only. Selected axe/Lighthouse rules and token contrast are automated evidence, not full WCAG or physical-device certification.

**Failed checkpoints remain failed:** the first complete local run at c86af59 ended 247 passed / 27 failed / two capability skips in 59.4m. The first hosted run also failed. Preserved reports distinguish genuine quantity/focus/prefetch defects and timing races from local Playwright/axe injection/JSON parsing failures. Later local OPT-010 axe injection and OPT-011 Chromium locator parsing failures also remain recorded; their cause is unconfirmed. Every corresponding case passes in the fresh hosted full candidate. The installed Playwright core bundle matched the independently integrity-verified locked tarball; no unsupported environment root cause is asserted.

Other rejected checkpoints: an initial intended desktop Lighthouse run actually used mobile settings and was excluded; clean install found a hidden umbrella import; a sandboxed Windows wrapper stalled during cleanup and native QA completed separately; the first giant card test was split into independent route cases after timeout without removing assertions; a formatting failure was corrected and the complete gate rerun. [Evidence index](verification/optimization/README.md).

## 5. Security and dependency review

Fresh source reconnaissance finds React text rendering and schema/domain boundaries, no application raw-HTML/eval sink or external URL apart from the font license. Local persona/storage checks do not prove authenticated identity, IDOR resistance, least-privilege API projections, server authorization or RLS. Client validation and hidden UI are never treated as security boundaries.

The locked advisory refresh reports **zero known vulnerabilities**, including development dependencies. Cleanup reduces lock entries 642 to 618 and Radix packages 60 to 31, without retained-version drift. npm removes 30 unused packages and reconciles six optional WASM entries; the fresh platform installation reports 509 installed / 510 audited. The advisory JSON's total 618 describes the cross-platform lock graph. ESLint 9's support warning remains maintenance debt, not an invented advisory or a speculative toolchain upgrade.

Checksum-verified Gitleaks 8.30.1 finds zero secrets in actual history patches (167 reachable commits including merges; 3,261,611 scanned bytes), source (561,072 bytes) and generated browser assets (1,313,855 bytes). An earlier history invocation scanned zero commits after an ownership error despite returning a no-leaks message; that result was rejected. The valid rerun pipes `git -c safe.directory=<workspace>` output into the scanner and changes no global Git trust. This snapshot precedes the evidence commit itself; subsequent staged evidence is reviewed and release history rechecked.

**Full security audit INCOMPLETE.** The [security-audit skill](C:/Users/HARSHANA/.codex/skills/security-audit/SKILL.md) requires: "If every control cannot be enforced, do not execute target code." Required isolated network/environment/filesystem/resource controls and Windows artifact validation are unavailable. No target-controlled dynamic security audit or penetration test ran. Ordinary functional QA and bounded source/secret/advisory checks are separate evidence. [Detailed review](security-review.md).

## 6. Performance measurements

| Aggregate generated assets | Baseline                       | Final                    |
| -------------------------- | ------------------------------ | ------------------------ |
| JavaScript, 34 files       | 1,250,747 bytes / 397,703 gzip | 1,252,124 / 397,969 gzip |
| CSS                        | 60,120 bytes / 12,262 gzip     | 61,336 / 12,446 gzip     |

These are all route assets, not initial transfer. Required mobile labels/reflow and loading props slightly increase assets. **No bundle reduction or causal runtime speedup is claimed.** The verified cleanup gain is fewer unnecessary installed/locked dependencies.

A matched six-route, 390px, 750ms observation records browser request events **215 to 108** and speculative requests **74 to zero** in each engine. Chromium cancelled requests fall 11 to zero; WebKit page errors fall four to zero. These are request events, not guaranteed network round trips; the before probe overlapped an ordinary assertion, so it is not CPU/latency evidence. The committed measurement runner reproduces the after counts. On-demand first visits are the tradeoff.

| Lighthouse production sample | Valid pre-cleanup mobile performance | Final mobile performance | Final desktop performance |
| ---------------------------- | ------------------------------------ | ------------------------ | ------------------------- |
| Login                        | 85                                   | 83                       | 100                       |
| POS                          | 77                                   | 82                       | 100                       |
| Dashboard                    | 89                                   | 88                       | 100                       |
| Reports                      | 95                                   | 96                       | 100                       |

Lighthouse 13.6 uses validated official mobile defaults/desktop configuration, primed demo accounts and simulated throttling. Accessibility, Best Practices and SEO score 100 for every final sample. Mobile LCP is 0.884-1.577s, TBT 227-738ms and CLS at most 0.00146. **The 90 performance aim is unmet on login/POS/dashboard.** Shared-client-chunk long-task attribution does not establish a safe domain/store/layout rewrite; further profiling is required. Host/cache variance and one sample per route prevent a causal speed claim.

The separate six-navigation lab retains the baseline conditions: 390x844, 4x CPU, 40ms latency, 1,250,000 bytes/s, HTTP cache disabled. Final observed LCP is 1.156-1.348s with CLS zero; two observed POS click-to-dialog times are 318/391ms, including automation. These are not INP or field p75. No field web-vitals/availability, real API or database-query performance is claimed.

Reproduce against an owned loopback production server: `node scripts/bundle-report.mjs`; `node scripts/measure-navigation.mjs before|after`; `node scripts/measure-mobile.mjs baseline|final optimization`; optional `node scripts/audit-lighthouse.mjs <installed-lighthouse-core/index.js> final`. Preserve earlier mobile evidence by using the optimization target. Run measurements without simultaneous local builds/browser suites. [Raw reports and summaries](verification/optimization/README.md).

## 7. CI/CD and release gates

[Verified candidate run 40776712433](https://github.com/rizad-mohamed/pressline-pos-system/actions/runs/40776712433), exact source `cb10f459bffd0203ffad9ea8c0445cbd729ca1eb`: all three jobs succeeded. Node/npm and action commits are pinned; checkout credentials are not persisted; repository permission is read-only; no deployment/publishing/privileged trigger exists. Failure-only browser artifacts exclude hidden files and expire after seven days.

The [first failed run](https://github.com/rizad-mohamed/pressline-pos-system/actions/runs/40767646770) remains part of the evidence. A green older run never certifies a later SHA. Final delivery additionally requires the actual PR head checks, any remote-required reviews, standard merge and successful final-main Actions for the exact remote commit. Exact final PR/main SHA/run and synchronization are recorded in the release PR and final delivery, avoiding a fabricated self-referential source hash. No deployment is implied.

## 8. Git provenance and delivery

| Unit    | Retained topic                     | Source                                         | Develop integration                              |
| ------- | ---------------------------------- | ---------------------------------------------- | ------------------------------------------------ |
| OPT-000 | docs/opt-000-readiness-baseline    | 6440d4d                                        | 18becdd                                          |
| OPT-001 | fix/opt-001-mobile-review          | 6ae3f2d                                        | 50354a3                                          |
| OPT-002 | fix/opt-002-mobile-status-cards    | 40bb6c2                                        | b7873ac                                          |
| OPT-003 | chore/opt-003-verified-cleanup     | 05e924c                                        | e421758                                          |
| OPT-006 | fix/opt-006-customer-history-cards | b3d4ef6                                        | 70d3498                                          |
| OPT-007 | fix/opt-007-pos-validation-click   | 203c109                                        | bd772a7                                          |
| OPT-008 | fix/opt-008-enlarged-card-reflow   | b68daf0                                        | c3246f0                                          |
| OPT-009 | fix/opt-009-desktop-focus-return   | 3df3d20                                        | 0fd5f4c                                          |
| OPT-010 | perf/opt-010-demand-navigation     | a6b08ec                                        | 4ef23e2                                          |
| OPT-011 | test/opt-011-browser-settling      | 764e318                                        | 83a4de7                                          |
| OPT-005 | chore/opt-005-release-gates        | c86af59, a0952c3, cb10f45                      | 0346cf6                                          |
| OPT-004 | docs/opt-004-readiness-handover    | This evidence snapshot; exact hash at delivery | Verified no-ff integration follows this snapshot |

All meaningful units branch from develop and retain atomic Conventional Commits, staged diff review and no-ff integration. The CI topic merged newer develop without rebasing away failed evidence. Local automated Git identity remains repository-specific. No force/reset/clean or global Git configuration change was used.

The owner made the initially private/404 repository public. Read-only discovery found it empty; only the preserved root main was bootstrapped. The published candidate remote SHA was verified. Actual remote inspection showed no rulesets or protected branches; no setting was changed. Current explicit owner instructions authorize gated delivery to main, superseding earlier historical no-push/no-main scope. Recheck policy at PR merge and honor any required review/check. Retain topic references and verify a clean final tree and exact `origin/main` equality. [Workflow](git-workflow.md), [Git audit](git-audit.md).

## 9. Genuine remaining issues

| Classification                                | Remaining issue                                                                                                                      | Release implication                                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Code/performance improvement                  | Mobile Lighthouse 90 aim missed on three routes; TBT remains significant                                                             | Blocks a claim that the 90 aim passed; profile before a performance acceptance signoff               |
| Test/environment limitation                   | Local Playwright/axe injection/JSON parsing failures, cause unconfirmed; corresponding fresh hosted full cases pass                  | Local failed runs stay failed; hosted frontend handoff is supported, no local full-matrix PASS claim |
| Test/environment limitation                   | Full audit isolation/Windows validators unavailable                                                                                  | Blocks full security-audit/production-security certification                                         |
| Test/environment limitation                   | Physical devices, real assistive technology/printer output and field INP unavailable                                                 | Blocks claims about those unverified channels; define production device/AT acceptance                |
| Backend dependency / production configuration | Trusted auth/user lifecycle, authorized APIs, transactions/idempotency, privacy, backups, hosting/security headers/monitoring absent | Hard live-production blockers; explicitly outside this frontend task                                 |
| Future improvement                            | Supported development-tool lifecycle review for retained ESLint 9                                                                    | Maintenance debt; no known advisory at the recorded check                                            |

No missing backend function is disguised as a completed mock adapter or a frontend defect. No unsupported vulnerability, invented financial discrepancy or unnecessary redesign is listed.

## 10. Backend engineer handoff

Keep the [existing contracts](backend-integration-contracts.md) and [frontend architecture](frontend-architecture.md). Thin routes, feature UI, pure domain logic and one validated demo store remain. Prices/payments use integer LKR cents; calendar boundaries use Asia/Colombo; effective accepted snapshots and posted history remain immutable. Order plans/save/production do not deduct stock. Only explicit confirmed actual use changes whole units at the order branch; correction uses reasoned compensating movements. Browser v2 data preserves validated v1 records through in-memory migration and never silently resets them.

A future trusted server must derive identity/branch access independently, expose minimal authorized DTOs, validate prices/lifecycle/availability, use atomic constraints/locking and durable idempotency, append financial/material audit history and reconcile uncertain outcomes before retrying writes. Do not replay a timeout as a second payment, usage or transfer. Multi-device conflicts, secure sessions/storage, authorized reporting, privacy/retention, backups/restores, recovery drills and production transport/headers need explicit implementation and acceptance. No SQL/RLS/provider/backend operation was executed here.

[Frontend operations](frontend-operations.md) identifies critical SLIs, provisional owner-unapproved SLO targets, recoverable error/storage behavior, privacy-conscious diagnosis and reviewed revert-based release/rollback. Centralized logging, field monitoring/error budgets, availability ownership and incident response require approved backend/hosting scope. No monitoring SDK or external analytics integration was introduced.

Use `npm ci` and the existing strict gates with the verified runtime. `PRESSLINE_TEST_PORT` selects a validated loopback port; `PRESSLINE_TEST_BROWSER` selects chromium/firefox/webkit/all. No production secret/environment integration is required for this demo. Backend/authentication/User Management/deployment work requires a new explicit scope.
