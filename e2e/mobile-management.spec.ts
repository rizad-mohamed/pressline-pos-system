import { expect, test } from "@playwright/test";

test("mobile secondary filters retain actual selections across collapse and resize", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await page.getByRole("button", { name: /Demo Administrator/ }).click();
  await page.waitForURL("**/dashboard");
  for (const [route, label, value] of [
    ["orders", "Payment", "Partial"],
    ["inventory", "Stock level", "low"],
    ["pricing", "Availability", "active"],
  ]) {
    await page.goto(`/${route}`);
    const toggle = page.getByRole("button", {
      name: "Filters & sort",
      exact: true,
    });
    const control = page.getByLabel(label, { exact: true });
    await expect(control).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await control.selectOption(value);
    await toggle.click();
    await expect(control).toBeHidden();
    await expect(page.locator(".mobile-filter-summary")).toContainText(
      route === "orders"
        ? "Partial"
        : route === "inventory"
          ? "Low stock only"
          : "active",
    );
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(control).toBeVisible();
    await expect(control).toHaveValue(value);
    await control.focus();
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(control).toBeVisible();
    await expect(control).toBeFocused();
    await expect(control).toHaveValue(value);
    await expect(
      page.getByRole("navigation", { name: "Mobile workspace", exact: true }),
    ).toBeVisible();
  }
});

test("mobile tables expose real overflow and support keyboard access to every column", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await page.getByRole("button", { name: /Demo Administrator/ }).click();
  await page.waitForURL("**/dashboard");
  for (const route of [
    "orders",
    "customers",
    "inventory",
    "transfers",
    "pricing",
    "reports",
    "sms",
    "settings",
  ]) {
    await page.goto(`/${route}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const region of await page.locator(".table-scroll").all()) {
      if (await region.evaluate((el) => el.scrollWidth > el.clientWidth + 1)) {
        await expect(region).toHaveAttribute("data-overflow", "true");
        await expect(region).toHaveAttribute("tabindex", "0");
        await region.focus();
        await page.keyboard.press("ArrowRight");
        await expect
          .poll(() => region.evaluate((el) => el.scrollLeft))
          .toBeGreaterThan(0);
      }
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390);
  }
});
