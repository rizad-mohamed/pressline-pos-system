import { DomainError, type DemoData } from "@/domain/model";

/** Validate the persisted event graph as well as the stock ledger totals. */
export function validateMaterials(data: DemoData) {
  const fail = (): never => {
    throw new DomainError(
      "validation",
      "Saved material plans, usage events or movement evidence are inconsistent.",
    );
  };
  const plans = data.orders.flatMap((o) =>
    o.materialPlan ? [o.materialPlan.id] : [],
  );
  if (new Set(plans).size !== plans.length) fail();
  for (const order of data.orders) {
    const keys = new Set<string>();
    for (const line of order.materialPlan?.lines ?? []) {
      const key = `${line.lineId}/${line.itemId}`;
      if (
        keys.has(key) ||
        !order.lines.some((l) => l.id === line.lineId) ||
        !data.items.some((i) => i.id === line.itemId && i.unit === line.unit)
      )
        fail();
      keys.add(key);
    }
  }
  const consumed = new Set<string>(),
    corrected = new Set<string>(),
    referenced = new Set<string>();
  for (const event of data.usages) {
    const order = data.orders.find((o) => o.id === event.orderId);
    const actor = data.users.find((u) => u.id === event.actorId);
    if (
      !order ||
      !actor ||
      order.branchId !== event.branchId ||
      (actor.role === "cashier" && actor.branchId !== event.branchId) ||
      event.createdAt < order.createdAt
    )
      fail();
    if (event.kind === "consumption") {
      if (
        consumed.has(event.planId) ||
        event.correctsId !== null ||
        event.id !== `usage-${event.planId}`
      )
        fail();
      consumed.add(event.planId);
      if (order!.materialPlan?.id === event.planId) {
        if (
          order!.materialPlan.lines.length !== event.lines.length ||
          order!.materialPlan.lines.some((l, i) =>
            Object.entries(l).some(
              ([k, v]) => event.lines[i][k as keyof typeof l] !== v,
            ),
          )
        )
          fail();
      }
    } else {
      const original = data.usages.find((u) => u.id === event.correctsId);
      if (
        !original ||
        original.kind !== "consumption" ||
        corrected.has(original.id) ||
        actor!.role !== "admin" ||
        event.id !== `correction-${original.id}` ||
        event.planId !== original.planId ||
        event.orderId !== original.orderId ||
        event.branchId !== original.branchId ||
        event.createdAt < original.createdAt ||
        event.lines.length !== original.lines.length ||
        event.lines.some((l, i) =>
          [
            "lineId",
            "itemId",
            "unit",
            "quantity",
            "materialName",
            "serviceName",
          ].some(
            (k) =>
              l[k as keyof typeof l] !== original.lines[i][k as keyof typeof l],
          ),
        )
      )
        fail();
      corrected.add(event.correctsId!);
    }
    const keys = new Set<string>();
    for (const line of event.lines) {
      const key = `${line.lineId}/${line.itemId}`;
      const movement = data.movements.find((m) => m.id === line.movementId);
      if (
        keys.has(key) ||
        referenced.has(line.movementId) ||
        !order!.lines.some((l) => l.id === line.lineId) ||
        !data.items.some((i) => i.id === line.itemId && i.unit === line.unit) ||
        !movement ||
        movement.transferId !== null ||
        movement.usageId !== event.id ||
        movement.orderId !== event.orderId ||
        movement.lineId !== line.lineId ||
        movement.itemId !== line.itemId ||
        movement.branchId !== event.branchId ||
        movement.unit !== line.unit ||
        movement.actorId !== event.actorId ||
        movement.createdAt !== event.createdAt ||
        movement.reason !== event.reason ||
        movement.serviceName !== line.serviceName ||
        movement.before !== line.before ||
        movement.after !== line.after ||
        movement.delta !==
          (event.kind === "consumption" ? -line.quantity : line.quantity) ||
        line.after !== line.before + movement.delta
      )
        fail();
      keys.add(key);
      referenced.add(line.movementId);
    }
  }
  for (const movement of data.movements) {
    if (
      (movement.usageId && !referenced.has(movement.id)) ||
      (!movement.usageId &&
        [
          movement.orderId,
          movement.lineId,
          movement.before,
          movement.after,
          movement.serviceName,
        ].some((v) => v !== undefined))
    )
      fail();
  }
  // Newest-first insertion order breaks equal-timestamp ties without trusting wall-clock monotonicity.
  const balances = new Map<string, number>(
    data.items.flatMap((i) =>
      data.branches.map(
        (b) => [`${i.id}/${b.id}`, i.quantities[b.id]] as const,
      ),
    ),
  );
  // Existing fixtures append older transfers after openings. Timestamp sort preserves that legacy layout.
  const ledger = data.movements
    .map((m, index) => ({ m, index }))
    .sort(
      (a, b) => b.m.createdAt.localeCompare(a.m.createdAt) || a.index - b.index,
    );
  for (const { m } of ledger) {
    const key = `${m.itemId}/${m.branchId}`,
      after = balances.get(key)!;
    if (m.usageId && (m.after !== after || m.before !== after - m.delta))
      fail();
    balances.set(key, after - m.delta);
  }
}
