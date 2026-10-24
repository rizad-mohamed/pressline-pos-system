import { z } from "zod";
export const branchIdSchema = z.enum(["b1", "b2"]);
export type BranchId = z.infer<typeof branchIdSchema>;
export type Scope = BranchId | "all";
export const centsSchema = z.number().int().min(0).max(1_000_000_000_000);
export const countSchema = z.number().int().min(0).max(10_000_000);
export const phoneSchema = z.string().trim().max(30).refine(v => v === "" || /^(?:0\d{9}|\+94\d{9})$/.test(v.replace(/[\s()-]/g, "")), "Use a Sri Lankan number such as 077 000 0000 or +94 77 000 0000.");
export const customerSchema = z.object({ name: z.string().trim().max(100), phone: phoneSchema });
export const lineInputSchema = z.object({
  description: z.string().trim().min(1, "Enter a short item description.").max(100),
  size: z.enum(["A4", "A3"]), color: z.enum(["B&W", "Color"]), sides: z.enum(["Simplex", "Duplex"]),
  binding: z.enum(["None", "Spiral", "Comb"]), finishing: z.enum(["None", "Lamination", "Trimming"]),
  quantity: z.number().int("Use whole printed sheets.").min(1, "Enter at least 1 sheet.").max(100000, "Use at most 100,000 sheets."),
  notes: z.string().trim().max(500),
});
export type LineInput = z.infer<typeof lineInputSchema>;
export const pricingSchema = z.object({
  version: z.number().int().positive(),
  a4Bw: centsSchema, a4Color: centsSchema, a3Bw: centsSchema, a3Color: centsSchema,
  duplexBps: z.number().int().min(10000).max(30000),
  spiral: centsSchema, comb: centsSchema, lamination: centsSchema, trimming: centsSchema,
}).refine(v => [v.a4Bw,v.a4Color,v.a3Bw,v.a3Color].every(n => n > 0 && n <= 10_000_000), "Printing rates must be positive and at most LKR 100,000.");
export type Pricing = z.infer<typeof pricingSchema>;
export const lineSchema = lineInputSchema.extend({ id: z.string(), unitCents: centsSchema, setupCents: centsSchema, totalCents: centsSchema, ruleVersion: z.number().int().positive() });
export type OrderLine = z.infer<typeof lineSchema>;
export const productionStates = ["New", "In Progress", "Ready", "Completed"] as const;
export const orderSchema = z.object({
  id: z.string(), branchId: branchIdSchema, createdAt: z.string().datetime(), updatedAt: z.string().datetime(), actorId: z.string(),
  customer: customerSchema, lines: z.array(lineSchema).min(1).max(30), totalCents: centsSchema,
  production: z.enum(productionStates), notes: z.string().max(1000),
});
export type Order = z.infer<typeof orderSchema>;
export const paymentSchema = z.object({ id: z.string(), orderId: z.string(), amountCents: centsSchema.refine(n => n > 0), createdAt: z.string().datetime(), actorId: z.string(), note: z.string().max(200) });
export type Payment = z.infer<typeof paymentSchema>;
export const branchSchema = z.object({ id: branchIdSchema, name: z.string().trim().min(1).max(50), location: z.string().trim().min(1).max(100) });
export type Branch = z.infer<typeof branchSchema>;
export const userSchema = z.object({ id: z.string(), name: z.string().trim().min(1).max(60), role: z.enum(["cashier", "admin"]), branchId: branchIdSchema.nullable(), active: z.boolean() });
export type DemoUser = z.infer<typeof userSchema>;
export const stockItemSchema = z.object({
  id: z.string(), name: z.string().trim().min(1).max(100), sku: z.string().trim().min(1).max(30), unit: z.string().trim().min(1).max(30), active: z.boolean(),
  quantities: z.object({ b1: countSchema, b2: countSchema }), thresholds: z.object({ b1: countSchema, b2: countSchema }),
});
export type StockItem = z.infer<typeof stockItemSchema>;
export const movementSchema = z.object({ id: z.string(), itemId: z.string(), branchId: branchIdSchema, delta: z.number().int().min(-10_000_000).max(10_000_000), reason: z.string(), createdAt: z.string().datetime(), actorId: z.string(), transferId: z.string().nullable() });
export type StockMovement = z.infer<typeof movementSchema>;
export const transferSchema = z.object({ id: z.string(), itemId: z.string(), source: branchIdSchema, target: branchIdSchema, quantity: countSchema.refine(n => n > 0), createdAt: z.string().datetime(), actorId: z.string(), note: z.string() });
export type Transfer = z.infer<typeof transferSchema>;
export const auditSchema = z.object({ id: z.string(), actorId: z.string(), action: z.string(), detail: z.string(), createdAt: z.string().datetime() });
export const smsConfigSchema = z.object({ phone: phoneSchema, cutoff: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), enabled: z.literal(false) });
export type SmsConfig = z.infer<typeof smsConfigSchema>;
export const demoDataSchema = z.object({
  version: z.literal(1), revision: z.number().int().min(0), sessionId: z.string().nullable(),
  branches: z.array(branchSchema).length(2), users: z.array(userSchema).length(3), pricing: pricingSchema,
  orders: z.array(orderSchema).max(10000), payments: z.array(paymentSchema).max(30000),
  items: z.array(stockItemSchema).max(1000), movements: z.array(movementSchema).max(30000), transfers: z.array(transferSchema).max(10000), audit: z.array(auditSchema).max(30000),
  settings: z.object({ shopName: z.string().trim().min(1).max(60), receiptNote: z.string().max(200), sms: smsConfigSchema }),
  preferences: z.object({ compact: z.boolean(), reduceMotion: z.boolean() }),
});
export type DemoData = z.infer<typeof demoDataSchema>;
export type ErrorCode = "validation" | "permission" | "missing" | "duplicate" | "conflict" | "storage";
export type Result<T> = { ok: true; data: T } | { ok: false; error: { code: ErrorCode; message: string } };
export class DomainError extends Error { constructor(public code: ErrorCode, message: string) { super(message); this.name = "DomainError"; } }
export type OrderCommand =
  | { type: "create-order"; requestId: string; branchId: BranchId; customer: z.infer<typeof customerSchema>; lines: LineInput[]; notes: string; advanceCents: number }
  | { type: "payment"; requestId: string; orderId: string; amountCents: number; note: string }
  | { type: "production"; requestId: string; orderId: string; next: Order["production"] }
  | { type: "order-info"; requestId: string; orderId: string; customer: z.infer<typeof customerSchema>; notes: string };
export type InventoryValues = Pick<StockItem,"name"|"sku"|"unit"|"thresholds">;
export type InventoryCommand =
  | {type:"stock-item";requestId:string;itemId:string|null;values:InventoryValues;opening:{b1:number;b2:number}}
  | {type:"stock-active";requestId:string;itemId:string;active:boolean}
  | {type:"stock-adjust";requestId:string;itemId:string;branchId:BranchId;delta:number;reason:string};
export type TransferCommand = {type:"transfer";requestId:string;itemId:string;source:BranchId;target:BranchId;quantity:number;note:string};
export type Command = OrderCommand | InventoryCommand | TransferCommand;
