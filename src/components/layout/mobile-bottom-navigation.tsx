"use client";
import Link from "next/link";
import { Ellipsis } from "lucide-react";
import type { DemoUser } from "@/domain/model";
import { cn } from "@/lib/utils";
import { isCurrentRoute, mobileDestinations } from "./navigation";

export function MobileBottomNavigation({
  role,
  pathname,
  open,
  onMore,
}: {
  role: DemoUser["role"];
  pathname: string;
  open: boolean;
  onMore: () => void;
}) {
  const destinations = mobileDestinations(role);
  const moreActive = !destinations.some((item) =>
    isCurrentRoute(pathname, item.href),
  );
  return (
    <nav
      className="mobile-bottom-navigation no-print"
      aria-label="Mobile workspace"
    >
      {destinations.map((item) => (
        <Link
          prefetch={false}
          href={item.href}
          key={item.href}
          className={cn(
            "mobile-tab",
            item.href === "/dashboard" && "mobile-tab-home",
          )}
          aria-current={
            isCurrentRoute(pathname, item.href) ? "page" : undefined
          }
        >
          <span className="mobile-tab-icon" aria-hidden="true">
            <item.icon />
          </span>
          <span className="mobile-tab-label">{item.mobileLabel}</span>
        </Link>
      ))}
      <button
        className="mobile-tab"
        type="button"
        onClick={onMore}
        aria-label="More navigation"
        aria-haspopup="dialog"
        aria-expanded={open}
        data-active={moreActive || undefined}
      >
        <span className="mobile-tab-icon" aria-hidden="true">
          <Ellipsis />
        </span>
        <span className="mobile-tab-label">More</span>
      </button>
    </nav>
  );
}
