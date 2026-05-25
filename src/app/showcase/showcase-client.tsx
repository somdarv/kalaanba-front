"use client";

import { useState } from "react";
import { z } from "zod";
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
  BottomSheet,
  BottomNav,
  KeyboardFooter,
  Tooltip,
  Dialog,
  LiveSurface,
  Textarea,
  TextField,
  ThemeToggle,
  VStack,
  NotificationBell,
  Field,
  Form,
  FormFooter,
  FormSection,
  FormSubmitButton,
  List,
  ListItem,
  EmptyState,
  ErrorState,
  ScrollTo,
  ScrollControls,
  AppShell,
  SiteHeader,
  type ButtonIntent,
  type ButtonSize,
  type SelectOption,
} from "@/components/ui";
import { useTheme } from "@/components/providers/theme-provider";
import { MagnifyingGlass, EnvelopeSimple, Lock, User, House, Play, Bell, UserCircle } from "@phosphor-icons/react";

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
          <SectionBottomSheet />
          <SectionBottomNav />
          <SectionKeyboardFooter />
          <SectionTooltip />
          <SectionDialog />
          <SectionSkeleton />
          <SectionLiveSurface />
          <SectionForm />
          <SectionList />
          <SectionStates />
          <SectionAppShell />
          <SectionScrollTo />
          <SectionBadge />
          <SectionAvatar />
          <SectionNotificationBell />
        </VStack>
      </main>
      <ScrollControls targets={["top", "middle", "bottom"]} />
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

function SectionBottomSheet() {
  const [open, setOpen] = useState(false);
  const [openLong, setOpenLong] = useState(false);
  return (
    <Section
      title="BottomSheet"
      subtitle="Mobile-first modal surface. Bottom-anchored with drag-to-dismiss on phones; centered dialog on tablets and up. Fade-in only — drag is the one place real translateY is allowed because it follows the finger 1:1."
    >
      <Stack gap={3}>
        <Row label="basic">
          <HStack gap={2}>
            <Button onClick={() => setOpen(true)}>Open sheet</Button>
            <Button intent="secondary" onClick={() => setOpenLong(true)}>
              Open long sheet
            </Button>
          </HStack>
        </Row>
      </Stack>

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="Confirm result"
        description="Both clubs need to verify the final score before RP is paid out."
      >
        <Stack gap={3}>
          <p className="text-sm text-fg-muted">
            Once confirmed, the result becomes part of both clubs&apos;
            verified record. This action cannot be undone.
          </p>
          <HStack gap={2} className="justify-end">
            <Button intent="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </HStack>
        </Stack>
      </BottomSheet>

      <BottomSheet
        open={openLong}
        onOpenChange={setOpenLong}
        title="Match details"
        description="Scroll inside the sheet — body scroll is locked."
      >
        <Stack gap={3}>
          {Array.from({ length: 24 }).map((_, i) => (
            <Card key={i}>
              <Card.Content>
                <div className="text-sm font-medium text-fg">
                  Event #{i + 1}
                </div>
                <div className="mt-1 text-xs text-fg-muted">
                  Sample row to demonstrate inner scrolling and overscroll
                  containment.
                </div>
              </Card.Content>
            </Card>
          ))}
        </Stack>
      </BottomSheet>
    </Section>
  );
}

function SectionBottomNav() {
  type Tab = "home" | "play" | "buzz" | "you";
  const [tab, setTab] = useState<Tab>("home");
  return (
    <Section
      title="BottomNav"
      subtitle="Thumb-zone tab bar. Visible only on <lg viewports; hidden on desktop where top/side nav takes over. 44×44 tap targets, safe-area-padded. Try resizing the window."
    >
      <Stack gap={3}>
        <Row label="preview (live, fixed bottom)">
          <p className="text-sm text-fg-muted">
            The nav is mounted below — look at the bottom of your viewport.
            Active item is{" "}
            <span className="font-semibold text-fg">{tab}</span>.
          </p>
        </Row>
      </Stack>
      <BottomNav<Tab>
        value={tab}
        onChange={setTab}
        items={[
          { value: "home", label: "Home", icon: <House size={22} weight="regular" /> },
          { value: "play", label: "Play", icon: <Play size={22} weight="regular" /> },
          { value: "buzz", label: "Buzz", icon: <Bell size={22} weight="regular" />, badge: 3 },
          { value: "you", label: "You", icon: <UserCircle size={22} weight="regular" /> },
        ]}
      />
    </Section>
  );
}

function SectionKeyboardFooter() {
  const [value, setValue] = useState("");
  return (
    <Section
      title="KeyboardFooter"
      subtitle="Sticky CTA bar that floats above the on-screen keyboard. Required for OTP / login / single-step forms. The container is sticky-positioned and safe-area-padded; pair with interactive-widget=resizes-content viewport meta."
    >
      <div className="relative max-h-80 overflow-y-auto rounded-card border border-border bg-bg">
        <Stack gap={3} className="p-4">
          <TextField
            label="Your message"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type something…"
            inputMode="text"
            enterKeyHint="send"
            autoComplete="off"
          />
          {Array.from({ length: 12 }).map((_, i) => (
            <p key={i} className="text-sm text-fg-muted">
              Filler line {i + 1} — scroll this container to see the footer
              stay anchored.
            </p>
          ))}
        </Stack>
        <KeyboardFooter>
          <HStack gap={2} className="justify-end">
            <Button intent="ghost" size="sm">
              Cancel
            </Button>
            <Button size="sm" disabled={!value}>
              Send
            </Button>
          </HStack>
        </KeyboardFooter>
      </div>
    </Section>
  );
}

function SectionTooltip() {
  return (
    <Section
      title="Tooltip"
      subtitle="Hover/focus label for icon-only or terse controls. Opacity fade only. Use for *supplementary* hints — the child still needs its own aria-label."
    >
      <Stack gap={3}>
        <Row label="sides">
          <HStack gap={3}>
            <Tooltip label="Top tooltip" side="top">
              <Button intent="secondary" size="sm">
                Top
              </Button>
            </Tooltip>
            <Tooltip label="Bottom tooltip" side="bottom">
              <Button intent="secondary" size="sm">
                Bottom
              </Button>
            </Tooltip>
            <Tooltip label="Left" side="left">
              <Button intent="secondary" size="sm">
                Left
              </Button>
            </Tooltip>
            <Tooltip label="Right" side="right">
              <Button intent="secondary" size="sm">
                Right
              </Button>
            </Tooltip>
          </HStack>
        </Row>
        <Row label="on an icon button">
          <Tooltip label="Search the directory">
            <Button intent="ghost" size="sm" aria-label="Search">
              <MagnifyingGlass size={16} weight="bold" />
            </Button>
          </Tooltip>
        </Row>
      </Stack>
    </Section>
  );
}

function SectionDialog() {
  const [open, setOpen] = useState(false);
  const [openDanger, setOpenDanger] = useState(false);
  return (
    <Section
      title="Dialog"
      subtitle="Centered modal for all viewports. Heavy backdrop blur — the world outside the card is unmistakably out of focus. No drag, no bottom anchoring — that's BottomSheet's job."
    >
      <Stack gap={3}>
        <Row label="basic">
          <HStack gap={2}>
            <Button onClick={() => setOpen(true)}>Open dialog</Button>
            <Button intent="secondary" onClick={() => setOpenDanger(true)}>
              Destructive
            </Button>
          </HStack>
        </Row>
      </Stack>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Invite teammates"
        description="They'll get an email with a link to join your club."
        footer={
          <>
            <Button intent="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Send invites</Button>
          </>
        }
      >
        <Stack gap={3}>
          <TextField
            label="Email addresses"
            placeholder="kofi@example.com, ama@example.com"
            autoFocus
          />
          <p className="text-xs text-fg-muted">
            Each invitee can choose their role after they sign up.
          </p>
        </Stack>
      </Dialog>

      <Dialog
        open={openDanger}
        onOpenChange={setOpenDanger}
        title="Delete this match?"
        description="This permanently removes the fixture, its events, and any pending RP. This cannot be undone."
        size="sm"
        footer={
          <>
            <Button intent="ghost" onClick={() => setOpenDanger(false)}>
              Cancel
            </Button>
            <Button intent="danger" onClick={() => setOpenDanger(false)}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-fg-muted">
          Make sure both clubs agree before deleting — there is no recovery
          path.
        </p>
      </Dialog>
    </Section>
  );
}

function SectionSkeleton() {
  return (
    <Section
      title="Skeleton"
      subtitle="Cold-load placeholder. Animated background-position only — no transform. Pauses for reduced-motion. Use composite recipes (Text, Avatar, Button, Card) instead of stacking primitives by hand."
    >
      <Stack gap={4}>
        <Row label="primitives">
          <HStack gap={3} className="items-center">
            <Skeleton width={120} height={12} />
            <Skeleton width={80} height={12} />
            <Skeleton width={44} height={44} shape="circle" />
            <Skeleton width={120} height={32} shape="pill" />
          </HStack>
        </Row>
        <Row label="text — 3 lines">
          <div className="w-full max-w-md">
            <Skeleton.Text lines={3} />
          </div>
        </Row>
        <Row label="avatar sizes">
          <HStack gap={3} className="items-center">
            <Skeleton.Avatar size="sm" />
            <Skeleton.Avatar size="md" />
            <Skeleton.Avatar size="lg" />
            <Skeleton.Avatar size="xl" />
          </HStack>
        </Row>
        <Row label="button">
          <HStack gap={3} className="items-center">
            <Skeleton.Button size="sm" width="6rem" />
            <Skeleton.Button size="md" width="8rem" />
            <Skeleton.Button size="lg" width="10rem" />
          </HStack>
        </Row>
        <Row label="card composite">
          <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
            <Skeleton.Card />
            <Skeleton.Card withAvatar={false} lines={3} />
          </div>
        </Row>
      </Stack>
    </Section>
  );
}

function SectionLiveSurface() {
  return (
    <Section
      title="LiveSurface"
      subtitle="Opt-in ambient surface treatment. Four variants — tinted (static wash), aurora (drifting blobs), mesh (multi-stop radial), glass (frosted). Decorative; not used by default primitives. Drift pauses under prefers-reduced-motion."
    >
      <Stack gap={4}>
        <Row label="tinted (static)">
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
            <LiveSurface variant="tinted" toneA="primary">
              <div className="text-sm font-semibold text-fg">Primary wash</div>
              <p className="mt-1 text-xs text-fg-muted">
                Single corner radial. Calmest.
              </p>
            </LiveSurface>
            <LiveSurface variant="tinted" toneA="accent" intensity={18}>
              <div className="text-sm font-semibold text-fg">Accent wash</div>
              <p className="mt-1 text-xs text-fg-muted">
                intensity=18 — stronger tint.
              </p>
            </LiveSurface>
            <LiveSurface variant="tinted" toneA="success" intensity={10}>
              <div className="text-sm font-semibold text-fg">Success wash</div>
              <p className="mt-1 text-xs text-fg-muted">
                intensity=10 — barely there.
              </p>
            </LiveSurface>
          </div>
        </Row>
        <Row label="aurora (animated)">
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            <LiveSurface variant="aurora" toneA="primary" toneB="accent">
              <div className="text-sm font-semibold text-fg">
                Primary × Accent
              </div>
              <p className="mt-1 text-xs text-fg-muted">
                Two soft blobs drift slowly. Default pairing.
              </p>
            </LiveSurface>
            <LiveSurface variant="aurora" toneA="warning" toneB="danger">
              <div className="text-sm font-semibold text-fg">
                Warning × Danger
              </div>
              <p className="mt-1 text-xs text-fg-muted">
                Tonal mixing isn&apos;t restricted — but use sparingly.
              </p>
            </LiveSurface>
          </div>
        </Row>
        <Row label="mesh (animated, premium)">
          <LiveSurface variant="mesh" toneA="primary" toneB="accent" className="w-full">
            <div className="text-sm font-semibold text-fg">
              Multi-stop radial mesh
            </div>
            <p className="mt-1 text-xs text-fg-muted">
              Two layers in opposite drift. The richest variant — save it
              for hero surfaces, premium cards, the one wow moment.
            </p>
          </LiveSurface>
        </Row>
        <Row label="glass (frosted, static)">
          {/* Glass is best seen against a busy background. Stack it on a
              tinted surface so the blur has something to chew on. */}
          <div className="relative w-full">
            <LiveSurface variant="mesh" toneA="primary" toneB="accent" className="h-40">
              <span aria-hidden />
            </LiveSurface>
            <div className="pointer-events-none absolute inset-0 grid place-items-center p-4">
              <LiveSurface
                variant="glass"
                className="pointer-events-auto w-full max-w-xs"
              >
                <div className="text-sm font-semibold text-fg">
                  Frosted glass
                </div>
                <p className="mt-1 text-xs text-fg-muted">
                  Translucent fill + backdrop-blur + hairline top edge.
                  Best for chrome floating over rich backgrounds.
                </p>
              </LiveSurface>
            </div>
          </div>
        </Row>
      </Stack>
    </Section>
  );
}

function SectionForm() {
  return (
    <Section
      title="Form atoms"
      subtitle="Field (label + hint + error + required/optional). Form (RHF + Zod + scroll-to-first-error). FormSection. FormFooter. FormSubmitButton."
    >
      <Stack gap={4}>
        <Row label="field — variants">
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Email" hint="We'll never share it.">
              <TextField type="email" placeholder="you@kalaanba.gh" />
            </Field>
            <Field label="Display name" required>
              <TextField placeholder="Kwame Mensah" />
            </Field>
            <Field label="Nickname" optional>
              <TextField placeholder="The Maestro" />
            </Field>
            <Field
              label="Password"
              error="Must be at least 8 characters."
            >
              <PasswordField placeholder="••••••••" />
            </Field>
            <Field label="City" size="sm" hint="Compact density.">
              <TextField placeholder="Accra" />
            </Field>
            <Field label="Disabled" disabled hint="Cannot edit right now.">
              <TextField placeholder="—" disabled />
            </Field>
          </div>
        </Row>

        <Row label="form — sign in">
          <SignInFormDemo />
        </Row>

        <Row label="form — sectioned">
          <SectionedFormDemo />
        </Row>
      </Stack>
    </Section>
  );
}

function SignInFormDemo() {
  const schema = z.object({
    email: z.string().email("Enter a valid email."),
    password: z.string().min(8, "At least 8 characters."),
  });
  type Values = { email: string; password: string };
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  return (
    <div className="w-full max-w-md">
      <Form<Values>
        schema={schema}
        defaultValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 700));
          setSubmittedAt(new Date().toLocaleTimeString());
          // eslint-disable-next-line no-console
          console.log("submitted", values);
        }}
      >
        {(form) => {
          const errors = form.formState.errors;
          return (
            <>
              <Field label="Email" required error={errors.email?.message}>
                <TextField
                  type="email"
                  autoComplete="email"
                  placeholder="you@kalaanba.gh"
                  {...form.register("email")}
                />
              </Field>
              <Field
                label="Password"
                required
                error={errors.password?.message}
              >
                <PasswordField
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...form.register("password")}
                />
              </Field>
              <FormFooter sticky={false}>
                <FormSubmitButton>Sign in</FormSubmitButton>
              </FormFooter>
              {submittedAt ? (
                <p className="text-xs text-fg-muted">
                  Submitted at {submittedAt}. Check console.
                </p>
              ) : null}
            </>
          );
        }}
      </Form>
    </div>
  );
}

function SectionedFormDemo() {
  const schema = z.object({
    fullName: z.string().min(2, "Too short."),
    phone: z.string().min(6, "Too short."),
    bio: z.string().max(140, "Keep it under 140 characters."),
  });
  type Values = { fullName: string; phone: string; bio: string };

  return (
    <div className="w-full max-w-2xl">
      <Form<Values>
        schema={schema}
        defaultValues={{ fullName: "", phone: "", bio: "" }}
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 500));
          // eslint-disable-next-line no-console
          console.log("profile", values);
        }}
      >
        {(form) => {
          const errors = form.formState.errors;
          return (
            <>
              <FormSection
                title="Identity"
                description="Public to your club staff."
              >
                <Field
                  label="Full name"
                  required
                  error={errors.fullName?.message}
                >
                  <TextField
                    placeholder="Ama Darko"
                    {...form.register("fullName")}
                  />
                </Field>
                <Field
                  label="Phone"
                  required
                  hint="Used for OTP."
                  error={errors.phone?.message}
                >
                  <TextField
                    inputMode="tel"
                    placeholder="+233 24 ..."
                    {...form.register("phone")}
                  />
                </Field>
              </FormSection>

              <FormSection
                title="About"
                description="Optional. Shows on your profile."
                collapsible
                defaultOpen={false}
              >
                <Field
                  label="Bio"
                  optional
                  hint="Max 140 characters."
                  error={errors.bio?.message}
                >
                  <Textarea
                    rows={3}
                    placeholder="What do you bring to the pitch?"
                    {...form.register("bio")}
                  />
                </Field>
              </FormSection>

              <FormFooter sticky={false}>
                <FormSubmitButton>Save profile</FormSubmitButton>
              </FormFooter>
            </>
          );
        }}
      </Form>
    </div>
  );
}

function SectionList() {
  const [selectedTeam, setSelectedTeam] = useState("kotoko");
  const teams = [
    { id: "kotoko", name: "Asante Kotoko", desc: "Premier · Kumasi", initials: "AK" },
    { id: "hearts", name: "Accra Hearts of Oak", desc: "Premier · Accra", initials: "HO" },
    { id: "aduana", name: "Aduana Stars", desc: "Premier · Dormaa", initials: "AS" },
    { id: "medeama", name: "Medeama SC", desc: "Premier · Tarkwa", initials: "MS" },
  ];

  return (
    <Section
      title="List & ListItem"
      subtitle="Vertical record collection. ListItem auto-composes the pressable recipe when interactive (button or anchor). Three variants: plain, separated, surface."
    >
      <Stack gap={5}>
        <Row label="surface · interactive">
          <List variant="surface" aria-label="Select your team" className="w-full max-w-md">
            {teams.map((t) => (
              <ListItem
                key={t.id}
                leading={<Avatar size="sm" name={t.name} initials={t.initials} />}
                title={t.name}
                description={t.desc}
                selected={selectedTeam === t.id}
                onClick={() => setSelectedTeam(t.id)}
              />
            ))}
          </List>
        </Row>

        <Row label="separated · trailing">
          <List variant="separated" className="w-full max-w-md">
            <ListItem
              leading={<Icon><path d="M12 2v20M2 12h20" /></Icon>}
              title="Notifications"
              description="Push, email, and SMS preferences."
              trailing={<Badge intent="primary">3</Badge>}
              onClick={() => undefined}
            />
            <ListItem
              leading={<Icon><path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6" /></Icon>}
              title="Appearance"
              description="Light, dark, or system."
              trailing={<span className="text-sm text-fg-muted">System</span>}
              onClick={() => undefined}
            />
            <ListItem
              leading={<Icon><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z" /><path d="M12 7v5l3 3" /></Icon>}
              title="Match reminders"
              description="Get notified 30 minutes before kick-off."
              onClick={() => undefined}
            />
          </List>
        </Row>

        <Row label="plain · presentational">
          <List variant="plain" className="w-full max-w-md">
            <ListItem
              meta="Match 12"
              title="Hearts of Oak vs Kotoko"
              description="Sat · 4:00 PM · Accra Sports Stadium"
              trailing={<Badge intent="success">Verified</Badge>}
            />
            <ListItem
              meta="Match 13"
              title="Aduana Stars vs Medeama"
              description="Sun · 3:30 PM · Dormaa Park"
              trailing={<Badge intent="warning">Pending</Badge>}
            />
            <ListItem
              meta="Match 14"
              title="King Faisal vs Berekum Chelsea"
              description="Sun · 6:00 PM · Baba Yara Stadium"
              trailing={<Badge intent="neutral">TBD</Badge>}
            />
          </List>
        </Row>

        <Row label="as anchor">
          <List variant="surface" className="w-full max-w-md">
            <ListItem
              as="a"
              href="#profile"
              leading={<Avatar size="sm" name="Kwame Mensah" />}
              title="Kwame Mensah"
              description="Profile · Settings · Account"
            />
            <ListItem
              as="a"
              href="#help"
              leading={<Icon><path d="M9 12a3 3 0 1 1 5.5 1.65L12 16M12 19v.01" /></Icon>}
              title="Help & support"
              description="Documentation, FAQs, contact."
            />
          </List>
        </Row>
      </Stack>
    </Section>
  );
}

function SectionStates() {
  const [retryCount, setRetryCount] = useState(0);
  const fakeRetry = () =>
    new Promise<void>((resolve) =>
      setTimeout(() => {
        setRetryCount((n) => n + 1);
        resolve();
      }, 900),
    );

  return (
    <Section
      title="EmptyState & ErrorState"
      subtitle="Fallback surfaces for empty lists and failed fetches. Never silent — every list slot gets one."
    >
      <Stack gap={5}>
        <Row label="empty · md">
          <div className="w-full rounded-card border border-border bg-surface">
            <EmptyState
              title="No matches scheduled yet"
              description="When your club adds a fixture, it'll appear here with kick-off time and venue."
              action={
                <Button intent="primary" leadingIcon={<IconPlus />}>
                  Schedule match
                </Button>
              }
              secondaryAction={
                <Button intent="ghost">Browse templates</Button>
              }
            />
          </div>
        </Row>

        <Row label="empty · sm">
          <div className="w-full max-w-md rounded-card border border-border bg-surface">
            <EmptyState
              size="sm"
              title="No notifications"
              description="You're all caught up."
            />
          </div>
        </Row>

        <Row label="error · with retry">
          <div className="w-full rounded-card border border-border bg-surface">
            <ErrorState
              description="We couldn't reach the fixtures service. Check your connection and try again."
              onRetry={fakeRetry}
              secondaryAction={<Button intent="ghost">Contact support</Button>}
            />
            {retryCount > 0 ? (
              <p className="pb-6 text-center text-xs text-fg-muted">
                Retried {retryCount}× — still failing in this demo.
              </p>
            ) : null}
          </div>
        </Row>

        <Row label="error · with details">
          <div className="w-full rounded-card border border-border bg-surface">
            <ErrorState
              size="sm"
              title="Couldn't load standings"
              description="The competition service returned an unexpected response."
              onRetry={fakeRetry}
              details={`TypeError: Cannot read properties of undefined (reading 'rows')
    at parseStandings (standings.ts:42:18)
    at Object.fetchStandings (api.ts:118:12)
    at async Page (page.tsx:21:20)`}
            />
          </div>
        </Row>
      </Stack>
    </Section>
  );
}

function SectionAppShell() {
  return (
    <Section
      title="AppShell & SiteHeader"
      subtitle="Page layout chassis. Sticky header + main content + optional mobile BottomNav. SiteHeader is the pre-composed default; AppShell takes any header node."
    >
      <Stack gap={4}>
        <Row label="default">
          <div className="w-full overflow-hidden rounded-card border border-border">
            <AppShell
              header={
                <SiteHeader
                  nav={
                    <HStack gap={1}>
                      <LinkButton href="#" intent="ghost" size="sm">
                        Home
                      </LinkButton>
                      <LinkButton href="#" intent="ghost" size="sm">
                        Fixtures
                      </LinkButton>
                      <LinkButton href="#" intent="ghost" size="sm">
                        Clubs
                      </LinkButton>
                      <LinkButton href="#" intent="ghost" size="sm">
                        Standings
                      </LinkButton>
                    </HStack>
                  }
                />
              }
              className="min-h-70 rounded-card"
            >
              <Stack gap={2}>
                <h3 className="font-display text-lg font-semibold">
                  Page content
                </h3>
                <p className="text-sm text-fg-muted">
                  Everything below the sticky header renders here. On mobile,
                  the optional BottomNav slot floats above this area with a
                  safe-area-aware bottom inset.
                </p>
              </Stack>
            </AppShell>
          </div>
        </Row>

        <Row label="header-only">
          <div className="w-full overflow-hidden rounded-card border border-border">
            <SiteHeader />
          </div>
        </Row>
      </Stack>
    </Section>
  );
}

function SectionScrollTo() {
  return (
    <Section
      title="ScrollTo & ScrollControls"
      subtitle="Floating utility buttons that smooth-scroll to top, middle, or bottom. Auto-show/hide based on scroll distance. A live cluster is already attached to this page — scroll to see it appear at the bottom-right."
    >
      <Stack gap={4}>
        <Row label="api">
          <div className="space-y-2 text-sm text-fg-muted">
            <p>
              <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">
                {"<ScrollTo to=\"top|middle|bottom|<number>\" />"}
              </code>
              {" "}— single floating button.
            </p>
            <p>
              <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">
                {"<ScrollControls targets={[\"top\", \"bottom\"]} position=\"bottom-right\" />"}
              </code>
              {" "}— stacked cluster.
            </p>
            <p>
              Both use native{" "}
              <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">
                window.scrollTo({"{behavior: \"smooth\"}"})
              </code>{" "}
              which respects <code>prefers-reduced-motion</code>.
            </p>
          </div>
        </Row>

        <Row label="live">
          <p className="text-sm text-fg-muted">
            ✨ A <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">{"<ScrollControls targets={[\"top\", \"middle\", \"bottom\"]} />"}</code>
            {" "}is currently mounted on this showcase page. Try scrolling — buttons
            fade in with a soft pop when you're away from the target.
          </p>
        </Row>
      </Stack>
    </Section>
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
