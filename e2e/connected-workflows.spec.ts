import { test, expect } from "@playwright/test";
import {
  createBannerOrder,
  enterDemo,
  setupBannerCustomer,
} from "./followup-helpers";

test("a managed banner service and saved company stay connected through payments, rename and archive", async ({
  page,
}) => {
  const { customerId } = await setupBannerCustomer(page);
  const orderId = await createBannerOrder(page);
  await expect(page.getByTestId("detail-total")).toContainText("3,500.00");
  await expect(page.getByTestId("detail-balance")).toContainText("2,500.00");
  await page.goto(`/customers/${customerId}`);
  await expect(page.getByTestId("customer-outstanding")).toContainText(
    "2,500.00",
  );
  await page.getByRole("link", { name: orderId, exact: true }).first().click();
  await page.waitForURL(`**/orders/${orderId}`);
  await page
    .getByRole("button", { name: "Record payment", exact: true })
    .click();
  await page
    .getByLabel("Payment amount (LKR)", { exact: true })
    .fill("500.00");
  await page
    .getByRole("button", { name: "Record simulated payment", exact: true })
    .click();
  await expect(page.getByTestId("detail-balance")).toContainText("2,000.00");
  await page.goto(`/customers/${customerId}`);
  await expect(page.getByTestId("customer-outstanding")).toContainText(
    "2,000.00",
  );
  await enterDemo(page, /Branch 2 cashier/);
  await page.goto(`/customers/${customerId}`);
  await expect(page.getByTestId("customer-outstanding")).toContainText("0.00");
  await expect(
    page.getByRole("link", { name: orderId, exact: true }),
  ).toHaveCount(0);
  await enterDemo(page, /Demo Administrator/);
  await page.goto("/pricing");
  await page
    .getByRole("button", { name: "Edit service Banner Printing", exact: true })
    .click();
  await page
    .getByLabel("Service name", { exact: true })
    .fill("Banner work renamed");
  await page.getByLabel("Unit price (LKR)", { exact: true }).fill("4500.00");
  await page.getByRole("button", { name: "Save service", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  page.on("dialog", (d) => d.accept());
  await page
    .getByRole("button", {
      name: "Archive service Banner work renamed",
      exact: true,
    })
    .click();
  await page.goto(`/customers/${customerId}`);
  await page
    .getByRole("button", { name: "Edit customer", exact: true })
    .click();
  await page
    .getByLabel("Customer / company name", { exact: true })
    .fill("ABC Company renamed");
  await page
    .getByRole("button", { name: "Save customer", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Archive customer", exact: true })
    .click();
  await expect(page.getByTestId("customer-outstanding")).toContainText(
    "2,000.00",
  );
  await page.goto(`/print/receipt/${orderId}`);
  await expect(page.getByText("ABC Company", { exact: true })).toBeVisible();
  await expect(
    page.getByText("1. Banner Printing", { exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("receipt-total")).toContainText("3,500.00");
  await expect(page.getByTestId("receipt-balance")).toContainText("2,000.00");
  await page.goto(`/print/job/${orderId}`);
  await expect(
    page.getByText("1. Banner Printing", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/1 jobs/).first()).toBeVisible();
  await enterDemo(page, /Branch 1 cashier/);
  await page.goto("/pos");
  await expect(
    page.getByRole("button", {
      name: "Configure Banner work renamed",
      exact: true,
    }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", {
      name: "Configure Document printing",
      exact: true,
    }),
  ).toBeVisible();
});

test("POS quick-add and legacy linking preserve optional walk-in and historical names", async ({
  page,
}) => {
  await enterDemo(page, /Branch 1 cashier/);
  await page.goto("/pos");
  await page
    .getByRole("button", { name: "Add new customer", exact: true })
    .click();
  await page
    .getByLabel("Customer / company name", { exact: true })
    .fill("Fictional recurring customer");
  await page
    .getByRole("button", { name: "Save customer", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByLabel("Customer name (optional)", { exact: true }),
  ).toHaveValue("Fictional recurring customer");
  await page
    .getByRole("button", { name: "Remove customer link", exact: true })
    .click();
  await expect(
    page.getByLabel("Customer name (optional)", { exact: true }),
  ).toHaveValue("");
  await page.goto("/orders/PL-1012");
  await page
    .getByRole("button", { name: "Link saved customer", exact: true })
    .click();
  await page
    .getByLabel("Link to customer", { exact: true })
    .selectOption({ label: "Fictional recurring customer · Individual" });
  await page
    .getByRole("button", { name: "Confirm customer link", exact: true })
    .click();
  await expect(
    page.getByRole("link", {
      name: /Saved customer account · Fictional recurring customer/,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Walk-in customer", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", {
      name: /Saved customer account · Fictional recurring customer/,
    })
    .click();
  await page.waitForURL("**/customers/cust-*");
  await page
    .getByRole("link", { name: "New order for this customer", exact: true })
    .click();
  await page.waitForURL(/\/pos\?customer=/);
  await expect(
    page.getByLabel("Customer name (optional)", { exact: true }),
  ).toHaveValue("Fictional recurring customer");
});
