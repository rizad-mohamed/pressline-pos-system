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
  UserRound,
} from "lucide-react";
import { adminPaths } from "@/features/auth/access";
import type { DemoUser } from "@/domain/model";

// All navigation surfaces resolve the same real routes and existing access policy.
export const navigationGroups = [
  {
    label: "WORKSPACE",
    items: [
      {
        href: "/dashboard",
        label: "Overview",
        mobileLabel: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        href: "/pos",
        label: "New order",
        mobileLabel: "New order",
        icon: ShoppingBag,
      },
      {
        href: "/orders",
        label: "Orders",
        mobileLabel: "Orders",
        icon: ClipboardList,
      },
      {
        href: "/customers",
        label: "Customers",
        mobileLabel: "Customers",
        icon: UserRound,
      },
      {
        href: "/jobs",
        label: "Production jobs",
        mobileLabel: "Production",
        icon: Printer,
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      {
        href: "/inventory",
        label: "Inventory",
        mobileLabel: "Inventory",
        icon: Package,
      },
      {
        href: "/transfers",
        label: "Stock transfers",
        mobileLabel: "Transfers",
        icon: ArrowLeftRight,
      },
      {
        href: "/pricing",
        label: "Services",
        mobileLabel: "Services & pricing",
        icon: Tags,
      },
    ],
  },
  {
    label: "INSIGHTS",
    items: [
      {
        href: "/reports",
        label: "Reports",
        mobileLabel: "Reports",
        icon: ChartNoAxesCombined,
      },
      {
        href: "/sms",
        label: "SMS reports",
        mobileLabel: "SMS preview",
        icon: MessageSquare,
      },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      {
        href: "/settings",
        label: "Settings",
        mobileLabel: "Settings",
        icon: Settings,
      },
      {
        href: "/profile",
        label: "Profile",
        mobileLabel: "Profile",
        icon: UserRound,
      },
    ],
  },
] as const;

export function isCurrentRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
export function authorizedNavigation(role: DemoUser["role"]) {
  return navigationGroups
    .map((group) => ({
      label: group.label,
      items: group.items.filter(
        (item) => role === "admin" || !adminPaths.includes(item.href),
      ),
    }))
    .filter((group) => group.items.length > 0);
}
export function mobileDestinations(role: DemoUser["role"]) {
  const paths =
    role === "admin"
      ? ["/orders", "/inventory", "/dashboard", "/reports"]
      : ["/pos", "/orders", "/dashboard", "/jobs"];
  const authorized = authorizedNavigation(role).flatMap((group) => group.items);
  return paths.map((href) => authorized.find((item) => item.href === href)!);
}
export function moreNavigation(role: DemoUser["role"]) {
  const primary = new Set(mobileDestinations(role).map((item) => item.href));
  return authorizedNavigation(role)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !primary.has(item.href)),
    }))
    .filter((group) => group.items.length > 0);
}
export function navigationLocation(pathname: string) {
  return navigationGroups
    .flatMap((group) => [...group.items])
    .find((item) => isCurrentRoute(pathname, item.href));
}
