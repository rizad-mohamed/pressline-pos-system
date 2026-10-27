"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Settings,
  CircleHelp,
  LogOut,
  MapPin,
  UserRound,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { MobileBottomNavigation } from "./mobile-bottom-navigation";
import {
  navigationGroups,
  navigationLocation,
  isCurrentRoute,
  moreNavigation,
} from "./navigation";
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
import type { Scope } from "@/domain/model";
const groups = navigationGroups.filter((group) => group.label !== "ACCOUNT");
export function Shell({ children }: { children: React.ReactNode }) {
  const { data, user, scope, setScope, enter, issue, reset } = useDemoState();
  const pathname = usePathname(),
    router = useRouter();
  const current = (href: string) => isCurrentRoute(pathname, href);
  const [menu, setMenu] = useState(false),
    [help, setHelp] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    if (!menu) return;
    const closeMenu = () => setMenu(false);
    window.addEventListener("popstate", closeMenu);
    return () => window.removeEventListener("popstate", closeMenu);
  }, [menu]);
  const workspaceAllowed = Boolean(
    user && (user.role === "admin" || !adminPaths.some(current)),
  );
  const location = navigationLocation(pathname);
  function leaveWorkspace() {
    const result = enter(null);
    if (result.ok) {
      setMenu(false);
      router.push("/login");
    } else setError(result.error.message);
  }
  if (!data)
    return (
      <main style={{ padding: "var(--space-8)" }}>
        <SkeletonPage />
      </main>
    );
  function nav() {
    return (
      <aside className="sidebar" aria-label="Workspace navigation">
        <Link
          href="/dashboard"
          className="brand-home"
          aria-label="Pressline overview"
          onClick={() => setMenu(false)}
        >
          <Brand compact />
        </Link>
        <nav aria-label="Primary">
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
                        aria-current={current(item.href) ? "page" : undefined}
                        onClick={() => setMenu(false)}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={12}>
                      {item.label}
                    </TooltipContent>
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
          <button className="nav-link full" onClick={leaveWorkspace}>
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
          <strong>{location?.label ?? "Profile"}</strong>
        </div>
        <div className="row topbar-branch-group" style={{ flexWrap: "nowrap" }}>
          {workspaceAllowed && (
            <div className="mobile-page-context">
              <span>Pressline</span>
              <strong>{location?.mobileLabel ?? "Workspace"}</strong>
            </div>
          )}
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
            aria-label={`Personal settings, ${user?.role === "admin" ? "AD" : user?.branchId === "b1" ? "B1" : "B2"}`}
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
      <main
        className="workspace"
        data-screen={pathname.split("/")[1]}
        id="main-content"
        tabIndex={-1}
      >
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
      {workspaceAllowed && user && (
        <MobileBottomNavigation
          role={user.role}
          pathname={pathname}
          open={menu}
          onMore={() => setMenu(true)}
        />
      )}
      <Sheet
        open={menu && workspaceAllowed}
        onOpenChange={setMenu}
        title="More navigation"
        description="Your other workspace tools, account and demo guide."
        className="mobile-more-sheet no-print"
      >
        {user && (
          <nav className="more-navigation" aria-label="More workspace">
            {moreNavigation(user.role).map((group) => (
              <section key={group.label}>
                <h3>
                  {group.label.charAt(0) + group.label.slice(1).toLowerCase()}
                </h3>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="more-navigation-link"
                    aria-current={current(item.href) ? "page" : undefined}
                    onClick={() => setMenu(false)}
                  >
                    <item.icon aria-hidden="true" />
                    <span>{item.mobileLabel}</span>
                    <ChevronRight aria-hidden="true" />
                  </Link>
                ))}
              </section>
            ))}
          </nav>
        )}
        <div className="more-account-actions">
          <Button
            variant="outline"
            onClick={() => {
              setMenu(false);
              setHelp(true);
            }}
          >
            <CircleHelp aria-hidden="true" />
            Demo guide
          </Button>
          <Button asChild variant="outline">
            <Link href="/login" onClick={() => setMenu(false)}>
              <UserRound aria-hidden="true" />
              Switch account
            </Link>
          </Button>
          <Button variant="ghost" onClick={leaveWorkspace}>
            <LogOut aria-hidden="true" />
            Leave workspace
          </Button>
        </div>
        <p className="more-demo-note small muted">
          Local demonstration. Fictional data stays in this browser.
        </p>
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
            SMS delivery, or cross-device synchronization is provided. Material
            usage updates only this browser&apos;s demonstration stock ledger.
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
