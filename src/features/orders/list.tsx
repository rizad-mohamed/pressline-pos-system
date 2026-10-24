"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Plus, ArrowUpRight } from "lucide-react";
import { useDemo } from "@/data/provider";
import { balanceFor, paymentState, scopedOrders } from "@/domain/orders";
import { productionStates } from "@/domain/model";
import { dateTime } from "@/domain/dates";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import {
  EmptyState,
  Field,
  PageHeader,
  SearchField,
} from "@/components/shared/presentation";
import {
  Money,
  PaymentBadge,
  ProductionBadge,
} from "@/components/shared/domain-display";
import { OrderDetail } from "./detail";
export function OrderList({ jobs = false }: { jobs?: boolean }) {
  const { data, user, scope } = useDemo(),
    params = useSearchParams(),
    pathname = usePathname();
  const [selected, setSelected] = useState<string | null>(null);
  const q = params.get("q") ?? "",
    status = params.get("status") ?? (jobs ? "active" : "all"),
    payment = params.get("payment") ?? "all",
    sort = params.get("sort") ?? "newest";
  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    next.set(key, value);
    window.history.replaceState(null, "", `${pathname}?${next}`);
  }
  const rows = scopedOrders(data, user, scope)
    .filter(
      (o) =>
        (status === "all" ||
          (status === "active"
            ? o.production !== "Completed"
            : o.production === status)) &&
        (payment === "all" || paymentState(data, o) === payment) &&
        [o.id, o.customer.name, ...o.lines.map((l) => l.description)]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "oldest"
        ? a.createdAt.localeCompare(b.createdAt)
        : sort === "balance"
          ? balanceFor(data, b) - balanceFor(data, a)
          : b.createdAt.localeCompare(a.createdAt),
    );
  return (
    <>
      <PageHeader
        eyebrow={jobs ? "PRODUCTION" : "ORDER HISTORY"}
        title={jobs ? "Production jobs" : "Orders"}
        description={
          jobs
            ? "Keep every print job moving, from new work to handover."
            : "Find an order, review the details, and collect its remaining balance."
        }
        action={
          <Button asChild>
            <Link href="/pos">
              <Plus size={16} />
              New order
            </Link>
          </Button>
        }
      />
      <div className="toolbar">
        <SearchField
          label="Search orders"
          value={q}
          onChange={(value) => update("q", value)}
          placeholder="Order reference, customer or item…"
        />
        <Field label="Production" id="production-filter">
          <select
            className="select"
            id="production-filter"
            value={status}
            onChange={(e) => update("status", e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="active">Active jobs</option>
            {productionStates.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Payment" id="payment-filter">
          <select
            className="select"
            id="payment-filter"
            value={payment}
            onChange={(e) => update("payment", e.target.value)}
          >
            <option value="all">All payment states</option>
            {["Unpaid", "Partial", "Paid"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Sort" id="order-sort">
          <select
            className="select"
            id="order-sort"
            value={sort}
            onChange={(e) => update("sort", e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="balance">Largest balance</option>
          </select>
        </Field>
      </div>
      <section className="card">
        {rows.length ? (
          <div
            className="table-scroll"
            tabIndex={0}
            aria-label="Orders table, scroll horizontally for more columns"
          >
            <table>
              <caption className="sr-only">
                {jobs ? "Production queue" : "Order history"} for the selected
                branch scope
              </caption>
              <thead>
                <tr>
                  <th>Order / customer</th>
                  <th>Print work</th>
                  <th>Branch</th>
                  <th>Production</th>
                  {!jobs && (
                    <>
                      <th>Payment</th>
                      <th className="right">Balance</th>
                    </>
                  )}
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link className="text-link" href={`/orders/${o.id}`}>
                        {o.id}
                      </Link>
                      <div className="table-sub">
                        {o.customer.name || "Walk-in customer"}
                      </div>
                      <div className="table-sub">{dateTime(o.createdAt)}</div>
                    </td>
                    <td>
                      <div className="table-title">
                        {o.lines[0].description}
                      </div>
                      <div className="table-sub">
                        {o.lines.length}{" "}
                        {o.lines.length === 1 ? "item" : "items"} ·{" "}
                        {o.lines.reduce((n, l) => n + l.quantity, 0)} sheets
                      </div>
                    </td>
                    <td className="small muted">
                      {data.branches.find((b) => b.id === o.branchId)!.name}
                    </td>
                    <td>
                      <ProductionBadge value={o.production} />
                    </td>
                    {!jobs && (
                      <>
                        <td>
                          <PaymentBadge value={paymentState(data, o)} />
                        </td>
                        <td className="right">
                          <Money value={balanceFor(data, o)} />
                        </td>
                      </>
                    )}
                    <td>
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label={`View order ${o.id}`}
                        onClick={() => setSelected(o.id)}
                      >
                        View
                        <ArrowUpRight size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No matching orders"
            description="Try another reference or clear the filters. New orders appear here immediately after a local save."
            action={
              <Button
                variant="outline"
                onClick={() => window.history.replaceState(null, "", pathname)}
              >
                Clear filters
              </Button>
            }
          />
        )}
        <div className="table-footer">
          <span>
            {rows.length} {rows.length === 1 ? "order" : "orders"} ·{" "}
            {scope === "all"
              ? "All branches"
              : data.branches.find((b) => b.id === scope)!.name}
          </span>
          <span>
            {jobs
              ? "Production and payment states are independent"
              : "Saved prices remain unchanged after catalogue edits"}
          </span>
        </div>
      </section>
      <Sheet
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title={`Order ${selected ?? ""}`}
        description="Review print work, payments and production without leaving your search."
      >
        {selected && <OrderDetail orderId={selected} />}
      </Sheet>
    </>
  );
}
