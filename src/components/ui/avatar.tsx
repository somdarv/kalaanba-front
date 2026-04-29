import Image from "next/image";
import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";
type AvatarStatus = "online" | "verified" | "idle";

type AvatarProps = {
  name: string;
  src?: string;
  alt?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
};

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-10 w-10 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
};

const statusClasses: Record<AvatarStatus, string> = {
  online: "bg-primary",
  verified: "bg-accent-blue",
  idle: "bg-fg-muted",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Avatar({ name, src, alt, size = "md", status, className }: AvatarProps) {
  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden rounded-[1.15rem] border border-border bg-surface-2 font-display font-800 text-fg",
        "transition-[border-color,background-color] duration-200 ease-alive hover:border-primary hover:bg-surface",
        sizeClasses[size],
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={alt ?? name} fill sizes="64px" className="object-cover" unoptimized />
      ) : (
        getInitials(name)
      )}
      {status ? (
        <span
          className={cn(
            "absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-surface",
            statusClasses[status],
          )}
          aria-hidden="true"
        />
      ) : null}
    </span>
  );
}