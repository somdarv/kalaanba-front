import { CalendarPlus, Check, ChevronRight, Menu, Phone, ShieldCheck, Trophy, UserPlus } from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  IconButton,
  SearchField,
  TextField,
  ThemeToggle,
} from "@/components/ui";

export default function Home() {
  return (
    <main className="min-h-dvh px-4 py-5 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <Badge tone="accent" withDot>
              Foundation
            </Badge>
            <h1 className="mt-4 font-display text-4xl font-800 leading-none tracking-normal text-fg sm:text-5xl">
              Kalaanba UI
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-fg-muted sm:text-base">
              Core primitives for club creation, fixture entry, player records, and public tournament surfaces.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <IconButton aria-label="Open menu" variant="ghost">
              <Menu className="h-5 w-5" />
            </IconButton>
            <ThemeToggle />
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <Card interactive>
            <CardContent>
              <CardHeader>
                <div>
                  <Badge tone="live">Matchday</Badge>
                  <CardTitle className="mt-4 text-3xl">Create the next fixture</CardTitle>
                  <CardDescription>
                    Fast enough for a phone screen, calm enough for a busy organiser.
                  </CardDescription>
                </div>
                <IconButton aria-label="Add fixture" variant="primary" size="lg">
                  <CalendarPlus className="h-5 w-5" />
                </IconButton>
              </CardHeader>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <SearchField name="search" placeholder="Search players, clubs, fixtures" inputSize="lg" />
                <TextField
                  name="phone"
                  placeholder="024 000 0000"
                  label="Manager phone"
                  leftIcon={<Phone className="h-4 w-4" />}
                />
              </div>

              <CardFooter>
                <Button leadingIcon={<UserPlus className="h-4 w-4" />}>Create club</Button>
                <Button variant="secondary" trailingIcon={<ChevronRight className="h-4 w-4" />}>
                  Schedule fixture
                </Button>
                <Button variant="ghost">Save draft</Button>
              </CardFooter>
            </CardContent>
          </Card>

          <Card tone="secondary" interactive>
            <CardContent>
              <CardHeader>
                <div>
                  <Badge tone="primary">Players</Badge>
                  <CardTitle className="mt-4">Verified records</CardTitle>
                  <CardDescription>
                    Every identity element should feel clear, trusted, and quick to scan.
                  </CardDescription>
                </div>
                <Trophy className="h-6 w-6 text-primary" />
              </CardHeader>

              <div className="mt-6 flex items-center gap-3">
                <Avatar
                  name="Richard Somda"
                  status="verified"
                  size="lg"
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=faces"
                />
                <div className="min-w-0">
                  <div className="font-display text-lg font-800 text-fg">Richard Somda</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge tone="accent" withDot>
                      Verified
                    </Badge>
                    <Badge tone="neutral">Forward</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <Metric label="Apps" value="32" />
                <Metric label="Goals" value="24" accent />
                <Metric label="Assists" value="12" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Card interactive>
            <CardContent>
              <CardHeader>
                <Badge tone="neutral">Buttons</Badge>
                <ShieldCheck className="h-5 w-5 text-accent-blue" />
              </CardHeader>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button size="sm">Primary</Button>
                <Button size="sm" variant="secondary">
                  Secondary
                </Button>
                <Button size="sm" variant="quiet">
                  Quiet
                </Button>
                <Button size="sm" variant="ghost">
                  Ghost
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card interactive>
            <CardContent>
              <CardHeader>
                <Badge tone="neutral">Badges</Badge>
                <Check className="h-5 w-5 text-primary" />
              </CardHeader>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge tone="live">Live</Badge>
                <Badge tone="primary">Pending</Badge>
                <Badge tone="accent">Verified</Badge>
                <Badge tone="neutral">Draft</Badge>
              </div>
            </CardContent>
          </Card>

          <Card interactive>
            <CardContent>
              <CardHeader>
                <Badge tone="neutral">Avatars</Badge>
              </CardHeader>
              <div className="mt-5 flex items-center gap-3">
                <Avatar name="Kwame Mensah" status="online" />
                <Avatar name="Amina Yakubu" status="verified" />
                <Avatar name="Salisu Mohammed" status="idle" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-[1.25rem] border border-border bg-surface px-4 py-3 text-center transition-colors duration-200 hover:border-primary hover:bg-surface-2">
      <div className="font-display text-[10px] font-800 uppercase tracking-[0.14em] text-fg-muted">{label}</div>
      <div className={`mt-1 font-display text-2xl font-800 ${accent ? "text-primary" : "text-fg"}`}>{value}</div>
    </div>
  );
}
