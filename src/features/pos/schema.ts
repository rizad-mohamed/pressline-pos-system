import { z } from "zod";
import { branchIdSchema, customerSchema, lineInputSchema, type Pricing } from "@/domain/model";
import { money } from "@/domain/money";
import { quoteOrder } from "@/domain/pricing";
export const orderFormBase = z.object({ branchId:branchIdSchema, customer:customerSchema, lines:z.array(lineInputSchema).min(1).max(30), notes:z.string().trim().max(1000), advance:z.string() });
export type OrderFormValues = z.infer<typeof orderFormBase>;
export function orderFormSchema(pricing:Pricing) {return orderFormBase.superRefine((values,ctx)=>{try{if(money(values.advance)>quoteOrder(values.lines,pricing).totalCents)ctx.addIssue({code:"custom",path:["advance"],message:"Advance cannot exceed the order total."});}catch{ctx.addIssue({code:"custom",path:["advance"],message:"Enter a non-negative amount with at most two decimal places."});}});}
