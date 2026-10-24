import { expect, test } from "vitest";
import { seedData } from "@/data/seed";
import { blankLine } from "./pricing";
import { applyOrderCommand } from "./orders";
import { smsSummary } from "./reports";
import { formatMoney } from "./money";
import { smsConfigSchema } from "./model";
import { applySmsConfig } from "./sms";
test("unsent message derives branch and consolidated values from updated transactions", () => {
  let d = seedData("2026-10-24");
  d.orders = [];
  d.payments = [];
  d = applyOrderCommand(
    d,
    d.users[0],
    {
      type: "create-order",
      requestId: "sms-order",
      branchId: "b1",
      customer: { name: "", phone: "" },
      lines: [{ ...blankLine(), quantity: 2 }],
      notes: "",
      advanceCents: 1000,
    },
    "2026-10-24T05:00:00.000Z",
  );
  const id = d.orders[0].id;
  d = applyOrderCommand(
    d,
    d.users[0],
    {
      type: "payment",
      requestId: "sms-pay",
      orderId: id,
      amountCents: 500,
      note: "",
    },
    "2026-10-24T05:01:00.000Z",
  );
  const text = smsSummary(d, "2026-10-24", "2026-10-24T18:29:00.000Z");
  expect(text).toContain("NOT SENT");
  expect(text).toContain("Total: 1 orders");
  expect(text).toContain(`Order value: ${formatMoney(3000)}`);
  expect(text).toContain(`Simulated collections: ${formatMoney(1500)}`);
  expect(text).toContain(`Outstanding as of cutoff: ${formatMoney(1500)}`);
  expect(text).toContain("Branch 2: 0 orders");
});
test("SMS settings accept optional fictional contact but cannot enable live sending", () => {
  const d = seedData(),
    values = {
      phone: "077 000 0000",
      cutoff: "18:00",
      enabled: false as const,
    };
  const s = applySmsConfig(
    d,
    d.users[2],
    { type: "sms-config", requestId: "sms-settings", values },
    "2026-10-24T05:00:00.000Z",
  );
  expect(s.settings.sms).toEqual(values);
  expect(smsConfigSchema.safeParse({ ...values, enabled: true }).success).toBe(
    false,
  );
  expect(
    smsConfigSchema.safeParse({ ...values, phone: "not a phone" }).success,
  ).toBe(false);
  expect(
    smsConfigSchema.safeParse({ ...values, cutoff: "25:00" }).success,
  ).toBe(false);
  expect(() =>
    applySmsConfig(
      d,
      d.users[0],
      { type: "sms-config", requestId: "forbidden", values },
      "2026-10-24T05:00:00.000Z",
    ),
  ).toThrow();
});
