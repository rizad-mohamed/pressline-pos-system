"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDemo, useCommand, requestId } from "@/data/provider";
import { settingsFormSchema } from "@/domain/settings";
import type { SettingsValues } from "@/domain/model";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Field, Notice } from "@/components/shared/presentation";
export function SettingsDrawer({ onClose }: { onClose: () => void }) {
  const { data, user } = useDemo(),
    command = useCommand();
  const [id] = useState(requestId);
  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      shopName: data.settings.shopName,
      receiptNote: data.settings.receiptNote,
      branches: data.branches,
      users: data.users.map((u) => ({
        id: u.id,
        name: u.name,
        active: u.active,
      })),
    },
  });
  const e = form.formState.errors;
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Edit demo configuration"
      description="Update fictional shop, branch and fixed-role account labels."
      dirty={form.formState.isDirty}
      footer={
        <>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button form="settings-form" type="submit" disabled={command.pending}>
            Save demo configuration
          </Button>
        </>
      }
    >
      <form
        id="settings-form"
        className="stack"
        noValidate
        onSubmit={form.handleSubmit(async (values) => {
          const r = await command.run(
            { type: "application-settings", requestId: id, values },
            "Demonstration configuration saved.",
          );
          if (r.ok) onClose();
        })}
      >
        <Field
          label="Receipt / SMS shop name"
          id="settings-shop"
          error={e.shopName?.message}
        >
          <input
            id="settings-shop"
            className="input"
            {...form.register("shopName")}
            aria-invalid={!!e.shopName}
            aria-describedby={e.shopName ? "settings-shop-error" : undefined}
          />
        </Field>
        <Field
          label="Receipt footer note"
          id="settings-note"
          error={e.receiptNote?.message}
        >
          <textarea
            id="settings-note"
            className="textarea"
            {...form.register("receiptNote")}
            maxLength={200}
          />
        </Field>
        <hr className="divider" />
        {data.branches.map((branch, index) => (
          <fieldset className="form-section" key={branch.id}>
            <legend>
              Branch {index + 1} · fixed reference {branch.id}
            </legend>
            <Field
              label={`Branch ${index + 1} display name`}
              id={`branch-name-${branch.id}`}
              error={e.branches?.[index]?.name?.message}
            >
              <input
                id={`branch-name-${branch.id}`}
                className="input"
                {...form.register(`branches.${index}.name`)}
              />
            </Field>
            <Field
              label={`Branch ${index + 1} fictional location`}
              id={`branch-location-${branch.id}`}
              error={e.branches?.[index]?.location?.message}
            >
              <input
                id={`branch-location-${branch.id}`}
                className="input"
                {...form.register(`branches.${index}.location`)}
              />
            </Field>
          </fieldset>
        ))}
        <hr className="divider" />
        <h3>Demo team accounts</h3>
        {data.users.map((account, index) => (
          <fieldset className="form-section" key={account.id}>
            <legend>
              {account.role === "admin"
                ? "Administrator"
                : `${data.branches.find((b) => b.id === account.branchId)!.name} cashier`}
            </legend>
            <Field
              label={`Account ${index + 1} display name`}
              id={`account-name-${account.id}`}
              error={e.users?.[index]?.name?.message}
            >
              <input
                id={`account-name-${account.id}`}
                className="input"
                {...form.register(`users.${index}.name`)}
              />
            </Field>
            <label className="check">
              <input
                type="checkbox"
                {...form.register(`users.${index}.active`)}
                disabled={account.id === user.id}
              />
              Account {index + 1} available in demo selector
            </label>
            <p className="small muted">
              Role and branch assignment stay fixed.{" "}
              {account.id === user.id
                ? "Current Administrator stays active."
                : "Deactivation retains historical authorship references."}
            </p>
          </fieldset>
        ))}
        <Notice tone="warning">
          These are local demo labels and availability flags. Real invitations,
          passwords, role assignment and branch authorization require Supabase
          Auth and trusted server checks.
        </Notice>
        {command.error && <Notice tone="error">{command.error}</Notice>}
      </form>
    </Sheet>
  );
}
