"use client";
import Link from "next/link";
import { useState } from "react";
import { useDemo } from "@/data/provider";
import { customerLedger, matchesCustomer } from "@/domain/customers";
import type { SavedCustomer } from "@/domain/model";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Field, Notice } from "@/components/shared/presentation";
import { Money } from "@/components/shared/domain-display";
import { CustomerEditor } from "./editor";

export function CustomerSelector({
  customerId,
  onSelect,
  allowWalkIn = true,
}: {
  customerId?: string | null;
  onSelect: (customer: SavedCustomer | null) => void;
  allowWalkIn?: boolean;
}) {
  const { data, user } = useDemo();
  const [open, setOpen] = useState(false);
  const [create, setCreate] = useState(false);
  const [query, setQuery] = useState("");
  const selected = data.customers.find((c) => c.id === customerId);
  const matches = data.customers
    .filter((c) => c.active && matchesCustomer(c, query))
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="stack customer-selection">
      <div className="row between">
        <div>
          <strong>
            {selected
              ? selected.name
              : allowWalkIn
                ? "Walk-in / Not linked"
                : "Choose a saved customer"}
          </strong>
          <p className="small muted">
            {selected
              ? `${selected.kind} · ${selected.phone || "No phone saved"}${selected.active ? "" : " · archived; change before saving"}`
              : "Personal details are optional. Choose a saved customer to connect their history."}
          </p>
        </div>
        <Button variant="outline" onClick={() => setOpen(true)}>
          {selected ? "Change customer" : "Find saved customer"}
        </Button>
      </div>
      {selected && (
        <div className="row">
          <Button variant="ghost" size="sm" asChild>
            <Link prefetch={false} href={`/customers/${selected.id}`}>
              View customer history
            </Link>
          </Button>
          {allowWalkIn && (
            <Button variant="ghost" size="sm" onClick={() => onSelect(null)}>
              Remove customer link
            </Button>
          )}
        </div>
      )}
      <Button variant="ghost" size="sm" onClick={() => setCreate(true)}>
        Add new customer
      </Button>
      {open && (
        <Sheet
          open
          onOpenChange={setOpen}
          title="Select a saved customer"
          description="Search fictional customers by name, company or phone. Only active records can be selected."
          footer={
            allowWalkIn ? (
              <Button
                variant="outline"
                onClick={() => {
                  onSelect(null);
                  setOpen(false);
                }}
              >
                Continue as walk-in / Not linked
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close selection
              </Button>
            )
          }
        >
          <div className="stack">
            <Field id="saved-customer-search" label="Search saved customers">
              <input
                id="saved-customer-search"
                className="input"
                type="search"
                autoComplete="off"
                placeholder="Name, company or phone…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Field>
            <p className="small muted" role="status">
              {matches.length} matching active customers
              {matches.length > 50
                ? "; showing the first 50. Refine the search."
                : ""}
            </p>
            {matches.slice(0, 50).map((c) => {
              const ledger = customerLedger(data, user, c.id);
              return (
                <div className="line-card stack" key={c.id}>
                  <div>
                    <strong>{c.name}</strong>
                    <p className="small muted">
                      {c.kind === "Business"
                        ? "Business / Company"
                        : "Individual"}{" "}
                      · {c.phone || "No phone saved"}{" "}
                      {c.contactPerson && `· ${c.contactPerson}`}
                    </p>
                  </div>
                  <details>
                    <summary>Quick view · {c.name}</summary>
                    <div
                      className="stack"
                      style={{ marginTop: "var(--space-3)" }}
                    >
                      <p className="small">{c.email || "No email saved"}</p>
                      <p className="small">{c.address || "No address saved"}</p>
                      <p>
                        {user.role === "cashier"
                          ? "At this branch"
                          : "All branches"}
                        : {ledger.orders.length} orders · outstanding{" "}
                        <Money value={ledger.outstanding} />
                      </p>
                    </div>
                  </details>
                  <Button
                    variant="outline"
                    onClick={() => {
                      onSelect(c);
                      setOpen(false);
                    }}
                    aria-label={`Select customer ${c.name}`}
                  >
                    Select customer
                  </Button>
                </div>
              );
            })}
            {!matches.length && (
              <Notice>
                No matching active customers. Refine the search or close this
                drawer and add a new fictional customer.
              </Notice>
            )}
          </div>
        </Sheet>
      )}
      {create && (
        <CustomerEditor
          onClose={() => setCreate(false)}
          onSaved={(customer) => onSelect(customer)}
        />
      )}
    </div>
  );
}
