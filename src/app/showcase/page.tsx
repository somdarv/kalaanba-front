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
} from "@/components/showcase/primitives";
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
} from "@/components/showcase/inputs";
import { KxTopbar } from "@/components/showcase/topbar";
import { KxStatTile } from "@/components/showcase/stat-tile";
import { KxPlayerProfileBlock } from "@/components/showcase/player-profile-block";
import { KxThemeToggle } from "@/components/showcase/theme-toggle";
import {
  KxAlert,
  KxChipGroup,
  KxFixtureCard,
  KxKebabButton,
  KxMenu,
  KxModal,
  KxPagination,
  KxTable,
  type Column,
} from "@/components/showcase/extras";
import {
  KxAuroraCard,
  KxExperimentLabel,
  KxMeshCard,
  KxTintedCard,
} from "@/components/showcase/experiments";
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

  return (
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
    </main>
  );
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
