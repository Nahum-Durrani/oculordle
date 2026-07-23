import Image from "next/image";

const DISCLAIMER =
  "For medical education only — not medical advice. Cases are AI-drafted, pending physician review.";

export function SiteFooter({ variant = "plain" }: { variant?: "plain" | "home" }) {
  if (variant === "home") {
    return (
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-[1000px] flex-wrap items-center justify-between gap-4.5 px-7 py-8.5">
          <Image
            src="/oculordle-logo.png"
            alt="Oculordle"
            width={1446}
            height={298}
            className="h-[26px] w-auto opacity-85 brightness-0 saturate-100"
          />
          <p className="max-w-[560px] text-right font-mono text-[11px] leading-relaxed tracking-[0.1em] text-slate uppercase">
            {DISCLAIMER}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border bg-surface px-6 py-5.5 text-center">
      <p className="font-mono text-[10.5px] leading-relaxed tracking-[0.12em] text-slate uppercase">
        {DISCLAIMER}
      </p>
    </footer>
  );
}
