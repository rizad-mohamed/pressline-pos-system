import { z } from "zod";
import {
  DomainError,
  savedCustomerValuesSchema,
  type CustomerValues,
  type DemoData,
  type DemoUser,
  type SavedCustomer,
} from "./model";
import {
  assertAdmin,
  assertBranch,
  canReadBranch,
  mutate,
  paidFor,
} from "./orders";
import { sumCents } from "./money";

export type CustomerCommand =
  | {
      type: "customer-save";
      requestId: string;
      customerId: string | null;
      expectedUpdatedAt?: string;
      values: CustomerValues;
      allowDuplicate?: boolean;
    }
  | {
      type: "customer-active";
      requestId: string;
      customerId: string;
      active: boolean;
    }
  | {
      type: "link-customer";
      requestId: string;
      orderId: string;
      customerId: string;
    };

export function customerOrders(
  data: DemoData,
  user: DemoUser,
  customerId: string,
) {
  return data.orders
    .filter(
      (o) => o.customerId === customerId && canReadBranch(user, o.branchId),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export function customerLedger(
  data: DemoData,
  user: DemoUser,
  customerId: string,
) {
  const orders = customerOrders(data, user, customerId);
  const orderValue = sumCents(orders.map((o) => o.totalCents));
  const paid = sumCents(orders.map((o) => paidFor(data, o.id)));
  return { orders, orderValue, paid, outstanding: orderValue - paid };
}
const nameKey = (name: string) =>
  name.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("en");
const phoneKey = (phone: string) =>
  phone.replace(/[\s().-]/g, "").replace(/^0(?=\d{9}$)/, "+94");
export function matchesCustomer(customer: SavedCustomer, query: string) {
  const digits = phoneKey(query).replace(/\D/g, "");
  return (
    `${customer.name} ${customer.contactPerson} ${customer.email}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()) ||
    (digits.length >= 3 &&
      phoneKey(customer.phone).replace(/\D/g, "").includes(digits))
  );
}
export function likelyCustomers(
  customers: SavedCustomer[],
  values: Pick<CustomerValues, "name" | "phone" | "email">,
  exceptId?: string | null,
) {
  return customers.filter(
    (c) =>
      c.id !== exceptId &&
      (nameKey(c.name) === nameKey(values.name) ||
        (!!values.phone && phoneKey(c.phone) === phoneKey(values.phone)) ||
        (!!values.email &&
          c.email.toLowerCase() === values.email.toLowerCase())),
  );
}
export function applyCustomerCommand(
  data: DemoData,
  user: DemoUser,
  c: CustomerCommand,
  now: string,
): DemoData {
  if (c.type === "link-customer") {
    const order = data.orders.find((o) => o.id === c.orderId);
    if (!order) throw new DomainError("missing", "Order not found.");
    assertBranch(user, order.branchId);
    if (order.customerId)
      throw new DomainError(
        "conflict",
        "This order already has a saved customer. Its historical association is retained.",
      );
    if (!data.customers.some((p) => p.id === c.customerId && p.active))
      throw new DomainError("validation", "Choose an active saved customer.");
    return mutate(
      data,
      user,
      c.requestId,
      "Legacy customer explicitly linked",
      order.id,
      now,
      (draft) => {
        draft.orders.find((o) => o.id === order.id)!.customerId = c.customerId;
      },
    );
  }
  if (c.type === "customer-active") {
    assertAdmin(user);
    z.boolean().parse(c.active);
    if (!data.customers.some((p) => p.id === c.customerId))
      throw new DomainError("missing", "Customer not found.");
    return mutate(
      data,
      user,
      c.requestId,
      c.active ? "Customer reactivated" : "Customer archived",
      c.customerId,
      now,
      (draft) => {
        const target = draft.customers.find((p) => p.id === c.customerId)!;
        target.active = c.active;
        target.updatedAt = now;
      },
    );
  }
  if (c.customerId) assertAdmin(user);
  const values = savedCustomerValuesSchema.parse(c.values);
  const existing = c.customerId
    ? data.customers.find((p) => p.id === c.customerId)
    : null;
  if (c.customerId && !existing)
    throw new DomainError("missing", "Customer not found.");
  if (existing && existing.updatedAt !== c.expectedUpdatedAt)
    throw new DomainError(
      "conflict",
      "This customer changed. Close and reopen the editor to review it.",
    );
  if (
    likelyCustomers(data.customers, values, c.customerId).length &&
    !c.allowDuplicate
  )
    throw new DomainError(
      "duplicate",
      "A similar name or contact exists. Review the duplicate warning and confirm these are separate customers.",
    );
  return mutate(
    data,
    user,
    c.requestId,
    existing ? "Customer updated" : "Customer created",
    values.name,
    now,
    (draft) => {
      if (existing)
        Object.assign(
          draft.customers.find((p) => p.id === existing.id)!,
          values,
          { updatedAt: now },
        );
      else
        draft.customers.unshift({
          id: `cust-${c.requestId}`,
          ...values,
          active: true,
          createdAt: now,
          updatedAt: now,
          actorId: user.id,
        });
    },
  );
}
