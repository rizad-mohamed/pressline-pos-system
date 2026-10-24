# Feature register

Date: 2026-10-24. Requirements below use only the group meanings reproduced in the supplied prompt; a separately approved FR/NFR baseline is not available. HCI references are subject to reading the available handbook.

| ID | Scope / dependencies | Priority | Branch | State | Checks / references |
|---|---|---|---|---|---|
| INIT-001 | Empty repository baseline | P0 | main | integrated e0b62dc | inspected empty workspace |
| DOC-001 | Governance and reference inventory / INIT-001 | P0 | docs/doc-001-governance | in progress | staged diff review |
| INIT-002 | Next.js, strict TS, Tailwind, test/build tooling / DOC-001 | P0 | chore/init-002-nextjs-foundation | integrated; 1db8851 / merge bbf89eb | typecheck, lint, build |
| UI-001 | Brand tokens and accessible primitives / INIT-002 | P0 | feat/ui-001-design-system | integrated; ca8225c / merge 3450f1f | component tests, responsive QA |
| DOM-001 | Pricing, payments, stock, reporting, fixtures, persistence / INIT-002 | P0 | feat/dom-001-demo-domain | integrated; awaiting hash | Vitest domain invariants |
| FR-001 | Demo accounts, role shell, dashboard / UI-001, DOM-001 | P0 | feat/fr-001-demo-access | planned | role and route checks |
| FR-015 | Multi-item POS and review / FR-001 | P0 | feat/fr-015-order-composer | planned | pricing/order tests |
| FR-021 | History, details, payments, production states / FR-015 | P0 | feat/fr-021-order-operations | planned | payments/status isolation |
| FR-024 | Receipt and separate job ticket / FR-021 | P0 | feat/fr-024-print-documents | planned | print/E2E checks |
| FR-033 | Inventory CRUD, adjustments, low stock / FR-001 | P0 | feat/fr-033-branch-inventory | planned | validation/movements |
| FR-035 | Atomic mock transfers / FR-033 | P0 | feat/fr-035-stock-transfers | planned | transfer invariants |
| FR-013 | Price configuration / DOM-001 | P0 | feat/fr-013-price-settings | planned | historical snapshots |
| FR-042 | Period reports, branch/all scopes / FR-021 | P0 | feat/fr-042-financial-reports | planned | date/cohort tests |
| FR-047 | SMS config and unsent preview / FR-042 | P0 | feat/fr-047-sms-preview | planned | report consistency |
| FR-008 | Team/branch/app/profile demo settings / FR-001 | P1 | feat/fr-008-demo-settings | planned | persistence/reset |
| TEST-001 | E2E, responsive, keyboard, accessibility review / all features | P0 | test/test-001-workflow-validation | planned | Playwright + RTL |
| DOC-002 | Coverage, handover, audit / TEST-001 | P0 | docs/doc-002-delivery-evidence | planned | history cross-check |
