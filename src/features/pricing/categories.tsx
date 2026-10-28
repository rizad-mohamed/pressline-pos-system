"use client";
import { useState } from "react";
import { useCommand, useDemo, requestId } from "@/data/provider";
import type { ServiceCategory } from "@/domain/model";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { Badge, Field, Notice } from "@/components/shared/presentation";

export function Categories({ onClose }: { onClose: () => void }) {
  const { data } = useDemo();
  const command = useCommand();
  const [editing, setEditing] = useState<ServiceCategory | null>(null);
  const [name, setName] = useState("");
  return (
    <Sheet
      open
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
      title="Service categories"
      description="Categories organize the POS catalogue. Archiving hides their services from new orders and preserves old snapshots."
      dirty={editing ? name !== editing.name : name.length > 0}
      footer={
        <SheetClose asChild>
          <Button variant="outline">Done</Button>
        </SheetClose>
      }
    >
      <div className="stack">
        <form
          className="stack"
          onSubmit={async (e) => {
            e.preventDefault();
            const r = await command.run(
              {
                type: "category-save",
                requestId: requestId(),
                categoryId: editing?.id ?? null,
                name,
                expectedName: editing?.name,
              },
              "Category saved.",
            );
            if (r.ok) {
              setName("");
              setEditing(null);
            }
          }}
        >
          <Field
            id="category-name"
            label={editing ? "Rename category" : "New category name"}
          >
            <input
              id="category-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              required
            />
          </Field>
          <div className="row">
            <Button type="submit" disabled={command.pending || !name.trim()}>
              {editing ? "Save category name" : "Add category"}
            </Button>
            {editing && (
              <Button
                variant="ghost"
                onClick={() => {
                  setEditing(null);
                  setName("");
                }}
              >
                Cancel rename
              </Button>
            )}
          </div>
        </form>
        <Notice>
          Names must be unique, including archived categories. No category or
          referenced service is deleted.
        </Notice>
        {data.categories.map((c) => (
          <div className="line-card stack" key={c.id}>
            <div className="row between">
              <strong>{c.name}</strong>
              <Badge>{c.active ? "Active" : "Archived"}</Badge>
            </div>
            <p className="small muted">
              {data.services.filter((s) => s.categoryId === c.id).length}{" "}
              services
            </p>
            <div className="row">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditing(c);
                  setName(c.name);
                  document.getElementById("category-name")?.focus();
                }}
              >
                Rename {c.name}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={command.pending}
                onClick={async () => {
                  if (
                    window.confirm(
                      `${c.active ? "Archive" : "Reactivate"} ${c.name}? ${c.active ? "Its services will be hidden from new POS selections. " : ""}Historical orders remain unchanged.`,
                    )
                  )
                    await command.run(
                      {
                        type: "category-active",
                        requestId: requestId(),
                        categoryId: c.id,
                        active: !c.active,
                      },
                      "Category availability updated.",
                    );
                }}
              >
                {c.active ? "Archive" : "Reactivate"} {c.name}
              </Button>
            </div>
          </div>
        ))}
        {command.error && <Notice tone="error">{command.error}</Notice>}
      </div>
    </Sheet>
  );
}
