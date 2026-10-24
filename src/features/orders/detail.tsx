"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CreditCard,
  FileText,
  Printer,
  Pencil,
} from "lucide-react";
import { useDemo, useCommand, requestId } from "@/data/provider";
import {
  canReadBranch,
  balanceFor,
  paidFor,
  paymentState,
} from "@/domain/orders";
import { productionStates, type Order } from "@/domain/model";
import { dateTime } from "@/domain/dates";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  Notice,
  PageHeader,
} from "@/components/shared/presentation";
import {
  Money,
  ProductionBadge,
  PaymentBadge,
} from "@/components/shared/domain-display";
import { PaymentDrawer } from "@/features/payments/payment-drawer";
import { EditOrderDrawer } from "./edit-drawer";
import { LinkOrderCustomer } from "@/features/customers/link-order";
import { lineSummary } from "@/domain/pricing";
import { JobMaterials } from "@/features/materials/job-materials";
export function OrderDetail({ orderId }: { orderId: string }) {
  const { data, user } = useDemo(),
    command = useCommand();
  const [paymentOpen, setPaymentOpen] = useState(false),
    [editOpen, setEditOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const order = data.orders.find(
    (o) => o.id === orderId && canReadBranch(user, o.branchId),
  );
  if (!order)
    return (
      <EmptyState
        title="Order unavailable"
        description="The order does not exist in this demo account's branch scope. Check its reference or switch accounts."
        action={
          <Button variant="outline" asChild>
            <Link href="/orders">Back to orders</Link>
          </Button>
        }
      />
    );
  const due = balanceFor(data, order),
    paid = paidFor(data, order.id),
    state = paymentState(data, order),
    index = productionStates.indexOf(order.production),
    next = productionStates[index + 1] as Order["production"] | undefined;
  const payments = data.payments.filter((p) => p.orderId === order.id);
  return (
    <div className="stack order-detail">
      <div className="row between">
        <div>
          <h2>{order.customer.name || "Walk-in customer"}</h2>
          <p className="small muted">
            {data.branches.find((b) => b.id === order.branchId)!.name} ·{" "}
            {dateTime(order.createdAt)}
          </p>
          {order.customer.phone && (
            <p className="small muted">{order.customer.phone}</p>
          )}
        </div>
        <div className="row">
          <span data-testid="production-status">
            <ProductionBadge value={order.production} />
          </span>
          <PaymentBadge value={state} />
        </div>
      </div>
      <div className="row">
        {order.customerId ? (
          <Link className="table-title" href={`/customers/${order.customerId}`}>
            Saved customer account ·{" "}
            {data.customers.find((c) => c.id === order.customerId)?.name}
          </Link>
        ) : (
          <>
            <span className="small muted">
              Unlinked customer · original text retained
            </span>
            <Button variant="ghost" size="sm" onClick={() => setLinkOpen(true)}>
              Link saved customer
            </Button>
          </>
        )}
      </div>
      <div className="summary-grid">
        <div className="card card-body">
          <p className="small muted">Order total</p>
          <h2 data-testid="detail-total">
            <Money value={order.totalCents} />
          </h2>
        </div>
        <div className="card card-body">
          <p className="small muted">Total paid · simulated</p>
          <h2 data-testid="detail-paid">
            <Money value={paid} />
          </h2>
        </div>
      </div>
      <div className="notice notice-warning row between balance-callout">
        <strong>Balance due</strong>
        <strong data-testid="detail-balance">
          <Money value={due} />
        </strong>
      </div>
      <div className="row">
        <Button onClick={() => setPaymentOpen(true)} disabled={due === 0}>
          <CreditCard size={16} />
          {due === 0 ? "Fully paid · simulated" : "Record payment"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setEditOpen(true)}
          disabled={order.production === "Completed"}
          title={
            order.production === "Completed"
              ? "Completed orders are read-only."
              : undefined
          }
        >
          <Pencil size={15} />
          Edit information
        </Button>
      </div>
      <section className="stack" style={{ gap: "var(--space-3)" }}>
        <h3>Print specifications & saved prices</h3>
        {order.lines.map((line, i) => (
          <div className="line-card" key={line.id}>
            <div className="total-row">
              <strong>
                {i + 1}. {line.description}
              </strong>
              <Money value={line.totalCents} />
            </div>
            <p className="small muted">{lineSummary(line)}</p>
            <p className="small muted">
              {line.quantity} × <Money value={line.unitCents} /> +{" "}
              <Money value={line.setupCents} /> setup · Price version{" "}
              {line.ruleVersion}
              {line.serviceSnapshot &&
                ` · Service ${line.serviceSnapshot.code} v${line.serviceSnapshot.version}`}
            </p>
            {line.notes && (
              <p style={{ marginTop: "var(--space-2)" }}>{line.notes}</p>
            )}
          </div>
        ))}
      </section>
      <JobMaterials order={order} />
      <section className="stack" style={{ gap: "var(--space-3)" }}>
        <h3>Production</h3>
        <div className="progress-states">
          {productionStates.map((s, i) => (
            <div
              key={s}
              className={`progress-state ${i <= index ? "active" : ""}`}
            >
              {i + 1}. {s}
            </div>
          ))}
        </div>
        <Notice>
          Demo flow awaiting approval. Completing production does not settle a
          balance or consume inventory.
        </Notice>
        {next && (
          <Button
            variant="outline"
            disabled={command.pending}
            onClick={() =>
              command.run(
                {
                  type: "production",
                  requestId: requestId(),
                  orderId: order.id,
                  next,
                },
                `${order.id} moved to ${next}.`,
              )
            }
          >
            {next === "In Progress"
              ? "Start production"
              : next === "Ready"
                ? "Mark ready"
                : "Complete job"}
            <ArrowRight size={16} />
          </Button>
        )}
      </section>
      {order.notes && (
        <section>
          <h3>Order instructions</h3>
          <p style={{ marginTop: "var(--space-2)", whiteSpace: "pre-wrap" }}>
            {order.notes}
          </p>
        </section>
      )}
      <section>
        <h3 style={{ marginBottom: "var(--space-3)" }}>
          Simulated payment history
        </h3>
        {payments.length ? (
          <div className="stack" style={{ gap: "var(--space-3)" }}>
            {payments.map((p) => (
              <div className="row between" key={p.id}>
                <div className="grow">
                  <strong>
                    <Money value={p.amountCents} />
                  </strong>
                  <p className="small muted">
                    {p.note || "Simulated payment"} ·{" "}
                    {data.users.find((u) => u.id === p.actorId)?.name}
                  </p>
                  <p className="small muted">{p.id}</p>
                </div>
                <time className="small muted">{dateTime(p.createdAt)}</time>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No simulated payment has been recorded.</p>
        )}
      </section>
      <Separator />
      <div className="row">
        <Button variant="outline" asChild>
          <Link href={`/print/receipt/${order.id}`}>
            <FileText size={16} />
            Customer receipt
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/print/job/${order.id}`}>
            <Printer size={16} />
            Production ticket
          </Link>
        </Button>
      </div>
      <p className="small muted">
        Browser printing opens a separate printable view. Native printing cannot
        confirm physical output.
      </p>
      <div>
        <Button variant="ghost" disabled>
          Cancel or refund order
        </Button>
        <p className="small muted">
          Unavailable: cancellation and refund policies have not been approved.
        </p>
      </div>
      {command.error && <Notice tone="error">{command.error}</Notice>}
      {paymentOpen && (
        <PaymentDrawer order={order} onClose={() => setPaymentOpen(false)} />
      )}
      {editOpen && (
        <EditOrderDrawer order={order} onClose={() => setEditOpen(false)} />
      )}
      {linkOpen && (
        <LinkOrderCustomer
          orderId={order.id}
          onClose={() => setLinkOpen(false)}
        />
      )}
    </div>
  );
}
export function OrderPage({ orderId }: { orderId: string }) {
  return (
    <>
      <PageHeader
        eyebrow="ORDERS / ORDER DETAIL"
        title={orderId}
        description="Saved specifications, production state and simulated payments."
        action={
          <Button asChild variant="outline">
            <Link href="/orders">Back to orders</Link>
          </Button>
        }
      />
      <div className="card card-body">
        <OrderDetail orderId={orderId} />
      </div>
    </>
  );
}
