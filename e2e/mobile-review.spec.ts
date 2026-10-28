import { expect, test } from "@playwright/test";
import { enterDemo } from "./followup-helpers";

for (const width of [320, 390, 430, 820]) {
  test(`mobile review exposes required branch and preserves a corrected draft at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await enterDemo(page, /Demo Administrator/);
    await page.goto("/pos");
    await page
      .getByLabel("Customer name (optional)", { exact: true })
      .fill("Review regression");
    const open = page.getByRole("button", {
      name: "View order (1)",
      exact: true,
    });
    await open.click();
    const cart = page.getByRole("dialog", {
      name: "Current order",
      exact: true,
    });
    await cart
      .getByRole("button", { name: "Review order", exact: true })
      .click();
    await expect(cart).toBeHidden();
    const branch = page.getByLabel("Order branch", { exact: true });
    await expect(branch).toBeFocused();
    await expect(branch).toHaveAttribute("aria-invalid", "true");
    await branch.selectOption("b1");
    await open.click();
    const advance = cart.getByLabel("Simulated advance (LKR)", { exact: true });
    await advance.fill("9999");
    await cart
      .getByRole("button", { name: "Review order", exact: true })
      .click();
    await expect(cart).toBeVisible();
    await expect(cart.getByRole("alert")).toContainText(
      "Advance cannot exceed",
    );
    await expect(advance).toBeFocused();
    await advance.fill("5.00");
    await cart
      .getByRole("button", { name: "Review order", exact: true })
      .click();
    const review = page.getByRole("dialog", {
      name: "Review your print order",
      exact: true,
    });
    await expect(review).toBeVisible();
    await expect(review).toContainText("Review regression");
    await expect(review).toContainText("10.00");
    await review
      .getByRole("button", { name: "Back to editing", exact: true })
      .click();
    await expect(cart).toBeVisible();
    await expect(advance).toHaveValue("5.00");
    await cart
      .getByRole("button", { name: "Review order", exact: true })
      .click();
    await review
      .getByRole("button", { name: "Save demo order", exact: true })
      .click();
    await expect(
      page.getByRole("link", { name: "Open order", exact: true }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Open order", exact: true }).click();
    await page.waitForURL(/\/orders\/PL-\d+$/);
    await expect(page.getByTestId("detail-balance")).toContainText("10.00");
  });
}
