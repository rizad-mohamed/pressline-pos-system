"use client";
import { ScrollTable } from "@/components/shared/scroll-table";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useCommand, useDemo, requestId } from "@/data/provider";
import type { Service } from "@/domain/model";
import { quoteLine } from "@/domain/pricing";
import { serviceInput } from "@/domain/services";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import {
  Badge,
  EmptyState,
  Field,
  Notice,
  SearchField,
} from "@/components/shared/presentation";
import { Money } from "@/components/shared/domain-display";
import { ServiceEditor } from "./service-editor";
import { Categories } from "./categories";
import { AdaptiveFilters } from "@/components/shared/adaptive-filters";

export function ServiceManager() {
  const { data } = useDemo();
  const command = useCommand();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("name");
  const [editor, setEditor] = useState<Service | null | undefined>();
  const [categories, setCategories] = useState(false);
  const [view, setView] = useState<string | null>(null);
  const rows = data.services
    .filter(
      (s) =>
        (category === "all" || s.categoryId === category) &&
        (status === "all" || s.status === status) &&
        `${s.name} ${s.code} ${s.description}`
          .toLowerCase()
          .includes(query.toLowerCase().trim()),
    )
    .sort((a, b) =>
      sort === "recent"
        ? b.updatedAt.localeCompare(a.updatedAt)
        : a.name.localeCompare(b.name),
    );
  const viewed = data.services.find((s) => s.id === view);
  async function availability(service: Service, next: Service["status"]) {
    if (
      next === "archived" &&
      !window.confirm(
        `Archive ${service.name}? New selections stop; historical orders and prices are retained.`,
      )
    )
      return;
    await command.run(
      {
        type: "service-save",
        requestId: requestId(),
        serviceId: service.id,
        expectedVersion: service.version,
        values: { ...service, status: next },
      },
      "Service availability updated; old orders retained.",
    );
  }
  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>Service catalogue</h2>
          <p className="small muted">
            Names, categories, usable prices and material suggestions.
          </p>
        </div>
        <div className="row">
          <Button variant="outline" onClick={() => setCategories(true)}>
            Manage categories
          </Button>
          <Button onClick={() => setEditor(null)}>
            <Plus size={16} />
            Add service
          </Button>
        </div>
      </div>
      <div className="card-body">
        <AdaptiveFilters
          summary={`${category === "all" ? "All categories" : (data.categories.find((c) => c.id === category)?.name ?? "Selected category")} · ${status === "all" ? "All availability" : status} · ${sort === "recent" ? "Recently updated" : "Name A–Z"}`}
        >
          <SearchField
            label="Search managed services"
            value={query}
            onChange={setQuery}
            placeholder="Service name, code or description…"
          />
          <Field id="managed-category" label="Category">
            <select
              id="managed-category"
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All categories</option>
              {data.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.active ? "" : " · archived"}
                </option>
              ))}
            </select>
          </Field>
          <Field id="managed-status" label="Availability">
            <select
              id="managed-status"
              className="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All services</option>
              {["active", "inactive", "archived"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field id="managed-sort" label="Sort services">
            <select
              id="managed-sort"
              className="select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="name">Name A–Z</option>
              <option value="recent">Recently updated</option>
            </select>
          </Field>
        </AdaptiveFilters>
      </div>
      {rows.length ? (
        <ScrollTable
          className="table-scroll"
          tabIndex={0}
          aria-label="Scrollable service catalogue"
        >
          <table>
            <caption className="sr-only">
              Managed demonstration services and current price basis
            </caption>
            <thead>
              <tr>
                <th>Service</th>
                <th>Category / status</th>
                <th>Pricing basis</th>
                <th className="right">One-unit sample</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => {
                const price =
                  s.model === "unit"
                    ? s.rateCents + s.setupCents
                    : quoteLine(
                        {
                          ...serviceInput(s),
                          serviceId: undefined,
                          serviceVersion: undefined,
                        },
                        data.pricing,
                      ).totalCents;
                const cat = data.categories.find((c) => c.id === s.categoryId)!;
                return (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.name}</strong>
                      <p className="small muted">
                        {s.code} · v{s.version}
                      </p>
                      <p className="small muted">{s.description}</p>
                    </td>
                    <td>
                      <span>{cat.name}</span>
                      <p>
                        <Badge
                          tone={
                            s.status === "active" && cat.active
                              ? "success"
                              : "neutral"
                          }
                        >
                          {!cat.active ? "Category archived" : s.status}
                        </Badge>
                      </p>
                    </td>
                    <td>
                      {s.model === "print"
                        ? "Shared print rates + selected options"
                        : `Per ${s.unitLabel} + setup`}
                    </td>
                    <td className="right">
                      <Money value={price} />
                      <p className="small muted">Demo · not approved</p>
                    </td>
                    <td>
                      <div className="row">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setView(s.id)}
                          aria-label={`View service ${s.name}`}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditor(s)}
                          aria-label={`Edit service ${s.name}`}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={
                            command.pending ||
                            (!cat.active && s.status !== "active")
                          }
                          onClick={() =>
                            availability(
                              s,
                              s.status === "active" ? "inactive" : "active",
                            )
                          }
                          aria-label={`${s.status === "active" ? "Deactivate" : "Activate"} service ${s.name}`}
                        >
                          {s.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                        {s.status !== "archived" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={command.pending}
                            onClick={() => availability(s, "archived")}
                            aria-label={`Archive service ${s.name}`}
                          >
                            Archive
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ScrollTable>
      ) : (
        <EmptyState
          title="No matching services"
          description="Change the filters or add a service with a transparent demo price."
        />
      )}
      {command.error && (
        <div className="card-body">
          <Notice tone="error">{command.error}</Notice>
        </div>
      )}
      {editor !== undefined && (
        <ServiceEditor
          service={editor ?? undefined}
          onClose={() => setEditor(undefined)}
        />
      )}{" "}
      {categories && <Categories onClose={() => setCategories(false)} />}
      {viewed && (
        <Sheet
          open
          onOpenChange={(v) => {
            if (!v) setView(null);
          }}
          title={viewed.name}
          description={`${viewed.code} · catalogue version ${viewed.version}`}
          footer={
            <Button variant="outline" onClick={() => setView(null)}>
              Done
            </Button>
          }
        >
          <div className="stack">
            <p>{viewed.description || "No short description supplied."}</p>
            <Badge>{viewed.status}</Badge>
            <p>
              Category:{" "}
              {data.categories.find((c) => c.id === viewed.categoryId)?.name}
            </p>
            {viewed.model === "unit" ? (
              <p>
                Line total = quantity × <Money value={viewed.rateCents} /> +{" "}
                <Money value={viewed.setupCents} /> setup. Sales unit:{" "}
                {viewed.unitLabel}.
              </p>
            ) : (
              <p>
                Uses shared print rates and supported
                paper/color/sides/binding/finishing options. Defaults:{" "}
                {Object.values(viewed.defaults ?? {}).join(" · ")}.
              </p>
            )}
            <h3>Material suggestions · not deducted</h3>
            {viewed.materials.length ? (
              viewed.materials.map((m) => (
                <p key={m.itemId}>
                  {data.items.find((i) => i.id === m.itemId)?.name}:{" "}
                  {m.quantity} {m.unit} per{" "}
                  {m.basis === "job" ? "job line" : "sales unit"}
                </p>
              ))
            ) : (
              <p className="muted">
                No material recipe. Orders stay usable without fabricated stock
                consumption.
              </p>
            )}
            <Notice>
              Changes affect future selections only. Old order names, accepted
              prices and material suggestions remain snapshots.
            </Notice>
          </div>
        </Sheet>
      )}
    </section>
  );
}
