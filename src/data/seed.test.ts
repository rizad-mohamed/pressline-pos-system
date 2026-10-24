import { expect,test } from "vitest";
import { seedData } from "./seed";
import { validateData } from "./validation";
import { applyOrderCommand, paidFor } from "@/domain/orders";
import { businessDate } from "@/domain/dates";
test("today's seeded orders accept payment one second after Colombo midnight",()=>{
  const now="2026-10-23T18:30:01.000Z",data=seedData("2026-10-24");
  expect(data.orders.filter(o=>businessDate(o.createdAt)==="2026-10-24").every(o=>o.createdAt<now)).toBe(true);
  const next=applyOrderCommand(data,data.users[0],{type:"payment",requestId:"early-payment",orderId:"PL-1012",amountCents:100,note:"Early-day regression"},now);
  expect(validateData(next)).toEqual(next);expect(paidFor(next,"PL-1012")).toBe(100);
});
test("legacy future fixture has an actionable recovery message",()=>{
  const data=seedData("2026-10-24");data.orders[0].createdAt="2026-10-24T10:00:00.000Z";
  expect(()=>applyOrderCommand(data,data.users[0],{type:"payment",requestId:"future-payment",orderId:"PL-1012",amountCents:100,note:""},"2026-10-24T00:00:00.000Z")).toThrow(/Reset demo fixtures/);
});
