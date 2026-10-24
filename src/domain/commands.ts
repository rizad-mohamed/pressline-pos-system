import type { Command,DemoData,DemoUser } from "./model";
import { applyOrderCommand } from "./orders";
import { applyInventoryCommand } from "./inventory";
import { applyTransfer } from "./transfers";
import { applyPriceSettings } from "./price-settings";
export function executeCommand(data:DemoData,user:DemoUser,command:Command,now:string):DemoData {
  switch(command.type){case "pricing":return applyPriceSettings(data,user,command,now);case "transfer":return applyTransfer(data,user,command,now);case "stock-item":case "stock-active":case "stock-adjust":return applyInventoryCommand(data,user,command,now);default:return applyOrderCommand(data,user,command,now);}
}
