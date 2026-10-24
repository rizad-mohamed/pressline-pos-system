import { test, expect } from "vitest";
import { createDemoRepository, STORAGE_KEY } from "./repository";
import { blankLine } from "@/domain/pricing";
import type { PosRepository } from "./contracts";
function memory() { const values=new Map<string,string>();return {getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>{values.set(k,v);},removeItem:(k:string)=>{values.delete(k);}}; }
test("persistence reload, schema recovery and reliable fixture reset",async()=>{
  const storage=memory(),repo=createDemoRepository(()=>storage);repo.hydrate();expect(repo.enter("cashier-b1").ok).toBe(true);
  const before=repo.getSnapshot().data!.orders.length;
  const result=await repo.execute({type:"create-order",requestId:"persist-order",branchId:"b1",customer:{name:"",phone:""},lines:[blankLine()],notes:"",advanceCents:0});expect(result.ok).toBe(true);
  const second=createDemoRepository(()=>storage);second.hydrate();expect(second.getSnapshot().data!.orders.length).toBe(before+1);expect(second.reset().ok).toBe(true);expect(second.getSnapshot().data!.orders.length).toBe(before);
  storage.setItem(STORAGE_KEY,'{"version":99}');const broken=createDemoRepository(()=>storage);broken.hydrate();expect(broken.getSnapshot().recoveryRequired).toBe(true);expect(broken.enter("admin").ok).toBe(false);expect(storage.getItem(STORAGE_KEY)).toBe('{"version":99}');expect(broken.reset().ok).toBe(true);
});
test("failed durable save does not mutate state or claim success",async()=>{
  const storage=memory(),repo=createDemoRepository(()=>storage);repo.hydrate();repo.enter("cashier-b1");const before=repo.getSnapshot().data;
  storage.setItem=()=>{throw new Error("quota");};const result=await repo.execute({type:"create-order",requestId:"quota-order",branchId:"b1",customer:{name:"",phone:""},lines:[blankLine()],notes:"",advanceCents:0});expect(result.ok).toBe(false);expect(repo.getSnapshot().data).toBe(before);
});
test("stale revision in a second tab is rejected",()=>{const storage=memory(),a=createDemoRepository(()=>storage),b=createDemoRepository(()=>storage);a.hydrate();a.enter("cashier-b1");b.hydrate();b.enter("admin");const r=a.enter("cashier-b2");expect(r.ok).toBe(false);if(!r.ok)expect(r.error.code).toBe("conflict");});
test("mock adapter implements the same typed read/command contract without accepting caller roles",async()=>{const storage=memory(),mock=createDemoRepository(()=>storage);const port:PosRepository=mock;const result=await port.read();expect(result.ok).toBe(true);mock.enter("cashier-b1");const created=await port.execute({type:"create-order",requestId:"contract-order",branchId:"b1",customer:{name:"",phone:""},lines:[blankLine()],notes:"",advanceCents:0});expect(created.ok).toBe(true);if(created.ok)expect(created.data.orders[0].id).toBe("PL-1013");});
