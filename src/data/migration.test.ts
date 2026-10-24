import { describe, it, expect } from "vitest";
import { seedData } from "./seed";
import { validateData } from "./validation";
import { createDemoRepository, STORAGE_KEY } from "./repository";

function legacy() {
  const {
    customers: _customers,
    services: _services,
    categories: _categories,
    usages: _usages,
    ...old
  } = seedData("2026-10-24");
  void _customers;
  void _services;
  void _categories;
  void _usages;
  return { ...old, version: 1, sessionId: "admin" };
}
describe("safe v1 frontend migration", () => {
  it("retains all financial and stock records without guessing customer associations", () => {
    const old = legacy();
    const next = validateData(old);
    expect(next.version).toBe(2);
    expect(
      next.orders.map(({ customerId, ...order }) => {
        expect(customerId).toBeNull();
        return order;
      }),
    ).toEqual(old.orders);
    for (const key of [
      "payments",
      "items",
      "movements",
      "transfers",
      "pricing",
    ] as const)
      expect(next[key]).toEqual(old[key]);
    expect(next.customers).toEqual([]);
    expect(next.services).toHaveLength(6);
    expect(old.version).toBe(1);
  });
  it("does not write migration before an explicit action and preserves stale-write checks", () => {
    const old = JSON.stringify(legacy());
    const map = new Map([[STORAGE_KEY, old]]);
    const storage = {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => {
        map.set(k, v);
      },
      removeItem: (k: string) => {
        map.delete(k);
      },
    };
    const repo = createDemoRepository(() => storage);
    repo.hydrate();
    expect(repo.getSnapshot().data?.version).toBe(2);
    expect(map.get(STORAGE_KEY)).toBe(old);
    map.set(STORAGE_KEY, old + " ");
    expect(repo.enter("cashier-b1").ok).toBe(false);
    expect(map.get(STORAGE_KEY)).toBe(old + " ");
  });
  it("leaves malformed legacy data untouched behind read-only recovery", () => {
    const raw = JSON.stringify({
      ...legacy(),
      payments: [{ amountCents: -1 }],
    });
    let writes = 0;
    const repo = createDemoRepository(() => ({
      getItem: () => raw,
      setItem: () => {
        writes++;
      },
      removeItem: () => {},
    }));
    repo.hydrate();
    expect(repo.getSnapshot().recoveryRequired).toBe(true);
    expect(repo.enter("admin").ok).toBe(false);
    expect(writes).toBe(0);
  });
});
