import type { Command,DemoData,DemoUser } from "./model";
import { applyOrderCommand } from "./orders";
import { applyInventoryCommand } from "./inventory";
export function executeCommand(data:DemoData,user:DemoUser,command:Command,now:string):DemoData {
  switch(command.type){case "stock-item":case "stock-active":case "stock-adjust":return applyInventoryCommand(data,user,command,now);default:return applyOrderCommand(data,user,command,now);}
}
