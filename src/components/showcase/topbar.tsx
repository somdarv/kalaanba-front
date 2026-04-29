"use client";

import {
  KxAvatar,
  KxNotificationBell,
} from "@/components/showcase/primitives";
import { KxTextField } from "@/components/showcase/inputs";
import { KxThemeToggle } from "@/components/showcase/theme-toggle";
import { MagnifyingGlass } from "@phosphor-icons/react";

function SearchIcon() {
  return <MagnifyingGlass size={18} weight="bold" />;
}

export function KxTopbar() {
  return (
    <div className="flex items-center gap-3 rounded-full bg-[var(--kx-card)] p-2 pr-3 shadow-[var(--kx-shadow-md)] border border-[var(--kx-border)]">
      <div className="flex-1 min-w-0">
        <KxTextField
          name="topbar-search"
          placeholder="Type here to search..."
          leftIcon={<SearchIcon />}
          pill
          className="w-full"
        />
      </div>
      <KxThemeToggle />
      <KxNotificationBell />
      <KxAvatar
        name="Richard Somda"
        size="md"
        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop&crop=faces"
      />
    </div>
  );
}
