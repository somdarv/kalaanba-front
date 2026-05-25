import { Button, ThemeToggle } from "@/components/ui";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-start justify-center gap-6 px-6 py-12">
      <div className="flex w-full items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.2em] text-fg-muted">
          Kalaanba · Seeds of Play
        </p>
        <ThemeToggle compact />
      </div>
      <h1 className="font-display text-5xl font-bold leading-tight text-fg sm:text-6xl">
        Your game, on the record.
      </h1>
      <p className="max-w-xl text-base text-fg-muted">
        Grassroots football platform — leagues, tournaments, and a verified
        record of every player&apos;s career. Phase 2 of the rebuild (Tier 0 +
        Tier 1) is live in the showcase.
      </p>
      <div className="flex flex-wrap items-center gap-3 pt-2 text-sm">
        <Link href="/showcase">
          <Button intent="primary">Open component showcase</Button>
        </Link>
        <Link href="/legacy/showcase">
          <Button intent="ghost">Legacy archive (read-only)</Button>
        </Link>
      </div>
    </main>
  );
}
