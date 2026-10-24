import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const axeSource = readFileSync(
  createRequire(import.meta.url).resolve("axe-core/axe.min.js"),
  "utf8",
);
test("POS invalid quantity explains the correction and preserves editable lines", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /Branch 1 cashier/ }).click();
  await page.goto("/pos");
  await page.getByLabel("Quantity (printed sheets)").fill("0");
  await page.getByLabel("Quantity (printed sheets)").press("Tab");
  await expect(
    page.getByText("Enter at least 1 sheet.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Review order", exact: true }),
  ).toBeDisabled();
  await page.getByLabel("Quantity (printed sheets)").fill("2");
  await page
    .getByRole("button", { name: "Add print item", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Remove item 2", exact: true })
    .click();
  await expect(page.getByLabel("Quantity (printed sheets)")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Undo item removal", exact: true })
    .click();
  await expect(page.getByLabel("Quantity (printed sheets)")).toHaveCount(2);
});
for (const width of [360, 390, 768, 1024, 1280, 1440])
  test(`workspace reflows at ${width} CSS pixels`, async ({ page }, info) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/login");
    await page.getByRole("button", { name: /Demo Administrator/ }).click();
    for (const [route, title] of [
      ["dashboard", "Branch overview"],
      ["pos", "Create a print order"],
      ["reports", "Reports"],
    ]) {
      await page.goto(`/${route}`);
      await expect(
        page.getByRole("heading", { name: title, exact: true }),
      ).toBeVisible();
      const overflow = await page.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(
        overflow.scroll,
        `${route} overflows at ${width}`,
      ).toBeLessThanOrEqual(overflow.width + 1);
      await page.screenshot({
        path: info.outputPath(`${route}-${width}.png`),
        fullPage: true,
        animations: "disabled",
      });
    }
  });
test("200 percent text resizing retains the dashboard within the viewport", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/login");
  await page.getByRole("button", { name: /Demo Administrator/ }).click();
  await expect(
    page.getByRole("heading", { name: "Branch overview" }),
  ).toBeVisible();
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(1441);
  await page.screenshot({
    path: info.outputPath("dashboard-200-percent.png"),
    fullPage: true,
    animations: "disabled",
  });
});
test("assembled routes have no detected WCAG A/AA axe violations or browser exceptions", async ({
  page,
}, info) => {
  test.setTimeout(240000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/login");
  let result = await new AxeBuilder({ page, axeSource })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.screenshot({
    path: info.outputPath("login-1440.png"),
    fullPage: true,
    animations: "disabled",
  });
  await page.getByRole("button", { name: /Demo Administrator/ }).click();
  for (const route of [
    "dashboard",
    "pos",
    "orders",
    "jobs",
    "inventory",
    "transfers",
    "pricing",
    "reports",
    "sms",
    "settings",
    "profile",
  ]) {
    await page.goto(`/${route}`);
    await expect(page.locator("main h1")).toBeVisible();
    result = await new AxeBuilder({ page, axeSource })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(result.violations, route).toEqual([]);
    await page.screenshot({
      path: info.outputPath(`${route}-1440.png`),
      fullPage: true,
      animations: "disabled",
    });
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      `${route} mobile overflow`,
    ).toBeLessThanOrEqual(391);
    await page.screenshot({
      path: info.outputPath(`${route}-390.png`),
      fullPage: true,
      animations: "disabled",
    });
    await page.setViewportSize({ width: 1440, height: 1000 });
  }
  expect(errors).toEqual([]);
});
