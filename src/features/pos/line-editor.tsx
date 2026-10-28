"use client";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { useDemo } from "@/data/provider";
import { availableServices, serviceInput } from "@/domain/services";
import { Trash2 } from "lucide-react";
import type { OrderFormValues } from "./schema";
import { Button } from "@/components/ui/button";
import { Field, Notice } from "@/components/shared/presentation";
import { Money } from "@/components/shared/domain-display";
export function LineEditor({
  index,
  form,
  remove,
  canRemove,
  total,
}: {
  index: number;
  form: UseFormReturn<OrderFormValues>;
  remove: () => void;
  canRemove: boolean;
  total?: number;
}) {
  const {
    register,
    formState: { errors },
  } = form;
  const e = errors.lines?.[index];
  const { data } = useDemo();
  const line = useWatch({ control: form.control, name: `lines.${index}` });
  const service = data.services.find((s) => s.id === line.serviceId);
  const unitPriced = service?.model === "unit";
  const current =
    service && availableServices(data).some((s) => s.id === service.id);
  const changed =
    service && (line.serviceVersion !== service.version || !current);
  const prefix = `item-${index}`;
  const selects = [
    { key: "size", label: "Paper size", options: ["A4", "A3"] },
    { key: "color", label: "Print type", options: ["B&W", "Color"] },
    { key: "sides", label: "Printed sides", options: ["Simplex", "Duplex"] },
    { key: "binding", label: "Binding", options: ["None", "Spiral", "Comb"] },
    {
      key: "finishing",
      label: "Finishing",
      options: ["None", "Lamination", "Trimming"],
    },
  ] as const;
  return (
    <fieldset className="line-card">
      <legend className="sr-only">Print item {index + 1}</legend>
      <div className="line-header">
        <h3>Item {String(index + 1).padStart(2, "0")}</h3>
        <div className="row">
          {total !== undefined && (
            <strong>
              <Money value={total} />
            </strong>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Remove item ${index + 1}`}
            disabled={!canRemove}
            onClick={remove}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
      <div className="stack">
        {changed && (
          <Notice tone="warning">
            This service changed or became unavailable.{" "}
            {current ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  form.setValue(
                    `lines.${index}`,
                    {
                      ...serviceInput(service),
                      quantity: line.quantity,
                      notes: line.notes,
                    },
                    { shouldDirty: true, shouldValidate: true },
                  )
                }
              >
                Use latest service configuration
              </Button>
            ) : (
              "Remove this item and select an active service."
            )}
          </Notice>
        )}
        {unitPriced && (
          <p className="small muted">
            Unit-priced service · {service.code}. Sales quantity is in{" "}
            {service.unitLabel}; material usage is recorded separately after
            saving.
          </p>
        )}
        <Field
          label="Item description"
          id={`${prefix}-description`}
          error={e?.description?.message}
        >
          <input
            className="input"
            id={`${prefix}-description`}
            {...register(`lines.${index}.description`)}
            aria-invalid={!!e?.description}
            aria-describedby={
              e?.description ? `${prefix}-description-error` : undefined
            }
          />
        </Field>
        <div className="form-grid three">
          {!unitPriced &&
            selects.map((s) => (
              <Field
                key={s.key}
                label={s.label}
                id={`${prefix}-${s.key}`}
                error={e?.[s.key]?.message}
              >
                <select
                  className="select"
                  id={`${prefix}-${s.key}`}
                  {...register(`lines.${index}.${s.key}`)}
                >
                  {s.options
                    .filter(
                      (option) =>
                        !service?.choices ||
                        (service.choices[s.key] as readonly string[]).includes(
                          option,
                        ),
                    )
                    .map((option) => (
                      <option key={option} value={option}>
                        {option === "Simplex"
                          ? "Single-sided"
                          : option === "Duplex"
                            ? "Double-sided"
                            : option === "B&W"
                              ? "Black & white"
                              : option}
                      </option>
                    ))}
                </select>
              </Field>
            ))}
          <Field
            label={
              unitPriced
                ? `Quantity (${service.unitLabel})`
                : "Quantity (printed sheets)"
            }
            id={`${prefix}-quantity`}
            error={e?.quantity?.message}
          >
            <input
              className="input"
              type="number"
              min="1"
              max="100000"
              step="1"
              inputMode="numeric"
              id={`${prefix}-quantity`}
              {...register(`lines.${index}.quantity`, { valueAsNumber: true })}
              aria-invalid={!!e?.quantity}
              aria-describedby={
                e?.quantity ? `${prefix}-quantity-error` : undefined
              }
            />
          </Field>
        </div>
        <Field
          label="Item instructions (optional)"
          id={`${prefix}-notes`}
          error={e?.notes?.message}
        >
          <input
            className="input"
            id={`${prefix}-notes`}
            placeholder="Page sequence, trimming instructions…"
            {...register(`lines.${index}.notes`)}
          />
        </Field>
      </div>
    </fieldset>
  );
}
