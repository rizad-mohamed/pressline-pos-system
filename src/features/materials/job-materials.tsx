"use client";
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PackageCheck, Plus, Trash2 } from "lucide-react";
import { useDemo, useCommand, requestId } from "@/data/provider";
import {
  materialInputSchema,
  type MaterialInput,
  type MaterialUsage,
  type Order,
} from "@/domain/model";
import { materialTotals } from "@/domain/materials";
import { dateTime } from "@/domain/dates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { Field, Notice } from "@/components/shared/presentation";

export function JobMaterials({ order }: { order: Order }) {
  const { data, user } = useDemo();
  const [editing, setEditing] = useState<"plan" | "additional" | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [correcting, setCorrecting] = useState<MaterialUsage | null>(null);
  const plan = order.materialPlan;
  const events = data.usages.filter((u) => u.orderId === order.id);
  const recorded =
    plan &&
    events.some((u) => u.planId === plan.id && u.kind === "consumption");
  const branch = data.branches.find((b) => b.id === order.branchId)!;
  return (
    <section
      className="stack job-materials"
      aria-labelledby={`materials-${order.id}`}
    >
      <div className="row between">
        <div>
          <p className="eyebrow">PRODUCTION / MATERIALS</p>
          <h3 id={`materials-${order.id}`}>Materials for this job</h3>
        </div>
        <Badge variant={recorded ? "success" : "neutral"}>
          {recorded ? "Recorded" : "Planned / Not deducted"}
        </Badge>
      </div>
      <p className="small muted">
        {branch.name} only. Review actual whole stock units before recording.
        Material usage does not change sales prices or customer balances.
      </p>
      {plan?.lines.length ? (
        <div className="stack material-plan" data-testid="material-plan">
          {plan.lines.map((line, index) => (
            <div className="line-card" key={`${line.lineId}-${line.itemId}`}>
              <div className="row between">
                <strong>
                  {data.items.find((i) => i.id === line.itemId)?.name}
                </strong>
                <strong>
                  {line.quantity} {line.unit}
                </strong>
              </div>
              <p className="small muted">
                Job item{" "}
                {order.lines.findIndex((l) => l.id === line.lineId) + 1} ·{" "}
                {order.lines.find((l) => l.id === line.lineId)?.description}
              </p>
              {!recorded && (
                <p className="small muted">
                  Available now:{" "}
                  {
                    data.items.find((i) => i.id === line.itemId)?.quantities[
                      order.branchId
                    ]
                  }{" "}
                  {line.unit} ·{" "}
                  {index === 0
                    ? "Actual use needs explicit confirmation"
                    : "Not deducted"}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Notice>
          No material plan. This service remains orderable without stock use.
          Add actual materials only when needed.
        </Notice>
      )}
      <div className="row">
        <Button
          variant="outline"
          onClick={() => setEditing(recorded ? "additional" : "plan")}
        >
          <Plus size={16} />
          {recorded ? "Plan additional usage" : "Edit material plan"}
        </Button>
        {!recorded && (
          <Button
            disabled={!plan?.lines.length}
            onClick={() => setConfirming(true)}
          >
            <PackageCheck size={16} />
            Review material usage
          </Button>
        )}
      </div>
      {recorded && (
        <p className="small muted">
          This plan has already been recorded. Any further actual use requires a
          separate additional event.
        </p>
      )}
      {events.length > 0 && (
        <div className="stack">
          <h4>Recorded material history</h4>
          {events.map((event) => {
            const corrected = events.some((u) => u.correctsId === event.id);
            return (
              <article
                className="line-card stack"
                key={event.id}
                data-testid="material-event"
              >
                <div className="row between">
                  <strong>
                    {event.kind === "consumption"
                      ? "Usage recorded"
                      : "Compensating correction"}
                  </strong>
                  <Badge
                    variant={
                      event.kind === "correction" ? "warning" : "neutral"
                    }
                  >
                    {event.kind === "correction"
                      ? "Stock restored"
                      : corrected
                        ? "Corrected · original retained"
                        : "Stock deducted"}
                  </Badge>
                </div>
                <p className="small muted">
                  {dateTime(event.createdAt)} ·{" "}
                  {data.users.find((u) => u.id === event.actorId)?.name} ·{" "}
                  {branch.name}
                </p>
                <p className="small">{event.reason}</p>
                {event.lines.map((line) => (
                  <div key={line.movementId} className="material-evidence">
                    <strong>
                      {event.kind === "consumption" ? "−" : "+"}
                      {line.quantity} {line.unit} · {line.materialName}
                    </strong>
                    <p className="small">
                      Stock {line.before} → {line.after} {line.unit} ·{" "}
                      {line.serviceName} · {line.lineId}
                    </p>
                    <p className="small muted">
                      Movement:{" "}
                      <span className="record-ref">{line.movementId}</span>
                    </p>
                  </div>
                ))}
                <p className="small muted">
                  Usage: <span className="record-ref">{event.id}</span>
                  {event.correctsId && (
                    <>
                      {" "}
                      · Corrects{" "}
                      <span className="record-ref">{event.correctsId}</span>
                    </>
                  )}
                </p>
                {user.role === "admin" &&
                  event.kind === "consumption" &&
                  !corrected && (
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCorrecting(event)}
                      >
                        Correct recorded usage
                      </Button>
                    </div>
                  )}
              </article>
            );
          })}
        </div>
      )}
      {editing && (
        <MaterialPlanEditor
          order={order}
          additional={editing === "additional"}
          onClose={() => setEditing(null)}
        />
      )}
      {confirming && (
        <RecordMaterialDrawer
          order={order}
          onClose={() => setConfirming(false)}
        />
      )}
      {correcting && (
        <RecordMaterialDrawer
          order={order}
          correction={correcting}
          onClose={() => setCorrecting(null)}
        />
      )}
    </section>
  );
}

const planFormSchema = z.object({
  lines: z.array(materialInputSchema).max(600),
});
function MaterialPlanEditor({
  order,
  additional,
  onClose,
}: {
  order: Order;
  additional: boolean;
  onClose: () => void;
}) {
  const { data } = useDemo(),
    command = useCommand();
  const [id] = useState(requestId);
  const [expected] = useState({
    id: order.materialPlan?.id ?? null,
    revision: order.materialPlan?.revision ?? 0,
  });
  const form = useForm<{ lines: MaterialInput[] }>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      lines: additional ? [] : (order.materialPlan?.lines ?? []),
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });
  const lines = useWatch({ control: form.control, name: "lines" });
  const active = data.items.filter((i) => i.active);
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={
        additional ? "Plan additional material usage" : "Edit material plan"
      }
      description={`${order.id} · ${data.branches.find((b) => b.id === order.branchId)!.name}. Saving a plan does not deduct stock.`}
      dirty={form.formState.isDirty}
      footer={
        <>
          <SheetClose asChild>
            <Button variant="outline" disabled={command.pending}>
              Cancel
            </Button>
          </SheetClose>
          <Button
            type="submit"
            form="material-plan-form"
            disabled={command.pending}
          >
            Save plan · no deduction
          </Button>
        </>
      }
    >
      <form
        id="material-plan-form"
        className="stack"
        noValidate
        onSubmit={form.handleSubmit(async (values) => {
          const r = await command.run(
            {
              type: "material-plan",
              requestId: id,
              orderId: order.id,
              expectedPlanId: expected.id,
              expectedRevision: expected.revision,
              additional,
              lines: values.lines,
            },
            "Material plan saved. Stock has not changed.",
          );
          if (r.ok) onClose();
        })}
      >
        <Notice>
          Use actual whole stock units. Suggestions can be changed. Quantities
          across job items will be combined at confirmation.
        </Notice>
        {fields.map((field, index) => {
          const item = data.items.find((i) => i.id === lines?.[index]?.itemId);
          const error = form.formState.errors.lines?.[index];
          return (
            <fieldset className="line-card stack" key={field.id}>
              <legend>Material {index + 1}</legend>
              <Field
                label="Job item"
                id={`material-line-${index}`}
                error={error?.lineId?.message}
              >
                <select
                  id={`material-line-${index}`}
                  className="select"
                  {...form.register(`lines.${index}.lineId`)}
                >
                  {order.lines.map((l, i) => (
                    <option value={l.id} key={l.id}>
                      {i + 1}. {l.description}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Stock material"
                id={`material-item-${index}`}
                error={error?.itemId?.message}
              >
                <select
                  id={`material-item-${index}`}
                  className="select"
                  {...form.register(`lines.${index}.itemId`, {
                    onChange: (e) => {
                      const i = data.items.find((i) => i.id === e.target.value);
                      form.setValue(`lines.${index}.unit`, i?.unit ?? "", {
                        shouldDirty: true,
                      });
                    },
                  })}
                >
                  {!item?.active && (
                    <option value={item?.id ?? ""}>
                      {item ? `${item.name} · inactive` : "Choose a material"}
                    </option>
                  )}
                  {active.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} · {i.sku}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label={`Actual quantity (${item?.unit ?? "stock units"})`}
                id={`material-quantity-${index}`}
                error={error?.quantity?.message}
              >
                <input
                  id={`material-quantity-${index}`}
                  className="input"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  {...form.register(`lines.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                  aria-invalid={!!error?.quantity}
                  aria-describedby={
                    error?.quantity
                      ? `material-quantity-${index}-error`
                      : undefined
                  }
                />
              </Field>
              <p className="small muted">
                Unit: {item?.unit ?? "choose material"} · Available at this
                branch: {item?.quantities[order.branchId] ?? "—"}. No unit
                conversion.
              </p>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  aria-label={`Remove material ${index + 1}`}
                >
                  <Trash2 size={15} />
                  Remove material
                </Button>
              </div>
            </fieldset>
          );
        })}
        <div>
          <Button
            variant="outline"
            disabled={!active.length || fields.length >= 600}
            onClick={() => {
              const item = active[0];
              append({
                lineId: order.lines[0].id,
                itemId: item.id,
                unit: item.unit,
                quantity: 1,
              });
            }}
          >
            <Plus size={16} />
            Add material
          </Button>
        </div>
        {form.formState.errors.lines?.message && (
          <Notice tone="error">{form.formState.errors.lines.message}</Notice>
        )}
        {command.error && <Notice tone="error">{command.error}</Notice>}
      </form>
    </Sheet>
  );
}

function RecordMaterialDrawer({
  order,
  correction,
  onClose,
}: {
  order: Order;
  correction?: MaterialUsage;
  onClose: () => void;
}) {
  const { data } = useDemo(),
    command = useCommand();
  const [id] = useState(requestId);
  // Freeze the reviewed version. A newer plan cannot silently replace its contents.
  const [plan] = useState(order.materialPlan);
  const schema = z.object({
    reason: z
      .string()
      .trim()
      .min(3, "Enter a reason with at least 3 characters.")
      .max(200),
    ack: z
      .boolean()
      .refine((v) => v, "Confirm you reviewed the branch and stock impact."),
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      reason: correction ? "" : "Actual materials used for this job",
      ack: false,
    },
  });
  const lines = correction?.lines ?? plan?.lines ?? [];
  const impacts = [...materialTotals(lines)].map(([itemId, quantity]) => {
    const item = data.items.find((i) => i.id === itemId)!;
    return {
      item,
      quantity,
      before: item.quantities[order.branchId],
      after:
        item.quantities[order.branchId] + (correction ? quantity : -quantity),
    };
  });
  const insufficient = impacts.some(
    (i) => i.after < 0 || (!i.item.active && !correction),
  );
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={correction ? "Correct recorded usage" : "Confirm material usage"}
      description={`${order.id} · ${data.branches.find((b) => b.id === order.branchId)!.name} only. Review stock impact before recording locally.`}
      dirty={form.formState.isDirty}
      footer={
        <>
          <SheetClose asChild>
            <Button variant="outline" disabled={command.pending}>
              Cancel
            </Button>
          </SheetClose>
          <Button
            type="submit"
            form="record-material-form"
            disabled={command.pending || insufficient || !lines.length}
          >
            {command.pending
              ? "Recording locally…"
              : correction
                ? "Confirm compensating correction"
                : "Confirm & record material usage"}
          </Button>
        </>
      }
    >
      <form
        id="record-material-form"
        className="stack"
        noValidate
        onSubmit={form.handleSubmit(async (values) => {
          const r = await command.run(
            correction
              ? {
                  type: "material-correct",
                  requestId: id,
                  usageId: correction.id,
                  reason: values.reason,
                }
              : {
                  type: "material-confirm",
                  requestId: id,
                  orderId: order.id,
                  planId: plan!.id,
                  expectedRevision: plan!.revision,
                  reason: values.reason,
                },
            correction
              ? "Compensating movements recorded. Original usage preserved."
              : "Material usage recorded once. Branch stock updated.",
          );
          if (r.ok) onClose();
        })}
      >
        <Notice tone="warning">
          {correction
            ? "This reverses the entire selected event with new movements. The original history stays intact. Record the correct actual quantity as a separate additional usage event."
            : "This records actual material use and immediately deducts branch stock. Production status and customer balances stay independent."}
        </Notice>
        {impacts.map(({ item, quantity, before, after }) => (
          <div key={item.id} className="line-card">
            <div className="total-row">
              <strong>{item.name}</strong>
              <strong>
                {correction ? "+" : "−"}
                {quantity} {item.unit}
              </strong>
            </div>
            <p className="small">
              Stock impact: {before} → {after} {item.unit}
            </p>
            {after < 0 && (
              <p className="field-error" role="alert">
                Insufficient stock. This branch has {before} {item.unit}; the
                job needs {quantity}. Close and reduce the plan or replenish
                stock separately.
              </p>
            )}
            {!item.active && !correction && (
              <p className="field-error" role="alert">
                This material is inactive. Update the plan first.
              </p>
            )}
          </div>
        ))}
        <Field
          label={correction ? "Correction reason" : "Usage reason"}
          id="material-reason"
          error={form.formState.errors.reason?.message}
        >
          <textarea
            className="textarea"
            id="material-reason"
            maxLength={200}
            {...form.register("reason")}
            aria-invalid={!!form.formState.errors.reason}
            aria-describedby={
              form.formState.errors.reason ? "material-reason-error" : undefined
            }
          />
        </Field>
        <label className="choice-check">
          <input
            type="checkbox"
            {...form.register("ack")}
            aria-invalid={!!form.formState.errors.ack}
            aria-describedby={
              form.formState.errors.ack ? "material-ack-error" : undefined
            }
          />
          <span>
            I reviewed the branch, materials, quantities and stock impact.
          </span>
        </label>
        {form.formState.errors.ack && (
          <p className="field-error" id="material-ack-error" role="alert">
            {form.formState.errors.ack.message}
          </p>
        )}
        {command.error && <Notice tone="error">{command.error}</Notice>}
      </form>
    </Sheet>
  );
}
