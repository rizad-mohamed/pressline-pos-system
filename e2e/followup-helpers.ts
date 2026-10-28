import { expect, type Page } from "@playwright/test";
export async function enterDemo(page: Page, name: RegExp) {
  await page.goto("/login");
  await page.getByRole("button", { name }).click();
  await page.waitForURL("**/dashboard");
}
export async function setupBannerCustomer(page: Page) {
  await enterDemo(page, /Demo Administrator/);
  await page.goto("/customers");
  await page.getByRole("button", { name: "Add customer", exact: true }).click();
  await page
    .getByLabel("Customer kind", { exact: true })
    .selectOption("Business");
  await page
    .getByLabel("Customer / company name", { exact: true })
    .fill("ABC Company");
  await page
    .getByRole("button", { name: "Save customer", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("link", { name: "ABC Company", exact: true }).click();
  await page.waitForURL("**/customers/cust-*");
  const customerId = new URL(page.url()).pathname.split("/").at(-1)!;
  await page.goto("/pricing");
  await page.getByRole("button", { name: "Add service", exact: true }).click();
  await page
    .getByLabel("Service name", { exact: true })
    .fill("Banner Printing");
  await page
    .getByLabel("Service code", { exact: true })
    .fill("BANNER-FICTIONAL");
  await page.getByLabel("Unit price (LKR)", { exact: true }).fill("3500.00");
  await page
    .getByLabel("Short description (optional)", { exact: true })
    .fill("Fictional banner job; material use is confirmed separately.");
  await page
    .getByRole("button", { name: "Add material suggestion", exact: true })
    .click();
  await page
    .getByLabel("Recipe material 1", { exact: true })
    .selectOption("banner-roll");
  await page.getByLabel("Recipe quantity 1 (rolls)", { exact: true }).fill("2");
  await page.getByRole("button", { name: "Save service", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  return { customerId };
}
export async function createBannerOrder(page: Page) {
  await enterDemo(page, /Branch 1 cashier/);
  await page.goto("/pos");
  await page
    .getByRole("button", { name: "Find saved customer", exact: true })
    .click();
  await page.getByLabel("Search saved customers", { exact: true }).fill("ABC");
  await page.getByText("Quick view · ABC Company", { exact: true }).click();
  await expect(page.getByText(/At this branch: 0 orders/)).toBeVisible();
  await page
    .getByRole("button", { name: "Select customer ABC Company", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Configure Banner Printing", exact: true })
    .click();
  await expect(page.getByLabel("Quantity (jobs)", { exact: true })).toHaveValue(
    "1",
  );
  await expect(page.getByLabel("Paper size", { exact: true })).toHaveCount(0);
  await expect(page.getByTestId("order-total")).toContainText("3,500.00");
  await page
    .getByLabel("Simulated advance (LKR)", { exact: true })
    .fill("1000.00");
  await page.getByRole("button", { name: "Review order", exact: true }).click();
  await page
    .getByRole("button", { name: "Save demo order", exact: true })
    .click();
  await page.getByRole("link", { name: "Open order", exact: true }).click();
  await page.waitForURL(/\/orders\/PL-\d+$/);
  return new URL(page.url()).pathname.split("/").at(-1)!;
}
