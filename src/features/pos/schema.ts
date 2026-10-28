import { z } from "zod";
import {
  branchIdSchema,
  customerSchema,
  lineInputSchema,
  type Pricing,
} from "@/domain/model";
import { money } from "@/domain/money";
import { quoteOrder, type Catalogue } from "@/domain/pricing";
export const orderFormBase = z.object({
  branchId: branchIdSchema,
  customer: customerSchema,
  customerId: z.string().nullable().optional(),
  lines: z.array(lineInputSchema).min(1).max(30),
  notes: z.string().trim().max(1000),
  advance: z.string(),
});
// An empty tab draft is valid UI state; saving still requires at least one item.
export const orderDraftSchema = orderFormBase.extend({
  lines: z.array(lineInputSchema).max(30),
});
export type OrderFormValues = z.infer<typeof orderFormBase>;
export function orderFormSchema(pricing: Pricing, catalogue?: Catalogue) {
  return orderFormBase.superRefine((values, ctx) => {
    let advance: number;
    try {
      advance = money(values.advance);
    } catch {
      ctx.addIssue({
        code: "custom",
        path: ["advance"],
        message: "Enter a non-negative amount with at most two decimal places.",
      });
      return;
    }
    try {
      if (advance > quoteOrder(values.lines, pricing, catalogue).totalCents)
        ctx.addIssue({
          code: "custom",
          path: ["advance"],
          message: "Advance cannot exceed the order total.",
        });
    } catch (error) {
      ctx.addIssue({
        code: "custom",
        path: ["lines"],
        message:
          error instanceof Error
            ? error.message
            : "Check service configurations and quantities.",
      });
    }
  });
}
