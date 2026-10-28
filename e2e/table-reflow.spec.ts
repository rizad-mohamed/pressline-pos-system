import { test, expect } from "@playwright/test";
test("mobile tables contain hidden labels and remain keyboard-scrollable on every data screen", async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await page.getByRole("button", { name: /Demo Administrator/ }).click();
  for (const route of [
    "orders",
    "jobs",
    "inventory",
    "transfers",
    "pricing",
    "reports",
    "sms",
    "settings",
  ]) {
    await page.goto(`/${route}`);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      route,
    ).toBeLessThanOrEqual(391);
    for (const table of await page.locator(".table-scroll").all()) {
      if (await table.evaluate((el) => el.scrollWidth > el.clientWidth)) {
        await expect(table).toHaveAttribute("tabindex", "0");
        await table.focus();
        await table.press("ArrowRight");
        await expect
          .poll(() => table.evaluate((el) => el.scrollLeft))
          .toBeGreaterThan(0);
      }
    }
  }
});
