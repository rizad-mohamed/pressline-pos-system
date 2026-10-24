import { test, expect } from "@playwright/test";

test("administrator manages services, categories, prices and whole-unit material suggestions", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /Demo Administrator/ }).click();
  await page.waitForURL("**/dashboard");
  await page.goto("/pricing");
  await page
    .getByRole("button", { name: "Manage categories", exact: true })
    .click();
  await page
    .getByLabel("New category name", { exact: true })
    .fill("Wide format · demo");
  await page.getByRole("button", { name: "Add category", exact: true }).click();
  await expect(
    page.getByRole("button", {
      name: "Rename Wide format · demo",
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page.getByRole("button", { name: "Add service", exact: true }).click();
  await page
    .getByLabel("Service name", { exact: true })
    .fill("Banner Printing · demo");
  await page.getByLabel("Service code", { exact: true }).fill("BANNER-DEMO");
  await page
    .getByLabel("Short description (optional)", { exact: true })
    .fill("Fictional wide-format print job");
  await page
    .getByLabel("Service category", { exact: true })
    .selectOption({ label: "Wide format · demo" });
  await page.getByLabel("Unit price (LKR)", { exact: true }).fill("3500.00");
  await page
    .getByRole("button", { name: "Add material suggestion", exact: true })
    .click();
  await page
    .getByLabel("Recipe material 1", { exact: true })
    .selectOption("banner-roll");
  await page.getByLabel("Recipe quantity 1 (rolls)", { exact: true }).fill("2");
  await page.getByRole("button", { name: "Save service", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByLabel("Search managed services", { exact: true })
    .fill("BANNER-DEMO");
  await page
    .getByRole("button", {
      name: "View service Banner Printing · demo",
      exact: true,
    })
    .click();
  await expect(
    page.getByText("Banner paper rolls · demo: 2 rolls per job line", {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page.reload();
  await page
    .getByRole("button", {
      name: "Edit service Banner Printing · demo",
      exact: true,
    })
    .click();
  await page.getByLabel("Unit price (LKR)", { exact: true }).fill("4500.00");
  await page.getByRole("button", { name: "Save service", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("button", {
      name: "Deactivate service Banner Printing · demo",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Activate service Banner Printing · demo",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Activate service Banner Printing · demo",
      exact: true,
    })
    .click();
  page.on("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", {
      name: "Archive service Banner Printing · demo",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Activate service Banner Printing · demo",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Activate service Banner Printing · demo",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Manage categories", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Rename Wide format · demo", exact: true })
    .click();
  await page
    .getByLabel("Rename category", { exact: true })
    .fill("Banner work · demo");
  await page
    .getByRole("button", { name: "Save category name", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Archive Banner work · demo", exact: true })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Reactivate Banner work · demo",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Reactivate Banner work · demo", exact: true })
    .click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(
    page.getByRole("button", {
      name: "Edit service Banner Printing · demo",
      exact: true,
    }),
  ).toBeVisible();
});
