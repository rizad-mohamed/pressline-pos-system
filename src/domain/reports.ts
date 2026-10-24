import { z } from "zod";
import { type DemoData, type Scope, type BranchId } from "./model";
import { businessDate, dateSchema } from "./dates";
import { sumCents, formatMoney } from "./money";
import { balanceFor } from "./orders";
export const reportQuerySchema = z.object({ from: dateSchema, to: dateSchema, scope: z.enum(["all","b1","b2"]), cutoff: z.string().datetime().optional() }).refine(q => q.from <= q.to, "Start date must be on or before end date.").refine(q=>!q.cutoff||businessDate(q.cutoff)===q.to,"Cutoff must fall on the report's final business date.");
export type ReportQuery = z.infer<typeof reportQuerySchema>;
export type ReportRow = { branchId: BranchId; count: number; orderValue: number; collected: number; outstanding: number; statuses: Record<string,number> };
export type ReportResult = { query: ReportQuery; rows: ReportRow[]; count: number; orderValue: number; collected: number; outstanding: number };
export function report(data: DemoData, query: ReportQuery): ReportResult {
  const q = reportQuerySchema.parse(query); const end = q.cutoff ?? new Date(`${q.to}T23:59:59.999+05:30`).toISOString();
  const inPeriod = (instant: string) => { const date = businessDate(instant); return date >= q.from && date <= q.to && instant <= end; };
  const rows = data.branches.filter(b => q.scope === "all" || b.id === q.scope).map(branch => {
    const orders = data.orders.filter(o => o.branchId === branch.id);
    const cohort = orders.filter(o => inPeriod(o.createdAt));
    const orderIds = new Set(orders.map(o => o.id));
    return { branchId: branch.id, count: cohort.length, orderValue: sumCents(cohort.map(o => o.totalCents)),
      collected: sumCents(data.payments.filter(p => orderIds.has(p.orderId) && inPeriod(p.createdAt)).map(p => p.amountCents)),
      outstanding: sumCents(orders.filter(o => o.createdAt <= end).map(o => balanceFor(data,o,end))),
      statuses: cohort.reduce<Record<string,number>>((out,o) => { out[o.production] = (out[o.production] ?? 0)+1; return out; },{}),
    };
  });
  return { query:q, rows, count: rows.reduce((n,r) => n+r.count,0), orderValue: sumCents(rows.map(r => r.orderValue)), collected: sumCents(rows.map(r => r.collected)), outstanding: sumCents(rows.map(r => r.outstanding)) };
}
export function smsSummary(data: DemoData, date: string, cutoff: string): string {
  const r = report(data,{from:date,to:date,scope:"all",cutoff});
  return `NOT SENT · DEMONSTRATION\n${data.settings.shopName} | ${date} | Asia/Colombo\n${r.rows.map(row => `${data.branches.find(b => b.id === row.branchId)!.name}: ${row.count} orders; value ${formatMoney(row.orderValue)}; collected ${formatMoney(row.collected)}; due ${formatMoney(row.outstanding)}`).join("\n")}\nTotal: ${r.count} orders\nOrder value: ${formatMoney(r.orderValue)}\nSimulated collections: ${formatMoney(r.collected)}\nOutstanding as of cutoff: ${formatMoney(r.outstanding)}\nPreview only. No message sent.`;
}
export const todayReport = (data: DemoData, scope: Scope) => report(data,{ from: businessDate(), to: businessDate(), scope });
