import type { Metadata } from "next";
import { SiteHeader } from "@/components/game/site-header";
import { SiteFooter } from "@/components/game/site-footer";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-4 px-7 py-11.5">
        <h1 className="font-display text-[34px] font-extrabold tracking-tight text-ink">Terms of Service</h1>
        <p className="text-[15px] text-ink-soft">This page is a placeholder — final terms are coming soon.</p>
      </main>

      <SiteFooter />
    </div>
  );
}
