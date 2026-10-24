import { expect, test } from "vitest";
import { seedData } from "@/data/seed";
import { applyOrderCommand } from "./orders";
import { blankLine } from "./pricing";
import { report } from "./reports";
test("payment cohort and cumulative balance respect midnight, exact cutoff and later events", () => {
  let s = seedData("2026-10-24");
  s.orders = [];
  s.payments = [];
  s = applyOrderCommand(
    s,
    s.users[0],
    {
      type: "create-order",
      requestId: "old-order",
      branchId: "b1",
      customer: { name: "", phone: "" },
      lines: [blankLine()],
      notes: "",
      advanceCents: 0,
    },
    "2026-10-23T18:25:00.000Z",
  );
  const id = s.orders[0].id;
  for (const [requestId, amountCents, time] of [
    ["midnight", 29, "2026-10-23T18:30:00.000Z"],
    ["cutoff", 30, "2026-10-24T04:30:00.000Z"],
    ["after", 31, "2026-10-24T04:30:01.000Z"],
    ["tomorrow", 100, "2026-10-24T18:30:00.000Z"],
  ] as const)
    s = applyOrderCommand(
      s,
      s.users[0],
      { type: "payment", requestId, orderId: id, amountCents, note: "" },
      time,
    );
  const query = { from: "2026-10-24", to: "2026-10-24", scope: "b1" as const };
  const cutoff = report(s, { ...query, cutoff: "2026-10-24T04:30:00.000Z" });
  expect(cutoff.count).toBe(0);
  expect(cutoff.orderValue).toBe(0);
  expect(cutoff.collected).toBe(59);
  expect(cutoff.outstanding).toBe(1441);
  const end = report(s, query);
  expect(end.collected).toBe(90);
  expect(end.outstanding).toBe(1410);
  const yesterday = report(s, {
    from: "2026-10-23",
    to: "2026-10-23",
    scope: "b1",
  });
  expect(yesterday.orderValue).toBe(1500);
  expect(yesterday.collected).toBe(0);
  expect(yesterday.outstanding).toBe(1500);
  expect(() =>
    report(s, { ...query, cutoff: "2026-10-23T10:00:00.000Z" }),
  ).toThrow(/Cutoff/);
});
test("empty period can retain cumulative debt without inventing new revenue", () => {
  const s = seedData("2026-10-24"),
    r = report(s, { from: "2026-11-01", to: "2026-11-01", scope: "all" });
  expect(r.count).toBe(0);
  expect(r.orderValue).toBe(0);
  expect(r.collected).toBe(0);
  expect(r.outstanding).toBeGreaterThan(0);
});
