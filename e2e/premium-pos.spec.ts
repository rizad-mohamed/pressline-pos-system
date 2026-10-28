import { test, expect } from "@playwright/test";

async function cashier(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByRole("button", { name: /Branch 1 cashier/ }).click();
  await page.waitForURL("**/dashboard");
  await page.goto("/pos");
}

test("service filters configure existing options and cart controls preserve exact pricing", async ({
  page,
}) => {
  await cashier(page);
  await page
    .getByRole("radio", { name: "Binding & finishing", exact: true })
    .click();
  await expect(page.getByRole("button", { name: /^Configure / })).toHaveCount(
    2,
  );
  await page
    .getByLabel("Search services", { exact: true })
    .fill("not-a-service");
  await expect(
    page.getByRole("heading", { name: "No matching services" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset service filters" }).click();
  await page.getByRole("button", { name: "Configure Bound documents" }).click();
  await expect(
    page.getByLabel("Item description", { exact: true }),
  ).toHaveValue("Bound documents");
  await expect(page.getByLabel("Binding", { exact: true })).toHaveValue(
    "Spiral",
  );
  await expect(page.getByTestId("order-total")).toContainText("165.00");
  await page
    .getByRole("button", { name: "Increase quantity for item 1", exact: true })
    .click();
  await expect(page.getByLabel("Quantity (printed sheets)")).toHaveValue("2");
  await expect(page.getByTestId("order-total")).toContainText("180.00");
  await page.getByRole("button", { name: "Configure Color printing" }).click();
  await expect(
    page.getByLabel("Item description", { exact: true }),
  ).toHaveCount(2);
  await expect(page.getByTestId("order-total")).toContainText("240.00");
  await page
    .getByRole("button", { name: "Remove from order item 2", exact: true })
    .click();
  await expect(page.getByTestId("order-total")).toContainText("180.00");
  await page
    .getByRole("button", { name: "Undo item removal", exact: true })
    .click();
  await expect(page.getByTestId("order-total")).toContainText("240.00");
});

test("empty order is recoverable and remains an empty tab draft after reload", async ({
  page,
}) => {
  await cashier(page);
  await page
    .getByRole("button", { name: "Remove item 1", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "A clean slate." }),
  ).toBeVisible();
  await expect(page.getByTestId("order-total")).toContainText("0.00");
  await expect(
    page.getByRole("button", { name: "Review order", exact: true }),
  ).toBeDisabled();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "A clean slate." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Configure Document printing" })
    .click();
  await expect(
    page.getByLabel("Item description", { exact: true }),
  ).toHaveValue("Document printing");
  await expect(page.getByTestId("order-total")).toContainText("15.00");
});

test("mobile current-order sheet edits, restores focus and opens a single review", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await cashier(page);
  await page
    .getByRole("button", { name: "View order (1)", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Current order", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Edit item 1", exact: true }).click();
  await expect(
    page.getByLabel("Item description", { exact: true }),
  ).toBeFocused();
  await page.getByLabel("Quantity (printed sheets)").fill("10");
  await page
    .getByRole("button", { name: "View order (1)", exact: true })
    .click();
  await page.getByLabel("Simulated advance (LKR)").fill("50.00");
  await expect(page.getByTestId("preview-balance")).toContainText("100.00");
  await page.getByRole("button", { name: "Review order", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Review your print order" }),
  ).toBeVisible();
  await expect(
    page.getByRole("dialog", { name: "Current order", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Save demo order", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Order created successfully" }),
  ).toBeVisible();
});
