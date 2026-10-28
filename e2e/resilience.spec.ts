import { test, expect } from "@playwright/test";
test("delayed application scripts show a real skeleton before demo accounts become available", async ({
  page,
}) => {
  await page.route("**/_next/static/**/*.js", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.continue();
  });
  await page.goto("/login", { waitUntil: "commit" });
  await expect(
    page.getByRole("status", { name: "Loading workspace", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Branch 1 cashier/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("status", { name: "Loading workspace", exact: true }),
  ).toHaveCount(0);
});
