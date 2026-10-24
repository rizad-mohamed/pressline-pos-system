import { lineInputSchema, pricingSchema, centsSchema, type LineInput, type OrderLine, type Pricing } from "./model";
import { sumCents } from "./money";
export function quoteLine(input: LineInput, pricing: Pricing, id = "quote"): OrderLine {
  const line = lineInputSchema.parse(input); const p = pricingSchema.parse(pricing);
  const rate = line.size === "A4" ? (line.color === "B&W" ? p.a4Bw : p.a4Color) : (line.color === "B&W" ? p.a3Bw : p.a3Color);
  const unitCents = Math.ceil(rate * (line.sides === "Duplex" ? p.duplexBps : 10000) / 10000);
  const setupCents = sumCents([line.binding === "Spiral" ? p.spiral : line.binding === "Comb" ? p.comb : 0, line.finishing === "Lamination" ? p.lamination : line.finishing === "Trimming" ? p.trimming : 0]);
  return { ...line, id, unitCents, setupCents, totalCents: centsSchema.parse(line.quantity * unitCents + setupCents), ruleVersion: p.version };
}
export function quoteOrder(lines: LineInput[], pricing: Pricing) {
  if (!lines.length || lines.length > 30) throw new Error("Add between 1 and 30 print items.");
  const quoted = lines.map((line, index) => quoteLine(line, pricing, `line-${index + 1}`));
  return { lines: quoted, totalCents: sumCents(quoted.map(line => line.totalCents)) };
}
export const blankLine = (): LineInput => ({ description: "Document printing", size: "A4", color: "B&W", sides: "Simplex", binding: "None", finishing: "None", quantity: 1, notes: "" });
