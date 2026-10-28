import { expect, test } from "vitest";
test("runtime supports Sri Lankan currency and business timezone", () => {
  expect(
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(125),
  ).toContain("125.00");
  expect(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Colombo",
      day: "2-digit",
    }).format(new Date("2026-10-23T20:00:00Z")),
  ).toBe("24");
});
