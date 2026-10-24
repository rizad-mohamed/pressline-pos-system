# Premium frontend redesign · 2026-10-24

## Authorized scope and baseline

Enhance the working frontend in place. Preserve pure calculations, demo repository, routes, role/branch rules, persistence, printable documents and existing workflows. No backend operations, API changes, Supabase, database modifications, deployment, external mutations or changes to main.

Initial integration: develop `c73980cc0090e31df800d46f0bff4a66aa18a3b5`; stable main `e0b62dcb03330778fcdc8b6b1a4e5cc421beb604`. Working tree clean; no remotes. Existing Next/React/strict TypeScript/Tailwind and Radix components retained. Existing `components.json` uses new-york/Radix, Lucide, Tailwind v4 and project aliases; do not destructively initialize.

## References and tool review

Read the complete new FINAL master prompt. Prior delivery read all 25 pages/238 HCI practices; existing HCI and engineering evidence retained. Separate full-stack engineering handbook and screenshot not located among named references; requested local paths while proceeding with the final prompt's explicit composition: charcoal rail, warm-white workspace, restrained lime, printing-specific service choices and persistent transaction summary. Original exact FR/NFR baseline remains unavailable; group-level mappings must remain honest.

Mandatory shadcn and Taste tools: inspect public source, license, executable scripts and compatibility before execution; install project-local skills. Review npm CLI metadata. Existing shadcn configuration wins over reinitialization. No paid blocks, external runtime scripts or remote image dependencies. Evaluate Shadcnblocks composition without copying commercial source. Applicable skill guidance yields to the user's business, accessibility and preservation requirements.

## Planned independently verified units

| ID       | Branch                             | Intent / acceptance                                                                                                          |
| -------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| PREM-001 | docs/prem-001-redesign-audit       | Record scope, baseline, reference/tool review and initial evidence.                                                          |
| PREM-002 | chore/prem-002-design-tooling      | Install/review/use requested skills; reuse shadcn setup; add needed primitives without replacing tested wrappers.            |
| PREM-003 | feat/prem-003-premium-shell        | Canonical lime/charcoal tokens, typography, branded responsive rail/header, entry and shared surfaces.                       |
| PREM-004 | feat/prem-004-service-workspace    | Searchable existing-capability service presets; retain line editor and domain; desktop/current-order and mobile order sheet. |
| PREM-005 | style/prem-005-operational-screens | Coherent dashboard, tables, reports, settings, drawers, statuses and print craft.                                            |
| PREM-006 | test/prem-006-visual-regression    | Two visual passes; responsive 320–1440+, keyboard, zoom, reduced motion, long multilingual text, complete regression gates.  |
| PREM-007 | docs/prem-007-redesign-handover    | Updated evidence, design system, coverage, HCI dispositions and Git provenance.                                              |

Record discovered defects separately when material. Register each event before implementation and backfill source/merge hashes in later audit commits. Preserve earlier ledgers and no-ff integrate verified topics into develop; retain all topic refs.

## Visual thesis

Pressline is a print-production workbench: paper-shaped service specimens and exact specifications on a calm canvas, framed by a compact charcoal tool rail. Warm neutral typography and aligned tabular amounts carry the hierarchy. Lime signals selection and the next action; semantic status colors remain separate. No invented services outside the existing price engine, stock consumption, tax, discount or payment channels.

## Verification record

Initial and final evidence, actual commands, visual critique, contrast results, skill usage and limitations will be appended as work proceeds. Historical 58 unit/component and 24 E2E results are baseline evidence, not a claim that the redesign has already passed.

## Reference update and baseline evidence

Owner supplied `docs/references/Engineering-disciplines-to-follow.txt` and `Screenshot_1.png`, `Screenshot_2.png`, `Screenshot_3.png` during discovery. All three images inspected: disciplined admin tables, compact headers, split detail panels, quiet metrics and restrained chart chrome. Treat them as composition references, not licensed source or permission to invent retail shipping/tax/card flows. Preserve these owner-supplied files unchanged; their hashes are recorded in ignored local evidence. Engineering handbook applicable sections reviewed: foundations, frontend/UI/accessibility/internationalization, supply chain, development/Git, testing, performance, maintainability/documentation and readiness; backend/launch obligations stay future work.

Baseline: 58/58 tests passed. Initial desktop screenshots captured for login and all 11 workspace routes, mobile POS/inventory/reports and order drawer; manually inspected POS/dashboard. Browser plugin discovery returned no browser after troubleshooting; standalone Playwright is the available visual surface.

Reviewed public npm metadata: skills 1.7.4 and shadcn 4.22.1, MIT; skill source reviewed before execution. Both requested skills installed via npx skills add, project-local for Codex. The official bundle also installs migrate-radix-to-base; it is not invoked and no primitive migration is authorized. Installer assessments include medium-risk labels and one Taste alert; these are not a security certification. Reviewed executable behavior: draw writes local direction/history; inspect drives a temporary browser, cleans only its owned profiles/output, and contains no provider integration. Set history and temporary paths inside .local. No external photo/font links from dealt snippets will be used at runtime.

Ran requested shadcn init -t next; explicitly declined overwriting the detected config. shadcn info confirmed Next 16, Tailwind 4, Radix and project aliases. Dry-run additions preserve existing button/sheet. Skills are local installations ignored by application lint; their source/hash provenance remains in skills-lock.json. Existing tested wrappers take precedence over blanket component migration.

Taste actively run: commerce app directions, seed 20261024, framed-sheet selected for print-paper geometry and low-chrome operational density, no redraw. Explicit prompt overrides the skill house ban on charcoal navigation/lime controls; use limited lime and a labeled compact rail so many destinations remain discoverable. Manrope is locally self-hosted under SIL OFL 1.1.

## Shell structural review

PREM-003: inspected first-pass desktop login/dashboard/POS and mobile POS images. Manrope, original folded-paper mark, warm canvas, charcoal rail, readable labeled destinations, account context and limited lime now consistent across existing screens. Refined rail row pitch after review to keep utilities more accessible at laptop heights. Removed route entrance and skeleton gradient; retain subtle control/drawer transitions with existing reduced-motion support. Added official shadcn Tooltip, Badge, Input and Skeleton usage through existing public wrappers; preserved their names/form behavior. Typecheck initially caught a removed Printer import still used by navigation; restored before verification. Entry/navigation and 200% text browser checks both passed, with no page exceptions in the route capture.

## POS structural review

PREM-004: added six UI presets using existing A4/A3, color, sides, binding and finishing capabilities; no new service price model or stock behavior. Preserved direct editable lines and initial blank configuration for existing journeys. Summary now edits/removes/steps quantity; last-item removal is allowed as an empty UI draft, while save still requires one valid line. Draft-only schema permits empty arrays, and order validation remains strict. One summary moves into a mobile/tablet sheet; portal submission targets the existing form. A post-close focus callback returns mobile Edit to its actual input after Radix restores focus. Visually inspected first desktop service grid, empty summary and populated mobile cart; refined the mobile Review action into the fixed sheet footer and increased summary metadata legibility.

First focused browser run: original POS, quantity recovery, empty-draft restoration and mobile editing/review passed; one new filter test used button instead of the current Radix single-select radio role. Inspected DOM and installed primitive source, corrected the semantic locator without changing application roles. Final rerun pending; do not count that checkpoint as success.

PREM-004 final focused verification: typecheck and lint passed; all five original/new POS checks passed after correcting the radio locator, including fixed mobile footer, single review dialog and post-close focus. Pure domain and repository files remain unchanged.

## Operational review and checks

PREM-005: shared metric strips, aligned inventory/SMS numeric columns, restrained tables, measured zero-baseline dashboard SVG with scale ticks and existing exact-value table, coherent order detail/production/payment presentation, original document mark in receipt/ticket, responsive SMS/settings and form surfaces. Removed obsolete HTML chart/brand-mark styles and unused shimmer/route-entrance keyframes after reference search. No domain/repository edits. All eight targeted administrative/order/pricing/report/settings/SMS/transfer/print journeys passed; all 58 unit/component tests passed.

Second visual review inspected desktop dashboard, inventory, reports, SMS and settings plus mobile captures. Taste workspace measurements identified uneven SMS/settings panels, a report card blank band, a micro-label and an edge-close SMS navigation label. Refined panel rhythm, consolidated duplicate unavailable delivery/scheduler status text, moved provider implementation details out of user flow, aligned branch cards and wrapped rail labels. The first bridge included a page-only small-title warning: corrected the bridge to follow inspect.mjs app-mode filtering exactly, retaining judgeApp h1/size checks. Native skill scripts remain unchanged; no design rule is hidden by an allowance.

Taste app-mode rerun: no failures across 21 route/viewport combinations; two remaining spacing warnings led to a closer team-help inset and a flexible SMS text-preview area that shares the control panel height. All other workspace measurements were clear. Native entry inspector results and final production reruns are recorded in the final validation log.

Native Taste inspector executed on login at 1440/768/390: zero failures, four warnings. Replaced the tiny tracked welcome label with sentence case and neutral role icons with meaningful B1/B2/AD identity markers. Two brand-entry exceptions are intentional: the story headline is larger than working-screen titles, and the full-height branding panel uses composed whitespace. Working routes retain 24?30px titles. Added scroll padding for the persistent mobile order bar and 44px mobile cart controls. No style check is a WCAG certification.

## Long-content regression and scoped repair

PREM-008 isolated on fix/prem-008-long-content-reflow. An initial outer-sheet-only check passed but did not prove the scroll body fit. Strengthening the assertion exposed 464px of content inside a 319px mobile sheet body at a 320px viewport. Added explicit wrapping for user specifications/names and shrinkable flex totals, preserving values; no clipping/hidden-overflow workaround. The regression includes Sinhala/Tamil content, a long unbroken fictional customer name, landscape save visibility and reduced motion. Native token measurement also found input-border/canvas contrast at 2.891:1 (3.083:1 on white); darkened the canonical border so both adjacent surfaces meet 3:1. No financial/domain/repository behavior changed. Final scoped verification pending.

The first wrapping repair fixed cart overflow but the review still exposed 328px inside 319px: DOM inspection showed its nonwrapping currency span shrinking to 21px while painting 70px. Protected amount flex sizing while allowing the description to wrap. This is a layout repair, with displayed values and calculations retained.

Latest Taste workspace measurement: all 21 combinations (7 routes ? 1440/768/390) clear of findings. Reference files retain their original SHA-256 values. Full final production verification follows the scoped repair.

PREM-008 verified: typecheck/lint passed; four focused browser checks passed, including the stronger internal scroll-body assertion, Unicode/long names, fixed landscape save, reduced motion, service/cart pricing, empty reload and mobile focus/review. Failed intermediate assertions remain documented above.

## Final production gate checkpoint

Clean npm ci passed (544 installed / 545 audited, zero known vulnerabilities). Typecheck, lint, format, 58 unit/component tests and optimized production build passed. All 22 contrast pairs passed. Combined 32-test Chromium run initially passed 31; the 430px test stopped during a login locator with SyntaxError in Playwright CRExecutionContext.rawEvaluateHandle before layout assertions. Trace preserved locally. Three unchanged isolated repeats passed; full unchanged suite rerun pending. No assertion was relaxed, no app exception was observed in the all-route accessibility check, and root cause is not claimed proven. Source scan rerun with argument-vector rg found no app backend/network/private-key/unsafe HTML patterns; Git confirms src/domain and src/data unchanged.

Final unchanged production rerun: all 32 tests passed. The prior isolated Playwright injection error did not reproduce in three 430px repeats or the complete rerun. Retain it as an execution-tool limitation with unproven root cause, not an application defect claimed fixed. No retries, skipped assertions or weakened acceptance criteria were added.

Production screenshot review found an additional PREM-009 usability defect after the 32-test gate: with multiple desktop lines, the sticky summary was sized against the full viewport rather than its actual starting position, allowing Review order below the first viewport. Global handoff remains pending that focused repair and a new footer-visibility regression. Automated passes do not supersede manual visual evidence.

PREM-009 regression reproduced the review button bottom at 1211px in a 900px viewport. Separate a scrollable specifications/advance body from a non-scrolling totals/review footer. Measure the actual panel top and footer/header size with a local ResizeObserver and scheduled viewport events; use page scroll fallback for unusually short/zoomed windows. The mobile sheet keeps its existing external fixed action. Preserve every quote, field, action and business rule.

PREM-009 focused verification passed: typecheck/lint and all seven POS/keyboard/long-content/footer browser checks. Manually inspected populated desktop and mobile renders: totals and Review are visible; the named, keyboard-focusable specifications/advance region scrolls. A 200%/short-window fallback preserves full page-scroll access. Final production build/suite must be repeated because application layout changed.
