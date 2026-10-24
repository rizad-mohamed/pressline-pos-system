# Local Git delivery audit

Date: 2026-10-24 (Asia/Colombo). Initial workspace was empty and had no repository. Stable main remains the root baseline `e0b62dc`. Integration is develop. No remote, push, deployment, package publication, remote PR or branch protection exists or is claimed. Local author is Codex Automation <codex@local.invalid>; global Git identity was not changed.

Snapshot integration tip at evidence generation: `a7ad68c`. Documentation/audit commits necessarily follow their own snapshot; the exact delivered tip is obtained with `git rev-parse develop` and reported at handoff. A commit cannot contain its own hash. Topic references are retained, not squashed or deleted.

| Branch                                 | Key topic tip at snapshot | Local develop merge / state                                  |
| -------------------------------------- | ------------------------- | ------------------------------------------------------------ |
| `chore/init-002-nextjs-foundation`     | `1db8851`                 | bbf89eb                                                      |
| `develop`                              | `a7ad68c`                 | integration branch                                           |
| `docs/doc-001-governance`              | `e6fe30e`                 | 7a24251                                                      |
| `docs/doc-002-delivery-evidence`       | `a7ad68c`                 | current evidence branch; integration follows verified commit |
| `feat/dom-001-demo-domain`             | `5222108`                 | 8a16d16                                                      |
| `feat/fr-001-demo-access`              | `09a63ef`                 | 3496cb1                                                      |
| `feat/fr-008-demo-settings`            | `245e733`                 | 9da908d                                                      |
| `feat/fr-013-price-settings`           | `4dd4c30`                 | 9d76688                                                      |
| `feat/fr-015-order-composer`           | `5d194a9`                 | 170515b                                                      |
| `feat/fr-021-order-operations`         | `b8fc128`                 | f2c643f                                                      |
| `feat/fr-024-print-documents`          | `c179434`                 | 26cfa80                                                      |
| `feat/fr-033-branch-inventory`         | `a48906d`                 | 61d10a4                                                      |
| `feat/fr-035-stock-transfers`          | `29f4eef`                 | cec4b70                                                      |
| `feat/fr-042-financial-reports`        | `236276f`                 | a5bc9de                                                      |
| `feat/fr-047-sms-preview`              | `bce92d2`                 | 6aeae5e                                                      |
| `feat/ui-001-design-system`            | `ca8225c`                 | 3450f1f                                                      |
| `fix/dom-002-fixture-timestamps`       | `1f16dac`                 | d091653                                                      |
| `fix/dom-004-reset-conflicts`          | `f93b732`                 | 5e0cdc5                                                      |
| `fix/init-003-supported-tooling`       | `6842180`                 | 312e165                                                      |
| `fix/ui-002-accessible-recovery`       | `afbdec8`                 | 4e17416                                                      |
| `fix/ui-005-mobile-table-reflow`       | `958ad70`                 | eb90b82                                                      |
| `main`                                 | `e0b62dc`                 | stable root baseline                                         |
| `refactor/dom-003-repository-contract` | `f1c8aa9`                 | 4e38d19                                                      |
| `refactor/ui-004-pos-composition`      | `093dab5`                 | a67330b                                                      |
| `style/ui-003-source-formatting`       | `500874a`                 | 35beb00                                                      |
| `test/test-001-workflow-validation`    | `b2027e7`                 | a7ad68c                                                      |

## Representative complete commit message

```text
fix(fixtures): prevent future-dated orders from rejecting early payments

Why: implement the focused DOM-002; FR-021, FR-022 acceptance unit.
Requirement: DOM-002; FR-021, FR-022.
Behavior: prevent future-dated orders from rejecting early payments.
Validation: Typecheck and ESLint passed; 26 domain, repository and fixture tests passed including one second after Colombo midnight and legacy recovery.
Limit: local frontend demonstration; no production integrations.
```

The authoritative full bodies are retained in Git; use `git show --format=fuller <sha>`. Baseline, functionality creation, fixes, removals, refactors, tests and documentation remain distinguishable. Order checkpoint ec365a9 was preserved unmerged while the fixture defect was corrected separately, then incorporated and retested before no-ff integration. Generated next-env.d.ts removal is separately recorded in aaa16dc; the runtime-generated file remains locally available.

## Required audit commands

```powershell
git status --short
git branch --list
git log --all --graph --decorate --oneline
git log --format='%h %ad %an %s' --date=short --all
git rev-parse develop
git rev-parse main
node scripts/verify-git.mjs
```

Sandbox ownership may require `git -c safe.directory=C:/Users/HARSHANA/Desktop/POS_SYS_WS ...` without changing global configuration. The full graph is the source of truth for audit commits made after this snapshot. Feature-register/change-log map requirements, source units, evidence and representative commits. The final delivery verifies a clean working tree on develop; ignored dependency/build/test artifacts are not source changes. No unrelated user work was overwritten.

## Complete commit subjects at this snapshot

```text
a7ad68c 2026-10-24 Codex Automation chore(integration): merge test/test-001-workflow-validation
b2027e7 2026-10-24 Codex Automation test(frontend): record complete production workflow and quality evidence
dbf0e8c 2026-10-24 Codex Automation fix(tests): await navigation before capturing order references
6378228 2026-10-24 Codex Automation chore(validation): incorporate verified UI-005 mobile table correction
958ad70 2026-10-24 Codex Automation fix(tables): contain hidden labels and enable keyboard scrolling on mobile
eb90b82 2026-10-24 Codex Automation chore(integration): merge fix/ui-005-mobile-table-reflow
8a1e71f 2026-10-24 Codex Automation test(frontend): exercise integrated production workflows and recovery
093dab5 2026-10-24 Codex Automation refactor(pos): separate order presentation from form orchestration
a67330b 2026-10-24 Codex Automation chore(integration): merge refactor/ui-004-pos-composition
35beb00 2026-10-24 Codex Automation chore(integration): merge style/ui-003-source-formatting
500874a 2026-10-24 Codex Automation style(source): apply consistent formatting across frontend and audit files
312e165 2026-10-24 Codex Automation chore(integration): merge fix/init-003-supported-tooling
6842180 2026-10-24 Codex Automation fix(tooling): enforce tested Node and peer-compatible lint dependencies
aaa16dc 2026-10-24 Codex Automation remove(tooling): untrack regenerated Next environment declarations
afbdec8 2026-10-24 Codex Automation fix(ui): explain invalid quantities and restore focus after dialog closure
4e17416 2026-10-24 Codex Automation chore(integration): merge fix/ui-002-accessible-recovery
5e0cdc5 2026-10-24 Codex Automation chore(integration): merge fix/dom-004-reset-conflicts
f93b732 2026-10-24 Codex Automation fix(repository): reject stale writes after reset or storage removal
f1c8aa9 2026-10-24 Codex Automation refactor(repository): align mock adapter with typed read and command port
4e38d19 2026-10-24 Codex Automation chore(integration): merge refactor/dom-003-repository-contract
9da908d 2026-10-24 Codex Automation chore(integration): merge feat/fr-008-demo-settings
245e733 2026-10-24 Codex Automation feat(settings): manage fixed demo context and persistent browser preferences
bce92d2 2026-10-24 Codex Automation feat(sms): configure fictional recipient and derive unsent daily summaries
6aeae5e 2026-10-24 Codex Automation chore(integration): merge feat/fr-047-sms-preview
a5bc9de 2026-10-24 Codex Automation chore(integration): merge feat/fr-042-financial-reports
236276f 2026-10-24 Codex Automation feat(reports): present branch financial cohorts and calendar periods
4dd4c30 2026-10-24 Codex Automation feat(pricing): version demo rates without altering historical orders
9d76688 2026-10-24 Codex Automation chore(integration): merge feat/fr-013-price-settings
cec4b70 2026-10-24 Codex Automation chore(integration): merge feat/fr-035-stock-transfers
29f4eef 2026-10-24 Codex Automation feat(transfers): atomically move mock stock across branch ledgers
a48906d 2026-10-24 Codex Automation feat(inventory): manage branch materials and reasoned stock movements
61d10a4 2026-10-24 Codex Automation chore(integration): merge feat/fr-033-branch-inventory
26cfa80 2026-10-24 Codex Automation chore(integration): merge feat/fr-024-print-documents
c179434 2026-10-24 Codex Automation feat(printing): provide separate receipt and production ticket views
b8fc128 2026-10-24 Codex Automation test(orders): record passing payment and branch workflow gates
f2c643f 2026-10-24 Codex Automation chore(integration): merge feat/fr-021-order-operations
73c72e8 2026-10-24 Codex Automation chore(orders): incorporate verified DOM-002 fixture correction
1f16dac 2026-10-24 Codex Automation fix(fixtures): prevent future-dated orders from rejecting early payments
d091653 2026-10-24 Codex Automation chore(integration): merge fix/dom-002-fixture-timestamps
ec365a9 2026-10-24 Codex Automation feat(orders): add scoped operations pending fixture time correction
170515b 2026-10-24 Codex Automation chore(integration): merge feat/fr-015-order-composer
5d194a9 2026-10-24 Codex Automation feat(pos): compose reviewed multi-item print orders with advances
09a63ef 2026-10-24 Codex Automation feat(access): add local role selection and shared branch dashboard
3496cb1 2026-10-24 Codex Automation chore(integration): merge feat/fr-001-demo-access
5222108 2026-10-24 Codex Automation feat(domain): model shared demo data and exact transaction rules
8a16d16 2026-10-24 Codex Automation chore(integration): merge feat/dom-001-demo-domain
ca8225c 2026-10-24 Codex Automation feat(ui): add token-driven components and guarded accessible sheets
3450f1f 2026-10-24 Codex Automation chore(integration): merge feat/ui-001-design-system
1db8851 2026-10-24 Codex Automation chore(foundation): configure typed Next.js app and verified test tooling
bbf89eb 2026-10-24 Codex Automation chore(integration): merge chore/init-002-nextjs-foundation
e6fe30e 2026-10-24 Codex Automation docs(governance): define branch gates and reference limitations
7a24251 2026-10-24 Codex Automation chore(governance): integrate local audit policy and source inventory
e0b62dc 2026-10-24 Codex Automation chore(init): establish project repository baseline
```
