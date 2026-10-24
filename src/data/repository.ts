import { z } from "zod";
import { DomainError, type Command, type DemoData, type Result } from "@/domain/model";
import { executeCommand } from "@/domain/commands";
import { seedData } from "./seed";
import { validateData } from "./validation";
import type { DemoRepository, RepositorySnapshot } from "./contracts";
export const STORAGE_KEY = "pressline.demo.v1";
export type StoragePort = Pick<Storage,"getItem" | "setItem" | "removeItem">;
export type Snapshot = RepositorySnapshot;
const serverSnapshot: Snapshot = {data:null,issue:null,recoveryRequired:false};
export function friendlyError(error: unknown): { code: "validation" | "permission" | "missing" | "duplicate" | "conflict" | "storage"; message: string } {
  if(error instanceof DomainError) return {code:error.code,message:error.message};
  if(error instanceof z.ZodError) return {code:"validation",message:error.issues.map(i=>i.message).join(" ")};
  return {code:"storage",message:error instanceof Error?error.message:"The local demo operation failed. Retry or reset the fixtures."};
}
export function createDemoRepository(storage: () => StoragePort, now = () => new Date().toISOString()): DemoRepository {
  let snapshot = serverSnapshot; let hydrated = false; let busy = false;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach(fn=>fn());
  function hydrate() {
    if(hydrated) return; hydrated = true;
    try { const raw=storage().getItem(STORAGE_KEY); snapshot={data:raw?validateData(JSON.parse(raw)):seedData(),issue:null,recoveryRequired:false}; }
    catch { snapshot={data:seedData(),issue:"Saved demo data could not be validated. Fixtures are shown read-only until you reset the demo. Existing saved data has not been overwritten.",recoveryRequired:true}; }
    emit();
  }
  function persist(next: DemoData, allowRecovery = false): Result<DemoData> {
    try {
      if(snapshot.recoveryRequired && !allowRecovery) throw new DomainError("storage","Reset invalid saved demo data before recording changes.");
      const checked=validateData(next); const raw=storage().getItem(STORAGE_KEY);
      if(!allowRecovery && raw) { const current=validateData(JSON.parse(raw)); if(snapshot.data && current.revision!==snapshot.data.revision) throw new DomainError("conflict","Another tab changed this demo. Reload to review those changes before saving."); }
      storage().setItem(STORAGE_KEY,JSON.stringify(checked));
      snapshot={data:checked,issue:null,recoveryRequired:false}; emit(); return {ok:true,data:checked};
    } catch(error) { const e=friendlyError(error); return {ok:false,error:{...e,message:e.code==="storage"?"Local save failed. Your previous saved data and entered form are preserved. Check browser storage and retry.":e.message}}; }
  }
  return {
    hydrate, getSnapshot:()=>snapshot, getServerSnapshot:()=>serverSnapshot,
    async read(): Promise<Result<DemoData>> { hydrate(); if(snapshot.recoveryRequired||!snapshot.data)return {ok:false,error:{code:"storage",message:snapshot.issue??"Demo data is not available."}};return {ok:true,data:snapshot.data}; },
    subscribe:(fn:()=>void)=>{listeners.add(fn);return ()=>{listeners.delete(fn);};},
    async execute(command: Command): Promise<Result<DemoData>> {
      if(busy) return {ok:false,error:{code:"duplicate",message:"An action is already being saved."}};
      busy=true;
      try { if(!snapshot.data) throw new DomainError("storage","Wait for the demo to finish loading."); const user=snapshot.data.users.find(u=>u.id===snapshot.data!.sessionId&&u.active); if(!user) throw new DomainError("permission","Choose a demo account first.");
        return persist(executeCommand(snapshot.data,user,command,now()));
      } catch(error) { return {ok:false,error:friendlyError(error)}; } finally {busy=false;}
    },
    enter(userId: string | null): Result<DemoData> { if(!snapshot.data) return {ok:false,error:{code:"storage",message:"Wait for the demo to load."}}; if(userId && !snapshot.data.users.some(u=>u.id===userId&&u.active)) return {ok:false,error:{code:"permission",message:"This demo account is inactive."}}; return persist({...snapshot.data,sessionId:userId,revision:snapshot.data.revision+1}); },
    reset(): Result<DemoData> { const fresh=seedData(); fresh.sessionId=snapshot.data?.sessionId??null; return persist(fresh,true); },
  };
}
