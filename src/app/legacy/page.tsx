"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const archived = [
  {
    href: "/legacy/landing",
    label: "Original landing",
    description:
      "The first Kalaanba landing — AgentOSBanner, SiteHeader, SiteHero.",
  },
  {
    href: "/legacy/showcase",
    label: "Component showcase",
    description:
      "Catalog of every primitive built during the prototype phase.",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.2, 0, 0, 1] as const },
  },
};

export default function LegacyIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
        className="font-display text-3xl font-semibold tracking-tight"
      >
        Legacy archive
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-3 text-fg-muted"
      >
        Pages preserved from the early prototype. Use these as reference while
        we rebuild the live UI.
      </motion.p>
      <motion.ul
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mt-10 space-y-4"
      >
        {archived.map((item) => (
          <motion.li
            key={item.href}
            variants={itemVariants}
            className="rounded-card border border-border bg-surface p-5 transition-colors hover:border-border-strong"
          >
            <Link href={item.href} className="block">
              <div className="font-medium">{item.label}</div>
              <div className="mt-1 text-sm text-fg-muted">
                {item.description}
              </div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </main>
  );
}
