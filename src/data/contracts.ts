import type { Command, DemoData, DemoUser, Result } from "@/domain/model";
/** Future remote adapter must use authenticated server identity, not trust this demo user ID. */
export interface PosRepository {
  read(): Promise<Result<DemoData>>;
  execute(actor: DemoUser, command: Command): Promise<Result<DemoData>>;
  subscribe(onChange: () => void): () => void;
}
export interface RealtimeContract { start(branchIds: string[], invalidate: () => void): Promise<() => void>; reconcile(): Promise<Result<DemoData>>; }
export interface PrintJob { orderId: string; branchId: string; production: DemoData["orders"][number]["production"]; lineIds: string[]; }
export interface SmsPreview { status: "NOT SENT"; text: string; cutoff: string; recipient: string; }
