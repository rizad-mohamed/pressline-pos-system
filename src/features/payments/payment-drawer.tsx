"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDemo, useCommand, requestId } from "@/data/provider";
import { type Order } from "@/domain/model";
import { balanceFor } from "@/domain/orders";
import { money, moneyInput } from "@/domain/money";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Field, Notice } from "@/components/shared/presentation";
import { Money } from "@/components/shared/domain-display";
export function PaymentDrawer({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const { data } = useDemo(),
    command = useCommand(),
    due = balanceFor(data, order);
  const [id] = useState(requestId);
  const schema = z.object({
    amount: z.string().superRefine((v, ctx) => {
      try {
        const cents = money(v);
        if (cents <= 0 || cents > due)
          ctx.addIssue({
            code: "custom",
            message:
              "Enter an amount greater than zero and no more than the balance due.",
          });
      } catch {
        ctx.addIssue({
          code: "custom",
          message: "Use a positive LKR amount with at most two decimal places.",
        });
      }
    }),
    note: z.string().trim().max(200),
  });
  const form = useForm<{ amount: string; note: string }>({
    resolver: zodResolver(schema),
    defaultValues: { amount: moneyInput(due), note: "" },
  });
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Record payment · ${order.id}`}
      description="Record a simulated payment against the outstanding balance."
      dirty={form.formState.isDirty}
      footer={
        <>
          <SheetClose asChild>
            <Button variant="outline" disabled={command.pending}>
              Cancel
            </Button>
          </SheetClose>
          <Button type="submit" form="payment-form" disabled={command.pending}>
            {command.pending ? "Saving locally…" : "Record simulated payment"}
          </Button>
        </>
      }
    >
      <form
        id="payment-form"
        className="stack"
        noValidate
        onSubmit={form.handleSubmit(async (values) => {
          const r = await command.run(
            {
              type: "payment",
              requestId: id,
              orderId: order.id,
              amountCents: money(values.amount),
              note: values.note,
            },
            `Simulated payment recorded for ${order.id}.`,
          );
          if (r.ok) onClose();
        })}
      >
        <Notice tone="warning">
          No money is charged or settled. This event is stored only in the local
          demonstration.
        </Notice>
        <div className="total-row grand-total">
          <span>Balance due</span>
          <Money value={due} />
        </div>
        <Field
          label="Payment amount (LKR)"
          id="payment-amount"
          error={form.formState.errors.amount?.message}
        >
          <input
            id="payment-amount"
            className="input money"
            inputMode="decimal"
            {...form.register("amount")}
            aria-invalid={!!form.formState.errors.amount}
            aria-describedby={
              form.formState.errors.amount ? "payment-amount-error" : undefined
            }
          />
        </Field>
        <Field
          label="Payment note (optional)"
          id="payment-note"
          error={form.formState.errors.note?.message}
        >
          <textarea
            id="payment-note"
            className="textarea"
            {...form.register("note")}
            maxLength={200}
          />
        </Field>
        {command.error && <Notice tone="error">{command.error}</Notice>}
      </form>
    </Sheet>
  );
}
