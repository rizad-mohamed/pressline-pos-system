import { test, expect, type Page } from "@playwright/test";
import {
  setupBannerCustomer,
  createBannerOrder,
  enterDemo,
} from "./followup-helpers";

async function stock(page: Page) {
  return page.evaluate(() => {
    const d = JSON.parse(localStorage.getItem("pressline.demo.v1")!);
    return {
      quantities: d.items.find((i: { id: string }) => i.id === "banner-roll")
        .quantities,
      usages: d.usages,
      movements: d.movements.filter((m: { usageId?: string }) => m.usageId),
    };
  });
}
async function saveActualPlan(
  page: Page,
  quantity: string,
  additional = false,
) {
  await page
    .getByRole("button", {
      name: additional ? "Plan additional usage" : "Edit material plan",
      exact: true,
    })
    .click();
  if (additional) {
    await page
      .getByRole("button", { name: "Add material", exact: true })
      .click();
    await page
      .getByLabel("Stock material", { exact: true })
      .selectOption("banner-roll");
  }
  await page
    .getByLabel("Actual quantity (rolls)", { exact: true })
    .fill(quantity);
  await page
    .getByRole("button", { name: "Save plan · no deduction", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
}
test("confirmed banner material use, reload, corrections and safe stock rejection preserve customer/report balances", async ({
  page,
}) => {
  const { customerId } = await setupBannerCustomer(page);
  const orderId = await createBannerOrder(page);
  await expect(page.getByTestId("material-plan")).toContainText("2 rolls");
  expect((await stock(page)).quantities).toEqual({ b1: 20, b2: 12 });
  await saveActualPlan(page, "5");
  expect((await stock(page)).quantities).toEqual({ b1: 20, b2: 12 });
  await page
    .getByRole("button", { name: "Review material usage", exact: true })
    .click();
  await expect(
    page.getByText("Stock impact: 20 → 15 rolls", { exact: true }),
  ).toBeVisible();
  await page.getByRole("checkbox", { name: /I reviewed the branch/ }).check();
  await page
    .getByRole("button", {
      name: "Confirm & record material usage",
      exact: true,
    })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByTestId("material-event")).toContainText(
    "Stock 20 → 15 rolls",
  );
  const first = await stock(page);
  expect(first.quantities).toEqual({ b1: 15, b2: 12 });
  expect(first.usages).toHaveLength(1);
  expect(first.movements).toHaveLength(1);
  const movementId = first.movements[0].id;
  await expect(page.getByText(movementId, { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Review material usage", exact: true }),
  ).toHaveCount(0);
  await page.reload();
  await expect(page.getByTestId("material-event")).toContainText(movementId);
  expect((await stock(page)).quantities.b1).toBe(15);
  await page
    .getByRole("button", { name: "Edit information", exact: true })
    .click();
  await page
    .getByLabel("Order instructions (optional)", { exact: true })
    .fill("Retain physically used materials after metadata edit");
  await page
    .getByRole("button", { name: "Save order information", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect((await stock(page)).quantities.b1).toBe(15);
  await expect(
    page.getByRole("button", { name: "Correct recorded usage", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Record payment", exact: true })
    .click();
  await page.getByLabel("Payment amount (LKR)", { exact: true }).fill("500");
  await page
    .getByRole("button", { name: "Record simulated payment", exact: true })
    .click();
  await expect(page.getByTestId("detail-balance")).toContainText("2,000.00");
  await page.goto(`/customers/${customerId}`);
  await expect(page.getByTestId("customer-outstanding")).toContainText(
    "2,000.00",
  );
  await enterDemo(page, /Branch 2 cashier/);
  await page.goto(`/orders/${orderId}`);
  await expect(
    page.getByRole("heading", { name: "Order unavailable", exact: true }),
  ).toBeVisible();
  await enterDemo(page, /Demo Administrator/);
  await page.goto("/inventory");
  const row = page.getByRole("row").filter({
    has: page.getByRole("button", {
      name: "Banner paper rolls · demo",
      exact: true,
    }),
  });
  await expect(row.getByRole("cell").nth(1)).toContainText("15");
  await expect(row.getByRole("cell").nth(2)).toContainText("12");
  const movementRow = page.getByRole("row").filter({ hasText: movementId });
  await expect(movementRow).toContainText(orderId);
  await expect(movementRow).toContainText("20 → 15 rolls");
  await page.goto("/reports");
  const ids = [
    "report-count",
    "report-value",
    "report-collected",
    "report-outstanding",
  ];
  const finances = await Promise.all(
    ids.map((id) => page.getByTestId(id).innerText()),
  );
  await page.goto(`/orders/${orderId}`);
  await page
    .getByRole("button", { name: "Correct recorded usage", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Confirm compensating correction",
      exact: true,
    })
    .click();
  await expect(
    page.getByText("Enter a reason with at least 3 characters.", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByLabel("Correction reason", { exact: true })
    .fill("Five rolls entered in error; actual use was two");
  await page.getByRole("checkbox", { name: /I reviewed the branch/ }).check();
  await page
    .getByRole("button", {
      name: "Confirm compensating correction",
      exact: true,
    })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByTestId("material-event")).toHaveCount(2);
  expect((await stock(page)).quantities).toEqual({ b1: 20, b2: 12 });
  expect((await stock(page)).usages[1]).toEqual(first.usages[0]);
  await saveActualPlan(page, "2", true);
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
  expect((await stock(page)).quantities).toEqual({ b1: 18, b2: 12 });
  await saveActualPlan(page, "99", true);
  await page
    .getByRole("button", { name: "Review material usage", exact: true })
    .click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Insufficient stock" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "Confirm & record material usage",
      exact: true,
    }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  expect((await stock(page)).quantities.b1).toBe(18);
  expect((await stock(page)).usages).toHaveLength(3);
  await page.goto("/reports");
  expect(
    await Promise.all(ids.map((id) => page.getByTestId(id).innerText())),
  ).toEqual(finances);
  await page.goto(`/print/job/${orderId}`);
  await expect(page.getByText(movementId, { exact: false })).toBeVisible();
  await expect(page.getByText(/Compensating correction/)).toBeVisible();
  await page.goto(`/print/receipt/${orderId}`);
  await expect(page.getByTestId("receipt-total")).toContainText("3,500.00");
  await expect(page.getByTestId("receipt-balance")).toContainText("2,000.00");
  await expect(page.getByText(/Five rolls entered in error/)).toHaveCount(0);
});
