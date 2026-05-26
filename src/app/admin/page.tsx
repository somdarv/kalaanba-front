import Link from "next/link";

type Tile = {
  href: string;
  title: string;
  description: string;
  status: "live" | "mock";
};

const TILES: Tile[] = [
  { href: "/admin/configs", title: "Configurations", description: "Browse admin_config rows. Filter by engine prefix or approval level.", status: "live" },
  { href: "/admin/governance/approvals", title: "Approvals queue", description: "Pending config changes, role grants, archive requests.", status: "mock" },
  { href: "/admin/governance/audit-log", title: "Audit log", description: "Append-only record of every admin action.", status: "mock" },
  { href: "/admin/governance/users", title: "Users & roles", description: "Promote, demote, archive users. Scope by hub/zone.", status: "mock" },
  { href: "/admin/football/seasons", title: "Seasons", description: "Calendar, cutoffs, phase transitions, archive windows.", status: "mock" },
  { href: "/admin/football/competitions", title: "Competitions", description: "Containers, rules, standings, format.", status: "mock" },
  { href: "/admin/football/matches", title: "Matches", description: "Lifecycle, events, lineups, verification status.", status: "mock" },
  { href: "/admin/football/clubs", title: "Clubs", description: "Identity, verification, related-club flags, archive.", status: "mock" },
  { href: "/admin/football/players", title: "Players & affiliations", description: "Ghost claims, affiliations, minor-protected flag.", status: "mock" },
  { href: "/admin/football/referees", title: "Referees", description: "Assignment, reports, reliability signals.", status: "mock" },
  { href: "/admin/trust/queue", title: "Trust queue", description: "Pending verification clearances and decision trace.", status: "mock" },
  { href: "/admin/trust/disputes", title: "Disputes", description: "Dispute resolution with evidence (private).", status: "mock" },
  { href: "/admin/zone/area-suggestions", title: "Area suggestions", description: "Approve/reject area suggestions submitted by club admins.", status: "live" },
  { href: "/admin/zone/zones", title: "Zones & belts", description: "Manage zone/belt mapping, zone scores.", status: "mock" },
  { href: "/admin/zone/hubs", title: "City hubs", description: "Hub administration and area assignments.", status: "mock" },
  { href: "/admin/rp/ledger", title: "RP ledger", description: "Append-only RP ledger. Compensating entries only.", status: "mock" },
  { href: "/admin/rp/challenges", title: "Challenges", description: "Lifecycle, counters, stake-locking visibility.", status: "mock" },
  { href: "/admin/operations/venues", title: "Venues", description: "Venue identity, capacity, surface inventory.", status: "mock" },
  { href: "/admin/operations/bookings", title: "Bookings", description: "Bookings, settlement, refunds (pesewas).", status: "mock" },
  { href: "/admin/operations/surfaces", title: "Surface calendar", description: "Surface availability and maintenance windows.", status: "mock" },
  { href: "/admin/engagement/notifications", title: "Notifications", description: "Recipient targeting, channel, delivery audit.", status: "mock" },
  { href: "/admin/engagement/buzz", title: "Fan Buzz", description: "Attention signals, ranking, badges (attention-only).", status: "mock" },
  { href: "/admin/engagement/awards", title: "Awards & recognition", description: "Weekly/seasonal recognition. Requires Trust clearance.", status: "mock" },
  { href: "/admin/safety/moderation", title: "Moderation queue", description: "Public content safety holds and reports.", status: "mock" },
  { href: "/admin/safety/holds", title: "Holds & escalations", description: "Active holds, escalation chains, resolution.", status: "mock" },
  { href: "/admin/analytics/dashboard", title: "Dashboards", description: "Operational KPIs and engine health.", status: "mock" },
  { href: "/admin/analytics/events", title: "Events", description: "Event stream consumed by analytics.", status: "mock" },
];

export default function AdminOverviewPage() {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Operations console
        </h1>
        <p className="text-sm text-muted-foreground">
          Kalaanba admin surface for grassroots football operations.
          Mutating actions are idempotent and audited.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((tile) => (
          <li key={tile.href}>
            <Link
              href={tile.href}
              className="group flex h-full flex-col gap-2 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary/40 hover:bg-surface-2"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  {tile.title}
                </h2>
                <span
                  className={
                    tile.status === "live"
                      ? "rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary"
                      : "rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                  }
                >
                  {tile.status === "live" ? "Live" : "Mock"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {tile.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
