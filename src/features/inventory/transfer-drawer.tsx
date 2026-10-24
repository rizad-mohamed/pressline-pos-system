"use client";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDemo, useCommand, requestId } from "@/data/provider";
import { transferInputSchema } from "@/domain/transfers";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Field, Notice } from "@/components/shared/presentation";
type Values = z.infer<typeof transferInputSchema>;
export function TransferDrawer({ onClose }: { onClose: () => void }) {
  const { data, scope } = useDemo(),
    command = useCommand();
  const [id] = useState(requestId);
  const schema = transferInputSchema.superRefine((v, ctx) => {
    const item = data.items.find((i) => i.id === v.itemId && i.active);
    if (!item)
      ctx.addIssue({
        code: "custom",
        path: ["itemId"],
        message: "Choose an active material.",
      });
    else if (v.quantity > item.quantities[v.source])
      ctx.addIssue({
        code: "custom",
        path: ["quantity"],
        message: `Only ${item.quantities[v.source]} ${item.unit} are available at the source branch.`,
      });
  });
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      itemId: data.items.find((i) => i.active)?.id ?? "",
      source: scope === "all" ? undefined : scope,
      target: scope === "b2" ? "b1" : "b2",
      quantity: 1,
      note: "",
    },
  });
  const values = useWatch({ control: form.control }),
    e = form.formState.errors,
    item = data.items.find((i) => i.id === values.itemId),
    source = values.source,
    target = values.target,
    qty = values.quantity ?? 0;
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Transfer branch stock"
      description="Review an instant, simulated transfer between the two branches."
      dirty={form.formState.isDirty}
      footer={
        <>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button form="transfer-form" type="submit" disabled={command.pending}>
            {command.pending ? "Saving locally…" : "Complete demo transfer"}
          </Button>
        </>
      }
    >
      <form
        id="transfer-form"
        className="stack"
        noValidate
        onSubmit={form.handleSubmit(async (v) => {
          const r = await command.run(
            { type: "transfer", requestId: id, ...v },
            "Demo transfer recorded. Both branch balances and movement events updated together.",
          );
          if (r.ok) onClose();
        })}
      >
        <Notice tone="warning">
          Demo assumption: transfers are accepted instantly. No goods move
          physically. Production approval, dispatch and acceptance rules are
          awaiting confirmation.
        </Notice>
        <Field
          label="Transfer material"
          id="transfer-material"
          error={e.itemId?.message}
        >
          <select
            id="transfer-material"
            className="select"
            {...form.register("itemId")}
          >
            {data.items
              .filter((i) => i.active)
              .map((i) => (
                <option value={i.id} key={i.id}>
                  {i.name} · {i.unit}
                </option>
              ))}
          </select>
        </Field>
        <div className="form-grid">
          <Field
            label="Source branch"
            id="transfer-source"
            error={e.source?.message}
          >
            <select
              id="transfer-source"
              className="select"
              {...form.register("source")}
            >
              <option value="">Choose source</option>
              {data.branches.map((b) => (
                <option value={b.id} key={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Destination branch"
            id="transfer-target"
            error={e.target?.message}
          >
            <select
              id="transfer-target"
              className="select"
              {...form.register("target")}
              aria-invalid={!!e.target}
              aria-describedby={e.target ? "transfer-target-error" : undefined}
            >
              {data.branches.map((b) => (
                <option value={b.id} key={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field
          label={`Transfer quantity (${item?.unit ?? "units"})`}
          id="transfer-quantity"
          error={e.quantity?.message}
        >
          <input
            id="transfer-quantity"
            className="input"
            type="number"
            step="1"
            min="1"
            {...form.register("quantity", { valueAsNumber: true })}
            aria-invalid={!!e.quantity}
            aria-describedby={
              e.quantity ? "transfer-quantity-error" : undefined
            }
          />
        </Field>
        <Field
          label="Transfer note (optional)"
          id="transfer-note"
          error={e.note?.message}
        >
          <textarea
            id="transfer-note"
            className="textarea"
            {...form.register("note")}
            maxLength={300}
          />
        </Field>
        {item &&
          source &&
          target &&
          source !== target &&
          Number.isFinite(qty) && (
            <div className="line-card">
              <h3 style={{ marginBottom: "var(--space-3)" }}>
                Review balances
              </h3>
              <div className="total-row">
                <span>{data.branches.find((b) => b.id === source)!.name}</span>
                <strong>
                  {item.quantities[source]} → {item.quantities[source] - qty}{" "}
                  {item.unit}
                </strong>
              </div>
              <div className="total-row">
                <span>{data.branches.find((b) => b.id === target)!.name}</span>
                <strong>
                  {item.quantities[target]} → {item.quantities[target] + qty}{" "}
                  {item.unit}
                </strong>
              </div>
              <p className="small muted">
                Combined quantity stays unchanged. Both movements share one
                transfer reference.
              </p>
            </div>
          )}
        {command.error && <Notice tone="error">{command.error}</Notice>}
      </form>
    </Sheet>
  );
}
