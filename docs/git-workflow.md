# Local Git governance

Initialized from an empty workspace on 2026-10-24. Stable `main` contains baseline `e0b62dc`; `develop` is the integration branch. No remotes or branch protections exist. Nothing is published.

Use focused lowercase `chore/`, `feat/`, `fix/`, `test/`, `docs/` branches from current develop; retain every reference. Stage explicit paths, run `git diff --cached --check`, inspect the staged diff for unrelated content/secrets, run relevant checks, commit with why/requirements/behavior/validation, then merge `--no-ff`. Rerun integration checks. If a check is unavailable, preserve the branch without claiming verified frontend behavior.

Conventional subject: `feat(pos): add itemized print-order review`. Body includes Why, Requirement, Behavior, Validation and Limit/Impact where relevant. Changes and corrections get separate commits. Revert integrated changes with a new `revert` commit; never rewrite shared history.

Only the owner can approve integration to main, remotes, pushes, deployments, or remote protections. Local review/checks do not simulate enforceable remote protection.

Git ownership differs under the sandbox, so use `git -c safe.directory=C:/Users/HARSHANA/Desktop/POS_SYS_WS ...`; never change global safe.directory. `.git` writes need the native execution permission override. Local author: Codex Automation <codex@local.invalid>, distinct from the preexisting global human identity.

Audit artifacts are chronological. Each next audit commit records earlier implementation/merge hashes, avoiding impossible self-referential hashes. The final audit commit is discoverable with `git log`.
