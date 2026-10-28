"use client";
import { ScrollTable } from "@/components/shared/scroll-table";
import Link from "next/link";
import { useState } from "react";
import { useCommand, useDemo, requestId } from "@/data/provider";
import { customerLedger } from "@/domain/customers";
import { balanceFor, paidFor } from "@/domain/orders";
import { dateTime } from "@/domain/dates";
import { Button } from "@/components/ui/button";
import {
  Badge,
  EmptyState,
  Notice,
  PageHeader,
  SearchField,
} from "@/components/shared/presentation";
import {
  Money,
  PaymentBadge,
  ProductionBadge,
} from "@/components/shared/domain-display";
import { paymentState } from "@/domain/orders";
import { CustomerEditor } from "./editor";

export function CustomerDetail({ customerId }: { customerId: string }) {
  const { data, user } = useDemo();
  const command = useCommand();
  const [edit, setEdit] = useState(false);
  const [query, setQuery] = useState("");
  const customer = data.customers.find((c) => c.id === customerId);
  if (!customer)
    return (
      <EmptyState
        title="Customer unavailable"
        description="This saved customer is not in the current local dataset."
        action={
          <Button asChild variant="outline">
            <Link href="/customers">Back to customers</Link>
          </Button>
        }
      />
    );
  const ledger = customerLedger(data, user, customerId);
  const orders = ledger.orders.filter((o) =>
    `${o.id} ${o.lines.map((l) => l.description).join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  const ids = new Set(ledger.orders.map((o) => o.id));
  const payments = data.payments
    .filter((p) => ids.has(p.orderId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const scope = user.role === "cashier" ? "At this branch" : "All branches";
  return (
    <div className="stack">
      <PageHeader
        eyebrow="CUSTOMER ACCOUNT"
        title={customer.name}
        description={`${scope} · linked print orders and simulated payments`}
        action={
          <>
            <Button variant="outline" asChild>
              <Link href="/customers">Customers</Link>
            </Button>
            {customer.active && (
              <Button asChild>
                <Link href={`/pos?customer=${encodeURIComponent(customer.id)}`}>
                  New order for this customer
                </Link>
              </Button>
            )}
          </>
        }
      />
      <section className="card card-body stack">
        <div className="row between">
          <div>
            <h2>
              {customer.kind === "Business"
                ? "Business / Company"
                : "Individual"}
            </h2>
            <p className="small muted">
              Created {dateTime(customer.createdAt)} · Updated{" "}
              {dateTime(customer.updatedAt)}
            </p>
          </div>
          <Badge tone={customer.active ? "success" : "neutral"}>
            {customer.active ? "Active" : "Archived"}
          </Badge>
        </div>
        <dl className="customer-profile-grid">
          {[
            ["Contact person", customer.contactPerson],
            ["Phone", customer.phone],
            ["Email", customer.email],
            ["Address", customer.address],
            ["Internal notes", customer.notes],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="small muted">{label}</dt>
              <dd>{value || "Not provided"}</dd>
            </div>
          ))}
        </dl>
        {user.role === "admin" && (
          <div className="row">
            <Button variant="outline" onClick={() => setEdit(true)}>
              Edit customer
            </Button>
            <Button
              variant="ghost"
              disabled={command.pending}
              onClick={async () => {
                if (
                  window.confirm(
                    `${customer.active ? "Archive" : "Reactivate"} ${customer.name}? Orders and payments are retained.`,
                  )
                )
                  await command.run(
                    {
                      type: "customer-active",
                      requestId: requestId(),
                      customerId: customer.id,
                      active: !customer.active,
                    },
                    "Customer availability updated; history retained.",
                  );
              }}
            >
              {customer.active ? "Archive customer" : "Reactivate customer"}
            </Button>
          </div>
        )}
      </section>
      <Notice>
        {scope}. Figures cover all permitted linked orders, independent of the
        history search. Order value and recorded payments are distinct; material
        use never changes customer receivables. Shared-directory access is a
        demo convention, not backend authorization.
      </Notice>
      <div className="metrics metrics-strip customer-ledger">
        {[
          ["Order value", ledger.orderValue],
          ["Recorded payments · simulated", ledger.paid],
          ["Outstanding balance", ledger.outstanding],
        ].map(([label, value]) => (
          <div className="metric" key={label}>
            <p className="metric-label">{label}</p>
            <strong
              className="metric-value"
              data-testid={
                label === "Outstanding balance"
                  ? "customer-outstanding"
                  : undefined
              }
            >
              <Money value={value as number} />
            </strong>
          </div>
        ))}
      </div>
      <section className="card">
        <div className="card-header">
          <h2>Previous orders</h2>
          <span className="small muted">{scope}</span>
        </div>
        <div className="card-body">
          <SearchField
            label="Search customer orders"
            placeholder="Order reference or service…"
            value={query}
            onChange={setQuery}
          />
        </div>
        {orders.length ? (
          <ScrollTable
            className="table-scroll mobile-cards"
            tabIndex={0}
            aria-label="Scrollable customer orders"
          >
            <table role="table">
              <caption className="sr-only">
                Customer orders with separate production, payment and balance
              </caption>
              <thead>
                <tr>
                  <th>Order / date / branch</th>
                  <th>Print work</th>
                  <th>Production</th>
                  <th>Payment</th>
                  <th className="right">Order value</th>
                  <th className="right">Paid</th>
                  <th className="right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td data-label="Order / date / branch">
                      <Link className="table-title" href={`/orders/${o.id}`}>
                        {o.id}
                      </Link>
                      <p className="small muted">{dateTime(o.createdAt)}</p>
                      <p className="small muted">
                        {data.branches.find((b) => b.id === o.branchId)?.name}
                      </p>
                    </td>
                    <td data-label="Print work">
                      {o.lines.map((l) => l.description).join(", ")}
                    </td>
                    <td data-label="Production">
                      <ProductionBadge value={o.production} />
                    </td>
                    <td data-label="Payment">
                      <PaymentBadge value={paymentState(data, o)} />
                    </td>
                    <td className="right" data-label="Order value">
                      <Money value={o.totalCents} />
                    </td>
                    <td className="right" data-label="Paid">
                      <Money value={paidFor(data, o.id)} />
                    </td>
                    <td className="right" data-label="Balance">
                      <Money value={balanceFor(data, o)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollTable>
        ) : (
          <EmptyState
            title="No linked orders in this view"
            description="Legacy free-text names are not automatically matched. Select this customer for a new order, or explicitly link an eligible existing order."
          />
        )}
      </section>
      <section className="card">
        <div className="card-header">
          <h2>Payment activity · simulated</h2>
          <span className="small muted">{scope}</span>
        </div>
        <div className="card-body stack">
          {payments.length ? (
            payments.map((p) => (
              <div className="row between" key={p.id}>
                <div>
                  <Link href={`/orders/${p.orderId}`} className="table-title">
                    {p.orderId}
                  </Link>
                  <p className="small muted">
                    {dateTime(p.createdAt)} · {p.note}
                  </p>
                </div>
                <Money value={p.amountCents} />
              </div>
            ))
          ) : (
            <p className="muted">
              No recorded payments for linked orders in this scope.
            </p>
          )}
        </div>
      </section>
      {command.error && <Notice tone="error">{command.error}</Notice>}
      {edit && (
        <CustomerEditor customer={customer} onClose={() => setEdit(false)} />
      )}
    </div>
  );
}
