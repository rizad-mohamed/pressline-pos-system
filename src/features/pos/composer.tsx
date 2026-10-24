"use client";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RotateCcw } from "lucide-react";
import { useDemo, useCommand, requestId } from "@/data/provider";
import { blankLine, quoteOrder } from "@/domain/pricing";
import { money } from "@/domain/money";
import type { BranchId, LineInput } from "@/domain/model";
import { orderFormSchema, orderFormBase, type OrderFormValues } from "./schema";
import { LineEditor } from "./line-editor";
import { Button } from "@/components/ui/button";
import { Badge, Field, PageHeader } from "@/components/shared/presentation";
import { OrderReview } from "./order-review";
import { OrderSummary } from "./order-summary";
import { OrderConfirmation } from "./order-confirmation";
const draftKey = "pressline.draft.v1";
export function Composer() {
  const { data, user, scope } = useDemo(),
    command = useCommand();
  const [review, setReview] = useState<OrderFormValues | null>(null),
    [completed, setCompleted] = useState<string | null>(null),
    [removed, setRemoved] = useState<LineInput | null>(null),
    [draftIssue, setDraftIssue] = useState("");
  const [submission, setSubmission] = useState("");
  const schema = useMemo(() => orderFormSchema(data.pricing), [data.pricing]);
  function defaults(): OrderFormValues {
    const fallback = {
      branchId: (user.role === "cashier"
        ? user.branchId
        : scope !== "all"
          ? scope
          : undefined) as BranchId,
      customer: { name: "", phone: "" },
      lines: [blankLine()],
      notes: "",
      advance: "0.00",
    };
    try {
      const raw = window.sessionStorage.getItem(draftKey);
      if (raw) {
        const saved = JSON.parse(raw);
        const parsed = orderFormBase.safeParse(saved.values);
        if (
          saved.ownerId === user.id &&
          parsed.success &&
          (user.role === "admin" || parsed.data.branchId === user.branchId)
        )
          return parsed.data;
      }
    } catch {}
    return fallback;
  }
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults(),
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });
  const values = useWatch({ control: form.control });
  const quote = useMemo(() => {
    try {
      return quoteOrder((values.lines ?? []) as LineInput[], data.pricing);
    } catch {
      return null;
    }
  }, [values.lines, data.pricing]);
  let advance = 0;
  try {
    advance = money(values.advance ?? "0");
  } catch {}
  useEffect(
    () =>
      form.subscribe({
        formState: { values: true },
        callback: ({ values }) => {
          const parsed = orderFormBase.safeParse(values);
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
  const errors = form.formState.errors;
  return (
    <>
      <PageHeader
        eyebrow="POINT OF SALE"
        title="Create a print order"
        description="Configure the work. Review the price. Keep every detail together."
      />
      <form
        id="pos-form"
        onSubmit={form.handleSubmit((value) => {
          setSubmission(requestId());
          setReview(value);
          command.setError("");
        })}
        noValidate
      >
        <div className="pos-grid">
          <div className="stack">
            <section className="card">
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
            <section className="card">
              <div className="card-header">
                <div>
                  <h2>Print items</h2>
                  <p className="small muted">
                    Quantity means printed sheets, not documents.
                  </p>
                </div>
                <Badge>
                  {fields.length} {fields.length === 1 ? "item" : "items"}
                </Badge>
              </div>
              <div className="card-body">
                {fields.map((field, index) => (
                  <LineEditor
                    key={field.id}
                    index={index}
                    form={form}
                    total={quote?.lines[index]?.totalCents}
                    canRemove={fields.length > 1}
                    remove={() => {
                      setRemoved(form.getValues(`lines.${index}`));
                      remove(index);
                    }}
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
          <OrderSummary
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
        pending={command.pending}
        error={command.error}
        onClose={() => setReview(null)}
        onSave={save}
      />
    </>
  );
}
