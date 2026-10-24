"use client";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, type Order } from "@/domain/model";
import { useCommand, requestId } from "@/data/provider";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Field, Notice } from "@/components/shared/presentation";
const schema=z.object({customer:customerSchema,notes:z.string().max(1000)});
type Values=z.infer<typeof schema>;
export function EditOrderDrawer({order,onClose}:{order:Order;onClose:()=>void}) {
  const command=useCommand();const [id]=useState(requestId);const form=useForm<Values>({resolver:zodResolver(schema),defaultValues:{customer:order.customer,notes:order.notes}});
  return <Sheet open onOpenChange={open=>{if(!open)onClose();}} title={`Edit order · ${order.id}`} description="Update optional customer information and handover notes." dirty={form.formState.isDirty} footer={<><SheetClose asChild><Button variant="outline">Cancel</Button></SheetClose><Button type="submit" form="edit-order-form" disabled={command.pending}>Save order information</Button></>}><form id="edit-order-form" className="stack" noValidate onSubmit={form.handleSubmit(async values=>{const r=await command.run({type:"order-info",requestId:id,orderId:order.id,...values},"Order information saved.");if(r.ok)onClose();})}><Notice>Saved price snapshots and payment events are read-only. Financial changes and cancellation need an approved business policy.</Notice><Field label="Customer name (optional)" id="edit-customer-name" error={form.formState.errors.customer?.name?.message}><input id="edit-customer-name" className="input" {...form.register("customer.name")} maxLength={100}/></Field><Field label="Contact number (optional)" id="edit-customer-phone" error={form.formState.errors.customer?.phone?.message}><input type="tel" id="edit-customer-phone" className="input" {...form.register("customer.phone")} aria-invalid={!!form.formState.errors.customer?.phone} aria-describedby={form.formState.errors.customer?.phone?"edit-customer-phone-error":undefined}/></Field><Field label="Order instructions (optional)" id="edit-order-notes" error={form.formState.errors.notes?.message}><textarea id="edit-order-notes" className="textarea" {...form.register("notes")} maxLength={1000}/></Field>{command.error&&<Notice tone="error">{command.error}</Notice>}</form></Sheet>;
}
