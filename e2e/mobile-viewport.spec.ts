import { expect, test } from "@playwright/test";

test("mobile keyboard simulation fits a dirty form and restores tabs without losing input", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  // A visual-viewport simulation, not evidence from a physical software keyboard.
  await page.addInitScript(() => {
    const visual = new EventTarget();
    Object.assign(visual, { height: 844, width: 390, offsetTop: 0, scale: 1 });
    Object.defineProperty(window, "visualViewport", { value: visual });
  });
  await page.goto("/login");
  await page.getByRole("button", { name: /Demo Administrator/ }).click();
  await page.waitForURL("**/dashboard");
  await page.goto("/customers");
  await page.getByRole("button", { name: "Add customer", exact: true }).click();
  const dialog = page.getByRole("dialog", {
    name: "Add customer",
    exact: true,
  });
  const name = dialog.getByLabel("Customer / company name");
  await name.fill("Mobile Sinhala සිංහල Tamil தமிழ்");
  await page.evaluate(() => {
    Object.assign(window.visualViewport!, { height: 430, offsetTop: 20 });
    window.visualViewport!.dispatchEvent(new Event("resize"));
  });
  await expect(page.locator("html")).toHaveAttribute(
    "data-mobile-keyboard",
    "",
  );
  await expect(
    page.getByRole("navigation", { name: "Mobile workspace", exact: true }),
  ).toBeHidden();
  const bounds = await dialog.boundingBox();
  expect(bounds!.y).toBe(20);
  expect(bounds!.height).toBe(430);
  const save = await dialog
    .getByRole("button", { name: "Save customer", exact: true })
    .boundingBox();
  expect(save!.y + save!.height).toBeLessThanOrEqual(450);
  await expect(name).toHaveValue("Mobile Sinhala සිංහල Tamil தமிழ்");
  // Pinch zoom must retain navigation and must not masquerade as a keyboard.
  await page.evaluate(() => {
    Object.assign(window.visualViewport!, { scale: 2 });
    window.visualViewport!.dispatchEvent(new Event("resize"));
  });
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-mobile-keyboard",
  );
  page.once("dialog", (d) => d.dismiss());
  await page.keyboard.press("Escape");
  await expect(dialog).toBeVisible();
  await expect(name).toHaveValue("Mobile Sinhala සිංහල Tamil தமிழ்");
  page.once("dialog", (d) => d.accept());
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Add customer", exact: true }),
  ).toBeFocused();
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-mobile-keyboard",
  );
});

test("mobile POS preserves the draft through landscape, tablet and desktop resizing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await page.getByRole("button", { name: /Branch 1 cashier/ }).click();
  await page.waitForURL("**/dashboard");
  await page.goto("/pos");
  await page
    .getByLabel("Customer name (optional)", { exact: true })
    .fill("Landscape draft");
  for (const size of [
    { width: 844, height: 390 },
    { width: 820, height: 1180 },
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(size);
    await expect(
      page.getByLabel("Customer name (optional)", { exact: true }),
    ).toHaveValue("Landscape draft");
    if (size.width <= 900) {
      const nav = await page
        .getByRole("navigation", { name: "Mobile workspace", exact: true })
        .boundingBox();
      const bar = await page.locator(".mobile-order-bar").boundingBox();
      expect(nav!.y + nav!.height).toBe(size.height);
      expect(bar!.y + bar!.height).toBeLessThanOrEqual(nav!.y + 1);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(size.width);
  }
  await page
    .getByRole("button", { name: "View order (1)", exact: true })
    .click();
  const order = page.getByRole("dialog", {
    name: "Current order",
    exact: true,
  });
  await order
    .getByRole("button", { name: "Review order", exact: true })
    .click();
  const review = page.getByRole("dialog", {
    name: "Review your print order",
    exact: true,
  });
  await expect(review).toBeVisible();
  const footer = await review
    .getByRole("button", { name: "Save demo order", exact: true })
    .boundingBox();
  expect(footer!.y + footer!.height).toBeLessThanOrEqual(844);
  await review
    .getByRole("button", { name: "Back to editing", exact: true })
    .click();
  await expect(
    page.getByLabel("Customer name (optional)", { exact: true }),
  ).toHaveValue("Landscape draft");
});
