import { z } from "zod";
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => { const d = new Date(`${v}T00:00:00Z`); return !Number.isNaN(d.getTime()) && d.toISOString().slice(0,10) === v; }, "Choose a valid calendar date.");
export function businessDate(value: string | Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(value));
  return ["year", "month", "day"].map(type => parts.find(p => p.type === type)!.value).join("-");
}
export function dateTime(value: string): string { return new Intl.DateTimeFormat("en-LK", { timeZone: "Asia/Colombo", dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
export function shortDate(value: string): string { return new Intl.DateTimeFormat("en-LK", { timeZone: "Asia/Colombo", month: "short", day: "numeric" }).format(new Date(value)); }
export function shiftDate(date: string, days: number): string { dateSchema.parse(date); const d = new Date(`${date}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0,10); }
export function periodRange(period: "daily" | "weekly" | "monthly", anchor: string) {
  dateSchema.parse(anchor); const d = new Date(`${anchor}T00:00:00Z`);
  if (period === "daily") return { from: anchor, to: anchor };
  if (period === "weekly") { const from = shiftDate(anchor, -((d.getUTCDay() + 6) % 7)); return { from, to: shiftDate(from, 6) }; }
  const from = `${anchor.slice(0,7)}-01`; d.setUTCMonth(d.getUTCMonth()+1,0);
  return { from, to: d.toISOString().slice(0,10) };
}
export function cutoffInstant(date: string, time: string): string { dateSchema.parse(date); if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error("Choose a valid cutoff time."); return new Date(`${date}T${time}:00+05:30`).toISOString(); }
