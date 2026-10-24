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
