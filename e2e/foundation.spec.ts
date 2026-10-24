import { test, expect } from "@playwright/test";
test("entry page is served and identifies the print workspace", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Pressline/);
  await expect(page.getByRole("heading", { name: "Choose your workspace", exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Branch 1 cashier/ }).click();
  await expect(page.getByRole("heading", { name: "Your day, in focus" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary", exact: true }).getByRole("link", { name: "Inventory", exact: true })).toHaveCount(0);
});
