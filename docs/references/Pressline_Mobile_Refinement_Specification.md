# CODEX EXECUTION PROMPT — Pressline POS: Mobile-First, Native-Like Responsive Refinement

**Assignment:** Implement a complete, exceptionally polished **mobile and tablet frontend refinement** of the **existing Pressline two-branch printing-shop POS**. Make it feel as fluid, tactile, discoverable, and coherent as a professionally built native mobile app, while retaining its Next.js web architecture. **This is an implementation task, not a design proposal.**

> **NON-NEGOTIABLE PRIORITY ORDER**
>
> 1. **FRONTEND ONLY.** No backend operations, API implementation or changes, Supabase calls/changes, database work, authentication-provider changes, SMS transmission, payment processing, deployment, or infrastructure work.
> 2. **Preserve the established desktop experience**—current charcoal/lime Pressline identity, information architecture, layouts, typography, working functionality, routes, business calculations, role/branch behavior, and integrations/contracts. Only change desktop code where a demonstrated responsive, accessibility, or regression fix genuinely requires it.
> 3. **Mobile excellence and tablet adaptability:** redesign small-screen _presentation and interaction_, not the domain/business behavior.
> 4. **Strict Git provenance:** safe feature branches, precise atomic Conventional Commits, verified integration, protected `main`.
> 5. **Truthful verification:** implement and run real checks; never claim a device, browser, assistive-technology or production test that was not actually performed.

## 1. Read the actual project before touching code

You are Codex acting as a principal mobile-web UI/UX engineer, senior frontend architect, accessibility/HCI specialist, performance engineer, and quality lead. Apply measured, production-oriented engineering discipline, but keep changes proportionate to a two-branch printing-shop POS.

First inspect **the repository as it currently exists**, not as earlier reports described it. Read `AGENTS.md` and relevant project docs such as `README.md`, `FRONTEND_STATUS.md`, `docs/git-workflow.md`, `docs/git-audit.md`, `docs/visual-design-system.md`, `docs/validation-log.md`, `docs/requirements-coverage.md`, `docs/hci-acceptance-matrix.md`, `docs/feature-register.md` and `docs/decisions.md`, when present. Inspect routes, responsive styling, design tokens, shadcn/ui primitives, existing drawer/sheet patterns, real component consumers, tests, and visual evidence. Record baseline screenshots of representative desktop, tablet and mobile screens if browser tooling is available.

**Continue applying the previously supplied project references**, not only this short task brief:

- The final frontend-only Codex master prompt and any approved project requirements.
- _The Complete Production-Grade Full-Stack Engineering Handbook_.
- The supplemental engineering / production-readiness guidelines, where available.
- _HCI Principles Handbook 2026_, including ISO 9241-110/210 task-centered interaction, Nielsen heuristics, Shneiderman principles, cognitive ergonomics, responsive/accessible design, trustworthy feedback, and measured quality.
- The previously supplied POS visual reference screenshots and the established Pressline design-system decisions.
- The previous **Customers + dynamic Service Catalogue + order-linked material consumption** follow-up, **only to the extent those capabilities have actually been implemented**. This task does not authorize reimplementing missing business modules merely to fill out mobile screens.

Treat unavailable source files honestly: do not claim to have inspected them or invent their contents. Preserve higher-priority repository instructions and established working code. **Do not redo the previous premium visual redesign.**

## 2. Exact scope boundary — no backend side effects

Implement only React/Next.js frontend screens, navigation, component composition, responsive CSS, accessible interaction behavior, client-side presentation/state necessary for that behavior, related frontend tests, and documentation. **Do not** create/modify/run API route handlers, server actions performing business writes, migrations, RLS policies, Supabase operations, scheduled jobs, SMS delivery, production payment flows, infrastructure or deployment scripts. **Do not issue live backend requests as part of implementation/testing.** If integrations already exist, leave code/contracts intact and use existing safe frontend demo/mock/test adapters for tests. Do not silently replace or disconnect a working integration in its normal application mode.

Keep the distinction clear: a premium **frontend implementation suitable for a later production integration** does _not_ by itself certify the whole POS production-ready. Avoid new PWA/service workers, native wrappers, push notifications, camera/biometric permissions, device plugins or heavy mobile frameworks unless already part of the approved project and essential to preserving behavior. **“Flutter-like” refers to polished experience, not introducing Flutter or rewriting the stack.**

## 3. Mobile navigation — mandatory and measurable

### 3.1 Fixed bottom tab bar on smartphones

Implement a sophisticated, **viewport-fixed bottom navigation bar**, following familiar interaction principles of Instagram/Facebook/TikTok/Fiverr without copying their trademarks, graphics or unrelated social features. It must be an accessible, trustworthy POS navigation system, not decoration.

- Show **five visually balanced destinations** on phones, with **Dashboard in the exact CENTER (third) position**. Dashboard has a clear, recognizable icon and visible text label; it may receive slightly greater emphasis but must **not** become an oversized floating action button or obscure the UI.
- Make **Dashboard the initial authenticated/demo-session landing screen** when entering the application through the normal root/sign-in flow, subject to legitimate existing access/session behavior. **Do not hijack direct order URLs, restored draft workflows, browser Back/Forward, or printing links** by repeatedly redirecting to Dashboard.
- **Role-aware destinations**, derived from real authorized routes, with a suggested mapping **only if those screens exist**:

  | Position       | Cashier example   | Administrator example |
  | -------------- | ----------------- | --------------------- |
  | 1              | New Order / POS   | Orders                |
  | 2              | Orders            | Inventory             |
  | **3 (center)** | **Dashboard**     | **Dashboard**         |
  | 4              | Production / Jobs | Reports               |
  | 5              | More              | More                  |

  Adapt intelligently to the actual implemented modules and user permissions, **without inventing destinations, exposing administrator routes to cashiers, or hiding important tasks**. If a mapping needs adjustment, document the decision while keeping Dashboard center.

- **More** opens an accessible compact navigation sheet/menu containing _all remaining existing authorized screens_ (e.g., Customers, Services & Pricing, Stock Transfers, SMS preview, Settings, Profile, and any other real routes), with readable groups and active-location orientation. Avoid dead links or a false notification badge.
- Include coherent icons **and readable text labels**; clear selected state beyond color alone; accessible names; semantic `<nav>` and link elements; `aria-current="page"` for the active destination; obvious keyboard focus; logical tab order. Set active state based on the actual route (including nested routes) and preserve browser history semantics.
- Touch targets **preferably at least 44 × 44 CSS px**; satisfy relevant WCAG 2.2 AA target-size rules, spacing, contrast, and visual focus. Guard against accidental adjacent-tab presses.
- Keep navigation visually compact and premium: restrained charcoal/white/lime treatment using **existing Pressline tokens**, subtle elevation/border and purposeful selected/pressed states. Do not introduce purple/blue palettes, heavy gradients, floating glass panels or visually noisy animations.
- Respect **bottom safe areas** (`env(safe-area-inset-bottom)`), viewport changes (`dvh` or an appropriate fallback), native browser toolbars, screen rotation and content at 200% text size. Avoid a gap below the bar, horizontal clipped tab labels or gesture-indicator collisions.
- The bottom bar should remain stable during routine screen scrolling, with deliberate visibility behavior when the virtual keyboard is open so focused fields and submit controls remain accessible. Avoid brittle JavaScript viewport hacks if CSS is sufficient.

### 3.2 Visibility and routing exceptions

The navigation is part of authenticated workspaces, **not login, full-page print/receipt/job ticket documents, dedicated error screens or any existing intentionally immersive flow** where it would obstruct the task. Preserve clean browser print CSS: never print the app navigation.

The bottom bar **must not overlap** form actions, sheets, POS totals, order-review actions, toasts, browser UI, or scrollable content. Provide content clearance and safe stacking rules; coordinate it with any existing sticky cart/view-order bars and sheet footers. At no point should an essential action be hidden behind a fixed surface.

## 4. Mobile-first presentation and interaction across the _whole_ app

Inspect and improve **every existing user-facing module**, as applicable: entry/demo access, Dashboard, POS/order creation, service selection/configuration, Customers/customer history, Orders/details/payments, Production Jobs, receipts/tickets, Inventory, stock movements, Transfers, Services & Pricing, reporting and branch comparison, SMS preview, team/branch/profile/settings, loading/empty/error/access-denied states. Do not silently skip a route because it is less frequently used.

### 4.1 Application shell

- Create a coherent mobile shell with the fixed tab bar, ergonomic header/top app bar, clear current branch and active page, predictable back behavior, and prominent contextual primary actions.
- Ensure navigation is not duplicated needlessly: choose one mobile primary navigation model, while preserving suitable contextual breadcrumbs, filters and local tabs.
- Keep cashiers focused on rapid order handling and admins on scannable, powerful management views. Branch scope must be visible and never misleading; keep branch selection usable without changing role permissions.
- Use the existing feature-oriented structure, shared layout primitives, `src/styles/brand.css`, shadcn/ui and Tailwind. Build any shared `MobileBottomNavigation`/`AdaptiveAppShell` components with a single authoritative role-aware nav configuration; avoid copying separate navigation arrays into each page.

### 4.2 POS: the most important mobile screen

- Keep service selection clear, fast, searchable and correctly labeled, with comfortable touch targets and no microscopic paper/finishing options.
- Adapt multi-item order composition into scannable sections; maintain direct edit/removal, quantity controls, print specifications, live price presentation, advance/partial payment entry and accurate outstanding balance display.
- Preserve the existing functioning **mobile order sheet/cart** and persistent Review/Confirm capability. Ensure it does not fight the new bottom nav: use a measured, documented stacking/placement strategy (e.g., order bar immediately above navigation, or an equally accessible alternative).
- Make totals, price adjustments, stock/material indicators and irreversible/demo-confirmation consequences understandable. No duplicate primary actions, false success messages or additional financial rules.
- Handle onscreen keyboard, long service names, large LKR amounts, error text, one-handed operation, validation and form focus without unexpected page jumps or discarded drafts.

### 4.3 Operational data and complex forms

- For Orders, Customer History, Inventory, Movements, Transfers, Pricing, Reports and other dense data, **adapt information architecture**: responsive rows/cards where better for scanning, accessible scrollable tables where needed, clear filters, status/branch badges, readable monetary values and easy drill-down.
- Never compress wide tables to illegible columns or hide essential columns without a way to access them. Provide explicit accessible scrolling where appropriate. Preserve existing search/sort/filter values and state on navigation where feasible.
- Prefer responsive bottom sheets/full-height mobile sheets to cramped desktop side drawers, using **existing accessible sheet components** and contracts. Provide focus entry/return, Escape/back behavior as appropriate, screen-reader labels, unsaved-change safeguards, close/Cancel/Save actions, scrollable form body and visible action footer. Use short confirmation dialogs for destructive operations.
- Maintain all present UI workflows and controls, including any implemented recurring customers, outstanding balances, editable services and order-linked inventory consumption. **Do not change business rules, inventory deductions, payment calculations, historical snapshots or mock-store consistency.**
- Ensure printable receipt/job ticket layouts remain unchanged except for necessary print-preview usability and never inherit fixed mobile navigation.

### 4.4 Native-like craft without fake native features

Use refined tactile feedback, consistent visual rhythm, clear pressed/selected/loading/disabled states, compact app-like headers, meaningful transition continuity and swift sheet presentation. Favor CSS transforms/opacity and existing UI primitives; use motion **only to explain an interaction**, and respect `prefers-reduced-motion`. Do not introduce animations/parallax that delay a cashier, obscure prices or degrade lower-powered phones. Android Back/browser Back should behave coherently; links should remain real links.

## 5. Tablet adaptation and strict desktop preservation

- Use **content-driven breakpoints** based on observed current behavior, rather than arbitrary user-agent detection. As an initial QA matrix, check **320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1440 and 1920 CSS px**, portrait and landscape where feasible. Test resize transitions rather than only fixed screenshots.
- Phones: fixed five-item bottom navigation. Tablet portrait: choose bottom tabs or a compact adaptive layout depending on available width, task density and keyboard/sheet requirements. Tablet landscape: a compact rail or wider layout may be better. **Document exact chosen switching rules** rather than inventing separate tablet components for the same purpose.
- Desktop: **preserve the current desktop rail/sidebar, header, card composition, table density, split POS panel, design tokens and visual identity**. No wholesale font/color changes, no replacing good desktop tables with mobile cards, no redesigning desktop information architecture. Capture before/after screenshots on matching desktop viewport sizes and fix any material visual regressions introduced by shared CSS.
- Ensure 200% text zoom, dynamic text, narrow landscape height, safe areas, long English/Sinhala/Tamil content, number/currency alignment, and correct scrolling. Do not invent Sinhala/Tamil translations; test text rendering and overflow only.
- Verify usable form controls with mobile virtual keyboards, date/time inputs, screen-reader interaction and touch behavior. The app remains a website; do not claim real native-device certification from an emulator alone.

## 6. Quality architecture, security, accessibility and performance

Apply relevant measures from all available supplied handbooks; this is a focused frontend delivery, **not an excuse for unrelated system rewrites or production infrastructure**.

**Engineering:** Strict TypeScript; existing Next.js App Router and React Server/Client boundaries; composition and reuse; pure domain calculations retained; no duplicated state or authorization logic; no broad `any`, `dangerouslySetInnerHTML`, browser secret exposure, dependency bloat or speculative abstraction. Reuse installed shadcn/ui and Taste guidance if present—**do not re-run destructive initialization** or install overlapping frameworks. Check dependency licenses and actual necessity before any new installation.

**Security boundaries:** Preserve existing authenticated/demo routing, roles and branch-scoped UI. Client-side hidden links never constitute real authorization. Do not modify, remove, bypass or trigger backend integrations, secrets, session enforcement or financial transaction code. Do not store new sensitive data in telemetry or test fixtures. Keep all tests on fictional demo data and isolated frontend adapters.

**HCI / accessibility:** Apply task suitability, self-descriptiveness, user control, recognition over recall, informative feedback, error prevention, recoverability, focus management, consistent navigation, clear labels, meaningful headings, status announcements, color-plus-text statuses, WCAG 2.2 AA where applicable, touch target considerations, text reflow, reduced motion and valid keyboard paths. Automated axe scans are useful but **not a substitute for actual keyboard/screen-reader/manual usability tests**; report what was and was not performed.

**Performance:** Compare to the actual baseline. Minimize mobile JS/hydration and layout shifts; prefer CSS adaptive layouts, existing lightweight Lucide icons and local fonts. Avoid oversized mobile imagery, eager charts, unnecessary listeners and expensive animation loops. Split/virtualize only when profiling justifies it. Measure representative navigation/load/responsiveness and generated assets if tools permit, and investigate meaningful changes—do not fabricate LCP/INP/FPS results or claim production field performance.

## 7. Git governance — required execution behavior

Before editing, inspect `git status`, current branch, local/remote state, `main` SHA, `develop` SHA, existing topic history, and any user changes. **Keep `main` unchanged**. Preserve all unrelated uncommitted work; do not use destructive `git reset --hard`, `git clean`, forced pushes or history rewrites. If branch switching is unsafe, use a separate worktree or stop only the unsafe operation and report why.

Follow the repository's established **topic-branch → atomic commits → tests → local `develop` integration** workflow, if present. Use narrowly scoped branches such as:

```text
feat/MOB-001-center-dashboard-bottom-tabs
feat/MOB-002-adaptive-workspace-shell
feat/MOB-003-mobile-pos-order-experience
feat/MOB-004-mobile-management-screens
feat/TAB-001-tablet-navigation-layouts
fix/MOB-005-safe-area-overlay-collisions
test/MOB-006-responsive-accessibility-regression
docs/MOB-007-mobile-handover
```

Only create branches for work actually needed. Maintain a **clear Conventional Commit for every meaningful functionality added, edited, updated, corrected, refactored, deleted or reverted**; keep independent concerns in independent commits. Suggested subject formats:

```text
feat(navigation): center Dashboard in role-aware mobile tabs
fix(pos): prevent order-review footer and tabs from overlapping
style(tablet): adapt management panes without desktop changes
test(mobile): cover keyboard, safe area and role navigation
refactor(ui): share adaptive navigation configuration
docs(mobile): record breakpoints, screenshot evidence and Git traceability
```

Commit bodies should state `Requirement/ID`, `Why`, `Behavior/Files`, `Validation actually run`, and `Limitations` when material. Explicitly stage intended paths, inspect staged changes (`git diff --cached` and `git diff --cached --check`), and never commit secrets, generated output or unrelated changes. Retain useful topic-branch history; integrate verified units via non-fast-forward merges into **local `develop`** when repository conventions and working-tree safety permit. **Do not merge into `main`.** Do not assume a GitHub remote exists; **push a feature/develop branch or open a remote PR only if the existing remote permissions/workflow explicitly authorize it**. Otherwise deliver local commits with clear instructions, not a false GitHub URL.

Update existing change-log, requirement coverage, feature register, Git audit, validation log and frontend status docs with actual source commits, integration commits, tests and any remaining issues. A commit cannot record its own hash inside its body; write SHA-index entries in a subsequent audit commit or record them accurately in handoff. Keep previous audit history intact.

## 8. Execution sequence and verification gates

Proceed autonomously and implement actual code, not just analysis:

1. **Audit:** inspect running code and documented references; capture before screenshots and existing behavior/tests; identify desktop invariants and mobile blockers.
2. **Navigation foundation:** implement role-aware fixed phone tabs, Dashboard center/default landing, More destinations and safe-area/content-clearance rules.
3. **Adaptive shell/tablet:** compose shared responsive header/sidebar/bottom nav based on real breakpoint needs, while preserving desktop presentation.
4. **Feature-by-feature refinements:** POS and its cart first; then every current cashier/admin operational route, form, drawer, table, filter, detail and report; include any additional implemented customer/service/material flows.
5. **Craft and hardening:** touch/keyboard behavior, motion, virtual keyboard, focus, orientation, long content, zoom, scroll/overlay hierarchy and mobile performance.
6. **Tests, real visual review, fixes:** run repository-defined lint, typecheck, formatting, unit/component, build and E2E commands. Add focused automated tests. Fix newly introduced failures; distinguish and document pre-existing failures.
7. **Traceable integration and handoff:** commit each finished concern, verify local Git graph and `main` preservation; update evidence and deliver a precise report.

### Must-pass behavior scenarios

- On **360/390px phone** the cashier enters through the normal demo/login path → **Dashboard loads first and is the center tab** → POS and Orders are a single predictable tap away → open, edit and review an order without the tabs covering totals, errors or primary buttons.
- On **390/430px phone** the administrator sees appropriate role-based tabs, Dashboard centered, and can reach **every existing admin screen** through tabs or More, including Pricing/Services, Customers and inventory/reporting screens **if implemented**, without exposing unintended cashier/admin behavior.
- On 320px narrow screens, 200% text, long labels and large LKR balances stay understandable; there is no global horizontal overflow, clipped label, inaccessible close button or stuck overlay.
- The mobile order sheet, payment form, inventory transfer drawer, customer/service editors (if present) and the bottom bar coordinate correctly with touch, focus, scrolling and the software keyboard.
- On tablet portrait and landscape, split/pane layouts and navigation respond naturally without unusable desktop-width tables or stacked fixed bars.
- On **1280/1440/1920px desktop**, screenshots and functional flows remain materially equivalent to the existing design. Existing desktop POS persistent totals, navigation rail, data screens and prints retain their established presentation.
- Deep links, browser Back/Forward, role/branch navigation, prior form state, print pages and accessible focus states do not regress; bottom bar is absent from printed output.
- Existing demo workflows involving orders, saved customers, services/prices, payments, job tickets, material inventory, transfers, reports, SMS previews and settings (as implemented) continue to yield **identical business results**. No live backend writes or calls occur.

### Minimum actual verification

Use existing tooling wherever possible (Playwright, Vitest, React Testing Library, accessibility scans, responsive screenshots). Run configured checks such as `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test`, `npm run build`, `npm run test:e2e` **only if those scripts exist**, using the repository's package manager. Compare current results against its true current baseline rather than claiming the previous reported **58 tests / 33 E2E** remain the final totals. Run Chromium/WebKit/Firefox and mobile browser emulations **where actually available**; no skipped tests disguised as passing. Capture representative phone/tablet/desktop _before and after_ screenshots and, if supported, print previews. Keep browser console/hydration warnings under review.

## 9. Definition of done and final report

This task is complete only when the **entire existing POS frontend** feels intentionally crafted for smartphones and tablets, all authorized modules remain usable, **Dashboard is visibly the center phone tab and normal landing screen**, the bottom bar never obscures content, tablet layouts are thoughtfully adaptive, **the current desktop look is substantially unchanged**, no business functionality is lost, new frontend tests/checks were honestly executed, and **every meaningful change has auditable Git branches and commits without changes to `main`**.

Report **(a)** implementation per module; **(b)** chosen mobile/tablet navigation mapping and breakpoints; **(c)** screenshots/evidence paths; **(d)** actual test commands with pass/fail/blocked results, browser coverage, accessibility/performance limitations; **(e)** exact topic branch names, conventional commit SHAs, integration `develop` SHA and unchanged `main` SHA; **(f)** confirmation of **zero backend/API/database/auth-provider/SMS/payment/infrastructure operations**. Call unverified real-device, screen-reader and production-readiness claims out explicitly.

**BEGIN NOW:** inspect the repository and references, protect Git history, implement the responsive frontend enhancement in focused topics, verify it against existing desktop and business workflows, and deliver the tested local frontend with complete provenance. **No backend work. No desktop redesign. No planning-only handoff.**
