import type { Command, DemoData, DemoUser } from "./model";
import { applyOrderCommand } from "./orders";
import { applyInventoryCommand } from "./inventory";
import { applyTransfer } from "./transfers";
import { applyPriceSettings } from "./price-settings";
import { applySmsConfig } from "./sms";
import { applySettings } from "./settings";
import { applyCustomerCommand } from "./customers";
export function executeCommand(
  data: DemoData,
  user: DemoUser,
  command: Command,
  now: string,
): DemoData {
  switch (command.type) {
    case "customer-save":
    case "customer-active":
    case "link-customer":
      return applyCustomerCommand(data, user, command, now);
    case "application-settings":
    case "preferences":
      return applySettings(data, user, command, now);
    case "sms-config":
      return applySmsConfig(data, user, command, now);
    case "pricing":
      return applyPriceSettings(data, user, command, now);
    case "transfer":
      return applyTransfer(data, user, command, now);
    case "stock-item":
    case "stock-active":
    case "stock-adjust":
      return applyInventoryCommand(data, user, command, now);
    default:
      return applyOrderCommand(data, user, command, now);
  }
}
