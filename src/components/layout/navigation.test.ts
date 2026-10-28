import { expect, test } from "vitest";
import { adminPaths } from "@/features/auth/access";
import {
  authorizedNavigation,
  mobileDestinations,
  moreNavigation,
  isCurrentRoute,
} from "./navigation";

test.each(["admin", "cashier"] as const)(
  "%s tabs and More expose every authorized destination exactly once",
  (role) => {
    const primary = mobileDestinations(role);
    expect(primary.map((item) => item.href)).toEqual(
      role === "admin"
        ? ["/orders", "/inventory", "/dashboard", "/reports"]
        : ["/pos", "/orders", "/dashboard", "/jobs"],
    );
    const remaining = moreNavigation(role).flatMap((group) =>
      group.items.map((item) => item.href),
    );
    const all = [...primary.map((item) => item.href), ...remaining];
    expect(new Set(all).size).toBe(all.length);
    expect(new Set(all)).toEqual(
      new Set(
        authorizedNavigation(role).flatMap((group) =>
          group.items.map((item) => item.href),
        ),
      ),
    );
    expect(all).toContain("/customers");
    expect(all).toContain("/profile");
    if (role === "cashier")
      expect(all.some((href) => adminPaths.includes(href))).toBe(false);
  },
);
test("nested locations use segment boundaries and never select lookalike routes", () => {
  expect(isCurrentRoute("/customers/customer-demo", "/customers")).toBe(true);
  expect(isCurrentRoute("/orders/PL-1001", "/orders")).toBe(true);
  expect(isCurrentRoute("/orders-archive", "/orders")).toBe(false);
});
