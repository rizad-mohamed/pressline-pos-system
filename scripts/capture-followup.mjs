import { chromium, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import {
  setupBannerCustomer,
  createBannerOrder,
  enterDemo,
} from "../e2e/followup-helpers.ts";
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

// Run only against a local, already-started build. Isolated browser data is fictional.
const baseURL = process.env.PRESSLINE_VISUAL_URL ?? "http://127.0.0.1:3001";
if (!["127.0.0.1", "localhost"].includes(new URL(baseURL).hostname))
  throw new Error("Use a local Pressline demo URL.");
const dir = "docs/visual-evidence/followup";
await mkdir(dir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
  baseURL,
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const errors = [],
  externalRuntime = [],
  captures = [],
  taste = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("request", (r) => {
  if (
    r.url().startsWith("http") &&
    new URL(r.url()).origin !== new URL(baseURL).origin
  )
    externalRuntime.push(r.url());
});
async function shot(name, fullPage = true) {
  await page.evaluate(() => document.fonts.ready);
  if (await page.getByRole("dialog").count()) {
    // Wait for the real modal's stable position after a viewport change.
    await page
      .getByRole("button", { name: "Close drawer", exact: true })
      .focus();
    await page
      .getByRole("button", { name: "Close drawer", exact: true })
      .scrollIntoViewIfNeeded();
  }
  await page.screenshot({
    path: `${dir}/${name}.png`,
    fullPage,
    animations: "disabled",
  });
  captures.push({
    name,
    viewport: page.viewportSize(),
    path: new URL(page.url()).pathname,
  });
  console.log(`Captured ${name}`);
}
async function widths(name, fullPage = true, before) {
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    if (before) await before();
    await shot(`${name}-${width}`, fullPage);
  }
}
try {
  const { customerId } = await setupBannerCustomer(page);
  await page.goto("/pricing");
  await page
    .getByRole("button", { name: "Edit service Banner Printing", exact: true })
    .click();
  await widths("service-setup", false);
  await page.getByRole("button", { name: "Close drawer", exact: true }).click();
  await enterDemo(page, /Branch 1 cashier/);
  await page.goto("/pos");
  await page
    .getByRole("button", { name: "Find saved customer", exact: true })
    .click();
  await page.getByLabel("Search saved customers", { exact: true }).fill("ABC");
  await page.getByText("Quick view · ABC Company", { exact: true }).click();
  await widths("customer-selection", false);
  await page.getByRole("button", { name: "Close drawer", exact: true }).click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  const orderId = await createBannerOrder(page);
  await page
    .getByRole("button", { name: "Edit material plan", exact: true })
    .click();
  await page.getByLabel("Actual quantity (rolls)", { exact: true }).fill("5");
  await page
    .getByRole("button", { name: "Save plan · no deduction", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Review material usage", exact: true })
    .click();
  await widths("material-confirmation", false);
  await page.getByRole("checkbox", { name: /I reviewed the branch/ }).check();
  await page
    .getByRole("button", {
      name: "Confirm & record material usage",
      exact: true,
    })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await widths("material-history", false, () =>
    page
      .getByRole("heading", { name: "Materials for this job", exact: true })
      .scrollIntoViewIfNeeded(),
  );
  await page
    .getByRole("button", { name: "Record payment", exact: true })
    .click();
  await page.getByLabel("Payment amount (LKR)", { exact: true }).fill("500");
  await page
    .getByRole("button", { name: "Record simulated payment", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto(`/customers/${customerId}`);
  await expect(page.getByTestId("customer-outstanding")).toContainText(
    "2,000.00",
  );
  await widths("customer-account");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`/pos?customer=${customerId}`);
  await page
    .getByRole("button", { name: "Configure Banner Printing", exact: true })
    .click();
  await widths("pos-managed-banner", false, () =>
    page
      .getByLabel("Quantity (jobs)", { exact: true })
      .scrollIntoViewIfNeeded(),
  );
  await enterDemo(page, /Demo Administrator/);
  await page.goto("/inventory");
  await expect(
    page.getByRole("heading", { name: "Inventory", exact: true }),
  ).toBeVisible();
  await widths("inventory-movements");
  await page.goto(`/orders/${orderId}`);
  await page
    .getByRole("button", { name: "Correct recorded usage", exact: true })
    .click();
  await page
    .getByLabel("Correction reason", { exact: true })
    .fill("Fictional review of an erroneously recorded quantity");
  await widths("correction-review", false);
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Close drawer", exact: true }).click();
  const ledger = await page.evaluate(() => {
    const d = JSON.parse(localStorage.getItem("pressline.demo.v1"));
    return {
      bannerStock: d.items.find((i) => i.id === "banner-roll").quantities,
      usageCount: d.usages.length,
      orderTotalCents: d.orders[0].totalCents,
      paidCents: d.payments
        .filter((p) => p.orderId === d.orders[0].id)
        .reduce((n, p) => n + p.amountCents, 0),
      movementIds: d.usages[0].lines.map((l) => l.movementId),
    };
  });
  for (const kind of ["receipt", "job"]) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`/print/${kind}/${orderId}`);
    await expect(page.locator(".print-paper")).toBeVisible();
    await page.emulateMedia({ media: "print" });
    await shot(`${kind}-1440`);
    await page.pdf({
      path: `${dir}/${kind}.pdf`,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    await page.emulateMedia({ media: "screen" });
  }
  for (const route of [
    "customers",
    `customers/${customerId}`,
    "pricing",
    "pos",
    `orders/${orderId}`,
    "inventory",
  ])
    for (const width of [1440, 768, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`/${route}`);
      await expect(page.locator("main h1")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const m = await page.evaluate(probe),
        a = await page.evaluate(app),
        l = await page.evaluate(layout);
      // Retain the established signed-in bridge and documented small-title/header exceptions.
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
  await writeFile(
    `${dir}/capture-evidence.json`,
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        baseURL,
        captures,
        ledger,
        errors,
        externalRuntime,
        taste,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    JSON.stringify(
      {
        captures: captures.length,
        ledger,
        errors,
        externalRuntime,
        tasteFindings: taste.filter((r) => r.findings.length),
      },
      null,
      2,
    ),
  );
  if (
    errors.length ||
    externalRuntime.length ||
    taste.some((r) => r.findings.some((f) => f.level === "FAIL"))
  )
    process.exitCode = 1;
} finally {
  await browser.close();
}
