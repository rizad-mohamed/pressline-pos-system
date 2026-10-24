import { test, expect } from "@playwright/test";
import { enterDemo } from "./followup-helpers";
test("long saved customer names remain within profile and selected POS at zoom and mobile widths", async ({
  page,
}) => {
  await enterDemo(page, /Demo Administrator/);
  await page.goto("/customers");
  await page.getByRole("button", { name: "Add customer", exact: true }).click();
  const name = "FictionalCompany".repeat(6);
  await page.getByLabel("Customer / company name", { exact: true }).fill(name);
  await page
    .getByRole("button", { name: "Save customer", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("link", { name, exact: true }).click();
  await page.waitForURL("**/customers/cust-*");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
    "200% customer profile with an unbroken 90-character name",
  ).toBeLessThanOrEqual(1441);
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "";
  });
  await page.setViewportSize({ width: 320, height: 844 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(321);
  await page
    .getByRole("link", { name: "New order for this customer", exact: true })
    .click();
  await page.waitForURL("**/pos?customer=*");
  await expect(
    page.getByLabel("Customer name (optional)", { exact: true }),
  ).toHaveValue(name);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
    "selected saved customer at 320px",
  ).toBeLessThanOrEqual(321);
});
