import { demoDataSchema, type DemoData, DomainError } from "@/domain/model";
import { migrateDemoData } from "./migration";
import { validateMaterials } from "./material-validation";
export function validateData(value: unknown): DemoData {
  const data = demoDataSchema.parse(migrateDemoData(value));
  const fail = (message: string): never => {
    throw new DomainError("validation", message);
  };
  function unique(values: { id: string }[], label: string) {
    if (new Set(values.map((v) => v.id)).size !== values.length)
      fail(`Duplicate ${label} references in saved demo data.`);
  }
  for (const key of [
    "branches",
    "users",
    "orders",
    "payments",
    "items",
    "movements",
    "transfers",
    "audit",
    "customers",
    "categories",
    "services",
    "usages",
  ] as const)
    unique(data[key], key);
  if (
    !data.branches.some((b) => b.id === "b1") ||
    !data.branches.some((b) => b.id === "b2")
  )
    fail("Both demo branches are required.");
  if (
    data.sessionId &&
    !data.users.some((u) => u.id === data.sessionId && u.active)
  )
    fail("Saved demo account is unavailable.");
  for (const user of data.users)
    if (
      (user.role === "cashier" && !user.branchId) ||
      (user.role === "admin" && user.branchId !== null)
    )
      fail("Demo role and branch assignment do not match.");
  for (const order of data.orders) {
    if (
      order.customerId &&
      !data.customers.some((c) => c.id === order.customerId)
    )
      fail("Saved customer link is missing.");
    for (const line of order.lines) {
      if (line.serviceId && !data.services.some((s) => s.id === line.serviceId))
        fail("Saved service reference is missing.");
      if (line.serviceSnapshot && line.serviceSnapshot.id !== line.serviceId)
        fail("Saved service snapshot reference is inconsistent.");
    }
    if (!data.users.some((u) => u.id === order.actorId))
      fail("Order author is missing.");
    if (
      order.lines.some(
        (l) => l.totalCents !== l.quantity * l.unitCents + l.setupCents,
      ) ||
      order.totalCents !== order.lines.reduce((n, l) => n + l.totalCents, 0)
    )
      fail("Saved order price snapshot is inconsistent.");
    if (
      data.payments
        .filter((p) => p.orderId === order.id)
        .reduce((n, p) => n + p.amountCents, 0) > order.totalCents
    )
      fail("Saved payments exceed the order total.");
  }
  for (const service of data.services) {
    if (!data.categories.some((c) => c.id === service.categoryId))
      fail("Service category reference is missing.");
    for (const recipe of service.materials)
      if (
        !data.items.some(
          (i) => i.id === recipe.itemId && i.unit === recipe.unit,
        )
      )
        fail("Service material reference or unit is inconsistent.");
  }
  if (
    new Set(data.services.map((s) => s.code.toLowerCase())).size !==
      data.services.length ||
    new Set(data.categories.map((c) => c.name.toLowerCase())).size !==
      data.categories.length
  )
    fail(
      "Service codes and category names must be unique, including archived records.",
    );
  for (const customer of data.customers)
    if (
      !data.users.some((u) => u.id === customer.actorId) ||
      customer.updatedAt < customer.createdAt
    )
      fail("Customer author or update metadata is inconsistent.");
  for (const payment of data.payments) {
    const order = data.orders.find((o) => o.id === payment.orderId);
    if (
      !order ||
      payment.createdAt < order.createdAt ||
      !data.users.some((u) => u.id === payment.actorId)
    )
      fail("Saved payment references are inconsistent.");
  }
  for (const movement of data.movements)
    if (
      !data.items.some((i) => i.id === movement.itemId) ||
      (movement.transferId &&
        !data.transfers.some((t) => t.id === movement.transferId))
    )
      fail("Stock movement reference is missing.");
  for (const item of data.items)
    for (const branch of data.branches)
      if (
        data.movements
          .filter((m) => m.itemId === item.id && m.branchId === branch.id)
          .reduce((n, m) => n + m.delta, 0) !== item.quantities[branch.id]
      )
        fail("Stock quantities do not match the movement ledger.");
  for (const transfer of data.transfers) {
    const moves = data.movements.filter((m) => m.transferId === transfer.id);
    if (
      transfer.source === transfer.target ||
      moves.length !== 2 ||
      !moves.some(
        (m) =>
          m.branchId === transfer.source &&
          m.delta === -transfer.quantity &&
          m.itemId === transfer.itemId,
      ) ||
      !moves.some(
        (m) =>
          m.branchId === transfer.target &&
          m.delta === transfer.quantity &&
          m.itemId === transfer.itemId,
      )
    )
      fail("Transfer is not balanced across both branches.");
  }
  validateMaterials(data);
  return data;
}
