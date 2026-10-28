import { expect, test } from "@playwright/test";

for (const role of ["cashier", "admin"] as const) {
  test(`${role} has a centered Dashboard, stable tabs and complete authorized More routes`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/login");
    await page
      .getByRole("button", {
        name: role === "admin" ? /Demo Administrator/ : /Branch 1 cashier/,
      })
      .click();
    await page.waitForURL("**/dashboard");
    const nav = page.getByRole("navigation", {
      name: "Mobile workspace",
      exact: true,
    });
    await expect(nav).toBeVisible();
    await expect(nav.locator(":scope > *")).toHaveCount(5);
    await expect(nav.locator(":scope > *").nth(2)).toHaveText("Dashboard");
    await expect(
      nav.getByRole("link", { name: "Dashboard", exact: true }),
    ).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link")).toHaveText(
      role === "admin"
        ? ["Orders", "Inventory", "Dashboard", "Reports"]
        : ["New order", "Orders", "Dashboard", "Production"],
    );
    const box = await nav.boundingBox();
    expect(box!.y + box!.height).toBe(844);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    expect((await nav.boundingBox())!.y).toBe(box!.y);
    await nav
      .getByRole("button", { name: "More navigation", exact: true })
      .click();
    const dialog = page.getByRole("dialog", {
      name: "More navigation",
      exact: true,
    });
    await expect(dialog).toBeVisible();
    expect((await dialog.boundingBox())!.height).toBeLessThanOrEqual(
      844 * 0.88 + 1,
    );
    const more = dialog.getByRole("navigation", { name: "More workspace" });
    const hrefs = await more
      .getByRole("link")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(hrefs).toEqual(
      role === "admin"
        ? [
            "/pos",
            "/customers",
            "/jobs",
            "/transfers",
            "/pricing",
            "/sms",
            "/settings",
            "/profile",
          ]
        : ["/customers", "/profile"],
    );
    await page.keyboard.press("Escape");
    await expect(
      nav.getByRole("button", { name: "More navigation", exact: true }),
    ).toBeFocused();
    const customer = await page.evaluate(() => {
      const store = JSON.parse(localStorage.getItem("pressline.demo.v1")!);
      return {
        id: store.customers[0].id as string,
        name: store.customers[0].name as string,
      };
    });
    await page.goto(`/customers/${customer.id}`);
    await expect(
      page.getByRole("heading", { name: customer.name, exact: true }),
    ).toBeVisible();
    await expect(
      nav.getByRole("button", { name: "More navigation", exact: true }),
    ).toHaveAttribute("data-active", "true");
    await page.goto("/");
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.goto("/orders/PL-1001");
    await expect(page).toHaveURL(/\/orders\/PL-1001$/);
    await expect(
      nav.getByRole("link", { name: "Orders", exact: true }),
    ).toHaveAttribute("aria-current", "page");
    await page.getByRole("link", { name: "Dashboard", exact: true }).click();
    await page.waitForURL("**/dashboard");
    await page.goBack();
    await expect(page).toHaveURL(/\/orders\/PL-1001$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/dashboard$/);
  });
}

test("narrow and enlarged mobile tabs keep complete labels and clear POS actions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto("/login");
  await page.getByRole("button", { name: /Branch 1 cashier/ }).click();
  await page.waitForURL("**/dashboard");
  await page.goto("/pos");
  for (const width of [320, 390, 820]) {
    await page.setViewportSize({ width, height: 900 });
    for (const enlarged of [false, true]) {
      await page.evaluate(
        (big) => (document.documentElement.style.fontSize = big ? "200%" : ""),
        enlarged,
      );
      const nav = page.getByRole("navigation", {
        name: "Mobile workspace",
        exact: true,
      });
      const bar = await nav.boundingBox();
      const order = await page.locator(".mobile-order-bar").boundingBox();
      expect(order!.y + order!.height).toBeLessThanOrEqual(bar!.y + 1);
      const total = page.locator(".mobile-order-bar strong");
      expect(
        await total.evaluate((element) => element.scrollWidth),
      ).toBeLessThanOrEqual(
        await total.evaluate((element) => element.clientWidth),
      );
      const labels = await nav
        .locator(".mobile-tab-label")
        .evaluateAll((elements) =>
          elements.map((element) => ({
            width: element.scrollWidth,
            available: element.clientWidth,
            top: element.getBoundingClientRect().top,
            bottom: element.getBoundingClientRect().bottom,
          })),
        );
      for (const label of labels) {
        expect(label.width).toBeLessThanOrEqual(label.available + 1);
        expect(label.top).toBeGreaterThanOrEqual(bar!.y);
        expect(label.bottom).toBeLessThanOrEqual(bar!.y + bar!.height);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
  }
});

test("navigation is absent from account entry, access denial and printed documents", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("navigation", { name: "Mobile workspace" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: /Branch 1 cashier/ }).click();
  await page.waitForURL("**/dashboard");
  await page.goto("/inventory");
  await expect(
    page.getByRole("heading", { name: "Administrator access required" }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Mobile workspace" }),
  ).toHaveCount(0);
  await page.goto("/dashboard");
  await page
    .getByRole("button", { name: "More navigation", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "More navigation", exact: true }),
  ).toBeVisible();
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".mobile-bottom-navigation")).toBeHidden();
  await expect(
    page.getByRole("dialog", { name: "More navigation", exact: true }),
  ).toBeHidden();
  await expect(page.locator(".overlay")).toBeHidden();
  await page.emulateMedia({ media: "screen" });
  await page.goto("/print/receipt/PL-1001");
  await expect(page.locator(".mobile-bottom-navigation,.topbar")).toHaveCount(
    0,
  );
});
