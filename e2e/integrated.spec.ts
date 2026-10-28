import { test, expect, type Page } from "@playwright/test";
async function enter(page: Page, name: RegExp) {
  await page.goto("/login");
  await page.getByRole("button", { name }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.locator("main h1")).toBeVisible();
}
const amount = (text: string) => Number(text.replace(/[^0-9.]/g, ""));
test("one order remains consistent through advance, receipt, jobs, branch isolation, reports, SMS and reset", async ({
  page,
}) => {
  test.setTimeout(180000);
  await enter(page, /Demo Administrator/);
  await page.goto("/reports");
  const beforeCount = Number(
      await page.getByTestId("report-count").innerText(),
    ),
    beforeValue = amount(await page.getByTestId("report-value").innerText()),
    beforeCollected = amount(
      await page.getByTestId("report-collected").innerText(),
    ),
    beforeDue = amount(
      await page.getByTestId("report-outstanding").innerText(),
    );
  await enter(page, /Branch 1 cashier/);
  await page.goto("/pos");
  await expect(page.getByLabel("Order branch", { exact: true })).toBeDisabled();
  await page.getByLabel("Quantity (printed sheets)").fill("2");
  await page
    .getByRole("button", { name: "Add print item", exact: true })
    .click();
  await page.getByLabel("Print type").nth(1).selectOption("Color");
  await page.getByLabel("Simulated advance (LKR)").fill("30");
  await expect(page.getByTestId("order-total")).toContainText("90.00");
  await page.getByRole("button", { name: "Review order", exact: true }).click();
  await page
    .getByRole("button", { name: "Save demo order", exact: true })
    .evaluate((button: HTMLButtonElement) => {
      button.click();
      button.click();
    });
  await expect(
    page.getByRole("heading", { name: "Order created successfully" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Open order", exact: true }).click();
  await expect(page).toHaveURL(/\/orders\/PL-\d+$/);
  const orderUrl = page.url(),
    id = orderUrl.split("/").at(-1)!;
  await expect(page.getByTestId("detail-paid")).toContainText("30.00");
  await expect(page.getByTestId("detail-balance")).toContainText("60.00");
  await page
    .getByRole("link", { name: "Customer receipt", exact: true })
    .click();
  await expect(page.getByTestId("receipt-total")).toContainText("90.00");
  await expect(page.getByTestId("receipt-paid")).toContainText("30.00");
  await expect(page.getByTestId("receipt-balance")).toContainText("60.00");
  await page.goto(`/print/job/${id}`);
  await expect(
    page.getByRole("heading", { name: "Production job ticket", exact: true }),
  ).toBeVisible();
  await page.goto(orderUrl);
  await page
    .getByRole("button", { name: "Start production", exact: true })
    .click();
  await expect(page.getByTestId("production-status")).toContainText(
    "In Progress",
  );
  await enter(page, /Branch 2 cashier/);
  await page.goto(orderUrl);
  await expect(
    page.getByRole("heading", { name: "Order unavailable" }),
  ).toBeVisible();
  await page.goto(`/orders?q=${id}`);
  await expect(
    page.getByRole("heading", { name: "No matching orders" }),
  ).toBeVisible();
  await enter(page, /Demo Administrator/);
  await page.goto("/reports");
  expect(Number(await page.getByTestId("report-count").innerText())).toBe(
    beforeCount + 1,
  );
  expect(amount(await page.getByTestId("report-value").innerText())).toBe(
    beforeValue + 90,
  );
  expect(amount(await page.getByTestId("report-collected").innerText())).toBe(
    beforeCollected + 30,
  );
  expect(amount(await page.getByTestId("report-outstanding").innerText())).toBe(
    beforeDue + 60,
  );
  const reportedValue = await page.getByTestId("report-value").innerText(),
    reportedCollected = await page.getByTestId("report-collected").innerText();
  await page.goto("/sms");
  const message = await page.getByLabel("SMS message preview").inputValue();
  expect(message).toContain(reportedValue);
  expect(message).toContain(reportedCollected);
  expect(message).toContain("NOT SENT");
  await page.goto(orderUrl);
  await page
    .getByRole("button", { name: "Record payment", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Record simulated payment", exact: true })
    .click();
  await page.reload();
  await expect(page.getByTestId("detail-paid")).toContainText("90.00");
  await expect(page.getByTestId("detail-balance")).toContainText("0.00");
  await expect(page.getByTestId("production-status")).toContainText(
    "In Progress",
  );
  await page.goto("/reports");
  expect(amount(await page.getByTestId("report-collected").innerText())).toBe(
    beforeCollected + 90,
  );
  expect(amount(await page.getByTestId("report-outstanding").innerText())).toBe(
    beforeDue,
  );
  await page.goto("/settings");
  await page
    .getByRole("button", { name: "Reset demonstration data", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reset to fictional fixtures", exact: true })
    .click();
  await page.goto(orderUrl);
  await expect(
    page.getByRole("heading", { name: "Order unavailable" }),
  ).toBeVisible();
});
test("corrupt saved schema is recoverable and failed local writes preserve the review", async ({
  page,
}) => {
  await page.goto("/login");
  await page.evaluate(() =>
    localStorage.setItem("pressline.demo.v1", '{"version":99}'),
  );
  await page.reload();
  await expect(
    page.getByText(/Saved demo data could not be validated/),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Reset invalid demo data", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reset demo data", exact: true })
    .click();
  await page.getByRole("button", { name: /Branch 1 cashier/ }).click();
  await page.waitForURL("**/dashboard");
  await page.goto("/pos");
  await page.getByLabel("Customer name (optional)").fill("Demo recovery");
  await page.getByLabel("Quantity (printed sheets)").fill("2");
  await page.getByRole("button", { name: "Review order", exact: true }).click();
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key: string, value: string) {
      if (key === "pressline.demo.v1")
        throw new DOMException(
          "Demonstration quota test",
          "QuotaExceededError",
        );
      return original.call(this, key, value);
    };
  });
  await page
    .getByRole("button", { name: "Save demo order", exact: true })
    .click();
  await expect(page.getByText(/Local save failed/)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Order created successfully" }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Back to editing", exact: true })
    .click();
  await expect(page.getByLabel("Customer name (optional)")).toHaveValue(
    "Demo recovery",
  );
  await expect(page.getByLabel("Quantity (printed sheets)")).toHaveValue("2");
});
test("mobile keyboard menu and dirty drawer cancellation preserve focus and input", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enter(page, /Demo Administrator/);
  const menu = page.getByRole("button", {
    name: "More navigation",
    exact: true,
  });
  for (
    let i = 0;
    i < 30 && !(await menu.evaluate((el) => el === document.activeElement));
    i++
  )
    await page.keyboard.press("Tab");
  await expect(menu).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("dialog", { name: "More navigation", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await page.goto("/inventory");
  await page.getByRole("button", { name: "Add material", exact: true }).click();
  await page
    .getByLabel("Material name", { exact: true })
    .fill("Keep this draft");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByLabel("Material name", { exact: true })).toHaveValue(
    "Keep this draft",
  );
  page.once("dialog", (dialog) => dialog.accept());
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "Add inventory material", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Add material", exact: true }),
  ).toBeFocused();
});
