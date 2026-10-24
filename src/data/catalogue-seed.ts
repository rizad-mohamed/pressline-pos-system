import type { Service, ServiceCategory, SavedCustomer } from "@/domain/model";

export function seedCatalogue(now = "2026-01-01T00:00:00.000Z"): {
  categories: ServiceCategory[];
  services: Service[];
} {
  const categories: ServiceCategory[] = [
    { id: "printing", name: "Printing", active: true },
    { id: "finishing", name: "Binding & finishing", active: true },
  ];
  const presets = [
    [
      "document",
      "Document printing",
      "Crisp, everyday essentials",
      "printing",
      {},
    ],
    [
      "color",
      "Color printing",
      "Give your work more presence",
      "printing",
      { color: "Color" },
    ],
    [
      "large",
      "A3 documents",
      "More room for the details",
      "printing",
      { size: "A3" },
    ],
    [
      "duplex",
      "Double-sided prints",
      "Two sides. One neat finish.",
      "printing",
      { sides: "Duplex" },
    ],
    [
      "binding",
      "Bound documents",
      "Bring the pages together",
      "finishing",
      { binding: "Spiral" },
    ],
    [
      "lamination",
      "Laminated prints",
      "A considered finishing touch",
      "finishing",
      { finishing: "Lamination" },
    ],
  ] as const;
  const services: Service[] = presets.map(
    ([id, name, description, categoryId, options]) => ({
      id,
      name,
      description,
      categoryId,
      code: `PRINT-${id.toUpperCase()}`,
      status: "active",
      model: "print",
      rateCents: 1500,
      setupCents: 0,
      unitLabel: "printed sheets",
      defaults: {
        size: "A4",
        color: "B&W",
        sides: "Simplex",
        binding: "None",
        finishing: "None",
        ...options,
      },
      choices: {
        size: ["A4", "A3"],
        color: ["B&W", "Color"],
        sides: ["Simplex", "Duplex"],
        binding: ["None", "Spiral", "Comb"],
        finishing: ["None", "Lamination", "Trimming"],
      },
      materials: [],
      illustration: id,
      version: 1,
      createdAt: now,
      updatedAt: now,
    }),
  );
  return { categories, services };
}

export function seedCustomers(now: string): SavedCustomer[] {
  return [
    {
      id: "customer-paper-finch",
      kind: "Business",
      name: "Paper Finch Studio · demo",
      contactPerson: "Demo contact",
      phone: "",
      email: "",
      address: "Fictional studio",
      notes: "Fictional recurring customer; no real contact information.",
      active: true,
      createdAt: now,
      updatedAt: now,
      actorId: "admin",
    },
    {
      id: "customer-nila",
      kind: "Individual",
      name: "Nila Perera · demo",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      notes: "Fictional customer.",
      active: true,
      createdAt: now,
      updatedAt: now,
      actorId: "admin",
    },
  ];
}
