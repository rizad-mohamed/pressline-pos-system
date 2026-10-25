# Mobile refinement · implementation record

Baseline: clean develop `92ec826bebd3448ec322721119dcefa3d558b626`; main `e0b62dcb03330778fcdc8b6b1a4e5cc421beb604`. No remote. Existing frontend has 84 unit/component and 44 production Chromium checks. This task changes presentation/navigation only, preserving pure domain/data and all financial, service/customer snapshot and material-usage behavior.

The supplied mobile specification is transcribed in references. The existing master prompts, engineering handbook, HCI handbook transcription/catalogue, design system, visual references, previous follow-up and Git/validation records inform this scoped change. Original unknown FR/NFR and production-readiness source gaps remain historical limits. No backend, auth-provider, API, database, payment/SMS, infrastructure or deployment action is authorized.

## Existing experience and direction

Before capture: all 12 workspace routes at 390, 820, 1280, 1440 and 1920 pixels, fictional Administrator, fixed clock and loaded local fonts; no browser exceptions. Raw screenshots are initially retained in ignored `.local/mobile-before` and selected before/after evidence will be promoted at handover. Phone Dashboard/POS and portrait-tablet inventory were visually inspected. The existing phone hamburger hides frequent destinations; the order bar occupies the viewport bottom. Existing desktop rail, Manrope/paper/charcoal/lime palette, cards and data tables are retained.

Navigation direction: five equal phone/portrait-tablet destinations up to and including 900px, reusing the current content-driven rail breakpoint. Cashier: New order, Orders, Dashboard, Production, More. Administrator: Orders, Inventory, Dashboard, Reports, More. Dashboard is exactly third. Above 900px the existing 104px rail is retained; the existing POS summary switches at 1100px. More contains all remaining authorized destinations plus guide/account actions, using the existing Radix sheet/focus contract. Do not invent another permissions model.

Pressline's face remains the paper/ink identity and real print-job/branch figures, with the existing Taste app direction retained under the explicit desktop-preservation requirement. No new theme draw, font, chart, framework or runtime dependency is needed. Taste source/browser checks and screenshot critique will be reused to judge the mobile work. The main phone question is: which branch task can I carry out next, without losing my current print order?

## Work units

| ID                          | Intended unit                                                                      | Branch                                           | Gate                                                           |
| --------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------- |
| MOB-000                     | Scope, references and actual baseline                                              | docs/mob-000-scope                               | Trace and baseline captures                                    |
| MOB-001 / MOB-002 / TAB-001 | Shared role-aware destinations, centered fixed navigation, More and adaptive shell | feat/mob-001-center-dashboard-bottom-tabs        | Navigation/entry unit checks and responsive browser checks     |
| MOB-003                     | Mobile POS/order-bar and form/sheet ergonomics                                     | feat/mob-003-mobile-pos-order-experience         | Totals/review, focus, keyboard/rotation and draft preservation |
| MOB-004                     | Operational route/form/table usability                                             | feat/mob-004-mobile-management-screens           | Every route and real drawer/management workflow                |
| MOB-006                     | Mobile/tablet/accessibility and desktop preservation regression                    | test/mob-006-responsive-accessibility-regression | Full existing and new quality gates                            |
| MOB-007                     | Gallery, measurements, traceability and handover                                   | docs/mob-007-mobile-handover                     | Final format/Git/evidence audit                                |

Create a separate correction branch only for an actual demonstrated defect. Keep meaningful source changes atomic and merge verified topics with no-ff; retain refs. Exact source/merge values follow in subsequent audit entries.

## Required verification

Widths: 320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1440, 1920; both landscape and resize transitions; 200% text; long English/Sinhala/Tamil, no fabricated translations; safe-area variables and browser keyboard simulations distinguished from physical devices. Navigation and More role coverage, current nested routes, root entry, deep links/Back/Forward, access denial, focus/Escape, print isolation, POS sheet/review and all connected customer/service/material/payment/report/SMS/reset scenarios must remain correct. Compare matching desktop captures and asset/runtime evidence with this actual baseline. Run strict typecheck/lint/format/unit/build/production E2E. No real device, AT, printer or field-performance claim without execution.
