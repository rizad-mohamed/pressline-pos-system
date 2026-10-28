import { Badge } from "./presentation";
import { formatMoney } from "@/domain/money";
import type { Order } from "@/domain/model";
export function Money({ value }: { value: number }) {
  return <span className="money">{formatMoney(value)}</span>;
}
export function ProductionBadge({ value }: { value: Order["production"] }) {
  return (
    <Badge
      tone={
        value === "Completed"
          ? "success"
          : value === "Ready"
            ? "primary"
            : value === "In Progress"
              ? "info"
              : "neutral"
      }
    >
      {value}
    </Badge>
  );
}
export function PaymentBadge({
  value,
}: {
  value: "Unpaid" | "Partial" | "Paid";
}) {
  return (
    <Badge
      tone={
        value === "Paid"
          ? "success"
          : value === "Partial"
            ? "warning"
            : "neutral"
      }
    >
      {value}
    </Badge>
  );
}
