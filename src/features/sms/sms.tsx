"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Settings, MessageSquare, Send } from "lucide-react";
import { useDemo, useCommand, requestId } from "@/data/provider";
import { smsConfigSchema, type SmsConfig } from "@/domain/model";
import { businessDate, cutoffInstant, dateSchema } from "@/domain/dates";
import { report, smsSummary } from "@/domain/reports";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import {
  Badge,
  Field,
  Notice,
  PageHeader,
} from "@/components/shared/presentation";
import { Money } from "@/components/shared/domain-display";
export function SmsPage() {
  const { data } = useDemo();
  const [configOpen, setConfigOpen] = useState(false),
    [date, setDate] = useState(businessDate()),
    [cutoff, setCutoff] = useState(data.settings.sms.cutoff),
    [preview, setPreview] = useState({
      date: businessDate(),
      cutoff: data.settings.sms.cutoff,
    }),
    [error, setError] = useState(""),
    [copied, setCopied] = useState(false);
  const instant = cutoffInstant(preview.date, preview.cutoff),
    text = smsSummary(data, preview.date, instant),
    summary = report(data, {
      from: preview.date,
      to: preview.date,
      scope: "all",
      cutoff: instant,
    });
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError("");
    } catch {
      setError(
        "Copy was unavailable. Select the message preview and use your browser's Copy command. No message was sent.",
      );
    }
  }
  return (
    <div className="stack">
      <PageHeader
        eyebrow="DAILY SUMMARY · PREVIEW ONLY"
        title="SMS reports"
        description="Review the owner's daily branch summary before future integration."
        action={
          <Button variant="outline" onClick={() => setConfigOpen(true)}>
            <Settings size={16} />
            Preview settings
          </Button>
        }
      />
      <Notice tone="warning">
        <strong>NOT SENT.</strong> No SMS provider, secure scheduler or delivery
        tracking is connected. The owner uses authorized administrator
        reporting; there is no separate Owner role.
      </Notice>
      <div className="summary-grid">
        <section className="card">
          <div className="card-header">
            <h2>Report preview controls</h2>
            <Badge tone="primary">Both branches</Badge>
          </div>
          <div className="card-body stack">
            <p className="small muted">
              This owner summary always consolidates both branches, regardless
              of the workspace read filter.
            </p>
            <form
              className="stack"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                try {
                  dateSchema.parse(date);
                  cutoffInstant(date, cutoff);
                  setPreview({ date, cutoff });
                  setError("");
                  setCopied(false);
                } catch {
                  setError(
                    "Choose a valid report date and a cutoff between 00:00 and 23:59.",
                  );
                }
              }}
            >
              <Field label="Reporting date" id="sms-date">
                <input
                  id="sms-date"
                  type="date"
                  className="input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Field>
              <Field
                label="Preview cutoff (Asia/Colombo)"
                id="sms-cutoff"
                hint="This is a report cutoff, not a delivery schedule."
              >
                <input
                  id="sms-cutoff"
                  type="time"
                  className="input"
                  value={cutoff}
                  onChange={(e) => setCutoff(e.target.value)}
                />
              </Field>
              <Button type="submit">Update preview</Button>
            </form>
            <hr className="divider" />
            <div>
              <h3>Fictional demo recipient</h3>
              <p className="muted" style={{ marginTop: "var(--space-2)" }}>
                {data.settings.sms.phone || "No demo recipient configured"}
              </p>
            </div>
            <div className="row between">
              <span>Live delivery</span>
              <Badge>Unavailable</Badge>
            </div>
            <div className="row between">
              <span>Daily scheduling</span>
              <Badge>Not configured</Badge>
            </div>
            <Button
              disabled
              title="Requires a validated provider and a trusted backend scheduler."
            >
              <Send size={16} />
              Send SMS
            </Button>
            <p className="small muted">
              Future integration requires Notify.lk or Text.lk validation,
              protected server credentials, approved schedule/metrics and secure
              delivery auditing. Nothing is sent or scheduled by this frontend.
            </p>
          </div>
        </section>
        <section className="card">
          <div className="card-header">
            <div className="row">
              <MessageSquare size={18} />
              <h2>Message preview</h2>
            </div>
            <Badge tone="warning">NOT SENT</Badge>
          </div>
          <div className="card-body stack">
            <label className="sr-only" htmlFor="sms-message">
              SMS message preview
            </label>
            <textarea
              className="sms-preview"
              id="sms-message"
              readOnly
              value={text}
              rows={13}
              style={{
                width: "100%",
                resize: "vertical",
                fontSize: "var(--text-sm)",
              }}
            />
            <div className="row between">
              <span className="small muted">
                {text.length} characters · segmentation/provider limits
                unvalidated
              </span>
              <Button variant="outline" onClick={copy}>
                <Copy size={15} />
                {copied ? "Copied · not sent" : "Copy preview"}
              </Button>
            </div>
            <p className="small muted">
              Snapshot: {preview.date}, through {preview.cutoff} Asia/Colombo.
              Collections follow payment date; outstanding is cumulative through
              the cutoff.
            </p>
          </div>
        </section>
      </div>
      {error && <Notice tone="error">{error}</Notice>}
      <section className="card">
        <div className="card-header">
          <h2>Values used in this preview</h2>
          <Badge>Same report engine</Badge>
        </div>
        <div
          className="table-scroll"
          tabIndex={0}
          aria-label="Scrollable data table"
        >
          <table>
            <caption className="sr-only">
              Daily SMS preview source values in LKR
            </caption>
            <thead>
              <tr>
                <th>Branch</th>
                <th>Orders</th>
                <th>Order value</th>
                <th>Simulated collections</th>
                <th>Outstanding</th>
              </tr>
            </thead>
            <tbody>
              {summary.rows.map((row) => (
                <tr key={row.branchId}>
                  <td>
                    {data.branches.find((b) => b.id === row.branchId)!.name}
                  </td>
                  <td>{row.count}</td>
                  <td>
                    <Money value={row.orderValue} />
                  </td>
                  <td>
                    <Money value={row.collected} />
                  </td>
                  <td>
                    <Money value={row.outstanding} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {configOpen && (
        <ConfigDrawer
          onClose={() => setConfigOpen(false)}
          onSaved={(v) => {
            setCutoff(v.cutoff);
            setPreview((p) => ({ ...p, cutoff: v.cutoff }));
            setConfigOpen(false);
          }}
        />
      )}
    </div>
  );
}
function ConfigDrawer({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (values: SmsConfig) => void;
}) {
  const { data } = useDemo(),
    command = useCommand();
  const [id] = useState(requestId);
  const form = useForm<SmsConfig>({
    resolver: zodResolver(smsConfigSchema),
    defaultValues: data.settings.sms,
  });
  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="SMS preview settings"
      description="Configure a fictional recipient and report cutoff; live delivery stays disabled."
      dirty={form.formState.isDirty}
      footer={
        <>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button
            type="submit"
            form="sms-config-form"
            disabled={command.pending}
          >
            Save preview settings
          </Button>
        </>
      }
    >
      <form
        id="sms-config-form"
        className="stack"
        noValidate
        onSubmit={form.handleSubmit(async (v) => {
          const r = await command.run(
            { type: "sms-config", requestId: id, values: v },
            "SMS preview settings saved. No message sent or schedule created.",
          );
          if (r.ok) onSaved(v);
        })}
      >
        <Notice>
          Use a fictional contact only. This is not the real owner&apos;s
          production phone configuration.
        </Notice>
        <Field
          label="Owner demo phone (optional)"
          id="sms-phone"
          error={form.formState.errors.phone?.message}
        >
          <input
            id="sms-phone"
            type="tel"
            className="input"
            {...form.register("phone")}
            placeholder="Fictional number only"
            aria-invalid={!!form.formState.errors.phone}
            aria-describedby={
              form.formState.errors.phone ? "sms-phone-error" : undefined
            }
          />
        </Field>
        <Field
          label="Default reporting cutoff"
          id="sms-config-cutoff"
          error={form.formState.errors.cutoff?.message}
        >
          <input
            id="sms-config-cutoff"
            type="time"
            className="input"
            {...form.register("cutoff")}
          />
        </Field>
        <Notice tone="warning">
          Delivery enabled: false. Provider, credentials, owner timing, secure
          scheduler and message metrics require future approval and backend
          work.
        </Notice>
        {command.error && <Notice tone="error">{command.error}</Notice>}
      </form>
    </Sheet>
  );
}
