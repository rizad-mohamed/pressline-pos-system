import { chromium, webkit } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";

const phase = process.argv[2];
if (!["before", "after"].includes(phase))
  throw Error(
    "Supply before or after; this records observations, not a PASS gate.",
  );
const baseURL = process.env.PRESSLINE_VISUAL_URL ?? "http://127.0.0.1:3001";
const url = new URL(baseURL);
if (
  url.protocol !== "http:" ||
  !["127.0.0.1", "localhost"].includes(url.hostname)
)
  throw Error("Measure only a loopback fictional-data production frontend.");
const results = [];
for (const [engine, kind] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await kind.launch();
  try {
    const page = await browser.newPage({
      baseURL,
      viewport: { width: 390, height: 844 },
    });
    await page.goto("/login");
    await page.getByRole("button", { name: /Demo Administrator/ }).click();
    await page.waitForURL("**/dashboard");
    const requests = [],
      failed = [],
      pageErrors = [];
    page.on("request", (request) =>
      requests.push({
        url: request.url(),
        prefetch: request.headers()["next-router-prefetch"] === "1",
      }),
    );
    page.on("requestfailed", (request) =>
      failed.push({ url: request.url(), error: request.failure()?.errorText }),
    );
    page.on("pageerror", (error) => pageErrors.push(error.message));
    const resources = [];
    for (const route of [
      "dashboard",
      "orders",
      "customers",
      "inventory",
      "reports",
      "pos",
    ]) {
      await page.goto(`/${route}`);
      await page.getByRole("heading", { level: 1 }).waitFor();
      await page.evaluate(() => document.fonts.ready);
      // Fixed observation interval in both phases; not a workflow-test delay.
      await page.waitForTimeout(750);
      resources.push({
        route,
        entries: await page.evaluate(() =>
          performance.getEntriesByType("resource").map((resource) => ({
            name: resource.name,
            transfer: resource.transferSize,
            bytes: resource.encodedBodySize,
            duration: resource.duration,
          })),
        ),
      });
    }
    results.push({ engine, requests, failed, pageErrors, resources });
  } finally {
    await browser.close();
  }
}
const dir = "docs/verification/optimization";
await mkdir(dir, { recursive: true });
await writeFile(
  `${dir}/navigation-${phase}.json.gz`,
  gzipSync(
    JSON.stringify(
      { phase, observationMs: 750, viewport: 390, routes: 6, results },
      null,
      2,
    ),
  ),
);
console.table(
  results.map((result) => ({
    engine: result.engine,
    requestEvents: result.requests.length,
    speculativeRequests: result.requests.filter((request) => request.prefetch)
      .length,
    failedRequests: result.failed.length,
    pageErrors: result.pageErrors.length,
  })),
);
