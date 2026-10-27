"use client";
import { ScrollTable } from "@/components/shared/scroll-table";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Plus, Package, SlidersHorizontal } from "lucide-react";
import { useDemo, useCommand, requestId } from "@/data/provider";
import type { StockItem } from "@/domain/model";
import { dateTime } from "@/domain/dates";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Badge,
  EmptyState,
  Field,
  Notice,
  PageHeader,
  SearchField,
} from "@/components/shared/presentation";
import { ItemDrawer } from "./item-drawer";
import { AdjustDrawer } from "./adjust-drawer";
import { AdaptiveFilters } from "@/components/shared/adaptive-filters";
export function Inventory() {
  const { data, scope } = useDemo(),
    command = useCommand(),
    params = useSearchParams();
  const [search, setSearch] = useState(""),
    [status, setStatus] = useState("active"),
    [stock, setStock] = useState(params.get("stock") === "low" ? "low" : "all"),
    [editing, setEditing] = useState<StockItem | null | undefined>(undefined),
    [adjusting, setAdjusting] = useState<StockItem | null>(null),
    [deactivating, setDeactivating] = useState<StockItem | null>(null);
  const branches = data.branches.filter(
    (b) => scope === "all" || b.id === scope,
  );
  const low = (item: StockItem) =>
    branches.some((b) => item.quantities[b.id] <= item.thresholds[b.id]);
  const items = data.items.filter(
    (i) =>
      (status === "all" || (status === "active" ? i.active : !i.active)) &&
      (stock !== "low" || low(i)) &&
      `${i.name} ${i.sku}`.toLowerCase().includes(search.toLowerCase()),
  );
  const [historyLimit, setHistoryLimit] = useState(50);
  const movements = data.movements.filter(
    (m) => scope === "all" || m.branchId === scope,
  );
  return (
    <div className="stack">
      <PageHeader
        eyebrow="BRANCH MATERIALS"
        title="Inventory"
        description="Know what's on hand, and what needs replenishing."
        action={
          <Button onClick={() => setEditing(null)}>
            <Plus size={16} />
            Add material
          </Button>
        }
      />
      <div className="summary-grid inventory-metrics">
        <section className="card metric">
          <div className="metric-label">
            <h2 style={{ fontSize: "var(--text-sm)" }}>Active materials</h2>
            <Package size={18} />
          </div>
          <div className="metric-value">
            {data.items.filter((i) => i.active).length}
          </div>
          <p className="metric-note">
            Distinct materials · quantities use each material&apos;s unit
          </p>
        </section>
        <section className="card metric">
          <div className="metric-label">
            <h2 style={{ fontSize: "var(--text-sm)" }}>Low-stock positions</h2>
            <SlidersHorizontal size={18} />
          </div>
          <div className="metric-value">
            {data.items
              .filter((i) => i.active)
              .reduce(
                (n, i) =>
                  n +
                  branches.filter(
                    (b) => i.quantities[b.id] <= i.thresholds[b.id],
                  ).length,
                0,
              )}
          </div>
          <p className="metric-note">
            Branch / material pairs at or below their threshold
          </p>
        </section>
      </div>
      <Notice>
        Saving an order does not deduct stock. Confirm actual usage in its job
        details. Opening balances, adjustments, transfers and reasoned usage
        corrections remain separate ledger events.
      </Notice>
      <section>
        <AdaptiveFilters
          summary={`${status === "active" ? "Active materials" : status === "inactive" ? "Inactive materials" : "All materials"} · ${stock === "low" ? "Low stock only" : "All stock levels"}`}
        >
          <SearchField
            label="Search materials"
            value={search}
            onChange={setSearch}
            placeholder="Material name or code…"
          />
          <Field label="Material status" id="material-status">
            <select
              id="material-status"
              className="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active materials</option>
              <option value="inactive">Inactive materials</option>
              <option value="all">All materials</option>
            </select>
          </Field>
          <Field label="Stock level" id="stock-level">
            <select
              id="stock-level"
              className="select"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            >
              <option value="all">All levels</option>
              <option value="low">Low stock only</option>
            </select>
          </Field>
        </AdaptiveFilters>
        <div className="card">
          {items.length ? (
            <ScrollTable
              className="table-scroll"
              tabIndex={0}
              aria-label="Inventory table, scroll for branch quantities"
            >
              <table>
                <caption className="sr-only">
                  Materials with quantities and low-stock thresholds by branch
                </caption>
                <thead>
                  <tr>
                    <th>Material</th>
                    {branches.map((b) => (
                      <th key={b.id} className="right">
                        {b.name} balance
                      </th>
                    ))}
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <button
                          className="text-link table-title"
                          onClick={() => setEditing(item)}
                        >
                          {item.name}
                        </button>
                        <p className="table-sub">
                          {item.sku} · {item.unit}
                        </p>
                      </td>
                      {branches.map((b) => (
                        <td key={b.id} className="right money">
                          <strong>
                            {item.quantities[b.id].toLocaleString("en-LK")}
                          </strong>
                          <p className="table-sub">
                            Low at ≤ {item.thresholds[b.id]}
                          </p>
                        </td>
                      ))}
                      <td>
                        <Badge
                          tone={
                            !item.active
                              ? "neutral"
                              : low(item)
                                ? "warning"
                                : "success"
                          }
                        >
                          {!item.active
                            ? "Inactive"
                            : low(item)
                              ? "Low stock"
                              : "In stock"}
                        </Badge>
                      </td>
                      <td>
                        <div className="row">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAdjusting(item)}
                            disabled={!item.active}
                            aria-label={`Adjust ${item.name}`}
                          >
                            Adjust
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              item.active
                                ? setDeactivating(item)
                                : command.run(
                                    {
                                      type: "stock-active",
                                      requestId: requestId(),
                                      itemId: item.id,
                                      active: true,
                                    },
                                    "Material reactivated.",
                                  )
                            }
                          >
                            {item.active ? "Deactivate" : "Reactivate"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollTable>
          ) : (
            <EmptyState
              title="No matching materials"
              description="Change the filters or add a fictional material to begin tracking it."
            />
          )}
          <div className="table-footer">
            <span>
              {items.length} materials ·{" "}
              {scope === "all" ? "All branches" : branches[0].name}
            </span>
            <span>Deactivation preserves balances and history</span>
          </div>
        </div>
      </section>
      {command.error && <Notice tone="error">{command.error}</Notice>}
      <section className="card">
        <div className="card-header">
          <div>
            <h2>Stock movement history</h2>
            <p className="small muted">
              Opening balances, adjustments, transfers and confirmed job usage
            </p>
          </div>
          <Badge>{movements.length} movements</Badge>
        </div>
        <ScrollTable
          className="table-scroll"
          tabIndex={0}
          aria-label="Scrollable data table"
        >
          <table>
            <caption className="sr-only">Stock movement ledger</caption>
            <thead>
              <tr>
                <th>Material / reason</th>
                <th>Branch</th>
                <th className="right">Change</th>
                <th>Recorded by</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {movements.slice(0, historyLimit).map((m) => (
                <tr key={m.id}>
                  <td>
                    <strong>
                      {data.items.find((i) => i.id === m.itemId)?.name}
                    </strong>
                    <p className="table-sub">
                      {m.reason}
                      {m.transferId ? ` · ${m.transferId}` : ""}
                    </p>
                    {m.orderId && (
                      <>
                        <Link
                          className="table-title small"
                          href={`/orders/${m.orderId}`}
                        >
                          {m.orderId} · {m.serviceName}
                        </Link>
                        <p className="table-sub record-ref">{m.id}</p>
                        <p className="table-sub">
                          {m.before} → {m.after} {m.unit} · {m.lineId}
                        </p>
                      </>
                    )}
                  </td>
                  <td>
                    {data.branches.find((b) => b.id === m.branchId)!.name}
                  </td>
                  <td className="money right">
                    {m.delta > 0 ? "+" : ""}
                    {m.delta} {data.items.find((i) => i.id === m.itemId)?.unit}
                  </td>
                  <td className="small muted">
                    {data.users.find((u) => u.id === m.actorId)?.name}
                  </td>
                  <td className="small muted">{dateTime(m.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollTable>
        {movements.length > historyLimit && (
          <div className="table-footer">
            <span>
              Showing {historyLimit} of {movements.length} movements
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHistoryLimit((n) => n + 50)}
            >
              Show more movements
            </Button>
          </div>
        )}
      </section>
      {editing !== undefined && (
        <ItemDrawer item={editing} onClose={() => setEditing(undefined)} />
      )}
      {adjusting && (
        <AdjustDrawer item={adjusting} onClose={() => setAdjusting(null)} />
      )}
      <ConfirmDialog
        open={!!deactivating}
        onOpenChange={(open) => {
          if (!open) setDeactivating(null);
        }}
        title="Deactivate this material?"
        description={`${deactivating?.name ?? "Material"} will be hidden from active lists and unavailable for adjustments or transfers. Existing quantities and movement history remain. You can reactivate it later.`}
        action="Deactivate material"
        onConfirm={() => {
          if (deactivating)
            command.run(
              {
                type: "stock-active",
                requestId: requestId(),
                itemId: deactivating.id,
                active: false,
              },
              "Material deactivated. History retained.",
            );
          setDeactivating(null);
        }}
      />
    </div>
  );
}
