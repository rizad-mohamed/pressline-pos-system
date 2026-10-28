"use client";
import { useState } from "react";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { branchIdSchema, type StockItem } from "@/domain/model";
import { useDemo, useCommand, requestId } from "@/data/provider";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Field, Notice } from "@/components/shared/presentation";
const schema = z.object({
  branchId: branchIdSchema,
  direction: z.enum(["add", "remove"]),
  quantity: z.number().int().min(1).max(10000000),
  reason: z
    .string()
    .trim()
    .min(3, "Enter a reason with at least 3 characters.")
    .max(200),
});
type Values = z.infer<typeof schema>;
export function AdjustDrawer({
  item,
  onClose,
}: {
  item: StockItem;
  onClose: () => void;
}) {
  const { data, scope } = useDemo(),
    command = useCommand();
  const [id] = useState(requestId);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      branchId: scope === "all" ? undefined : scope,
      direction: "add",
      quantity: 1,
      reason: "",
    },
  });
  const values = useWatch({ control: form.control }),
    e = form.formState.errors;
  const before = values.branchId ? item.quantities[values.branchId] : null;
  const after =
    before !== null
      ? before +
        (values.direction === "remove" ? -1 : 1) * (values.quantity ?? 0)
      : null;
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Adjust branch stock"
      description={item.name}
      dirty={form.formState.isDirty}
      footer={
        <>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button
            form="adjust-form"
            type="submit"
            disabled={command.pending || after === null || after < 0}
          >
            Record stock adjustment
          </Button>
        </>
      }
    >
      <form
        id="adjust-form"
        className="stack"
        noValidate
        onSubmit={form.handleSubmit(async (v) => {
          const r = await command.run(
            {
              type: "stock-adjust",
              requestId: id,
              itemId: item.id,
              branchId: v.branchId,
              delta: (v.direction === "remove" ? -1 : 1) * v.quantity,
              reason: v.reason,
            },
            "Mock stock adjustment and movement saved.",
          );
          if (r.ok) onClose();
        })}
      >
        <Field
          label="Adjustment branch"
          id="adjust-branch"
          error={e.branchId?.message}
        >
          <select
            id="adjust-branch"
            className="select"
            {...form.register("branchId")}
          >
            <option value="">Choose one branch</option>
            {data.branches.map((b) => (
              <option value={b.id} key={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="form-grid">
          <Field label="Adjustment type" id="adjust-direction">
            <select
              id="adjust-direction"
              className="select"
              {...form.register("direction")}
            >
              <option value="add">Add stock</option>
              <option value="remove">Remove stock</option>
            </select>
          </Field>
          <Field
            label={`Quantity (${item.unit})`}
            id="adjust-quantity"
            error={e.quantity?.message}
          >
            <input
              id="adjust-quantity"
              type="number"
              min="1"
              step="1"
              className="input"
              {...form.register("quantity", { valueAsNumber: true })}
            />
          </Field>
        </div>
        <Field
          label="Reason for adjustment"
          id="adjust-reason"
          error={e.reason?.message}
        >
          <textarea
            id="adjust-reason"
            className="textarea"
            {...form.register("reason")}
            aria-invalid={!!e.reason}
            aria-describedby={e.reason ? "adjust-reason-error" : undefined}
          />
        </Field>
        {before !== null && (
          <div className="line-card">
            <div className="total-row">
              <span>Current balance</span>
              <strong>
                {before} {item.unit}
              </strong>
            </div>
            <div className="total-row">
              <span>Balance after adjustment</span>
              <strong>
                {Number.isFinite(after) ? after : "—"} {item.unit}
              </strong>
            </div>
          </div>
        )}
        {after !== null && after < 0 && (
          <Notice tone="error">
            Reduce the removal quantity to avoid negative stock.
          </Notice>
        )}
        <Notice tone="warning">
          Local demonstration only. The reason and both quantities will be
          retained in the mock movement history.
        </Notice>
        {command.error && <Notice tone="error">{command.error}</Notice>}
      </form>
    </Sheet>
  );
}
