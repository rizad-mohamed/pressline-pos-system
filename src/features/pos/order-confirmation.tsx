"use client";
import Link from "next/link";
import type { Branch, Order } from "@/domain/model";
import { ArrowRight, CheckCircle2, Plus } from "lucide-react";
import { PageHeader, Notice } from "@/components/shared/presentation";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/domain-display";
export function OrderConfirmation({
  order,
  branches,
  onNewOrder,
}: {
  order: Order;
  branches: Branch[];
  onNewOrder: () => void;
}) {
  return (
    <div className="stack">
      <PageHeader
        eyebrow="ORDER SAVED LOCALLY"
        title={`${order.id} is ready for production`}
        description="Your demonstration order is now available in history, jobs and reports."
      />
      <div className="card card-body stack">
        <CheckCircle2 size={36} style={{ color: "var(--success)" }} />
        <h2>Order created successfully</h2>
        <div className="summary-grid">
          <div>
            <p className="muted">Order total</p>
            <h2>
              <Money value={order.totalCents} />
            </h2>
          </div>
          <div>
            <p className="muted">Branch</p>
            <h2>{branches.find((b) => b.id === order.branchId)!.name}</h2>
          </div>
        </div>
        <Notice>
          Payment events are simulated. Stock was not consumed automatically.
        </Notice>
        <div className="row">
          <Button asChild>
            <Link prefetch={false} href={`/orders/${order.id}`}>
              Open order
              <ArrowRight size={16} />
            </Link>
          </Button>
          <Button variant="outline" onClick={() => onNewOrder()}>
            <Plus size={16} />
            Create another order
          </Button>
        </div>
      </div>
    </div>
  );
}
