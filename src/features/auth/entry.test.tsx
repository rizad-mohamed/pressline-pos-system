import { render } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { Entry } from "./entry";
const state = vi.hoisted(() => ({
  data: {} as object | null,
  user: null as object | null,
  recoveryRequired: false,
  replace: vi.fn(),
}));
vi.mock("@/data/provider", () => ({ useDemoState: () => state }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: state.replace }),
}));
beforeEach(() => {
  state.data = {};
  state.user = null;
  state.recoveryRequired = false;
  state.replace.mockClear();
});
test("root resumes a saved active persona at Dashboard", () => {
  state.user = { id: "admin" };
  render(<Entry />);
  expect(state.replace).toHaveBeenCalledWith("/dashboard");
});
test("a signed-out root entry opens the account chooser", () => {
  render(<Entry />);
  expect(state.replace).toHaveBeenCalledWith("/login");
});
test("root offers account entry when signed out or in recovery", () => {
  state.recoveryRequired = true;
  state.user = { id: "admin" };
  render(<Entry />);
  expect(state.replace).toHaveBeenCalledWith("/login");
});
test("root waits for validated hydration before deciding a route", () => {
  state.data = null;
  render(<Entry />);
  expect(state.replace).not.toHaveBeenCalled();
});
