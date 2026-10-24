import { expect, test } from "vitest";
import { seedData } from "@/data/seed";
import { validateData } from "@/data/validation";
import { applyInventoryCommand } from "./inventory";
const now = "2026-10-24T10:00:00.000Z";
test("material create/edit/deactivate preserves opening and movement references", () => {
  const d = seedData("2026-10-24"),
    admin = d.users[2],
    values = {
      name: "Demo paper",
      sku: "NEW-PAP",
      unit: "sheets",
      thresholds: { b1: 10, b2: 5 },
    };
  let s = applyInventoryCommand(
    d,
    admin,
    {
      type: "stock-item",
      requestId: "new-item",
      itemId: null,
      values,
      opening: { b1: 100, b2: 20 },
    },
    now,
  );
  const id = s.items[0].id;
  expect(s.items[0].quantities).toEqual({ b1: 100, b2: 20 });
  expect(validateData(s)).toEqual(s);
  s = applyInventoryCommand(
    s,
    admin,
    {
      type: "stock-item",
      requestId: "edit-item",
      itemId: id,
      values: { ...values, name: "Demo proof paper" },
      opening: { b1: 0, b2: 0 },
    },
    now,
  );
  s = applyInventoryCommand(
    s,
    admin,
    {
      type: "stock-active",
      requestId: "deactivate",
      itemId: id,
      active: false,
    },
    now,
  );
  expect(s.items[0].active).toBe(false);
  expect(s.movements.filter((m) => m.itemId === id)).toHaveLength(2);
  expect(validateData(s)).toEqual(s);
  expect(() =>
    applyInventoryCommand(
      s,
      admin,
      {
        type: "stock-adjust",
        requestId: "inactive",
        itemId: id,
        branchId: "b1",
        delta: 1,
        reason: "Test",
      },
      now,
    ),
  ).toThrow(/Reactivate/);
});
test("adjustment requires admin/reason and conserves a consistent ledger", () => {
  const d = seedData(),
    c = {
      type: "stock-adjust" as const,
      requestId: "adjust",
      itemId: "paper-a4",
      branchId: "b1" as const,
      delta: -100,
      reason: "Demo damaged sheets",
    };
  expect(() => applyInventoryCommand(d, d.users[0], c, now)).toThrow();
  expect(() =>
    applyInventoryCommand(d, d.users[2], { ...c, delta: -7000 }, now),
  ).toThrow(/negative/);
  expect(() =>
    applyInventoryCommand(d, d.users[2], { ...c, reason: "" }, now),
  ).toThrow();
  const s = applyInventoryCommand(d, d.users[2], c, now);
  expect(s.items.find((i) => i.id === "paper-a4")!.quantities.b1).toBe(6700);
  expect(validateData(s)).toEqual(s);
  expect(() => applyInventoryCommand(s, s.users[2], c, now)).toThrow(
    /already recorded/,
  );
  expect(d.items[0].quantities.b1).toBe(6800);
});
test("SKUs are unique and existing balances/units require explicit operations", () => {
  const d = seedData(),
    values = {
      name: "New",
      sku: "PAP-A4-80",
      unit: "sheets",
      thresholds: { b1: 0, b2: 0 },
    },
    base = {
      type: "stock-item" as const,
      requestId: "sku",
      itemId: null,
      values,
      opening: { b1: 0, b2: 0 },
    };
  expect(() => applyInventoryCommand(d, d.users[2], base, now)).toThrow(/SKU/);
  expect(() =>
    applyInventoryCommand(
      d,
      d.users[2],
      { ...base, itemId: "paper-a4", values: { ...values, unit: "packs" } },
      now,
    ),
  ).toThrow(/units/);
  expect(() =>
    applyInventoryCommand(
      d,
      d.users[2],
      { ...base, itemId: "paper-a4", opening: { b1: 1, b2: 0 } },
      now,
    ),
  ).toThrow(/adjustment/);
});
