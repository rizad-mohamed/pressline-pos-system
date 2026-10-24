"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CheckCircle2, X } from "lucide-react";
import { createDemoRepository, type Snapshot } from "./repository";
import type { Command, DemoData, DemoUser, Result, Scope } from "@/domain/model";
import { Button } from "@/components/ui/button";
const repository = createDemoRepository(() => window.localStorage);
type DemoContext = Snapshot & {
  user: DemoUser | null; scope: Scope; setScope: (scope: Scope) => void;
  execute: (command: Command, message: string) => Promise<Result<DemoData>>;
  enter: (id: string | null) => Result<DemoData>; reset: () => Result<DemoData>;
  notify: (message: string) => void;
};
const Context = createContext<DemoContext | null>(null);
export function DemoProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(repository.subscribe,repository.getSnapshot,repository.getServerSnapshot);
  const [scope,setScope] = useState<Scope>("all"); const [toast,setToast]=useState(""); const timer=useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(()=>{repository.hydrate();return()=>{if(timer.current)clearTimeout(timer.current);};},[]);
  useEffect(()=>{document.documentElement.classList.toggle("reduce-motion",snapshot.data?.preferences.reduceMotion??false);},[snapshot.data?.preferences.reduceMotion]);
  const notify=useCallback((message:string)=>{setToast(message);if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setToast(""),6500);},[]);
  const execute=useCallback(async(command:Command,message:string)=>{const result=await repository.execute(command);if(result.ok)notify(message);return result;},[notify]);
  const user=snapshot.data?.users.find(u=>u.id===snapshot.data!.sessionId&&u.active)??null;
  function reset() { const result=repository.reset();if(result.ok){try{window.sessionStorage.removeItem("pressline.draft.v1");}catch{}notify("Demo fixtures restored. All local demonstration changes were reset.");}return result; }
  return <Context.Provider value={{...snapshot,user,scope:user?.role==="cashier"?user.branchId!:scope,setScope,execute,enter:repository.enter,reset,notify}}><div className={`${snapshot.data?.preferences.compact?"density-compact":""} ${snapshot.data?.preferences.reduceMotion?"reduce-motion":""}`}>{children}</div>{toast&&<div className="toast" role="status"><CheckCircle2 size={20} style={{color:"var(--success)"}} /><p>{toast}</p><Button variant="ghost" size="icon" aria-label="Dismiss notification" onClick={()=>setToast("")}><X size={16} /></Button></div>}</Context.Provider>;
}
export function useDemoState() {const value=useContext(Context);if(!value)throw new Error("DemoProvider is required.");return value;}
export function useDemo() {const value=useDemoState();if(!value.data||!value.user)throw new Error("Choose a demo account to use the workspace.");return {...value,data:value.data,user:value.user};}
export function useCommand() {
  const {execute}=useDemo();const [pending,setPending]=useState(false);const [error,setError]=useState("");const lock=useRef(false);
  async function run(command:Command,message:string):Promise<Result<DemoData>>{
    if(lock.current)return {ok:false,error:{code:"duplicate",message:"Please wait for the current save."}};
    lock.current=true;setPending(true);setError("");
    try{const result=await execute(command,message);if(!result.ok)setError(result.error.message);return result;}finally{lock.current=false;setPending(false);}
  }
  return {run,pending,error,setError};
}
export const requestId=()=>crypto.randomUUID();
