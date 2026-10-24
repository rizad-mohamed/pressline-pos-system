"use client";
import { useState } from "react";
import { useDemo, useCommand, requestId } from "@/data/provider";
import { matchesCustomer } from "@/domain/customers";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { Field, Notice } from "@/components/shared/presentation";

export function LinkOrderCustomer({
  orderId,
  onClose,
}: {
  orderId: string;
  onClose: () => void;
}) {
  const { data } = useDemo();
  const command = useCommand();
  const [id] = useState(requestId);
  const [query, setQuery] = useState("");
  const [customerId, setCustomerId] = useState("");
  const rows = data.customers.filter(
    (c) => c.active && matchesCustomer(c, query),
  );
  return (
    <Sheet
      open
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
      title="Link order to a saved customer"
      description="Explicitly associate this branch order with a customer account. Its original name, price and payment snapshots stay unchanged."
      dirty={!!customerId}
      footer={
        <>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button
            disabled={!customerId || command.pending}
            onClick={async () => {
              const r = await command.run(
                { type: "link-customer", requestId: id, orderId, customerId },
                "Order linked; historical name and financial snapshots retained.",
              );
              if (r.ok) onClose();
            }}
          >
            Confirm customer link
          </Button>
        </>
      }
    >
      <div className="stack">
        <Notice>
          Check the intended customer carefully. Names are never matched
          automatically; an existing customer association cannot be overwritten
          by this action.
        </Notice>
        <Field id="link-customer-search" label="Find customer for this order">
          <input
            id="link-customer-search"
            className="input"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCustomerId("");
            }}
          />
        </Field>
        <Field id="link-customer-id" label="Link to customer">
          <select
            id="link-customer-id"
            className="select"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="">Choose an active customer</option>
            {rows.map((c) => (
              <option value={c.id} key={c.id}>
                {c.name} · {c.phone || c.kind}
              </option>
            ))}
          </select>
        </Field>
        {!rows.length && <p className="muted">No matching active customers.</p>}
        {command.error && <Notice tone="error">{command.error}</Notice>}
      </div>
    </Sheet>
  );
}
