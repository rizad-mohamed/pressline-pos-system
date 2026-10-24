# Pressline visual design system

## Direction and preserved behavior

A paper-and-ink workbench for a two-branch Sri Lankan print shop: a compact labeled charcoal rail, warm-white canvas, precise typography, restrained lime selection/action emphasis and aligned LKR figures. The original folded-document mark and six small paper specimens belong to printing rather than copied retail imagery. The provisional Pressline identity awaits business approval.

Reviewed the supplied final master prompt, all three owner screenshots in references/, the applicable engineering handbook chapters and the existing 238-practice HCI catalogue. Screenshot_1/2 inform quiet tables, split details and compact operational headers; Screenshot_3 informs restrained work queues and grouping. They are reference material, not licensed component source. No shoe imagery, invented taxes/promotions, shipping or payment gateways were copied.

Existing routes, demo repository, calculations, immutable prices, payment/production states and branch restrictions remain. Service cards preselect already supported printing options; their prices use quoteLine. No standalone scan/binding-only price is invented. The manual editor and initial print item remain available.

## Canonical tokens and typography

All color roles, type, space, radius, focus, layers and motion originate in ../src/styles/brand.css. Tailwind/shadcn semantic colors map to those tokens, including muted as a surface and muted-foreground as text. Component variants define visual treatment; features arrange them.

| Role                           | Decision                                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Canvas / paper                 | #f7f8f4 / #ffffff                                                                                       |
| Rail / rail text               | #1c211b / #f0f3eb; muted #b5bfae                                                                        |
| Main / secondary text          | #20251e / #61685c                                                                                       |
| Primary action / ink           | #c0ed87 / #202c17                                                                                       |
| Links / focus                  | #3b5d27 / #496e30                                                                                       |
| Structural edge / control edge | #e2e6dc / #7f8a77; stronger control boundary is intentional                                             |
| Chart data                     | #48663a and neutral #858f7c; same series uses the same color                                            |
| Font                           | Locally hosted Manrope variable, SIL OFL 1.1; Nirmala UI/Segoe UI/Arial fallback for unsupported glyphs |
| Body / labels / metadata       | 15px / 14px / 12.5px at default root; inputs 16px                                                       |
| Workspace headings             | 30px desktop, 24px mobile; entry branding headline is intentionally larger                              |
| Numerals                       | Tabular for prices, totals, counts and aligned numeric table columns                                    |
| Spacing                        | 4px base; 16–24px interior/gaps and 16–32px workspace gutters                                           |
| Radii                          | 10px controls, 16px panels, 20px drawers, full-round chips/avatars                                      |
| Depth                          | Flat resting panels; shadows reserved for sheets, tooltips and persistent mobile order controls         |
| Motion                         | 140–220ms control/drawer feedback; no route entrance, parallax, decorative looping or gradient skeleton |

Manrope is loaded with next/font/local and its redistributed license is in src/app/fonts/OFL.txt. No runtime font CDN, external image source or analytics script was introduced. Existing dark mode did not exist and was not added.

## Component and interaction contract

Reviewed and installed the required shadcn and Taste tools. Existing components.json was retained: running `npx shadcn@latest init -t next` detected it and overwrite was declined. Added official Radix Tooltip, ToggleGroup, Card, Input, Badge, Skeleton and Separator source via the CLI after info/docs/dry-run review. Existing Button, Sheet and confirmation contracts were preserved. Removed the generated redundant cn dependency and reused the local class utility; pinned radix-ui 1.8.1 with the lockfile. Both skill source hashes are recorded in skills-lock.json. The extra migration skill installed by the official bundle was never invoked.

Taste was actively used for the commerce app draw (framed-sheet, seed 20261024, no redraw), source lint, native entry inspection and its reviewed measurement engine on signed-in fictional workspace routes. The explicit project brief takes precedence over its general dislike of dark rails and lime controls. The paper tint, flat operational surfaces and product-specific specimen treatment are intentional choices. Local installations live in .agents/skills and are excluded from app lint/build inputs.

- Primary: dark ink on lime, clear hover/press and focus. Secondary: white, bordered, dark text. Disabled: legible neutral surface plus a reason where capability is unavailable.
- Navigation: visible labels, current-page state, desktop tooltips and a labeled mobile sheet; utilities stay in the rail. No fake search, bell or export control.
- Forms: persistent labels, field errors, explicit optionality, 44px main controls. Native selects remain where they already work. RHF/Zod own the existing form behavior.
- Drawers: accurate title/description, Escape, scroll containment, fixed footer when relevant, dirty-state guards and focus return. Mobile order Edit transfers focus only after sheet close.
- Status: text labels plus semantic tint; payment and production stay distinct. No color-only meaning.
- Tables: quiet headers/rules, consistent density, right-aligned monetary/count columns; relatively positioned, named, keyboard-focusable scrolling regions. No page-level horizontal scroll as a table substitute.
- Charts: real shared report data, zero baseline, visible rounded scale ticks and exact data table; no smoothing or invented trends.
- Empty/error: meaningful next step, preserved input and truthful demo state. Empty orders can be saved as tab drafts; submitting a transaction still requires one valid item.

## Responsive rules

| Width               | Behavior                                                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Wide desktop        | 104px labeled rail, fluid work area, three service columns when readable, 360px persistent current-order summary |
| Laptop              | Two service columns when required; navigation and totals retain their meaning                                    |
| Up to 1100px        | Current order becomes a sheet with a persistent View order bar; document scroll padding protects focus           |
| Up to 900px         | Rail folds into accessible menu navigation                                                                       |
| Mobile              | Two service columns, one below 350px; controls stack naturally; fixed sheet review footer and safe-area padding  |
| Dense data          | Tables scroll inside their frame; no columns compressed into illegibility                                        |
| Zoom / long content | 200% text, Unicode and unbroken names reflow; monetary amounts retain nonshrinking width                         |

Actual regression widths: 320, 360, 390, 430, 768, 1024, 1280, 1440 and 1920 CSS px. Orientation and reduced-motion review are covered by long-content.spec.ts. Viewport emulation does not replace physical-device testing.

## Accessibility evidence and limits

`node scripts/check-design.mjs` calculates relative luminance from actual canonical tokens and verifies 22 explicit pairs, using unrounded values for acceptance. Representative ratios: body/paper 15.616:1; muted/canvas 5.404:1; primary ink/lime 10.951:1; rail secondary text 8.597:1; control/canvas 3.392:1; focus/canvas 5.536:1. Text pairs meet at least 4.5:1 and checked control/chart boundaries at least 3:1. These are pair checks, not proof of whole-page conformity.

Followed [contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), and [unobscured focus](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html). Main controls are 44px, mobile cart actions 44px; desktop compact actions 32–36px. Linked inline text and labeled native checkboxes are reviewed in their context.

Selected WCAG A/AA axe scans on login and all 11 workspace routes reported no detected violations; keyboard categories, mobile navigation, drawer return, dirty guards, 200% text, internal sheet widths and reduced-motion/landscape behavior are exercised by Playwright.

Real screen-reader, participant, physical device/printer and full WCAG conformity testing were not performed. English content and Sinhala/Tamil text rendering were sampled; this is not a translated interface. No accessibility certification or production readiness is asserted.

## Visual review and evidence

Baseline screenshots cover login/all workspace routes and selected mobile/detail views. Structural pass reviewed shell/POS; craft pass compared dashboard, tables, reports, SMS, settings, mobile cart and printing. Fixed panel imbalance, tiny labels, edge-close rail text, internal long-content overflow, currency flex sizing and control boundary contrast. Working screens remain task-focused.

[Production screenshot and print gallery](visual-evidence/README.md) includes entry, both dashboards, initial/populated/empty POS, mobile cart, order/stock/transfer drawers, reports, SMS, settings, profile and both printable PDFs.

Native Taste entry inspection initially returned zero failures and four warnings: welcome label and role-icon issues were refined; a larger gateway brand headline and full-height branding whitespace are justified entry-screen exceptions. Workspace measurement after refinements was clear across 21 combinations (seven routes × 1440/768/390) on the final build; the complete workflow/a11y gates remain the stronger behavior evidence. No rule allowance was used to hide a failure. Artifacts are actual local browser renders with fictional data.

## Frontend adaptation of engineering gates

This is an explicit local adaptation, not a quotation of the missing supplemental 18-gate document or a certification. The supplied handbook contains a separate 30-point production checklist; backend, operations and launch items remain outside scope.

| Gate                                 | Evidence / disposition                                                                                                                             |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Governance                        | Dedicated topics, atomic Conventional Commits, no-ff integration, main unchanged                                                                   |
| 2. Requirements                      | Available prompt traced; exact approved FR/NFR baseline unavailable                                                                                |
| 3. Architecture                      | Existing thin routes/features/domain/repository retained                                                                                           |
| 4. Mock data integrity               | Existing invariant tests and cross-workflow browser checks                                                                                         |
| 5. Source hygiene                    | No backend endpoints, secrets or unsafe HTML rendering introduced; scoped source scan                                                              |
| 6. Dependencies                      | Reviewed skills/components/licenses, exact lockfile and clean install; ESLint EOL remains documented                                               |
| 7. Functional interface              | Existing cashier/admin flows preserved and tested                                                                                                  |
| 8. Design system                     | Canonical tokens, shared owned primitives, coherent brand                                                                                          |
| 9. Accessibility                     | Automated/keyboard/contrast evidence; real AT/conformity not verified                                                                              |
| 10. Responsiveness                   | 320, 360, 390, 430, 768, 1024, 1280, 1440 and 1920 CSS px; zoom, landscape and long-content checks                                                 |
| 11. Financial representation         | Pure domain unchanged; prices, paid and balance remain separate                                                                                    |
| 12. Regression                       | 58 unit/component tests and 33/33 production browser tests; detailed outcomes in validation-log.md                                                 |
| 13. Print                            | Browser PDFs/views checked; actual printer unverified                                                                                              |
| 14. Performance                      | All generated route JS: 1,131,249 bytes / 361,372 gzip; CSS: 48,779 / 10,196 gzip, plus the self-hosted font; no field-performance or uptime claim |
| 15. Knowledge transfer               | README, architecture, design, coverage, HCI and audit records                                                                                      |
| 16. Auth/database/security           | Future backend; local UI restrictions do not provide security                                                                                      |
| 17. External integrations/operations | Future backend/provider/scheduler/Realtime/backup/monitoring work                                                                                  |
| 18. Production launch/stabilization  | Not performed; no remote push, deployment or launch approval                                                                                       |

## Final viewport and performance refinement

The desktop order panel measures its actual top and available viewport height. Specifications and simulated advance occupy a named keyboard-focusable scroll region; total, remaining balance and Review order stay in its footer. A short window falls back to normal page scrolling. The mobile sheet keeps its own fixed review footer. The three-item 1440×900 visibility regression now passes before and after page scroll.

Final six-sample account-primed production lab: LCP 1028–1460 ms; CLS 0.000548633; 1–3 long tasks per navigation. Chromium CPU slowdown 4×, latency 40 ms, download 1,250,000 bytes/s, HTTP cache disabled; fonts/core assets may already be warm after demo entry. No runtime third-party request was observed. These measurements inform local regression review, not a real-device/field performance promise. The additional Radix primitives, local typeface and presentation cost were accepted for the requested UI; aggregate bundle growth is documented instead of hidden as an initial-load score.

Taste source lint: zero FAIL and 28 WARN. Warnings cover explicit shadow tokens/overlay or focus treatment, retained eyebrow hooks now rendered in sentence case or print metadata, padStart used for dates/item identifiers, and typographic em-dash punctuation. They are reviewed contextual style advisories; no failed rule was waived. Native entry review retained intentional branding headline/entry whitespace exceptions. Workspace measurements were clear in all 21 route/width combinations on the final production build, including the footer and navigation refinements.

## Connected workflow patterns · 2026-10-25

Preserved Pressline paper/ink/lime, Manrope, SVG paper specimens, labeled navigation, shared shadcn/Radix controls and canonical tokens. Customer directory answers who owes what in the permitted scope; profile history derives exact sums. Services & pricing exposes transparent unit/setup or print-engine configuration, category/status controls and optional whole-unit material suggestions. Job materials distinguish editable plans, explicit branch stock impact and immutable events with compensating corrections. No independent stock/debt cards or invented accounting were introduced.

Long names wrap within flex/grid boundaries at zoom. Modal controls stay above transient success feedback (toast 40, overlay 50, sheet 51). Input errors preserve form values; monetary widths, focus return and reduced motion remain. New gallery contains 26 actual production captures at 1440/768/390 plus PDFs. Signed-in Taste bridge checks 18 route/width combinations; findings are retained in capture-evidence.json, with the prior documented header exceptions unchanged. Source lint: 0 FAIL / 29 contextual WARN (existing overlay/focus/shadow tokens, operational labels, metadata and punctuation). The final browser inspector retains five WARN findings: two desktop table spacing advisories and the existing material-context typography at three widths. Literal context copy is sentence case; its inherited eyebrow styling still triggers the computed-style advisory. These remain visible in the raw report and are not represented as passes. No advisory is presented as a hidden pass or universal design approval.
