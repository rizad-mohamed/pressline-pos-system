"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Building2, ShieldCheck } from "lucide-react";
import { useDemoState } from "@/data/provider";
import { Badge, Notice, SkeletonPage } from "@/components/shared/presentation";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/shared/brand";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
export function Login() {
  const { data, enter, reset, issue, user, recoveryRequired } = useDemoState();
  const router = useRouter();
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  return (
    <main className="login-page">
      <section className="login-story" aria-label="About Pressline">
        <Brand />
        <div>
          <Badge tone="primary">THE PRINT SHOP WORKSPACE</Badge>
          <h1>
            Every detail.
            <br />
            Every impression.
          </h1>
          <p>
            From the first print to the final handover. Keep orders, production,
            and both branches in view.
          </p>
          <div className="print-specimen" aria-hidden="true">
            <span className="specimen-fold" />
            <span className="specimen-title">
              Made to
              <br />
              make an impression.
            </span>
            <span className="specimen-rule" />
            <span className="specimen-caption">PRESSLINE / PRINT & FINISH</span>
            <span className="specimen-registration">+</span>
          </div>
          <div
            className="row login-facts"
            style={{ marginTop: "var(--space-8)" }}
          >
            <Badge>2 branches</Badge>
            <Badge>LKR</Badge>
            <Badge>Asia/Colombo</Badge>
          </div>
        </div>
        <footer className="small muted">
          Provisional identity · Fictional demonstration business
        </footer>
      </section>
      <section className="login-content">
        <div className="login-panel stack">
          <div>
            <div className="eyebrow" style={{ marginBottom: "var(--space-2)" }}>
              WELCOME TO PRESSLINE
            </div>
            <h2 style={{ fontSize: "var(--text-2xl)" }}>
              Choose your workspace
            </h2>
            <p className="muted" style={{ marginTop: "var(--space-2)" }}>
              Select a demo account to explore the full workflow.
            </p>
          </div>
          <Notice>
            Frontend demo only. No passwords, real payments, or live messages.
            Enter fictional customer information only.
          </Notice>
          {!data ? (
            <SkeletonPage />
          ) : (
            <div className="stack" style={{ gap: "var(--space-3)" }}>
              {data.users.map((account) => (
                <button
                  className="account-card"
                  key={account.id}
                  disabled={!account.active || recoveryRequired}
                  onClick={() => {
                    const result = enter(account.id);
                    if (result.ok) router.push("/dashboard");
                    else setError(result.error.message);
                  }}
                >
                  <div className="avatar">
                    {account.role === "admin" ? (
                      <ShieldCheck size={20} />
                    ) : (
                      <Building2 size={20} />
                    )}
                  </div>
                  <div className="grow">
                    <strong>{account.name}</strong>
                    <small>
                      {account.role === "admin"
                        ? "Administrator · All branches"
                        : `${data.branches.find((b) => b.id === account.branchId)!.name} · ${data.branches.find((b) => b.id === account.branchId)!.location.split(" · ")[0]}`}
                    </small>
                  </div>
                  <ArrowRight size={18} />
                </button>
              ))}
            </div>
          )}
          {error && <Notice tone="error">{error}</Notice>}
          {issue && (
            <>
              <Notice tone="error">{issue}</Notice>
              <Button variant="danger" onClick={() => setConfirm(true)}>
                Reset invalid demo data
              </Button>
            </>
          )}
          {user && !recoveryRequired && (
            <Link href="/dashboard" className="text-link">
              Continue as {user.name} →
            </Link>
          )}
          <p className="small muted">
            Changes are saved in this browser only. Demo role restrictions are
            not production authorization.
          </p>
        </div>
      </section>
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Reset saved demonstration data?"
        description="Replace all local demo orders, payments, inventory and configuration with fictional fixtures. Invalid saved data will be overwritten."
        action="Reset demo data"
        onConfirm={() => {
          const r = reset();
          if (!r.ok) setError(r.error.message);
        }}
      />
    </main>
  );
}
