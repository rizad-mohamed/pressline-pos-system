"use client";
import { useRef, useState, useSyncExternalStore } from "react";
import { ShoppingBag, ArrowUpRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Money } from "@/components/shared/domain-display";
import { OrderSummary } from "./order-summary";
import { useOrderBarHeight } from "./use-bar-height";
import type { OrderFormValues } from "./schema";

const compactQuery = "(max-width: 1100px)";
function subscribe(onChange: () => void) {
  const media = window.matchMedia(compactQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
function snapshot() {
  return window.matchMedia(compactQuery).matches;
}
function serverSnapshot() {
  return false;
}

export function ResponsiveSummary({
  reviewOpen,
  onReview,
  ...props
}: React.ComponentProps<typeof OrderSummary> & {
  reviewOpen: boolean;
  onReview: (values: OrderFormValues) => void;
}) {
  const compact = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [open, setOpen] = useState(false);
  const editTarget = useRef<number | null>(null);
  const focusInvalid = useRef(false);
  const barRef = useRef<HTMLDivElement>(null);
  useOrderBarHeight(barRef, compact);
  if (!compact) return <OrderSummary {...props} />;
  return (
    <>
      <div className="mobile-order-bar" ref={barRef}>
        <div>
          <span className="small muted">
            Current order · {props.count} {props.count === 1 ? "item" : "items"}
          </span>
          <strong>
            {props.quote ? (
              <Money value={props.quote.totalCents} />
            ) : props.count === 0 ? (
              <Money value={0} />
            ) : (
              "Check quantities"
            )}
          </strong>
        </div>
        <Button
          onClick={() => setOpen(true)}
          aria-label={`View order (${props.count})`}
        >
          <ShoppingBag size={17} />
          View order ({props.count})<ArrowUpRight size={16} />
        </Button>
      </div>
      <Sheet
        open={open && !reviewOpen}
        onOpenChange={setOpen}
        title="Current order"
        description="Your specifications, sample prices and simulated advance."
        footer={
          <Button
            className="full"
            disabled={!props.quote || props.pending}
            onClick={() =>
              void props.form.handleSubmit(onReview, (errors) => {
                // The advance lives in this sheet; other invalid controls are
                // behind the modal and must be revealed before RHF can focus them.
                if (Object.keys(errors).some((key) => key !== "advance")) {
                  focusInvalid.current = true;
                  setOpen(false);
                }
              })()
            }
          >
            Review order
            <ArrowRight size={16} />
          </Button>
        }
        onAfterClose={() => {
          if (focusInvalid.current) {
            focusInvalid.current = false;
            void props.form.trigger(undefined, { shouldFocus: true });
          }
          if (editTarget.current !== null) {
            props.onEdit?.(editTarget.current);
            editTarget.current = null;
          }
        }}
      >
        <OrderSummary
          {...props}
          showReview={false}
          onEdit={(index) => {
            editTarget.current = index;
            setOpen(false);
          }}
        />
      </Sheet>
    </>
  );
}
