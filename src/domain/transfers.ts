import { z } from "zod";
import {
  branchIdSchema,
  countSchema,
  DomainError,
  type DemoData,
  type DemoUser,
  type TransferCommand,
} from "./model";
import { assertAdmin, mutate } from "./orders";
export const transferInputSchema = z
  .object({
    itemId: z.string().min(1, "Choose an active material."),
    source: branchIdSchema,
    target: branchIdSchema,
    quantity: countSchema.refine(
      (n) => n > 0,
      "Transfer at least one whole unit.",
    ),
    note: z.string().trim().max(300),
  })
  .superRefine((v, ctx) => {
    if (v.source === v.target)
      ctx.addIssue({
        code: "custom",
        path: ["target"],
        message: "Choose a destination different from the source branch.",
      });
  });
export function applyTransfer(
  data: DemoData,
  user: DemoUser,
  c: TransferCommand,
  now: string,
): DemoData {
  assertAdmin(user);
  const v = transferInputSchema.parse(c);
  const item = data.items.find((i) => i.id === v.itemId && i.active);
  if (!item)
    throw new DomainError(
      "validation",
      "Choose an active material before transferring stock.",
    );
  if (v.quantity > item.quantities[v.source])
    throw new DomainError(
      "validation",
      "Transfer quantity exceeds source stock. Reduce the quantity or choose another source.",
    );
  countSchema.parse(item.quantities[v.target] + v.quantity);
  const id = `TR-${c.requestId}`;
  return mutate(
    data,
    user,
    c.requestId,
    "Demo stock transferred",
    `${item.name}: ${v.quantity} ${item.unit} (${v.source} → ${v.target})`,
    now,
    (draft) => {
      const material = draft.items.find((i) => i.id === item.id)!;
      material.quantities[v.source] -= v.quantity;
      material.quantities[v.target] += v.quantity;
      draft.transfers.unshift({ id, ...v, createdAt: now, actorId: user.id });
      for (const branchId of [v.source, v.target])
        draft.movements.unshift({
          id: `${id}-${branchId}`,
          itemId: item.id,
          branchId,
          delta: branchId === v.source ? -v.quantity : v.quantity,
          reason: v.note || "Instant mock branch transfer",
          createdAt: now,
          actorId: user.id,
          transferId: id,
        });
    },
  );
}
