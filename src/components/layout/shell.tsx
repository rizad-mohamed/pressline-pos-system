"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Printer,
  ClipboardList,
  Package,
  ArrowLeftRight,
  Tags,
  ChartNoAxesCombined,
  MessageSquare,
  Settings,
  CircleHelp,
  LogOut,
  Menu,
  MapPin,
  UserRound,
  ShieldCheck,
} from "lucide-react";
import { useDemoState } from "@/data/provider";
import { RequireSession, adminPaths } from "@/features/auth/access";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Badge, Notice, SkeletonPage } from "@/components/shared/presentation";
import { Brand } from "@/components/shared/brand";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Scope } from "@/domain/model";
const groups = [
  {
    label: "WORKSPACE",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/pos", label: "New order", icon: ShoppingBag },
      { href: "/orders", label: "Orders", icon: ClipboardList },
      { href: "/jobs", label: "Production jobs", icon: Printer },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      { href: "/inventory", label: "Inventory", icon: Package },
      { href: "/transfers", label: "Stock transfers", icon: ArrowLeftRight },
      { href: "/pricing", label: "Price catalogue", icon: Tags },
    ],
  },
  {
    label: "INSIGHTS",
    items: [
      { href: "/reports", label: "Reports", icon: ChartNoAxesCombined },
      { href: "/sms", label: "SMS reports", icon: MessageSquare },
    ],
  },
];
export function Shell({ children }: { children: React.ReactNode }) {
  const { data, user, scope, setScope, enter, issue, reset } = useDemoState();
  const pathname = usePathname(),
    router = useRouter();
  const [menu, setMenu] = useState(false),
    [help, setHelp] = useState(false),
    [error, setError] = useState("");
  if (!data)
    return (
      <main style={{ padding: "var(--space-8)" }}>
        <SkeletonPage />
      </main>
    );
  function nav(mobile = false) {
    return (
      <aside
        className={cn("sidebar", mobile && "sidebar-mobile")}
        aria-label={mobile ? "Mobile navigation" : "Workspace navigation"}
      >
        <Link
          href="/dashboard"
          className="brand-home"
          aria-label="Pressline overview"
          onClick={() => setMenu(false)}
        >
          <Brand compact={!mobile} />
        </Link>
        <nav aria-label={mobile ? "Mobile primary" : "Primary"}>
          {groups.map((group) => {
            const items = group.items.filter(
              (item) =>
                user?.role === "admin" || !adminPaths.includes(item.href),
            );
            return items.length ? (
              <div className="nav-group" key={group.label}>
                <p className="nav-label">{group.label}</p>
                {items.map((item) => (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        className="nav-link"
                        href={item.href}
                        aria-label={item.label}
                        aria-current={
                          pathname === item.href ||
                          (item.href === "/orders" &&
                            pathname.startsWith("/orders/"))
                            ? "page"
                            : undefined
                        }
                        onClick={() => setMenu(false)}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </TooltipTrigger>
                    {!mobile && (
                      <TooltipContent side="right" sideOffset={12}>
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </div>
            ) : null;
          })}
        </nav>
        <div className="sidebar-bottom">
          {user?.role === "admin" && (
            <Link
              href="/settings"
              className="nav-link"
              aria-current={pathname === "/settings" ? "page" : undefined}
              onClick={() => setMenu(false)}
            >
              <Settings />
              Settings
            </Link>
          )}
          <button
            className="nav-link full"
            onClick={() => {
              setHelp(true);
              setMenu(false);
            }}
          >
            <CircleHelp />
            Demo guide
          </button>
          <div className="demo-card">
            <div
              className="row"
              style={{ gap: "var(--space-2)", marginBottom: "var(--space-2)" }}
            >
              <ShieldCheck size={14} />
              <strong>Local demonstration</strong>
            </div>
            <p className="muted">
              Fictional data. Changes stay in this browser.
            </p>
          </div>
          <Link
            className="nav-link"
            href="/login"
            onClick={() => setMenu(false)}
          >
            <UserRound />
            Switch account
          </Link>
          <button
            className="nav-link full"
            onClick={() => {
              const r = enter(null);
              if (r.ok) router.push("/login");
              else setError(r.error.message);
            }}
          >
            <LogOut />
            Leave workspace
          </button>
        </div>
      </aside>
    );
  }
  return (
    <TooltipProvider delayDuration={250}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {nav()}
      <header className="topbar">
        <div className="topbar-context desktop-only">
          <span>Workspace</span>
          <span aria-hidden="true">/</span>
          <strong>
            {groups
              .flatMap((g) => g.items)
              .find(
                (i) =>
                  pathname === i.href ||
                  (i.href === "/orders" && pathname.startsWith("/orders/")),
              )?.label ?? (pathname === "/settings" ? "Settings" : "Profile")}
          </strong>
        </div>
        <div className="row" style={{ flexWrap: "nowrap" }}>
          <Button
            variant="ghost"
            size="icon"
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMenu(true)}
          >
            <Menu size={21} />
          </Button>
          <div className="branch-control">
            <MapPin size={16} className="desktop-only" />
            <label className="sr-only" htmlFor="global-branch">
              Workspace branch
            </label>
            {user?.role === "admin" ? (
              <select
                id="global-branch"
                value={scope}
                onChange={(e) => setScope(e.target.value as Scope)}
              >
                <option value="all">All branches</option>
                {data.branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            ) : (
              <span>
                {data.branches.find((b) => b.id === user?.branchId)?.name ??
                  "Demo workspace"}
              </span>
            )}
          </div>
        </div>
        <div className="row" style={{ flexWrap: "nowrap" }}>
          <Badge tone="primary">DEMO</Badge>
          <div className="desktop-only">
            <strong style={{ fontSize: "var(--text-sm)" }}>
              {user?.name ?? "No demo account"}
            </strong>
            <p className="small muted">
              {user?.role === "admin" ? "Administrator" : "Cashier"}
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label="Personal settings"
          >
            <Link href="/profile">
              <span className="avatar avatar-account" aria-hidden="true">
                {user?.role === "admin"
                  ? "AD"
                  : user?.branchId === "b1"
                    ? "B1"
                    : "B2"}
              </span>
            </Link>
          </Button>
        </div>
      </header>
      <main className="workspace" id="main-content" tabIndex={-1}>
        {(issue || error) && (
          <div style={{ marginBottom: "var(--space-5)" }}>
            <Notice tone="error">
              {issue || error}{" "}
              {issue && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Replace all saved demo data with fixtures?",
                      )
                    ) {
                      const r = reset();
                      if (!r.ok) setError(r.error.message);
                    }
                  }}
                >
                  Reset demo
                </Button>
              )}
            </Notice>
          </div>
        )}
        <RequireSession
          admin={adminPaths.some(
            (p) => pathname === p || pathname.startsWith(p + "/"),
          )}
        >
          <div key={pathname} className="route-enter">
            {children}
          </div>
        </RequireSession>
      </main>
      <Sheet
        open={menu}
        onOpenChange={setMenu}
        title="Navigation"
        description="Open a section of the demonstration workspace."
      >
        {nav(true)}
      </Sheet>
      <Sheet
        open={help}
        onOpenChange={setHelp}
        title="Your demo guide"
        description="Explore the complete printing-shop workflow."
      >
        <div className="stack">
          <h3>1. Create a print order</h3>
          <p>
            Choose New order, configure each item, review demonstration prices,
            and record an optional simulated advance.
          </p>
          <h3>2. Follow the job</h3>
          <p>
            Orders and Production jobs share the same records. Open an order to
            collect a balance, advance production, or print separate receipt and
            job ticket views.
          </p>
          <h3>3. Manage both branches</h3>
          <p>
            Switch to Administrator for inventory, transfers, price rules,
            period reports, and unsent SMS previews. All branch selectors show
            their scope explicitly.
          </p>
          <Notice tone="warning">
            Use fictional data only. No account security, payment settlement,
            stock consumption, SMS delivery, or cross-device synchronization is
            provided.
          </Notice>
          <p className="small muted">
            Reset fixtures in Settings. Browser printing opens the native print
            dialog; printer output is not confirmed by this app.
          </p>
        </div>
      </Sheet>
    </TooltipProvider>
  );
}
