"use client";

import { useState } from "react";
import {
  KxAvatar,
  KxBadge,
  KxButton,
  KxCard,
  KxIconButton,
  KxProgress,
  KxSkeleton,
  KxSwitch,
  KxTabs,
  KxToast,
  KxTooltip,
} from "@/components/_archive/showcase/primitives";
import {
  KxCheckbox,
  KxDatePicker,
  KxFileInput,
  KxNumberInput,
  KxOTPInput,
  KxPasswordField,
  KxRadioGroup,
  KxSelect,
  KxSlider,
  KxTextField,
  KxTextarea,
} from "@/components/_archive/showcase/inputs";
import { KxTopbar } from "@/components/_archive/showcase/topbar";
import { KxStatTile } from "@/components/_archive/showcase/stat-tile";
import { KxPlayerProfileBlock } from "@/components/_archive/showcase/player-profile-block";
import { KxThemeToggle } from "@/components/_archive/showcase/theme-toggle";
import {
  KxAlert,
  KxChipGroup,
  KxFixtureCard,
  KxFixtureCardCompact,
  KxFixtureCardVertical,
  KxKebabButton,
  KxMenu,
  KxModal,
  KxPagination,
  KxTable,
  type Column,
} from "@/components/_archive/showcase/extras";
import {
  KxAuroraCard,
  KxExperimentLabel,
  KxMeshCard,
  KxTintedCard,
} from "@/components/_archive/showcase/experiments";
import {
  KxFormPills,
  KxStatTileSpark,
  KxFixtureSkeleton,
  KxRowSkeleton,
  KxStatSkeleton,
} from "@/components/_archive/showcase/data";
import {
  KxTabsUnderline,
  KxDrawer,
  KxCommandPalette,
  KxEmptyState,
  type CommandItem,
} from "@/components/_archive/showcase/surfaces";
import {
  KxTicker,
  KxOdometer,
  KxToastQueueProvider,
  KxMomentumBar,
  useKxToast,
} from "@/components/_archive/showcase/motion";
import {
  KxScorePicker,
  KxLeagueTable,
  KxMatchEventTimeline,
  type LeagueRow,
  type MatchEvent,
} from "@/components/_archive/showcase/match";
import {
  KxClubCrest,
  KxAvatarStack,
  KxPlayerCard,
} from "@/components/_archive/showcase/roster";
import {
  KxStepper,
  KxFixtureRow,
  KxStatDelta,
  type StepItem,
} from "@/components/_archive/showcase/flow";
import {
  ArrowRight as PhArrowRight,
  CalendarBlank,
  Check,
  DeviceMobile,
  Globe,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Share,
  Trash,
  Trophy,
} from "@phosphor-icons/react";

/* Thin Phosphor wrappers — bold variant, sized for inputs/buttons. */
const ArrowRight  = () => <PhArrowRight   size={16} weight="bold" />;
const PlusIcon    = () => <Plus           size={16} weight="bold" />;
const CheckIcon   = () => <Check          size={18} weight="bold" />;
const CalendarIcon = () => <CalendarBlank size={18} weight="bold" />;
const TrophyIcon  = () => <Trophy         size={18} weight="bold" />;
const SearchIcon  = () => <MagnifyingGlass size={18} weight="bold" />;
const PhoneIcon   = () => <DeviceMobile   size={18} weight="bold" />;
const GlobeIcon   = () => <Globe          size={16} weight="bold" />;

function PositionDot({ tone }: { tone: "pink" | "blue" | "amber" | "green" }) {
  const color =
    tone === "pink" ? "var(--kx-pink)"
    : tone === "blue" ? "var(--kx-blue)"
    : tone === "amber" ? "var(--kx-warning)"
    : "var(--kx-success)";
  return (
    <span
      aria-hidden
      className="block h-2.5 w-2.5 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

const SWATCHES = [
  { name: "Primary",  hex: "#f55694", bg: "#f55694", fg: "#ffffff" },
  { name: "Accent",   hex: "#56b7f5", bg: "#56b7f5", fg: "#0b101d" },
  { name: "Card 2",   hex: "var(--kx-card-2)", bg: "var(--kx-card-2)", fg: "var(--kx-fg)" },
  { name: "Foreground", hex: "var(--kx-fg)", bg: "var(--kx-fg)", fg: "var(--kx-bg)" },
  { name: "Muted",    hex: "var(--kx-fg-muted)", bg: "var(--kx-fg-muted)", fg: "var(--kx-bg)" },
];

export default function ShowcasePage() {
  const [tab, setTab] = useState<"overview" | "fixtures" | "players">("overview");
  const [notify, setNotify] = useState(true);
  const [progress, setProgress] = useState(64);
  const [showToast, setShowToast] = useState(false);

  // Inputs section state
  const [club, setClub] = useState("Bantama Boys");
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");
  const [bio, setBio] = useState("Forward with a midfielder's brain. Plays for the badge, not the boot deal.");
  const [country, setCountry] = useState<string | null>("gh");
  const [position, setPosition] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(new Date());
  const [age, setAge] = useState(24);
  const [otp, setOtp] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [tier, setTier] = useState<"informal" | "formal" | "academy">("informal");
  const [skill, setSkill] = useState(72);

  // Extras section state
  const [page, setPage] = useState(3);
  const [chipFilter, setChipFilter] = useState<string[]>(["upcoming"]);
  const [modalOpen, setModalOpen] = useState(false);
  const [alerts, setAlerts] = useState({ info: true, success: true, warning: true, danger: true });

  // Track-1/2/3 state
  const [pickedScore, setPickedScore] = useState<{ home: number; away: number }>({ home: 2, away: 1 });
  const [tab2, setTab2] = useState<"all" | "live" | "finished">("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [score, setScore] = useState(127);
  const [momentum, setMomentum] = useState(0.32);

  const COMMANDS: CommandItem[] = [
    { id: "t1", label: "Bantama Boys",     hint: "Greater Accra League", group: "Teams" },
    { id: "t2", label: "Sagnarigu Stars",  hint: "Northern Premier",     group: "Teams" },
    { id: "p1", label: "Richard Somda",    hint: "Forward · Bantama Boys", group: "Players" },
    { id: "p2", label: "Derek Osei",       hint: "Midfielder · Cape Coast", group: "Players" },
    { id: "f1", label: "BTM vs SAG",       hint: "Sat · 19:30",           group: "Fixtures" },
    { id: "f2", label: "CCX vs TAM",       hint: "Live · 67'",            group: "Fixtures" },
  ];

  return (
    <KxToastQueueProvider>
      <main className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
        {/* ============== HEADER ============== */}
        <header
          className="flex items-start justify-between gap-4"
          style={{ animation: "kx-rise 0.5s var(--kx-ease-out) both" }}
        >
          <div>
            <KxBadge tone="primary" withDot>Foundation</KxBadge>
            <h1 className="mt-4 [font-family:var(--kx-font-display)] text-4xl font-extrabold leading-[1.05] tracking-tight text-[var(--kx-fg)] sm:text-5xl">
              Kalaanba — UI Kit
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-[var(--kx-fg-muted)]">
              An isolated foundation built strictly from the brand palette. Soft surfaces,
              generous radii, quiet icons that animate on intent. Light &amp; dark.
            </p>
          </div>
          <KxThemeToggle />
        </header>

        {/* ============== TOPBAR (the screenshot) ============== */}
        <Section title="Topbar" caption="Pill search · theme · notification with live dot · avatar">
          <KxTopbar />
        </Section>

        {/* ============== PALETTE ============== */}
        <Section title="Palette" caption="Only what's in the brand. No extras.">
          <KxCard tone="surface" padded="lg">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {SWATCHES.map((s) => (
                <div key={s.name} className="flex flex-col items-center text-center">
                  <div
                    className="h-24 w-24 rounded-[var(--kx-r-tile)] shadow-[var(--kx-shadow-md)]"
                    style={{ background: s.bg }}
                    aria-hidden
                  />
                  <div className="mt-3 text-sm font-semibold text-[var(--kx-fg)]">{s.name}</div>
                  <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--kx-fg-muted)]">
                    {s.hex}
                  </div>
                </div>
              ))}
            </div>
          </KxCard>
        </Section>

        {/* ============== HERO COMPOSITION (Player Profile + 9.6 tile) ============== */}
        <Section title="Composition" caption="Recreating the Player Profile + score tile from the design language.">
          <KxCard tone="surface" padded="lg" className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
            <KxPlayerProfileBlock
              name="Richard Somda"
              bio="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida."
            />
            <KxStatTile value={9.6} label="Match Rating" />
          </KxCard>
        </Section>

        {/* ============== BUTTONS ============== */}
        <Section title="Buttons" caption="Subtle icon nudge on hover · soft scale on press · pink shadow.">
          <KxCard padded="lg">
            <div className="flex flex-wrap items-center gap-3">
              <KxButton leadingIcon={<PlusIcon />}>Create club</KxButton>
              <KxButton variant="blue" trailingIcon={<ArrowRight />}>Open dashboard</KxButton>
              <KxButton variant="secondary" leadingIcon={<CalendarIcon />}>Schedule fixture</KxButton>
              <KxButton variant="ghost">Save draft</KxButton>
              <KxButton loading>Publishing</KxButton>
              <KxButton size="sm" variant="secondary">Small</KxButton>
              <KxButton size="lg" trailingIcon={<ArrowRight />}>Large</KxButton>
              <KxButton disabled>Disabled</KxButton>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <KxIconButton variant="primary" aria-label="Add">
                <PlusIcon />
              </KxIconButton>
              <KxIconButton variant="blue" aria-label="Confirm">
                <CheckIcon />
              </KxIconButton>
              <KxIconButton variant="soft" aria-label="Trophy">
                <TrophyIcon />
              </KxIconButton>
              <KxIconButton variant="ghost" aria-label="Search">
                <SearchIcon />
              </KxIconButton>
              <KxTooltip label="Adds a new fixture">
                <KxIconButton variant="soft" aria-label="Add fixture">
                  <CalendarIcon />
                </KxIconButton>
              </KxTooltip>
            </div>
          </KxCard>
        </Section>

        {/* ============== BADGES & AVATARS ============== */}
        <Section title="Badges &amp; avatars" caption="Status, identity, signal. Quiet by default.">
          <div className="grid gap-5 md:grid-cols-2">
            <KxCard padded="lg">
              <Caption>Badges</Caption>
              <div className="mt-4 flex flex-wrap gap-2">
                <KxBadge tone="live">Live</KxBadge>
                <KxBadge tone="primary" withDot>New</KxBadge>
                <KxBadge tone="blue">Verified</KxBadge>
                <KxBadge tone="neutral">Draft</KxBadge>
              </div>
            </KxCard>

            <KxCard padded="lg">
              <Caption>Avatars</Caption>
              <div className="mt-4 flex items-end gap-4">
                <KxAvatar name="Richard Somda" size="sm" status="online" />
                <KxAvatar name="Kwame Mensah" size="md" status="verified" />
                <KxAvatar name="Amina Yakubu" size="lg" status="idle" ring />
                <KxAvatar
                  name="Salisu"
                  size="xl"
                  status="live"
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces"
                />
              </div>
            </KxCard>
          </div>
        </Section>

        {/* ============== FIELDS ============== */}
        <Section title="Inputs" caption="Soft surface that wakes up on focus. Custom selects, calendars, and more.">
          <div className="grid gap-5">
            {/* Text variants */}
            <KxCard padded="lg">
              <Caption>Text fields · icon placement &amp; sizes</Caption>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <KxTextField
                  label="No icon"
                  placeholder="Type your answer"
                />
                <KxTextField
                  label="Left icon"
                  placeholder="Search players, clubs, fixtures"
                  leftIcon={<SearchIcon />}
                />
                <KxTextField
                  label="Right icon"
                  placeholder="Add a date"
                  rightIcon={<CalendarIcon />}
                />
                <KxTextField
                  label="Both sides"
                  placeholder="024 000 0000"
                  leftIcon={<PhoneIcon />}
                  rightIcon={<CheckIcon />}
                />
                <KxTextField
                  label="Pill style"
                  placeholder="Search anything"
                  leftIcon={<SearchIcon />}
                  pill
                />
                <KxTextField
                  label="Large size"
                  placeholder="Big and breezy"
                  fieldSize="lg"
                  leftIcon={<SearchIcon />}
                />
                <KxTextField
                  label="Club name"
                  value={club}
                  onChange={(e) => setClub(e.target.value)}
                  hint="Shown on fixtures and the league table."
                />
                <KxTextField
                  label="Disabled"
                  value="locked@kalaanba.gh"
                  leftIcon={<PhoneIcon />}
                  disabled
                />
              </div>
            </KxCard>

            {/* Tones */}
            <KxCard padded="lg">
              <Caption>Tones · default · success · warning · danger</Caption>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <KxTextField
                  label="Default"
                  placeholder="All good here"
                  leftIcon={<PhoneIcon />}
                  hint="Plain hint, no fuss."
                />
                <KxTextField
                  label="Success"
                  tone="success"
                  defaultValue="captain@bantamaboys.gh"
                  leftIcon={<CheckIcon />}
                  message="Looks great — ready to go."
                />
                <KxTextField
                  label="Warning"
                  tone="warning"
                  defaultValue="weakpassword"
                  leftIcon={<PhoneIcon />}
                  message="This could be stronger."
                />
                <KxTextField
                  label="Danger"
                  tone="danger"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="024 000 0000"
                  leftIcon={<PhoneIcon />}
                  message="Phone number must start with 02."
                />
              </div>
            </KxCard>

            {/* Password + textarea */}
            <KxCard padded="lg">
              <Caption>Password &amp; textarea</Caption>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <KxPasswordField
                  label="Password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="At least 8 characters"
                  hint="Use a passphrase, not a password."
                />
                <KxTextarea
                  label="Player bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  maxLength={240}
                  showCount
                  hint="Keep it short. Two sentences max."
                />
              </div>
            </KxCard>

            {/* Custom select + datepicker */}
            <KxCard padded="lg">
              <Caption>Custom select &amp; calendar</Caption>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <KxSelect<string>
                  label="Country"
                  value={country}
                  onChange={setCountry}
                  leftIcon={<GlobeIcon />}
                  options={[
                    { value: "gh", label: "Ghana", description: "GHA · West Africa" },
                    { value: "ng", label: "Nigeria", description: "NGA · West Africa" },
                    { value: "ke", label: "Kenya", description: "KEN · East Africa" },
                    { value: "za", label: "South Africa", description: "RSA · Southern Africa" },
                    { value: "ci", label: "Côte d'Ivoire", description: "CIV · West Africa", disabled: true },
                  ]}
                />
                <KxSelect<string>
                  label="Position"
                  value={position}
                  onChange={setPosition}
                  placeholder="Choose a role on the pitch"
                  options={[
                    { value: "fwd", label: "Forward", icon: <PositionDot tone="pink" /> },
                    { value: "mid", label: "Midfielder", icon: <PositionDot tone="blue" /> },
                    { value: "def", label: "Defender", icon: <PositionDot tone="amber" /> },
                    { value: "gk", label: "Goalkeeper", icon: <PositionDot tone="green" /> },
                  ]}
                  hint="Drives recommended drills and stat groupings."
                />
                <KxDatePicker
                  label="Match date"
                  value={date}
                  onChange={setDate}
                  hint="Tap a day. Use Today to jump back."
                />
                <KxNumberInput
                  label="Player age"
                  value={age}
                  onChange={setAge}
                  min={5}
                  max={60}
                  unit="yrs"
                />
              </div>
            </KxCard>

            {/* OTP + File */}
            <KxCard padded="lg">
              <Caption>One-time code &amp; file upload</Caption>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div>
                  <KxOTPInput
                    label="Verification code"
                    value={otp}
                    onChange={setOtp}
                    length={6}
                    hint="We sent a 6-digit code to your phone."
                  />
                </div>
                <KxFileInput
                  label="Club crest"
                  accept="image/*"
                  hint="PNG or SVG up to 2MB."
                />
              </div>
            </KxCard>

            {/* Selection controls */}
            <KxCard padded="lg">
              <Caption>Selection · checkbox · radio · slider</Caption>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-3">
                  <KxCheckbox
                    checked={agreeTerms}
                    onChange={setAgreeTerms}
                    label="I agree to the league rules"
                    hint="You can review them anytime in Settings."
                  />
                  <KxCheckbox
                    checked={agreeMarketing}
                    onChange={setAgreeMarketing}
                    label="Email me match recaps"
                    hint="Once a week. Never on Sundays."
                  />
                  <div className="mt-4">
                    <div className="mb-2 [font-family:var(--kx-font-display)] text-[12px] font-semibold tracking-tight text-[var(--kx-fg)]">
                      Skill rating
                    </div>
                    <KxSlider value={skill} onChange={setSkill} min={0} max={100} label="" />
                  </div>
                </div>
                <KxRadioGroup<"informal" | "formal" | "academy">
                  value={tier}
                  onChange={setTier}
                  options={[
                    { value: "informal", label: "Informal team", hint: "Weekend kickabouts and street tournaments." },
                    { value: "formal",   label: "Formal club",   hint: "Registered, with regular fixtures." },
                    { value: "academy",  label: "Academy",       hint: "Youth pipeline with structured training." },
                  ]}
                />
              </div>
            </KxCard>
          </div>
        </Section>

        {/* ============== TABS, SWITCH, PROGRESS, TOAST ============== */}
        <Section title="Controls" caption="Tabs · switch · progress · toast.">
          <div className="grid gap-5 md:grid-cols-2">
            <KxCard padded="lg">
              <Caption>Tabs</Caption>
              <div className="mt-4">
                <KxTabs
                  value={tab}
                  onChange={setTab}
                  items={[
                    { value: "overview", label: "Overview" },
                    { value: "fixtures", label: "Fixtures", icon: <CalendarIcon /> },
                    { value: "players", label: "Players" },
                  ]}
                />
                <div
                  key={tab}
                  className="mt-5 rounded-[var(--kx-r-tile)] bg-[var(--kx-card-2)] p-4 text-sm text-[var(--kx-fg-muted)]"
                  style={{ animation: "kx-pop-in 0.28s var(--kx-ease-out) both" }}
                >
                  Showing <span className="text-[var(--kx-fg)] font-semibold">{tab}</span>
                </div>
              </div>
            </KxCard>

            <KxCard padded="lg">
              <Caption>Switch</Caption>
              <div className="mt-4 flex flex-col gap-3">
                <KxSwitch checked={notify} onChange={setNotify} label="WhatsApp fixture alerts" />
                <KxSwitch checked={false} onChange={() => undefined} label="Disabled option" disabled />
              </div>
            </KxCard>

            <KxCard padded="lg">
              <div className="flex items-center justify-between">
                <Caption>Progress</Caption>
                <span className="text-xs font-semibold tabular-nums text-[var(--kx-fg-muted)]">
                  {progress}%
                </span>
              </div>
              <div className="mt-4">
                <KxProgress value={progress} />
              </div>
              <div className="mt-3">
                <KxProgress indeterminate />
              </div>
              <div className="mt-4 flex gap-2">
                <KxButton size="sm" variant="secondary" onClick={() => setProgress((p) => Math.max(0, p - 10))}>
                  −10
                </KxButton>
                <KxButton size="sm" onClick={() => setProgress((p) => Math.min(100, p + 10))}>
                  +10
                </KxButton>
              </div>
            </KxCard>

            <KxCard padded="lg">
              <Caption>Toast</Caption>
              <div className="mt-4 space-y-3">
                <KxButton onClick={() => setShowToast((v) => !v)} variant="secondary">
                  {showToast ? "Hide toast" : "Trigger toast"}
                </KxButton>
                {showToast ? (
                  <KxToast
                    title="Fixture published"
                    description="Bantama Boys vs. Sagnarigu Stars — Sat 6:00pm"
                    icon={<CheckIcon />}
                  />
                ) : null}
              </div>
            </KxCard>
          </div>
        </Section>

        {/* ============== CARDS ============== */}
        <Section title="Cards" caption="Surface · subtle · outline. All hoverable.">
          <div className="grid gap-5 md:grid-cols-3">
            <KxCard tone="surface" interactive>
              <Caption>Surface</Caption>
              <h3 className="mt-2 [font-family:var(--kx-font-display)] text-xl font-bold text-[var(--kx-fg)]">
                Match Centre
              </h3>
              <p className="mt-1 text-sm text-[var(--kx-fg-muted)]">
                Live, upcoming, finished — one tap each.
              </p>
              <div className="mt-4">
                <KxButton size="sm" trailingIcon={<ArrowRight />}>Open</KxButton>
              </div>
            </KxCard>

            <KxCard tone="subtle" interactive>
              <Caption>Subtle</Caption>
              <h3 className="mt-2 [font-family:var(--kx-font-display)] text-xl font-bold text-[var(--kx-fg)]">
                Player career
              </h3>
              <p className="mt-1 text-sm text-[var(--kx-fg-muted)]">
                Verified record across every season they played.
              </p>
              <div className="mt-4 flex gap-2">
                <KxBadge tone="primary">62 Apps</KxBadge>
                <KxBadge tone="blue">38 Goals</KxBadge>
              </div>
            </KxCard>

            <KxCard tone="outline" interactive>
              <Caption>Outline</Caption>
              <h3 className="mt-2 [font-family:var(--kx-font-display)] text-xl font-bold text-[var(--kx-fg)]">
                Loading state
              </h3>
              <div className="mt-4 space-y-2">
                <KxSkeleton className="h-4 w-3/4" />
                <KxSkeleton className="h-4 w-1/2" />
                <KxSkeleton className="h-20 w-full" />
              </div>
            </KxCard>
          </div>
        </Section>

        {/* ============== STATS ROW ============== */}
        <Section title="Stat tiles" caption="Numbers count up when they enter view.">
          <div className="grid gap-5 sm:grid-cols-3">
            <KxStatTile value={9.6} label="Match Rating" size="lg" />
            <KxStatTile value={24} decimals={0} label="Goals" size="lg" />
            <KxStatTile value={4.8} label="Form Index" size="lg" />
          </div>
        </Section>

        {/* ============== ALERTS ============== */}
        <Section title="Alerts" caption="Side-rail accent + soft tinted wash. Dismissible.">
          <div className="flex flex-col gap-3">
            {alerts.info && (
              <KxAlert
                tone="info"
                title="Squad list locked at 18:00"
                onDismiss={() => setAlerts((a) => ({ ...a, info: false }))}
                action={<KxButton size="sm" variant="ghost">View squad</KxButton>}
              >
                You can still mark availability up to kickoff.
              </KxAlert>
            )}
            {alerts.success && (
              <KxAlert
                tone="success"
                title="Goal verified — Derek Osei (62')"
                onDismiss={() => setAlerts((a) => ({ ...a, success: false }))}
              >
                Two referees and the rival captain confirmed within 4 minutes.
              </KxAlert>
            )}
            {alerts.warning && (
              <KxAlert
                tone="warning"
                title="Pitch booking ends in 25 minutes"
                onDismiss={() => setAlerts((a) => ({ ...a, warning: false }))}
              >
                Extend now to keep the slot. After that it&apos;s first come, first kick.
              </KxAlert>
            )}
            {alerts.danger && (
              <KxAlert
                tone="danger"
                title="Roster mismatch detected"
                onDismiss={() => setAlerts((a) => ({ ...a, danger: false }))}
                action={<KxButton size="sm" variant="primary">Resolve</KxButton>}
              >
                Two players on the sheet aren&apos;t cleared for this competition.
              </KxAlert>
            )}
          </div>
        </Section>

        {/* ============== CHIPS + PAGINATION ============== */}
        <Section title="Chips · Pagination" caption="Filter chips with counts and a pill paginator.">
          <KxCard padded="lg">
            <Caption>Filter by status</Caption>
            <div className="mt-4">
              <KxChipGroup
                multi
                removable
                value={chipFilter}
                onChange={(v) => setChipFilter(v as string[])}
                options={[
                  { value: "upcoming", label: "Upcoming", count: 12 },
                  { value: "live",     label: "Live",     count: 2 },
                  { value: "ft",       label: "Full time", count: 48 },
                  { value: "mine",     label: "My matches", count: 6 },
                  { value: "verified", label: "Verified" },
                ]}
              />
            </div>
            <div className="mt-6 flex items-center justify-between gap-3">
              <span className="text-[12px] text-[var(--kx-fg-muted)] tabular-nums">
                Page {page} of 12
              </span>
              <KxPagination page={page} total={12} onChange={setPage} />
            </div>
          </KxCard>
        </Section>

        {/* ============== MENU + MODAL ============== */}
        <Section title="Menu · Modal" caption="Anchored kebab menu and a focused dialog.">
          <div className="grid gap-5 md:grid-cols-2">
            <KxCard padded="lg">
              <Caption>Dropdown menu</Caption>
              <div className="mt-4 flex items-center justify-between rounded-[var(--kx-r-tile)] bg-[var(--kx-card-2)] px-4 py-3">
                <div>
                  <div className="[font-family:var(--kx-font-display)] text-[14px] font-bold text-[var(--kx-fg)]">
                    Bantama Boys
                  </div>
                  <div className="text-[12px] text-[var(--kx-fg-muted)]">12 players · last updated 2h ago</div>
                </div>
                <KxMenu
                  align="end"
                  trigger={<KxKebabButton />}
                  items={[
                    { label: "Edit roster",  icon: <PencilSimple size={16} weight="bold" />, onSelect: () => undefined },
                    { label: "Share link",    icon: <Share        size={16} weight="bold" />, shortcut: "⌘ S" },
                    "separator",
                    { label: "Archive team",  icon: <Trash        size={16} weight="bold" />, danger: true },
                  ]}
                />
              </div>
            </KxCard>

            <KxCard padded="lg">
              <Caption>Modal</Caption>
              <div className="mt-4 flex flex-col gap-2">
                <KxButton onClick={() => setModalOpen(true)} leadingIcon={<PlusIcon />}>
                  Create fixture
                </KxButton>
                <p className="text-[12px] text-[var(--kx-fg-muted)]">
                  Blurred backdrop, gradient hairline at the top, sticky footer.
                </p>
              </div>
            </KxCard>
          </div>

          <KxModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Create a fixture"
            description="Set the matchday, opponent and venue. You can confirm the squad later."
            footer={
              <>
                <KxButton variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </KxButton>
                <KxButton variant="primary" size="sm" onClick={() => setModalOpen(false)}>
                  Publish fixture
                </KxButton>
              </>
            }
          >
            <div className="flex flex-col gap-4 py-2">
              <KxTextField
                name="opponent"
                label="Opponent"
                placeholder="e.g. Sagnarigu Stars"
                defaultValue="Sagnarigu Stars"
              />
              <KxTextField
                name="venue"
                label="Venue"
                placeholder="Stadium or pitch"
                leftIcon={<GlobeIcon />}
              />
              <KxTextarea
                name="notes"
                label="Notes for the team"
                rows={3}
                placeholder="Bus leaves at 4. Wear away kit."
              />
            </div>
          </KxModal>
        </Section>

        {/* ============== FIXTURE CARDS ============== */}
        <Section title="Fixture cards" caption="Brand piece — one card, three states.">
          <div className="grid gap-4 md:grid-cols-3">
            <KxFixtureCard
              kickoff="Sat · 19:30"
              status="scheduled"
              home={{ name: "Bantama Boys",     short: "BTM", crestColor: "var(--kx-pink)" }}
              away={{ name: "Sagnarigu Stars",  short: "SAG", crestColor: "var(--kx-blue)" }}
              venue="Baba Yara Stadium"
              competition="Greater Accra League"
            />
            <KxFixtureCard
              kickoff="Live · 67'"
              status="live"
              scoreHome={2}
              scoreAway={1}
              home={{ name: "Cape Coast XI",    short: "CCX", crestColor: "var(--kx-success)" }}
              away={{ name: "Tamale United",    short: "TAM", crestColor: "var(--kx-warning)" }}
              venue="Cape Coast Sports Stadium"
              competition="Friendly"
            />
            <KxFixtureCard
              kickoff="Sun · 15:00"
              status="ft"
              scoreHome={0}
              scoreAway={3}
              home={{ name: "Hearts Academy",   short: "HRT", crestColor: "var(--kx-danger)" }}
              away={{ name: "Liberty FC",       short: "LBT", crestColor: "var(--kx-fg)" }}
              venue="Madina Astro"
              competition="Cup R16"
            />
          </div>
        </Section>

        {/* ============== FIXTURE CARDS · VERTICAL ============== */}
        <Section
          title="Fixture cards · vertical"
          caption="Sidebar / mobile carousel format. Three states."
        >
          <div className="flex flex-wrap gap-4">
            <KxFixtureCardVertical
              kickoff="Sat · 19:30"
              status="scheduled"
              home={{ name: "Bantama Boys",    short: "BTM", crestColor: "var(--kx-pink)" }}
              away={{ name: "Sagnarigu Stars", short: "SAG", crestColor: "var(--kx-blue)" }}
              venue="Baba Yara"
              competition="Greater Accra"
            />
            <KxFixtureCardVertical
              kickoff="Live · 67'"
              status="live"
              scoreHome={2}
              scoreAway={1}
              home={{ name: "Cape Coast XI",   short: "CCX", crestColor: "var(--kx-success)" }}
              away={{ name: "Tamale United",   short: "TAM", crestColor: "var(--kx-warning)" }}
              venue="Cape Coast"
              competition="Friendly"
            />
            <KxFixtureCardVertical
              kickoff="Sun · 15:00"
              status="ft"
              scoreHome={0}
              scoreAway={3}
              home={{ name: "Hearts Academy",  short: "HRT", crestColor: "var(--kx-danger)" }}
              away={{ name: "Liberty FC",      short: "LBT", crestColor: "var(--kx-fg)" }}
              venue="Madina Astro"
              competition="Cup R16"
            />
          </div>
        </Section>

        {/* ============== FIXTURE CARDS · COMPACT ============== */}
        <Section
          title="Fixture cards · compact"
          caption="Single-row, dense. Use in 'all fixtures' lists and rails."
        >
          <div className="grid gap-2">
            <KxFixtureCardCompact
              kickoff="19:30"
              status="scheduled"
              home={{ name: "Bantama Boys",    short: "BTM", crestColor: "var(--kx-pink)" }}
              away={{ name: "Sagnarigu Stars", short: "SAG", crestColor: "var(--kx-blue)" }}
              competition="GAL"
            />
            <KxFixtureCardCompact
              kickoff="67'"
              status="live"
              scoreHome={2}
              scoreAway={1}
              home={{ name: "Cape Coast XI",   short: "CCX", crestColor: "var(--kx-success)" }}
              away={{ name: "Tamale United",   short: "TAM", crestColor: "var(--kx-warning)" }}
              competition="FRN"
            />
            <KxFixtureCardCompact
              kickoff="FT"
              status="ft"
              scoreHome={0}
              scoreAway={3}
              home={{ name: "Hearts Academy",  short: "HRT", crestColor: "var(--kx-danger)" }}
              away={{ name: "Liberty FC",      short: "LBT", crestColor: "var(--kx-fg)" }}
              competition="CUP"
            />
            <KxFixtureCardCompact
              kickoff="21:00"
              status="scheduled"
              home={{ name: "Kotoko Babies",   short: "KOT", crestColor: "var(--kx-warning)" }}
              away={{ name: "Asante Eleven",   short: "ASE", crestColor: "var(--kx-success)" }}
              competition="GPL"
            />
          </div>
        </Section>

        {/* ============== TABLE ============== */}
        <Section title="Leaderboard table" caption="Sticky header · sortable · row hover plate.">
          <KxTable
            caption="Top scorers — Greater Accra League · MD 14"
            columns={LEADERBOARD_COLUMNS}
            rows={LEADERBOARD_ROWS}
            onRowClick={() => undefined}
          />
        </Section>

        {/* ============== EXPERIMENTS ============== */}
        <Section
          title="Living surfaces · vet first"
          caption="Three options for the 'alive' feel. Pick what fits before we adopt anywhere."
        >
          <div className="grid gap-5 md:grid-cols-3">
            <KxTintedCard tone="pink">
              <KxExperimentLabel title="Option A" caption="Soft tinted wash">
                <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--kx-fg-muted)]">
                  Static single-tone gradient from one corner. Calm, premium.
                  Cheapest. Reads well on both modes.
                </p>
              </KxExperimentLabel>
            </KxTintedCard>

            <KxAuroraCard toneA="pink" toneB="blue">
              <KxExperimentLabel title="Option B" caption="Drifting aurora">
                <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--kx-fg-muted)]">
                  Two blurred blobs slowly drift. Subtle motion, not jittery.
                  Best for hero / featured surfaces.
                </p>
              </KxExperimentLabel>
            </KxAuroraCard>

            <KxMeshCard>
              <KxExperimentLabel title="Option C" caption="Morphing mesh">
                <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--kx-fg-muted)]">
                  Multi-stop radial mesh whose stops shift over 22s.
                  Rich and atmospheric. Use sparingly.
                </p>
              </KxExperimentLabel>
            </KxMeshCard>
          </div>
        </Section>

        <footer className="pt-6 pb-12 text-center text-xs uppercase tracking-[0.18em] text-[var(--kx-fg-muted)]">
          Kalaanba · UI Foundation v0
        </footer>
      </div>

      {/* ============== TRACK 1 · DATA PRIMITIVES ============== */}
      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-10 px-0">
        <Section title="Score picker" caption="The control organisers tap to enter a final score.">
          <div className="grid gap-4 md:grid-cols-2">
            <KxCard padded="lg">
              <Caption>Two-up stepper for home / away goals</Caption>
              <div className="mt-4">
                <KxScorePicker
                  home={pickedScore.home}
                  away={pickedScore.away}
                  homeName="Bantama Boys"
                  awayName="Sagnarigu Stars"
                  onChange={setPickedScore}
                />
              </div>
              <p className="mt-3 text-[12.5px] text-[var(--kx-fg-muted)]">
                Tap <span className="font-semibold text-[var(--kx-fg)]">+</span> to add a goal,
                then publish the result — it propagates into the league table.
              </p>
            </KxCard>

            <KxCard padded="lg">
              <Caption>Form pills</Caption>
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-24 text-[12px] font-semibold text-[var(--kx-fg)]">Bantama Boys</span>
                  <KxFormPills results={["W", "W", "D", "L", "W"]} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-24 text-[12px] font-semibold text-[var(--kx-fg)]">Sagnarigu</span>
                  <KxFormPills results={["L", "D", "W", "L", "W"]} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-24 text-[12px] font-semibold text-[var(--kx-fg)]">Cape Coast</span>
                  <KxFormPills results={["W", "W", "W", "D", "W"]} size="sm" />
                </div>
              </div>
            </KxCard>
          </div>
        </Section>

        <Section title="Stat tile · with sparkline" caption="Number + trend + last-N sparkline.">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <KxStatTileSpark
              value={9.6}
              label="Match Rating"
              series={[7.4, 7.8, 8.1, 8.4, 8.0, 8.9, 9.2, 9.6]}
              delta={12}
              tone="pink"
            />
            <KxStatTileSpark
              value={24}
              label="Goals"
              series={[12, 14, 17, 18, 19, 21, 23, 24]}
              delta={3}
              tone="blue"
              suffix="goals"
            />
            <KxStatTileSpark
              value={4.8}
              label="Form Index"
              series={[5.2, 5.0, 4.7, 4.6, 4.8, 4.4, 4.9, 4.8]}
              delta={-4}
              tone="warning"
            />
          </div>
        </Section>

        <Section title="Skeletons" caption="Loading placeholders for fixtures, table rows, and stat tiles.">
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              <KxFixtureSkeleton />
              <KxFixtureSkeleton />
              <KxFixtureSkeleton />
            </div>
            <div className="grid gap-2">
              <KxRowSkeleton />
              <KxRowSkeleton />
              <KxRowSkeleton />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <KxStatSkeleton />
              <KxStatSkeleton />
              <KxStatSkeleton />
            </div>
          </div>
        </Section>

        {/* ============== TRACK 2 · SURFACES & NAVIGATION ============== */}
        <Section title="Tabs · sliding underline" caption="Same thumb pattern as pagination, applied to tab triggers.">
          <KxCard padded="lg">
            <KxTabsUnderline
              value={tab2}
              onChange={setTab2}
              items={[
                { value: "all", label: "All fixtures" },
                { value: "live", label: "Live now" },
                { value: "finished", label: "Finished" },
              ]}
            />
            <div
              key={tab2}
              className="mt-5 rounded-[var(--kx-r-tile)] bg-[var(--kx-card-2)] p-4 text-sm text-[var(--kx-fg-muted)]"
              style={{ animation: "kx-pop-in 0.28s var(--kx-ease-out) both" }}
            >
              Showing <span className="text-[var(--kx-fg)] font-semibold">{tab2}</span>
            </div>
          </KxCard>
        </Section>

        <Section title="Drawer & command palette" caption="Right-side sheet (filters / bet slip) + ⌘K palette.">
          <KxCard padded="lg">
            <div className="flex flex-wrap gap-3">
              <KxButton onClick={() => setDrawerOpen(true)}>Open drawer</KxButton>
              <KxButton variant="secondary" onClick={() => setPaletteOpen(true)}>
                Open command palette
              </KxButton>
            </div>
          </KxCard>
          <KxDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Filters"
            footer={
              <div className="flex justify-end gap-2">
                <KxButton variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</KxButton>
                <KxButton onClick={() => setDrawerOpen(false)}>Apply</KxButton>
              </div>
            }
          >
            <div className="flex flex-col gap-4 py-2 text-sm text-[var(--kx-fg-muted)]">
              <p>Drawer body is freeform. Drop any fields, lists, or summaries here.</p>
              <KxFormPills results={["W", "W", "D", "L", "W"]} />
              <KxScorePicker
                home={pickedScore.home}
                away={pickedScore.away}
                homeName="Bantama Boys"
                awayName="Sagnarigu Stars"
                onChange={setPickedScore}
              />
            </div>
          </KxDrawer>
          <ToastConsumer>
            {(toast) => (
              <KxCommandPalette
                open={paletteOpen}
                onClose={() => setPaletteOpen(false)}
                items={COMMANDS}
                onSelect={(it) => toast.push({ title: `Opened: ${it.label}`, tone: "blue" })}
              />
            )}
          </ToastConsumer>
        </Section>

        <Section title="Empty state" caption="Calm tinted-wash surface for zero-state moments.">
          <div className="grid gap-4 md:grid-cols-2">
            <KxEmptyState
              icon={<TrophyIcon />}
              title="No live matches right now"
              description="Saturday's slate kicks off at 15:00. We'll surface the first one here."
              action={<KxButton size="sm">Browse fixtures</KxButton>}
              tone="pink"
            />
            <KxEmptyState
              icon={<SearchIcon />}
              title="No results"
              description="Try a different team, player, or fixture name."
              tone="blue"
            />
          </div>
        </Section>

        {/* ============== TRACK 3 · LIVE / MOTION ============== */}
        <Section title="Ticker" caption="Pause-on-hover marquee. Edge-faded.">
          <KxTicker speed={48}>
            <span className="text-[12.5px] font-semibold text-[var(--kx-fg)]">
              <span className="text-[var(--kx-pink)]">LIVE</span> · CCX 2 – 1 TAM
            </span>
            <span className="text-[12.5px] text-[var(--kx-fg-muted)]">
              FT · HRT 0 – 3 LBT
            </span>
            <span className="text-[12.5px] text-[var(--kx-fg-muted)]">
              Sat 19:30 · BTM vs SAG
            </span>
            <span className="text-[12.5px] text-[var(--kx-fg-muted)]">
              Sun 15:00 · KOT vs ASE
            </span>
            <span className="text-[12.5px] text-[var(--kx-blue)]">
              Boost: Over 2.5 · 1.75 → 1.92
            </span>
          </KxTicker>
        </Section>

        <Section title="Odometer" caption="Per-digit flip when value changes. Smooth, satisfying.">
          <KxCard padded="lg">
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-[40px] font-extrabold leading-none text-[var(--kx-fg)]">
                <KxOdometer value={score} />
              </div>
              <div className="flex gap-2">
                <KxButton size="sm" variant="secondary" onClick={() => setScore((s: number) => Math.max(0, s - 7))}>
                  −7
                </KxButton>
                <KxButton size="sm" onClick={() => setScore((s: number) => s + 13)}>
                  +13
                </KxButton>
                <KxButton size="sm" variant="ghost" onClick={() => setScore(Math.floor(Math.random() * 9999))}>
                  Random
                </KxButton>
              </div>
            </div>
          </KxCard>
        </Section>

        <Section title="Toast queue" caption="Stack of auto-dismissing toasts with progress bar. Hover to pause.">
          <KxCard padded="lg">
            <ToastConsumer>
              {(toast) => (
                <div className="flex flex-wrap gap-2">
                  <KxButton onClick={() => toast.push({ title: "Goal verified", description: "Derek Osei (62') — Bantama Boys 2 – 1 Sagnarigu", tone: "primary" })}>
                    Push primary
                  </KxButton>
                  <KxButton variant="blue" onClick={() => toast.push({ title: "Settings saved", tone: "blue" })}>
                    Push blue
                  </KxButton>
                  <KxButton variant="secondary" onClick={() => toast.push({ title: "Fixture published", description: "Sat 19:30 · Bantama Boys vs Sagnarigu", tone: "success" })}>
                    Push success
                  </KxButton>
                  <KxButton variant="ghost" onClick={() => toast.push({ title: "Match suspended", description: "Weather review at half time.", tone: "warning" })}>
                    Push warning
                  </KxButton>
                  <KxButton variant="ghost" onClick={() => toast.push({ title: "Verification failed", description: "Two captain signatures required to publish.", tone: "danger" })}>
                    Push danger
                  </KxButton>
                </div>
              )}
            </ToastConsumer>
          </KxCard>
        </Section>

        <Section title="Momentum bar" caption="Live attacking pressure strip. Drag the slider to feel it shift.">
          <KxCard padded="lg">
            <KxMomentumBar value={momentum} homeLabel="BTM" awayLabel="SAG" />
            <div className="mt-5">
              <input
                type="range"
                min={-100}
                max={100}
                value={Math.round(momentum * 100)}
                onChange={(e) => setMomentum(parseInt(e.target.value, 10) / 100)}
                className="w-full accent-[var(--kx-pink)]"
              />
            </div>
          </KxCard>
        </Section>

        <footer className="pt-6 pb-12 text-center text-xs uppercase tracking-[0.18em] text-[var(--kx-fg-muted)]">
          Kalaanba · Track 1–3
        </footer>
      </div>

      {/* ============== TRACK 4 · MATCH & COMPETITION ============== */}
      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-10 px-0">
        <Section title="League table" caption="Standings with promotion / playoff / drop tints.">
          <KxLeagueTable
            caption="Tamale Premier League — Matchweek 12"
            highlightTeam="Bantama Boys"
            rows={LEAGUE_ROWS}
          />
        </Section>

        <Section title="Match event timeline" caption="Goals · cards · subs against the match clock.">
          <div className="grid gap-4 md:grid-cols-2">
            <KxMatchEventTimeline events={MATCH_EVENTS} />
            <KxCard padded="lg">
              <Caption>Notes</Caption>
              <p className="mt-3 text-[13px] text-[var(--kx-fg-muted)]">
                Home events sit on the left, away events on the right, with the match clock running
                down the middle. Phase markers (kick off, half time, full time) span the full row.
              </p>
            </KxCard>
          </div>
        </Section>

        {/* ============== TRACK 5 · PLAYER & CLUB ============== */}
        <Section title="Player card" caption="The verified player tile — the long-term product.">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <KxPlayerCard
              name="Derek Osei"
              position="Forward"
              jersey={9}
              clubName="Bantama Boys"
              city="Tamale"
              clubCrest={<KxClubCrest name="Bantama Boys" tone="pink" size="sm" />}
              stats={{ apps: 18, goals: 14, assists: 6 }}
            />
            <KxPlayerCard
              name="Richard Somda"
              position="Midfielder"
              jersey={8}
              clubName="Sagnarigu Stars"
              city="Sagnarigu"
              clubCrest={<KxClubCrest name="Sagnarigu Stars" tone="blue" size="sm" />}
              stats={{ apps: 17, goals: 4, assists: 11 }}
            />
            <KxPlayerCard
              name="Kwame Mensah"
              position="Goalkeeper"
              jersey={1}
              clubName="Cape Coast XI"
              city="Cape Coast"
              verified={false}
              clubCrest={<KxClubCrest name="Cape Coast XI" size="sm" />}
              stats={{ apps: 18, goals: 0, assists: 1 }}
            />
          </div>
        </Section>

        <Section title="Club crest & avatar stack" caption="Initials fallback when there is no uploaded crest.">
          <div className="grid gap-4 md:grid-cols-2">
            <KxCard padded="lg">
              <Caption>Crests · pink, blue, neutral · sm/md/lg</Caption>
              <div className="mt-4 flex flex-wrap items-end gap-4">
                <KxClubCrest name="Bantama Boys" tone="pink" size="lg" />
                <KxClubCrest name="Sagnarigu Stars" tone="blue" size="lg" />
                <KxClubCrest name="Cape Coast XI" size="lg" />
                <KxClubCrest name="Tamale Lions" tone="pink" />
                <KxClubCrest name="Northern United" tone="blue" />
                <KxClubCrest name="Accra City" />
                <KxClubCrest name="Dagbon FC" tone="pink" size="sm" />
                <KxClubCrest name="Ridge Boys" tone="blue" size="sm" />
              </div>
            </KxCard>

            <KxCard padded="lg">
              <Caption>Avatar stack with overflow</Caption>
              <div className="mt-4 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[12.5px] font-semibold text-[var(--kx-fg-muted)]">Squad</span>
                  <KxAvatarStack
                    people={[
                      { name: "Derek Osei", tone: "pink" },
                      { name: "Richard Somda", tone: "blue" },
                      { name: "Kwame Mensah" },
                      { name: "Yaw Boateng", tone: "pink" },
                      { name: "Ibrahim Issah", tone: "blue" },
                      { name: "Joseph Tetteh" },
                      { name: "Mahama Awal", tone: "pink" },
                    ]}
                    max={4}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12.5px] font-semibold text-[var(--kx-fg-muted)]">Attendees</span>
                  <KxAvatarStack
                    size="lg"
                    people={[
                      { name: "Derek Osei", tone: "pink" },
                      { name: "Richard Somda", tone: "blue" },
                      { name: "Kwame Mensah" },
                    ]}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12.5px] font-semibold text-[var(--kx-fg-muted)]">Sm</span>
                  <KxAvatarStack
                    size="sm"
                    people={[
                      { name: "A B" },
                      { name: "C D", tone: "pink" },
                      { name: "E F", tone: "blue" },
                      { name: "G H" },
                      { name: "I J", tone: "pink" },
                    ]}
                    max={3}
                  />
                </div>
              </div>
            </KxCard>
          </div>
        </Section>

        {/* ============== TRACK 6 · ORGANISER FLOW & DELTAS ============== */}
        <Section title="Stepper" caption="Multi-step wizard header (create competition, register club).">
          <KxCard padded="lg">
            <KxStepper steps={STEPPER_STEPS} />
            <p className="mt-4 text-[12.5px] text-[var(--kx-fg-muted)]">
              Step 3 of 5 active · two complete · two upcoming. Bubble + label + connector
              all reflect status.
            </p>
          </KxCard>
        </Section>

        <Section title="Fixture row" caption="Compact list-row variant of a fixture (the dense view).">
          <KxCard padded="lg">
            <div className="flex flex-col gap-2">
              <KxFixtureRow
                kickoff={new Date(Date.now() + 1000 * 60 * 60 * 27)}
                homeName="Bantama Boys"
                awayName="Sagnarigu Stars"
                homeCrest={<KxClubCrest name="Bantama Boys" tone="pink" size="sm" />}
                awayCrest={<KxClubCrest name="Sagnarigu Stars" tone="blue" size="sm" />}
                state="scheduled"
                meta="Tamale PL"
                onClick={() => undefined}
              />
              <KxFixtureRow
                kickoff={new Date(Date.now() - 1000 * 60 * 67)}
                homeName="Cape Coast XI"
                awayName="Northern United"
                homeCrest={<KxClubCrest name="Cape Coast XI" size="sm" />}
                awayCrest={<KxClubCrest name="Northern United" tone="blue" size="sm" />}
                score={[1, 1]}
                state="live"
                liveClock="67'"
                meta="Coastal Cup"
                onClick={() => undefined}
              />
              <KxFixtureRow
                kickoff={new Date(Date.now() - 1000 * 60 * 60 * 26)}
                homeName="Tamale Lions"
                awayName="Dagbon FC"
                homeCrest={<KxClubCrest name="Tamale Lions" tone="pink" size="sm" />}
                awayCrest={<KxClubCrest name="Dagbon FC" tone="pink" size="sm" />}
                score={[3, 0]}
                state="final"
                meta="Tamale PL"
              />
              <KxFixtureRow
                kickoff={new Date(Date.now() + 1000 * 60 * 60 * 96)}
                homeName="Accra City"
                awayName="Ridge Boys"
                homeCrest={<KxClubCrest name="Accra City" size="sm" />}
                awayCrest={<KxClubCrest name="Ridge Boys" tone="blue" size="sm" />}
                state="postponed"
                meta="Friendly"
              />
            </div>
          </KxCard>
        </Section>

        <Section title="Stat delta" caption="Tiny ±change pill for player & team stats.">
          <KxCard padded="lg">
            <div className="flex flex-wrap items-center gap-3">
              <KxStatDelta value={3} label="goals this week" />
              <KxStatDelta value={-2} label="ranking" invert />
              <KxStatDelta value={0} label="form" />
              <KxStatDelta value={12} unit="%" label="possession" />
              <KxStatDelta value={-5} label="conceded" invert />
              <KxStatDelta value={1} size="sm" />
              <KxStatDelta value={-1} size="sm" />
            </div>
            <p className="mt-4 text-[12.5px] text-[var(--kx-fg-muted)]">
              <span className="font-semibold text-[var(--kx-fg)]">invert</span> flips the polarity for
              stats where lower is better (goals conceded, ranking position).
            </p>
          </KxCard>
        </Section>

        <footer className="pt-6 pb-12 text-center text-xs uppercase tracking-[0.18em] text-[var(--kx-fg-muted)]">
          Kalaanba · Track 4–6
        </footer>
      </div>
      </main>
    </KxToastQueueProvider>
  );
}

/* ---------- Render-prop helper so toast hook runs inside the provider ---------- */
function ToastConsumer({ children }: { children: (t: ReturnType<typeof useKxToast>) => React.ReactNode }) {
  const t = useKxToast();
  return <>{children(t)}</>;
}

/* ---------- Small layout helpers, local to the showcase ---------- */

function Section({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="flex flex-col gap-4"
      style={{ animation: "kx-rise 0.55s var(--kx-ease-out) both" }}
    >
      <div>
        <h2 className="[font-family:var(--kx-font-display)] text-xl font-bold tracking-tight text-[var(--kx-fg)]">
          {title}
        </h2>
        {caption ? (
          <p className="mt-1 text-sm text-[var(--kx-fg-muted)]">{caption}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--kx-fg-muted)]">
      {children}
    </div>
  );
}

/* ---------- Track 4–6 demo data ---------- */

const LEAGUE_ROWS: LeagueRow[] = [
  { rank: 1,  team: "Bantama Boys",     played: 12, won: 9, drawn: 2, lost: 1, gf: 28, ga: 9,  zone: "promotion",   form: ["W","W","D","L","W"] },
  { rank: 2,  team: "Sagnarigu Stars",  played: 12, won: 8, drawn: 2, lost: 2, gf: 24, ga: 11, zone: "promotion",   form: ["L","W","W","W","D"] },
  { rank: 3,  team: "Cape Coast XI",    played: 12, won: 7, drawn: 3, lost: 2, gf: 22, ga: 13, zone: "playoff",     form: ["W","D","W","W","D"] },
  { rank: 4,  team: "Northern United",  played: 12, won: 6, drawn: 3, lost: 3, gf: 19, ga: 14,                       form: ["D","W","L","W","W"] },
  { rank: 5,  team: "Tamale Lions",     played: 12, won: 5, drawn: 4, lost: 3, gf: 17, ga: 14,                       form: ["W","D","D","L","W"] },
  { rank: 6,  team: "Dagbon FC",        played: 12, won: 4, drawn: 4, lost: 4, gf: 15, ga: 15,                       form: ["L","D","W","D","L"] },
  { rank: 7,  team: "Ridge Boys",       played: 12, won: 3, drawn: 4, lost: 5, gf: 12, ga: 18,                       form: ["L","W","L","D","L"] },
  { rank: 8,  team: "Accra City",       played: 12, won: 2, drawn: 3, lost: 7, gf:  9, ga: 22, zone: "relegation",  form: ["L","L","D","L","W"] },
  { rank: 9,  team: "Greater Sahara",   played: 12, won: 1, drawn: 2, lost: 9, gf:  6, ga: 26, zone: "relegation",  form: ["L","L","L","L","D"] },
];

const MATCH_EVENTS: MatchEvent[] = [
  { minute: 0,  side: "home", type: "kickoff" },
  { minute: 12, side: "home", type: "goal",   player: "Derek Osei",      detail: "assist · R. Somda" },
  { minute: 28, side: "away", type: "yellow", player: "I. Issah",        detail: "tactical foul" },
  { minute: 41, side: "away", type: "goal",   player: "Yaw Boateng",     detail: "from a corner" },
  { minute: 45, side: "home", type: "halftime" },
  { minute: 58, side: "home", type: "sub",    player: "M. Awal",         detail: "in for J. Tetteh" },
  { minute: 67, side: "home", type: "goal",   player: "Derek Osei",      detail: "penalty" },
  { minute: 78, side: "away", type: "red",    player: "K. Adjei",        detail: "second yellow" },
  { minute: 90, side: "home", type: "fulltime" },
];

const STEPPER_STEPS: StepItem[] = [
  { key: "club",      label: "Register club",     hint: "Name, logo, captain", status: "complete" },
  { key: "roster",    label: "Add roster",        hint: "12 players added",     status: "complete" },
  { key: "comp",      label: "Pick competition",  hint: "Tamale PL · 25/26",    status: "current" },
  { key: "fixtures",  label: "Confirm fixtures",  hint: "12 matchweeks",        status: "upcoming" },
  { key: "publish",   label: "Publish to WhatsApp", hint: "3 groups",           status: "upcoming" },
];

/* ---------- Leaderboard demo data ---------- */

type LbRow = {
  id: number;
  rank: number;
  player: string;
  team: string;
  apps: number;
  goals: number;
  rating: number;
};

const LEADERBOARD_ROWS: LbRow[] = [
  { id: 1, rank: 1, player: "Derek Osei",    team: "Bantama Boys",    apps: 14, goals: 18, rating: 9.4 },
  { id: 2, rank: 2, player: "Kwesi Mensah",  team: "Sagnarigu Stars", apps: 14, goals: 15, rating: 9.1 },
  { id: 3, rank: 3, player: "Yaw Boateng",   team: "Cape Coast XI",   apps: 13, goals: 12, rating: 8.8 },
  { id: 4, rank: 4, player: "Kojo Asare",    team: "Tamale United",   apps: 14, goals: 11, rating: 8.6 },
  { id: 5, rank: 5, player: "Nii Lartey",    team: "Hearts Academy",  apps: 12, goals: 10, rating: 8.5 },
  { id: 6, rank: 6, player: "Abdul Issah",   team: "Liberty FC",      apps: 14, goals:  9, rating: 8.3 },
];

const LEADERBOARD_COLUMNS: Column<LbRow>[] = [
  {
    key: "rank",
    label: "#",
    width: "56px",
    render: (r) => (
      <span
        className={
          r.rank <= 3
            ? "inline-grid h-7 w-7 place-items-center rounded-full bg-[color-mix(in_oklab,var(--kx-pink)_16%,transparent)] text-[12px] font-extrabold text-[var(--kx-pink)] tabular-nums"
            : "inline-grid h-7 w-7 place-items-center rounded-full bg-[var(--kx-card-2)] text-[12px] font-bold text-[var(--kx-fg-muted)] tabular-nums"
        }
      >
        {r.rank}
      </span>
    ),
  },
  {
    key: "player",
    label: "Player",
    sortable: true,
    render: (r) => (
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--kx-card-2)] text-[11px] font-bold text-[var(--kx-fg)]">
          {r.player.split(" ").map((p) => p[0]).join("").slice(0, 2)}
        </span>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold text-[var(--kx-fg)]">{r.player}</div>
          <div className="truncate text-[11px] text-[var(--kx-fg-muted)]">{r.team}</div>
        </div>
      </div>
    ),
  },
  { key: "apps",  label: "Apps",  align: "right", width: "80px",  sortable: true },
  { key: "goals", label: "Goals", align: "right", width: "80px",  sortable: true },
  {
    key: "rating",
    label: "Rating",
    align: "right",
    width: "100px",
    sortable: true,
    render: (r) => (
      <span className="[font-family:var(--kx-font-display)] text-[14px] font-extrabold tabular-nums text-[var(--kx-fg)]">
        {r.rating.toFixed(1)}
      </span>
    ),
  },
];
