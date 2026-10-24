# HCI acceptance matrix

Source: all 25 pages of HCI_Principles_Handbook_2026.pdf supplied in Downloads, edition 24 October 2026; its 238 practices are guidance, not a blanket certification. Exact practice IDs are retained. No participant research, real screen-reader/device test or claim of implementing every catalogue entry is made.

| Practice IDs                          | APPLY / AVOID translation                      | Implementation                                                                                               | Evidence                                                 | Result / limit                                                            |
| ------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------- |
| 02.01 / 03.02                         | Tasks and real-world language                  | Dedicated multi-line POS; Orders, Production jobs, Stock transfers; familiar native controls                 | POS/order/transfer browser flows                         | Applied; real cashier observation pending                                 |
| 03.01 / 07.02 / 07.03                 | Visible truthful state                         | Actual hydration/route skeleton, saving feedback only after local persistence, NOT SENT SMS                  | resilience.spec.ts; quota/repository tests               | Verified demo behavior                                                    |
| 03.03 / 04.06 / 07.11                 | Control and recovery                           | Cancel/Escape/dirty-close protection, undo removed line, retained form on error, explicit fixture reset      | sheet/confirmation tests; accessibility/integrated E2E   | Verified permitted recovery; no financial reversal policy invented        |
| 03.05 / 05.08 / 08.08                 | Error prevention and review                    | Review branch/items/advance; source/destination transfer preview; reject invalid money/stock                 | domain tests; POS/transfer/negative browser tests        | Verified demo guards                                                      |
| 06.01 / 06.03 / 06.12 / 06.13         | Orientation and safe context                   | Real URLs, branch/role context, scoped direct links, URL history filters and contextual detail sheets        | access.test.tsx; order and route-denial E2E              | Verified UI; production authorization future                              |
| 06.08 / 06.14                         | Useful lists and no-data states                | Order sort/search/status/payment filters; low-stock and inactive filters; meaningful empty recovery          | orders/inventory/reports E2E                             | Verified demo                                                             |
| 07.09 / 07.10 / 08.02                 | Located errors and persistent labels           | Labeled fields; on-blur POS validation; field errors/alerts; preserved input                                 | POS invalid-quantity and payment/transfer negative tests | Verified representative paths; no universal form certification            |
| 08.01 / 08.05 / 08.14                 | Data minimization and forgiving optional input | Walk-in default, optional fictional contact, spaces/hyphens accepted for valid Sri Lankan formats            | schemas and contact validation tests                     | Applied; actual customer/privacy requirements pending                     |
| 08.09 / 08.13                         | Price transparency and receipts                | Itemized saved quote, explicit cents/duplex/setup basis, advances/balance, separate browser documents        | price snapshot/domain/printing tests and PDFs            | Verified demo; actual tax/printer policy pending                          |
| 09.01 / 09.05 / 09.10                 | Hierarchy and token contract                   | Canonical brand.css, restrained provisional identity, tabular currency, reusable status/feedback controls    | source inspection; visual evidence                       | Applied; brand is not approved production identity                        |
| 09.04 / 09.13                         | Redundant status and honest charts             | Text status badges, exact data tables, chart zero baseline and LKR labels                                    | report reconciliation and chart data review              | Applied; charts not a substitute for numeric data                         |
| 09.15 / 10.21                         | Purposeful reduced motion                      | Short sheet/route transitions; system and saved reduced-motion support                                       | profile persistence and source CSS review                | Verified preference behavior                                              |
| 10.02 / 10.05 / 10.06 / 10.08         | Keyboard and focus                             | Semantic controls, visible rings, modal focus/trap/Escape/restore, stable main fallback after removal        | RTL focus tests; mobile keyboard/dirty drawer E2E        | Verified tested paths; actual screen-reader/device checks unperformed     |
| 10.09 / 10.16 / 10.17                 | Names, contrast and announcements              | Accessible names, labelled inputs, status/error messages, selected A/AA axe rules                            | login plus all workspace route scans                     | No detected tagged scan violations; not full compliance                   |
| 10.12 / 11.01 / 11.02 / 11.03         | Reflow and adaptive navigation                 | Six widths, 200% text resize, mobile navigation and intentional table scrolling                              | viewport screenshots and mobile keyboard test            | Verified browser emulation; real device testing deferred                  |
| 11.09 / 11.11 / 11.12                 | Bandwidth/loading and performance              | No remote fonts/media, lightweight CSS charts, reserved loading skeleton, production asset report            | delayed-script test; production build/assets             | Static/browser evidence; no real network/device performance guarantee     |
| 11.13 / 07.14                         | State resilience and conflicts                 | Validated tab draft, schema recovery, quota rejection and stale storage detection                            | repository and integrated failure tests                  | Verified local demo; true multi-user concurrency future                   |
| 12.01 / 12.03 / 12.07 / 12.08         | Trust and privacy                              | Fictional-only entry, no passwords/keys, simulated payment notices, unsent/unscheduled SMS                   | negative/persistence/preview E2E and source review       | Applied; no legal/security certification                                  |
| 13.01 / 13.04 / 13.07 / 13.08         | Consistency, workflow QA, provenance, roles    | Shared primitives/domain/store, retained movement/audit events, visible role boundaries, feature Git history | unit/E2E suite and Git audit                             | Verified local provenance; production immutability/auth future            |
| 17.03 / 17.04 / 17.08 / 17.13 / 17.14 | Inspection, triage, decisions and regression   | Failures captured then corrected on focused branches; documented verification/limitations                    | validation-log.md; decisions.md; Git changes             | Expert/automated evidence; no participant research or universal assurance |

## Explicit deferred / not-applicable areas

Human-centred participant recruitment, co-design, observation, qualitative/quantitative triangulation and actual assistive-technology validation are deferred to a real business evaluation. No fabricated task timings, satisfaction studies or accessibility percentage is supplied. Production security, recovery, support and cross-device continuity require backend/operations evidence. No dark theme was requested/provided. AI, voice, spatial, wearables, media captions, drag and bulk workflows are not added merely because the handbook discusses them.

## Complete catalogue disposition inventory

Entries below identify applicability, not 238 individual implementation claims. Use the engineering matrix above for concrete evidence. Catalogue titles are extracted from the actually read handbook; source/licensing and normative standards remain the handbook's own references.

| ID    | Source practice title                   | Disposition                                                                                                          |
| ----- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 01.01 | Context before interface                | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 01.02 | Specify actual user goals               | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 01.03 | Use representative participants         | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 01.04 | Participatory design                    | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 01.05 | Study real workflows                    | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 01.06 | Iterate with evidence                   | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 01.07 | Design the end-to-end journey           | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 01.08 | Multi-disciplinary collaboration        | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 01.09 | Distinguish needs from wants            | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 01.10 | Co-design for edge cases                | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 01.11 | Explicit product hypotheses             | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 01.12 | Review unintended outcomes              | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 02.01 | Suitability for the user’s tasks        | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 02.02 | Self-descriptiveness                    | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 02.03 | Conformity with user expectations       | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 02.04 | Learnability                            | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 02.05 | Controllability                         | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 02.06 | Use error robustness                    | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 02.07 | User engagement                         | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 03.01 | Visibility of system status             | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 03.02 | Match with the real world               | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 03.03 | User control and freedom                | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 03.04 | Consistency and standards               | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 03.05 | Error prevention                        | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 03.06 | Recognition over recall                 | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 03.07 | Flexibility and efficiency              | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 03.08 | Aesthetic and minimalist design         | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 03.09 | Recognize, diagnose and recover         | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 03.10 | Help and documentation                  | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 04.01 | Strive for consistency                  | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 04.02 | Seek universal usability                | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 04.03 | Offer informative feedback              | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 04.04 | Design dialogs for closure              | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 04.05 | Prevent errors                          | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 04.06 | Permit reversal of actions              | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 04.07 | Keep users in control                   | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 04.08 | Reduce short-term memory load           | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.01 | Fitts's law                             | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.02 | Hick-Hyman effect                       | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.03 | Jakob's law                             | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.04 | Mental models                           | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.05 | Conceptual models                       | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.06 | Affordances and signifiers              | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.07 | Natural mapping                         | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.08 | Constraints                             | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.09 | Feedback loops                          | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.10 | Chunking                                | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.11 | Progressive disclosure                  | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.12 | Recognition cues                        | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.13 | Serial position effects                 | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.14 | Gestalt proximity                       | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.15 | Gestalt similarity                      | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.16 | Gestalt common region                   | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.17 | Gestalt continuity                      | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.18 | Change blindness awareness              | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.19 | Attention is scarce                     | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 05.20 | Cognitive load balancing                | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 06.01 | Clear information scent                 | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 06.02 | Task-oriented taxonomy                  | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 06.03 | Persistent orientation                  | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 06.04 | Predictable navigation                  | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 06.05 | Meaningful labels                       | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 06.06 | Search as complement                    | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 06.07 | Faceted filtering                       | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 06.08 | Sortable data                           | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 06.09 | Breadcrumbs when useful                 | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 06.10 | Local navigation                        | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 06.11 | Progress indication                     | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 06.12 | Safe deep links                         | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 06.13 | Stateful return                         | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 06.14 | Empty states as guidance                | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 06.15 | Findability beyond menus                | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 07.01 | Clear primary action                    | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 07.02 | Visible action results                  | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 07.03 | Transparent loading states              | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 07.04 | Optimistic UI cautiously                | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 07.05 | Undo over warning                       | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 07.06 | High-stakes confirmation                | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 07.07 | Explicit destructive affordances        | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 07.08 | Forgiving input                         | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 07.09 | Precise error location                  | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 07.10 | Inline validation timing                | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 07.11 | Preserve entered data                   | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 07.12 | Graceful degradation                    | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 07.13 | Interruptibility                        | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 07.14 | Conflict management                     | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 07.15 | Notification discipline                 | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 07.16 | Predictable timeouts                    | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 08.01 | Ask only what is necessary              | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 08.02 | Persistent visible labels               | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 08.03 | Appropriate input controls              | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 08.04 | Helpful defaults                        | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 08.05 | Optional versus required                | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 08.06 | Field grouping                          | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 08.07 | Auto-completion support                 | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 08.08 | Review before commitment                | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 08.09 | Pricing transparency                    | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 08.10 | Consent as a real choice                | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 08.11 | Readable microcopy                      | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 08.12 | Error copy for humans                   | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 08.13 | Success and receipts                    | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 08.14 | Internationalized input                 | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 09.01 | Hierarchy before decoration             | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 09.02 | Typography for readability              | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 09.03 | Contrast by function                    | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 09.04 | Color with redundancy                   | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 09.05 | Semantic color tokens                   | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 09.06 | Spacing rhythm                          | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 09.07 | Responsive typography                   | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 09.08 | Icon label clarity                      | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 09.09 | Component consistency                   | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 09.10 | Design tokens as contracts              | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 09.11 | Composable patterns                     | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 09.12 | Dark mode and themes                    | N/A or bounded: no dark theme, media, essential image/gesture, notification or bulk feature required                 |
| 09.13 | Data visualization integrity            | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 09.14 | Multiple reading routes                 | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 09.15 | Motion with purpose                     | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 09.16 | Consistency without rigidity            | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.01 | Perceivable content                     | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.02 | Operable interface                      | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.03 | Understandable operation                | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.04 | Robust semantics                        | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.05 | Keyboard access                         | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.06 | Visible focus                           | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.07 | Logical focus order                     | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.08 | Focus management in dialogs             | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.09 | Text contrast thresholds                | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.10 | Non-text contrast                       | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.11 | Target size 2.2 AA                      | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.12 | Zoom and reflow                         | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.13 | Captions and transcripts                | N/A or bounded: no dark theme, media, essential image/gesture, notification or bulk feature required                 |
| 10.14 | Meaningful alt text                     | N/A or bounded: no dark theme, media, essential image/gesture, notification or bulk feature required                 |
| 10.15 | Semantic headings                       | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.16 | Accessible names                        | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.17 | Status announcements                    | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.18 | Do not rely on dragging                 | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.19 | No redundant re-entry                   | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.20 | Accessible authentication               | Partial/future: demo context only; real auth, localization, assistive devices or production continuity not certified |
| 10.21 | Motion sensitivity                      | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.22 | Consistent help placement               | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.23 | RTL and localization                    | Partial/future: demo context only; real auth, localization, assistive devices or production continuity not certified |
| 10.24 | Cognitive accessibility                 | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 10.25 | Assistive technology testing            | Partial/future: demo context only; real auth, localization, assistive devices or production continuity not certified |
| 11.01 | Responsive layout                       | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 11.02 | Adaptive navigation                     | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 11.03 | Touch ergonomics                        | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 11.04 | Multiple input modes                    | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 11.05 | Gesture discoverability                 | N/A or bounded: no dark theme, media, essential image/gesture, notification or bulk feature required                 |
| 11.06 | Screen rotation and resizing            | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 11.07 | Cross-device continuity                 | Partial/future: demo context only; real auth, localization, assistive devices or production continuity not certified |
| 11.08 | Offline awareness                       | Partial/future: demo context only; real auth, localization, assistive devices or production continuity not certified |
| 11.09 | Low-bandwidth design                    | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 11.10 | Progressive enhancement                 | Partial/future: demo context only; real auth, localization, assistive devices or production continuity not certified |
| 11.11 | Performance as usability                | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 11.12 | Avoid layout shift                      | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 11.13 | State resilience                        | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 11.14 | Notification permission timing          | N/A or bounded: no dark theme, media, essential image/gesture, notification or bulk feature required                 |
| 12.01 | Truthful interface claims               | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 12.02 | No deceptive patterns                   | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 12.03 | Privacy by default                      | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 12.04 | Purpose limitation                      | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 12.05 | Data visibility and deletion            | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 12.06 | Appropriate permission prompts          | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 12.07 | Safe defaults                           | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 12.08 | Transparent automation                  | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 12.09 | Explain irreversible impacts            | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 12.10 | Safety over frictionlessness            | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 12.11 | Balanced persuasion                     | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 12.12 | Trust through reliability               | Partial/future: demo context only; real auth, localization, assistive devices or production continuity not certified |
| 12.13 | Security with usable recovery           | Partial/future: demo context only; real auth, localization, assistive devices or production continuity not certified |
| 12.14 | Equity and harm review                  | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 12.15 | Age/context appropriateness             | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 13.01 | Design-system-first development         | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 13.02 | Platform-native expectations            | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 13.03 | Consistent cross-product language       | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 13.04 | Accessible components are not enough    | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 13.05 | Complex-data progressive detail         | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 13.06 | Bulk-action safeguards                  | N/A or bounded: no dark theme, media, essential image/gesture, notification or bulk feature required                 |
| 13.07 | Auditability                            | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 13.08 | Role-based clarity                      | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 13.09 | Service continuity                      | Partial/future: demo context only; real auth, localization, assistive devices or production continuity not certified |
| 13.10 | Governance with exceptions              | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 14.01 | 01. State AI capabilities clearly       | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 14.02 | 02. Calibrate expectations              | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 14.03 | 03. Time assistance to context          | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 14.04 | 04. Use relevant context                | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 14.05 | 05. Respect social expectations         | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 14.06 | 06. Check social bias                   | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 14.07 | 07. Make AI easy to invoke              | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 14.08 | 08. Make AI easy to dismiss             | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 14.09 | 09. Enable quick correction             | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 14.10 | 10. Reduce scope under uncertainty      | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 14.11 | 11. Explain relevant reasons            | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 14.12 | 12. Use recent context responsibly      | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 14.13 | 13. Adapt to user preferences carefully | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 14.14 | 14. Change behavior cautiously          | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 14.15 | 15. Collect specific feedback           | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 14.16 | 16. Explain action consequences         | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 14.17 | 17. Offer global AI controls            | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 14.18 | 18. Notify meaningful change            | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 15.01 | Verify consequential claims             | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 15.02 | Source and provenance cues              | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 15.03 | Human approval gates                    | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 15.04 | Tool-action visibility                  | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 15.05 | Least-privilege agent design            | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 15.06 | Editable outputs                        | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 15.07 | Uncertainty without theater             | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 15.08 | Prompt injection resilience in UX       | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 15.09 | Sensitive-data boundaries               | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 15.10 | Failure paths for agent plans           | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 15.11 | Conversation repair                     | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 15.12 | Clear system-vs-user authorship         | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 15.13 | Feedback beyond ratings                 | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 15.14 | Outcome evaluation                      | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 16.01 | Multimodal equivalence                  | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 16.02 | Voice discoverability                   | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 16.03 | Turn-taking clarity                     | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 16.04 | Speech privacy                          | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 16.05 | Situational awareness                   | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 16.06 | Spatial legibility                      | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 16.07 | Spatial safety boundaries               | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 16.08 | Comfort-aware motion                    | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 16.09 | Graceful handoff between modes          | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 16.10 | Wearable glanceability                  | N/A: no AI/voice/spatial/wearable product capability in this POS scope                                               |
| 17.01 | Task success before delight             | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 17.02 | Usability test with tasks               | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 17.03 | Heuristic inspection                    | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 17.04 | Accessibility audit triad               | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 17.05 | Measure effort and time                 | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 17.06 | Qual and quant triangulation            | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 17.07 | Segmented outcome analysis              | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 17.08 | Prioritized severity                    | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 17.09 | Performance budgets                     | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 17.10 | Content comprehension tests             | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 17.11 | Experimentation ethics                  | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 17.12 | Continuous feedback loop                | Deferred/partial: source-brief assumptions and automated scenarios; real users/research/operations not performed     |
| 17.13 | Document decisions                      | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |
| 17.14 | Regression coverage                     | Applicable guidance: translate through matrix above; evidence is workflow-specific, not a blanket pass               |

Extracted unique catalogue IDs: 238. All 25 pages were read. Any applicability is contextual; ISO/WCAG conformity requires its own complete assessment.

## Premium enhancement evidence update · 2026-10-24

The complete 238-entry catalogue above remains unchanged. This update strengthens representative evidence rather than marking every practice passed.

| Existing practice IDs                 | Applied refinement                                                                             | Actual evidence / limit                                                                          |
| ------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 09.01 / 09.05 / 09.10                 | Canonical warm-paper/lime/charcoal hierarchy, local Manrope and tabular amounts                | Final production gallery and token contract; provisional brand                                   |
| 09.04 / 09.13                         | Quiet metrics, distinct text statuses, zero-based visible chart scales and exact table         | Dashboard/reports inspection; shared cohort engine unchanged                                     |
| 08.09 / 08.13                         | Existing-capability service quotes, visible total/advance/balance and separate print documents | Premium POS, footer and original financial/printing regressions; no approved tax/hardware policy |
| 10.02 / 10.05 / 10.06 / 10.08         | Accessible category radio group, mobile navigation, modal return and mobile Edit focus         | Keyboard, drawer and focus regression tests; real AT unperformed                                 |
| 10.09 / 10.16 / 10.17                 | Named controls, stronger control edges and status/error messages                               | 22 contrast pairs pass; selected axe scans detect no violations, not full conformity             |
| 10.12 / 11.01 / 11.02 / 11.03         | Nine widths, internal table/sheet scrolling, long Unicode text, sticky review footer           | 320–1920px, 200% text, landscape and populated desktop scroll tests; viewport emulation only     |
| 09.15 / 10.21                         | Removed route entrances, restrained control/sheet motion                                       | Reduced-motion/browser preference checks; no decorative loops                                    |
| 11.09 / 11.11 / 11.12                 | Local fonts/no runtime external assets, truthful skeleton, measured bundle/lab                 | Raw lab and aggregate asset report; no field CWV/INP claim                                       |
| 17.03 / 17.04 / 17.08 / 17.13 / 17.14 | Structural/craft/final visual reviews, captured failures, focused fixes and full rerun         | validation-log.md, gallery, Git audit; no participant study                                      |
