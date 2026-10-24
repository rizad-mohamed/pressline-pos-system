import { expect,test } from "vitest";
import { seedData } from "@/data/seed";
import { applyPriceSettings } from "./price-settings";
import { applyOrderCommand } from "./orders";
import { blankLine,quoteLine } from "./pricing";
const now="2026-10-24T10:00:00.000Z";
test("catalogue changes affect future quotes and orders, preserving history",()=>{const d=seedData(),{version,...values}=d.pricing;const c={type:"pricing" as const,requestId:"prices",expectedVersion:version,values:{...values,a4Bw:2000}};const s=applyPriceSettings(d,d.users[2],c,now);expect(s.pricing.version).toBe(2);expect(s.orders).toEqual(d.orders);expect(s.payments).toEqual(d.payments);const created=applyOrderCommand(s,s.users[0],{type:"create-order",requestId:"future-order",branchId:"b1",customer:{name:"",phone:""},lines:[blankLine()],notes:"",advanceCents:0},now);expect(created.orders[0].totalCents).toBe(2000);expect(created.orders[0].lines[0].ruleVersion).toBe(2);expect(()=>applyPriceSettings(s,s.users[2],c,now)).toThrow(/changed/);expect(()=>applyPriceSettings(d,d.users[0],c,now)).toThrow();expect(()=>applyPriceSettings(d,d.users[2],{...c,values:{...values,a4Bw:0}},now)).toThrow();});
test("fractional duplex rates round up exactly once per unit, in cents",()=>{const d=seedData();const line=quoteLine({...blankLine(),sides:"Duplex",quantity:3},{...d.pricing,a4Bw:101,duplexBps:15000});expect(line.unitCents).toBe(152);expect(line.totalCents).toBe(456);});
