"use client";
import { useState } from "react";
import { CalendarDays, ArrowRight, ChartNoAxesCombined } from "lucide-react";
import { useDemo } from "@/data/provider";
import { report, reportQuerySchema } from "@/domain/reports";
import { businessDate, periodRange, shiftDate } from "@/domain/dates";
import { productionStates } from "@/domain/model";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Badge,
  EmptyState,
  Field,
  Notice,
  PageHeader,
} from "@/components/shared/presentation";
import { Money, ProductionBadge } from "@/components/shared/domain-display";
type Period = "daily" | "weekly" | "monthly" | "custom";
export function Reports() {
  const { data, scope } = useDemo(),
    today = businessDate();
  const [period, setPeriod] = useState<Period>("daily"),
    [anchor, setAnchor] = useState(today),
    [from, setFrom] = useState(today),
    [to, setTo] = useState(today),
    [applied, setApplied] = useState({ from: today, to: today }),
    [error, setError] = useState("");
  const r = report(data, { ...applied, scope });
  const length =
    Math.round(
      (new Date(applied.to + "T00:00:00Z").getTime() -
        new Date(applied.from + "T00:00:00Z").getTime()) /
        86400000,
    ) + 1;
  const previousRange = {
    from: shiftDate(applied.from, -length),
    to: shiftDate(applied.from, -1),
  };
  const previous = report(data, { ...previousRange, scope });
  const change = r.collected - previous.collected;
  const statuses = productionStates.map((status) => ({
    status,
    count: r.rows.reduce((n, row) => n + (row.statuses[status] ?? 0), 0),
  }));
  const max = Math.max(
    1,
    ...r.rows.flatMap((row) => [row.orderValue, row.collected]),
  );
  const metrics = [
    {
      label: "Orders created",
      value: r.count,
      note: "Orders whose creation date is in this period",
      test: "report-count",
    },
    {
      label: "Order value",
      value: <Money value={r.orderValue} />,
      note: "Saved totals of orders created in this period",
      test: "report-value",
    },
    {
      label: "Simulated collections",
      value: <Money value={r.collected} />,
      note: "Payments recorded in this period, for any order",
      test: "report-collected",
    },
    {
      label: "Outstanding as of period end",
      value: <Money value={r.outstanding} />,
      note: "All earlier orders less payments through period end",
      test: "report-outstanding",
    },
  ];
  function apply(e: React.FormEvent) {
    e.preventDefault();
    try {
      const range =
        period === "custom" ? { from, to } : periodRange(period, anchor);
      const valid = reportQuerySchema.safeParse({ ...range, scope });
      if (!valid.success) {
        setError(valid.error.issues.map((i) => i.message).join(" "));
        return;
      }
      setApplied(range);
      setError("");
    } catch {
      setError(
        "Choose valid calendar dates. Start date must be on or before end date.",
      );
    }
  }
  return (
    <div className="stack">
      <PageHeader
        eyebrow="FINANCIAL VISIBILITY"
        title="Reports"
        description="A clear view of order value, simulated collections, and balances."
      />
      <section className="card card-body">
        <form
          className="toolbar"
          onSubmit={apply}
          style={{ marginBottom: 0 }}
          noValidate
        >
          <Field label="Report period" id="report-period">
            <select
              id="report-period"
              className="select"
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly · Monday start</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom range</option>
            </select>
          </Field>
          {period === "custom" ? (
            <>
              <Field label="Start date" id="report-from">
                <input
                  id="report-from"
                  type="date"
                  className="input"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  aria-describedby={error ? "report-range-error" : undefined}
                  aria-invalid={!!error}
                />
              </Field>
              <Field label="End date" id="report-to">
                <input
                  id="report-to"
                  type="date"
                  className="input"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  aria-describedby={error ? "report-range-error" : undefined}
                  aria-invalid={!!error}
                />
              </Field>
            </>
          ) : (
            <Field label="Business date" id="report-anchor">
              <input
                id="report-anchor"
                type="date"
                className="input"
                value={anchor}
                onChange={(e) => setAnchor(e.target.value)}
                aria-describedby={error ? "report-range-error" : undefined}
                aria-invalid={!!error}
              />
            </Field>
          )}
          <Button type="submit">
            <CalendarDays size={16} />
            Apply period
          </Button>
        </form>
        {error && (
          <p
            className="field-error"
            id="report-range-error"
            role="alert"
            style={{ marginTop: "var(--space-3)" }}
          >
            {error}
          </p>
        )}
      </section>
      <div className="row between">
        <div className="row">
          <Badge tone="primary">
            {scope === "all"
              ? "Consolidated · all branches"
              : data.branches.find((b) => b.id === scope)!.name}
          </Badge>
          <span className="small muted" data-testid="report-range">
            {applied.from}{" "}
            <ArrowRight size={12} style={{ display: "inline" }} /> {applied.to}
          </span>
        </div>
        <span className="small muted">
          Inclusive calendar dates · Asia/Colombo · LKR
        </span>
      </div>
      <div className="metrics metrics-strip">
        {metrics.map((metric) => (
          <section className="card metric" key={metric.label}>
            <h2 className="metric-label" style={{ fontWeight: 400 }}>
              {metric.label}
            </h2>
            <div className="metric-value" data-testid={metric.test}>
              {metric.value}
            </div>
            <p className="metric-note">{metric.note}</p>
          </section>
        ))}
      </div>
      {r.count === 0 && r.collected === 0 && (
        <div className="card">
          <EmptyState
            title="No activity in this period"
            description="No orders or payments fall in this range. Outstanding balances may remain from earlier orders."
          />
        </div>
      )}
      <section className="card">
        <div className="card-header">
          <div>
            <h2>Branch financial breakdown</h2>
            <p className="small muted">
              Each row uses the same underlying order and payment records
            </p>
          </div>
          <ChartNoAxesCombined size={18} className="muted" />
        </div>
        <div
          className="table-scroll"
          tabIndex={0}
          aria-label="Financial report table"
        >
          <table>
            <caption className="sr-only">
              Period financial values by branch, in LKR
            </caption>
            <thead>
              <tr>
                <th>Branch</th>
                <th className="right">Orders</th>
                <th className="right">Order value</th>
                <th className="right">Simulated collections</th>
                <th className="right">Outstanding at end</th>
              </tr>
            </thead>
            <tbody>
              {r.rows.map((row) => (
                <tr key={row.branchId}>
                  <td className="table-title">
                    {data.branches.find((b) => b.id === row.branchId)!.name}
                  </td>
                  <td className="right money">{row.count}</td>
                  <td className="right">
                    <Money value={row.orderValue} />
                  </td>
                  <td className="right">
                    <Money value={row.collected} />
                  </td>
                  <td className="right">
                    <Money value={row.outstanding} />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>Total selected scope</th>
                <th className="right">{r.count}</th>
                <th className="right">
                  <Money value={r.orderValue} />
                </th>
                <th className="right">
                  <Money value={r.collected} />
                </th>
                <th className="right">
                  <Money value={r.outstanding} />
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
      <div className="summary-grid">
        <section className="card">
          <div className="card-header">
            <h2>Branch comparison</h2>
            <Badge>LKR · zero baseline</Badge>
          </div>
          <div className="card-body stack">
            {r.rows.map((row) => (
              <div
                className="stack"
                style={{ gap: "var(--space-2)" }}
                key={row.branchId}
              >
                <h3>
                  {data.branches.find((b) => b.id === row.branchId)!.name}
                </h3>
                <div className="row between small">
                  <span>Order value</span>
                  <Money value={row.orderValue} />
                </div>
                <div className="bar-track" aria-hidden="true">
                  <div
                    className="bar-value"
                    style={{ width: `${(row.orderValue / max) * 100}%` }}
                  />
                </div>
                <div className="row between small">
                  <span>Simulated collections</span>
                  <Money value={row.collected} />
                </div>
                <div className="bar-track" aria-hidden="true">
                  <div
                    className="bar-value secondary"
                    style={{ width: `${(row.collected / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <p className="small muted">
              Full scale: <Money value={max} />. Exact values are available in
              the table above.
            </p>
          </div>
        </section>
        <section className="card">
          <div className="card-header">
            <h2>Context for this period</h2>
          </div>
          <div className="card-body stack">
            <div>
              <p className="small muted">
                Simulated collections vs previous {length}-day period
              </p>
              <h2 style={{ marginTop: "var(--space-2)" }}>
                {change < 0 ? "−" : "+"}
                <Money value={Math.abs(change)} />
              </h2>
              <p className="small muted">
                Compared with {previousRange.from} to {previousRange.to}
              </p>
            </div>
            <Separator />
            <h3>Current production of this order cohort</h3>
            {statuses.map((s) => (
              <div className="row between" key={s.status}>
                <ProductionBadge value={s.status} />
                <strong>{s.count}</strong>
              </div>
            ))}
            <p className="small muted">
              Production states reflect their current value, not a reconstructed
              historical state.
            </p>
          </div>
        </section>
      </div>
      <Notice>
        Order value and collected payments use different date cohorts.
        Outstanding is cumulative as of the final calendar day. These demo
        definitions do not establish tax or accounting recognition rules.
      </Notice>
      <p className="small muted">
        Weekly periods begin on Monday as a provisional demo convention. Reports
        reconcile within this browser only; production needs trusted server
        calculations and database transactions.
      </p>
    </div>
  );
}
