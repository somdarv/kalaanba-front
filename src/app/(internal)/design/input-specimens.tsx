"use client";

/**
 * The input suite on the v3 language.
 *
 * The whole suite was inconsistent before this pass: text fields were
 * `rounded-pill` (999px), OTP was `rounded-xl` (12px), and the rest sat on
 * `--radius-control` — three different radii across one family of controls.
 * §2.3 says inputs take `--radius-control`, and a fully-round input reads
 * consumer-app rather than the tight geometry the sports reference uses.
 * All of them are 12px now.
 *
 * Focus is where the two roles separate visibly:
 *   - the field-active affordance is brand ink (the border brightens),
 *   - the keyboard focus indicator is `--ring` (hue 200, cyan).
 * v2 used pink for both, which is why the ring vanished on pink controls.
 */

import { useState } from "react";
import {
  Card,
  Checkbox,
  Eyebrow,
  NumberInput,
  OtpInput,
  PasswordField,
  PhoneInput,
  RadioGroup,
  SearchField,
  Select,
  Slider,
  Switch,
  Textarea,
  TextField,
} from "@/components/ui";

const ZONES = [
  { value: "lamashegu", label: "Lamashegu" },
  { value: "kalpohin", label: "Kalpohin" },
  { value: "vittin", label: "Vittin" },
  { value: "sakasaka", label: "Sakasaka" },
  { value: "choggu", label: "Choggu" },
] as const;

type Zone = (typeof ZONES)[number]["value"];

export function InputSpecimens() {
  const [zone, setZone] = useState<Zone | null>("lamashegu");
  const [search, setSearch] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [squad, setSquad] = useState<number | null>(18);
  const [position, setPosition] = useState("midfielder");
  const [notify, setNotify] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [duration, setDuration] = useState(90);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1.5">
        <Eyebrow tone="primary">Inputs</Eyebrow>
        <h2 className="font-display text-xl font-semibold tracking-tight">
          One radius, one focus language
        </h2>
        <p className="text-fg-muted max-w-prose text-sm">
          Tab through these. The border brightens to brand ink to show which
          field is live; the cyan ring is the keyboard indicator and never
          changes colour with the control.
        </p>
      </header>

      <Card tone="raised">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Club name"
            placeholder="Lamashegu Warriors"
            hint="The name people already call your side"
            autoComplete="organization"
            enterKeyHint="next"
          />
          <TextField
            label="Registration number"
            placeholder="TML-0042"
            error="That number is already claimed"
            autoComplete="off"
            enterKeyHint="next"
          />
          <PhoneInput
            label="Organiser phone"
            value={phone}
            onChange={setPhone}
          />
          <PasswordField
            label="Password"
            autoComplete="new-password"
            enterKeyHint="done"
          />
          <Select
            label="Home zone"
            options={[...ZONES]}
            value={zone}
            onChange={setZone}
            placeholder="Pick a zone"
          />
          <NumberInput
            label="Squad size cap"
            value={squad}
            onChange={setSquad}
            min={7}
            max={30}
          />
          <div className="sm:col-span-2">
            <SearchField
              label="Find a club"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clubs near you"
            />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              label="Match notes"
              placeholder="Anything the organiser should know"
              hint="Visible to your club admins only"
              rows={3}
            />
          </div>
        </div>
      </Card>

      <Card tone="raised">
        <Card.Header>
          <h3>One-time code</h3>
        </Card.Header>
        <OtpInput value={otp} onChange={setOtp} length={6} />
        <p className="text-fg-subtle mt-3 text-xs">
          Was <code>rounded-xl</code> while every neighbouring field was a
          pill — now on <code>--radius-control</code> like the rest.
        </p>
      </Card>

      <Card tone="raised">
        <div className="flex flex-col gap-6">
          <RadioGroup
            label="Primary position"
            name="position"
            value={position}
            onChange={setPosition}
            options={[
              { value: "goalkeeper", label: "Goalkeeper" },
              { value: "defender", label: "Defender" },
              { value: "midfielder", label: "Midfielder" },
              { value: "forward", label: "Forward" },
            ]}
          />

          <Slider
            label="Match duration"
            value={duration}
            onChange={setDuration}
            min={40}
            max={120}
            step={5}
            suffix=" min"
          />

          <div className="flex flex-col gap-3">
            <Switch
              checked={notify}
              onChange={setNotify}
              label="WhatsApp match alerts"
            />
            <Checkbox
              checked={agreed}
              onChange={setAgreed}
              label="I confirm this result is accurate"
              hint="Results lock once both managers confirm"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
