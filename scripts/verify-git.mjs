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
if (git("rev-parse", "main") !== git("rev-list", "--max-parents=0", "main"))
  throw new Error("main no longer retains the initial baseline");
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
  `Verified ${branches.length} retained branches; topic references registered and integrated; main remains the root baseline.`,
);
console.log(`develop ${git("rev-parse", "develop")}`);
console.log(`Working tree: ${git("status", "--short") || "clean"}`);
