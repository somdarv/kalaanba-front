"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

type NavItem = { href: string; label: string };
type NavGroup = { label: string; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    label: "Governance",
    items: [
      { href: "/admin/configs", label: "Configurations" },
      { href: "/admin/governance/approvals", label: "Approvals queue" },
      { href: "/admin/governance/audit-log", label: "Audit log" },
      { href: "/admin/governance/users", label: "Users & roles" },
    ],
  },
  {
    label: "Football",
    items: [
      { href: "/admin/football/seasons", label: "Seasons" },
      { href: "/admin/football/competitions", label: "Competitions" },
      { href: "/admin/football/matches", label: "Matches" },
      { href: "/admin/football/clubs", label: "Clubs" },
      { href: "/admin/football/players", label: "Players & affiliations" },
      { href: "/admin/football/referees", label: "Referees" },
    ],
  },
  {
    label: "Trust & Verification",
    items: [
      { href: "/admin/trust/queue", label: "Trust queue" },
      { href: "/admin/trust/disputes", label: "Disputes" },
    ],
  },
  {
    label: "Zone & Geography",
    items: [
      { href: "/admin/zone/area-suggestions", label: "Area suggestions" },
      { href: "/admin/zone/zones", label: "Zones & belts" },
      { href: "/admin/zone/hubs", label: "City hubs" },
    ],
  },
  {
    label: "RP & Challenges",
    items: [
      { href: "/admin/rp/ledger", label: "RP ledger" },
      { href: "/admin/rp/challenges", label: "Challenges" },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/operations/venues", label: "Venues" },
      { href: "/admin/operations/bookings", label: "Bookings" },
      { href: "/admin/operations/surfaces", label: "Surface calendar" },
    ],
  },
  {
    label: "Engagement",
    items: [
      { href: "/admin/engagement/notifications", label: "Notifications" },
      { href: "/admin/engagement/buzz", label: "Fan Buzz" },
      { href: "/admin/engagement/awards", label: "Awards & recognition" },
    ],
  },
  {
    label: "Safety",
    items: [
      { href: "/admin/safety/moderation", label: "Moderation queue" },
      { href: "/admin/safety/holds", label: "Holds & escalations" },
    ],
  },
  {
    label: "Analytics",
    items: [
      { href: "/admin/analytics/dashboard", label: "Dashboards" },
      { href: "/admin/analytics/events", label: "Events" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Admin sections"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-3"
    >
      <p className="px-3 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Kalaanba Admin
      </p>
      {GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            {group.label}
          </p>
          {group.items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-foreground hover:bg-surface-2",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
