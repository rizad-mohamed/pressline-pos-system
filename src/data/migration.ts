import { legacyDataSchema } from "@/domain/model";
import { seedCatalogue } from "./catalogue-seed";

/** Pure in-memory upgrade. Never reset, guess customer links or write storage here. */
export function migrateDemoData(value: unknown): unknown {
  if (
    typeof value !== "object" ||
    value === null ||
    !("version" in value) ||
    value.version !== 1
  )
    return value;
  const legacy = legacyDataSchema.parse(value);
  return {
    ...legacy,
    version: 2,
    orders: legacy.orders.map((order) => ({ ...order, customerId: null })),
    customers: [],
    ...seedCatalogue(),
    usages: [],
  };
}
