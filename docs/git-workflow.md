# Local Git governance

## Explicit frontend delivery authorization · 2026-10-29

The current owner request authorizes delivery to `rizad-mohamed/pressline-pos-system` / `main` through the permitted GitHub review/check workflow, after verification. Earlier no-remote/no-main-approval statements below describe their historical checkpoints. The repository is now public and was observed empty with no branches, rulesets or Actions runs; existing Git credentials authenticate as the owner. No protection setting is changed by this task. Bootstrap only the preserved root baseline if needed, push verified `develop`, open a PR to `main`, honor actual required reviews/checks, and verify the final remote commit and its hosted run. Source integration is not deployment or permission to implement backend/authentication.

Delivery retains every topic reference and the full non-fast-forward graph. No main integration is authorized by frontend completion. Feature register and chronological change log map source units and verification; git-audit.md inventories branch/commit/merge evidence. Audit snapshots necessarily precede their own commits, so exact final tips come from Git and the final handoff rather than a fabricated self-referential hash.

Initialized from an empty workspace on 2026-10-24. Stable `main` contains baseline `e0b62dc`; `develop` is the integration branch. No remotes or branch protections exist. Nothing is published.

Use focused lowercase `chore/`, `feat/`, `fix/`, `test/`, `docs/` branches from current develop; retain every reference. Stage explicit paths, run `git diff --cached --check`, inspect the staged diff for unrelated content/secrets, run relevant checks, commit with why/requirements/behavior/validation, then merge `--no-ff`. Rerun integration checks. If a check is unavailable, preserve the branch without claiming verified frontend behavior.

Conventional subject: `feat(pos): add itemized print-order review`. Body includes Why, Requirement, Behavior, Validation and Limit/Impact where relevant. Changes and corrections get separate commits. Revert integrated changes with a new `revert` commit; never rewrite shared history.

Only the owner can approve integration to main, remotes, pushes, deployments, or remote protections. Local review/checks do not simulate enforceable remote protection.

Git ownership differs under the sandbox, so use `git -c safe.directory=C:/Users/HARSHANA/Desktop/POS_SYS_WS ...`; never change global safe.directory. `.git` writes need the native execution permission override. Local author: Codex Automation <codex@local.invalid>, distinct from the preexisting global human identity.

Audit artifacts are chronological. Each next audit commit records earlier implementation/merge hashes, avoiding impossible self-referential hashes. The final audit commit is discoverable with `git log`.

## Premium enhancement review

The premium phase starts at develop c73980c and retains separate audit, reviewed tooling, shell, POS, operational, regression, long-content, footer, keyboard synchronization, navigation and handover topics. Source/merge hashes and actual lifecycle events are in feature-register.md, change-log.md and git-audit.md. Review the production gallery and failed-checkpoint dispositions alongside source. No owner approval to push, publish or merge main is implied by passing local frontend checks.
