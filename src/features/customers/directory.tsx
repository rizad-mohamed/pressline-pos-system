"use client";
import { ScrollTable } from "@/components/shared/scroll-table";
import Link from "next/link";
import { useState } from "react";
import { Plus, ArrowUpRight } from "lucide-react";
import { useDemo } from "@/data/provider";
import { customerLedger, matchesCustomer } from "@/domain/customers";
import { Button } from "@/components/ui/button";
import {
  Badge,
  EmptyState,
  Field,
  Notice,
  PageHeader,
  SearchField,
} from "@/components/shared/presentation";
import { Money } from "@/components/shared/domain-display";
import { CustomerEditor } from "./editor";

export function CustomerDirectory() {
  const { data, user } = useDemo();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("active");
  const rows = data.customers
    .filter(
      (c) =>
        (status === "all" || c.active === (status === "active")) &&
        matchesCustomer(c, query),
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="stack">
      <PageHeader
        eyebrow="CUSTOMER DIRECTORY"
        title="Customers"
        description="A familiar name. A clear account of every print job."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus size={16} />
            Add customer
          </Button>
        }
      />
      <Notice>
        Fictional browser-local customer records, shared between branches.{" "}
        {user.role === "cashier"
          ? "Amounts and history are At this branch only."
          : "Customer amounts cover all branches, independently of the workspace read filter."}{" "}
        This is not secure production customer storage.
      </Notice>
      <div className="toolbar">
        <SearchField
          label="Search customers"
          placeholder="Name, company, contact or phone…"
          value={query}
          onChange={setQuery}
        />
        <Field label="Customer status" id="customer-status">
          <select
            className="select"
            id="customer-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active customers</option>
            <option value="archived">Archived customers</option>
            <option value="all">All customers</option>
          </select>
        </Field>
      </div>
      <section className="card">
        <div className="card-header">
          <h2>
            {rows.length} {rows.length === 1 ? "customer" : "customers"}
          </h2>
          <span className="small muted">
            {user.role === "cashier" ? "At this branch" : "All branches"}
          </span>
        </div>
        {rows.length ? (
          <ScrollTable
            className="table-scroll"
            tabIndex={0}
            aria-label="Scrollable customer directory"
          >
            <table>
              <caption className="sr-only">
                Saved customers and permitted outstanding balances
              </caption>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th className="right">Orders</th>
                  <th className="right">Outstanding · LKR</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => {
                  const ledger = customerLedger(data, user, c.id);
                  return (
                    <tr key={c.id}>
                      <td>
                        <Link
                          className="table-title"
                          href={`/customers/${c.id}`}
                        >
                          {c.name}
                        </Link>
                        <p className="small muted">
                          {c.kind === "Business"
                            ? "Business / Company"
                            : "Individual"}
                        </p>
                      </td>
                      <td>
                        <span>{c.phone || "No phone saved"}</span>
                        <p className="small muted">
                          {c.contactPerson || c.email || "Optional details"}
                        </p>
                      </td>
                      <td>
                        <Badge tone={c.active ? "success" : "neutral"}>
                          {c.active ? "Active" : "Archived"}
                        </Badge>
                      </td>
                      <td className="right money">{ledger.orders.length}</td>
                      <td className="right">
                        <Money value={ledger.outstanding} />
                      </td>
                      <td>
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`/customers/${c.id}`}
                            aria-label={`View customer ${c.name}`}
                          >
                            View
                            <ArrowUpRight size={15} />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ScrollTable>
        ) : (
          <EmptyState
            title={
              query ? "No matching customers" : "No customers in this view"
            }
            description="Change the search or status filter, or save a fictional customer to begin their history."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setStatus("all");
                }}
              >
                Clear customer filters
              </Button>
            }
          />
        )}
        <div className="card-body small muted">
          Balances derive from linked orders and recorded payments. Legacy
          free-text orders stay unlinked until explicitly associated.
        </div>
      </section>
      {open && <CustomerEditor onClose={() => setOpen(false)} />}
    </div>
  );
}
