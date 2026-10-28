import { z } from "zod";
import {
  DomainError,
  serviceValuesSchema,
  type DemoData,
  type DemoUser,
  type ServiceValues,
  type LineInput,
} from "./model";
import { assertAdmin, mutate } from "./orders";
import { blankLine } from "./pricing";

export type ServiceCommand =
  | {
      type: "service-save";
      requestId: string;
      serviceId: string | null;
      expectedVersion?: number;
      values: ServiceValues;
    }
  | {
      type: "category-save";
      requestId: string;
      categoryId: string | null;
      name: string;
      expectedName?: string;
    }
  | {
      type: "category-active";
      requestId: string;
      categoryId: string;
      active: boolean;
    };

export function serviceInput(service: DemoData["services"][number]): LineInput {
  return {
    ...blankLine(),
    ...service.defaults,
    description: service.name,
    serviceId: service.id,
    serviceVersion: service.version,
  };
}
export function availableServices(
  data: Pick<DemoData, "services" | "categories">,
) {
  return data.services.filter(
    (s) =>
      s.status === "active" &&
      data.categories.some((c) => c.id === s.categoryId && c.active),
  );
}
export function applyServiceCommand(
  data: DemoData,
  user: DemoUser,
  c: ServiceCommand,
  now: string,
): DemoData {
  assertAdmin(user);
  if (c.type === "category-active") {
    z.boolean().parse(c.active);
    if (!data.categories.some((p) => p.id === c.categoryId))
      throw new DomainError("missing", "Category not found.");
    return mutate(
      data,
      user,
      c.requestId,
      c.active ? "Category reactivated" : "Category archived",
      c.categoryId,
      now,
      (draft) => {
        draft.categories.find((p) => p.id === c.categoryId)!.active = c.active;
      },
    );
  }
  if (c.type === "category-save") {
    const name = z
      .string()
      .trim()
      .min(1, "Enter a category name.")
      .max(50)
      .parse(c.name);
    const old = c.categoryId
      ? data.categories.find((p) => p.id === c.categoryId)
      : null;
    if (c.categoryId && !old)
      throw new DomainError("missing", "Category not found.");
    if (old && old.name !== c.expectedName)
      throw new DomainError(
        "conflict",
        "Category changed. Select it again before editing.",
      );
    if (
      data.categories.some(
        (p) =>
          p.id !== c.categoryId && p.name.toLowerCase() === name.toLowerCase(),
      )
    )
      throw new DomainError(
        "validation",
        "This category name already exists, including archived categories.",
      );
    return mutate(
      data,
      user,
      c.requestId,
      old ? "Category renamed" : "Category created",
      name,
      now,
      (draft) => {
        if (old) draft.categories.find((p) => p.id === old.id)!.name = name;
        else
          draft.categories.push({
            id: `category-${c.requestId}`,
            name,
            active: true,
          });
      },
    );
  }
  const values = serviceValuesSchema.parse(c.values);
  if (values.model === "print") values.unitLabel = "printed sheets";
  const old = c.serviceId
    ? data.services.find((s) => s.id === c.serviceId)
    : null;
  if (c.serviceId && !old)
    throw new DomainError("missing", "Service not found.");
  if (old && old.version !== c.expectedVersion)
    throw new DomainError(
      "conflict",
      "This service changed. Reopen it before saving.",
    );
  const category = data.categories.find((p) => p.id === values.categoryId);
  if (!category || (values.status === "active" && !category.active))
    throw new DomainError(
      "validation",
      "Choose an active category before activating this service.",
    );
  if (
    data.services.some(
      (s) =>
        s.id !== c.serviceId &&
        s.code.toLowerCase() === values.code.toLowerCase(),
    )
  )
    throw new DomainError(
      "validation",
      "Use a unique service code, including archived services.",
    );
  if (
    new Set(values.materials.map((m) => m.itemId)).size !==
    values.materials.length
  )
    throw new DomainError(
      "validation",
      "Use one recipe line per material. Combine its quantity and choose one basis.",
    );
  for (const recipe of values.materials) {
    const item = data.items.find((i) => i.id === recipe.itemId);
    if (
      !item ||
      item.unit !== recipe.unit ||
      (values.status === "active" && !item.active)
    )
      throw new DomainError(
        "validation",
        "Recipe materials must exist, have matching units and be active for an active service.",
      );
  }
  return mutate(
    data,
    user,
    c.requestId,
    old ? "Service updated" : "Service created",
    values.name,
    now,
    (draft) => {
      const next = {
        ...values,
        id: old?.id ?? `svc-${c.requestId}`,
        version: (old?.version ?? 0) + 1,
        createdAt: old?.createdAt ?? now,
        updatedAt: now,
      };
      if (old)
        Object.assign(
          draft.services.find((s) => s.id === old.id)!,
          next,
        );
      else draft.services.push(next);
    },
  );
}
