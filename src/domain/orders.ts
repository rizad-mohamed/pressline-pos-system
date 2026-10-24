import { z } from "zod";
import { branchIdSchema, centsSchema, customerSchema, DomainError, lineInputSchema, productionStates, type DemoData, type DemoUser, type Order, type OrderCommand } from "./model";
import { quoteOrder } from "./pricing";
import { sumCents } from "./money";
export function paidFor(data: DemoData, orderId: string, asOf?: string): number { return sumCents(data.payments.filter(p => p.orderId === orderId && (!asOf || p.createdAt <= asOf)).map(p => p.amountCents)); }
export function balanceFor(data: DemoData, order: Order, asOf?: string): number { return order.totalCents - paidFor(data, order.id, asOf); }
export function paymentState(data: DemoData, order: Order): "Unpaid" | "Partial" | "Paid" { const paid = paidFor(data,order.id); return paid === 0 ? "Unpaid" : paid < order.totalCents ? "Partial" : "Paid"; }
export function canReadBranch(user: DemoUser, branch: string): boolean { return user.active && (user.role === "admin" || user.branchId === branch); }
export function scopedOrders(data: DemoData, user: DemoUser, scope: string): Order[] { return data.orders.filter(o => canReadBranch(user,o.branchId) && (user.role === "cashier" || scope === "all" || o.branchId === scope)); }
export function assertBranch(user: DemoUser, branch: string) { if (!canReadBranch(user,branch)) throw new DomainError("permission", "This demo account can only operate its assigned branch."); }
export function assertAdmin(user: DemoUser) { if (!user.active || user.role !== "admin") throw new DomainError("permission", "Choose the Administrator demo account to manage this section."); }
export function mutate(data: DemoData, user: DemoUser, requestId: string, action: string, detail: string, now: string, update: (draft: DemoData) => void): DemoData {
  if (!data.users.some(u => u.id === user.id && u.active)) throw new DomainError("permission", "Choose an active demo account first.");
  if (!requestId || data.audit.some(a => a.id === requestId)) throw new DomainError("duplicate", "This action was already recorded. Review the saved record before trying again.");
  const draft = structuredClone(data); update(draft);
  draft.audit.unshift({ id: requestId, actorId: user.id, action, detail, createdAt: now }); draft.revision += 1;
  return draft;
}
function findOrder(data: DemoData, user: DemoUser, id: string): Order { const order = data.orders.find(o => o.id === id); if (!order) throw new DomainError("missing", "The order was not found. Return to order history."); assertBranch(user,order.branchId); return order; }
export function applyOrderCommand(data: DemoData, user: DemoUser, command: OrderCommand, now: string): DemoData {
  if (command.type === "create-order") {
    branchIdSchema.parse(command.branchId); assertBranch(user, command.branchId);
    const customer = customerSchema.parse(command.customer); z.string().max(1000).parse(command.notes);
    z.array(lineInputSchema).min(1).max(30).parse(command.lines);
    const quote = quoteOrder(command.lines,data.pricing); centsSchema.parse(command.advanceCents);
    if (command.advanceCents > quote.totalCents) throw new DomainError("validation", "The advance cannot exceed the order total.");
    const sequence = data.orders.reduce((max,o) => Math.max(max,Number(o.id.split("-").at(-1)) || 0),1000)+1;
    const id = `PL-${sequence}`;
    return mutate(data,user,command.requestId,"Order created",id,now,draft => {
      draft.orders.unshift({ id, branchId: command.branchId, customer, ...quote, production: "New", notes: command.notes, createdAt: now, updatedAt: now, actorId: user.id });
      if (command.advanceCents > 0) draft.payments.unshift({ id: `pay-${command.requestId}`, orderId: id, amountCents: command.advanceCents, actorId: user.id, createdAt: now, note: "Simulated advance at checkout" });
    });
  }
  const order = findOrder(data,user,command.orderId);
  if (command.type === "payment") {
    if (now < order.createdAt) throw new DomainError("validation", "This sample order is dated after the current time. Reset demo fixtures or choose an earlier order.");
    centsSchema.refine(n => n > 0, "Enter a payment greater than zero.").parse(command.amountCents);
    z.string().max(200).parse(command.note);
    if (command.amountCents > balanceFor(data,order)) throw new DomainError("validation", "Payment exceeds the balance due. Enter the balance or a smaller amount.");
    return mutate(data,user,command.requestId,"Simulated payment recorded",order.id,now,draft => { draft.payments.unshift({ id: `pay-${command.requestId}`, orderId: order.id, amountCents: command.amountCents, createdAt: now, actorId: user.id, note: command.note }); });
  }
  if (command.type === "production") {
    if (productionStates.indexOf(command.next) !== productionStates.indexOf(order.production)+1) throw new DomainError("validation", "Advance production one step at a time. Completed jobs cannot be reopened in this demo.");
    return mutate(data,user,command.requestId,"Production advanced",`${order.id}: ${command.next}`,now,draft => { const target = draft.orders.find(o => o.id === order.id)!; target.production = command.next; target.updatedAt = now; });
  }
  if (order.production === "Completed") throw new DomainError("validation", "Completed orders are read-only. Payment collection remains available.");
  const customer = customerSchema.parse(command.customer); z.string().max(1000).parse(command.notes);
  return mutate(data,user,command.requestId,"Order information updated",order.id,now,draft => { const target = draft.orders.find(o => o.id === order.id)!; target.customer = customer; target.notes = command.notes; target.updatedAt = now; });
}
