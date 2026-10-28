import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { enterDemo } from "./followup-helpers";
import { expectReadableCards } from "./card-readability";

for (const route of [
  "dashboard",
  "orders",
  "jobs",
  "customers",
  "inventory",
  "pricing",
  "transfers",
  "settings",
]) {
  test(`phone ${route} cards preserve desktop statuses and values without sideways scrolling`, async ({
    page,
  }) => {
    await enterDemo(page, /Demo Administrator/);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/${route}`);
    const table = page.locator(".mobile-cards").first();
    await expect(table).toBeVisible();
    const rows = table.locator("tbody tr");
    const expected = await rows.allTextContents();
    for (const width of [320, 390, 430]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(rows).toHaveText(expected);
      await expect(rows.first()).toHaveCSS("display", "grid");
      for (const badge of await table.locator("tbody .badge").all()) {
        const box = await badge.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      }
      expect(
        await table.evaluate((el) => el.scrollWidth - el.clientWidth),
      ).toBeLessThanOrEqual(1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
    await page.setViewportSize({ width: 820, height: 1180 });
    await expect(rows.first()).toHaveCSS("display", "table-row");
    await page.setViewportSize({ width: 320, height: 900 });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    await page.evaluate(() => document.fonts.ready);
    await expectReadableCards(table);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "";
    });
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  });
}

test("phone order cards update independent production and payment states after a local action", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterDemo(page, /Branch 1 cashier/);
  await page.goto("/orders");
  const row = page
    .locator(".mobile-cards tbody tr")
    .filter({ hasText: "PL-1012" });
  await expect(row.locator('[data-label="Production"]')).toContainText("New");
  await row
    .getByRole("button", { name: "View order PL-1012", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Order PL-1012",
    exact: true,
  });
  await dialog.getByRole("button", { name: /Start production/ }).click();
  await expect(dialog.getByTestId("production-status")).toContainText(
    "In Progress",
  );
  await dialog
    .getByRole("button", { name: "Record payment", exact: true })
    .click();
  await page.getByLabel("Payment amount (LKR)", { exact: true }).fill("100.00");
  await page
    .getByRole("button", { name: "Record simulated payment", exact: true })
    .click();
  await expect(dialog.getByTestId("detail-balance")).toContainText("1,130.00");
  await dialog
    .getByRole("button", { name: "Close drawer", exact: true })
    .click();
  await expect(row.locator('[data-label="Production"]')).toContainText(
    "In Progress",
  );
  await expect(row.locator('[data-label="Payment"]')).toContainText("Partial");
  await expect(row.locator('[data-label="Balance"]')).toContainText("1,130.00");
  await page.reload();
  await expect(row.locator('[data-label="Production"]')).toContainText(
    "In Progress",
  );
  await expect(row.locator('[data-label="Payment"]')).toContainText("Partial");
  await expect(row.locator('[data-label="Balance"]')).toContainText("1,130.00");
});
