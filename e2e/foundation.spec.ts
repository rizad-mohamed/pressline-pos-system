import { test, expect } from "@playwright/test";
test("entry page is served and identifies the print workspace", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Pressline/);
  await expect(page.getByRole("heading", { name: "Pressline", exact: true })).toBeVisible();
});
