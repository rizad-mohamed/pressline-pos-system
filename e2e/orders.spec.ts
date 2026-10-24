import { test, expect } from "@playwright/test";
test("order retrieval, negative payment, subsequent collection and independent production", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /Branch 1 cashier/ }).click();
  await page.goto("/orders/PL-1012");
  await expect(page.getByTestId("detail-balance")).toContainText("1,230.00");
  await page
    .getByRole("button", { name: "Record payment", exact: true })
    .click();
  await page.getByLabel("Payment amount (LKR)").fill("-1");
  await page
    .getByRole("button", { name: "Record simulated payment", exact: true })
    .click();
  await expect(
    page.getByText(
      "Use a positive LKR amount with at most two decimal places.",
    ),
  ).toBeVisible();
  await page.getByLabel("Payment amount (LKR)").fill("100");
  await page
    .getByRole("button", { name: "Record simulated payment", exact: true })
    .click();
  await expect(page.getByTestId("detail-paid")).toContainText("100.00");
  await expect(page.getByTestId("detail-balance")).toContainText("1,130.00");
  await page
    .getByRole("button", { name: "Start production", exact: true })
    .click();
  await expect(page.getByTestId("production-status")).toContainText(
    "In Progress",
  );
  await page.reload();
  await expect(page.getByTestId("detail-paid")).toContainText("100.00");
  await page.goto("/orders?q=does-not-exist");
  await expect(
    page.getByRole("heading", { name: "No matching orders" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "PL-1012", exact: true }),
  ).toBeVisible();
  await page.goto("/login");
  await page.getByRole("button", { name: /Branch 2 cashier/ }).click();
  await page.goto("/orders/PL-1012");
  await expect(
    page.getByRole("heading", { name: "Order unavailable" }),
  ).toBeVisible();
});
