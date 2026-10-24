# Frontend verification evidence

Date: 2026-10-24, Asia/Colombo. Only executed checks are reported as passes. This is a local frontend demonstration; no production launch gates are certified.

| Check                   | Current result                                               | Evidence / limit                                                                                                                      |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`     | passed on all integrated implementation slices               | Strict TypeScript; final clean-install rerun pending                                                                                  |
| `npm run lint`          | passed on integrated implementation slices                   | Final rerun pending after clean install; an overlapping install interrupted one check, which is not counted as a pass                 |
| `npm run test`          | 58 tests passed across 14 files                              | Domain, schema, repository, role guards, drawer and confirmation keyboard/focus tests                                                 |
| `npm run format:check`  | passed after formatting                                      | Final audit/document edits will be formatted and rechecked                                                                            |
| Module Playwright tests | all 10 module scenarios passed individually                  | Account entry, POS, order/payment/state/branch isolation, printing, inventory, transfers, prices, reports, SMS and settings/reset     |
| Responsive Playwright   | six widths and 200% text resize passed                       | 360, 390, 768, 1024, 1280, 1440 CSS pixels; dashboard/POS/reports; no whole-page overflow detected                                    |
| Automated accessibility | login and all 11 workspace routes passed selected A/AA rules | Distributed axe source used after generated-source injection failed; no browser page exceptions detected; not full WCAG certification |
| `npm run build`         | foundation build passed; full-app build pending              | Final production build follows the clean install                                                                                      |
| Combined production E2E | pending                                                      | Includes repeated activation, shared report/SMS data, quota recovery, corrupted schema and mobile keyboard/dirty drawer paths         |
| `npm ci`                | running                                                      | Verify lockfile reproduction; Node 24.14.1 / npm 11.11.0                                                                              |
| `npm ls eslint`         | passed after correction                                      | Exact ESLint 9.39.5 satisfies Next plugin peers; upstream EOL is documented                                                           |
| `npm audit --omit=dev`  | zero known vulnerabilities at execution                      | Does not establish absence of vulnerabilities or replace review                                                                       |

## Defects found and corrected

- DOM-002: early-day payment was rejected because a current-day fixture was in the future. Preserved unverified checkpoint ec365a9; corrected separately in 1f16dac and retested before integration.
- DOM-004: three stale/reset/storage-removal regressions failed before correction; all seven repository tests and browser reset passed afterward (f93b732).
- UI-002: zero quantity disabled review without a field correction; on-blur validation and add/remove/undo browser regression now pass. Confirmation and drawer closure restore focus to a connected opener or stable main landmark.
- Tooling: resolver 6 optional peers conflicted; resolver 5.2.2 works with RHF 7/Zod 4. ESLint 10 ran rules but failed peer-tree validation; pinned compatible 9.39.5. Default axe generated-source injection threw a syntax error on a hydrated route; the supported explicit distributed-source option completed scans.

## Manual and external limits

Visual screenshot inspection is pending the final suite's retained artifacts. Browser testing uses standalone Playwright because the Browser connector returned no available browser. No real screen reader, participant research, physical phone/tablet, physical printer, low-bandwidth device test, cloud service or production security/reliability review has been performed. No accessibility, performance or production-readiness percentage is claimed.
