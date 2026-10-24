# Working agreement

- This repository is a local-only Next.js frontend demo. No real authentication, payment, SMS, SQL, RLS, backend endpoints, deployment, or secrets.
- Use strict TypeScript. Keep calculations pure in `src/domain`, fixtures/repository in `src/data`, feature UI in `src/features`, routes thin in `src/app`.
- All workflows use one validated demo store. Integer LKR cents, immutable effective price snapshots, separate payments and production state. Asia/Colombo calendar dates.
- Cashiers are branch-scoped in the UI; browser restrictions are not security. Admin read scope may be all branches; writes require one branch.
- Use canonical `src/styles/brand.css` tokens, accessible semantic controls and Radix sheets with focus return, Escape and unsaved-change guards. Honor reduced motion.
- Branch from `develop` for each meaningful change; use lowercase `type/id-description`, atomic Conventional Commits with requirements and actual validation. Inspect staged diffs; explicitly stage intended files. Merge verified work with `--no-ff`; retain topic branches. Never change `main`, push, or publish without approval.
- Maintain docs/feature-register.md and docs/change-log.md for every lifecycle event. Commit references may be backfilled by the next audit commit (a commit cannot embed its own hash).
- Run npm scripts for typecheck, lint, test, build, and E2E as applicable. Never report blocked checks as passing. Record limitations in FRONTEND_STATUS.md.
- Use repository-local automated Git identity; do not change global configuration. Pass the workspace via Git's per-command safe.directory setting when sandbox ownership differs.
- Tested runtime: Node 24.14.1 / npm 11.11.0. Use `npm ci`, `npm run dev`; gates are `typecheck`, `lint`, `format:check`, `test`, `build`, and `test:e2e`. Browser tests build/start production when no server exists; stop dev to reproduce production verification.
- Keep table scroll containers positioned relatively and keyboard-focusable: absolutely positioned hidden labels must not escape and create whole-page overflow. Wait for navigation URLs before deriving order IDs in browser tests.
- `next-env.d.ts` is generated/ignored; keep its tsconfig includes. Full delivery evidence is in FRONTEND_STATUS.md and docs/validation-log.md. Future production work requires a new explicit scope; do not mistake a mock adapter or interface for implemented server security.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Premium frontend maintenance

- Keep the locally hosted Manrope license and canonical paper/charcoal/lime roles. Review new control/text color pairs with `node scripts/check-design.mjs`.
- Preserve one responsive current-order instance, named keyboard-focusable item/advance scrolling and visible totals/review footer. Test long content at 320px and desktop initial/scrolled viewport bounds when changing this layout.
- Use the installed reviewed shadcn/Taste guidance within this frontend scope; retain existing modal/form contracts and manual order editing. Do not reinitialize components.json or add unsupported service prices.
