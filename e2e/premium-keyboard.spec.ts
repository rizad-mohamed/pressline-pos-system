import { test, expect } from "@playwright/test";

test("service filters support keyboard selection and mobile sheets return focus", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /Branch 1 cashier/ }).click();
  await page.waitForURL("**/dashboard");
  await page.goto("/pos");
  await page.getByRole("radio", { name: "All services", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("radio", { name: "Printing", exact: true }),
  ).toHaveAttribute("aria-checked", "true");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("radio", { name: "Binding & finishing", exact: true }),
  ).toHaveAttribute("aria-checked", "true");
  await expect(page.getByRole("button", { name: /^Configure / })).toHaveCount(
    2,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  const viewOrder = page.getByRole("button", {
    name: "View order (1)",
    exact: true,
  });
  await viewOrder.click();
  await expect(
    page.getByRole("dialog", { name: "Current order", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(viewOrder).toBeFocused();
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  await page
    .getByRole("navigation", { name: "Mobile primary", exact: true })
    .getByRole("link", { name: "Orders", exact: true })
    .click();
  await expect(page).toHaveURL(/\/orders$/);
  await expect(
    page.getByRole("heading", { name: "Orders", exact: true }),
  ).toBeVisible();
});
