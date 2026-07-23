"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { DialogClose, DialogDescription, DialogOverlay } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface MenuDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHowToPlay: () => void;
}

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/play", label: "Today's Case" },
  { href: "/archive", label: "Archive" },
  { href: "/stats", label: "Statistics" },
] as const;

/**
 * Left slide-in nav drawer, opened from the hamburger on every screen.
 * "How to Play" stays a callback into HowToPlayDialog rather than a
 * route, matching the design's single shared dialog.
 */
export function MenuDrawer({ open, onOpenChange, onHowToPlay }: MenuDrawerProps) {
  const pathname = usePathname();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogOverlay className="bg-[rgba(9,22,42,.5)] backdrop-blur-[3px]" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-[300px] flex-col gap-1.5 bg-deep-navy px-6 py-6.5 text-white outline-none",
            "shadow-[8px_0_40px_rgba(0,0,0,.3)]",
            "data-open:animate-in data-open:slide-in-from-left data-open:duration-300",
            "data-closed:animate-out data-closed:slide-out-to-left data-closed:duration-200",
          )}
        >
          <DialogPrimitive.Title className="sr-only">Menu</DialogPrimitive.Title>
          <DialogDescription className="sr-only">Site navigation</DialogDescription>

          <div className="mb-6 flex items-center">
            <Image src="/oculordle-logo.png" alt="Oculordle" width={1446} height={298} className="h-[30px] w-auto" />
          </div>

          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <DialogClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-[9px] px-3.5 py-3.5 font-body text-base font-semibold transition-colors duration-150",
                      active ? "bg-white/8" : "hover:bg-white/8",
                    )}
                  >
                    {item.label}
                    <ArrowRight className="size-4 opacity-40" aria-hidden="true" />
                  </Link>
                </DialogClose>
              );
            })}
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onHowToPlay();
              }}
              className="flex items-center justify-between rounded-[9px] px-3.5 py-3.5 text-left font-body text-base font-semibold transition-colors duration-150 hover:bg-white/8"
            >
              How to Play
              <ArrowRight className="size-4 opacity-40" aria-hidden="true" />
            </button>
          </nav>

          <p className="mt-auto font-mono text-[10px] leading-relaxed tracking-[0.14em] text-white/60 uppercase">
            For medical education only — not medical advice.
          </p>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
