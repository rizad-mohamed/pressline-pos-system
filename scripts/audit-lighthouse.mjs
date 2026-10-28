import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";

// Lighthouse is an optional audit tool, installed outside the application graph.
const [modulePath, phase = "final"] = process.argv.slice(2);
if (!modulePath || !["baseline", "pre-cleanup", "final"].includes(phase))
  throw new Error(
    "Supply the installed Lighthouse core/index.js path and an audit phase.",
  );
const moduleURL = pathToFileURL(resolve(modulePath));
const { default: lighthouse } = await import(moduleURL.href);
const { default: desktopConfig } = await import(
  new URL("./config/desktop-config.js", moduleURL).href
);
const baseURL = process.env.PRESSLINE_AUDIT_URL ?? "http://127.0.0.1:3001";
const url = new URL(baseURL);
if (
  url.protocol !== "http:" ||
  !["127.0.0.1", "localhost"].includes(url.hostname)
)
  throw new Error("Audit only a loopback fictional-data production server.");
const dir = "docs/verification/optimization";
await mkdir(dir, { recursive: true });
await mkdir(".local", { recursive: true });
const context = await chromium.launchPersistentContext(
  `.local/lighthouse-${phase}`,
  {
    args: [
      "--remote-debugging-address=127.0.0.1",
      "--remote-debugging-port=9223",
    ],
    headless: true,
    timezoneId: "Asia/Colombo",
  },
);
try {
  const page = context.pages()[0];
  await page.goto(`${baseURL}/login`);
  await page.getByRole("button", { name: /Demo Administrator/ }).click();
  await page.waitForURL("**/dashboard");
  const samples = [];
  for (const preset of ["mobile", "desktop"]) {
    for (const route of ["login", "pos", "dashboard", "reports"]) {
      const { lhr, report } = await lighthouse(
        `${baseURL}/${route}`,
        {
          port: 9223,
          output: ["json", "html"],
          logLevel: "error",
          disableStorageReset: true,
          onlyCategories: [
            "performance",
            "accessibility",
            "best-practices",
            "seo",
          ],
        },
        preset === "desktop" ? desktopConfig : undefined,
      );
      if (
        lhr.runtimeError ||
        lhr.configSettings.formFactor !== preset ||
        new URL(lhr.finalDisplayedUrl).pathname !== `/${route}`
      )
        throw new Error(
          `Invalid ${preset}/${route} audit; inspect runtime, profile and navigation.`,
        );
      const stem = `${phase}-lighthouse-${preset}-${route}`;
      await writeFile(`${dir}/${stem}.json.gz`, gzipSync(report[0]));
      await writeFile(`.local/${stem}.html`, report[1]);
      const sample = {
        preset,
        route,
        lighthouseVersion: lhr.lighthouseVersion,
        requestedUrl: lhr.requestedUrl,
        finalDisplayedUrl: lhr.finalDisplayedUrl,
        settings: lhr.configSettings,
        scores: Object.fromEntries(
          Object.entries(lhr.categories).map(([key, value]) => [
            key,
            Math.round(value.score * 100),
          ]),
        ),
        metrics: Object.fromEntries(
          [
            "largest-contentful-paint",
            "total-blocking-time",
            "cumulative-layout-shift",
            "first-contentful-paint",
          ].map((key) => [key, lhr.audits[key].numericValue]),
        ),
        failedAudits: Object.values(lhr.audits)
          .filter(
            (a) =>
              a.score !== null &&
              a.score < 1 &&
              a.scoreDisplayMode !== "informative",
          )
          .map((a) => ({
            id: a.id,
            title: a.title,
            score: a.score,
            displayValue: a.displayValue,
          })),
      };
      samples.push(sample);
      console.log(
        JSON.stringify({
          preset,
          route,
          scores: sample.scores,
          metrics: sample.metrics,
        }),
      );
    }
  }
  await writeFile(
    `${dir}/${phase}-lighthouse-summary.json`,
    JSON.stringify(
      {
        method:
          "Lighthouse navigation on a separately managed Next production server, account primed, official mobile defaults and desktop configuration. Simulated throttling; local lab samples, not field INP or availability evidence. Full reports are gzip JSON; HTML stays in .local.",
        samples,
      },
      null,
      2,
    ),
  );
} finally {
  await context.close();
}
