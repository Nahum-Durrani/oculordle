import Image from "next/image";
import Link from "next/link";

const DISCLAIMER = "For medical education only — not medical advice.";
const CONTACT_EMAIL = "oculordle@gmail.com";

const LINK_CLASS = "font-mono text-[10.5px] tracking-[0.08em] text-slate uppercase transition-colors hover:text-ink";

function LegalNav() {
  return (
    <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <Link href="/terms" className={LINK_CLASS}>
        Terms of Service
      </Link>
      <Link href="/privacy" className={LINK_CLASS}>
        Privacy Policy
      </Link>
      <Link href="/#co-directors" className={LINK_CLASS}>
        Team
      </Link>
      <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASS}>
        Contact
      </a>
    </nav>
  );
}

export function SiteFooter({ variant = "plain" }: { variant?: "plain" | "home" }) {
  const year = new Date().getFullYear();

  if (variant === "home") {
    return (
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-x-7 gap-y-3 px-7 py-6">
          <Image
            src="/oculordle-logo.png"
            alt="Oculordle"
            width={1446}
            height={298}
            className="h-[26px] w-auto opacity-85 brightness-0 saturate-100"
          />
          <LegalNav />
          <p className="font-mono text-[10.5px] tracking-[0.08em] text-slate uppercase">
            {DISCLAIMER} · © {year} Oculordle
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-[1000px] flex-wrap items-center justify-between gap-x-7 gap-y-3 px-7 py-5">
        <p className="font-mono text-[10.5px] tracking-[0.12em] text-slate uppercase">{DISCLAIMER}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <LegalNav />
          <span className="font-mono text-[10.5px] tracking-[0.08em] text-slate">© {year} Oculordle</span>
        </div>
      </div>
    </footer>
  );
}
