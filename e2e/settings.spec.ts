import { test, expect } from "@playwright/test";
test("demo configuration, personal preferences and explicit fixture reset persist correctly", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /Demo Administrator/ }).click();
  await page.goto("/settings");
  await page
    .getByRole("button", { name: "Edit demo configuration", exact: true })
    .click();
  await page.getByLabel("Receipt / SMS shop name").fill("Demo Print Co");
  await page.getByLabel("Branch 1 display name").fill("North Desk");
  await page
    .getByRole("button", { name: "Save demo configuration", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Demo Print Co", exact: true }),
  ).toBeVisible();
  await page.goto("/profile");
  await page.getByLabel("Compact tables", { exact: true }).check();
  await page.getByLabel("Reduce animation", { exact: true }).check();
  await page
    .getByRole("button", { name: "Save browser preferences", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByLabel("Compact tables", { exact: true }),
  ).toBeChecked();
  await expect(page.locator("html")).toHaveClass(/reduce-motion/);
  await page.goto("/settings");
  await page
    .getByRole("button", { name: "Reset demonstration data", exact: true })
    .click();
  await expect(
    page.getByRole("alertdialog", {
      name: "Reset all local demonstration data?",
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Reset to fictional fixtures", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Pressline", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Branch 1", exact: true }),
  ).toBeVisible();
  await page.goto("/profile");
  await expect(
    page.getByLabel("Compact tables", { exact: true }),
  ).not.toBeChecked();
  await expect(page.locator("html")).not.toHaveClass(/reduce-motion/);
});
