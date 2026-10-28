import { test, expect } from "@playwright/test";
import { enterDemo } from "./followup-helpers";
test("a preceding success notification cannot obscure the next drawer confirmation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterDemo(page, /Branch 1 cashier/);
  await page.goto("/orders/PL-1012");
  await page
    .getByRole("button", { name: "Edit material plan", exact: true })
    .click();
  await page.getByRole("button", { name: "Add material", exact: true }).click();
  await page
    .getByRole("button", { name: "Save plan · no deduction", exact: true })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "Material plan saved" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Review material usage", exact: true })
    .click();
  const action = page.getByRole("button", {
    name: "Confirm & record material usage",
    exact: true,
  });
  await expect(action).toBeVisible();
  const toast = page.locator(".toast");
  await expect(toast).toBeAttached();
  expect(
    await toast.evaluate((el) => Number(getComputedStyle(el).zIndex)),
    "background success feedback belongs below the modal overlay",
  ).toBeLessThan(
    await page
      .getByRole("dialog")
      .evaluate((el) => Number(getComputedStyle(el).zIndex)),
  );
  for (const width of [390, 320, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(action).toBeInViewport({ ratio: 1 });
    const box = await action.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    expect(box!.y + box!.height).toBeLessThanOrEqual(844);
    const unobscured = await action.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return (
        document
          .elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
          ?.closest("button") === el
      );
    });
    expect(
      unobscured,
      `confirmation must be above background notification at ${width}px`,
    ).toBe(true);
  }
  await page.getByRole("checkbox", { name: /I reviewed the branch/ }).check();
  await action.click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByTestId("material-event")).toContainText(
    "Stock deducted",
  );
});
