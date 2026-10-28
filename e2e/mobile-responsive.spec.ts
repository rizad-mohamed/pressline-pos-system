import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const axeSource = readFileSync(
  createRequire(import.meta.url).resolve("axe-core/axe.min.js"),
  "utf8",
);
const routes = [
  "dashboard",
  "pos",
  "orders",
  "customers",
  "jobs",
  "inventory",
  "transfers",
  "pricing",
  "reports",
  "sms",
  "settings",
  "profile",
];
for (const role of ["admin", "cashier"] as const) {
  for (const width of [
    320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1440, 1920,
  ]) {
    test(`${role} workspace reflows at ${width}px with intact adaptive navigation`, async ({
      page,
    }) => {
      test.setTimeout(120000);
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/login");
      await page
        .getByRole("button", {
          name: role === "admin" ? /Demo Administrator/ : /Branch 1 cashier/,
        })
        .click();
      await page.waitForURL("**/dashboard");
      for (const route of routes.filter(
        (r) =>
          role === "admin" ||
          ![
            "inventory",
            "transfers",
            "pricing",
            "reports",
            "sms",
            "settings",
          ].includes(r),
      )) {
        await page.goto(`/${route}`);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
          route,
        ).toBeLessThanOrEqual(width + 1);
        const nav = page.getByRole("navigation", {
          name: "Mobile workspace",
          exact: true,
        });
        if (width <= 900) {
          await expect(nav).toBeVisible();
          await expect(nav.locator(":scope > *").nth(2)).toHaveText(
            "Dashboard",
          );
          for (const tab of await nav.locator(":scope > *").all()) {
            const box = await tab.boundingBox();
            expect(box!.width).toBeGreaterThanOrEqual(44);
            expect(box!.height).toBeGreaterThanOrEqual(44);
          }
          expect(
            (await nav.boundingBox())!.y + (await nav.boundingBox())!.height,
          ).toBe(900);
        } else {
          await expect(nav).toBeHidden();
          await expect(
            page.getByRole("navigation", { name: "Primary", exact: true }),
          ).toBeVisible();
        }
        for (const table of await page.locator(".table-scroll").all()) {
          const box = await table.boundingBox();
          if (box)
            expect(box.x + box.width, route).toBeLessThanOrEqual(width + 1);
        }
      }
      expect(errors).toEqual([]);
    });
  }
}

test("all mobile screens reflow at 200% text with reduced motion", async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/login");
  await page.getByRole("button", { name: /Demo Administrator/ }).click();
  await page.waitForURL("**/dashboard");
  await page.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      document.documentElement.style.fontSize = "200%";
    });
  });
  for (const size of [
    { width: 320, height: 900 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(size);
    for (const route of routes) {
      await page.goto(`/${route}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("html")).toHaveCSS("font-size", "32px");
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        `${route}/${size.width}`,
      ).toBeLessThanOrEqual(size.width + 1);
    }
  }
});

test("mobile tabs, More and expanded filters pass selected WCAG A/AA rules", async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await page.getByRole("button", { name: /Demo Administrator/ }).click();
  await page.waitForURL("**/dashboard");
  for (const state of ["dashboard", "more", "filters"]) {
    if (state === "more") {
      await page
        .getByRole("button", { name: "More navigation", exact: true })
        .click();
      const dialog = page.getByRole("dialog");
      await dialog.evaluate(async (element) => {
        await Promise.all(
          element.getAnimations().map((animation) => animation.finished),
        );
      });
      await expect(dialog).toHaveCSS("opacity", "1");
    }
    if (state === "filters") {
      await page.keyboard.press("Escape");
      await page.goto("/inventory");
      await page
        .getByRole("button", { name: "Filters & sort", exact: true })
        .click();
    }
    const result = await new AxeBuilder({ page, axeSource })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(result.violations, state).toEqual([]);
  }
});

test("emulated safe areas reserve space for tabs, order actions and sheet controls", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "CDP safe-area override is Chromium-only; viewport and layout checks run in every engine.",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setSafeAreaInsetsOverride", {
    insets: { top: 24, bottom: 34, left: 0, right: 0 },
  });
  await page.goto("/login");
  await page.getByRole("button", { name: /Branch 1 cashier/ }).click();
  await page.waitForURL("**/dashboard");
  await page.goto("/pos");
  const nav = page.getByRole("navigation", {
    name: "Mobile workspace",
    exact: true,
  });
  await expect(page.locator(".topbar")).toHaveCSS("border-top-width", "24px");
  await expect(nav).toHaveCSS("padding-bottom", "37px");
  const bounds = await nav.boundingBox();
  expect(bounds!.height).toBe(98);
  expect(bounds!.y + bounds!.height).toBe(844);
  const bar = await page.locator(".mobile-order-bar").boundingBox();
  expect(bar!.y + bar!.height).toBeLessThanOrEqual(bounds!.y + 1);
  await page
    .getByRole("button", { name: "View order (1)", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Current order",
    exact: true,
  });
  await expect(dialog.locator(".sheet-footer")).toHaveCSS(
    "padding-bottom",
    "34px",
  );
  await expect(dialog.locator(".sheet-header")).toHaveCSS(
    "padding-top",
    "24px",
  );
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 844, height: 390 });
  await cdp.send("Emulation.setSafeAreaInsetsOverride", {
    insets: { top: 0, bottom: 21, left: 44, right: 44 },
  });
  await expect(page.locator(".workspace")).toHaveCSS(
    "border-left-width",
    "44px",
  );
  await expect(nav).toHaveCSS("padding-left", "44px");
  await expect(page.locator(".mobile-order-bar")).toHaveCSS(
    "padding-left",
    "44px",
  );
  await expect(page.locator(".mobile-order-bar")).toHaveCSS(
    "padding-right",
    "44px",
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(844);
  await page
    .getByRole("button", { name: "View order (1)", exact: true })
    .click();
  await expect(page.getByRole("dialog").locator(".sheet-body")).toHaveCSS(
    "padding-right",
    "44px",
  );
  await cdp.detach();
});

test("enlarged mobile management forms keep scroll bodies and save actions contained", async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/login");
  await page.getByRole("button", { name: /Demo Administrator/ }).click();
  await page.waitForURL("**/dashboard");
  await page.addInitScript(() =>
    document.addEventListener("DOMContentLoaded", () => {
      document.documentElement.style.fontSize = "200%";
    }),
  );
  for (const viewport of [
    { width: 320, height: 900 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    for (const [route, opener] of [
      ["customers", "Add customer"],
      ["inventory", "Add material"],
      ["pricing", "Add service"],
      ["transfers", "New transfer"],
    ]) {
      await page.goto(`/${route}`);
      await page.getByRole("button", { name: opener, exact: true }).click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      for (const region of [
        dialog,
        dialog.locator(".sheet-body"),
        dialog.locator(".sheet-footer"),
      ]) {
        const size = await region.evaluate((el) => ({
          scroll: el.scrollWidth,
          width: el.clientWidth,
        }));
        expect(size.scroll, route).toBeLessThanOrEqual(size.width + 1);
      }
      const footer = await dialog.locator(".sheet-footer").boundingBox();
      expect(footer!.y + footer!.height).toBeLessThanOrEqual(viewport.height);
      await page.keyboard.press("Escape");
      await expect(
        page.getByRole("button", { name: opener, exact: true }),
      ).toBeFocused();
    }
  }
});
