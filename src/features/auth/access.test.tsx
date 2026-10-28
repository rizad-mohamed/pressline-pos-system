import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { seedData } from "@/data/seed";
import { RequireSession } from "./access";
const demo = vi.hoisted(() => ({ role: "cashier", signedIn: true }));
vi.mock("@/data/provider", () => ({
  useDemoState: () => ({
    data: seedData("2026-10-24"),
    user: demo.signedIn
      ? {
          id: "mock",
          name: "Mock",
          active: true,
          role: demo.role,
          branchId: demo.role === "admin" ? null : "b1",
        }
      : null,
  }),
}));
test("cashier cannot render administrator content", () => {
  demo.role = "cashier";
  demo.signedIn = true;
  render(
    <RequireSession admin>
      <h1>Private inventory</h1>
    </RequireSession>,
  );
  expect(
    screen.getByRole("heading", { name: "Administrator access required" }),
  ).toBeVisible();
  expect(screen.queryByText("Private inventory")).not.toBeInTheDocument();
});
test("administrator can render management content", () => {
  demo.role = "admin";
  demo.signedIn = true;
  render(
    <RequireSession admin>
      <h1>Private inventory</h1>
    </RequireSession>,
  );
  expect(screen.getByText("Private inventory")).toBeVisible();
});
test("signed-out deep link offers demo account entry", () => {
  demo.signedIn = false;
  render(
    <RequireSession>
      <h1>Orders</h1>
    </RequireSession>,
  );
  expect(
    screen.getByRole("heading", { name: "Choose a demo account" }),
  ).toBeVisible();
  expect(screen.queryByText("Orders")).not.toBeInTheDocument();
});
