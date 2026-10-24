"use client";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCommand, useDemo, requestId } from "@/data/provider";
import {
  savedCustomerValuesSchema,
  type CustomerValues,
  type SavedCustomer,
} from "@/domain/model";
import { likelyCustomers } from "@/domain/customers";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Field, Notice } from "@/components/shared/presentation";

export function CustomerEditor({
  customer,
  onClose,
  onSaved,
}: {
  customer?: SavedCustomer;
  onClose: () => void;
  onSaved?: (customer: SavedCustomer) => void;
}) {
  const { data } = useDemo();
  const command = useCommand();
  const [id] = useState(requestId);
  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const form = useForm<CustomerValues>({
    resolver: zodResolver(savedCustomerValuesSchema),
    defaultValues: customer ?? {
      kind: "Individual",
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
    },
    mode: "onBlur",
  });
  const values = useWatch({ control: form.control });
  const duplicates = likelyCustomers(
    data.customers,
    {
      name: values.name ?? "",
      phone: values.phone ?? "",
      email: values.email ?? "",
    },
    customer?.id,
  );
  const fields = [
    { key: "name", label: "Customer / company name", required: true },
    { key: "contactPerson", label: "Contact person (optional)" },
    { key: "phone", label: "Phone (optional)", type: "tel" },
    { key: "email", label: "Email (optional)", type: "email" },
    { key: "address", label: "Address (optional)" },
    { key: "notes", label: "Internal customer notes (optional)" },
  ] as const;
  return (
    <Sheet
      open
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
      title={customer ? "Edit customer" : "Add customer"}
      description="Fictional demo details only. Saved in this browser, without secure production customer storage."
      dirty={form.formState.isDirty}
      footer={
        <>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button
            type="submit"
            form="customer-profile-form"
            disabled={command.pending}
          >
            {command.pending ? "Saving locally…" : "Save customer"}
          </Button>
        </>
      }
    >
      <form
        id="customer-profile-form"
        className="stack"
        noValidate
        onSubmit={form.handleSubmit(async (values) => {
          const r = await command.run(
            {
              type: "customer-save",
              requestId: id,
              customerId: customer?.id ?? null,
              expectedUpdatedAt: customer?.updatedAt,
              values,
              allowDuplicate,
            },
            "Customer saved locally.",
          );
          if (r.ok) {
            onSaved?.(
              r.data.customers.find(
                (c) => c.id === (customer?.id ?? `cust-${id}`),
              )!,
            );
            onClose();
          }
        })}
      >
        <Notice>
          Customers are shared across the two demo branches. Cashier financial
          history remains limited to their branch. Optional contact fields can
          stay blank.
        </Notice>
        <Field label="Customer kind" id="customer-profile-kind">
          <select
            className="select"
            id="customer-profile-kind"
            {...form.register("kind")}
          >
            <option value="Individual">Individual</option>
            <option value="Business">Business / Company</option>
          </select>
        </Field>
        {fields.map((f) => (
          <Field
            key={f.key}
            id={`customer-profile-${f.key}`}
            label={f.label}
            error={form.formState.errors[f.key]?.message}
          >
            <input
              className="input"
              id={`customer-profile-${f.key}`}
              type={"type" in f ? f.type : "text"}
              autoComplete="off"
              {...form.register(f.key)}
              aria-invalid={!!form.formState.errors[f.key]}
              aria-describedby={
                form.formState.errors[f.key]
                  ? `customer-profile-${f.key}-error`
                  : undefined
              }
            />
          </Field>
        ))}
        {!!duplicates.length && (
          <Notice tone="warning">
            <p>
              A similar customer already exists:{" "}
              {duplicates
                .map((c) => `${c.name}${c.active ? "" : " (archived)"}`)
                .join(", ")}
              . Review before creating a separate record.
            </p>
            <label className="row">
              <input
                type="checkbox"
                checked={allowDuplicate}
                onChange={(e) => setAllowDuplicate(e.target.checked)}
              />
              These are separate customers; keep both records
            </label>
          </Notice>
        )}
        {command.error && <Notice tone="error">{command.error}</Notice>}
      </form>
    </Sheet>
  );
}
