import { test, expect } from "@playwright/test";
test("SMS preview matches reports, persists demo settings and cannot send", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /Demo Administrator/ }).click();
  await page.waitForURL("**/dashboard");
  await page.goto("/reports");
  const collected = await page.getByTestId("report-collected").innerText();
  await page.goto("/sms");
  await expect(page.getByLabel("SMS message preview")).toContainText(
    "NOT SENT",
  );
  expect(await page.getByLabel("SMS message preview").inputValue()).toContain(
    collected,
  );
  await expect(
    page.getByRole("button", { name: "Send SMS", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Preview settings", exact: true })
    .click();
  await page.getByLabel("Owner demo phone (optional)").fill("077 000 0000");
  await page.getByLabel("Default reporting cutoff").fill("18:00");
  await page
    .getByRole("button", { name: "Save preview settings", exact: true })
    .click();
  await expect(page.getByText("077 000 0000", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Preview cutoff (Asia/Colombo)")).toHaveValue(
    "18:00",
  );
  await expect(
    page.getByRole("button", { name: "Send SMS", exact: true }),
  ).toBeDisabled();
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
});
