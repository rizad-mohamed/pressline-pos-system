import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
const git = (...args) =>
  execFileSync(
    "git",
    ["-c", `safe.directory=${process.cwd().replaceAll("\\", "/")}`, ...args],
    { encoding: "utf8" },
  ).trim();
const branches = git("branch", "--format=%(refname:short)").split("\n");
const register = readFileSync("docs/feature-register.md", "utf8");
const main = git("rev-parse", "main");
const baseline = git("rev-list", "--max-parents=0", "main");
if (main !== baseline) {
  // A released main must match the observed remote; never certify an unpushed tip.
  if (main !== git("rev-parse", "refs/remotes/origin/main"))
    throw new Error("Released main does not match the fetched origin/main.");
}
for (const branch of branches.filter((b) => b.includes("/"))) {
  if (!register.includes(branch))
    throw new Error(`Missing feature register record: ${branch}`);
  execFileSync("git", [
    "-c",
    `safe.directory=${process.cwd().replaceAll("\\", "/")}`,
    "merge-base",
    "--is-ancestor",
    branch,
    "develop",
  ]);
}
console.log(
  `Verified ${branches.length} retained branches; topic references registered and integrated; main ${main === baseline ? "retains the root baseline" : "matches fetched origin/main"}.`,
);
console.log(`develop ${git("rev-parse", "develop")}`);
console.log(`Working tree: ${git("status", "--short") || "clean"}`);
