import { smsConfigSchema,type DemoData,type DemoUser,type SmsCommand } from "./model";
import { assertAdmin,mutate } from "./orders";
export function applySmsConfig(data:DemoData,user:DemoUser,c:SmsCommand,now:string):DemoData {
  assertAdmin(user);const config=smsConfigSchema.parse(c.values);
  return mutate(data,user,c.requestId,"SMS preview settings updated","Demo recipient and reporting cutoff only; live delivery remains disabled",now,draft=>{draft.settings.sms=config;});
}
