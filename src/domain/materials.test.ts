import { describe, it, expect } from "vitest";
import { seedData } from "@/data/seed";
import { validateData } from "@/data/validation";
import { createDemoRepository } from "@/data/repository";
import { executeCommand } from "./commands";
import { balanceFor } from "./orders";
import { serviceInput } from "./services";
import { customerLedger } from "./customers";
import type { Command, DemoData, MaterialInput } from "./model";

const now = "2026-10-24T10:00:00.000Z";
function apply(d: DemoData, c: Command, actor = 0) {
  return validateData(executeCommand(d, d.users[actor], c, now));
}
function setup(lineCount = 1) {
  let d = seedData("2026-10-24");
  d = apply(
    d,
    {
      type: "service-save",
      requestId: "banner",
      serviceId: null,
      values: {
        ...d.services[0],
        code: "BANNER-DEMO",
        name: "Banner Printing",
        model: "unit",
        rateCents: 350000,
        setupCents: 0,
        unitLabel: "jobs",
        defaults: null,
        choices: null,
        materials: [
          { itemId: "banner-roll", unit: "rolls", quantity: 2, basis: "job" },
        ],
      },
    },
    2,
  );
  d = apply(d, {
    type: "create-order",
    requestId: "order",
    branchId: "b1",
    customerId: d.customers[0].id,
    customer: { name: d.customers[0].name, phone: d.customers[0].phone },
    lines: Array.from({ length: lineCount }, () =>
      serviceInput(d.services.at(-1)!),
    ),
    notes: "",
    advanceCents: 100000,
  });
  return d;
}
function plan(
  d: DemoData,
  lines: MaterialInput[],
  additional = false,
  requestId = "plan",
) {
  const o = d.orders[0],
    p = o.materialPlan;
  return apply(d, {
    type: "material-plan",
    requestId,
    orderId: o.id,
    expectedPlanId: p?.id ?? null,
    expectedRevision: p?.revision ?? 0,
    additional,
    lines,
  });
}
function confirm(d: DemoData, requestId = "confirm") {
  const o = d.orders[0];
  return apply(d, {
    type: "material-confirm",
    requestId,
    orderId: o.id,
    planId: o.materialPlan!.id,
    expectedRevision: o.materialPlan!.revision,
    reason: "Actual banner material used",
  });
}
const rolls = (d: DemoData) =>
  d.items.find((i) => i.id === "banner-roll")!.quantities;

describe("explicit job material usage", () => {
  it("retains accepted service identity when job descriptions and live catalogue names differ", () => {
    let d = setup();
    const service = d.services.at(-1)!;
    d = apply(d, {
      type: "create-order",
      requestId: "custom-description",
      branchId: "b1",
      customer: { name: "", phone: "" },
      lines: [
        {
          ...serviceInput(service),
          description: "Birthday banner for collection",
        },
      ],
      notes: "",
      advanceCents: 0,
    });
    d = apply(
      d,
      {
        type: "service-save",
        requestId: "catalogue-renamed",
        serviceId: service.id,
        expectedVersion: service.version,
        values: { ...service, name: "Large-format banner service" },
      },
      2,
    );
    d = confirm(d);
    expect(d.orders[0].lines[0].description).toBe(
      "Birthday banner for collection",
    );
    expect(d.usages[0].lines[0].serviceName).toBe("Banner Printing");
    expect(d.movements[0].serviceName).toBe("Banner Printing");
  });
  it("keeps catalogue selection, order save, plan editing and production independent of stock", () => {
    let d = setup();
    expect(d.orders[0].materialPlan?.lines[0].quantity).toBe(2);
    expect(rolls(d)).toEqual({ b1: 20, b2: 12 });
    d = plan(d, [{ ...d.orders[0].materialPlan!.lines[0], quantity: 5 }]);
    d = apply(d, {
      type: "production",
      requestId: "production",
      orderId: d.orders[0].id,
      next: "In Progress",
    });
    expect(rolls(d)).toEqual({ b1: 20, b2: 12 });
    expect(d.usages).toHaveLength(0);
  });
  it("atomically records 20 to 15 at one branch with complete immutable movement evidence and no receivable change", () => {
    let d = setup();
    d = plan(d, [{ ...d.orders[0].materialPlan!.lines[0], quantity: 5 }]);
    const before = structuredClone(d),
      ledger = customerLedger(d, d.users[0], d.customers[0].id);
    d = confirm(d);
    expect(rolls(d)).toEqual({ b1: 15, b2: 12 });
    expect(rolls(before).b1).toBe(20);
    expect(d.orders).toEqual(before.orders);
    expect(d.payments).toEqual(before.payments);
    expect(customerLedger(d, d.users[0], d.customers[0].id)).toEqual(ledger);
    const event = d.usages[0],
      line = event.lines[0],
      move = d.movements.find((m) => m.id === line.movementId)!;
    expect(event).toMatchObject({
      id: `usage-${d.orders[0].materialPlan!.id}`,
      orderId: d.orders[0].id,
      branchId: "b1",
      actorId: d.users[0].id,
      createdAt: now,
      kind: "consumption",
      correctsId: null,
    });
    expect(move).toMatchObject({
      usageId: event.id,
      orderId: event.orderId,
      lineId: line.lineId,
      serviceName: "Banner Printing",
      itemId: "banner-roll",
      unit: "rolls",
      delta: -5,
      before: 20,
      after: 15,
      reason: event.reason,
    });
    expect(balanceFor(d, d.orders[0])).toBe(250000);
    d = apply(d, {
      type: "payment",
      requestId: "later",
      orderId: d.orders[0].id,
      amountCents: 50000,
      note: "Later simulated payment",
    });
    expect(balanceFor(d, d.orders[0])).toBe(200000);
    expect(rolls(d).b1).toBe(15);
  });
  it("blocks the same confirmed plan under a different request and forbids editing recorded history", () => {
    let d = setup();
    d = confirm(d);
    expect(() => confirm(d, "different-request")).toThrow(/already recorded/);
    expect(() =>
      plan(d, [{ ...d.orders[0].materialPlan!.lines[0], quantity: 5 }]),
    ).toThrow(/immutable/);
    const next = plan(
      d,
      [{ ...d.orders[0].materialPlan!.lines[0], quantity: 3 }],
      true,
      "additional",
    );
    expect(next.orders[0].materialPlan!.id).not.toBe(
      d.orders[0].materialPlan!.id,
    );
    const final = confirm(next, "additional-confirm");
    expect(rolls(final).b1).toBe(15);
    expect(final.usages).toHaveLength(2);
    expect(final.usages[1]).toEqual(d.usages[0]);
  });
  it("aggregates one material across multiple order lines before checking availability without partial debits", () => {
    let d = setup(2);
    d = plan(
      d,
      d.orders[0].materialPlan!.lines.map((l) => ({ ...l, quantity: 11 })),
    );
    const before = structuredClone(d);
    expect(() => confirm(d)).toThrow(/full job needs 22/);
    expect(d).toEqual(before);
    d = plan(
      d,
      d.orders[0].materialPlan!.lines.map((l) => ({ ...l, quantity: 10 })),
      false,
      "reduced",
    );
    d = confirm(d);
    expect(rolls(d).b1).toBe(0);
    expect(d.usages[0].lines.map((l) => [l.before, l.after])).toEqual([
      [20, 10],
      [10, 0],
    ]);
    expect(d.movements.filter((m) => m.usageId)).toHaveLength(2);
  });
  it("rejects invalid quantities, wrong units, unknown materials, duplicate rows and foreign job lines", () => {
    const d = setup(),
      l = d.orders[0].materialPlan!.lines[0];
    for (const quantity of [0, -1, 1.5, NaN, Infinity, 10_000_001])
      expect(() => plan(d, [{ ...l, quantity }])).toThrow();
    for (const change of [
      { unit: "meters" },
      { itemId: "missing" },
      { lineId: "other-line" },
    ])
      expect(() => plan(d, [{ ...l, ...change }])).toThrow(/active material/);
    expect(() => plan(d, [l, l])).toThrow(/duplicate material/);
    const inactive = apply(
      d,
      {
        type: "stock-active",
        requestId: "inactive",
        itemId: "banner-roll",
        active: false,
      },
      2,
    );
    expect(() => confirm(inactive)).toThrow(/active material/);
    expect(rolls(d).b1).toBe(20);
  });
  it("enforces order branch and stale-plan guards and permits a valid legacy plan without a recipe", () => {
    const d = setup(),
      o = d.orders[0],
      p = o.materialPlan!;
    const c = {
      type: "material-confirm" as const,
      requestId: "wrong",
      orderId: o.id,
      planId: p.id,
      expectedRevision: p.revision,
      reason: "Actual usage",
    };
    expect(() => apply(d, c, 1)).toThrow(/assigned branch/);
    const next = plan(d, [{ ...p.lines[0], quantity: 5 }]);
    expect(() => apply(next, c)).toThrow(/plan changed/);
    const legacy = structuredClone(d);
    delete legacy.orders[0].materialPlan;
    expect(plan(legacy, [p.lines[0]]).orders[0].materialPlan?.lines).toEqual(
      p.lines,
    );
    const empty = plan(d, []);
    expect(() => confirm(empty)).toThrow(/at least one/);
  });
  it("allows a reasoned admin compensating correction exactly once without rewriting original events", () => {
    let d = setup();
    d = plan(d, [{ ...d.orders[0].materialPlan!.lines[0], quantity: 5 }]);
    d = confirm(d);
    const original = structuredClone(d.usages[0]);
    const c = {
      type: "material-correct" as const,
      requestId: "correction",
      usageId: original.id,
      reason: "Entered five rolls in error; actual use was two",
    };
    expect(() => apply(d, c)).toThrow(/Administrator/);
    expect(() => apply(d, { ...c, reason: " " }, 2)).toThrow();
    d = apply(d, c, 2);
    expect(rolls(d)).toEqual({ b1: 20, b2: 12 });
    expect(d.usages[1]).toEqual(original);
    expect(d.usages[0]).toMatchObject({
      kind: "correction",
      correctsId: original.id,
      lines: [{ quantity: 5, before: 15, after: 20 }],
    });
    expect(() =>
      apply(d, { ...c, requestId: "different-correction" }, 2),
    ).toThrow(/already has/);
    expect(() => confirm(d, "reconfirm-after-correction")).toThrow(
      /already recorded/,
    );
    d = plan(
      d,
      [{ ...d.orders[0].materialPlan!.lines[0], quantity: 2 }],
      true,
      "correct-actual",
    );
    d = confirm(d, "actual");
    expect(rolls(d).b1).toBe(18);
    expect(d.usages).toHaveLength(3);
  });
  it("maintains separate transfer and manual adjustment ledgers before and after consumption", () => {
    let d = setup();
    d = confirm(d);
    d = apply(
      d,
      {
        type: "transfer",
        requestId: "transfer",
        itemId: "banner-roll",
        source: "b1",
        target: "b2",
        quantity: 3,
        note: "Independent stock relocation",
      },
      2,
    );
    d = apply(
      d,
      {
        type: "stock-adjust",
        requestId: "adjust",
        itemId: "banner-roll",
        branchId: "b1",
        delta: 1,
        reason: "Independent stock count correction",
      },
      2,
    );
    expect(rolls(d)).toEqual({ b1: 16, b2: 15 });
    expect(d.usages).toHaveLength(1);
    expect(
      d.movements.filter((m) => m.transferId === "TR-transfer"),
    ).toHaveLength(2);
  });
  it("rejects corrupted usage, branch, quantity, movement and before/after evidence on reload", () => {
    const d = confirm(setup());
    const changes = [
      (x: DemoData) => {
        x.usages[0].branchId = "b2";
      },
      (x: DemoData) => {
        x.usages[0].lines[0].quantity = 3;
      },
      (x: DemoData) => {
        x.usages[0].lines[0].movementId = "missing";
      },
      (x: DemoData) => {
        x.movements[0].usageId = "orphan";
      },
      (x: DemoData) => {
        x.usages[0].lines[0].before += 1;
        x.usages[0].lines[0].after += 1;
        x.movements[0].before! += 1;
        x.movements[0].after! += 1;
      },
    ];
    for (const change of changes) {
      const broken = structuredClone(d);
      change(broken);
      expect(() => validateData(broken)).toThrow(/inconsistent/);
    }
  });
  it("persists duplicate guards across reload, rejects stale tabs and keeps failed durable stock saves atomic", async () => {
    const d = setup();
    d.sessionId = "cashier-b1";
    let raw = JSON.stringify(d),
      fail = false;
    const storage = {
      getItem: () => raw,
      setItem: (_k: string, v: string) => {
        if (fail) throw new Error("quota");
        raw = v;
      },
      removeItem: () => {
        raw = "";
      },
    };
    const a = createDemoRepository(
        () => storage,
        () => now,
      ),
      b = createDemoRepository(
        () => storage,
        () => now,
      );
    a.hydrate();
    b.hydrate();
    const o = d.orders[0],
      p = o.materialPlan!;
    const c = {
      type: "material-confirm" as const,
      requestId: "persist",
      orderId: o.id,
      planId: p.id,
      expectedRevision: p.revision,
      reason: "Actual material usage",
    };
    fail = true;
    expect((await a.execute(c)).ok).toBe(false);
    expect(a.getSnapshot().data!.usages).toHaveLength(0);
    expect(JSON.parse(raw).usages).toHaveLength(0);
    fail = false;
    expect((await a.execute(c)).ok).toBe(true);
    expect((await b.execute({ ...c, requestId: "stale" })).ok).toBe(false);
    const reloaded = createDemoRepository(
      () => storage,
      () => now,
    );
    reloaded.hydrate();
    const second = await reloaded.execute({ ...c, requestId: "reload" });
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.error.code).toBe("duplicate");
    expect(rolls(reloaded.getSnapshot().data!).b1).toBe(18);
    expect(storage.getItem()).toBe(raw);
  });
});
