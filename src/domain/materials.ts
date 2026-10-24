import { z } from "zod";
import {
  countSchema,
  materialInputSchema,
  DomainError,
  type DemoData,
  type DemoUser,
  type MaterialInput,
  type MaterialPlan,
  type MaterialUsage,
  type Order,
  type OrderLine,
} from "./model";
import { assertAdmin, assertBranch, mutate } from "./orders";

export type MaterialCommand =
  | {
      type: "material-plan";
      requestId: string;
      orderId: string;
      expectedPlanId: string | null;
      expectedRevision: number;
      additional: boolean;
      lines: MaterialInput[];
    }
  | {
      type: "material-confirm";
      requestId: string;
      orderId: string;
      planId: string;
      expectedRevision: number;
      reason: string;
    }
  | {
      type: "material-correct";
      requestId: string;
      usageId: string;
      reason: string;
    };

export function initialMaterialPlan(
  orderId: string,
  lines: OrderLine[],
): MaterialPlan {
  return {
    id: `plan-${orderId}-initial`,
    revision: 0,
    lines: lines.flatMap((line) =>
      (line.materialSuggestions ?? []).map((recipe) =>
        materialInputSchema.parse({
          lineId: line.id,
          itemId: recipe.itemId,
          unit: recipe.unit,
          quantity:
            recipe.quantity * (recipe.basis === "unit" ? line.quantity : 1),
        }),
      ),
    ),
  };
}

export function materialTotals(lines: MaterialInput[]) {
  const totals = new Map<string, number>();
  for (const line of lines)
    totals.set(line.itemId, (totals.get(line.itemId) ?? 0) + line.quantity);
  return totals;
}

function checkLines(
  data: DemoData,
  order: Order,
  values: MaterialInput[],
  active: boolean,
) {
  const lines = z.array(materialInputSchema).max(600).parse(values);
  const keys = new Set<string>();
  for (const line of lines) {
    const key = `${line.lineId}/${line.itemId}`;
    if (keys.has(key))
      throw new DomainError(
        "validation",
        "Combine duplicate material rows for the same job item.",
      );
    keys.add(key);
    const item = data.items.find((i) => i.id === line.itemId);
    if (
      !order.lines.some((l) => l.id === line.lineId) ||
      !item ||
      item.unit !== line.unit ||
      (active && !item.active)
    )
      throw new DomainError(
        "validation",
        "Choose an active material and its exact stock unit for an existing job item.",
      );
  }
  return lines;
}

export function applyMaterialCommand(
  data: DemoData,
  user: DemoUser,
  c: MaterialCommand,
  now: string,
): DemoData {
  const original =
    c.type === "material-correct"
      ? data.usages.find((u) => u.id === c.usageId)
      : undefined;
  const orderId = c.type === "material-correct" ? original?.orderId : c.orderId;
  const order = data.orders.find((o) => o.id === orderId);
  if (!order)
    throw new DomainError(
      "missing",
      "The job or recorded usage is unavailable. Reopen the order.",
    );
  assertBranch(user, order.branchId);
  if (now < order.createdAt)
    throw new DomainError(
      "validation",
      "Usage cannot be recorded before the order was created.",
    );

  if (c.type === "material-plan") {
    const plan = order.materialPlan;
    if (
      (plan?.id ?? null) !== c.expectedPlanId ||
      (plan?.revision ?? 0) !== c.expectedRevision
    )
      throw new DomainError(
        "conflict",
        "The material plan changed. Close this drawer and review the latest plan.",
      );
    const posted =
      plan &&
      data.usages.some((u) => u.planId === plan.id && u.kind === "consumption");
    if (Boolean(posted) !== c.additional)
      throw new DomainError(
        "conflict",
        posted
          ? "Recorded usage is immutable. Choose Plan additional usage for a separate event."
          : "Finish the current unconfirmed plan before planning additional usage.",
      );
    const lines = checkLines(data, order, c.lines, true);
    return mutate(
      data,
      user,
      c.requestId,
      "Material plan saved",
      `${order.id}; not deducted`,
      now,
      (draft) => {
        draft.orders.find((o) => o.id === order.id)!.materialPlan = {
          id: c.additional
            ? `plan-${c.requestId}`
            : (plan?.id ?? `plan-${order.id}-initial`),
          revision: c.additional ? 0 : (plan?.revision ?? 0) + 1,
          lines,
        };
      },
    );
  }

  const reason = z
    .string()
    .trim()
    .min(3, "Describe why stock is changing (at least 3 characters).")
    .max(200)
    .parse(c.reason);
  let id: string,
    planId: string,
    lines: MaterialInput[],
    kind: MaterialUsage["kind"],
    correctsId: string | null;
  if (c.type === "material-confirm") {
    const plan = order.materialPlan;
    if (
      data.usages.some((u) => u.planId === c.planId && u.kind === "consumption")
    )
      throw new DomainError(
        "duplicate",
        "This material usage was already recorded. Stock has not been deducted again.",
      );
    if (!plan || plan.id !== c.planId || plan.revision !== c.expectedRevision)
      throw new DomainError(
        "conflict",
        "The material plan changed. Reopen confirmation and review the latest quantities.",
      );
    lines = checkLines(data, order, plan.lines, true);
    id = `usage-${plan.id}`;
    planId = plan.id;
    kind = "consumption";
    correctsId = null;
  } else {
    assertAdmin(user);
    if (!original || original.kind !== "consumption")
      throw new DomainError(
        "validation",
        "Only an original consumption event can be corrected.",
      );
    if (data.usages.some((u) => u.correctsId === original.id))
      throw new DomainError(
        "duplicate",
        "This usage already has a compensating correction. Record additional actual usage as a separate event.",
      );
    lines = checkLines(data, order, original.lines, false);
    id = `correction-${original.id}`;
    planId = original.planId;
    kind = "correction";
    correctsId = original.id;
  }
  if (!lines.length)
    throw new DomainError(
      "validation",
      "Add at least one positive material quantity before recording usage.",
    );
  const direction = kind === "consumption" ? -1 : 1;
  for (const [itemId, quantity] of materialTotals(lines)) {
    const item = data.items.find((i) => i.id === itemId)!;
    const after = item.quantities[order.branchId] + direction * quantity;
    if (after < 0)
      throw new DomainError(
        "validation",
        `Insufficient ${item.name}: this branch has ${item.quantities[order.branchId]} ${item.unit}; the full job needs ${quantity}. Reduce the plan or replenish stock separately.`,
      );
    countSchema.parse(after);
  }
  return mutate(
    data,
    user,
    c.requestId,
    kind === "consumption"
      ? "Material usage recorded"
      : "Material usage corrected",
    `${order.id}; ${id}; ${reason}`,
    now,
    (draft) => {
      const event: MaterialUsage = {
        id,
        planId,
        orderId: order.id,
        branchId: order.branchId,
        kind,
        correctsId,
        actorId: user.id,
        createdAt: now,
        reason,
        lines: [],
      };
      for (const [index, line] of lines.entries()) {
        const item = draft.items.find((i) => i.id === line.itemId)!;
        const before = item.quantities[order.branchId],
          after = before + direction * line.quantity;
        const movementId = `move-${id}-${index + 1}`;
        // Correction labels retain the original recorded names, even after a rename.
        const serviceName =
          original?.lines[index]?.serviceName ??
          order.lines.find((l) => l.id === line.lineId)!.description;
        const materialName = original?.lines[index]?.materialName ?? item.name;
        item.quantities[order.branchId] = after;
        event.lines.push({
          ...line,
          materialName,
          serviceName,
          movementId,
          before,
          after,
        });
        draft.movements.unshift({
          id: movementId,
          itemId: line.itemId,
          branchId: order.branchId,
          delta: direction * line.quantity,
          reason,
          createdAt: now,
          actorId: user.id,
          transferId: null,
          usageId: id,
          orderId: order.id,
          lineId: line.lineId,
          unit: line.unit,
          before,
          after,
          serviceName,
        });
      }
      draft.usages.unshift(event);
    },
  );
}
