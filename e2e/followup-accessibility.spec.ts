import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import {
  setupBannerCustomer,
  createBannerOrder,
  enterDemo,
} from "./followup-helpers";
const axeSource = readFileSync(
  createRequire(import.meta.url).resolve("axe-core/axe.min.js"),
  "utf8",
);
async function prime(page: Page) {
  const { customerId } = await setupBannerCustomer(page),
    orderId = await createBannerOrder(page);
  await page
    .getByRole("button", { name: "Review material usage", exact: true })
    .click();
  await page.getByRole("checkbox", { name: /I reviewed the branch/ }).check();
  await page
    .getByRole("button", {
      name: "Confirm & record material usage",
      exact: true,
    })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await enterDemo(page, /Demo Administrator/);
  return { customerId, orderId };
}
async function contained(page: Page, label: string) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
    label,
  ).toBeLessThanOrEqual(await page.evaluate(() => innerWidth + 1));
  for (const el of await page
    .locator('[role="dialog"], [role="dialog"] .sheet-body')
    .all()) {
    const size = await el.evaluate((el) => ({
      width: el.clientWidth,
      scroll: el.scrollWidth,
    }));
    expect(size.scroll, `${label} drawer containment`).toBeLessThanOrEqual(
      size.width + 1,
    );
  }
}
test("customer accounts, service catalogue and recorded jobs reflow at nine required widths", async ({
  page,
}, info) => {
  test.setTimeout(180000);
  const { customerId, orderId } = await prime(page);
  for (const width of [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "customers",
      `customers/${customerId}`,
      "pricing",
      `orders/${orderId}`,
    ]) {
      await page.goto(`/${route}`);
      await expect(page.locator("main h1")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await contained(page, `${route} at ${width}`);
      for (const table of await page.locator(".table-scroll").all())
        if (await table.evaluate((el) => el.scrollWidth > el.clientWidth)) {
          await expect(table).toHaveAttribute("tabindex", "0");
          await table.focus();
          await table.press("ArrowRight");
          await expect
            .poll(() => table.evaluate((el) => el.scrollLeft))
            .toBeGreaterThan(0);
        }
    }
    await page.goto("/pricing");
    await page
      .getByRole("button", { name: "Add service", exact: true })
      .click();
    await contained(page, `service editor ${width}`);
    const save = page.getByRole("button", {
      name: "Save service",
      exact: true,
    });
    const box = await save.boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(900);
    await page
      .getByRole("button", { name: "Close drawer", exact: true })
      .click();
    if (width === 390 || width === 1440)
      await page.screenshot({
        path: info.outputPath(`services-${width}.png`),
        fullPage: true,
      });
  }
});
test("new customer, service and material dialogs have no detected tagged accessibility violations", async ({
  page,
}) => {
  test.setTimeout(240000);
  page.on("dialog", (d) => d.accept());
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const { customerId, orderId } = await prime(page);
  async function scan(label: string) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await contained(page, `${label} ${width}`);
      const result = await new AxeBuilder({ page, axeSource })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(result.violations, `${label} ${width}`).toEqual([]);
    }
  }
  await page.goto("/customers");
  await expect(page.locator("main h1")).toBeVisible();
  await scan("customer directory");
  await page.getByRole("button", { name: "Add customer", exact: true }).click();
  await scan("customer editor");
  await page.getByRole("button", { name: "Close drawer", exact: true }).click();
  await page.goto(`/customers/${customerId}`);
  await expect(page.locator("main h1")).toBeVisible();
  await scan("customer account history");
  await page.goto("/pricing");
  await page.getByRole("button", { name: "Add service", exact: true }).click();
  await page
    .getByRole("button", { name: "Add material suggestion", exact: true })
    .click();
  await scan("service editor and recipe");
  await page.getByRole("button", { name: "Close drawer", exact: true }).click();
  await page.goto("/pos");
  await page
    .getByRole("button", { name: "Find saved customer", exact: true })
    .click();
  await scan("POS customer selector");
  await page.getByRole("button", { name: "Close drawer", exact: true }).click();
  await page.goto(`/orders/${orderId}`);
  await expect(page.locator("main h1")).toBeVisible();
  await scan("recorded material history");
  await page
    .getByRole("button", { name: "Plan additional usage", exact: true })
    .click();
  await page.getByRole("button", { name: "Add material", exact: true }).click();
  await scan("material plan editor");
  await page
    .getByRole("button", { name: "Save plan · no deduction", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Review material usage", exact: true })
    .click();
  await scan("material impact confirmation");
  await page.getByRole("button", { name: "Close drawer", exact: true }).click();
  await page
    .getByRole("button", { name: "Correct recorded usage", exact: true })
    .click();
  await scan("compensating correction");
  expect(errors).toEqual([]);
});
test("long multilingual customer content, 200 percent text, reduced motion and dirty focus recovery work", async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterDemo(page, /Demo Administrator/);
  await page.goto("/customers");
  await page.getByRole("button", { name: "Add customer", exact: true }).click();
  await page
    .getByRole("button", { name: "Save customer", exact: true })
    .click();
  await expect(
    page.getByLabel("Customer / company name", { exact: true }),
  ).toBeFocused();
  const name = "FictionalCompany".repeat(6);
  await page.getByLabel("Customer / company name", { exact: true }).fill(name);
  await page
    .getByLabel("Internal customer notes (optional)", { exact: true })
    .fill("මුද්‍රණ සේවාව / அச்சிடுதல் · fictional private note");
  await page
    .getByRole("button", { name: "Save customer", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("link", { name, exact: true }).click();
  await page.waitForURL("**/customers/cust-*");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await contained(page, "customer 200 percent text");
  const edit = page.getByRole("button", { name: "Edit customer", exact: true });
  await edit.click();
  await contained(page, "customer editor 200 percent text");
  await page.getByRole("button", { name: "Close drawer", exact: true }).click();
  await expect(edit).toBeFocused();
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "";
  });
  await page.setViewportSize({ width: 320, height: 844 });
  await edit.click();
  await page
    .getByLabel("Customer / company name", { exact: true })
    .fill("Unsaved name");
  page.once("dialog", (d) => d.dismiss());
  await page.getByRole("dialog").press("Escape");
  await expect(page.getByRole("dialog")).toBeVisible();
  page.once("dialog", (d) => d.accept());
  await page.getByRole("dialog").press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(edit).toBeFocused();
  await page
    .getByRole("link", { name: "New order for this customer", exact: true })
    .click();
  await page.waitForURL("**/pos?customer=*");
  await expect(
    page.getByLabel("Customer name (optional)", { exact: true }),
  ).toHaveValue(name);
  await contained(page, "long selected customer POS");
  await page
    .getByRole("button", { name: "Change customer", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await contained(page, "customer selection 320px");
  expect(
    await dialog.evaluate((el) =>
      Number.parseFloat(getComputedStyle(el).animationDuration),
    ),
  ).toBeLessThan(0.01);
  await dialog.press("Escape");
  await expect(
    page.getByRole("button", { name: "Change customer", exact: true }),
  ).toBeFocused();
});
