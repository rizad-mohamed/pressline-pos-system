import { z } from "zod";
import type { CustomerCommand } from "./customers";
import type { ServiceCommand } from "./services";
export const branchIdSchema = z.enum(["b1", "b2"]);
export type BranchId = z.infer<typeof branchIdSchema>;
export type Scope = BranchId | "all";
export const centsSchema = z.number().int().min(0).max(1_000_000_000_000);
export const countSchema = z.number().int().min(0).max(10_000_000);
export const phoneSchema = z
  .string()
  .trim()
  .max(30)
  .refine(
    (v) => v === "" || /^(?:0\d{9}|\+94\d{9})$/.test(v.replace(/[\s()-]/g, "")),
    "Use a Sri Lankan number such as 077 000 0000 or +94 77 000 0000.",
  );
export const customerSchema = z.object({
  name: z.string().trim().max(100),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine(
      (v) => v === "" || /^\+?\d{7,15}$/.test(v.replace(/[\s().-]/g, "")),
      "Use 7–15 digits with an optional international + prefix.",
    ),
});
export const lineInputSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Enter a short item description.")
    .max(100),
  size: z.enum(["A4", "A3"]),
  color: z.enum(["B&W", "Color"]),
  sides: z.enum(["Simplex", "Duplex"]),
  binding: z.enum(["None", "Spiral", "Comb"]),
  finishing: z.enum(["None", "Lamination", "Trimming"]),
  quantity: z
    .number()
    .int("Use whole printed sheets.")
    .min(1, "Enter at least 1 sheet.")
    .max(100000, "Use at most 100,000 sheets."),
  notes: z.string().trim().max(500),
  serviceId: z.string().optional(),
  serviceVersion: z.number().int().positive().optional(),
});
export type LineInput = z.infer<typeof lineInputSchema>;
export const savedCustomerValuesSchema = z.object({
  kind: z.enum(["Individual", "Business"]),
  name: z.string().trim().min(1, "Enter a customer or company name.").max(100),
  contactPerson: z.string().trim().max(100),
  phone: z
    .string()
    .trim()
    .max(30)
    .transform((v) => v.replace(/[\s().-]/g, ""))
    .refine(
      (v) => v === "" || /^\+?\d{7,15}$/.test(v),
      "Use 7–15 digits with an optional international + prefix.",
    ),
  email: z.union([z.literal(""), z.email()]).transform((v) => v.toLowerCase()),
  address: z.string().trim().max(300),
  notes: z.string().trim().max(500),
});
export type CustomerValues = z.infer<typeof savedCustomerValuesSchema>;
export const savedCustomerSchema = savedCustomerValuesSchema.extend({
  id: z.string().min(1),
  active: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  actorId: z.string(),
});
export type SavedCustomer = z.infer<typeof savedCustomerSchema>;
export const recipeSchema = z.object({
  itemId: z.string().min(1),
  unit: z.string().min(1).max(30),
  quantity: countSchema.refine(
    (n) => n > 0,
    "Use a positive whole material quantity.",
  ),
  basis: z.enum(["unit", "job"]),
});
export type MaterialRecipe = z.infer<typeof recipeSchema>;
export const printDefaultsSchema = lineInputSchema.omit({
  description: true,
  quantity: true,
  notes: true,
  serviceId: true,
  serviceVersion: true,
});
export const printChoicesSchema = z.object({
  size: z
    .array(z.enum(["A4", "A3"]))
    .min(1)
    .max(2),
  color: z
    .array(z.enum(["B&W", "Color"]))
    .min(1)
    .max(2),
  sides: z
    .array(z.enum(["Simplex", "Duplex"]))
    .min(1)
    .max(2),
  binding: z
    .array(z.enum(["None", "Spiral", "Comb"]))
    .min(1)
    .max(3),
  finishing: z
    .array(z.enum(["None", "Lamination", "Trimming"]))
    .min(1)
    .max(3),
});
export const serviceValuesSchema = z
  .object({
    code: z.string().trim().min(1).max(30),
    name: z.string().trim().min(1).max(100),
    description: z.string().trim().max(180),
    categoryId: z.string().min(1),
    status: z.enum(["active", "inactive", "archived"]),
    model: z.enum(["print", "unit"]),
    rateCents: centsSchema.refine(
      (n) => n > 0 && n <= 10_000_000,
      "Use a positive rate up to LKR 100,000.",
    ),
    setupCents: centsSchema.max(10_000_000),
    unitLabel: z.string().trim().min(1).max(30),
    defaults: printDefaultsSchema.nullable(),
    choices: printChoicesSchema.nullable(),
    materials: z.array(recipeSchema).max(20),
    illustration: z.enum([
      "document",
      "color",
      "large",
      "duplex",
      "binding",
      "lamination",
      "custom",
    ]),
  })
  .refine(
    (s) =>
      s.model !== "print" ||
      (!!s.defaults &&
        !!s.choices &&
        Object.entries(s.defaults).every(([k, v]) =>
          (s.choices![k as keyof typeof s.choices] as string[]).includes(v),
        )),
    "Printing services need supported defaults for every print option.",
  );
export type ServiceValues = z.infer<typeof serviceValuesSchema>;
export const serviceSchema = serviceValuesSchema.safeExtend({
  id: z.string().min(1),
  version: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Service = z.infer<typeof serviceSchema>;
export const categorySchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(50),
  active: z.boolean(),
});
export type ServiceCategory = z.infer<typeof categorySchema>;
export const materialInputSchema = z.object({
  lineId: z.string().min(1),
  itemId: z.string().min(1),
  unit: z.string().min(1),
  quantity: countSchema.refine(
    (n) => n > 0,
    "Use a positive whole material quantity.",
  ),
});
export type MaterialInput = z.infer<typeof materialInputSchema>;
export const materialPlanSchema = z.object({
  id: z.string().min(1),
  revision: z.number().int().nonnegative(),
  lines: z.array(materialInputSchema).max(30),
});
export type MaterialPlan = z.infer<typeof materialPlanSchema>;
export const usageSchema = z.object({
  id: z.string().min(1),
  planId: z.string().min(1),
  orderId: z.string().min(1),
  branchId: branchIdSchema,
  kind: z.enum(["consumption", "correction"]),
  correctsId: z.string().nullable(),
  actorId: z.string(),
  createdAt: z.string().datetime(),
  reason: z.string().trim().min(3).max(200),
  lines: z
    .array(
      materialInputSchema.extend({
        movementId: z.string().min(1),
        materialName: z.string(),
        serviceName: z.string(),
        before: countSchema,
        after: countSchema,
      }),
    )
    .min(1)
    .max(30),
});
export type MaterialUsage = z.infer<typeof usageSchema>;

export const pricingSchema = z
  .object({
    version: z.number().int().positive(),
    a4Bw: centsSchema,
    a4Color: centsSchema,
    a3Bw: centsSchema,
    a3Color: centsSchema,
    duplexBps: z.number().int().min(10000).max(30000),
    spiral: centsSchema,
    comb: centsSchema,
    lamination: centsSchema,
    trimming: centsSchema,
  })
  .refine(
    (v) =>
      [v.a4Bw, v.a4Color, v.a3Bw, v.a3Color].every(
        (n) => n > 0 && n <= 10_000_000,
      ),
    "Printing rates must be positive and at most LKR 100,000.",
  );
export type Pricing = z.infer<typeof pricingSchema>;
export const lineSchema = lineInputSchema.extend({
  id: z.string(),
  unitCents: centsSchema,
  setupCents: centsSchema,
  totalCents: centsSchema,
  ruleVersion: z.number().int().positive(),
  serviceSnapshot: z
    .object({
      id: z.string(),
      code: z.string(),
      name: z.string(),
      category: z.string(),
      model: z.enum(["print", "unit"]),
      unitLabel: z.string(),
      version: z.number().int().positive(),
    })
    .optional(),
  materialSuggestions: z.array(recipeSchema).optional(),
});
export type OrderLine = z.infer<typeof lineSchema>;
export const productionStates = [
  "New",
  "In Progress",
  "Ready",
  "Completed",
] as const;
export const orderSchema = z.object({
  id: z.string(),
  branchId: branchIdSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  actorId: z.string(),
  customer: customerSchema,
  customerId: z.string().nullable().optional(),
  materialPlan: materialPlanSchema.optional(),
  lines: z.array(lineSchema).min(1).max(30),
  totalCents: centsSchema,
  production: z.enum(productionStates),
  notes: z.string().max(1000),
});
export type Order = z.infer<typeof orderSchema>;
export const paymentSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  amountCents: centsSchema.refine((n) => n > 0),
  createdAt: z.string().datetime(),
  actorId: z.string(),
  note: z.string().max(200),
});
export type Payment = z.infer<typeof paymentSchema>;
export const branchSchema = z.object({
  id: branchIdSchema,
  name: z.string().trim().min(1).max(50),
  location: z.string().trim().min(1).max(100),
});
export type Branch = z.infer<typeof branchSchema>;
export const userSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1).max(60),
  role: z.enum(["cashier", "admin"]),
  branchId: branchIdSchema.nullable(),
  active: z.boolean(),
});
export type DemoUser = z.infer<typeof userSchema>;
export const stockItemSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1).max(100),
  sku: z.string().trim().min(1).max(30),
  unit: z.string().trim().min(1).max(30),
  active: z.boolean(),
  quantities: z.object({ b1: countSchema, b2: countSchema }),
  thresholds: z.object({ b1: countSchema, b2: countSchema }),
});
export type StockItem = z.infer<typeof stockItemSchema>;
export const movementSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  branchId: branchIdSchema,
  delta: z.number().int().min(-10_000_000).max(10_000_000),
  reason: z.string(),
  createdAt: z.string().datetime(),
  actorId: z.string(),
  transferId: z.string().nullable(),
  usageId: z.string().optional(),
  orderId: z.string().optional(),
  lineId: z.string().optional(),
  unit: z.string().optional(),
  before: countSchema.optional(),
  after: countSchema.optional(),
  serviceName: z.string().optional(),
});
export type StockMovement = z.infer<typeof movementSchema>;
export const transferSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  source: branchIdSchema,
  target: branchIdSchema,
  quantity: countSchema.refine((n) => n > 0),
  createdAt: z.string().datetime(),
  actorId: z.string(),
  note: z.string(),
});
export type Transfer = z.infer<typeof transferSchema>;
export const auditSchema = z.object({
  id: z.string(),
  actorId: z.string(),
  action: z.string(),
  detail: z.string(),
  createdAt: z.string().datetime(),
});
export const smsConfigSchema = z.object({
  phone: phoneSchema,
  cutoff: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  enabled: z.literal(false),
});
export type SmsConfig = z.infer<typeof smsConfigSchema>;
export const legacyDataSchema = z.object({
  version: z.literal(1),
  revision: z.number().int().min(0),
  sessionId: z.string().nullable(),
  branches: z.array(branchSchema).length(2),
  users: z.array(userSchema).length(3),
  pricing: pricingSchema,
  orders: z.array(orderSchema).max(10000),
  payments: z.array(paymentSchema).max(30000),
  items: z.array(stockItemSchema).max(1000),
  movements: z.array(movementSchema).max(30000),
  transfers: z.array(transferSchema).max(10000),
  audit: z.array(auditSchema).max(30000),
  settings: z.object({
    shopName: z.string().trim().min(1).max(60),
    receiptNote: z.string().max(200),
    sms: smsConfigSchema,
  }),
  preferences: z.object({ compact: z.boolean(), reduceMotion: z.boolean() }),
});
export const demoDataSchema = legacyDataSchema.extend({
  version: z.literal(2),
  customers: z.array(savedCustomerSchema).max(10000),
  categories: z.array(categorySchema).max(100),
  services: z.array(serviceSchema).max(1000),
  usages: z.array(usageSchema).max(30000),
});
export type DemoData = z.infer<typeof demoDataSchema>;
export type ErrorCode =
  | "validation"
  | "permission"
  | "missing"
  | "duplicate"
  | "conflict"
  | "storage";
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: ErrorCode; message: string } };
export class DomainError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "DomainError";
  }
}
export type OrderCommand =
  | {
      type: "create-order";
      requestId: string;
      branchId: BranchId;
      customer: z.infer<typeof customerSchema>;
      customerId?: string | null;
      lines: LineInput[];
      notes: string;
      advanceCents: number;
    }
  | {
      type: "payment";
      requestId: string;
      orderId: string;
      amountCents: number;
      note: string;
    }
  | {
      type: "production";
      requestId: string;
      orderId: string;
      next: Order["production"];
    }
  | {
      type: "order-info";
      requestId: string;
      orderId: string;
      customer: z.infer<typeof customerSchema>;
      notes: string;
    };
export type InventoryValues = Pick<
  StockItem,
  "name" | "sku" | "unit" | "thresholds"
>;
export type InventoryCommand =
  | {
      type: "stock-item";
      requestId: string;
      itemId: string | null;
      values: InventoryValues;
      opening: { b1: number; b2: number };
    }
  | { type: "stock-active"; requestId: string; itemId: string; active: boolean }
  | {
      type: "stock-adjust";
      requestId: string;
      itemId: string;
      branchId: BranchId;
      delta: number;
      reason: string;
    };
export type TransferCommand = {
  type: "transfer";
  requestId: string;
  itemId: string;
  source: BranchId;
  target: BranchId;
  quantity: number;
  note: string;
};
export type PriceCommand = {
  type: "pricing";
  requestId: string;
  expectedVersion: number;
  values: Omit<Pricing, "version">;
};
export type SmsCommand = {
  type: "sms-config";
  requestId: string;
  values: SmsConfig;
};
export type SettingsValues = {
  shopName: string;
  receiptNote: string;
  branches: Branch[];
  users: Pick<DemoUser, "id" | "name" | "active">[];
};
export type SettingsCommand =
  | { type: "application-settings"; requestId: string; values: SettingsValues }
  | { type: "preferences"; requestId: string; values: DemoData["preferences"] };
export type Command =
  | ServiceCommand
  | CustomerCommand
  | OrderCommand
  | InventoryCommand
  | TransferCommand
  | PriceCommand
  | SmsCommand
  | SettingsCommand;
