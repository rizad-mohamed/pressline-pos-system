import { test, expect } from "@playwright/test";

test("desktop current order keeps totals and review visible while specifications scroll", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/login");
  await page.getByRole("button", { name: /Branch 1 cashier/ }).click();
  await page.waitForURL("**/dashboard");
  await page.goto("/pos");
  for (let index = 0; index < 3; index++)
    await page
      .getByRole("button", { name: "Configure Bound documents", exact: true })
      .click();
  await page.evaluate(() => window.scrollTo(0, 0));
  const summary = page.getByRole("complementary", {
    name: "Order summary",
    exact: true,
  });
  const review = summary.getByRole("button", {
    name: "Review order",
    exact: true,
  });
  await expect
    .poll(async () => {
      const box = await review.boundingBox();
      return box ? box.y + box.height : 10000;
    })
    .toBeLessThanOrEqual(880);
  await expect(summary.getByTestId("order-total")).toBeVisible();
  await expect(summary.getByTestId("preview-balance")).toBeVisible();
  const scroll = await summary
    .locator(".summary-body")
    .evaluate((el) => ({
      content: el.scrollHeight,
      viewport: el.clientHeight,
    }));
  expect(scroll.content).toBeGreaterThan(scroll.viewport);
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect
    .poll(async () => {
      const box = await review.boundingBox();
      return box ? box.y + box.height : 10000;
    })
    .toBeLessThanOrEqual(880);
  await review.click();
  await expect(
    page.getByRole("dialog", { name: "Review your print order" }),
  ).toBeVisible();
});
