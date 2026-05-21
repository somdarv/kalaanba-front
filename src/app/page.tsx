import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-start justify-center gap-6 px-6 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-fg-muted">
        Kalaanba · Seeds of Play
      </p>
      <h1 className="font-display text-5xl font-bold leading-tight text-fg sm:text-6xl">
        Your game, on the record.
      </h1>
      <p className="max-w-xl text-base text-fg-muted">
        Grassroots football platform — leagues, tournaments, and a verified
        record of every player&apos;s career. Frontend skeleton (Phase 0.7) is
        live; engines arrive next.
      </p>
      <div className="flex flex-wrap items-center gap-3 pt-2 text-sm">
        <Link
          href="/legacy/showcase"
          className="rounded-full bg-primary px-5 py-2 font-medium text-on-primary transition hover:opacity-90"
        >
          Design system preview
        </Link>
        <span className="text-fg-muted">
          (legacy UI archived under /legacy)
        </span>
      </div>
    </main>
  );
}
