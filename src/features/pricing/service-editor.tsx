"use client";
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCommand, useDemo, requestId } from "@/data/provider";
import { money, moneyInput } from "@/domain/money";
import { blankLine } from "@/domain/pricing";
import {
  printChoicesSchema,
  printDefaultsSchema,
  serviceValuesSchema,
  type Service,
} from "@/domain/model";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Field, Notice } from "@/components/shared/presentation";

const amount = z.string().refine((v) => {
  try {
    return money(v) <= 10_000_000;
  } catch {
    return false;
  }
}, "Use an LKR amount up to 100,000 with at most two decimals.");
const schema = z
  .object({
    ...serviceValuesSchema.shape,
    defaults: printDefaultsSchema,
    choices: printChoicesSchema,
    rate: amount.refine((v) => {
      try {
        return money(v) > 0;
      } catch {
        return false;
      }
    }, "Use a rate above zero."),
    setup: amount,
  })
  .omit({ rateCents: true, setupCents: true });
type Values = z.infer<typeof schema>;
const options = [
  { key: "size", label: "Paper size", choices: ["A4", "A3"] },
  { key: "color", label: "Print type", choices: ["B&W", "Color"] },
  { key: "sides", label: "Printed sides", choices: ["Simplex", "Duplex"] },
  { key: "binding", label: "Binding", choices: ["None", "Spiral", "Comb"] },
  {
    key: "finishing",
    label: "Finishing",
    choices: ["None", "Lamination", "Trimming"],
  },
] as const;
const allChoices = printChoicesSchema.parse(
  Object.fromEntries(options.map((o) => [o.key, [...o.choices]])),
);

export function ServiceEditor({
  service,
  onClose,
}: {
  service?: Service;
  onClose: () => void;
}) {
  const { data } = useDemo();
  const command = useCommand();
  const [id] = useState(requestId);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: service?.code ?? "",
      name: service?.name ?? "",
      description: service?.description ?? "",
      categoryId:
        service?.categoryId ?? data.categories.find((c) => c.active)?.id ?? "",
      status: service?.status ?? "active",
      model: service?.model ?? "unit",
      unitLabel: service?.unitLabel ?? "jobs",
      defaults: service?.defaults ?? printDefaultsSchema.parse(blankLine()),
      choices: service?.choices ?? allChoices,
      materials: service?.materials ?? [],
      illustration: service?.illustration ?? "custom",
      rate: moneyInput(service?.rateCents ?? 10000),
      setup: moneyInput(service?.setupCents ?? 0),
    },
    mode: "onBlur",
  });
  const watched = useWatch({ control: form.control });
  const materials = useFieldArray({ control: form.control, name: "materials" });
  const error = form.formState.errors;
  return (
    <Sheet
      open
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
      title={service ? "Edit service" : "Add service"}
      description="Define a usable demo service and optional material suggestions. Saved prices never rewrite earlier orders."
      dirty={form.formState.isDirty}
      footer={
        <>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit" form="service-form" disabled={command.pending}>
            {command.pending ? "Saving locally…" : "Save service"}
          </Button>
        </>
      }
    >
      <form
        id="service-form"
        className="stack"
        noValidate
        onSubmit={form.handleSubmit(async (values) => {
          const { rate, setup, ...rest } = values;
          const r = await command.run(
            {
              type: "service-save",
              requestId: id,
              serviceId: service?.id ?? null,
              expectedVersion: service?.version,
              values: {
                ...rest,
                rateCents: money(rate),
                setupCents: money(setup),
                defaults: rest.model === "print" ? rest.defaults : null,
                choices: rest.model === "print" ? rest.choices : null,
              },
            },
            "Service saved. Historical order snapshots are unchanged.",
          );
          if (r.ok) onClose();
        })}
      >
        <Notice tone="warning">
          Demo prices only. Materials are a separate stock plan, not a sales
          surcharge or automatic deduction.
        </Notice>
        <div className="form-grid">
          {[
            { key: "name", label: "Service name" },
            { key: "code", label: "Service code" },
          ].map((f) => (
            <Field
              key={f.key}
              id={`service-${f.key}`}
              label={f.label}
              error={error[f.key as "name" | "code"]?.message}
            >
              <input
                className="input"
                id={`service-${f.key}`}
                {...form.register(f.key as "name" | "code")}
                aria-invalid={!!error[f.key as "name" | "code"]}
              />
            </Field>
          ))}
        </div>
        <Field
          id="service-description"
          label="Short description (optional)"
          error={error.description?.message}
        >
          <textarea
            id="service-description"
            className="textarea"
            {...form.register("description")}
            maxLength={180}
          />
        </Field>
        <div className="form-grid">
          <Field
            id="service-category"
            label="Service category"
            error={error.categoryId?.message}
          >
            <select
              id="service-category"
              className="select"
              {...form.register("categoryId")}
            >
              <option value="">Choose a category</option>
              {data.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.active ? "" : " · archived"}
                </option>
              ))}
            </select>
          </Field>
          <Field id="service-status" label="Service availability">
            <select
              id="service-status"
              className="select"
              {...form.register("status")}
            >
              <option value="active">Active · available for new orders</option>
              <option value="inactive">
                Inactive · temporarily unavailable
              </option>
              <option value="archived">Archived · history retained</option>
            </select>
          </Field>
        </div>
        <Field id="service-model" label="Pricing model">
          <select
            id="service-model"
            className="select"
            {...form.register("model")}
          >
            <option value="unit">Unit rate + per-line setup</option>
            <option value="print">
              Existing print rates & supported options
            </option>
          </select>
        </Field>
        {watched.model === "unit" ? (
          <>
            <div className="form-grid">
              <Field
                id="service-rate"
                label="Unit price (LKR)"
                error={error.rate?.message}
              >
                <input
                  id="service-rate"
                  className="input money"
                  inputMode="decimal"
                  {...form.register("rate")}
                  aria-invalid={!!error.rate}
                />
              </Field>
              <Field
                id="service-setup"
                label="Setup per line (LKR)"
                error={error.setup?.message}
              >
                <input
                  id="service-setup"
                  className="input money"
                  inputMode="decimal"
                  {...form.register("setup")}
                  aria-invalid={!!error.setup}
                />
              </Field>
            </div>
            <Field
              id="service-unit"
              label="Sales quantity unit"
              error={error.unitLabel?.message}
              hint="For example: jobs, banners, copies. Whole quantities only; separate from material units."
            >
              <input
                id="service-unit"
                className="input"
                {...form.register("unitLabel")}
              />
            </Field>
            <p className="small muted">
              Line total = sales quantity × unit price + one setup charge. No
              tax, discount or material cost is added.
            </p>
          </>
        ) : (
          <>
            <Notice>
              Uses the shared printing, duplex, binding and finishing rates
              below the service list. Choose supported options and an allowed
              default for each. The six original services keep these existing
              calculations.
            </Notice>
            {options.map((option) => (
              <fieldset className="line-card stack" key={option.key}>
                <legend>{option.label} options</legend>
                <div className="choice-checks">
                  {option.choices.map((value) => (
                    <label className="row" key={value}>
                      <input
                        type="checkbox"
                        value={value}
                        {...form.register(`choices.${option.key}`)}
                      />
                      {value}
                    </label>
                  ))}
                </div>
                <Field
                  id={`service-default-${option.key}`}
                  label={`Default ${option.label.toLowerCase()}`}
                  error={error.choices?.[option.key]?.message}
                >
                  <select
                    className="select"
                    id={`service-default-${option.key}`}
                    {...form.register(`defaults.${option.key}`)}
                  >
                    {option.choices.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </Field>
              </fieldset>
            ))}
          </>
        )}
        <Field id="service-illustration" label="Paper specimen">
          <select
            id="service-illustration"
            className="select"
            {...form.register("illustration")}
          >
            <option value="custom">General print work</option>
            {[
              "document",
              "color",
              "large",
              "duplex",
              "binding",
              "lamination",
            ].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <section className="stack">
          <div>
            <h3>Suggested materials</h3>
            <p className="small muted">
              Optional, whole stock units. Each suggestion can be adjusted for a
              saved job; nothing is deducted here.
            </p>
          </div>
          {materials.fields.map((field, index) => {
            const item = data.items.find(
              (i) => i.id === watched.materials?.[index]?.itemId,
            );
            return (
              <fieldset className="line-card stack" key={field.id}>
                <legend>Material suggestion {index + 1}</legend>
                <Field
                  id={`recipe-material-${index}`}
                  label={`Recipe material ${index + 1}`}
                  error={error.materials?.[index]?.itemId?.message}
                >
                  <select
                    className="select"
                    id={`recipe-material-${index}`}
                    {...form.register(`materials.${index}.itemId`)}
                    onChange={(e) => {
                      form.setValue(
                        `materials.${index}.itemId`,
                        e.target.value,
                        { shouldDirty: true },
                      );
                      form.setValue(
                        `materials.${index}.unit`,
                        data.items.find((i) => i.id === e.target.value)?.unit ??
                          "",
                        { shouldDirty: true },
                      );
                    }}
                  >
                    <option value="">Choose material</option>
                    {data.items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} · {i.unit}
                        {i.active ? "" : " · inactive"}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="form-grid">
                  <Field
                    id={`recipe-quantity-${index}`}
                    label={`Recipe quantity ${index + 1} (${item?.unit ?? "stock units"})`}
                    error={error.materials?.[index]?.quantity?.message}
                  >
                    <input
                      id={`recipe-quantity-${index}`}
                      className="input"
                      type="number"
                      min={1}
                      step={1}
                      {...form.register(`materials.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field
                    id={`recipe-basis-${index}`}
                    label={`Recipe basis ${index + 1}`}
                  >
                    <select
                      id={`recipe-basis-${index}`}
                      className="select"
                      {...form.register(`materials.${index}.basis`)}
                    >
                      <option value="job">Per job line</option>
                      <option value="unit">Per sales unit</option>
                    </select>
                  </Field>
                </div>
                <p className="small muted">
                  Stock unit: {item?.unit || "Choose a material"}. No unit
                  conversions or fractional quantities.
                </p>
                <Button variant="ghost" onClick={() => materials.remove(index)}>
                  Remove suggestion {index + 1}
                </Button>
              </fieldset>
            );
          })}
          <Button
            variant="outline"
            disabled={
              materials.fields.length >= 20 || !data.items.some((i) => i.active)
            }
            onClick={() => {
              const item = data.items.find((i) => i.active)!;
              materials.append({
                itemId: item.id,
                unit: item.unit,
                quantity: 1,
                basis: "job",
              });
            }}
          >
            Add material suggestion
          </Button>
          {error.materials?.message && (
            <Notice tone="error">{error.materials.message}</Notice>
          )}
        </section>
        {command.error && <Notice tone="error">{command.error}</Notice>}
      </form>
    </Sheet>
  );
}
