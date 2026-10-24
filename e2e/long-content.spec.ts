import { test, expect } from "@playwright/test";

test("long English and Sinhala/Tamil specifications reflow in mobile review", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/login");
  await page.getByRole("button", { name: /Branch 1 cashier/ }).click();
  await page.waitForURL("**/dashboard");
  await page.goto("/pos");
  const longName = "FictionalCustomer".repeat(5);
  const description =
    "මුද්‍රණ සේවාව / அச்சிடுதல் — " + "Presentation".repeat(5);
  await page.getByLabel("Customer name (optional)").fill(longName);
  await page.getByLabel("Item description", { exact: true }).fill(description);
  await page
    .getByLabel("Item instructions (optional)")
    .fill("මුද්‍රණය · தமிழ் அச்சு · preserve the stated page sequence.");
  await page
    .getByRole("button", { name: "View order (1)", exact: true })
    .click();
  const cart = page.getByRole("dialog", { name: "Current order", exact: true });
  expect(await cart.evaluate((el) => el.scrollWidth)).toBeLessThanOrEqual(321);
  const cartBody = await cart
    .locator(".sheet-body")
    .evaluate((el) => ({ scroll: el.scrollWidth, width: el.clientWidth }));
  expect(cartBody.scroll).toBeLessThanOrEqual(cartBody.width + 1);
  await page.getByRole("button", { name: "Review order", exact: true }).click();
  const review = page.getByRole("dialog", { name: "Review your print order" });
  await expect(review).toBeVisible();
  expect(await review.evaluate((el) => el.scrollWidth)).toBeLessThanOrEqual(
    321,
  );
  const reviewBody = await review
    .locator(".sheet-body")
    .evaluate((el) => ({ scroll: el.scrollWidth, width: el.clientWidth }));
  expect(reviewBody.scroll).toBeLessThanOrEqual(reviewBody.width + 1);
  await expect(review.getByText(longName, { exact: true })).toBeVisible();
  await expect(review.getByText(description, { exact: true })).toBeVisible();
  await page.setViewportSize({ width: 844, height: 390 });
  const action = page.getByRole("button", {
    name: "Save demo order",
    exact: true,
  });
  await expect(action).toBeVisible();
  const bounds = await action.boundingBox();
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(390);
  expect(
    await review.evaluate((el) =>
      Number.parseFloat(getComputedStyle(el).animationDuration),
    ),
  ).toBeLessThan(0.01);
});
