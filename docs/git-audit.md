# Local Git delivery audit

Date: 2026-10-24 (Asia/Colombo). Initial workspace was empty and had no repository. Stable main remains the root baseline `e0b62dc`. Integration is develop. No remote, push, deployment, package publication, remote PR or branch protection exists or is claimed. Local author is Codex Automation <codex@local.invalid>; global Git identity was not changed.

Snapshot integration tip at evidence generation: `b0e97df`. Documentation/audit commits necessarily follow their own snapshot; the exact delivered tip is obtained with `git rev-parse develop` and reported at handoff. A commit cannot contain its own hash. Topic references are retained, not squashed or deleted.

| Branch                                 | Key topic tip at snapshot | Local develop merge / state |
| -------------------------------------- | ------------------------- | --------------------------- |
| `chore/init-002-nextjs-foundation`     | `1db8851`                 | bbf89eb                     |
| `develop`                              | `b0e97df`                 | integration branch          |
| `docs/doc-001-governance`              | `e6fe30e`                 | 7a24251                     |
| `docs/doc-002-delivery-evidence`       | `b0e97df`                 | b0e97df                     |
| `feat/dom-001-demo-domain`             | `5222108`                 | 8a16d16                     |
| `feat/fr-001-demo-access`              | `09a63ef`                 | 3496cb1                     |
| `feat/fr-008-demo-settings`            | `245e733`                 | 9da908d                     |
| `feat/fr-013-price-settings`           | `4dd4c30`                 | 9d76688                     |
| `feat/fr-015-order-composer`           | `5d194a9`                 | 170515b                     |
| `feat/fr-021-order-operations`         | `b8fc128`                 | f2c643f                     |
| `feat/fr-024-print-documents`          | `c179434`                 | 26cfa80                     |
| `feat/fr-033-branch-inventory`         | `a48906d`                 | 61d10a4                     |
| `feat/fr-035-stock-transfers`          | `29f4eef`                 | cec4b70                     |
| `feat/fr-042-financial-reports`        | `236276f`                 | a5bc9de                     |
| `feat/fr-047-sms-preview`              | `bce92d2`                 | 6aeae5e                     |
| `feat/ui-001-design-system`            | `ca8225c`                 | 3450f1f                     |
| `fix/dom-002-fixture-timestamps`       | `1f16dac`                 | d091653                     |
| `fix/dom-004-reset-conflicts`          | `f93b732`                 | 5e0cdc5                     |
| `fix/init-003-supported-tooling`       | `6842180`                 | 312e165                     |
| `fix/ui-002-accessible-recovery`       | `afbdec8`                 | 4e17416                     |
| `fix/ui-005-mobile-table-reflow`       | `958ad70`                 | eb90b82                     |
| `main`                                 | `e0b62dc`                 | stable root baseline        |
| `refactor/dom-003-repository-contract` | `f1c8aa9`                 | 4e38d19                     |
| `refactor/ui-004-pos-composition`      | `093dab5`                 | a67330b                     |
| `style/ui-003-source-formatting`       | `500874a`                 | 35beb00                     |
| `test/test-001-workflow-validation`    | `b2027e7`                 | a7ad68c                     |

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
b0e97df 2026-10-24 Codex Automation chore(integration): merge docs/doc-002-delivery-evidence
b5a55b0 2026-10-24 Codex Automation docs(delivery): document verified frontend coverage and future backend contracts
b2027e7 2026-10-24 Codex Automation test(frontend): record complete production workflow and quality evidence
a7ad68c 2026-10-24 Codex Automation chore(integration): merge test/test-001-workflow-validation
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

## Source commits and changed files by retained topic

First verified integration merges are used to isolate each topic. Additional dependency/audit merges remain in the complete graph.

### chore/init-002-nextjs-foundation

First verified integration: `bbf89eb`.

`1db8851` ? chore(foundation): configure typed Next.js app and verified test tooling

```text
A	.env.example
A	.gitattributes
A	.prettierignore
A	.prettierrc.json
M	AGENTS.md
M	docs/change-log.md
M	docs/decisions.md
M	docs/feature-register.md
A	e2e/foundation.spec.ts
A	eslint.config.mjs
A	next-env.d.ts
A	next.config.ts
A	package-lock.json
A	package.json
A	playwright.config.ts
A	postcss.config.mjs
A	scripts/verify-git.mjs
A	src/app/globals.css
A	src/app/layout.tsx
A	src/app/page.tsx
A	src/tests/foundation.test.ts
A	src/tests/setup.ts
A	tsconfig.json
A	vitest.config.ts
```

### docs/doc-001-governance

First verified integration: `7a24251`.

`e6fe30e` ? docs(governance): define branch gates and reference limitations

```text
A	AGENTS.md
A	FRONTEND_STATUS.md
A	docs/change-log.md
A	docs/decisions.md
A	docs/feature-register.md
A	docs/git-workflow.md
```

### docs/doc-002-delivery-evidence

First verified integration: `b0e97df`.

`b5a55b0` ? docs(delivery): document verified frontend coverage and future backend contracts

```text
M	AGENTS.md
M	README.md
A	docs/backend-integration-contracts.md
M	docs/change-log.md
M	docs/feature-register.md
A	docs/frontend-architecture.md
A	docs/git-audit.md
M	docs/git-workflow.md
A	docs/hci-acceptance-matrix.md
A	docs/requirements-coverage.md
```

### feat/dom-001-demo-domain

First verified integration: `8a16d16`.

`5222108` ? feat(domain): model shared demo data and exact transaction rules

```text
M	docs/change-log.md
M	docs/feature-register.md
A	src/data/contracts.ts
A	src/data/repository.test.ts
A	src/data/repository.ts
A	src/data/seed.ts
A	src/data/validation.ts
A	src/domain/dates.ts
A	src/domain/domain.test.ts
A	src/domain/model.ts
A	src/domain/money.ts
A	src/domain/orders.ts
A	src/domain/pricing.ts
A	src/domain/reports.ts
```

### feat/fr-001-demo-access

First verified integration: `3496cb1`.

`09a63ef` ? feat(access): add local role selection and shared branch dashboard

```text
M	docs/change-log.md
M	docs/feature-register.md
M	e2e/foundation.spec.ts
M	playwright.config.ts
A	src/app/(workspace)/dashboard/page.tsx
A	src/app/(workspace)/layout.tsx
A	src/app/(workspace)/loading.tsx
A	src/app/error.tsx
M	src/app/layout.tsx
A	src/app/login/page.tsx
A	src/app/not-found.tsx
M	src/app/page.tsx
A	src/components/layout/shell.tsx
A	src/components/shared/domain-display.tsx
A	src/data/provider.tsx
A	src/features/auth/access.test.tsx
A	src/features/auth/access.tsx
A	src/features/auth/login.tsx
A	src/features/dashboard/dashboard.tsx
```

### feat/fr-008-demo-settings

First verified integration: `9da908d`.

`245e733` ? feat(settings): manage fixed demo context and persistent browser preferences

```text
M	FRONTEND_STATUS.md
M	docs/change-log.md
M	docs/feature-register.md
A	e2e/settings.spec.ts
A	src/app/(workspace)/profile/page.tsx
A	src/app/(workspace)/settings/page.tsx
M	src/app/globals.css
M	src/data/provider.tsx
M	src/domain/commands.ts
M	src/domain/model.ts
A	src/domain/settings.test.ts
A	src/domain/settings.ts
A	src/features/settings/profile.tsx
A	src/features/settings/settings-drawer.tsx
A	src/features/settings/settings.tsx
```

### feat/fr-013-price-settings

First verified integration: `9d76688`.

`4dd4c30` ? feat(pricing): version demo rates without altering historical orders

```text
M	docs/change-log.md
M	docs/feature-register.md
A	e2e/pricing.spec.ts
A	src/app/(workspace)/pricing/page.tsx
M	src/domain/commands.ts
M	src/domain/model.ts
A	src/domain/price-settings.test.ts
A	src/domain/price-settings.ts
A	src/features/pricing/pricing.tsx
```

### feat/fr-015-order-composer

First verified integration: `170515b`.

`5d194a9` ? feat(pos): compose reviewed multi-item print orders with advances

```text
M	FRONTEND_STATUS.md
M	docs/change-log.md
M	docs/feature-register.md
A	e2e/pos.spec.ts
A	src/app/(workspace)/pos/page.tsx
A	src/features/pos/composer.tsx
A	src/features/pos/line-editor.tsx
A	src/features/pos/schema.test.ts
A	src/features/pos/schema.ts
```

### feat/fr-021-order-operations

First verified integration: `f2c643f`.

`ec365a9` ? feat(orders): add scoped operations pending fixture time correction

```text
M	docs/change-log.md
M	docs/feature-register.md
A	e2e/orders.spec.ts
A	src/app/(workspace)/jobs/page.tsx
A	src/app/(workspace)/orders/[id]/page.tsx
A	src/app/(workspace)/orders/page.tsx
M	src/components/ui/sheet.tsx
A	src/features/orders/detail.tsx
A	src/features/orders/edit-drawer.tsx
A	src/features/orders/list.tsx
A	src/features/payments/payment-drawer.tsx
```

`b8fc128` ? test(orders): record passing payment and branch workflow gates

```text
M	docs/change-log.md
M	docs/feature-register.md
```

### feat/fr-024-print-documents

First verified integration: `26cfa80`.

`c179434` ? feat(printing): provide separate receipt and production ticket views

```text
M	docs/change-log.md
M	docs/feature-register.md
A	e2e/printing.spec.ts
A	src/app/print/[kind]/[id]/page.tsx
A	src/features/printing/document.tsx
```

### feat/fr-033-branch-inventory

First verified integration: `61d10a4`.

`a48906d` ? feat(inventory): manage branch materials and reasoned stock movements

```text
M	docs/change-log.md
M	docs/feature-register.md
A	e2e/inventory.spec.ts
A	src/app/(workspace)/inventory/page.tsx
M	src/data/repository.ts
A	src/domain/commands.ts
A	src/domain/inventory.test.ts
A	src/domain/inventory.ts
M	src/domain/model.ts
A	src/features/inventory/adjust-drawer.tsx
A	src/features/inventory/inventory.tsx
A	src/features/inventory/item-drawer.tsx
```

### feat/fr-035-stock-transfers

First verified integration: `cec4b70`.

`29f4eef` ? feat(transfers): atomically move mock stock across branch ledgers

```text
M	FRONTEND_STATUS.md
M	docs/change-log.md
M	docs/feature-register.md
A	e2e/transfers.spec.ts
A	src/app/(workspace)/transfers/page.tsx
M	src/domain/commands.ts
M	src/domain/model.ts
A	src/domain/transfers.test.ts
A	src/domain/transfers.ts
A	src/features/inventory/transfer-drawer.tsx
A	src/features/inventory/transfers.tsx
```

### feat/fr-042-financial-reports

First verified integration: `a5bc9de`.

`236276f` ? feat(reports): present branch financial cohorts and calendar periods

```text
M	docs/change-log.md
M	docs/feature-register.md
A	e2e/reports.spec.ts
A	src/app/(workspace)/reports/page.tsx
M	src/app/globals.css
A	src/domain/reports.test.ts
M	src/domain/reports.ts
A	src/features/reports/reports.tsx
```

### feat/fr-047-sms-preview

First verified integration: `6aeae5e`.

`bce92d2` ? feat(sms): configure fictional recipient and derive unsent daily summaries

```text
M	docs/change-log.md
M	docs/feature-register.md
A	e2e/sms.spec.ts
A	src/app/(workspace)/sms/page.tsx
M	src/domain/commands.ts
M	src/domain/model.ts
A	src/domain/sms.test.ts
A	src/domain/sms.ts
A	src/features/sms/sms.tsx
```

### feat/ui-001-design-system

First verified integration: `3450f1f`.

`ca8225c` ? feat(ui): add token-driven components and guarded accessible sheets

```text
A	components.json
M	docs/change-log.md
M	docs/feature-register.md
M	src/app/globals.css
A	src/components/shared/presentation.tsx
A	src/components/ui/button.tsx
A	src/components/ui/confirm-dialog.tsx
A	src/components/ui/sheet.test.tsx
A	src/components/ui/sheet.tsx
A	src/lib/utils.ts
A	src/styles/brand.css
```

### fix/dom-002-fixture-timestamps

First verified integration: `d091653`.

`1f16dac` ? fix(fixtures): prevent future-dated orders from rejecting early payments

```text
M	docs/change-log.md
M	docs/decisions.md
M	docs/feature-register.md
A	src/data/seed.test.ts
M	src/data/seed.ts
M	src/domain/orders.ts
```

### fix/dom-004-reset-conflicts

First verified integration: `5e0cdc5`.

`f93b732` ? fix(repository): reject stale writes after reset or storage removal

```text
M	docs/change-log.md
M	docs/decisions.md
M	docs/feature-register.md
M	src/data/repository.test.ts
M	src/data/repository.ts
```

### fix/init-003-supported-tooling

First verified integration: `312e165`.

`aaa16dc` ? remove(tooling): untrack regenerated Next environment declarations

```text
M	.gitignore
D	next-env.d.ts
```

`6842180` ? fix(tooling): enforce tested Node and peer-compatible lint dependencies

```text
A	.node-version
M	docs/change-log.md
M	docs/decisions.md
M	docs/feature-register.md
M	package-lock.json
M	package.json
```

### fix/ui-002-accessible-recovery

First verified integration: `4e17416`.

`afbdec8` ? fix(ui): explain invalid quantities and restore focus after dialog closure

```text
M	docs/change-log.md
M	docs/decisions.md
M	docs/feature-register.md
A	e2e/accessibility.spec.ts
A	src/components/ui/confirm-dialog.test.tsx
M	src/components/ui/confirm-dialog.tsx
M	src/components/ui/sheet.tsx
M	src/features/pos/composer.tsx
```

### fix/ui-005-mobile-table-reflow

First verified integration: `eb90b82`.

`958ad70` ? fix(tables): contain hidden labels and enable keyboard scrolling on mobile

```text
M	docs/change-log.md
M	docs/decisions.md
M	docs/feature-register.md
A	e2e/table-reflow.spec.ts
M	src/app/globals.css
M	src/features/dashboard/dashboard.tsx
M	src/features/inventory/inventory.tsx
M	src/features/pricing/pricing.tsx
M	src/features/printing/document.tsx
M	src/features/settings/settings.tsx
M	src/features/sms/sms.tsx
```

### refactor/dom-003-repository-contract

First verified integration: `4e38d19`.

`f1c8aa9` ? refactor(repository): align mock adapter with typed read and command port

```text
M	docs/change-log.md
M	docs/feature-register.md
M	src/data/contracts.ts
M	src/data/repository.test.ts
M	src/data/repository.ts
```

### refactor/ui-004-pos-composition

First verified integration: `a67330b`.

`093dab5` ? refactor(pos): separate order presentation from form orchestration

```text
M	docs/change-log.md
M	docs/feature-register.md
M	src/features/pos/composer.tsx
A	src/features/pos/order-confirmation.tsx
A	src/features/pos/order-review.tsx
A	src/features/pos/order-summary.tsx
```

### style/ui-003-source-formatting

First verified integration: `35beb00`.

`500874a` ? style(source): apply consistent formatting across frontend and audit files

```text
M	components.json
M	docs/change-log.md
M	docs/feature-register.md
M	e2e/accessibility.spec.ts
M	e2e/foundation.spec.ts
M	e2e/inventory.spec.ts
M	e2e/orders.spec.ts
M	e2e/pos.spec.ts
M	e2e/pricing.spec.ts
M	e2e/printing.spec.ts
M	e2e/reports.spec.ts
M	e2e/settings.spec.ts
M	e2e/sms.spec.ts
M	e2e/transfers.spec.ts
M	eslint.config.mjs
M	package.json
M	playwright.config.ts
M	scripts/verify-git.mjs
M	src/app/(workspace)/dashboard/page.tsx
M	src/app/(workspace)/inventory/page.tsx
M	src/app/(workspace)/jobs/page.tsx
M	src/app/(workspace)/layout.tsx
M	src/app/(workspace)/loading.tsx
M	src/app/(workspace)/orders/[id]/page.tsx
M	src/app/(workspace)/orders/page.tsx
M	src/app/(workspace)/pos/page.tsx
M	src/app/(workspace)/pricing/page.tsx
M	src/app/(workspace)/profile/page.tsx
M	src/app/(workspace)/reports/page.tsx
M	src/app/(workspace)/settings/page.tsx
M	src/app/(workspace)/sms/page.tsx
M	src/app/(workspace)/transfers/page.tsx
M	src/app/error.tsx
M	src/app/globals.css
M	src/app/layout.tsx
M	src/app/login/page.tsx
M	src/app/not-found.tsx
M	src/app/page.tsx
M	src/app/print/[kind]/[id]/page.tsx
M	src/components/layout/shell.tsx
M	src/components/shared/domain-display.tsx
M	src/components/shared/presentation.tsx
M	src/components/ui/button.tsx
M	src/components/ui/confirm-dialog.test.tsx
M	src/components/ui/confirm-dialog.tsx
M	src/components/ui/sheet.test.tsx
M	src/components/ui/sheet.tsx
M	src/data/contracts.ts
M	src/data/provider.tsx
M	src/data/repository.test.ts
M	src/data/repository.ts
M	src/data/seed.test.ts
M	src/data/seed.ts
M	src/data/validation.ts
M	src/domain/commands.ts
M	src/domain/dates.ts
M	src/domain/domain.test.ts
M	src/domain/inventory.test.ts
M	src/domain/inventory.ts
M	src/domain/model.ts
M	src/domain/money.ts
M	src/domain/orders.ts
M	src/domain/price-settings.test.ts
M	src/domain/price-settings.ts
M	src/domain/pricing.ts
M	src/domain/reports.test.ts
M	src/domain/reports.ts
M	src/domain/settings.test.ts
M	src/domain/settings.ts
M	src/domain/sms.test.ts
M	src/domain/sms.ts
M	src/domain/transfers.test.ts
M	src/domain/transfers.ts
M	src/features/auth/access.test.tsx
M	src/features/auth/access.tsx
M	src/features/auth/login.tsx
M	src/features/dashboard/dashboard.tsx
M	src/features/inventory/adjust-drawer.tsx
M	src/features/inventory/inventory.tsx
M	src/features/inventory/item-drawer.tsx
M	src/features/inventory/transfer-drawer.tsx
M	src/features/inventory/transfers.tsx
M	src/features/orders/detail.tsx
M	src/features/orders/edit-drawer.tsx
M	src/features/orders/list.tsx
M	src/features/payments/payment-drawer.tsx
M	src/features/pos/composer.tsx
M	src/features/pos/line-editor.tsx
M	src/features/pos/schema.test.ts
M	src/features/pos/schema.ts
M	src/features/pricing/pricing.tsx
M	src/features/printing/document.tsx
M	src/features/reports/reports.tsx
M	src/features/settings/profile.tsx
M	src/features/settings/settings-drawer.tsx
M	src/features/settings/settings.tsx
M	src/features/sms/sms.tsx
M	src/lib/utils.ts
M	src/styles/brand.css
M	src/tests/foundation.test.ts
M	tsconfig.json
```

### test/test-001-workflow-validation

First verified integration: `a7ad68c`.

`8a1e71f` ? test(frontend): exercise integrated production workflows and recovery

```text
M	docs/change-log.md
M	docs/feature-register.md
A	docs/validation-log.md
M	e2e/accessibility.spec.ts
A	e2e/integrated.spec.ts
M	e2e/printing.spec.ts
A	e2e/resilience.spec.ts
M	playwright.config.ts
A	scripts/bundle-report.mjs
```

`dbf0e8c` ? fix(tests): await navigation before capturing order references

```text
M	e2e/integrated.spec.ts
```

`b2027e7` ? test(frontend): record complete production workflow and quality evidence

```text
M	FRONTEND_STATUS.md
M	docs/change-log.md
M	docs/feature-register.md
M	docs/validation-log.md
```
