import { test, expect } from "@playwright/test";

test("saved customer management persists and archives without deleting history", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /Demo Administrator/ }).click();
  await page.waitForURL("**/dashboard");
  await page.goto("/customers");
  await page.getByRole("button", { name: "Add customer", exact: true }).click();
  await page
    .getByLabel("Customer kind", { exact: true })
    .selectOption("Business");
  await page
    .getByLabel("Customer / company name", { exact: true })
    .fill("Orchid Print Client · fictional");
  await page
    .getByLabel("Phone (optional)", { exact: true })
    .fill("+44 (7700) 900-123");
  await page
    .getByRole("button", { name: "Save customer", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("link", { name: "Orchid Print Client · fictional", exact: true })
    .click();
  await page.waitForURL("**/customers/cust-*");
  await expect(page.getByTestId("customer-outstanding")).toContainText("0.00");
  await expect(page.getByText("+447700900123", { exact: true })).toBeVisible();
  await page.reload();
  await page
    .getByRole("button", { name: "Edit customer", exact: true })
    .click();
  await page
    .getByLabel("Customer / company name", { exact: true })
    .fill("Orchid Studio · fictional");
  await page
    .getByRole("button", { name: "Save customer", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Orchid Studio · fictional",
      exact: true,
    }),
  ).toBeVisible();
  page.on("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "Archive customer", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Reactivate customer", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "New order for this customer",
      exact: true,
    }),
  ).toHaveCount(0);
  await page.reload();
  await page
    .getByRole("button", { name: "Reactivate customer", exact: true })
    .click();
  await expect(
    page.getByRole("link", {
      name: "New order for this customer",
      exact: true,
    }),
  ).toBeVisible();
});

test("cashier customer creation is optional, keyboard accessible and dirty guarded", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /Branch 1 cashier/ }).click();
  await page.waitForURL("**/dashboard");
  await page.goto("/customers");
  await page.getByRole("button", { name: "Add customer", exact: true }).click();
  await page
    .getByLabel("Customer / company name", { exact: true })
    .fill("Fictional individual");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "Add customer", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Save customer", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("link", { name: "Fictional individual", exact: true })
    .click();
  await page.waitForURL("**/customers/cust-*");
  await expect(
    page.getByText("At this branch", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Edit customer", exact: true }),
  ).toHaveCount(0);
});
