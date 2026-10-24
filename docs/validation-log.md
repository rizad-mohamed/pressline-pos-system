# Frontend verification evidence

Final application verification on 2026-10-24: `npm ci`, strict typecheck, lint, formatting, the complete production build, **58 tests across 14 unit/component files**, and **all 24 production Chromium E2E checks passed**. The combined suite passed after separately correcting UI-005 and fixing a test URL-capture race (dbf0e8c). The final table below records the completed results; earlier failures remain documented in the defect history.

Production asset assessment after the table fix: 28 generated JavaScript files, 1,059,173 bytes / 335,433 gzip bytes in total; one CSS file, 26,488 bytes / 6,262 gzip bytes. These are all route assets combined, not initial-page transfer or runtime performance scores. `node scripts/bundle-report.mjs` reproduces the measurement.

Manual screenshot review so far: desktop login/dashboard/POS/reports/SMS and mobile inventory were inspected for hierarchy, readable forms/status, table containment and truthful labels. Desktop settings/profile and the receipt/job-ticket print images were also inspected; both generated PDFs were confirmed as one page. No physical-device/screen-reader/participant or printer-output test is claimed.

Date: 2026-10-24, Asia/Colombo. Only executed checks are reported as passes. This is a local frontend demonstration; no production launch gates are certified.

| Check                   | Final result                            | Evidence / limit                                                                                                                    |
| ----------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`     | passed                                  | Strict TypeScript passed after clean install and UI-005 integration.                                                                |
| `npm run lint`          | passed                                  | Peer-compatible ESLint passed after clean install; interrupted earlier check was rerun.                                             |
| `npm run test`          | 58/58 passed across 14 files            | Domain, schema, repository, role, drawer and confirmation checks.                                                                   |
| `npm run format:check`  | passed                                  | Source, tests, scripts and audit documents checked; delivery docs receive a final recheck.                                          |
| Module Playwright tests | all included in 24/24 production suite  | Account/POS/orders/printing/inventory/transfers/pricing/reports/SMS/settings.                                                       |
| Responsive Playwright   | passed                                  | 360, 390, 768, 1024, 1280, 1440 CSS pixels; 200% text resize; all data-screen mobile tables keyboard-scrollable.                    |
| Automated accessibility | passed selected rules                   | Login and all 11 workspace routes: no detected tagged A/AA violations or browser page exceptions; not full WCAG certification.      |
| `npm run build`         | passed complete frontend                | Next 16.4.3 production build, 15 prerendered outputs plus dynamic order/print routes.                                               |
| Combined production E2E | 24/24 passed                            | Cross-module order/report/SMS consistency, duplicate activation, quota/corruption, keyboard, delayed scripts, screenshots and PDFs. |
| `npm ci`                | passed                                  | Lockfile reproduced: 496 packages installed, 497 audited, zero known vulnerabilities; Node 24.14.1/npm 11.11.0.                     |
| `npm ls eslint`         | passed after correction                 | Exact ESLint 9.39.5 satisfies Next plugin peers; upstream EOL is documented                                                         |
| `npm audit --omit=dev`  | zero known vulnerabilities at execution | Does not establish absence of vulnerabilities or replace review                                                                     |

## Defects found and corrected

- DOM-002: early-day payment was rejected because a current-day fixture was in the future. Preserved unverified checkpoint ec365a9; corrected separately in 1f16dac and retested before integration.
- DOM-004: three stale/reset/storage-removal regressions failed before correction; all seven repository tests and browser reset passed afterward (f93b732).
- UI-002: zero quantity disabled review without a field correction; on-blur validation and add/remove/undo browser regression now pass. Confirmation and drawer closure restore focus to a connected opener or stable main landmark.
- Tooling: resolver 6 optional peers conflicted; resolver 5.2.2 works with RHF 7/Zod 4. ESLint 10 ran rules but failed peer-tree validation; pinned compatible 9.39.5. Default axe generated-source injection threw a syntax error on a hydrated route; the supported explicit distributed-source option completed scans.

## Manual and external limits

Final screenshot artifacts are retained for the visual review described above. Browser testing uses standalone Playwright because the Browser connector returned no available browser. No real screen reader, participant research, physical phone/tablet, physical printer, low-bandwidth device test, cloud service or production security/reliability review has been performed. No accessibility, performance or production-readiness percentage is claimed.

Source hygiene: no application route handlers/production API implementation, private-key patterns, service-role use or dangerouslySetInnerHTML were found in the scoped source scan. This is a proportionate source check, not a penetration test.

Test synchronization correction dbf0e8c waits for Next navigation before reading an order URL. The previous failed artifact requested /print/job/pos from an old URL; application order/receipt assertions had already passed. All 24 tests subsequently passed without weakening financial or access assertions.

## Premium frontend final production verification · 2026-10-24

Baseline was develop `c73980c` with 58 unit/component and 24 browser tests. The earlier records above remain historical. Current app source is integrated through `f228a49`, followed by the PREM-010 test-only synchronization repair; handover/audit documentation follows on its own topic.

| Command / method                                  | Actual outcome                                                                                                                                                      |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                                          | Passed clean: 544 installed, 545 audited, zero known vulnerabilities at execution                                                                                   |
| `npm run typecheck` / `lint` / `format:check`     | Passed after formatter-only correction; final docs formatted/rechecked separately                                                                                   |
| `npm run test`                                    | 58 tests across 14 files passed                                                                                                                                     |
| `npm run build`                                   | Passed complete production Next 16.4.3 frontend                                                                                                                     |
| Explicit `npm run start`, then `npm run test:e2e` | 33/33 production Chromium tests passed, one worker, no skips or configured retry                                                                                    |
| `node scripts/check-design.mjs`                   | All 22 actual token pairs pass unrounded thresholds (text ≥4.5, controls/charts ≥3)                                                                                 |
| `node scripts/bundle-report.mjs`                  | 30 JS assets: 1,131,249 bytes / 361,372 gzip; CSS: 48,779 / 10,196 gzip; font 164,700 bytes separately                                                              |
| `node scripts/measure-ui.mjs`                     | Six account-primed local production navigations: LCP 1028–1460 ms; CLS 0.000548633; 1–3 long tasks per navigation; no external runtime requests                     |
| Final production gallery / PDFs                   | All captured routes/drawers reviewed; browser errors empty; both PDFs one A4 page                                                                                   |
| Scoped source / dependency checks                 | Domain/data diff empty; no route handlers, production endpoint/secret or unsafe HTML pattern found; production audit zero known vulnerabilities, direct peers valid |

Original aggregate baseline was JS 1,059,173 / 335,433 gzip and CSS 26,488 / 6,262 gzip. The additional component interactions, styling and font have a measurable cost. Aggregate route assets are not initial-page transfer. Lab uses Chromium, 4× CPU slowdown, 40 ms latency and 1,250,000 bytes/s download with HTTP cache disabled; core/font assets may be warm from demo entry. No cold startup, Lighthouse, field CWV/INP, real device or uptime claim.

Coverage includes nine widths (320, 360, 390, 430, 768, 1024, 1280, 1440, 1920), 200% text, long unbroken/Sinhala/Tamil input, landscape, reduced motion, keyboard categories and mobile navigation, empty/remove/undo, post-drawer Edit focus and desktop review visibility before/after scroll. Selected WCAG A/AA axe scans cover login and all 11 workspace routes with no detected tagged violations. Existing payment/snapshot/production/branch/inventory/transfer/report/SMS/reset/recovery/print scenarios all reran.

### Failed checkpoints and disposition

1. A new filter test assumed button semantics; inspected current Radix source/DOM showed single ToggleGroup radio semantics. Corrected the test locator; app unchanged, focused checks passed.
2. Stronger internal-width assertions found long text overflowing the 320px cart and then the review currency flex container. Repaired wrapping and protected monetary width; all long-content, Unicode, landscape and reduced-motion cases passed.
3. Initial input-border contrast passed white but failed canvas (2.891:1). Changed canonical control edge to #7f8a77; canvas is now 3.392:1 and all 22 pairs pass.
4. A full 32-test run had one 430px test fail before app assertions in Playwright rawEvaluateHandle source injection with SyntaxError. Preserved trace, three unchanged repeats passed, then complete unchanged 32-test run passed. Root cause unconfirmed; no retry/skip/assertion suppression. Final expanded 33-test production run passed.
5. Final visual inspection revealed desktop Review below a 900px initial viewport. New regression reproduced bottom=1211px. Separate PREM-009 fix constrains the panel from actual top/height, scrolls specifications and preserves total/balance/review; seven focused checks and final full 33 passed.
6. Final quality gate caught only callback wrapping in the added test; applied Prettier, committed separately, then reran typecheck/lint/format/58 tests/build and all 33 production tests successfully.
7. The first expanded 33-test run passed 32 and exposed a test race: Space arrived before Radix's deferred ArrowRight focus move. Installed roving-focus source confirms setTimeout focus scheduling. Added explicit toBeFocused assertions after each arrow, preserving every original selection/count/navigation assertion and adding no sleep/retry. Five repeated focused production checks and the subsequent full 33-test suite passed. Trace/screenshot preserved locally.

Taste was actively used: deterministic commerce draw, native entry inspection, source lint and reviewed signed-in measurement bridge. Entry findings were refined with documented brand-header/whitespace exceptions. Workspace measurement was clear across all 21 route/width combinations after the final footer/navigation repairs. Source lint returned 0 FAIL/28 contextual WARN (overlay/focus/no-shadow tokens, retained eyebrow hooks/print metadata, date/item padding and em-dash punctuation). These are recorded as advisories, not hidden passes. Installed/source skill text matched after CRLF/LF normalization.

Standalone Chromium supplied browser evidence because the in-app connector found no browser. No participant, real screen-reader, physical device/printer, live backend/provider or deployment test was performed. Gallery and raw runtime evidence are retained under [visual-evidence](visual-evidence/README.md); ordinary E2E trace artifacts remain ignored and can be regenerated. Full WCAG, production security/reliability and unknown exact FR/NFR acceptance remain unverified.

Final navigation craft PREM-011: widened the 66px label cap to 76px inside the existing rail after observing mid-word splitting. Measured Production as one 66.47px line, rebuilt production and reran all 33 tests successfully, including responsive/zoom/axe. Source a9e8fe7, integration 173ffec.

Final inspector checkpoint: the 76px cap put active SMS reports text 15px from the edge (20 combinations clear, one edge-text FAIL). The 72px cap preserves the intact Production word and restores clearance. No rule suppressed. Final build/lint, all 33 production browser tests, and all 21 Taste route/width combinations passed. Source a8c4c27 / merge 2182df5. Final gallery, PDFs and runtime lab refreshed afterward.

## Connected customer/service/material final verification · 2026-10-24–25

Final application sequence: typecheck, lint, full format check, **84/84 tests across 18 files**, production build, explicit start on loopback port 3001, then **44/44 production Chromium tests**, one worker, no skips/retries. The owner's existing development server at 3000 stayed running. No package/lock change; existing dependencies were reused. npm ls returned 0 but listed optional WASM extras; no new clean-install or vulnerability-audit pass is claimed for this follow-up.

The complete banner scenario passed: saved ABC Company + managed Banner Printing; accepted total 3,500, advance 1,000 → due 2,500; explicit five-roll use changes Branch 1 20→15, Branch 2 12 unchanged; same movement in job/Inventory; reload once; later payment 500 → customer/order/receipt due 2,000; report figures unchanged by stock operations; administrator compensation 15→20 plus separate corrected use of 2 →18; insufficient 99-roll posting blocked. Domain tests add aggregate multi-line stock, mixed/unknown/inactive units, zero/negative/fraction/nonfinite quantities, wrong branch/stale plan/tab, quota atomicity, independent transfers/adjustments, stable duplicate IDs and accepted service identity after custom job text/catalogue rename.

All nine required widths, 200% text, long unbroken English/Sinhala/Tamil, landscape, reduced motion, keyboard categories/navigation/tables, error correction and focus/dirty drawers passed. Selected A/AA axe scans cover original routes plus new directory/account and nine new screen/dialog states at desktop/mobile; no detected tagged violations. All 22 explicit contrast pairs pass. 26 actual production captures and both PDFs retained under visual-evidence/followup. Capture page/console errors and external runtime requests are empty. Taste source lint: 0 FAIL / 29 contextual WARN; signed-in measurement 18 combinations has no FAIL, raw findings retained. Header exceptions match the previously reviewed bridge; no new rule was suppressed.

Final aggregate build assets: 32 JS files, 1,202,301 bytes / 382,365 gzip; CSS 50,151 / 10,454 gzip. This is all routes combined, not initial transfer or a runtime score. Prior premium runtime lab remains historical unless a new raw lab is explicitly linked. Source scan found no production route handlers, use-server directive, Supabase client, service-role/private-key or unsafe HTML pattern in scoped src; manifest/lock and existing owner reference inputs are unchanged. This is a source check, not a security audit.

Failures retained and resolved: initial 61-test fixture ordering/version boundary; portal child form submitting parent POS; first test-only material save locator; map/test typing/escaped text and unused warning; mobile success notification above modal; long customer name 3076px at 200%; service evidence incorrectly using custom job text (new test 10/11 then 11/11); dev nine-width timeout at ninth width during concurrent build (unchanged production rerun passed); full format callback wrapping; first complete production suite 43/44 due missing explicit Binding/Finishing labels, restored in UI with original assertion unchanged, then 44/44; manual visual review found missing Customers breadcrumb/current state, reproduced and repaired with stronger navigation assertions, then final full gate reran. Intermediate interrupted runs are not counted as passes. Append-only audit conflicts during QA synchronization preserved both checkpoint and fix sections. Failed traces remain ignored locally and tests regenerate them; curated evidence is tracked.

No participant, real screen-reader, physical phone/tablet/printer, live provider/backend, field performance or production launch validation. Unknown original FR/NFR thresholds remain unverified; all 20 exact follow-up IDs are mapped separately. No blanket WCAG or production-readiness claim.

Handover audit checked all 20 exact follow-up IDs, retained all 54 FR / 35 NFR references and all 238 HCI catalogue IDs, resolved 78 local Markdown links, confirmed existing owner reference bytes and manifest/lock unchanged, and compared the follow-up transcription with the original after Markdown trailing-whitespace normalization. Both final PDFs have one Page object and a /Count 1 page tree. Main remains the exact starting root SHA. Final handover-document formatting passed separately; this adds no application behavior.

Primary handover `06da62a` / merge `d1c3e90`: `node scripts/verify-git.mjs` passed with all 50 retained branches registered/integrated, main unchanged and working tree clean. The audit-only backfill follows with full format/Git checks; application source remains the verified checkpoint. Final delivered source/merge SHA and clean result are reported at handoff.
