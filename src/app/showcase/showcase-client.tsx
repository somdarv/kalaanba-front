"use client";

import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Card,
  Chip,
  ChipToggle,
  Divider,
  Fab,
  HStack,
  Icon,
  IconButton,
  LinkButton,
  NumberInput,
  PasswordField,
  Pressable,
  Select,
  CountrySelector,
  DateField,
  DateTimeField,
  OtpInput,
  SearchField,
  Checkbox,
  RadioGroup,
  Switch,
  Slider,
  RangeSlider,
  PhoneInput,
  Combobox,
  FileUpload,
  ImageUploader,
  Skeleton,
  Spinner,
  Stack,
  Tabs,
  Progress,
  Toast,
  ToastProvider,
  useToast,
  Textarea,
  TextField,
  ThemeToggle,
  VStack,
  NotificationBell,
  type ButtonIntent,
  type ButtonSize,
  type SelectOption,
} from "@/components/ui";
import { useTheme } from "@/components/providers/theme-provider";
import { MagnifyingGlass, EnvelopeSimple, Lock, User } from "@phosphor-icons/react";

// ---------- tiny icon set used across demos (no extra deps) ----------

const IconCheck = () => (
  <Icon>
    <path d="m5 12 5 5L20 7" />
  </Icon>
);
const IconArrow = () => (
  <Icon>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);
const IconPlus = () => (
  <Icon>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
const IconHeart = () => (
  <Icon>
    <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10Z" />
  </Icon>
);
const IconBell = () => (
  <Icon>
    <path d="M6 8a6 6 0 1 1 12 0c0 6 3 6 3 9H3c0-3 3-3 3-9Z" />
    <path d="M10 21a2 2 0 0 0 4 0" />
  </Icon>
);

const INTENTS: ButtonIntent[] = [
  "primary",
  "secondary",
  "accent",
  "ghost",
  "danger",
  "success",
];
const SIZES: ButtonSize[] = ["sm", "md", "lg"];

// ---------- main page ----------

export function ShowcaseClient() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <ShowcaseHeader />
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-8 sm:px-6">
        <VStack gap={12}>
          <SectionHero />
          <SectionTokens />
          <SectionPressable />
          <SectionButtons />
          <SectionIconButtons />
          <SectionLinkButtons />
          <SectionButtonGroups />
          <SectionChips />
          <SectionCards />
          <SectionFab />
          <SectionAtoms />
          <SectionTextField />
          <SectionPasswordField />
          <SectionTextarea />
          <SectionNumberInput />
          <SectionSelect />
          <SectionCountrySelector />
          <SectionDateField />
          <SectionDateTimeField />
          <SectionSearchField />
          <SectionOtpInput />
          <SectionPhoneInput />
          <SectionCheckbox />
          <SectionRadioGroup />
          <SectionSwitch />
          <SectionSlider />
          <SectionRangeSlider />
          <SectionCombobox />
          <SectionFileUpload />
          <SectionImageUploader />
          <SectionTabs />
          <SectionProgress />
          <SectionToast />
          <SectionBadge />
          <SectionAvatar />
          <SectionNotificationBell />
        </VStack>
      </main>
    </div>
  );
}

function ShowcaseHeader() {
  const { theme, resolvedTheme } = useTheme();
  return (
    <header className="sticky top-0 z-30 border-b border-divider bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-lg font-semibold">Kalaanba</span>
          <span className="text-sm text-fg-muted">Showcase</span>
          <span className="hidden text-xs text-fg-subtle sm:inline">
            theme: {theme} → {resolvedTheme}
          </span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

// ---------- section helpers ----------

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-fg-muted">{subtitle}</p>
        ) : null}
      </div>
      <div className="rounded-card border border-border bg-surface p-5">
        {children}
      </div>
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-6">
      <span className="w-24 shrink-0 text-xs uppercase tracking-wider text-fg-subtle">
        {label}
      </span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
        {children}
      </div>
    </div>
  );
}

// ---------- sections ----------

function SectionHero() {
  return (
    <section className="rounded-card-lg border border-border bg-surface p-6 sm:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-fg-subtle">
        design system · phase 2
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Tier 0 & Tier 1 — live.
      </h1>
      <p className="mt-3 max-w-2xl text-fg-muted">
        Every clickable thing composes <code className="rounded bg-surface-2 px-1.5 py-0.5 text-sm">Pressable</code>.
        Buttons never move — they change state. Toggle the theme above; the
        whole page should cross-fade in 160ms.
      </p>
    </section>
  );
}

function SectionTokens() {
  const swatches: Array<[label: string, varName: string]> = [
    ["bg", "--bg"],
    ["surface", "--surface"],
    ["surface-2", "--surface-2"],
    ["fg", "--fg"],
    ["fg-muted", "--fg-muted"],
    ["primary", "--primary"],
    ["accent", "--accent"],
    ["success", "--success"],
    ["warning", "--warning"],
    ["danger", "--danger"],
  ];
  return (
    <Section title="Tokens" subtitle="Live values pulled from globals.css.">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {swatches.map(([label, varName]) => (
          <div
            key={varName}
            className="overflow-hidden rounded-control border border-border"
          >
            <div
              className="h-16 w-full"
              style={{ background: `var(${varName})` }}
            />
            <div className="bg-surface-2 px-3 py-2 text-xs">
              <div className="font-medium">{label}</div>
              <div className="text-fg-subtle">{varName}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function SectionPressable() {
  return (
    <Section
      title="Pressable"
      subtitle="The canonical recipe. Compose this — never reinvent a hover/active rule."
    >
      <HStack gap={3} wrap>
        <Pressable className="rounded-card border border-border bg-surface-2 px-4 hover:bg-[color-mix(in_oklab,var(--surface-2)_88%,var(--fg)_12%)] active:shadow-[var(--shadow-pressed)]">
          Default
        </Pressable>
        <Pressable
          disabled
          className="rounded-card border border-border bg-surface-2 px-4"
        >
          Disabled
        </Pressable>
        <Pressable className="rounded-pill border border-border bg-surface px-4">
          Pill shape
        </Pressable>
      </HStack>
    </Section>
  );
}

function SectionButtons() {
  const [loadingIntent, setLoadingIntent] = useState<ButtonIntent | null>(null);
  return (
    <Section
      title="Button"
      subtitle="6 intents × 3 sizes. Hover/press change colour and shadow, never position."
    >
      <Stack gap={2}>
        {SIZES.map((size) => (
          <Row key={size} label={size}>
            {INTENTS.map((intent) => (
              <Button key={intent} intent={intent} size={size}>
                {intent}
              </Button>
            ))}
          </Row>
        ))}
        <Divider />
        <Row label="states">
          <Button intent="primary" disabled>
            Disabled
          </Button>
          <Button
            intent="primary"
            loading={loadingIntent === "primary"}
            onClick={() => {
              setLoadingIntent("primary");
              setTimeout(() => setLoadingIntent(null), 1400);
            }}
          >
            Click to load
          </Button>
          <Button
            intent="accent"
            loading={loadingIntent === "accent"}
            loadingText="Publishing…"
            onClick={() => {
              setLoadingIntent("accent");
              setTimeout(() => setLoadingIntent(null), 1600);
            }}
          >
            Publish
          </Button>
          <Button intent="ghost" leadingIcon={<IconCheck />}>
            With leading
          </Button>
          <Button intent="primary" trailingIcon={<IconArrow />}>
            With trailing
          </Button>
        </Row>
        <Row label="full">
          <Button intent="primary" fullWidth>
            Full-width primary
          </Button>
        </Row>
      </Stack>
    </Section>
  );
}

function SectionIconButtons() {
  return (
    <Section title="IconButton" subtitle="Same intents — round, label required. `xs` for dense toolbars.">
      <Stack gap={2}>
        <Row label="xs">
          {INTENTS.map((intent) => (
            <IconButton
              key={intent}
              intent={intent}
              size="xs"
              label={`${intent} xs`}
              icon={<IconHeart />}
            />
          ))}
        </Row>
        {SIZES.map((size) => (
          <Row key={size} label={size}>
            {INTENTS.map((intent) => (
              <IconButton
                key={intent}
                intent={intent}
                size={size}
                label={`${intent} ${size}`}
                icon={<IconHeart />}
              />
            ))}
          </Row>
        ))}
      </Stack>
    </Section>
  );
}

function SectionLinkButtons() {
  return (
    <Section title="LinkButton" subtitle="Inline navigational links.">
      <HStack gap={4} wrap>
        <LinkButton href="#tokens">Jump to tokens</LinkButton>
        <LinkButton href="#buttons" tone="tonal">
          Tonal hover
        </LinkButton>
        <LinkButton href="#buttons" leadingIcon={<IconArrow />}>
          With icon
        </LinkButton>
      </HStack>
    </Section>
  );
}

function SectionButtonGroups() {
  return (
    <Section title="ButtonGroup" subtitle="Spaced (default) and attached.">
      <Stack gap={3}>
        <ButtonGroup>
          <Button intent="secondary">Cancel</Button>
          <Button intent="primary">Confirm</Button>
        </ButtonGroup>
        <ButtonGroup attached>
          <Button intent="secondary">Day</Button>
          <Button intent="secondary">Week</Button>
          <Button intent="secondary">Month</Button>
        </ButtonGroup>
      </Stack>
    </Section>
  );
}

function SectionChips() {
  const [filters, setFilters] = useState<Record<string, boolean>>({
    upcoming: true,
    live: false,
    done: false,
  });
  return (
    <Section
      title="Chip & ChipToggle"
      subtitle="Static badges and interactive toggles."
    >
      <Stack gap={3}>
        <Row label="static">
          <Chip>Neutral</Chip>
          <Chip intent="primary">Primary</Chip>
          <Chip intent="accent">Accent</Chip>
          <Chip intent="success">Verified</Chip>
          <Chip intent="warning">Pending</Chip>
          <Chip intent="danger">Disputed</Chip>
        </Row>
        <Row label="toggle">
          {(["upcoming", "live", "done"] as const).map((key) => (
            <ChipToggle
              key={key}
              pressed={filters[key] ?? false}
              onClick={() =>
                setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
              }
            >
              {key}
            </ChipToggle>
          ))}
        </Row>
      </Stack>
    </Section>
  );
}

function SectionFab() {
  return (
    <Section title="Fab" subtitle="Floating action. Mount = soft overshoot.">
      <HStack gap={4} wrap align="center">
        <Fab
          label="New match"
          icon={<IconPlus />}
          position="none"
        />
        <Fab
          label="New match"
          intent="accent"
          icon={<IconPlus />}
          position="none"
        />
        <Fab
          label="Notify"
          icon={<IconBell />}
          extended="Notify"
          position="none"
        />
      </HStack>
    </Section>
  );
}

function SectionCards() {
  return (
    <Section
      title="Card"
      subtitle="Flat for inline regions, raised for cards/panels. Add interactive for clickable cards."
    >
      <Stack gap={5}>
        <Row label="flat">
          <Card tone="flat" className="max-w-sm">
            <Card.Header>
              <h3>Flat tone</h3>
              <Chip size="sm" intent="neutral">
                inline
              </Chip>
            </Card.Header>
            <Card.Content>
              Use flat for inline regions, list rows, and dividers. No shadow,
              no inset highlight — just a hairline border on `bg-surface`.
            </Card.Content>
          </Card>
        </Row>

        <Row label="raised">
          <Card tone="raised" className="max-w-sm">
            <Card.Header>
              <h3>Raised tone</h3>
              <Chip size="sm" intent="primary">
                default
              </Chip>
            </Card.Header>
            <Card.Content>
              Default surface for cards & panels: <code>bg-surface-elev</code>{" "}
              + <code>border-border-strong</code> + <code>shadow-md</code> with
              the inset top highlight that separates premium from flat web.
            </Card.Content>
            <Card.Footer>
              <Button intent="ghost" size="sm">
                Cancel
              </Button>
              <Button intent="primary" size="sm">
                Confirm
              </Button>
            </Card.Footer>
          </Card>
        </Row>

        <Row label="interactive">
          <Card
            interactive
            tone="raised"
            className="max-w-sm"
            onClick={() => {}}
          >
            <Card.Header>
              <h3>Tap or hover me</h3>
              <Icon>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </Icon>
            </Card.Header>
            <Card.Content>
              Composes <code>pressableBase</code> — border-strong & shadow-lg
              on hover, pressed inset on active. No translate, no scale; the
              surface changes state only.
            </Card.Content>
          </Card>
        </Row>

        <Row label="size=lg">
          <Card tone="raised" size="lg" className="max-w-md">
            <Card.Header>
              <h3>Feature / hero card</h3>
            </Card.Header>
            <Card.Content>
              Larger radius (<code>--radius-card-lg</code> = 2rem) and roomier
              padding for hero surfaces.
            </Card.Content>
          </Card>
        </Row>
      </Stack>
    </Section>
  );
}

function SectionTextField() {
  return (
    <Section
      title="TextField — draft"
      subtitle="Pill, fluid, hairline border on a distinct surface. Solid pink ring on focus. No icon / left / right / both / disabled."
    >
      <Stack gap={5}>
        <Row label="no icon">
          <TextField placeholder="Your name" aria-label="Your name" />
        </Row>
        <Row label="left icon">
          <TextField
            placeholder="Search clubs, players, fixtures…"
            aria-label="Search"
            leftIcon={<MagnifyingGlass size={18} weight="bold" />}
          />
        </Row>
        <Row label="right icon">
          <TextField
            placeholder="you@kalaanba.com"
            aria-label="Email"
            type="email"
            rightSlot={
              <span className="pr-3 text-fg-muted">
                <EnvelopeSimple size={18} weight="bold" />
              </span>
            }
          />
        </Row>
        <Row label="both sides">
          <TextField
            placeholder="Email"
            aria-label="Email both sides"
            type="email"
            leftIcon={<EnvelopeSimple size={18} weight="bold" />}
            rightSlot={
              <span className="pr-3 text-fg-muted">
                <User size={18} weight="bold" />
              </span>
            }
          />
        </Row>
        <Row label="disabled">
          <TextField
            placeholder="Locked field"
            aria-label="Locked"
            disabled
            defaultValue="kwame@clubghana.com"
            leftIcon={<User size={18} weight="bold" />}
          />
        </Row>
        <Row label="label + hint">
          <TextField
            label="Display name"
            hint="Shown on your public profile."
            placeholder="e.g. Kwame O."
          />
        </Row>
        <Row label="error">
          <TextField
            label="Phone"
            placeholder="+233 …"
            defaultValue="0244"
            error="Enter a valid Ghanaian phone number."
          />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionPasswordField() {
  return (
    <Section
      title="PasswordField"
      subtitle="Composes TextField. Eye toggle in the right slot reveals the password. Defaults to autocomplete='current-password'."
    >
      <Stack gap={5}>
        <Row label="default">
          <PasswordField placeholder="Password" aria-label="Password" />
        </Row>
        <Row label="with label + lock icon">
          <PasswordField
            label="Password"
            placeholder="At least 8 characters"
            leftIcon={<Lock size={18} weight="bold" />}
            hint="Use letters, numbers, and one symbol."
          />
        </Row>
        <Row label="new password">
          <PasswordField
            label="Create password"
            autoComplete="new-password"
            placeholder="Pick something strong"
            leftIcon={<Lock size={18} weight="bold" />}
          />
        </Row>
        <Row label="error">
          <PasswordField
            label="Password"
            defaultValue="abc"
            leftIcon={<Lock size={18} weight="bold" />}
            error="Password must be at least 8 characters."
          />
        </Row>
        <Row label="disabled">
          <PasswordField
            placeholder="Locked"
            defaultValue="hunter2"
            disabled
            leftIcon={<Lock size={18} weight="bold" />}
          />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionTextarea() {
  const [bio, setBio] = useState(
    "Forward with a midfielder's brain. Plays for the badge, not the boot deal.",
  );
  return (
    <Section
      title="Textarea"
      subtitle="Multi-line. Same surface / border / focus language as TextField, but rounded-card and padded so it reads as a panel."
    >
      <Stack gap={5}>
        <Row label="default">
          <Textarea
            placeholder="Write your thoughts…"
            aria-label="Notes"
            rows={4}
          />
        </Row>
        <Row label="label + hint + counter">
          <Textarea
            label="Player bio"
            hint="Keep it short. Two sentences max."
            placeholder="Tell us about this player…"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            maxLength={240}
            showCount
            rows={4}
          />
        </Row>
        <Row label="error">
          <Textarea
            label="Dispute reason"
            placeholder="Explain what went wrong"
            error="Please give us at least one sentence."
          />
        </Row>
        <Row label="disabled">
          <Textarea
            label="Submitted note"
            defaultValue="Locked after submission."
            disabled
          />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionNumberInput() {
  const [age, setAge] = useState(18);
  const [squad, setSquad] = useState(11);
  return (
    <Section
      title="NumberInput (Stepper)"
      subtitle="Pill, –/+ tiles, centered tabular value. ArrowUp / ArrowDown / Home / End on the input. Clamps to min/max."
    >
      <Stack gap={5}>
        <Row label="player age">
          <NumberInput
            label="Player age"
            value={age}
            onChange={setAge}
            min={14}
            max={50}
            unit="yrs"
          />
        </Row>
        <Row label="squad size">
          <NumberInput
            label="Squad size"
            value={squad}
            onChange={setSquad}
            min={5}
            max={30}
            hint="Tap the tiles or use Arrow keys."
          />
        </Row>
        <Row label="disabled">
          <NumberInput
            label="Locked value"
            value={7}
            onChange={() => {}}
            disabled
          />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionSelect() {
  const [position, setPosition] = useState<string | null>("CM");
  const [priority, setPriority] = useState<string | null>(null);

  const positionOptions: SelectOption<string>[] = [
    {
      value: "GK",
      label: "Goalkeeper",
      description: "Last line. Owns the box.",
      leading: <PositionBadge>GK</PositionBadge>,
    },
    {
      value: "CB",
      label: "Centre-back",
      description: "Anchor of the defence.",
      leading: <PositionBadge>CB</PositionBadge>,
    },
    {
      value: "FB",
      label: "Full-back",
      description: "Wide defender, two-way.",
      leading: <PositionBadge>FB</PositionBadge>,
    },
    {
      value: "CM",
      label: "Centre midfielder",
      description: "Heartbeat of the team.",
      leading: <PositionBadge>CM</PositionBadge>,
    },
    {
      value: "WG",
      label: "Winger",
      description: "Pace, trickery, end-product.",
      leading: <PositionBadge>WG</PositionBadge>,
    },
    {
      value: "ST",
      label: "Striker",
      description: "Front-line finisher.",
      leading: <PositionBadge>ST</PositionBadge>,
    },
  ];

  const priorityOptions: SelectOption<string>[] = [
    { value: "low", label: "Low", leading: <Dot tone="muted" /> },
    { value: "med", label: "Medium", leading: <Dot tone="primary" /> },
    { value: "high", label: "High", leading: <Dot tone="danger" /> },
  ];

  return (
    <Section
      title="Select (custom dropdown)"
      subtitle="Custom-built. Trigger uses the TextField pill recipe. Popover matches trigger width. Per-option leading slot supports position badges, dots, numbers, icons — anything."
    >
      <Stack gap={5}>
        <Row label="position (badges)">
          <Select
            label="Player position"
            options={positionOptions}
            value={position}
            onChange={setPosition}
            hint="Type to search by name."
          />
        </Row>
        <Row label="priority (dots)">
          <Select
            label="Match priority"
            placeholder="Select priority"
            options={priorityOptions}
            value={priority}
            onChange={setPriority}
          />
        </Row>
        <Row label="error">
          <Select
            label="Required field"
            placeholder="Pick something"
            options={priorityOptions}
            value={null}
            onChange={() => {}}
            error="Please pick a priority."
          />
        </Row>
      </Stack>
    </Section>
  );
}

function PositionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid size-6 place-items-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
      {children}
    </span>
  );
}

function Dot({ tone }: { tone: "muted" | "primary" | "danger" }) {
  const toneClass =
    tone === "primary"
      ? "bg-primary"
      : tone === "danger"
        ? "bg-danger"
        : "bg-fg-muted";
  return <span className={`size-2.5 rounded-full ${toneClass}`} />;
}

function SectionCountrySelector() {
  const [country, setCountry] = useState<string | null>("GH");
  return (
    <Section
      title="CountrySelector"
      subtitle="Preset of Select with the bundled country list. Flag + name + dial code. Searchable."
    >
      <Stack gap={5}>
        <Row label="default (Ghana)">
          <CountrySelector
            label="Country"
            value={country}
            onChange={setCountry}
          />
        </Row>
        <Row label="empty + hint">
          <CountrySelector
            label="Where are you from?"
            value={null}
            onChange={() => {}}
            hint="We use this for fixture eligibility and zone mapping."
          />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionDateField() {
  const [matchDate, setMatchDate] = useState<Date | null>(
    new Date(2026, 4, 25),
  );
  return (
    <Section
      title="DateField"
      subtitle="Pill trigger + calendar in a Popover that matches the trigger's width. Pink-filled selected day, Today / Close footer."
    >
      <Stack gap={5}>
        <Row label="match date">
          <DateField
            label="Match date"
            value={matchDate}
            onChange={setMatchDate}
          />
        </Row>
        <Row label="empty + hint">
          <DateField
            label="Birthdate"
            placeholder="Pick a date"
            value={null}
            onChange={() => {}}
            hint="Used for age-group eligibility."
          />
        </Row>
        <Row label="error">
          <DateField
            label="Submission deadline"
            value={null}
            onChange={() => {}}
            error="Please pick a date."
          />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionDateTimeField() {
  const [kickoff, setKickoff] = useState<Date | null>(
    new Date(2026, 4, 25, 18, 30),
  );
  return (
    <Section
      title="DateTimeField"
      subtitle="Pill + calendar + 24h time row. One Date in, one Date out."
    >
      <Stack gap={5}>
        <Row label="kickoff">
          <DateTimeField
            label="Kickoff"
            value={kickoff}
            onChange={setKickoff}
          />
        </Row>
        <Row label="empty">
          <DateTimeField
            label="Reminder"
            value={null}
            onChange={() => {}}
            hint="Pick a date, then dial the time below the calendar."
          />
        </Row>
        <Row label="error">
          <DateTimeField
            label="Match start"
            value={null}
            onChange={() => {}}
            error="Kickoff is required."
          />
        </Row>
        <Row label="disabled">
          <DateTimeField
            label="Locked window"
            value={new Date(2026, 4, 25, 18, 30)}
            onChange={() => {}}
            disabled
          />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionSearchField() {
  const [query, setQuery] = useState("Hearts of");
  return (
    <Section
      title="SearchField"
      subtitle="TextField preset: magnifier left, clear × right when value is non-empty."
    >
      <Stack gap={5}>
        <Row label="with value">
          <SearchField
            label="Find a club"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery("")}
          />
        </Row>
        <Row label="empty">
          <SearchField
            label="Search players"
            value=""
            onChange={() => {}}
            onClear={() => {}}
            placeholder="Try a name or jersey number…"
          />
        </Row>
        <Row label="disabled">
          <SearchField
            label="Search archive"
            value="Asante Kotoko"
            onChange={() => {}}
            onClear={() => {}}
            disabled
          />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionOtpInput() {
  const [code, setCode] = useState("");
  const [bad, setBad] = useState("12");
  return (
    <Section
      title="OtpInput"
      subtitle="Six pill boxes. Auto-advance on type, backspace returns, paste fills left-to-right."
    >
      <Stack gap={5}>
        <Row label="6 digit">
          <OtpInput
            label="Verification code"
            value={code}
            onChange={setCode}
            hint="We texted a 6-digit code to your phone."
          />
        </Row>
        <Row label="error">
          <OtpInput
            label="Verification code"
            value={bad}
            onChange={setBad}
            error="That code didn't match. Try again."
          />
        </Row>
        <Row label="disabled">
          <OtpInput
            label="Locked"
            value="000000"
            onChange={() => {}}
            disabled
          />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionPhoneInput() {
  const [country, setCountry] = useState("GH");
  const [phone, setPhone] = useState("244123456");
  return (
    <Section
      title="PhoneInput"
      subtitle="Country chip + format-as-you-type. Value is digits-only; the dial code is tracked separately."
    >
      <Stack gap={5}>
        <Row label="GH default">
          <PhoneInput
            label="Phone number"
            country={country}
            onCountryChange={setCountry}
            value={phone}
            onChange={setPhone}
          />
        </Row>
        <Row label="empty">
          <PhoneInput
            label="Reachable on"
            country="NG"
            onCountryChange={() => {}}
            value=""
            onChange={() => {}}
            hint="We'll send a verification code by SMS."
          />
        </Row>
        <Row label="error">
          <PhoneInput
            label="Phone number"
            country="GH"
            onCountryChange={() => {}}
            value="012"
            onChange={() => {}}
            error="That number doesn't look right."
          />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionCheckbox() {
  const [tos, setTos] = useState(false);
  const [news, setNews] = useState(true);
  const [mixed, setMixed] = useState<boolean | "indeterminate">("indeterminate");
  return (
    <Section
      title="Checkbox"
      subtitle="Boolean + tri-state. The square fills brand pink when on."
    >
      <Stack gap={4}>
        <Row label="off">
          <Checkbox
            label="I accept the Terms of Service"
            hint="Required to register a club."
            checked={tos}
            onChange={setTos}
          />
        </Row>
        <Row label="on">
          <Checkbox
            label="Send me match-day reminders"
            checked={news}
            onChange={setNews}
          />
        </Row>
        <Row label="mixed">
          <Checkbox
            label="Notify on every fixture (some children)"
            checked={mixed}
            onChange={(b) => setMixed(b)}
          />
        </Row>
        <Row label="error">
          <Checkbox
            label="I agree to share my data"
            error="You must agree to continue."
            checked={false}
            onChange={() => {}}
          />
        </Row>
        <Row label="disabled">
          <Checkbox
            label="Locked option"
            checked
            onChange={() => {}}
            disabled
          />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionRadioGroup() {
  const [tier, setTier] = useState<"informal" | "formal" | "academy">("formal");
  return (
    <Section
      title="RadioGroup"
      subtitle="Card-row options. Selected row gains a primary border + raised surface."
    >
      <Stack gap={5}>
        <Row label="club tier">
          <RadioGroup
            label="Club tier"
            value={tier}
            onChange={setTier}
            options={[
              {
                value: "informal",
                label: "Informal",
                hint: "Friendly group, no fixed fixtures.",
              },
              {
                value: "formal",
                label: "Formal",
                hint: "Registered club with regular fixtures.",
              },
              {
                value: "academy",
                label: "Academy",
                hint: "Coaching-led player development pathway.",
              },
            ]}
          />
        </Row>
        <Row label="horizontal">
          <RadioGroup
            value="b"
            onChange={() => {}}
            orientation="horizontal"
            options={[
              { value: "a", label: "Home" },
              { value: "b", label: "Away" },
              { value: "c", label: "Neutral" },
            ]}
          />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionSwitch() {
  const [notify, setNotify] = useState(true);
  const [private_, setPrivate] = useState(false);
  return (
    <Section
      title="Switch"
      subtitle="On/off control. Settings-row variant when label + description are present."
    >
      <Stack gap={4}>
        <Row label="block">
          <Switch
            label="WhatsApp fixture alerts"
            description="Receive a message 24h before every match."
            checked={notify}
            onChange={setNotify}
          />
        </Row>
        <Row label="block off">
          <Switch
            label="Private profile"
            description="Hide your stats from public discovery."
            checked={private_}
            onChange={setPrivate}
          />
        </Row>
        <Row label="inline">
          <Switch
            checked={false}
            onChange={() => {}}
            label="Compact inline"
          />
        </Row>
        <Row label="disabled">
          <Switch
            checked
            onChange={() => {}}
            label="Locked"
            disabled
          />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionSlider() {
  const [skill, setSkill] = useState(72);
  const [stake, setStake] = useState(50);
  return (
    <Section
      title="Slider"
      subtitle="Single-thumb range. ←/→ step, Shift+←/→ jump by 10×, Home/End to bounds."
    >
      <Stack gap={5}>
        <Row label="skill">
          <Slider label="Player skill" value={skill} onChange={setSkill} />
        </Row>
        <Row label="stake">
          <Slider
            label="RP stake"
            min={0}
            max={1000}
            step={50}
            value={stake * 10}
            onChange={(n) => setStake(n / 10)}
            formatValue={(n) => `${n} RP`}
          />
        </Row>
        <Row label="disabled">
          <Slider
            label="Locked"
            value={30}
            onChange={() => {}}
            disabled
          />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionRangeSlider() {
  const [age, setAge] = useState<[number, number]>([16, 24]);
  return (
    <Section
      title="RangeSlider"
      subtitle="Two thumbs with enforced minimum gap. Click anywhere on the track to move the nearest thumb."
    >
      <Stack gap={5}>
        <Row label="age band">
          <RangeSlider
            label="Age band"
            value={age}
            onChange={setAge}
            min={10}
            max={40}
            minDistance={2}
            formatValue={(n) => `${n}y`}
          />
        </Row>
        <Row label="disabled">
          <RangeSlider
            label="Locked"
            value={[20, 30]}
            onChange={() => {}}
            disabled
          />
        </Row>
      </Stack>
    </Section>
  );
}

const POSITIONS = [
  { value: "gk", label: "Goalkeeper", description: "GK" },
  { value: "cb", label: "Centre Back", description: "CB" },
  { value: "fb", label: "Full Back", description: "LB / RB" },
  { value: "cm", label: "Centre Mid", description: "CM" },
  { value: "wg", label: "Winger", description: "LW / RW" },
  { value: "st", label: "Striker", description: "ST" },
  { value: "ss", label: "Second Striker", description: "SS" },
  { value: "cdm", label: "Defensive Mid", description: "CDM" },
] as const;

function SectionCombobox() {
  const [picks, setPicks] = useState<string[]>(["cm", "wg"]);
  return (
    <Section
      title="Combobox"
      subtitle="Multi-select tag picker. Backspace on empty input removes the last chip. ↑↓ + Enter to commit."
    >
      <Stack gap={5}>
        <Row label="positions">
          <Combobox
            label="Positions"
            value={picks}
            onChange={setPicks}
            options={POSITIONS.map((p) => ({
              value: p.value,
              label: p.label,
              description: p.description,
            }))}
            maxItems={4}
            hint="Up to 4 positions."
          />
        </Row>
        <Row label="error">
          <Combobox
            label="Required tags"
            value={[]}
            onChange={() => {}}
            options={POSITIONS.map((p) => ({ value: p.value, label: p.label }))}
            error="Pick at least one position."
          />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionFileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <Section
      title="FileUpload"
      subtitle="Dashed dropzone. Drag in or tap to open the native picker."
    >
      <Stack gap={5}>
        <Row label="multi">
          <FileUpload
            label="Evidence files"
            value={files}
            onChange={setFiles}
            accept=".png,.jpg,.pdf"
            maxSize={5 * 1024 * 1024}
            maxFiles={5}
            hint="Up to 5 files, 5 MB each."
          />
        </Row>
        <Row label="single">
          <FileUpload
            label="Match report"
            value={[]}
            onChange={() => {}}
            accept=".pdf"
            maxFiles={1}
          />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionImageUploader() {
  const [crest, setCrest] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  return (
    <Section
      title="ImageUploader"
      subtitle="Single-image preview. Square (crest), circle (avatar), or banner (16:5)."
    >
      <Stack gap={5}>
        <Row label="square crest">
          <ImageUploader
            label="Club crest"
            value={crest}
            onChange={setCrest}
            maxSize={2 * 1024 * 1024}
            hint="PNG or JPG, max 2 MB."
          />
        </Row>
        <Row label="circle avatar">
          <ImageUploader
            label="Profile photo"
            value={avatar}
            onChange={setAvatar}
            shape="circle"
            size="8rem"
          />
        </Row>
        <Row label="banner">
          <ImageUploader
            label="Cover banner"
            value={banner}
            onChange={setBanner}
            shape="banner"
          />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionTabs() {
  type TabKey = "overview" | "fixtures" | "stats" | "squad";
  const [tab, setTab] = useState<TabKey>("overview");
  return (
    <Section
      title="Tabs"
      subtitle="Pill-shaped segmented control. Active tab is a lifted card — no translate motion. Arrow keys navigate; Home/End jump to ends."
    >
      <Stack gap={4}>
        <Row label="default">
          <Tabs<TabKey>
            aria-label="Club view"
            value={tab}
            onChange={setTab}
            items={[
              { value: "overview", label: "Overview" },
              { value: "fixtures", label: "Fixtures" },
              { value: "stats", label: "Stats" },
              { value: "squad", label: "Squad" },
            ]}
          />
        </Row>
        <Row label="with icons">
          <Tabs<TabKey>
            aria-label="Club view (icons)"
            value={tab}
            onChange={setTab}
            items={[
              { value: "overview", label: "Overview", icon: <IconHeart /> },
              { value: "fixtures", label: "Fixtures", icon: <IconArrow /> },
              { value: "stats", label: "Stats", icon: <IconCheck /> },
              { value: "squad", label: "Squad", icon: <IconBell /> },
            ]}
          />
        </Row>
        <Row label="disabled item">
          <Tabs<TabKey>
            aria-label="Club view (with disabled)"
            value={tab}
            onChange={setTab}
            items={[
              { value: "overview", label: "Overview" },
              { value: "fixtures", label: "Fixtures" },
              { value: "stats", label: "Stats", disabled: true },
              { value: "squad", label: "Squad" },
            ]}
          />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionProgress() {
  const [pct, setPct] = useState(40);
  return (
    <Section
      title="Progress"
      subtitle="Linear progress bar. Smooth width transition for determinate; shimmer overlay for indeterminate."
    >
      <Stack gap={4}>
        <Row label="determinate">
          <Stack gap={2} className="w-full">
            <Progress value={pct} aria-label="Upload progress" />
            <HStack gap={2}>
              <Button
                size="sm"
                intent="secondary"
                onClick={() => setPct((v) => Math.max(0, v - 10))}
              >
                −10
              </Button>
              <Button
                size="sm"
                intent="secondary"
                onClick={() => setPct((v) => Math.min(100, v + 10))}
              >
                +10
              </Button>
              <span className="text-sm tabular-nums text-fg-muted">
                {pct}%
              </span>
            </HStack>
          </Stack>
        </Row>
        <Row label="sizes">
          <Stack gap={3} className="w-full">
            <Progress value={65} size="sm" aria-label="Small" />
            <Progress value={65} size="md" aria-label="Medium" />
            <Progress value={65} size="lg" aria-label="Large" />
          </Stack>
        </Row>
        <Row label="indeterminate">
          <Progress indeterminate aria-label="Loading" />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionToast() {
  return (
    <Section
      title="Toast"
      subtitle="Notification card. Five tones, auto-dismiss with a thin progress bar, hover or focus to pause. Entrance is opacity-only — no translate motion."
    >
      <Stack gap={4}>
        <Row label="static — tones">
          <Stack gap={2} className="w-full max-w-sm">
            <Toast
              tone="primary"
              title="Match saved"
              description="Lineups locked and synced to all participants."
            />
            <Toast
              tone="blue"
              title="Tournament posted"
              description="Eastern Belt Round 3 brackets are live."
            />
            <Toast
              tone="success"
              title="Result confirmed"
              description="Both clubs have verified the scoresheet."
            />
            <Toast
              tone="warning"
              title="Lineup conflict"
              description="Two players are listed for both squads."
            />
            <Toast
              tone="danger"
              title="Stake forfeited"
              description="No-show penalty applied — 250 RP locked."
            />
          </Stack>
        </Row>
        <Row label="queue (live)">
          <ToastProvider>
            <ToastQueueDemo />
          </ToastProvider>
        </Row>
      </Stack>
    </Section>
  );
}

function ToastQueueDemo() {
  const { push } = useToast();
  return (
    <HStack gap={2}>
      <Button
        size="sm"
        intent="primary"
        onClick={() =>
          push({
            tone: "primary",
            title: "Match saved",
            description: "Lineups locked.",
          })
        }
      >
        Primary
      </Button>
      <Button
        size="sm"
        intent="success"
        onClick={() =>
          push({
            tone: "success",
            title: "Result confirmed",
            description: "Both clubs verified.",
          })
        }
      >
        Success
      </Button>
      <Button
        size="sm"
        intent="danger"
        onClick={() =>
          push({
            tone: "danger",
            title: "Stake forfeited",
            description: "250 RP locked.",
          })
        }
      >
        Danger
      </Button>
    </HStack>
  );
}

function SectionBadge() {
  return (
    <Section
      title="Badge"
      subtitle="Non-interactive status indicator. Use Chip for clickable tags."
    >
      <Stack gap={3}>
        <Row label="intents">
          <Badge intent="neutral">Neutral</Badge>
          <Badge intent="primary">Primary</Badge>
          <Badge intent="success">Verified</Badge>
          <Badge intent="warning">Pending</Badge>
          <Badge intent="danger">Disputed</Badge>
        </Row>
        <Row label="sizes">
          <Badge size="sm" intent="success">
            sm
          </Badge>
          <Badge size="md" intent="success">
            md
          </Badge>
        </Row>
      </Stack>
    </Section>
  );
}

function SectionAvatar() {
  return (
    <Section
      title="Avatar"
      subtitle="Identity thumbnail. Derives initials from name; falls back to placeholder."
    >
      <Stack gap={3}>
        <Row label="sizes">
          <Avatar size="sm" name="Kwame Mensah" />
          <Avatar size="md" name="Kwame Mensah" />
          <Avatar size="lg" name="Kwame Mensah" />
          <Avatar size="xl" name="Kwame Mensah" />
        </Row>
        <Row label="interactive">
          <Avatar
            size="md"
            name="Derek Osei"
            interactive
            aria-label="View Derek Osei's profile"
          />
          <Avatar
            size="md"
            name="Ama Darko"
            interactive
            aria-label="View Ama Darko's profile"
          />
          <Avatar size="md" />
          <Avatar size="md" initials="FC" />
        </Row>
      </Stack>
    </Section>
  );
}

function SectionAtoms() {
  return (
    <Section title="Foundation atoms" subtitle="Spinner, Skeleton, Divider, Icon.">
      <Stack gap={4}>
        <Row label="spinner">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner size="xl" />
        </Row>
        <Row label="icon">
          <Icon size="sm">
            <path d="m5 12 5 5L20 7" />
          </Icon>
          <Icon size="md">
            <path d="m5 12 5 5L20 7" />
          </Icon>
          <Icon size="lg">
            <path d="m5 12 5 5L20 7" />
          </Icon>
          <Icon size="xl">
            <path d="m5 12 5 5L20 7" />
          </Icon>
        </Row>
        <Row label="skeleton">
          <Skeleton width={120} height={12} />
          <Skeleton width={80} height={12} />
          <Skeleton width={44} height={44} shape="pill" />
        </Row>
        <Row label="divider">
          <div className="w-full">
            <Divider />
          </div>
        </Row>
      </Stack>
    </Section>
  );
}

function SectionNotificationBell() {
  return (
    <Section
      title="NotificationBell"
      subtitle="Four badge states: empty · single-digit · double-digit · 99+. Badge uses brand pink (--primary), not danger-red."
    >
      <Stack gap={3}>
        <Row label="count">
          <NotificationBell unreadCount={0} />
          <NotificationBell unreadCount={3} />
          <NotificationBell unreadCount={42} />
          <NotificationBell unreadCount={100} />
        </Row>
        <Row label="labels">
          {([0, 3, 42, 100] as const).map((n) => (
            <div key={n} className="flex flex-col items-center gap-1.5">
              <NotificationBell unreadCount={n} />
              <span className="text-[11px] text-fg-subtle">
                {n === 0 ? "empty" : n < 10 ? "single" : n < 100 ? "double" : "99+"}
              </span>
            </div>
          ))}
        </Row>
      </Stack>
    </Section>
  );
}
