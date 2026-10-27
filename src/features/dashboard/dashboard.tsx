"use client";
import { ScrollTable } from "@/components/shared/scroll-table";
import Link from "next/link";
import { ArrowRight, Plus, AlertTriangle } from "lucide-react";
import { useDemo } from "@/data/provider";
import { todayReport, report } from "@/domain/reports";
import { businessDate, shiftDate, dateTime } from "@/domain/dates";
import { scopedOrders, paymentState } from "@/domain/orders";
import {
  PageHeader,
  Badge,
  EmptyState,
} from "@/components/shared/presentation";
import {
  Money,
  ProductionBadge,
  PaymentBadge,
} from "@/components/shared/domain-display";
import { ComparisonChart } from "@/components/shared/comparison-chart";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
export function Dashboard() {
  const { data, user, scope } = useDemo();
  const today = businessDate(),
    summary = todayReport(data, scope),
    orders = scopedOrders(data, user, scope),
    active = orders.filter((o) => o.production !== "Completed");
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = shiftDate(today, i - 6);
    return { date, ...report(data, { from: date, to: date, scope }) };
  });
  const max = Math.max(1, ...days.flatMap((d) => [d.orderValue, d.collected]));
  const low = data.items.filter(
    (i) =>
      i.active &&
      data.branches.some(
        (b) =>
          (scope === "all" || scope === b.id) &&
          i.quantities[b.id] <= i.thresholds[b.id],
      ),
  );
  const metrics = [
    {
      label: "Today's order value",
      value: <Money value={summary.orderValue} />,
      note: `${summary.count} orders created today`,
    },
    {
      label: "Payments collected",
      value: <Money value={summary.collected} />,
      note: "Simulated receipts recorded today",
    },
    {
      label: "Outstanding balance",
      value: <Money value={summary.outstanding} />,
      note: "All orders · as of end of today",
    },
    {
      label: "Active print jobs",
      value: active.length,
      note: `${active.filter((o) => o.production === "Ready").length} ready for collection`,
    },
  ];
  return (
    <div className="stack">
      <PageHeader
        eyebrow="YOUR WORKSPACE, AT A GLANCE"
        title={user.role === "admin" ? "Branch overview" : "Your day, in focus"}
        description={`${new Intl.DateTimeFormat("en-LK", { timeZone: "Asia/Colombo", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date())} · ${scope === "all" ? "All branches" : data.branches.find((b) => b.id === scope)!.name}`}
        action={
          <Button asChild>
            <Link href="/pos">
              <Plus size={17} />
              New order
            </Link>
          </Button>
        }
      />
      <div className="metrics metrics-strip">
        {metrics.map((m) => (
          <section className="card metric" key={m.label}>
            <div className="metric-label">
              <h2 style={{ fontSize: "var(--text-sm)", fontWeight: 400 }}>
                {m.label}
              </h2>
            </div>
            <div className="metric-value">{m.value}</div>
            <p className="metric-note">{m.note}</p>
          </section>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="card">
          <div className="card-header">
            <div>
              <h2>Order value & collections</h2>
              <p className="small muted">Last 7 business dates · LKR</p>
            </div>
            <Badge>This week</Badge>
          </div>
          <div className="card-body">
            <div className="row small muted">
              <span>
                <span style={{ color: "var(--chart-1)" }}>●</span> Order value
              </span>
              <span>
                <span style={{ color: "var(--chart-2)" }}>●</span> Simulated
                collections
              </span>
            </div>
            <ComparisonChart rows={days} />
            <p className="chart-axis">
              Zero baseline · tallest bar <Money value={max} />
            </p>
            <details style={{ marginTop: "var(--space-3)" }}>
              <summary className="small" style={{ cursor: "pointer" }}>
                View chart data and financial definitions
              </summary>
              <p
                className="small muted"
                style={{ marginBlock: "var(--space-3)" }}
              >
                Order value follows creation date. Collections follow payment
                date. Outstanding is cumulative as of period end; it is not
                period cash flow.
              </p>
              <ScrollTable
                className="table-scroll"
                tabIndex={0}
                aria-label="Scrollable data table"
              >
                <table>
                  <caption className="sr-only">
                    Seven-day order and collection values in LKR
                  </caption>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Order value</th>
                      <th>Collected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((d) => (
                      <tr key={d.date}>
                        <td>{d.date}</td>
                        <td>
                          <Money value={d.orderValue} />
                        </td>
                        <td>
                          <Money value={d.collected} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollTable>
            </details>
          </div>
        </section>
        <section className="card">
          <div className="card-header">
            <h2>Production snapshot</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/jobs">
                View jobs
                <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
          <div className="card-body stack">
            {["New", "In Progress", "Ready", "Completed"].map((status) => {
              const count = orders.filter(
                (o) => o.production === status,
              ).length;
              return (
                <div
                  className="row between production-summary-row"
                  key={status}
                >
                  <ProductionBadge
                    value={status as (typeof orders)[number]["production"]}
                  />
                  <strong className="money">{count}</strong>
                </div>
              );
            })}
            <Separator />
            <div className="row">
              <AlertTriangle size={17} style={{ color: "var(--warning)" }} />
              <strong>{low.length} materials need attention</strong>
            </div>
            <p className="small muted">
              Thresholds use demonstration stock rules. Orders do not consume
              stock automatically.
            </p>
            {user.role === "admin" && (
              <Link href="/inventory?stock=low" className="text-link small">
                Review low stock →
              </Link>
            )}
          </div>
        </section>
      </div>
      <section className="card">
        <div className="card-header">
          <div>
            <h2>Recent orders</h2>
            <p className="small muted">
              Your latest printing work, in one place
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/orders">
              All orders
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
        {!orders.length ? (
          <EmptyState description="Create a printing order to start this branch's history." />
        ) : (
          <ScrollTable
            className="table-scroll"
            tabIndex={0}
            aria-label="Scrollable data table"
          >
            <table>
              <caption className="sr-only">Recent branch-scoped orders</caption>
              <thead>
                <tr>
                  <th>Order / customer</th>
                  <th>Created</th>
                  <th>Production</th>
                  <th>Payment</th>
                  <th className="right">Order total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link href={`/orders/${o.id}`} className="text-link">
                        {o.id}
                      </Link>
                      <div className="table-sub">
                        {o.customer.name || "Walk-in customer"}
                      </div>
                    </td>
                    <td className="small muted">{dateTime(o.createdAt)}</td>
                    <td>
                      <ProductionBadge value={o.production} />
                    </td>
                    <td>
                      <PaymentBadge value={paymentState(data, o)} />
                    </td>
                    <td className="right">
                      <Money value={o.totalCents} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollTable>
        )}
        <div className="table-footer">
          <span>Shared local demo data · no live branch synchronization</span>
          <span>Asia/Colombo business dates</span>
        </div>
      </section>
      <section className="card">
        <div className="card-header">
          <h2>Recent activity</h2>
          <Badge>Mock audit trail</Badge>
        </div>
        <div className="card-body">
          {data.audit
            .filter(
              (event) => user.role === "admin" || event.actorId === user.id,
            )
            .slice(0, 4)
            .map((event) => (
              <div className="activity-item" key={event.id}>
                <span className="activity-dot" />
                <div className="grow">
                  <strong>{event.action}</strong>
                  <p className="small muted">{event.detail}</p>
                </div>
                <time className="small muted">{dateTime(event.createdAt)}</time>
              </div>
            ))}
          {!data.audit.some(
            (e) => user.role === "admin" || e.actorId === user.id,
          ) && (
            <p className="muted">
              New local actions will appear here after you save them.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
