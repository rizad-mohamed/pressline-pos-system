import { test, expect } from "@playwright/test";
test("customer receipt and separate production ticket render and print without navigation", async ({
  page,
}, testInfo) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /Branch 1 cashier/ }).click();
  await page.goto("/print/receipt/PL-1012");
  await expect(
    page.getByRole("heading", { name: "Customer receipt", exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("receipt-total")).toContainText("1,230.00");
  await expect(page.getByTestId("receipt-balance")).toContainText("1,230.00");
  await expect(
    page.getByText(/NOT PROOF OF FINANCIAL SETTLEMENT/),
  ).toBeVisible();
  await page.emulateMedia({ media: "print" });
  await expect(
    page.getByRole("button", { name: "Print receipt", exact: true }),
  ).toBeHidden();
  await page.pdf({
    path: testInfo.outputPath("customer-receipt.pdf"),
    format: "A4",
    printBackground: true,
  });
  await page.emulateMedia({ media: "screen" });
  await page.goto("/print/job/PL-1012");
  await expect(
    page.getByRole("heading", { name: "Production job ticket", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Binding: Spiral · Finishing: None"),
  ).toBeVisible();
  await expect(page.getByText("Order total", { exact: true })).toHaveCount(0);
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: testInfo.outputPath("production-ticket.pdf"),
    format: "A4",
    printBackground: true,
  });
  await expect(page.locator(".sidebar")).toHaveCount(0);
});
