import { centsSchema, DomainError } from "./model";
export function money(value: string): number {
  const trimmed = value.trim();
  if (!/^\d{1,10}(?:\.\d{1,2})?$/.test(trimmed)) throw new DomainError("validation", "Enter a non-negative LKR amount with at most two decimal places.");
  const [whole, fraction = ""] = trimmed.split(".");
  return centsSchema.parse(Number(whole) * 100 + Number(fraction.padEnd(2, "0")));
}
export function formatMoney(cents: number): string { return new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 2 }).format(centsSchema.parse(cents) / 100); }
export function moneyInput(cents: number): string { return (cents / 100).toFixed(2); }
export function sumCents(values: number[]): number { return centsSchema.parse(values.reduce((sum, value) => sum + centsSchema.parse(value), 0)); }
