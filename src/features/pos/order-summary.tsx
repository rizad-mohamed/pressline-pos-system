"use client";
import type { UseFormReturn } from "react-hook-form";
import type { OrderFormValues } from "./schema";
import type { quoteOrder } from "@/domain/pricing";
import {
  ArrowRight,
  ShoppingBag,
  Pencil,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { Field, Notice } from "@/components/shared/presentation";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/domain-display";
export function OrderSummary({
  form,
  quote,
  advance,
  pending,
  draftIssue,
  count,
  onEdit,
  onRemove,
  showReview = true,
}: {
  form: UseFormReturn<OrderFormValues>;
  quote: ReturnType<typeof quoteOrder> | null;
  advance: number;
  pending: boolean;
  draftIssue: string;
  count: number;
  onEdit?: (index: number) => void;
  onRemove?: (index: number) => void;
  showReview?: boolean;
}) {
  const errors = form.formState.errors;
  return (
    <aside className="card pos-summary" aria-label="Order summary">
      <div className="card-header">
        <div>
          <p className="small muted">Draft · local demo</p>
          <h2>
            Current order <span className="order-count">{count}</span>
          </h2>
        </div>
        <ShoppingBag size={18} className="muted" />
      </div>
      <div className="card-body stack">
        <Notice tone="warning">
          <strong>DEMO PRICE — NOT APPROVED</strong>
          <br />
          Sample rates. No tax or discount policy is configured.
        </Notice>
        <div>
          {form.getValues("lines").map((line, index) => (
            <div key={index} className="cart-line">
              <div className="total-row">
                <strong className="grow">
                  {index + 1}. {line.description}
                </strong>
                {quote?.lines[index] ? (
                  <Money value={quote.lines[index].totalCents} />
                ) : (
                  "—"
                )}
              </div>
              <p className="small muted">
                {line.size} · {line.color === "B&W" ? "Black & white" : "Color"}{" "}
                · {line.sides === "Duplex" ? "Double-sided" : "Single-sided"}
              </p>
              <p className="small muted">
                {quote?.lines[index] && (
                  <>
                    {line.quantity} ×{" "}
                    <Money value={quote.lines[index].unitCents} /> +{" "}
                    <Money value={quote.lines[index].setupCents} />{" "}
                    binding/finishing
                  </>
                )}
              </p>
              <div className="row between cart-line-actions">
                <div
                  className="quantity-stepper"
                  aria-label={`Item ${index + 1} sheet quantity`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Decrease quantity for item ${index + 1}`}
                    disabled={
                      !Number.isFinite(line.quantity) || line.quantity <= 1
                    }
                    onClick={() =>
                      form.setValue(
                        `lines.${index}.quantity`,
                        line.quantity - 1,
                        { shouldDirty: true, shouldValidate: true },
                      )
                    }
                  >
                    <Minus size={14} />
                  </Button>
                  <span className="money">
                    {Number.isFinite(line.quantity) ? line.quantity : "—"}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Increase quantity for item ${index + 1}`}
                    disabled={
                      !Number.isFinite(line.quantity) || line.quantity >= 100000
                    }
                    onClick={() =>
                      form.setValue(
                        `lines.${index}.quantity`,
                        line.quantity + 1,
                        { shouldDirty: true, shouldValidate: true },
                      )
                    }
                  >
                    <Plus size={14} />
                  </Button>
                </div>
                <div className="row">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit item ${index + 1}`}
                    onClick={() => onEdit?.(index)}
                  >
                    <Pencil size={15} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove from order item ${index + 1}`}
                    onClick={() => onRemove?.(index)}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {count === 0 && (
            <div className="empty-order">
              <ShoppingBag size={28} />
              <h3>A clean slate.</h3>
              <p className="muted">
                Your configured print items will appear here.
              </p>
            </div>
          )}
          {!quote && count > 0 && (
            <p className="muted">
              Complete valid print quantities to calculate your total.
            </p>
          )}
          <div className="total-row grand-total">
            <span>Order total</span>
            <span data-testid="order-total">
              {quote ? (
                <Money value={quote.totalCents} />
              ) : count === 0 ? (
                <Money value={0} />
              ) : (
                "—"
              )}
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
        {showReview && (
          <Button
            type="submit"
            form="pos-form"
            className="full"
            disabled={!quote || pending}
          >
            Review order
            <ArrowRight size={16} />
          </Button>
        )}
        <p className="small muted">
          Valid drafts stay in this browser tab for this demo account. Review
          does not save an order.
        </p>
        {draftIssue && <Notice tone="error">{draftIssue}</Notice>}
      </div>
    </aside>
  );
}
