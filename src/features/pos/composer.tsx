"use client";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RotateCcw } from "lucide-react";
import { useDemo, useCommand, requestId } from "@/data/provider";
import { blankLine, quoteOrder } from "@/domain/pricing";
import { money } from "@/domain/money";
import type { BranchId, LineInput } from "@/domain/model";
import {
  orderFormSchema,
  orderDraftSchema,
  type OrderFormValues,
} from "./schema";
import { LineEditor } from "./line-editor";
import { Button } from "@/components/ui/button";
import { Badge, Field, PageHeader } from "@/components/shared/presentation";
import { OrderReview } from "./order-review";
import { ResponsiveSummary } from "./responsive-summary";
import { CustomerSelector } from "@/features/customers/selector";
import { ServiceCatalogue } from "./service-catalogue";
import { OrderConfirmation } from "./order-confirmation";
const draftKey = "pressline.draft.v1";
export function Composer({
  initialCustomerId,
}: {
  initialCustomerId?: string;
}) {
  const { data, user, scope } = useDemo(),
    command = useCommand();
  const [review, setReview] = useState<OrderFormValues | null>(null),
    [completed, setCompleted] = useState<string | null>(null),
    [removed, setRemoved] = useState<LineInput | null>(null),
    [draftIssue, setDraftIssue] = useState("");
  const [submission, setSubmission] = useState("");
  const schema = useMemo(() => orderFormSchema(data.pricing, data), [data]);
  function defaults(): OrderFormValues {
    const fallback = {
      branchId: (user.role === "cashier"
        ? user.branchId
        : scope !== "all"
          ? scope
          : undefined) as BranchId,
      customer: { name: "", phone: "" },
      customerId: null,
      lines: [blankLine()],
      notes: "",
      advance: "0.00",
    };
    try {
      const raw = window.sessionStorage.getItem(draftKey);
      if (raw) {
        const saved = JSON.parse(raw);
        const parsed = orderDraftSchema.safeParse(saved.values);
        if (
          saved.ownerId === user.id &&
          parsed.success &&
          (user.role === "admin" || parsed.data.branchId === user.branchId)
        )
          return withSelectedCustomer(parsed.data);
      }
    } catch {}
    return withSelectedCustomer(fallback);
  }
  function withSelectedCustomer(values: OrderFormValues): OrderFormValues {
    const customer = initialCustomerId
      ? data.customers.find((c) => c.id === initialCustomerId && c.active)
      : null;
    return customer
      ? {
          ...values,
          customerId: customer.id,
          customer: { name: customer.name, phone: customer.phone },
        }
      : values;
  }
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults(),
    // After first blur, clear corrected errors before a following pointer click.
    mode: "onTouched",
    reValidateMode: "onChange",
  });
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "lines",
  });
  const values = useWatch({ control: form.control });
  const quote = useMemo(() => {
    try {
      return quoteOrder(
        (values.lines ?? []) as LineInput[],
        data.pricing,
        data,
      );
    } catch {
      return null;
    }
  }, [values.lines, data]);
  let advance = 0;
  try {
    advance = money(values.advance ?? "0");
  } catch {}
  useEffect(
    () =>
      form.subscribe({
        formState: { values: true },
        callback: ({ values }) => {
          const parsed = orderDraftSchema.safeParse(values);
          if (parsed.success)
            try {
              window.sessionStorage.setItem(
                draftKey,
                JSON.stringify({ ownerId: user.id, values: parsed.data }),
              );
            } catch {
              setDraftIssue(
                "The tab draft could not be saved. Keep this view open until you finish or copy your instructions.",
              );
            }
        },
      }),
    [form, user.id],
  );
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [form.formState.isDirty]);
  async function save() {
    if (!review) return;
    const result = await command.run(
      {
        type: "create-order",
        requestId: submission,
        branchId: review.branchId,
        customer: review.customer,
        customerId: review.customerId ?? null,
        lines: review.lines,
        notes: review.notes,
        advanceCents: money(review.advance),
      },
      "Demonstration order saved. No real payment was taken.",
    );
    if (result.ok) {
      setCompleted(result.data.orders[0].id);
      setReview(null);
      form.reset({
        branchId: review.branchId,
        customer: { name: "", phone: "" },
        customerId: null,
        lines: [blankLine()],
        notes: "",
        advance: "0.00",
      });
      try {
        window.sessionStorage.removeItem(draftKey);
      } catch {}
    }
  }
  const saved = completed ? data.orders.find((o) => o.id === completed) : null;
  if (saved)
    return (
      <OrderConfirmation
        order={saved}
        branches={data.branches}
        onNewOrder={() => setCompleted(null)}
      />
    );
  function removeLine(index: number) {
    setRemoved(form.getValues(`lines.${index}`));
    remove(index);
  }
  function editLine(index: number) {
    const field = document.getElementById(`item-${index}-description`);
    field?.scrollIntoView({ block: "center", behavior: "auto" });
    field?.focus({ preventScroll: true });
  }
  function configure(line: LineInput) {
    if (fields.length >= 30) return;
    const first = form.getValues("lines.0");
    const untouched =
      fields.length === 1 &&
      JSON.stringify(first) === JSON.stringify(blankLine()) &&
      !form.formState.dirtyFields.lines?.[0];
    const index = untouched ? 0 : fields.length;
    if (untouched) update(0, line);
    else append(line, { shouldFocus: false });
    window.requestAnimationFrame(() => editLine(index));
  }
  function reviewOrder(value: OrderFormValues) {
    setSubmission(requestId());
    setReview(value);
    command.setError("");
  }
  const errors = form.formState.errors;
  return (
    <>
      <PageHeader
        eyebrow="POINT OF SALE"
        title="Create a print order"
        description="A considered start. A precise finish. Build your next print order."
      />
      <form
        id="pos-form"
        onSubmit={form.handleSubmit(reviewOrder)}
        noValidate
        className="pos-workspace"
      >
        <div className="pos-grid">
          <div className="stack pos-main">
            <ServiceCatalogue
              disabled={fields.length >= 30}
              onConfigure={configure}
            />
            <section className="card order-context">
              <div className="card-header">
                <h2>Order details</h2>
                <Badge tone="primary">New order</Badge>
              </div>
              <div className="card-body stack">
                <Field
                  id="order-branch"
                  label="Order branch"
                  error={errors.branchId?.message}
                  hint={
                    user.role === "admin"
                      ? "Choose one branch for this transaction, even when the workspace shows all branches."
                      : "Assigned to your demo cashier account."
                  }
                >
                  <select
                    id="order-branch"
                    className="select"
                    {...form.register("branchId")}
                    disabled={user.role === "cashier"}
                    aria-invalid={!!errors.branchId}
                    aria-describedby={
                      errors.branchId
                        ? "order-branch-error"
                        : "order-branch-hint"
                    }
                  >
                    <option value="">Select one branch</option>
                    {data.branches.map((b) => (
                      <option value={b.id} key={b.id}>
                        {b.name} · {b.location.split(" · ")[0]}
                      </option>
                    ))}
                  </select>
                </Field>
                <CustomerSelector
                  customerId={values.customerId}
                  onSelect={(customer) => {
                    form.setValue("customerId", customer?.id ?? null, {
                      shouldDirty: true,
                    });
                    form.setValue(
                      "customer",
                      {
                        name: customer?.name ?? "",
                        phone: customer?.phone ?? "",
                      },
                      { shouldDirty: true, shouldValidate: true },
                    );
                  }}
                />
                <div className="form-grid">
                  <Field
                    label="Customer name (optional)"
                    id="customer-name"
                    error={errors.customer?.name?.message}
                  >
                    <input
                      className="input"
                      id="customer-name"
                      {...form.register("customer.name")}
                      readOnly={!!values.customerId}
                      placeholder="Leave blank for walk-in"
                      autoComplete="off"
                      maxLength={100}
                    />
                  </Field>
                  <Field
                    label="Contact number (optional)"
                    id="customer-phone"
                    error={errors.customer?.phone?.message}
                  >
                    <input
                      className="input"
                      id="customer-phone"
                      type="tel"
                      {...form.register("customer.phone")}
                      readOnly={!!values.customerId}
                      placeholder="Fictional number only"
                      autoComplete="off"
                      aria-invalid={!!errors.customer?.phone}
                      aria-describedby={
                        errors.customer?.phone
                          ? "customer-phone-error"
                          : undefined
                      }
                    />
                  </Field>
                </div>
                <p className="small muted">
                  Use fictional demonstration details only. Customer information
                  is optional.
                </p>
              </div>
            </section>
            <section className="card print-items" id="print-items">
              <div className="card-header">
                <div>
                  <h2>Print items</h2>
                  <p className="small muted">
                    Printing quantities are sheets; unit-priced services show
                    their own sales unit.
                  </p>
                </div>
                <Badge>
                  {fields.length} {fields.length === 1 ? "item" : "items"}
                </Badge>
              </div>
              <div className="card-body">
                {!fields.length && (
                  <div className="empty-order">
                    <h3>Your next impression starts here.</h3>
                    <p className="muted">
                      Choose a service above or add a print item. No order has
                      been saved.
                    </p>
                  </div>
                )}
                {fields.map((field, index) => (
                  <LineEditor
                    key={field.id}
                    index={index}
                    form={form}
                    total={quote?.lines[index]?.totalCents}
                    canRemove
                    remove={() => removeLine(index)}
                  />
                ))}
                <div className="row" style={{ marginTop: "var(--space-4)" }}>
                  <Button
                    variant="outline"
                    disabled={fields.length >= 30}
                    onClick={() => append(blankLine())}
                  >
                    <Plus size={16} />
                    Add print item
                  </Button>
                  {removed && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        append(removed);
                        setRemoved(null);
                      }}
                    >
                      <RotateCcw size={15} />
                      Undo item removal
                    </Button>
                  )}
                </div>
              </div>
            </section>
            <section className="card card-body">
              <Field
                label="Order instructions (optional)"
                id="order-notes"
                error={errors.notes?.message}
              >
                <textarea
                  className="textarea"
                  id="order-notes"
                  {...form.register("notes")}
                  placeholder="Collection preferences or production handover notes…"
                  maxLength={1000}
                />
              </Field>
            </section>
          </div>
          <ResponsiveSummary
            reviewOpen={!!review}
            onReview={reviewOrder}
            count={fields.length}
            onEdit={editLine}
            onRemove={removeLine}
            form={form}
            quote={quote}
            advance={advance}
            pending={command.pending}
            draftIssue={draftIssue}
          />
        </div>
      </form>
      <OrderReview
        review={review}
        branches={data.branches}
        pricing={data.pricing}
        catalogue={data}
        pending={command.pending}
        error={command.error}
        onClose={() => setReview(null)}
        onSave={save}
      />
    </>
  );
}
