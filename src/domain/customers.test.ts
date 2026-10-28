import { describe, it, expect } from "vitest";
import { seedData } from "@/data/seed";
import { validateData } from "@/data/validation";
import { applyCustomerCommand, customerLedger } from "./customers";
import { applyOrderCommand } from "./orders";
import { blankLine } from "./pricing";
import { savedCustomerValuesSchema } from "./model";

const now = "2026-10-24T10:00:00.000Z";
const values = {
  kind: "Business" as const,
  name: "ABC Company · fictional",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
  notes: "Demo only",
};
const create = {
  type: "customer-save" as const,
  requestId: "abc",
  customerId: null,
  values,
};
describe("connected customer ledger", () => {
  it("permits cashier creation, normalizes international contacts and warns on likely duplicates", () => {
    const d = seedData("2026-10-24");
    const next = applyCustomerCommand(
      d,
      d.users[0],
      { ...create, values: { ...values, phone: "+44 (7700) 900-123" } },
      now,
    );
    expect(next.customers[0].phone).toBe("+447700900123");
    expect(d.customers).toHaveLength(2);
    expect(() =>
      applyCustomerCommand(
        next,
        next.users[0],
        { ...create, requestId: "duplicate" },
        now,
      ),
    ).toThrow(/similar name/);
    const separate = applyCustomerCommand(
      next,
      next.users[0],
      { ...create, requestId: "separate", allowDuplicate: true },
      now,
    );
    expect(separate.customers).toHaveLength(4);
    expect(validateData(separate)).toEqual(separate);
  });
  it("updates customer receivables from actual permitted order/payment records", () => {
    let d = seedData("2026-10-24");
    d = applyCustomerCommand(d, d.users[2], create, now);
    for (const [index, branchId] of (["b1", "b2"] as const).entries())
      d = applyOrderCommand(
        d,
        d.users[2],
        {
          type: "create-order",
          requestId: `order-${index}`,
          branchId,
          customerId: "cust-abc",
          customer: { name: values.name, phone: "" },
          lines: [{ ...blankLine(), quantity: 10 }],
          notes: "",
          advanceCents: 5000,
        },
        now,
      );
    expect(customerLedger(d, d.users[0], "cust-abc")).toMatchObject({
      orderValue: 15000,
      paid: 5000,
      outstanding: 10000,
    });
    expect(customerLedger(d, d.users[2], "cust-abc").outstanding).toBe(20000);
    const b1 = d.orders.find(
      (o) => o.customerId === "cust-abc" && o.branchId === "b1",
    )!;
    d = applyOrderCommand(
      d,
      d.users[0],
      {
        type: "payment",
        requestId: "later",
        orderId: b1.id,
        amountCents: 3000,
        note: "Later simulated collection",
      },
      now,
    );
    expect(customerLedger(d, d.users[0], "cust-abc").outstanding).toBe(7000);
    expect(customerLedger(d, d.users[1], "cust-abc").outstanding).toBe(10000);
  });
  it("retains immutable IDs, order name snapshots and balances after rename/archive/reactivation", () => {
    let d = seedData("2026-10-24");
    d = applyCustomerCommand(d, d.users[2], create, now);
    d = applyOrderCommand(
      d,
      d.users[0],
      {
        type: "create-order",
        requestId: "order",
        branchId: "b1",
        customerId: "cust-abc",
        customer: { name: values.name, phone: "" },
        lines: [blankLine()],
        notes: "",
        advanceCents: 0,
      },
      now,
    );
    const saved = structuredClone(d.orders[0]);
    expect(() =>
      applyCustomerCommand(
        d,
        d.users[0],
        {
          ...create,
          customerId: "cust-abc",
          requestId: "edit",
          expectedUpdatedAt: now,
        },
        now,
      ),
    ).toThrow(/Administrator/);
    d = applyCustomerCommand(
      d,
      d.users[2],
      {
        ...create,
        customerId: "cust-abc",
        requestId: "edit",
        expectedUpdatedAt: now,
        values: { ...values, name: "Renamed fictional company" },
      },
      now,
    );
    d = applyCustomerCommand(
      d,
      d.users[2],
      {
        type: "customer-active",
        requestId: "archive",
        customerId: "cust-abc",
        active: false,
      },
      now,
    );
    expect(d.orders[0]).toEqual(saved);
    expect(customerLedger(d, d.users[0], "cust-abc").outstanding).toBe(1500);
    expect(() =>
      applyOrderCommand(
        d,
        d.users[0],
        {
          type: "create-order",
          requestId: "archived",
          branchId: "b1",
          customerId: "cust-abc",
          customer: saved.customer,
          lines: [blankLine()],
          notes: "",
          advanceCents: 0,
        },
        now,
      ),
    ).toThrow(/archived/);
    d = applyCustomerCommand(
      d,
      d.users[2],
      {
        type: "customer-active",
        requestId: "reactivate",
        customerId: "cust-abc",
        active: true,
      },
      now,
    );
    expect(d.customers[0].id).toBe("cust-abc");
    expect(validateData(d)).toEqual(d);
  });
  it("links legacy orders explicitly without changing their snapshot and denies wrong-branch association", () => {
    let d = seedData("2026-10-24");
    d = applyCustomerCommand(d, d.users[2], create, now);
    const order = d.orders.find((o) => o.branchId === "b2")!;
    const snapshot = structuredClone(order.customer);
    const link = {
      type: "link-customer" as const,
      requestId: "link",
      orderId: order.id,
      customerId: "cust-abc",
    };
    expect(() => applyCustomerCommand(d, d.users[0], link, now)).toThrow(
      /assigned branch/,
    );
    d = applyCustomerCommand(d, d.users[1], link, now);
    expect(d.orders.find((o) => o.id === order.id)?.customer).toEqual(snapshot);
    expect(customerLedger(d, d.users[0], "cust-abc").orders).toHaveLength(0);
    expect(customerLedger(d, d.users[1], "cust-abc").orders).toHaveLength(1);
    expect(() =>
      applyCustomerCommand(d, d.users[1], { ...link, requestId: "again" }, now),
    ).toThrow(/already has/);
  });
  it("keeps optional fields optional, rejects invalid contacts and stale profile edits", () => {
    expect(savedCustomerValuesSchema.safeParse(values).success).toBe(true);
    expect(
      savedCustomerValuesSchema.safeParse({ ...values, email: "invalid" })
        .success,
    ).toBe(false);
    expect(
      savedCustomerValuesSchema.safeParse({ ...values, phone: "123" }).success,
    ).toBe(false);
    let d = seedData("2026-10-24");
    d = applyCustomerCommand(d, d.users[2], create, now);
    expect(() =>
      applyCustomerCommand(
        d,
        d.users[2],
        {
          ...create,
          requestId: "stale",
          customerId: "cust-abc",
          expectedUpdatedAt: "old",
        },
        now,
      ),
    ).toThrow(/changed/);
  });
});
