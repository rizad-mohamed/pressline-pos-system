import { chromium, firefox, webkit, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const baseURL = process.env.PRESSLINE_VISUAL_URL ?? "http://127.0.0.1:3001";
if (!["127.0.0.1", "localhost"].includes(new URL(baseURL).hostname))
  throw new Error("Use a local fictional-data frontend URL.");
await mkdir(".local", { recursive: true });
const results = [];
for (const [name, type] of Object.entries({ chromium, firefox, webkit })) {
  let browser;
  try {
    browser = await type.launch();
  } catch (e) {
    results.push({ name, outcome: "unavailable", reason: String(e) });
    continue;
  }
  const errors = [];
  const touch = name !== "firefox";
  try {
    const page = await browser.newPage({
      baseURL,
      viewport: { width: 390, height: 844 },
      isMobile: touch,
      hasTouch: touch,
      timezoneId: "Asia/Colombo",
      reducedMotion: "reduce",
    });
    const activate = (locator) => (touch ? locator.tap() : locator.click());
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/login");
    await activate(page.getByRole("button", { name: /Branch 1 cashier/ }));
    await page.waitForURL("**/dashboard");
    const nav = page.getByRole("navigation", {
      name: "Mobile workspace",
      exact: true,
    });
    await expect(nav.locator(":scope > *").nth(2)).toHaveText("Dashboard");
    await activate(nav.getByRole("link", { name: "New order", exact: true }));
    await page.waitForURL("**/pos");
    await page
      .getByLabel("Customer name (optional)", { exact: true })
      .fill("Cross-engine draft");
    await activate(
      page.getByRole("button", { name: "View order (1)", exact: true }),
    );
    await expect(
      page.getByRole("dialog", { name: "Current order", exact: true }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "View order (1)", exact: true }),
    ).toBeFocused();
    await page.setViewportSize({ width: 820, height: 1180 });
    await expect(
      page.getByLabel("Customer name (optional)", { exact: true }),
    ).toHaveValue("Cross-engine draft");
    await activate(
      nav.getByRole("button", { name: "More navigation", exact: true }),
    );
    await expect(
      page.getByRole("dialog", { name: "More navigation", exact: true }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("navigation", { name: "More workspace" })
        .getByRole("link"),
    ).toHaveText(["Customers", "Profile"]);
    await page.keyboard.press("Escape");
    await expect(
      nav.getByRole("button", { name: "More navigation", exact: true }),
    ).toBeFocused();
    await page.goto("/customers");
    await activate(
      page.getByRole("button", { name: "Add customer", exact: true }),
    );
    await expect(
      page.getByRole("dialog", { name: "Add customer", exact: true }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Add customer", exact: true }),
    ).toBeFocused();
    if (errors.length) throw Error(JSON.stringify(errors));
    results.push({
      name,
      version: browser.version(),
      input: touch
        ? "emulated mobile touch"
        : "desktop-engine pointer at mobile widths",
      outcome: "passed",
      checks:
        "role tabs, centered Dashboard, POS draft/cart, Escape/focus, tablet resize, authorized More and conditional customer editor focus",
      errors,
    });
  } catch (e) {
    results.push({ name, outcome: "failed", reason: String(e), errors });
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}
await writeFile(
  ".local/mobile-engine-smoke.json",
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results, null, 2));
