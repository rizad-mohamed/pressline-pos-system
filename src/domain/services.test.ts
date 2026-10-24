import { describe, it, expect } from "vitest";
import { seedData } from "@/data/seed";
import { validateData } from "@/data/validation";
import {
  applyServiceCommand,
  availableServices,
  serviceInput,
} from "./services";
import { applyOrderCommand } from "./orders";
import { quoteLine, quoteOrder } from "./pricing";
import type { ServiceValues } from "./model";

const now = "2026-10-24T10:00:00.000Z";
const banner: ServiceValues = {
  code: "BANNER-DEMO",
  name: "Banner Printing",
  description: "Fictional banner work",
  categoryId: "printing",
  status: "active",
  model: "unit",
  rateCents: 350000,
  setupCents: 0,
  unitLabel: "jobs",
  defaults: null,
  choices: null,
  materials: [
    { itemId: "banner-roll", unit: "rolls", quantity: 2, basis: "job" },
  ],
  illustration: "custom",
};
const create = {
  type: "service-save" as const,
  requestId: "banner",
  serviceId: null,
  values: banner,
};
describe("managed service catalogue", () => {
  it("creates a usable unit-priced banner service without paper or duplex settings", () => {
    const d = seedData("2026-10-24");
    const next = applyServiceCommand(d, d.users[2], create, now);
    const service = next.services.at(-1)!;
    expect(
      quoteLine(serviceInput(service), next.pricing, "sample", next),
    ).toMatchObject({
      unitCents: 350000,
      totalCents: 350000,
      serviceSnapshot: {
        name: "Banner Printing",
        model: "unit",
        unitLabel: "jobs",
      },
    });
    expect(
      quoteOrder(
        [{ ...serviceInput(service), quantity: 3 }],
        next.pricing,
        next,
      ).totalCents,
    ).toBe(1050000);
    expect(validateData(next)).toEqual(next);
    expect(d.services).toHaveLength(6);
  });
  it("preserves accepted service names, categories, prices and material snapshots after later edits", () => {
    let d = seedData("2026-10-24");
    d = applyServiceCommand(d, d.users[2], create, now);
    const service = d.services.at(-1)!;
    const input = serviceInput(service);
    d = applyOrderCommand(
      d,
      d.users[0],
      {
        type: "create-order",
        requestId: "banner-order",
        branchId: "b1",
        customer: { name: "", phone: "" },
        lines: [input],
        notes: "",
        advanceCents: 100000,
      },
      now,
    );
    const saved = structuredClone(d.orders[0]);
    d = applyServiceCommand(
      d,
      d.users[2],
      {
        ...create,
        requestId: "new-price",
        serviceId: service.id,
        expectedVersion: 1,
        values: {
          ...banner,
          name: "Banner service renamed",
          rateCents: 450000,
          materials: [],
        },
      },
      now,
    );
    expect(d.orders[0]).toEqual(saved);
    expect(saved.lines[0].serviceSnapshot?.name).toBe("Banner Printing");
    expect(saved.lines[0].materialSuggestions?.[0].quantity).toBe(2);
    expect(() => quoteLine(input, d.pricing, "old-draft", d)).toThrow(
      /changed/,
    );
    expect(
      quoteLine(serviceInput(d.services.at(-1)!), d.pricing, "new", d)
        .totalCents,
    ).toBe(450000);
    expect(validateData(d)).toEqual(d);
  });
  it("retains old records when services or categories are archived and permits reactivation", () => {
    let d = seedData("2026-10-24");
    d = applyServiceCommand(d, d.users[2], create, now);
    const id = d.services.at(-1)!.id;
    d = applyServiceCommand(
      d,
      d.users[2],
      {
        ...create,
        requestId: "archive",
        serviceId: id,
        expectedVersion: 1,
        values: { ...banner, status: "archived" },
      },
      now,
    );
    expect(availableServices(d).some((s) => s.id === id)).toBe(false);
    expect(d.services.some((s) => s.id === id)).toBe(true);
    d = applyServiceCommand(
      d,
      d.users[2],
      { ...create, requestId: "reactivate", serviceId: id, expectedVersion: 2 },
      now,
    );
    d = applyServiceCommand(
      d,
      d.users[2],
      {
        type: "category-active",
        requestId: "category-archive",
        categoryId: "printing",
        active: false,
      },
      now,
    );
    expect(availableServices(d).every((s) => s.categoryId !== "printing")).toBe(
      true,
    );
    expect(() =>
      quoteLine(serviceInput(d.services.at(-1)!), d.pricing, "quote", d),
    ).toThrow(/archived/);
    d = applyServiceCommand(
      d,
      d.users[2],
      {
        type: "category-active",
        requestId: "category-reactivate",
        categoryId: "printing",
        active: true,
      },
      now,
    );
    expect(availableServices(d).some((s) => s.id === id)).toBe(true);
  });
  it("requires admin, unique codes, valid positive rates and optimistic versions", () => {
    const d = seedData("2026-10-24");
    expect(() => applyServiceCommand(d, d.users[0], create, now)).toThrow(
      /Administrator/,
    );
    const next = applyServiceCommand(d, d.users[2], create, now);
    expect(() =>
      applyServiceCommand(
        next,
        next.users[2],
        { ...create, requestId: "duplicate" },
        now,
      ),
    ).toThrow(/unique service code/);
    expect(() =>
      applyServiceCommand(
        next,
        next.users[2],
        {
          ...create,
          requestId: "stale",
          serviceId: next.services.at(-1)!.id,
          expectedVersion: 99,
        },
        now,
      ),
    ).toThrow(/changed/);
    for (const rateCents of [0, -1, NaN, 1.5])
      expect(() =>
        applyServiceCommand(
          d,
          d.users[2],
          { ...create, values: { ...banner, rateCents } },
          now,
        ),
      ).toThrow();
  });
  it("validates whole material units, references, active state and duplicate recipe entries", () => {
    const d = seedData("2026-10-24");
    for (const recipe of [
      {
        itemId: "banner-roll",
        unit: "sheets",
        quantity: 5,
        basis: "job" as const,
      },
      { itemId: "unknown", unit: "rolls", quantity: 5, basis: "job" as const },
      {
        itemId: "banner-roll",
        unit: "rolls",
        quantity: 0.5,
        basis: "job" as const,
      },
    ])
      expect(() =>
        applyServiceCommand(
          d,
          d.users[2],
          { ...create, values: { ...banner, materials: [recipe] } },
          now,
        ),
      ).toThrow();
    expect(() =>
      applyServiceCommand(
        d,
        d.users[2],
        {
          ...create,
          values: {
            ...banner,
            materials: [...banner.materials, ...banner.materials],
          },
        },
        now,
      ),
    ).toThrow(/one recipe line/);
    d.items.find((i) => i.id === "banner-roll")!.active = false;
    expect(() => applyServiceCommand(d, d.users[2], create, now)).toThrow(
      /active/,
    );
  });
  it("supports safe categories and rejects unsupported print defaults/options", () => {
    let d = seedData("2026-10-24");
    d = applyServiceCommand(
      d,
      d.users[2],
      {
        type: "category-save",
        requestId: "wide",
        categoryId: null,
        name: "Wide format",
      },
      now,
    );
    const category = d.categories.at(-1)!;
    d = applyServiceCommand(
      d,
      d.users[2],
      {
        type: "category-save",
        requestId: "rename",
        categoryId: category.id,
        name: "Banners & wide format",
        expectedName: "Wide format",
      },
      now,
    );
    expect(d.categories.at(-1)?.id).toBe(category.id);
    expect(() =>
      applyServiceCommand(
        d,
        d.users[2],
        {
          type: "category-save",
          requestId: "duplicate-cat",
          categoryId: null,
          name: "printing",
        },
        now,
      ),
    ).toThrow(/already exists/);
    const original = d.services[0];
    expect(() =>
      applyServiceCommand(
        d,
        d.users[2],
        {
          type: "service-save",
          requestId: "invalid-options",
          serviceId: original.id,
          expectedVersion: original.version,
          values: {
            ...original,
            choices: { ...original.choices!, size: ["A3"] },
          },
        },
        now,
      ),
    ).toThrow(/supported defaults/);
    expect(
      quoteLine(serviceInput(original), d.pricing, "print", d).totalCents,
    ).toBe(1500);
  });
});
