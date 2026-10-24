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
