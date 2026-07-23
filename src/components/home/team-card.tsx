import Image from "next/image";
import { cn } from "@/lib/utils";

export interface TeamMember {
  name: string;
  role: string;
  blurb?: string;
  image: string;
}

const cardBase =
  "flex h-full gap-4 rounded-[14px] border border-border bg-surface shadow-[0_3px_14px_rgba(16,35,58,.05)]";

function RoleLine({
  role,
  roleColor,
  roleStyle,
  className,
}: {
  role: string;
  roleColor: string;
  roleStyle: "eyebrow" | "caption";
  className?: string;
}) {
  if (roleStyle === "caption") {
    return (
      <p className={cn("font-mono text-xs text-slate", className)}>{role}</p>
    );
  }
  return (
    <p
      className={cn("font-mono text-[11px] font-semibold tracking-[0.16em] uppercase", className)}
      style={{ color: roleColor }}
    >
      {role}
    </p>
  );
}

export function TeamCard({
  name,
  role,
  blurb,
  image,
  roleColor = "#1957a4",
  roleStyle = "eyebrow",
}: TeamMember & {
  roleColor?: string;
  roleStyle?: "eyebrow" | "caption";
}) {
  return (
    <div className={cn(cardBase, "flex-col items-center gap-4 p-8.5 py-8.5 text-center")}>
      <div className="relative size-[118px] shrink-0 overflow-hidden rounded-full border border-border">
        <Image src={image} alt={name} fill sizes="118px" className="object-cover" />
      </div>
      <div>
        <p className="font-display text-xl font-bold text-ink">{name}</p>
        <RoleLine role={role} roleColor={roleColor} roleStyle={roleStyle} className="mt-1.5" />
      </div>
      {blurb && <p className="max-w-[340px] text-[15px] leading-[1.6] text-ink-soft">{blurb}</p>}
    </div>
  );
}
