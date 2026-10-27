import { chromium } from "playwright";
import { mkdir, writeFile, readFile, copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  probe,
  app,
  layout,
} from "../.agents/skills/design-taste-frontend/scripts/lib/probe.mjs";
import {
  judge,
  judgeApp,
  judgeLayout,
  APP_SKIP,
} from "../.agents/skills/design-taste-frontend/scripts/lib/rules.mjs";
const dir = "docs/visual-evidence/mobile";
await mkdir(dir, { recursive: true });
await mkdir(".local/mobile-final", { recursive: true });
const browser = await chromium.launch();
const captures = [],
  taste = [],
  errors = [],
  external = [];
const routes = [
  "dashboard",
  "pos",
  "orders",
  "customers",
  "jobs",
  "inventory",
  "transfers",
  "pricing",
  "reports",
  "sms",
  "settings",
  "profile",
];
async function hash(path) {
  return createHash("sha256")
    .update(await readFile(path))
    .digest("hex");
}
for (const width of [390, 820, 1280, 1440, 1920]) {
  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:3001",
    viewport: { width, height: 900 },
    timezoneId: "Asia/Colombo",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("request", (r) => {
    if (
      r.url().startsWith("http") &&
      new URL(r.url()).origin !== "http://127.0.0.1:3001"
    )
      external.push(r.url());
  });
  await page.clock.setFixedTime(new Date("2026-10-25T06:30:00Z"));
  await page.goto("/login");
  await page.getByRole("button", { name: /Demo Administrator/ }).click();
  await page.waitForURL("**/dashboard");
  for (const route of routes) {
    await page.goto(`/${route}`);
    await page.getByRole("heading", { level: 1 }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    const filename = `${route}-${width}.png`,
      raw = `.local/mobile-final/${filename}`;
    await page.screenshot({ path: raw, animations: "disabled" });
    captures.push({
      filename,
      path: new URL(page.url()).pathname,
      width,
      height: 900,
      sha256: await hash(raw),
    });
    if (
      width === 390 ||
      width === 820 ||
      (width === 1440 && ["dashboard", "pos", "inventory"].includes(route))
    )
      await copyFile(raw, `${dir}/${filename}`);
    if ([390, 820, 1440].includes(width)) {
      const m = await page.evaluate(probe),
        a = await page.evaluate(app),
        l = await page.evaluate(layout);
      const findings = [
        ...judge(m, { width }).filter(
          (f) =>
            !APP_SKIP.has(f.id) &&
            f.id !== "small-title" &&
            f.id !== "no-title",
        ),
        ...judgeApp(a, m, { width }),
        ...judgeLayout(l, { width }).filter(
          (f) =>
            !APP_SKIP.has(f.id) &&
            f.id !== "small-title" &&
            f.id !== "no-title",
        ),
      ];
      taste.push({ route, width, findings });
    }
  }
  if (width === 1440) {
    const id = await page.evaluate(
      () => JSON.parse(localStorage.getItem("pressline.demo.v1")).orders[0].id,
    );
    for (const kind of ["receipt", "job"]) {
      await page.goto(`/print/${kind}/${id}`);
      await page.locator(".print-paper").waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.emulateMedia({ media: "print" });
      await page.screenshot({
        path: `${dir}/${kind}-print.png`,
        fullPage: true,
      });
      await page.pdf({
        path: `${dir}/${kind}.pdf`,
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
      });
      await page.emulateMedia({ media: "screen" });
    }
  }
  if (width === 390) {
    async function shot(name) {
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: `${dir}/${name}.png`,
        animations: "disabled",
      });
    }
    await page
      .getByRole("button", { name: "More navigation", exact: true })
      .click();
    await page
      .getByRole("dialog", { name: "More navigation", exact: true })
      .waitFor();
    await shot("more-admin-390");
    await page.keyboard.press("Escape");
    await page.goto("/customers");
    await page
      .getByRole("button", { name: "Add customer", exact: true })
      .click();
    await shot("customer-editor-390");
    await page.keyboard.press("Escape");
    await page.goto("/pricing");
    await page
      .getByRole("button", { name: "Add service", exact: true })
      .click();
    await shot("service-editor-390");
    await page.keyboard.press("Escape");
    await page.goto("/inventory");
    await page
      .getByRole("button", { name: "Add material", exact: true })
      .click();
    await shot("material-editor-390");
    await page.keyboard.press("Escape");
    await page.goto("/pos");
    await page
      .getByRole("button", { name: "View order (1)", exact: true })
      .click();
    await shot("current-order-390");
    await page
      .getByRole("dialog", { name: "Current order", exact: true })
      .getByRole("button", { name: "Review order", exact: true })
      .click();
    await shot("review-order-390");
    await page.keyboard.press("Escape");
    await page.goto("/login");
    await page.getByRole("button", { name: /Branch 1 cashier/ }).click();
    await page.waitForURL("**/dashboard");
    await shot("dashboard-cashier-390");
    await page
      .getByRole("button", { name: "More navigation", exact: true })
      .click();
    await shot("more-cashier-390");
  }
  await context.close();
  console.log(`Captured and inspected width ${width}`);
}
await browser.close();
await writeFile(
  ".local/mobile-final/capture.json",
  JSON.stringify({ captures, errors, external, taste }, null, 2),
);
await writeFile(
  `${dir}/capture-evidence.json`,
  JSON.stringify(
    {
      clock: "2026-10-25T06:30:00Z, matching baseline",
      captures,
      errors,
      external,
      taste,
    },
    null,
    2,
  ) + "\n",
);
const source = execFileSync(
  process.execPath,
  [
    ".agents/skills/design-taste-frontend/scripts/lint.mjs",
    "src",
    "--app",
    "--json",
  ],
  { encoding: "utf8" },
);
await writeFile(`${dir}/taste-source.json`, source);
for (const name of [
  "dashboard-390",
  "pos-390",
  "inventory-390",
  "inventory-820",
  "pos-1440",
]) {
  try {
    await copyFile(
      `.local/mobile-before/${name}.png`,
      `${dir}/before-${name}.png`,
    );
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
}
console.log(
  JSON.stringify({
    captures: captures.length,
    errors,
    external,
    tasteFindings: taste.filter((r) => r.findings.length),
    sourceFindings: JSON.parse(source).findings.reduce(
      (a, f) => ((a[f.level] = (a[f.level] ?? 0) + 1), a),
      {},
    ),
  }),
);
if (errors.length || external.length) process.exitCode = 1;
