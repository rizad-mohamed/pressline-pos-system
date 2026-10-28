import {
  lineInputSchema,
  pricingSchema,
  centsSchema,
  type LineInput,
  type OrderLine,
  type Pricing,
  type DemoData,
  DomainError,
} from "./model";
import { sumCents } from "./money";
export type Catalogue = Pick<DemoData, "services" | "categories">;
export function lineSummary(line: OrderLine): string {
  if (line.serviceSnapshot?.model === "unit")
    return `${line.quantity} ${line.serviceSnapshot.unitLabel} · ${line.serviceSnapshot.name}`;
  return `${line.size} · ${line.color} · ${line.sides} · ${line.quantity} printed sheets · ${line.binding} binding · ${line.finishing} finishing`;
}
export function quoteLine(
  input: LineInput,
  pricing: Pricing,
  id = "quote",
  catalogue?: Catalogue,
): OrderLine {
  const line = lineInputSchema.parse(input);
  const p = pricingSchema.parse(pricing);
  const service = line.serviceId
    ? catalogue?.services.find((s) => s.id === line.serviceId)
    : undefined;
  if (
    line.serviceId &&
    (!service ||
      service.status !== "active" ||
      !catalogue?.categories.some(
        (c) => c.id === service.categoryId && c.active,
      ))
  )
    throw new DomainError(
      "validation",
      "This service or category is inactive, archived or unavailable. Remove it and choose an active service.",
    );
  if (service && line.serviceVersion !== service.version)
    throw new DomainError(
      "conflict",
      "This service changed. Refresh its configuration and review the current price.",
    );
  if (service?.model === "print")
    for (const key of [
      "size",
      "color",
      "sides",
      "binding",
      "finishing",
    ] as const)
      if (
        !(service.choices?.[key] as readonly string[] | undefined)?.includes(
          line[key],
        )
      )
        throw new DomainError(
          "validation",
          `The service does not support this ${key}. Use its current defaults.`,
        );
  const rate =
    line.size === "A4"
      ? line.color === "B&W"
        ? p.a4Bw
        : p.a4Color
      : line.color === "B&W"
        ? p.a3Bw
        : p.a3Color;
  const unitCents =
    service?.model === "unit"
      ? service.rateCents
      : Math.ceil(
          (rate * (line.sides === "Duplex" ? p.duplexBps : 10000)) / 10000,
        );
  const setupCents =
    service?.model === "unit"
      ? service.setupCents
      : sumCents([
          line.binding === "Spiral"
            ? p.spiral
            : line.binding === "Comb"
              ? p.comb
              : 0,
          line.finishing === "Lamination"
            ? p.lamination
            : line.finishing === "Trimming"
              ? p.trimming
              : 0,
        ]);
  return {
    ...line,
    id,
    unitCents,
    setupCents,
    totalCents: centsSchema.parse(line.quantity * unitCents + setupCents),
    ruleVersion: p.version,
    ...(service
      ? {
          serviceSnapshot: {
            id: service.id,
            code: service.code,
            name: service.name,
            category: catalogue!.categories.find(
              (c) => c.id === service.categoryId,
            )!.name,
            model: service.model,
            unitLabel: service.unitLabel,
            version: service.version,
          },
          materialSuggestions: structuredClone(service.materials),
        }
      : {}),
  };
}
export function quoteOrder(
  lines: LineInput[],
  pricing: Pricing,
  catalogue?: Catalogue,
) {
  if (!lines.length || lines.length > 30)
    throw new Error("Add between 1 and 30 print items.");
  const quoted = lines.map((line, index) =>
    quoteLine(line, pricing, `line-${index + 1}`, catalogue),
  );
  return {
    lines: quoted,
    totalCents: sumCents(quoted.map((line) => line.totalCents)),
  };
}
export const blankLine = (): LineInput => ({
  description: "Document printing",
  size: "A4",
  color: "B&W",
  sides: "Simplex",
  binding: "None",
  finishing: "None",
  quantity: 1,
  notes: "",
});
