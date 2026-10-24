import { z } from "zod";
import { branchIdSchema, countSchema, stockItemSchema, DomainError, type DemoData, type DemoUser, type InventoryCommand } from "./model";
import { assertAdmin, mutate } from "./orders";
export const inventoryValuesSchema=stockItemSchema.pick({name:true,sku:true,unit:true,thresholds:true});
export function applyInventoryCommand(data:DemoData,user:DemoUser,c:InventoryCommand,now:string):DemoData {
  assertAdmin(user);
  if(c.type==="stock-item"){
    const values=inventoryValuesSchema.parse(c.values);const opening=z.object({b1:countSchema,b2:countSchema}).parse(c.opening);
    if(data.items.some(i=>i.id!==c.itemId&&i.sku.toLowerCase()===values.sku.toLowerCase()))throw new DomainError("validation","This SKU already exists. Use a unique material code, including inactive items.");
    if(c.itemId){const item=data.items.find(i=>i.id===c.itemId);if(!item)throw new DomainError("missing","Material not found. Refresh inventory.");if(opening.b1||opening.b2)throw new DomainError("validation","Use a stock adjustment to change an existing balance.");if(item.unit!==values.unit)throw new DomainError("validation","Existing units cannot be converted in this demo. Create a separate material instead.");
      return mutate(data,user,c.requestId,"Material updated",values.name,now,draft=>{Object.assign(draft.items.find(i=>i.id===c.itemId)!,values);});
    }
    const id=`item-${c.requestId}`;
    return mutate(data,user,c.requestId,"Material created",values.name,now,draft=>{draft.items.unshift({id,...values,active:true,quantities:opening});for(const branchId of ["b1","b2"] as const)if(opening[branchId]>0)draft.movements.unshift({id:`opening-${c.requestId}-${branchId}`,itemId:id,branchId,delta:opening[branchId],reason:"Demonstration opening balance",createdAt:now,actorId:user.id,transferId:null});});
  }
  const item=data.items.find(i=>i.id===c.itemId);if(!item)throw new DomainError("missing","Material not found. Refresh inventory.");
  if(c.type==="stock-active")return mutate(data,user,c.requestId,c.active?"Material reactivated":"Material deactivated",item.name,now,draft=>{draft.items.find(i=>i.id===item.id)!.active=z.boolean().parse(c.active);});
  branchIdSchema.parse(c.branchId);if(!item.active)throw new DomainError("validation","Reactivate this material before recording stock changes.");
  z.number().int().min(-10_000_000).max(10_000_000).refine(n=>n!==0,"Enter a nonzero adjustment.").parse(c.delta);
  const reason=z.string().trim().min(3,"Describe why stock is changing (at least 3 characters).").max(200).parse(c.reason);
  if(item.quantities[c.branchId]+c.delta<0)throw new DomainError("validation","This adjustment would make stock negative. Reduce the removal quantity.");
  countSchema.parse(item.quantities[c.branchId]+c.delta);
  return mutate(data,user,c.requestId,"Stock adjusted",`${item.name}: ${c.delta>0?"+":""}${c.delta} ${item.unit}`,now,draft=>{draft.items.find(i=>i.id===item.id)!.quantities[c.branchId]+=c.delta;draft.movements.unshift({id:`move-${c.requestId}`,itemId:item.id,branchId:c.branchId,delta:c.delta,reason,createdAt:now,actorId:user.id,transferId:null});});
}
