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

## Premium enhancement audit · 2026-10-24

Frontend baseline `c73980cc0090e31df800d46f0bff4a66aa18a3b5`. Pre-handover integration snapshot `2182df57573ce15bd93ff4cfef5afed7c2cfdfc2`. Main remains `e0b62dcb03330778fcdc8b6b1a4e5cc421beb604`. Working on dedicated `docs/prem-007-redesign-handover`; its own source/merge hash is recorded by the subsequent audit commit and final handoff. No remote configured, push, main merge or deployment.

The current repository has 37 local refs, including the open handover topic; original baseline had 26 refs/24 topics. All pre-handover topics are retained and ancestors of develop. Use `node scripts/verify-git.mjs` after final integration for the exact count and clean-tree outcome.

| ID       | Retained topic                           | Source           | Integration      |
| -------- | ---------------------------------------- | ---------------- | ---------------- |
| PREM-001 | `docs/prem-001-redesign-audit`           | eb20d7e          | f57771a          |
| PREM-002 | `chore/prem-002-design-tooling`          | b559192          | 8d7920a          |
| PREM-003 | `feat/prem-003-premium-shell`            | cf858b8          | a00dd86          |
| PREM-004 | `feat/prem-004-service-workspace`        | a4bbb44          | aefd582          |
| PREM-005 | `style/prem-005-operational-screens`     | f80e521          | e802124          |
| PREM-008 | `fix/prem-008-long-content-reflow`       | 3603fbc          | c925c05          |
| PREM-006 | `test/prem-006-visual-regression`        | a7fbe66          | 7ce0aa5          |
| PREM-009 | `fix/prem-009-summary-visibility`        | 8808589, 53bb11c | 232c67d, f228a49 |
| PREM-010 | `test/prem-010-keyboard-synchronization` | cdca073          | 5bbdef5          |

### Representative complete commit messages

```text
b559192 Codex Automation <codex@local.invalid>
chore(ui): install reviewed design skills and shadcn primitives

Why: implement the focused PREM-002; UI-001 acceptance unit.
Requirement: PREM-002; UI-001.
Behavior: install reviewed design skills and shadcn primitives.
Validation: Installed both required skills; actively ran Taste app draw seed 20261024 and shadcn info/docs/dry-run/add; declined init overwrite; reviewed generated source and licenses; typecheck and lint passed; exact Radix lockfile with zero known audit vulnerabilities.
Limit: local frontend demonstration; no production integrations.
```

```text
cf858b8 Codex Automation <codex@local.invalid>
feat(ui): establish Pressline paper-and-ink design system and navigation

Why: implement the focused PREM-003; UI-001; FR-001-009 acceptance unit.
Requirement: PREM-003; UI-001; FR-001-009.
Behavior: establish Pressline paper-and-ink design system and navigation.
Validation: Typecheck and lint passed; navigation and 200 percent reflow Playwright checks passed 2 of 2; all-route capture has zero page exceptions; desktop login dashboard POS and mobile POS visually reviewed; domain and repository preserved.
Limit: local frontend demonstration; no production integrations.
```

```text
a4bbb44 Codex Automation <codex@local.invalid>
feat(pos): add service selection and adaptive current-order controls

Why: implement the focused PREM-004; FR-010-030 acceptance unit.
Requirement: PREM-004; FR-010-030.
Behavior: add service selection and adaptive current-order controls.
Validation: Typecheck and lint passed; 5 focused Chromium checks passed including original multi-item advance journey, invalid input, service filters/exact totals, empty-draft reload, mobile footer/review/focus; desktop empty/populated and mobile cart visually reviewed.
Limit: local frontend demonstration; no production integrations.
```

```text
f80e521 Codex Automation <codex@local.invalid>
style(workspace): refine operational tables charts drawers and print surfaces

Why: implement the focused PREM-005; UI-001; FR-001-054 acceptance unit.
Requirement: PREM-005; UI-001; FR-001-054.
Behavior: refine operational tables charts drawers and print surfaces.
Validation: Typecheck lint and 58 unit/component tests passed; 8 operational journeys passed; full-route axe and settings/SMS checks passed 3 of 3; entry regression passed; two visual passes and Taste app measurements completed; no domain or data changes.
Limit: local frontend demonstration; no production integrations.
```

```text
3603fbc Codex Automation <codex@local.invalid>
fix(ui): contain long order text and protect currency sizing on mobile

Why: implement the focused PREM-008; UI-001; FR-015; WCAG-1.4.10 acceptance unit.
Requirement: PREM-008; UI-001; FR-015; WCAG-1.4.10.
Behavior: contain long order text and protect currency sizing on mobile.
Validation: Typecheck and lint passed; strengthened mobile regression first exposed 464px internal overflow then 328px review overflow; repaired wrapping and currency flex sizing; all 4 focused Chromium checks passed including Unicode landscape reduced-motion and original POS behavior.
Limit: local frontend demonstration; no production integrations.
```

```text
a7fbe66 Codex Automation <codex@local.invalid>
test(ui): verify premium workflows responsive layouts and contrast tokens

Why: implement the focused PREM-006; TEST-001; UI-001 acceptance unit.
Requirement: PREM-006; TEST-001; UI-001.
Behavior: verify premium workflows responsive layouts and contrast tokens.
Validation: Clean install typecheck lint format 58 unit tests and build passed; combined production Chromium 32 of 32 passed after unchanged injection-error rerun and 3 isolated repeats; 22 contrast pairs and 21 Taste viewport combinations passed; captured production gallery and one-page PDFs; PREM-009 footer finding tracked for focused repair.
Limit: local frontend demonstration; no production integrations.
```

```text
8808589 Codex Automation <codex@local.invalid>
fix(pos): keep desktop totals and order review within the viewport

Why: implement the focused PREM-009; FR-015; UI-001 acceptance unit.
Requirement: PREM-009; FR-015; UI-001.
Behavior: keep desktop totals and order review within the viewport.
Validation: Regression first placed Review at 1211px in a 900px viewport; measured actual available height and separated scrolling specifications from persistent totals/actions; typecheck lint and all 7 focused browser checks passed; desktop/mobile images visually reviewed.
Limit: local frontend demonstration; no production integrations.
```

```text
53bb11c Codex Automation <codex@local.invalid>
style(tests): normalize summary visibility regression formatting

Why: implement the focused PREM-009 acceptance unit.
Requirement: PREM-009.
Behavior: normalize summary visibility regression formatting.
Validation: Prettier check passed; formatting-only callback wrapping with unchanged assertions; prior 7 focused browser checks remain valid; final combined gates rerun next.
Limit: local frontend demonstration; no production integrations.
```

### Review and provenance checks

Inspected status, retained branches, oneline/decorated history, graph, full author/message records and name-status diffs. Each implementation commit explicitly staged intended paths, checked cached whitespace/secret patterns and retained a full staged review diff locally. Repository-local Codex Automation identity was used; no global configuration changed. Topic creation started from develop, and each verified unit was merged with --no-ff; extra footer formatting correction was retained separately. Domain/data diff against c73980c is empty. User-supplied reference hashes were checked before staging and remain unchanged.

Created: original SVG mark/paper specimens, local licensed font, service catalogue/responsive summary, official primitives, tests/scripts, design/evidence docs. Updated: tokens, shell/access, shared wrappers, existing operational/print screens and ledgers. Fixed: internal long-content/currency overflow, mobile edit focus, control contrast and desktop footer visibility. Deleted: obsolete decorative KPI icon treatment and redundant generated class dependency; no business capability removed. Exact path provenance is reproducible with `git diff --name-status c73980c..develop` and `git log --all --name-status`.

Final audit-only commits necessarily follow this snapshot; no self-referential hash or fabricated clean-tree result is embedded. The final user report supplies the delivered full tip.

### Final navigation craft source

```text
a9e8fe7 Codex Automation <codex@local.invalid>
style(navigation): give rail labels room to wrap naturally

Why: implement the focused PREM-011 acceptance unit.
Requirement: PREM-011.
Behavior: give rail labels room to wrap naturally.
Validation: Production build and 33 browser tests passed; measured Production word on one line; zoom and all widths passed.
Limit: local frontend demonstration; no production integrations.
```

Integrated by 173ffec; production build and full 33-test suite passed after the change. The active word Production now occupies one measured line within the labeled rail.

### Final navigation and keyboard source messages

```text
cdca073 Codex Automation <codex@local.invalid>
test(pos): await category focus before keyboard activation

Why: implement the focused PREM-010 acceptance unit.
Requirement: PREM-010.
Behavior: await category focus before keyboard activation.
Validation: Five repeated production keyboard checks passed; explicit focus assertions preserve selection and drawer checks.
Limit: local frontend demonstration; no production integrations.
```

```text
a8c4c27 Codex Automation <codex@local.invalid>
style(navigation): preserve rail text edge clearance

Why: the final design inspector found SMS text 15px from the viewport edge after the wider label cap.
Requirement: PREM-011; HCI hierarchy, readable navigation and responsive layout.
Behavior: use a 72px cap so Production remains intact and SMS reports wraps with adequate clearance.
Validation: production build, lint and all 33 E2E tests passed; all 21 final Taste workspace combinations clear.
Limit: frontend presentation only. Lifecycle and source hash recorded in the following handover audit.
```

Final navigation source a8c4c27 is integrated by 2182df5. All 33 production browser tests and all 21 Taste workspace combinations passed on the final 72px cap. The complete handover records this source-only refinement; pending documentation was preserved on its own topic throughout.

## Final handover audit snapshot

Primary documentation source `965665ff029ef7474d8445f9c6383e79f8149cfa`, integrated by `4ead4f2293ba4de595172851a25a220e19f368b2`. Before this audit-only update, `node scripts/verify-git.mjs` passed: 37 retained local branches (35 topics, including 11 premium topics), every topic registered and integrated, main unchanged, working tree clean. `git rev-list --count --branches` returned 83. Final audit source/integration commits follow, so the final report obtains their exact tip/count directly rather than predicting a self-referential hash.

Reviewed `git status --porcelain`, `git branch`, decorated/graph history, the complete premium author/message log and name-status diffs. All premium commits use repository-local Codex Automation <codex@local.invalid>. Stable main remains `e0b62dcb03330778fcdc8b6b1a4e5cc421beb604`. No remotes, push, hosted PR, deployment or main merge. The only temporary documentation stash was restored, committed and removed; no user work discarded. Domain/data diff against c73980c remains empty. Staged owner handbook/screenshot SHA256 values also match their original input hashes, including normalized text storage.

```text
965665f Codex Automation <codex@local.invalid>
docs(frontend): deliver premium design and verified production evidence

Why: hand over the complete premium interface with reproducible evidence and honest frontend boundaries.
Requirement: PREM-007; master prompt documentation, FR/NFR coverage, HCI and Git provenance.
Behavior: document the canonical design, preserved workflows, reviewed tools, complete lifecycle history, unchanged owner references and actual screenshot/PDF/runtime artifacts.
Validation: clean npm ci, typecheck, lint, format, 58 unit tests, production build and 33 browser tests passed; 22 contrast pairs, 21 final Taste combinations, 54 FR/35 NFR references, 238 HCI IDs, local links and reference hashes checked.
Limit: no backend, database, provider operation, main change, push or deployment; unknown exact requirements, real AT/devices/printers and production readiness remain unverified.
```

The source-only navigation clearance commit a8c4c27 is linked to its complete PREM-011 lifecycle in the primary handover. Final 33/33 browser tests, 21 clear Taste workspace combinations, 22 contrast pairs, screenshots/PDFs and raw lab correspond to that final application source. Formatting/link/coverage checks are rerun for this audit. No application changes are included in this commit.

## Connected follow-up Git audit · 2026-10-25

Started clean from develop `60ef6695c34cc6d0e8d3caea8d74f1fc33c1ddfa`; main `e0b62dcb03330778fcdc8b6b1a4e5cc421beb604` remains unchanged. Snapshot develop before handover commits: `c264ab05611860a18772fa6966b5c7fac9ecc6f9`. No remote, push, history rewrite, topic deletion or deployment. Local-only Git identity was retained; global configuration untouched. QA checkpoints with observed failures stayed unmerged until repairs and all 44 production tests passed. Separate no-ff synchronization merges preserved QA and fix histories; append-only conflicts in the two audit files were resolved by preserving both sections at each synchronization checkpoint.

| Retained topic                           | Actual topic tip                           | Local develop no-ff merge                  |
| ---------------------------------------- | ------------------------------------------ | ------------------------------------------ |
| `docs/fup-000-scope`                     | `efb5d33684f3904c13d2e234f6c3ede6e0504146` | `158310d04234747a604b47a24980acff1ef01f58` |
| `feat/cust-005-storage-evolution`        | `ca86eedd41465284d43fd10f515bec79c1c43db2` | `ac05745f6b39ede2c25efbf5561cd400c9292f82` |
| `feat/cust-001-directory`                | `5b95e020ad05ecd9eee59ac96945f34463de6985` | `b774da9246791cf08966c917c5e5255f93088639` |
| `feat/svc-001-managed-catalogue`         | `4b2e4242336f09a40012da6dc01cb8a5ef502f46` | `32c72c2f40ae5b8a759d666f984fb2c52aa60a38` |
| `feat/svc-004-pos-integration`           | `5f4aca3ec0e14f810ac6fe16b8d2a5ed843a3a5f` | `bd31788c020b017daad7a43bb4b47e06f1640022` |
| `feat/mat-003-confirmed-usage`           | `0542428f485d6e9d83ad9c28947451d4a78e7213` | `6e4459a17d4e66cc9232b0052fd4b291a344162b` |
| `fix/fup-002-drawer-notifications`       | `89e26090f175a603472349a54f764b404d1bf932` | `950b70a11b71b6dd3419ce61e09f21f300f51755` |
| `fix/cust-006-long-name-reflow`          | `57f2c3845c16faf7b36bc3c6e24669565e1bec60` | `f0752d9dacaa75bd7553d0cf03f8d3c50ea837e5` |
| `fix/mat-004-service-evidence`           | `49f6b887ea1ee9e9cb5ed95825ea0a80e32f106d` | `bb8adef5ab6b1cc26e2888ede7f5dc176239e049` |
| `fix/svc-004-print-specification-labels` | `01d91aff38f33afdd13a3849db0e7ba1a5c4909f` | `fd94e9d0ae2cf018f7b22c0e637f4f9d6c286e45` |
| `fix/fup-006-workflow-orientation`       | `ea7e7e6ab135052ad4119919778b5097eb01508b` | `3378930eca50f4f07bb8824d02737d2ae7bfefef` |
| `test/fup-001-connected-workflows`       | `6622a967274c563690644138dc30bade7ccf6996` | `c264ab05611860a18772fa6966b5c7fac9ecc6f9` |

`docs/fup-001-handover` is the active handover topic. Its primary source/merge will be backfilled by the next audit; no commit can embed its own final hash. Exact post-audit tip/clean status are reported in the final response.

Actual follow-up commit messages at this snapshot:

```text
efb5d33684f3904c13d2e234f6c3ede6e0504146
docs(followup): register connected customer service and material scope
Why: protect the existing frontend and trace the explicitly approved evolution.
Requirement: CUST-001–006, SVC-001–006, MAT-001–008.
Behavior: record baseline, all 20 feature IDs, migration and usage conventions before source changes.
Validation: Clean Git baseline, actual source/role/storage/calculation review; installed Next guides and existing design skills consulted; baseline tests running, not yet claimed passed.
Limit: browser-local frontend demonstration; no backend operation.

158310d04234747a604b47a24980acff1ef01f58
chore(integration): merge docs/fup-000-scope
Requirement: CUST-001–006, SVC-001–006, MAT-001–008. Validation: Clean Git baseline, actual source/role/storage/calculation review; installed Next guides and existing design skills consulted; baseline tests running, not yet claimed passed. Retain verified topic history; main unchanged.

ca86eedd41465284d43fd10f515bec79c1c43db2
feat(storage): migrate legacy demo records into the connected v2 model
Why: preserve existing browser records while adding shared customer service and material entities.
Requirement: CUST-005; SVC-002; MAT-001 data foundations.
Behavior: pure v1 upgrade, v2 validation and deterministic additive fixtures; no automatic customer matching or stock consumption.
Validation: Typecheck and lint passed; 61/61 tests across 15 files passed after preserving fixture order and updating unsupported-version boundary; 10 focused migration/repository tests passed.
Limit: browser-local frontend demonstration; no backend operation.

ac05745f6b39ede2c25efbf5561cd400c9292f82
chore(integration): merge feat/cust-005-storage-evolution
Requirement: CUST-005; SVC-002; MAT-001 data foundations. Validation: Typecheck and lint passed; 61/61 tests across 15 files passed after preserving fixture order and updating unsupported-version boundary; 10 focused migration/repository tests passed. Retain verified topic history; main unchanged.

5b95e020ad05ecd9eee59ac96945f34463de6985
feat(customers): add saved profiles and branch-scoped account history
Why: give returning individuals and companies a persistent identity and truthful permitted receivables.
Requirement: CUST-001, CUST-003, CUST-004, CUST-006; CUST-005 explicit linking domain.
Behavior: customer management, duplicate warnings, archive-safe history, derived branch balances and readable directory/profile routes.
Validation: Typecheck and scoped ESLint passed; 8 focused customer/migration tests and 2 customer browser journeys passed; desktop/mobile visuals inspected with no page errors; final production suite pending.
Limit: browser-local frontend demonstration; no backend operation.

b774da9246791cf08966c917c5e5255f93088639
chore(integration): merge feat/cust-001-directory
Requirement: CUST-001, CUST-003, CUST-004, CUST-006; CUST-005 explicit linking domain. Validation: Typecheck and scoped ESLint passed; 8 focused customer/migration tests and 2 customer browser journeys passed; desktop/mobile visuals inspected with no page errors; final production suite pending. Retain verified topic history; main unchanged.

4b2e4242336f09a40012da6dc01cb8a5ef502f46
feat(services): manage versioned catalogue categories prices and material recipes
Why: allow administrators to define usable print services without source edits.
Requirement: SVC-001, SVC-002, SVC-003, SVC-005, SVC-006 foundations; MAT-001.
Behavior: managed categories/service availability, supported print choices or unit pricing, immutable quote snapshots and whole-unit material templates.
Validation: Typecheck and scoped ESLint passed; 29 focused service/original pricing/domain tests and 2 service/pricing browser journeys passed; desktop/mobile service editor inspected; dynamic POS integration is next.
Limit: browser-local frontend demonstration; no backend operation.

32c72c2f40ae5b8a759d666f984fb2c52aa60a38
chore(integration): merge feat/svc-001-managed-catalogue
Requirement: SVC-001, SVC-002, SVC-003, SVC-005, SVC-006 foundations; MAT-001. Validation: Typecheck and scoped ESLint passed; 29 focused service/original pricing/domain tests and 2 service/pricing browser journeys passed; desktop/mobile service editor inspected; dynamic POS integration is next. Retain verified topic history; main unchanged.

5f4aca3ec0e14f810ac6fe16b8d2a5ed843a3a5f
feat(pos): connect saved customers and managed service snapshots
Why: make administrator catalogue records and returning customers usable in the existing checkout.
Requirement: CUST-002, CUST-003, CUST-005, CUST-006; SVC-004, SVC-006.
Behavior: dynamic service cards and unit-aware configuration/printing, customer lookup/quick-add/walk-in/profile handoff, explicit legacy linking and isolated drawer form submission.
Validation: Typecheck/scoped ESLint passed; 15 focused component/form/service/customer tests and all 6 connected/original premium POS browser scenarios passed after portal fix; full production integration gate remains.
Limit: browser-local frontend demonstration; no backend operation.

bd31788c020b017daad7a43bb4b47e06f1640022
chore(integration): merge feat/svc-004-pos-integration
Requirement: CUST-002, CUST-003, CUST-005, CUST-006; SVC-004, SVC-006. Validation: Typecheck/scoped ESLint passed; 15 focused component/form/service/customer tests and all 6 connected/original premium POS browser scenarios passed after portal fix; full production integration gate remains. Retain verified topic history; main unchanged.

0542428f485d6e9d83ad9c28947451d4a78e7213
feat(inventory): record confirmed job materials once with compensating corrections
Why: actual job material use must update the correct branch without duplicated debits or altered customer debt.
Requirement: MAT-002, MAT-003, MAT-004, MAT-005, MAT-006, MAT-007, MAT-008.
Behavior: editable snapshot plans, explicit aggregated no-negative confirmation, immutable movement evidence, stable event guards, separate additional use and administrator corrections.
Validation: 83 tests passed at full checkpoint; final 10 material tests and scoped formatting passed; typecheck and lint passed; complete banner browser workflow passed; three-width visual inspection identified toast overlay fix for next topic; final production gate pending.
Limit: browser-local frontend demonstration; no backend operation.

6e4459a17d4e66cc9232b0052fd4b291a344162b
chore(integration): merge feat/mat-003-confirmed-usage
Requirement: MAT-002, MAT-003, MAT-004, MAT-005, MAT-006, MAT-007, MAT-008. Validation: 83 tests passed at full checkpoint; final 10 material tests and scoped formatting passed; typecheck and lint passed; complete banner browser workflow passed; three-width visual inspection identified toast overlay fix for next topic; final production gate pending. Retain verified topic history; main unchanged.

89e26090f175a603472349a54f764b404d1bf932
fix(ui): keep success notifications below modal confirmation actions
Why: rapid plan-save then confirmation exposed a toast over the mobile drawer footer.
Requirement: CUST-006, MAT-003; FUP-002.
Behavior: canonical notification layer stays above navigation and below modal overlays; all existing success feedback remains.
Validation: strengthened browser regression failed at toast layer 80 versus sheet 51 before correction, passed afterward at 390/320/768 with geometric hit testing and actual confirm; all 22 contrast pairs and scoped formatting passed.
Limit: browser-local frontend demonstration; no backend operation.

950b70a11b71b6dd3419ce61e09f21f300f51755
chore(integration): merge fix/fup-002-drawer-notifications
Requirement: CUST-006, MAT-003; FUP-002. Validation: strengthened browser regression failed at toast layer 80 versus sheet 51 before correction, passed afterward at 390/320/768 with geometric hit testing and actual confirm; all 22 contrast pairs and scoped formatting passed. Retain verified topic history; main unchanged.

0d0d15089a7d6aaf391e7e5afbd4db55b680c3ac
test(workflows): extend connected customer catalogue and material verification
Requirement: CUST-001..006, SVC-001..006, MAT-001..008. Why: exercise new entities across production, responsive, accessibility and visual workflows. Validation: typecheck/lint/83 tests/build and corrected format gate passed; new desktop/mobile modal axe scans passed; dev nine-width checkpoint timed out at ninth width and long-name 200-percent test found 3076px overflow. Preserve this checkpoint unmerged; repair reflow and rerun unchanged assertions before integration. Frontend mock only.

57f2c3845c16faf7b36bc3c6e24669565e1bec60
fix(customers): reflow long saved names in headings and POS selection
Why: a 90-character unbroken saved name expanded the profile beyond the viewport at 200 percent text.
Requirement: CUST-006; FUP-003.
Behavior: constrain flex children and wrap long names within available profile and checkout widths.
Validation: focused browser test failed at 3076px before correction, then passed 200 percent text at 1440 and profile/selected POS at 320; scoped formatting passed; expanded production gate remains pending.
Limit: browser-local frontend demonstration; no backend operation.

f0752d9dacaa75bd7553d0cf03f8d3c50ea837e5
chore(integration): merge fix/cust-006-long-name-reflow
Requirement: CUST-006; FUP-003. Validation: focused browser test failed at 3076px before correction, then passed 200 percent text at 1440 and profile/selected POS at 320; scoped formatting passed; expanded production gate remains pending. Retain verified topic history; main unchanged.

b914240b37f802fb20c37aad21e7c61c10f277af
chore(verification): include verified customer reflow repair
Requirement: CUST-006, FUP-003. Preserve the QA checkpoint and verified fix histories; complete production verification remains required before merging this topic into develop.

# Conflicts:
#	docs/change-log.md
#	docs/followup-implementation.md

49f6b887ea1ee9e9cb5ed95825ea0a80e32f106d
fix(materials): retain accepted service identity in movement evidence
Why: a cashier job description can differ from the accepted catalogue service name.
Requirement: MAT-004, MAT-005; FUP-004.
Behavior: record the immutable accepted service name with a manual-job fallback and preserve correction snapshots.
Validation: new custom-description/catalogue-rename test failed before correction, all 11 material domain tests passed afterward; full production gate remains pending.
Limit: browser-local frontend demonstration; no backend operation.

bb8adef5ab6b1cc26e2888ede7f5dc176239e049
chore(integration): merge fix/mat-004-service-evidence
Requirement: MAT-004, MAT-005; FUP-004. Validation: new custom-description/catalogue-rename test failed before correction, all 11 material domain tests passed afterward; full production gate remains pending. Retain verified topic history; main unchanged.

6d1de2ef45a1252d220d4d3e3e11e87ae241990d
chore(verification): include accepted service evidence correction
Requirement: MAT-004, MAT-005. Focused material tests pass; full production verification remains pending on this topic.

176ee85290427b224f2ae1765232b3d414585c2b
test(printing): capture print media and preserve complete-suite checkpoint
Requirement: SVC-004, MAT-004. Validation: application gates and 84 tests pass; complete production suite 43/44, explicit print specification label assertion failed. Capture real print CSS; preserve the assertion and repair the UI before integration. Frontend only.

01d91aff38f33afdd13a3849db0e7ba1a5c4909f
fix(printing): preserve explicit print specification labels for job tickets
Why: the existing operational Binding and Finishing labels remain useful when unit services share print documents.
Requirement: SVC-004, SVC-006, MAT-004; FUP-005.
Behavior: restore labeled print options for print-model/legacy lines and retain unit-service summaries without irrelevant paper controls.
Validation: original printing assertion failed in 43-of-44 production checkpoint; after correction all three focused printing/connected browser scenarios passed on dev; unchanged production suite awaits rebuilt verification.
Limit: browser-local frontend demonstration; no backend operation.

fd94e9d0ae2cf018f7b22c0e637f4f9d6c286e45
chore(integration): merge fix/svc-004-print-specification-labels
Requirement: SVC-004, SVC-006, MAT-004; FUP-005. Validation: original printing assertion failed in 43-of-44 production checkpoint; after correction all three focused printing/connected browser scenarios passed on dev; unchanged production suite awaits rebuilt verification. Retain verified topic history; main unchanged.

ee44a84e42f94679c1ade6a100d38f8154bda380
chore(verification): include restored printing specification labels
Requirement: SVC-004 and MAT-004. Original focused print assertion passes unchanged. Preserve full checkpoint history and require complete rebuilt production verification.

# Conflicts:
#	docs/change-log.md
#	docs/followup-implementation.md

ff4531df0669872aa9f890df0435dc055e0014ba
test(visual): retain connected production captures and orientation finding
Requirement: CUST-006, MAT-002, MAT-008. Validation: full gates, 84 unit tests and 44 production checks pass; 26 real captures, one-page PDFs, no page/console/external requests; Taste 18 combinations, no FAIL and 5 contextual warnings. Manual review identified incorrect customer breadcrumb and inactive Customers navigation; keep QA unmerged until focused repair and refreshed verification. Frontend only.

ea7e7e6ab135052ad4119919778b5097eb01508b
fix(navigation): preserve customer context across profile routes
Why: customer profiles incorrectly inherited Profile breadcrumb and lacked an active Customers link.
Requirement: CUST-006, MAT-002; FUP-006.
Behavior: share segment-aware parent-route classification for active navigation and breadcrumbs, and use sentence case for material context.
Validation: strengthened customer navigation/reflow test failed before correction and passed afterward with original zoom/mobile/POS assertions; prior full 44-test pass remains a pre-orientation checkpoint; refresh final gates/evidence.
Limit: browser-local frontend demonstration; no backend operation.

3378930eca50f4f07bb8824d02737d2ae7bfefef
chore(integration): merge fix/fup-006-workflow-orientation
Requirement: CUST-006, MAT-002; FUP-006. Validation: strengthened customer navigation/reflow test failed before correction and passed afterward with original zoom/mobile/POS assertions; prior full 44-test pass remains a pre-orientation checkpoint; refresh final gates/evidence. Retain verified topic history; main unchanged.

3b73e8c97ca31fca176ba830c132abb8f5de39a7
chore(verification): include corrected customer workflow orientation
Requirement: CUST-006, MAT-002. Strengthened navigation/reflow regression passes. Preserve both verified feature and QA checkpoint histories; refresh final production evidence.

# Conflicts:
#	docs/change-log.md
#	docs/followup-implementation.md

6622a967274c563690644138dc30bade7ccf6996
test(workflows): verify complete connected frontend and refresh production evidence
Why: handover needs a clean complete production pass after all observed functional and visual corrections.
Requirement: CUST-001 through CUST-006; SVC-001 through SVC-006; MAT-001 through MAT-008; FUP-002 through FUP-006.
Behavior: retain final screenshots/PDFs, raw ledger/error/Taste evidence and stable modal capture timing; preserve all original financial and access assertions.
Validation: typecheck/lint/format/build and 84 tests passed; all 44 production Chromium tests passed with one worker and no retry/skip; 26 refreshed captures and two one-page PDFs, no browser/external errors; 22 contrast pairs; Taste 18 combinations 0 FAIL/5 contextual WARN and source 0 FAIL/29 WARN.
Limit: browser-local frontend demonstration; no backend operation.

c264ab05611860a18772fa6966b5c7fac9ecc6f9
chore(integration): merge test/fup-001-connected-workflows
Requirement: CUST-001 through CUST-006; SVC-001 through SVC-006; MAT-001 through MAT-008; FUP-002 through FUP-006. Validation: typecheck/lint/format/build and 84 tests passed; all 44 production Chromium tests passed with one worker and no retry/skip; 26 refreshed captures and two one-page PDFs, no browser/external errors; 22 contrast pairs; Taste 18 combinations 0 FAIL/5 contextual WARN and source 0 FAIL/29 WARN. Retain verified topic history; main unchanged.
```

## Primary follow-up handover hash backfill · 2026-10-25

Primary handover source `06da62a0a8f7ca8fbe999ad1143e1b0c13e741b7` was integrated by no-ff merge `d1c3e900448c22fbc4990c5dbb4911f5e8633b5f`. At that executed snapshot: 50 retained branches registered/integrated, 118 reachable commits, working tree clean, main exactly `e0b62dcb03330778fcdc8b6b1a4e5cc421beb604`, no remote. All 20 follow-up IDs, 54 FR/35 NFR references and 238 HCI catalogue IDs retained; 78 local links resolved; original reference bytes and manifest/lock unchanged. Frontend code is unchanged after the final 84-unit/44-production-browser gate and refreshed visual review.

This audit-only commit records the hashes that could not exist inside the primary handover commit. Its own hash and subsequent develop merge are necessarily reported in the final response; no self-referential hash is fabricated. All topic refs remain. Final checks are full documentation formatting, exact main comparison, topic integration/registration, clean status and absence of remote/push/publication.

## Verified CI integration and final source review · 2026-10-25

`chore/ci-001-quality-gates` source `817327fa652bb30c49135a1b3f44fe1a6d1cd19a` / no-ff develop merge `41a97ef3b10f32cddf469983b9b94cead7320dd5`. Actual integration checkpoint: 51 retained branches registered/integrated, clean tree, main `e0b62dcb03330778fcdc8b6b1a4e5cc421beb604` unchanged, no remote. Clean temporary install and workflow-equivalent strict gates, 84 unit/component and 44 production browser tests passed. Action SHAs were read from official upstream refs and inspected input definitions; hosted CI was not triggered.

This audit-document topic `docs/aud-001-final-review` preserves the partial security report limitations, dependency advisory result and the actual CI provenance. It changes documentation only. Its own source/final merge and final retained-branch/clean result must be reported after commit, not fabricated here. No history rewrite, push, main modification or backend/deployment operation occurred.

```text
817327fa652bb30c49135a1b3f44fe1a6d1cd19a
ci(frontend): verify locked production demo workflows

Why: the complete frontend had passing local checks but no configured CI and clean typechecking depended on generated Next artifacts.
Requirement: CI-001; existing CUST-001..006, SVC-001..006 and MAT-001..008 regression preservation.
Behavior: pin read-only quality actions and runtime, install locked dependencies, audit all dependencies, generate route types, check source/style/tests/contrast, build and test production without server reuse; explicit Colombo browser timezone.
Validation: Fresh temporary source copy: npm ci installed 544/audited 545, zero known vulnerabilities; advisory audit/typegen+typecheck/lint/format/84 tests/22 contrast pairs/browser install passed; CI=true production build and all 44 Chromium tests passed (347.63s), no configured retries; YAML parse/immutable action pins/read-only permissions verified. No hosted CI run claimed.
Limit: browser-local frontend demonstration; no backend operation.

41a97ef3b10f32cddf469983b9b94cead7320dd5
chore(integration): merge chore/ci-001-quality-gates

Requirement: CI-001; existing CUST-001..006, SVC-001..006 and MAT-001..008 regression preservation. Validation: Fresh temporary source copy: npm ci installed 544/audited 545, zero known vulnerabilities; advisory audit/typegen+typecheck/lint/format/84 tests/22 contrast pairs/browser install passed; CI=true production build and all 44 Chromium tests passed (347.63s), no configured retries; YAML parse/immutable action pins/read-only permissions verified. No hosted CI run claimed. Retain verified topic history; main unchanged.
```
