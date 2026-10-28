import { expect, test } from "@playwright/test";
import { expectReadableCards } from "./card-readability";
import {
  createBannerOrder,
  enterDemo,
  setupBannerCustomer,
} from "./followup-helpers";

test("mobile customer history retains statuses, balances and accepted snapshots after a long-name archive", async ({
  page,
}, testInfo) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 1440, height: 900 });
  const { customerId } = await setupBannerCustomer(page);
  const orderId = await createBannerOrder(page);
  await enterDemo(page, /Demo Administrator/);
  await page.goto(`/customers/${customerId}`);
  const row = page
    .locator(".mobile-cards tbody tr")
    .filter({ hasText: orderId });
  await expect(row.locator('[data-label="Production"]')).toContainText("New");
  await expect(row.locator('[data-label="Payment"]')).toContainText("Partial");
  await expect(row.locator('[data-label="Balance"]')).toContainText("2,500.00");
  const expected = await row.textContent();
  await page
    .getByRole("button", { name: "Edit customer", exact: true })
    .click();
  const longName = "Long customer " + "W".repeat(80);
  await page
    .getByLabel("Customer / company name", { exact: true })
    .fill(longName);
  await page
    .getByRole("button", { name: "Save customer", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.setViewportSize({ width: 320, height: 900 });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "32px";
  });
  await expect(row).toHaveCSS("display", "grid");
  await expectReadableCards(page.locator(".mobile-cards").first());
  await expect(row).toHaveText(expected!);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
  await row.screenshot({
    path: testInfo.outputPath("customer-history-320-enlarged.png"),
  });
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "Archive customer", exact: true })
    .click();
  await expect(page.getByTestId("customer-outstanding")).toContainText(
    "2,500.00",
  );
  await page.goto("/customers");
  await page
    .getByLabel("Customer status", { exact: true })
    .selectOption("archived");
  const customer = page
    .locator(".mobile-cards tbody tr")
    .filter({ hasText: longName });
  await expect(customer.locator('[data-label="Status"]')).toContainText(
    "Archived",
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
  await page.goto(`/orders/${orderId}`);
  await expect(
    page.getByRole("heading", { name: "ABC Company", exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("detail-total")).toContainText("3,500.00");
  await expect(page.getByTestId("detail-balance")).toContainText("2,500.00");
});
