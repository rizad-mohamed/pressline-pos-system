import {
  type DemoData,
  type Order,
  type BranchId,
  type StockItem,
  type StockMovement,
} from "@/domain/model";
import { businessDate, shiftDate } from "@/domain/dates";
import { blankLine, quoteOrder } from "@/domain/pricing";
import { seedCatalogue, seedCustomers } from "./catalogue-seed";
export function seedData(today = businessDate()): DemoData {
  const pricing = {
    version: 1,
    a4Bw: 1500,
    a4Color: 6000,
    a3Bw: 3000,
    a3Color: 12000,
    duplexBps: 18000,
    spiral: 15000,
    comb: 10000,
    lamination: 8000,
    trimming: 5000,
  };
  const branches = [
    {
      id: "b1" as const,
      name: "Branch 1",
      location: "Colombo · fictional demo branch",
    },
    {
      id: "b2" as const,
      name: "Branch 2",
      location: "Kandy · fictional demo branch",
    },
  ];
  const users = [
    {
      id: "cashier-b1",
      name: "Branch 1 cashier",
      role: "cashier" as const,
      branchId: "b1" as const,
      active: true,
    },
    {
      id: "cashier-b2",
      name: "Branch 2 cashier",
      role: "cashier" as const,
      branchId: "b2" as const,
      active: true,
    },
    {
      id: "admin",
      name: "Demo Administrator",
      role: "admin" as const,
      branchId: null,
      active: true,
    },
  ];
  // Today's fixtures start at Colombo midnight, so early-day demo payments never precede their orders.
  const instant = (days: number, hour = 9) =>
    new Date(
      `${shiftDate(today, -days)}T${String(days === 0 ? 0 : hour).padStart(2, "0")}:00:00+05:30`,
    ).toISOString();
  const names = [
    "Walk-in",
    "Demo Studio",
    "Campus project",
    "Walk-in",
    "Sample Designs",
    "Demo Learning",
    "Walk-in",
    "Demo Studio",
    "Campus project",
    "Walk-in",
    "Sample Designs",
    "Demo Learning",
  ];
  const orders: Order[] = names.map((name, i) => {
    const day = i < 5 ? 0 : i < 8 ? 1 : i - 6;
    const quote = quoteOrder(
      [
        {
          ...blankLine(),
          description:
            i % 3 === 0
              ? "Coursework printing"
              : i % 3 === 1
                ? "Color presentation"
                : "Document copies",
          quantity: [40, 12, 100, 8, 60, 25][i % 6],
          color: i % 3 === 1 ? "Color" : "B&W",
          sides: i % 2 === 0 ? "Duplex" : "Simplex",
          binding: i % 4 === 0 ? "Spiral" : "None",
          notes: i === 0 ? "Keep pages in original sequence." : "",
        },
      ],
      pricing,
    );
    return {
      id: `PL-${1012 - i}`,
      branchId: (i % 3 === 2 ? "b2" : "b1") as BranchId,
      createdAt: instant(day, 9 + (i % 7)),
      updatedAt: instant(day, 9 + (i % 7)),
      actorId: i % 3 === 2 ? "cashier-b2" : "cashier-b1",
      customer: { name: name === "Walk-in" ? "" : name, phone: "" },
      ...quote,
      production: (["New", "In Progress", "Ready", "Completed"] as const)[
        i % 4
      ],
      notes: "Fictional demonstration order.",
    };
  });
  const payments = orders.flatMap((order, i) =>
    i % 3 === 0
      ? []
      : [
          {
            id: `seed-pay-${i}`,
            orderId: order.id,
            amountCents:
              i % 3 === 1 ? Math.floor(order.totalCents / 2) : order.totalCents,
            createdAt: order.createdAt,
            actorId: order.actorId,
            note: "Seeded simulated payment",
          },
        ],
  );
  const items: StockItem[] = [
    {
      id: "paper-a4",
      name: "A4 copy paper · 80 gsm",
      sku: "PAP-A4-80",
      unit: "sheets",
      active: true,
      quantities: { b1: 6800, b2: 4200 },
      thresholds: { b1: 1000, b2: 1000 },
    },
    {
      id: "paper-a3",
      name: "A3 copy paper · 80 gsm",
      sku: "PAP-A3-80",
      unit: "sheets",
      active: true,
      quantities: { b1: 320, b2: 180 },
      thresholds: { b1: 250, b2: 250 },
    },
    {
      id: "toner-cyan",
      name: "Cyan toner",
      sku: "TON-CYAN",
      unit: "cartridges",
      active: true,
      quantities: { b1: 4, b2: 1 },
      thresholds: { b1: 2, b2: 2 },
    },
    {
      id: "spiral",
      name: "Spiral binding coils",
      sku: "BND-SPR",
      unit: "coils",
      active: true,
      quantities: { b1: 65, b2: 40 },
      thresholds: { b1: 20, b2: 20 },
    },
    {
      id: "laminate",
      name: "A4 laminating pouches",
      sku: "LAM-A4",
      unit: "pouches",
      active: true,
      quantities: { b1: 18, b2: 90 },
      thresholds: { b1: 25, b2: 25 },
    },
    {
      id: "banner-roll",
      name: "Banner paper rolls · demo",
      sku: "BAN-ROLL",
      unit: "rolls",
      active: true,
      quantities: { b1: 20, b2: 12 },
      thresholds: { b1: 5, b2: 3 },
    },
  ];
  const movements: StockMovement[] = items.flatMap((item) =>
    branches.map((branch) => ({
      id: `opening-${item.id}-${branch.id}`,
      itemId: item.id,
      branchId: branch.id,
      delta:
        item.quantities[branch.id] +
        (item.id === "paper-a4" ? (branch.id === "b1" ? 100 : -100) : 0),
      reason: "Seeded opening balance",
      createdAt: instant(10),
      actorId: "admin",
      transferId: null,
    })),
  );
  movements.push(
    {
      id: "seed-transfer-out",
      itemId: "paper-a4",
      branchId: "b1",
      delta: -100,
      reason: "Seeded instant demo transfer",
      createdAt: instant(1),
      actorId: "admin",
      transferId: "TR-SEED",
    },
    {
      id: "seed-transfer-in",
      itemId: "paper-a4",
      branchId: "b2",
      delta: 100,
      reason: "Seeded instant demo transfer",
      createdAt: instant(1),
      actorId: "admin",
      transferId: "TR-SEED",
    },
  );
  return {
    version: 2,
    customers: seedCustomers(instant(10)),
    ...seedCatalogue(instant(10)),
    usages: [],
    revision: 0,
    sessionId: null,
    branches,
    users,
    pricing,
    orders,
    payments,
    items,
    movements,
    transfers: [
      {
        id: "TR-SEED",
        itemId: "paper-a4",
        source: "b1",
        target: "b2",
        quantity: 100,
        createdAt: instant(1),
        actorId: "admin",
        note: "Seeded instant demo transfer",
      },
    ],
    audit: [
      {
        id: "seed-audit",
        actorId: "admin",
        action: "Demonstration initialized",
        detail: "Fictional fixtures; no real business activity",
        createdAt: instant(0),
      },
    ],
    settings: {
      shopName: "Pressline",
      receiptNote:
        "Thank you. This is a demonstration receipt, not proof of settlement.",
      sms: { phone: "", cutoff: "23:59", enabled: false },
    },
    preferences: { compact: false, reduceMotion: false },
  };
}
