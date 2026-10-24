"use client";
import type { Branch, Pricing } from "@/domain/model";
import type { OrderFormValues } from "./schema";
import { quoteOrder, lineSummary, type Catalogue } from "@/domain/pricing";
import { money } from "@/domain/money";
import { Sheet } from "@/components/ui/sheet";
import { Notice } from "@/components/shared/presentation";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/domain-display";
export function OrderReview({
  review,
  branches,
  pricing,
  catalogue,
  pending,
  error,
  onClose,
  onSave,
}: {
  review: OrderFormValues | null;
  branches: Branch[];
  pricing: Pricing;
  catalogue?: Catalogue;
  pending: boolean;
  error: string;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <Sheet
      open={!!review}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Review your print order"
      description="Check every item, branch and simulated advance before saving."
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => onClose()}
            disabled={pending}
          >
            Back to editing
          </Button>
          <Button onClick={onSave} disabled={pending}>
            {pending ? "Saving locally…" : "Save demo order"}
          </Button>
        </>
      }
    >
      {review && (
        <div className="stack">
          <Notice tone="warning">
            Demonstration prices and simulated payment only. No charge or stock
            consumption will occur.
          </Notice>
          <div className="row between">
            <strong>
              {branches.find((b) => b.id === review.branchId)!.name}
            </strong>
            <span className="muted">
              {review.customer.name || "Walk-in customer"}
            </span>
          </div>
          {quoteOrder(review.lines, pricing, catalogue).lines.map((line) => (
            <div className="line-card" key={line.id}>
              <div className="total-row">
                <strong>{line.description}</strong>
                <Money value={line.totalCents} />
              </div>
              <p className="small muted">{lineSummary(line)}</p>
              {line.notes && <p className="small">{line.notes}</p>}
            </div>
          ))}
          <div>
            <div className="total-row">
              <span>Order total</span>
              <strong>
                <Money
                  value={
                    quoteOrder(review.lines, pricing, catalogue).totalCents
                  }
                />
              </strong>
            </div>
            <div className="total-row">
              <span>Simulated advance</span>
              <Money value={money(review.advance)} />
            </div>
            <div className="total-row grand-total">
              <span>Balance due</span>
              <Money
                value={
                  quoteOrder(review.lines, pricing, catalogue).totalCents -
                  money(review.advance)
                }
              />
            </div>
          </div>
          {review.notes && <p>{review.notes}</p>}
          {error && <Notice tone="error">{error}</Notice>}
        </div>
      )}
    </Sheet>
  );
}
