"use client";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useDemoState } from "@/data/provider";
import { EmptyState, SkeletonPage } from "@/components/shared/presentation";
import { Button } from "@/components/ui/button";
export const adminPaths = [
  "/inventory",
  "/transfers",
  "/pricing",
  "/reports",
  "/sms",
  "/settings",
];
export function AccessDenied() {
  return (
    <div className="card">
      <EmptyState
        title="Administrator access required"
        description="This demo account cannot open branch management. Choose the Administrator account to review this section."
        action={
          <div className="row">
            <Button asChild variant="outline">
              <Link prefetch={false} href="/dashboard">
                Back to dashboard
              </Link>
            </Button>
            <Button asChild>
              <Link prefetch={false} href="/login">
                Switch demo account
              </Link>
            </Button>
          </div>
        }
      />
    </div>
  );
}
export function RequireSession({
  children,
  admin = false,
}: {
  children: React.ReactNode;
  admin?: boolean;
}) {
  const { data, user } = useDemoState();
  if (!data) return <SkeletonPage />;
  if (!user)
    return (
      <div className="card">
        <EmptyState
          title="Choose a demo account"
          description="Use a cashier or Administrator demonstration account to open the workspace. This account selector does not provide real authentication."
          action={
            <Button asChild>
              <Link prefetch={false} href="/login">
                <ShieldCheck size={16} />
                Choose demo account
              </Link>
            </Button>
          }
        />
      </div>
    );
  if (admin && user.role !== "admin") return <AccessDenied />;
  return children;
}
