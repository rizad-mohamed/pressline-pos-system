import { expect, test } from "vitest";
import { seedData } from "@/data/seed";
import { blankLine } from "@/domain/pricing";
import { orderFormSchema } from "./schema";
test("POS validates branch, optional contact and advance beside their fields",()=>{
  const schema=orderFormSchema(seedData().pricing),valid={branchId:"b1",customer:{name:"",phone:""},lines:[blankLine()],notes:"",advance:"0.00"};
  expect(schema.safeParse(valid).success).toBe(true);
  for(const values of [{...valid,branchId:"all"},{...valid,advance:"16.00"},{...valid,advance:"-1"},{...valid,customer:{name:"",phone:"abc"}}])expect(schema.safeParse(values).success).toBe(false);
  const invalid=schema.safeParse({...valid,advance:"16"});if(!invalid.success)expect(invalid.error.issues[0].path).toEqual(["advance"]);
});
