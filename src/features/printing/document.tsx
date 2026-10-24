"use client";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { useDemo } from "@/data/provider";
import { RequireSession } from "@/features/auth/access";
import {
  canReadBranch,
  paidFor,
  balanceFor,
  paymentState,
} from "@/domain/orders";
import { dateTime } from "@/domain/dates";
import { Button } from "@/components/ui/button";
import { Badge, EmptyState, Notice } from "@/components/shared/presentation";
import {
  Money,
  ProductionBadge,
  PaymentBadge,
} from "@/components/shared/domain-display";
export function PrintDocument({
  orderId,
  kind,
}: {
  orderId: string;
  kind: "receipt" | "job";
}) {
  return (
    <main className="print-page">
      <RequireSession>
        <DocumentBody orderId={orderId} kind={kind} />
      </RequireSession>
    </main>
  );
}
function DocumentBody({
  orderId,
  kind,
}: {
  orderId: string;
  kind: "receipt" | "job";
}) {
  const { data, user } = useDemo();
  const order = data.orders.find(
    (o) => o.id === orderId && canReadBranch(user, o.branchId),
  );
  if (!order)
    return (
      <div className="card">
        <EmptyState
          title="Document unavailable"
          description="This order is missing or outside the selected demo account's branch access."
          action={
            <Button asChild variant="outline">
              <Link href="/orders">Back to orders</Link>
            </Button>
          }
        />
      </div>
    );
  const branch = data.branches.find((b) => b.id === order.branchId)!,
    receipt = kind === "receipt",
    payments = data.payments.filter((p) => p.orderId === order.id);
  return (
    <>
      <div className="row between no-print">
        <Button asChild variant="outline">
          <Link href={`/orders/${order.id}`}>
            <ArrowLeft size={16} />
            Back to order
          </Link>
        </Button>
        <Button onClick={() => window.print()}>
          <Printer size={16} />
          {receipt ? "Print receipt" : "Print job ticket"}
        </Button>
      </div>
      <div className="no-print" style={{ marginTop: "var(--space-4)" }}>
        <Notice>
          Browser print preview only. Choose paper and printer in the native
          dialog. Physical output and completed printing cannot be confirmed
          here.
        </Notice>
      </div>
      <article
        className="print-paper"
        aria-label={receipt ? "Customer receipt" : "Production job ticket"}
      >
        <header>
          <div className="row between">
            <div className="brand">
              <span className="brand-mark">
                <Printer />
              </span>
              {data.settings.shopName}
            </div>
            <Badge tone="warning">DEMONSTRATION</Badge>
          </div>
          <h1 style={{ marginTop: "var(--space-6)" }}>
            {receipt ? "Customer receipt" : "Production job ticket"}
          </h1>
          <p className="muted">
            {receipt
              ? "Itemized printing work · Simulated payments only"
              : "Internal production instructions · Keep with the print work"}
          </p>
        </header>
        <div className="print-meta">
          <div>
            <p className="eyebrow">ORDER REFERENCE</p>
            <strong style={{ fontSize: "var(--text-xl)" }}>{order.id}</strong>
            <p className="small muted">Created {dateTime(order.createdAt)}</p>
          </div>
          <div className="right">
            <p className="eyebrow">BRANCH</p>
            <strong>{branch.name}</strong>
            <p className="small muted">{branch.location}</p>
          </div>
          <div>
            <p className="eyebrow">CUSTOMER</p>
            <strong>{order.customer.name || "Walk-in customer"}</strong>
            {receipt && order.customer.phone && (
              <p className="small muted">{order.customer.phone}</p>
            )}
          </div>
          <div className="right">
            <p className="eyebrow">
              {receipt ? "PAYMENT STATE" : "PRODUCTION STATE"}
            </p>
            {receipt ? (
              <PaymentBadge value={paymentState(data, order)} />
            ) : (
              <ProductionBadge value={order.production} />
            )}
          </div>
        </div>
        <div
          className="table-scroll"
          tabIndex={0}
          aria-label="Scrollable data table"
        >
          <table>
            <caption className="sr-only">
              {receipt
                ? "Saved itemized prices in LKR"
                : "Print job specifications without customer financial amounts"}
            </caption>
            <thead>
              <tr>
                <th>Print item & specifications</th>
                <th className="right">Sheets</th>
                {receipt && (
                  <>
                    <th className="right">Unit rate</th>
                    <th className="right">Setup</th>
                    <th className="right">Amount</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {order.lines.map((line, index) => (
                <tr key={line.id}>
                  <td>
                    <strong>
                      {index + 1}. {line.description}
                    </strong>
                    <p className="small muted">
                      {line.size} · {line.color} · {line.sides}
                    </p>
                    <p className="small muted">
                      Binding: {line.binding} · Finishing: {line.finishing}
                    </p>
                    {line.notes && (
                      <p
                        className="small"
                        style={{
                          marginTop: "var(--space-2)",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {line.notes}
                      </p>
                    )}
                    {receipt && (
                      <p className="small muted">
                        Saved price version {line.ruleVersion}
                      </p>
                    )}
                  </td>
                  <td className="right money">{line.quantity}</td>
                  {receipt && (
                    <>
                      <td className="right">
                        <Money value={line.unitCents} />
                      </td>
                      <td className="right">
                        <Money value={line.setupCents} />
                      </td>
                      <td className="right">
                        <Money value={line.totalCents} />
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {order.notes && (
          <section style={{ marginTop: "var(--space-6)" }}>
            <h2>Order instructions</h2>
            <p style={{ marginTop: "var(--space-2)", whiteSpace: "pre-wrap" }}>
              {order.notes}
            </p>
          </section>
        )}
        {receipt ? (
          <>
            <div className="print-totals">
              <div className="total-row">
                <span>Order total</span>
                <strong data-testid="receipt-total">
                  <Money value={order.totalCents} />
                </strong>
              </div>
              <div className="total-row">
                <span>Total paid · simulated</span>
                <span data-testid="receipt-paid">
                  <Money value={paidFor(data, order.id)} />
                </span>
              </div>
              <div className="total-row grand-total">
                <span>Balance due</span>
                <span data-testid="receipt-balance">
                  <Money value={balanceFor(data, order)} />
                </span>
              </div>
            </div>
            <section style={{ marginTop: "var(--space-6)" }}>
              <h2>Simulated payment events</h2>
              {payments.length ? (
                payments.map((p) => (
                  <div key={p.id} className="total-row small">
                    <span>
                      {dateTime(p.createdAt)} · {p.note || "Simulated payment"}
                    </span>
                    <Money value={p.amountCents} />
                  </div>
                ))
              ) : (
                <p className="small muted">
                  No payment recorded. This order is unpaid.
                </p>
              )}
            </section>
          </>
        ) : (
          <section style={{ marginTop: "var(--space-8)" }}>
            <h2>Production handover</h2>
            <p className="muted" style={{ marginTop: "var(--space-2)" }}>
              Verify paper size, color, sides, binding, finishing and page
              sequence before starting. Production completion does not indicate
              payment settlement.
            </p>
            <p style={{ marginTop: "var(--space-6)" }}>
              Prepared by: ____________________ &nbsp; Checked by:
              ____________________
            </p>
          </section>
        )}
        <footer className="print-footer">
          <p>
            <strong>
              DEMO PRICE — NOT APPROVED.{" "}
              {receipt
                ? "NOT PROOF OF FINANCIAL SETTLEMENT."
                : "INTERNAL DEMONSTRATION JOB TICKET."}
            </strong>
          </p>
          <p>
            {receipt
              ? data.settings.receiptNote
              : "No automatic material consumption or printer automation is configured."}
          </p>
          <p style={{ marginTop: "var(--space-2)" }}>
            Preview generated {dateTime(new Date().toISOString())} ·
            Asia/Colombo · LKR
          </p>
          <p>
            No approved tax, fiscal receipt, refund or printer-hardware policy
            is configured.
          </p>
        </footer>
      </article>
    </>
  );
}
