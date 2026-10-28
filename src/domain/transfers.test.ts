import { expect, test } from "vitest";
import { seedData } from "@/data/seed";
import { validateData } from "@/data/validation";
import { applyTransfer } from "./transfers";
const now = "2026-10-24T10:00:00.000Z";
const command = {
  type: "transfer" as const,
  requestId: "transfer-test",
  itemId: "paper-a4",
  source: "b1" as const,
  target: "b2" as const,
  quantity: 100,
  note: "Demo replenishment",
};
test("transfer updates both balances and two movement events atomically", () => {
  const d = seedData();
  const next = applyTransfer(d, d.users[2], command, now);
  const item = next.items.find((i) => i.id === "paper-a4")!;
  expect(item.quantities).toEqual({ b1: 6700, b2: 4300 });
  expect(item.quantities.b1 + item.quantities.b2).toBe(11000);
  expect(
    next.movements
      .filter((m) => m.transferId === "TR-transfer-test")
      .map((m) => m.delta)
      .sort((a, b) => a - b),
  ).toEqual([-100, 100]);
  expect(validateData(next)).toEqual(next);
  expect(d.items[0].quantities).toEqual({ b1: 6800, b2: 4200 });
  expect(() => applyTransfer(next, next.users[2], command, now)).toThrow(
    /already recorded/,
  );
});
test.each([
  { ...command, target: "b1" as const },
  { ...command, quantity: 7000 },
  { ...command, quantity: -1 },
  { ...command, quantity: 1.5 },
  { ...command, quantity: NaN },
  { ...command, quantity: 0 },
])(
  "invalid transfer leaves both branches and movement history unchanged",
  (c) => {
    const d = seedData(),
      before = structuredClone(d);
    expect(() => applyTransfer(d, d.users[2], c, now)).toThrow();
    expect(d).toEqual(before);
  },
);
test("cashier and inactive material cannot transfer", () => {
  const d = seedData();
  expect(() => applyTransfer(d, d.users[0], command, now)).toThrow();
  d.items[0].active = false;
  expect(() => applyTransfer(d, d.users[2], command, now)).toThrow(
    /active material/,
  );
});
