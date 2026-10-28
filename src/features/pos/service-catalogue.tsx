"use client";
import { useMemo, useState } from "react";
import { ArrowUpRight, SearchX } from "lucide-react";
import { quoteLine } from "@/domain/pricing";
import type { LineInput } from "@/domain/model";
import { Money } from "@/components/shared/domain-display";
import { SearchField } from "@/components/shared/presentation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useDemo } from "@/data/provider";
import { availableServices, serviceInput } from "@/domain/services";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const specimenLabels = {
  document: "A4",
  color: "COLOR",
  large: "A3",
  duplex: "1 / 2",
  binding: "BOUND",
  lamination: "FINISH",
  custom: "PRINT",
};

function PaperSpecimen({ kind, label }: { kind: string; label: string }) {
  return (
    <svg
      viewBox="0 0 240 118"
      className="service-art"
      fill="none"
      aria-hidden="true"
    >
      {(kind === "duplex" || kind === "large") && (
        <rect
          x="76"
          y="12"
          width="68"
          height="88"
          rx="3"
          className="specimen-back"
          transform="rotate(-10 110 56)"
        />
      )}
      <g
        transform={
          kind === "binding" ? "rotate(-5 120 59)" : "rotate(5 120 59)"
        }
      >
        <rect
          x="86"
          y="14"
          width="68"
          height="90"
          rx="3"
          className="specimen-page"
        />
        {kind === "lamination" && (
          <rect
            x="81"
            y="9"
            width="78"
            height="100"
            rx="5"
            className="specimen-protect"
          />
        )}
        <text x="96" y="46" className="specimen-type">
          {label}
        </text>
        <path d="M96 58h47M96 65h47M96 72h31" className="specimen-lines" />
        {kind === "color" ? (
          <>
            <rect
              x="96"
              y="81"
              width="20"
              height="12"
              className="specimen-block"
            />
            <rect
              x="120"
              y="81"
              width="23"
              height="12"
              className="specimen-back"
            />
          </>
        ) : (
          <path d="M96 88h47" className="specimen-lines" />
        )}
        {kind === "binding" &&
          [27, 38, 49, 60, 71, 82, 93].map((y) => (
            <path key={y} d={`M82 ${y}h10`} className="specimen-bind" />
          ))}
      </g>
    </svg>
  );
}

export function ServiceCatalogue({
  disabled,
  onConfigure,
}: {
  disabled: boolean;
  onConfigure: (line: LineInput) => void;
}) {
  const { data } = useDemo();
  const services = useMemo(() => availableServices(data), [data]);
  const categories = useMemo(
    () => data.categories.filter((c) => c.active),
    [data],
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const filtered = useMemo(
    () =>
      services.filter(
        (s) =>
          (category === "all" || s.categoryId === category) &&
          `${s.name} ${s.description} ${s.code}`
            .toLowerCase()
            .includes(query.toLowerCase().trim()),
      ),
    [query, category, services],
  );
  return (
    <section className="service-catalogue" aria-labelledby="services-title">
      <div className="row between catalogue-heading">
        <div>
          <h2 id="services-title">Find the right impression</h2>
          <p className="small muted">
            Start with a sample configuration. Make every detail yours.
          </p>
        </div>
        <span className="small muted catalogue-count" role="status">
          {filtered.length} of {services.length} services
        </span>
      </div>
      <SearchField
        label="Search services"
        placeholder="Find printing, binding, or finishing…"
        value={query}
        onChange={setQuery}
      />
      <div
        className="category-scroll"
        tabIndex={0}
        aria-label="Scrollable service categories"
      >
        <ToggleGroup
          type="single"
          value={category}
          onValueChange={(v) => {
            if (v) setCategory(v);
          }}
          spacing={2}
          aria-label="Service category"
        >
          <ToggleGroupItem value="all">All services</ToggleGroupItem>
          {categories.map((c) => (
            <ToggleGroupItem key={c.id} value={c.id}>
              {c.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="service-grid">
        {filtered.map((service) => {
          const line = serviceInput(service);
          const price = quoteLine(line, data.pricing, "preview", data);
          return (
            <Card key={service.id} variant="service">
              <CardContent>
                <PaperSpecimen
                  kind={service.illustration}
                  label={specimenLabels[service.illustration]}
                />
              </CardContent>
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>
                  {service.description || service.code}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div>
                  <strong>
                    <Money value={price.totalCents} />
                  </strong>
                  <span className="small muted">
                    1 {service.model === "print" ? "sheet" : service.unitLabel}{" "}
                    · sample
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  aria-label={`Configure ${service.name}`}
                  onClick={() => onConfigure(line)}
                >
                  Configure
                  <ArrowUpRight size={15} />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
        {!filtered.length && (
          <div className="catalogue-empty">
            <SearchX size={24} />
            <h3>No matching services</h3>
            <p className="muted">Try “color” or reset the service filters.</p>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
            >
              Reset service filters
            </Button>
          </div>
        )}
      </div>
      <p className="small muted">
        DEMO PRICE — NOT APPROVED · Prices include the shown base configuration.
        Adjustments appear in your order.
      </p>
      {disabled && (
        <p className="field-error" role="status">
          The 30-item limit is reached. Remove an item before adding another.
        </p>
      )}
    </section>
  );
}
