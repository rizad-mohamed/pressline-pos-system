"use client";
import type { UseFormReturn } from "react-hook-form";
import type { OrderFormValues } from "./schema";
import type { quoteOrder } from "@/domain/pricing";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Field, Notice } from "@/components/shared/presentation";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/domain-display";
export function OrderSummary({
  form,
  quote,
  advance,
  pending,
  draftIssue,
}: {
  form: UseFormReturn<OrderFormValues>;
  quote: ReturnType<typeof quoteOrder> | null;
  advance: number;
  pending: boolean;
  draftIssue: string;
}) {
  const errors = form.formState.errors;
  return (
    <aside className="card pos-summary" aria-label="Order summary">
      <div className="card-header">
        <h2>Order summary</h2>
        <ShoppingBag size={18} className="muted" />
      </div>
      <div className="card-body stack">
        <Notice tone="warning">
          <strong>DEMO PRICE — NOT APPROVED</strong>
          <br />
          Sample rates. No tax or discount policy is configured.
        </Notice>
        <div>
          {quote?.lines.map((line, index) => (
            <div
              key={line.id}
              style={{
                paddingBlock: "var(--space-3)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div className="total-row">
                <strong className="grow">
                  {index + 1}. {line.description}
                </strong>
                <Money value={line.totalCents} />
              </div>
              <p className="small muted">
                {line.quantity} × <Money value={line.unitCents} /> +{" "}
                <Money value={line.setupCents} /> binding/finishing
              </p>
            </div>
          ))}
          {!quote && (
            <p className="muted">
              Complete valid print quantities to calculate your total.
            </p>
          )}
          <div className="total-row grand-total">
            <span>Order total</span>
            <span data-testid="order-total">
              {quote ? <Money value={quote.totalCents} /> : "—"}
            </span>
          </div>
        </div>
        <Field
          label="Simulated advance (LKR)"
          id="order-advance"
          error={errors.advance?.message}
          hint="Enter 0 for unpaid, or any amount up to the total."
        >
          <input
            id="order-advance"
            className="input money"
            inputMode="decimal"
            {...form.register("advance")}
            aria-invalid={!!errors.advance}
            aria-describedby={
              errors.advance ? "order-advance-error" : "order-advance-hint"
            }
          />
        </Field>
        <div className="total-row">
          <span className="muted">Balance after advance</span>
          <strong data-testid="preview-balance">
            {quote && advance <= quote.totalCents ? (
              <Money value={quote.totalCents - advance} />
            ) : (
              "—"
            )}
          </strong>
        </div>
        <Button type="submit" className="full" disabled={!quote || pending}>
          Review order
          <ArrowRight size={16} />
        </Button>
        <p className="small muted">
          Valid drafts stay in this browser tab for this demo account. Review
          does not save an order.
        </p>
        {draftIssue && <Notice tone="error">{draftIssue}</Notice>}
      </div>
    </aside>
  );
}
