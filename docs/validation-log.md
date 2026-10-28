# Frontend verification evidence

2026-10-29 OPT-012: final develop 95d4d585 run 40780290343 exposes one Chromium More contrast scan during opacity animation; PR held. Actual frame evidence shows canonical rgb(97,104,92) unchanged while opacity rises from 0.836 to 1. Await actual animation completion/opacity 1; all three production dashboard/More/filter axe cases pass in 54.5s, retries=0. No rules, thresholds, motion or app source changed. Fresh exact integration/PR/main verification remains required.

## Optimization handover - 2026-10-29

Exact application candidate cb10f459bffd0203ffad9ea8c0445cbd729ca1eb: [hosted run 40776712433](https://github.com/rizad-mohamed/pressline-pos-system/actions/runs/40776712433) **all three jobs succeeded**. Actual logs: Chromium 92 passed (4.6m), Firefox 91 passed/one unsupported CDP skip (7.9m), WebKit 91 passed/one unsupported CDP skip (5.7m), retries=0. Aggregate 274 browser passes/two capability skips. Every job passed fresh locked install/advisory, strict typecheck/lint/format, 91 unit/component tests/20 files, 22 contrast pairs and production build. Shared print assertions run everywhere; Chromium retains PDF export. Local full strict gates also pass. Source/data/domain/brand/font preservation and provenance are in the [ten-part report](frontend-optimization.md).

Meaningful focused local evidence: OPT-007 15 three-engine quantity/mobile-review passes (3.7m); OPT-008 30 three-engine cards/history/readability/selected-axe passes (5.8m); OPT-009 nine focus/keyboard/current-order passes (2.1m). OPT-010 24 WebKit role-navigation/reflow passes plus one axe injection parsing failure. OPT-011 all three drawer checks pass; representative run 14 pass/one Chromium locator parsing failure. Original stale-error/readability assertions fail against old production. Parsing causes remain unconfirmed; failed local runs are not relabeled PASS, while corresponding full hosted cases pass.

Final production touch/pointer smoke passes Chromium 156.0.8078.4/WebKit 27.2 emulated touch and Firefox 157 pointer, with no page errors. Sixteen eight-route phone/desktop captures have zero page errors/failed/external requests and zero changed pixels against the pre-enlargement/prefetch normal-size card checkpoint. Clean 320px/200% linked-history captures retain accepted LKR 3,500 total/1,000 paid/2,500 balance and readable New/Partial states; a repeated existing fictional capture workflow passes (8.4s), separate from the 274 hosted count. Design probes: 29 contextual source WARNs, three reviewed desktop spacing WARNs across 24 views, no blocking finding.

Final Lighthouse 13.6 official-profile samples: mobile performance 83/82/88/96 (login/POS/dashboard/reports), desktop 100 for all four; Accessibility/Best Practices/SEO 100 throughout. **Mobile 90 aim is unmet on three routes.** Raw gzip JSON validates actual form factor/final route/runtime. Lab runtime, request counts, asset sizes and host/cache limitations are recorded separately; no field-INP, physical-device, availability or causal runtime-speedup claim.

Latest advisory JSON reports zero known vulnerabilities. Verified secret scanner consumes actual history patches (167 reachable commits including merges; 3,261,611 bytes), source (561,072) and browser assets (1,313,855), zero findings. An initial history invocation hit ownership protection and scanned zero commits despite exit 0; rejected, then rerun with repository-trusted Git piped to the scanner. Full skill audit remains incomplete for unavailable OS isolation/Windows artifact validation. Source/secret/advisory scans are not a penetration test.

The first full local matrix ended 247 pass/27 fail/two capability skips (59.4m); first hosted run 40767646770 failed. Original failed reports, later parsing failures, corrected behavioral regressions, formatter repair and capability boundaries remain in [the evidence index](verification/optimization/README.md). Final PR/main exact-SHA checks, synchronization and clean-tree verification are recorded after this document's own source integration, in the PR/final delivery. No backend or deployment operation.

## Historical verification snapshots

2026-10-29 OPT-005 first full local matrix (in progress, not PASS): CI=true, PRESSLINE_TEST_PORT=3001, PRESSLINE_TEST_BROWSER=all, one worker, retries=0; 276 cases discovered. Chromium failures at the integrated Record payment locator and cashier 390px heading originate in Playwright evaluation/injection parsing; an axe case fails JSON parsing. The installed coreBundle SHA256 829521b67ed7be90c7d6d6098ff39f2241562d47e4ad7ccab13710924a56001d exactly matches the independently fetched locked tarball (archive integrity matched lock). Firefox's first quantity-correction case times out waiting for Remove item 2 after Add; investigation remains open. Trace files and final matrix report are retained locally. Independent hosted verification is required before delivery; no full-suite pass or root cause is inferred.

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

## Clean-copy CI continuation · 2026-10-25

Source continuation from develop 52e41f9; CI source `817327fa652bb30c49135a1b3f44fe1a6d1cd19a` / no-ff merge `41a97ef3b10f32cddf469983b9b94cead7320dd5`. An independently created temporary source copy began without node_modules, .next or next-env.d.ts. `npm ci` passed: 544 installed, 545 audited, zero known vulnerabilities. Node 24.14.1/npm 11.11.0 matched the workflow. The original workspace install and owner dev server were preserved.

With CI=true, NEXT_TELEMETRY_DISABLED=1, PRESSLINE_TEST_PORT=3001 and TZ=Asia/Colombo: advisory audit, generated Next route types plus strict typecheck, lint, full formatting, 84/84 tests across 18 files, all 22 contrast pairs and locked Chromium installation passed. Playwright built/started its own production server, refused existing-server reuse, and all 44/44 browser tests passed in a single run with no retries/skips. Combined build/browser command duration: 347.63s. Final YAML parsed; immutable action references and explicit permissions/credential/cache policy checked from source. No actionlint or hosted CI pass is claimed.

The local Python log harness stopped after a successful typecheck because Windows cp1252 could not print Next's checkmark. UTF-8 output fixed the harness, then remaining checks resumed; no app assertion failed or changed. The initial sandboxed npm advisory request could not reach the registry; the approved read-only network retry and fresh-copy advisory gate both passed with zero known vulnerabilities. Both security-skill validators remain blocked by Windows no-follow/nonblocking API protection, as recorded in the [security review](security-review.md); functional CI gates do not certify that separate audit.

Fresh production aggregate asset report:

```text
{
  "scope": "All generated route assets combined; not an initial-page transfer or runtime performance score",
  "javascript": {
    "files": 32,
    "bytes": 1202301,
    "gzipBytes": 382365
  },
  "css": {
    "files": 1,
    "bytes": 50151,
    "gzipBytes": 10454
  },
  "largest": [
    {
      "path": ".next\\static\\chunks\\3wbm-994r45kr.js",
      "bytes": 229820,
      "gzipBytes": 71969
    },
    {
      "path": ".next\\static\\chunks\\3i7bb4yv5vlj-.js",
      "bytes": 164509,
      "gzipBytes": 45447
    },
    {
      "path": ".next\\static\\chunks\\2n28koan02vny.js",
      "bytes": 157797,
      "gzipBytes": 46224
    },
    {
      "path": ".next\\static\\chunks\\0cz1d0mv5g_q7.js",
      "bytes": 112594,
      "gzipBytes": 39627
    },
    {
      "path": ".next\\static\\chunks\\0d9g0jbjxx7td.css",
      "bytes": 50151,
      "gzipBytes": 10454
    }
  ]
}
```

The continuation has no application-source or runtime-dependency changes. Existing premium layout, migration, snapshots and confirmed-use behavior remain. Hosted CI/branch protection, full security audit, production authentication, real devices/AT/printer and field performance remain unverified. No backend, push or deployment occurred.

Workspace tooling correction: the final local format gate reproduced a one-byte corruption in installed Prettier (offset 87446, space replaced by backtick). node --check failed; restoring the exact fresh-lock-install module passed syntax and the full workspace format gate. The damaged copy is retained in ignored local evidence. Cause remains unconfirmed; no source/lock/version changed. The full fresh-copy CI gates had passed independently.

Final installed-tool integrity check after repair: all 31,502 expected dependency files from the fresh locked installation matched the workspace bytes; no expected file was missing or different. The initial broad comparison checked 31,553 files and reported 51 differing generated Vitest transform/result caches. Installed Vitest source identifies .vitest-cache as the module-cache directory and results.json under its configured Vite cache directory (cli-api.De07GUeT.js:5574,5968); these project-specific generated files were classified separately, not copied as package code. The original result is retained. Machine-generated .bin shims and .package-lock metadata were also excluded. Pre-existing additional optional workspace packages were not pruned while the owner's development server was running; this comparison does not certify the absence or behavior of additional files. The original development server returned HTTP 200 at /login; the CI-owned production port had no listener after Playwright teardown. Git's unmerged index was empty. The only repaired expected-file discrepancy was the separately documented Prettier byte.

## Mobile refinement final verification · 2026-10-28

Recovery and actual failed/interrupted checkpoints are preserved in [mobile-refinement.md](mobile-refinement.md). Final application source is integrated through the landscape gutter correction; the regression topic adds the complete matrix and reusable engine check. No retry, skip, assertion weakening, changed worker configuration or hidden accessibility rule was used.

| Executed check                                                  | Actual result / limit                                                                                                                                                                         |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Type generation + strict TypeScript, ESLint, full Prettier gate | Passed on final application/regression source; handover documents receive a separate final format/link check                                                                                  |
| Full unit/component suite                                       | 91/91 across 20 files passed; final isolated run 57.11s                                                                                                                                       |
| CI=true npm run test:e2e                                        | Fresh production build/start, all 78 Chromium checks passed, one worker/retries 0; local CI mode, not hosted CI                                                                               |
| Responsive/functional                                           | All 12 admin and six cashier routes at 320,360,390,430,600,768,820,1024,1280,1440,1920; existing connected workflows reran                                                                    |
| Reflow and interaction                                          | All-route 200% text/short landscape/reduced motion; four enlarged drawers at phone/landscape; Unicode/long text, draft/rotation, focus/dirty guards, root/deep links/history, print isolation |
| Safe-area/keyboard                                              | Actual Chromium inset overrides (24px top,34px bottom,44px sides); visualViewport keyboard/pinch simulation; not physical-device keyboard evidence                                            |
| Selected automated accessibility                                | Existing route/dialog scans plus mobile tabs/More/expanded filters; no detected tagged A/AA violations; no full conformity claim                                                              |
| Contrast / advisories                                           | All 22 explicit token pairs pass; npm audit reports zero known advisories at execution; no dependency versions changed                                                                        |
| Other engines                                                   | Focused Chromium/Firefox/WebKit tab/cart/draft/More/customer-editor checks passed; see engine-smoke.json for versions and input modes                                                         |
| Visual review                                                   | 60 final route/width captures, 42 original curated PNGs plus a later landscape inset image, two PDFs; no page/console errors or external runtime requests                                     |
| Desktop preservation                                            | 33/36 exact images; remaining three differ by 12 pixels each, confined to unchanged search icons; no measured layout change                                                                   |
| Print                                                           | Selected seed receipt two A4 pages, job one; matching baseline receipt also two pages and print screenshot pixel-identical. Source byte-identical                                             |
| Taste                                                           | 36 route/width measurements: 0 FAIL/4 desktop whitespace WARN; source: 0 FAIL/29 contextual WARN. Existing signed-in title/header exceptions retained, no new suppression                     |

Aggregate final assets: 34 JS files, 1,250,747 bytes / 397,703 gzip; CSS 60,120 / 12,262 gzip. Baseline JS 1,202,301 / 382,365 gzip; CSS 50,151 / 10,454 gzip. Font remains 164,700 bytes separately. Totals combine every route and are not initial-page transfer.

Six account-primed 390×844 local navigations per phase: baseline LCP 840–1132 ms, final 1200–1756 ms; observed cart-open timing baseline 271–487 ms / final 382–447 ms. CLS values and individual samples are in the raw JSON. Chromium 4× CPU,40ms latency,1,250,000 bytes/s, HTTP cache disabled; font/core/browser/server caches may be warm. Navigation timing includes heading/font readiness and screenshot/automation overhead; cart timing is not INP. Six samples do not establish a performance improvement, cold startup, field CWV or uptime. New navigation/interactions have a measurable asset cost.

Full security audit and real-device/AT/participant/printer/provider/deployment gates remain outside this executed frontend evidence. Existing bounded security findings/limitations remain unchanged. Original unknown exact FR/NFR acceptance gaps are not certified by this mobile work.

The first final timings exceeded the earlier baseline, so a fresh matched baseline/final pair was executed before attributing a change: baseline LCP 840–2604 ms / final 792–1988 ms, with zero observed CLS and no external requests in all four datasets. This substantial variability prevents a stable source-performance attribution or improvement claim from six samples; every original and paired sample is retained. Aggregate JavaScript gzip growth is a directly measured cost, approximately 4%.
