import {
  pricingSchema,
  DomainError,
  type DemoData,
  type DemoUser,
  type PriceCommand,
} from "./model";
import { assertAdmin, mutate } from "./orders";
export function applyPriceSettings(
  data: DemoData,
  user: DemoUser,
  c: PriceCommand,
  now: string,
): DemoData {
  assertAdmin(user);
  if (c.expectedVersion !== data.pricing.version)
    throw new DomainError(
      "conflict",
      "Price rules changed since this drawer opened. Close it and review the current catalogue.",
    );
  const pricing = pricingSchema.parse({
    ...c.values,
    version: data.pricing.version + 1,
  });
  return mutate(
    data,
    user,
    c.requestId,
    "Demonstration prices updated",
    `Catalogue version ${pricing.version}; existing order snapshots unchanged`,
    now,
    (draft) => {
      draft.pricing = pricing;
    },
  );
}
