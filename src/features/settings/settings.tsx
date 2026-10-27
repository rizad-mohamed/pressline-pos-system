"use client";
import { ScrollTable } from "@/components/shared/scroll-table";
import { useState } from "react";
import { Building2, Pencil, RotateCcw, ShieldCheck } from "lucide-react";
import { useDemo } from "@/data/provider";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Badge, Notice, PageHeader } from "@/components/shared/presentation";
import { SettingsDrawer } from "./settings-drawer";
export function SettingsPage() {
  const { data, reset } = useDemo();
  const [open, setOpen] = useState(false),
    [confirm, setConfirm] = useState(false),
    [error, setError] = useState("");
  return (
    <div className="stack settings-page">
      <PageHeader
        eyebrow="DEMONSTRATION CONFIGURATION"
        title="Settings"
        description="Keep branch context clear, and manage your local demo dataset."
        action={
          <Button onClick={() => setOpen(true)}>
            <Pencil size={16} />
            Edit demo configuration
          </Button>
        }
      />
      <section className="card">
        <div className="card-header">
          <div className="row">
            <Building2 size={18} />
            <h2>Shop & branches</h2>
          </div>
          <Badge>Two fixed branches</Badge>
        </div>
        <div className="card-body stack">
          <div>
            <p className="eyebrow">Receipt and SMS shop name</p>
            <h2>{data.settings.shopName}</h2>
          </div>
          <div className="summary-grid">
            {data.branches.map((branch) => (
              <div className="line-card" key={branch.id}>
                <h3>{branch.name}</h3>
                <p className="muted">{branch.location}</p>
                <p className="small muted">
                  Reference {branch.id} · LKR · Asia/Colombo
                </p>
              </div>
            ))}
          </div>
          <p className="small muted">
            Receipt note: {data.settings.receiptNote}
          </p>
        </div>
      </section>
      <section className="card">
        <div className="card-header">
          <div className="row">
            <ShieldCheck size={18} />
            <h2>Team & demo access</h2>
          </div>
          <Badge>UI restrictions only</Badge>
        </div>
        <ScrollTable
          className="table-scroll"
          tabIndex={0}
          aria-label="Scrollable data table"
        >
          <table>
            <caption className="sr-only">
              Fixed demonstration accounts and their role/branch context
            </caption>
            <thead>
              <tr>
                <th>Demo account</th>
                <th>Role</th>
                <th>Branch scope</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((account) => (
                <tr key={account.id}>
                  <td className="table-title">
                    {account.name}
                    <p className="table-sub">{account.id} · no password</p>
                  </td>
                  <td>
                    {account.role === "admin" ? "Administrator" : "Cashier"}
                  </td>
                  <td>
                    {account.branchId
                      ? data.branches.find((b) => b.id === account.branchId)!
                          .name
                      : "All branches"}
                  </td>
                  <td>
                    <Badge tone={account.active ? "success" : "neutral"}>
                      {account.active ? "Available" : "Inactive"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollTable>
        <div className="card-body">
          <Notice>
            Real account creation, invitations, password recovery, authorization
            and secure audit logging require the future backend. No independent
            Owner role is defined.
          </Notice>
        </div>
      </section>
      <section className="card card-body stack">
        <h2>Local demo data</h2>
        <p className="muted">
          {data.orders.length} orders · {data.payments.length} simulated payment
          events · {data.items.length} materials · {data.transfers.length}{" "}
          transfers
        </p>
        <p>
          Reset replaces only Pressline&apos;s demo records and tab draft with
          fictional fixtures. It resets prices, branch/team labels, SMS preview
          settings and display preferences. The current demo account remains
          selected.
        </p>
        <div>
          <Button variant="danger" onClick={() => setConfirm(true)}>
            <RotateCcw size={16} />
            Reset demonstration data
          </Button>
        </div>
        <p className="small muted">
          No real orders, transactions or cloud data exist. No cross-device or
          automatic offline synchronization is provided.
        </p>
      </section>
      {error && <Notice tone="error">{error}</Notice>}
      {open && <SettingsDrawer onClose={() => setOpen(false)} />}
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Reset all local demonstration data?"
        description="All locally saved demo orders, payments, inventory changes, transfers, price edits, settings and tab drafts will be replaced by the fictional starting dataset. This cannot restore your current demo changes afterward."
        action="Reset to fictional fixtures"
        onConfirm={() => {
          const r = reset();
          if (!r.ok) setError(r.error.message);
          else setError("");
        }}
      />
    </div>
  );
}
