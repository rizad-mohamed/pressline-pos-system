import type { Command, DemoData, DemoUser, Result } from "@/domain/model";
/** The adapter owns identity context. A future remote adapter must derive it from trusted authentication. */
export interface PosRepository {
  read(): Promise<Result<DemoData>>;
  execute(command: Command): Promise<Result<DemoData>>;
  subscribe(onChange: () => void): () => void;
}
export interface RepositorySnapshot { data: DemoData | null; issue: string | null; recoveryRequired: boolean; }
export interface DemoRepository extends PosRepository {
  hydrate(): void;
  getSnapshot(): RepositorySnapshot;
  getServerSnapshot(): RepositorySnapshot;
  enter(userId: string | null): Result<DemoData>;
  reset(): Result<DemoData>;
}
export interface UserSession { user: DemoUser; mode: "demo" | "authenticated"; expiresAt: string | null; }
export interface FutureIdentityPort { current(): Promise<Result<UserSession | null>>; signOut(): Promise<Result<null>>; }
export interface RealtimeContract { start(branchIds: string[], invalidate: () => void): Promise<() => void>; reconcile(): Promise<Result<DemoData>>; }
export interface PrintJob { orderId: string; branchId: string; production: DemoData["orders"][number]["production"]; lineIds: string[]; }
export interface SmsPreview { status: "NOT SENT"; text: string; cutoff: string; recipient: string; }
