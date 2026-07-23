"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { SiteFooter } from "@/components/game/site-footer";
import { MenuDrawer } from "@/components/game/menu-drawer";
import { HowToPlayDialog } from "@/components/game/how-to-play-dialog";
import { TeamCard, type TeamMember } from "@/components/home/team-card";
import { EyeHeroBackground } from "@/components/home/eye-hero-background";
import { getDailyCase } from "@/lib/case-data";

const CO_DIRECTORS_ANCHOR = "co-directors";

const TEAM: TeamMember[] = [
  {
    name: "Faizan Naveed",
    role: "BHSc, MD(c) · Faculty of Medicine, University of Ottawa",
    image: "/team/co-director-1.png",
  },
  {
    name: "Salem Abu Al-Burak",
    role: "BMSc, MD(c) · Schulich Medicine & Dentistry, Western University",
    image: "/team/salem-abu-al-burak.png",
  },
  {
    name: "Nahum Durrani",
    role: "Software Developer & Website Lead · B.Eng, York University",
    image: "/team/nahum-durrani.jpg",
  },
  {
    name: "Fahad Butt",
    role: "BSc, MD(c) · Schulich Medicine & Dentistry, Western University",
    image: "/team/fahad-butt.png",
  },
];

export function HomeView() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const [tagline, setTagline] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const daily = await getDailyCase();
      if (!cancelled) setTagline(`${daily.categories[0] ?? ""} · ${daily.difficulty}`);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const revealUp = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.9, ease: [0.16, 0.8, 0.3, 1] as const, delay: reduceMotion ? 0 : delay },
  });

  const revealOnView = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: reduceMotion ? 0 : 0.7, ease: [0.16, 0.8, 0.3, 1] as const, delay: reduceMotion ? 0 : delay },
  });

  return (
    <div className="flex flex-col">
      <section
        ref={heroRef}
        className="relative flex min-h-dvh min-h-[600px] flex-col items-center justify-center gap-6 overflow-hidden px-6 text-center"
        style={{ background: "radial-gradient(120% 130% at 50% 50%,#155091 0%,#103e75 46%,#0b2e58 100%)" }}
      >
        <EyeHeroBackground />

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Menu"
          className="absolute top-5 left-5.5 z-10 flex flex-col gap-[5px] p-3.5"
        >
          <span className="h-0.5 w-[26px] rounded-full bg-white/85" />
          <span className="h-0.5 w-[26px] rounded-full bg-white/85" />
          <span className="h-0.5 w-[26px] rounded-full bg-white/85" />
        </button>

        <button
          type="button"
          onClick={() => setHowToPlayOpen(true)}
          className="absolute top-5 right-5.5 z-10 rounded-lg border border-white/22 px-3.5 py-4 font-mono text-[11px] tracking-[0.16em] text-white/70 transition-colors duration-150 hover:border-white/50 hover:text-white"
        >
          How to play
        </button>

        <motion.h1 {...revealUp(0)} className="relative z-10 flex">
          <Image
            src="/oculordle-logo.png"
            alt="Oculordle"
            width={1446}
            height={298}
            priority
            className="h-16 w-auto sm:h-20"
          />
        </motion.h1>

        <motion.p {...revealUp(0.1)} className="relative z-10 max-w-[520px] text-lg leading-[1.55] text-[#c3d2e8]">
          A guessing game for all looking to broaden their knowledge in optometry and ophthalmology
        </motion.p>

        <motion.div {...revealUp(0.2)} className="relative z-10">
          <Link
            href="/play"
            className="mt-2 inline-flex items-center gap-2.75 rounded-lg bg-green px-8 py-3.75 font-body text-xl font-bold text-white shadow-[0_8px_26px_rgba(15,60,45,.4)] transition-[transform,box-shadow] duration-180 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(15,60,45,.5)]"
          >
            Play today&rsquo;s case
            <ArrowRight className="size-[19px]" aria-hidden="true" />
          </Link>
        </motion.div>

        <motion.div
          {...revealUp(0.3)}
          className="relative z-10 font-mono text-[11px] tracking-[0.18em] text-[#bdcbe6] uppercase"
        >
          {tagline ?? " "}
        </motion.div>

        <motion.button
          type="button"
          onClick={() =>
            document.getElementById(CO_DIRECTORS_ANCHOR)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" })
          }
          aria-label="Scroll to more info"
          style={{ opacity: scrollCueOpacity }}
          className="absolute bottom-6.5 left-1/2 z-10 -translate-x-1/2 rounded-sm text-[#bdcbe6]"
        >
          <motion.span
            animate={reduceMotion ? undefined : { y: [0, 7, 0] }}
            transition={reduceMotion ? undefined : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1.25"
          >
            <span className="font-mono text-[11px] tracking-[0.24em] uppercase">Scroll</span>
            <ChevronDown className="size-4" aria-hidden="true" />
          </motion.span>
        </motion.button>
      </section>

      <section className="mx-auto w-full max-w-[1000px] px-7 pt-25 pb-22.5">
        <motion.div id={CO_DIRECTORS_ANCHOR} {...revealOnView(0)} className="mb-14 scroll-mt-8 text-center">
          <p className="mb-3.5 font-mono text-xs tracking-[0.2em] text-slate uppercase">The team behind the cases</p>
          <h2 className="font-display text-[38px] font-extrabold tracking-tight text-ink">
            Built by students, for the curious
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6.5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((person, i) => (
            <motion.div key={person.name} {...revealOnView(i * 0.1)} className="h-full">
              <TeamCard {...person} roleStyle="caption" />
            </motion.div>
          ))}
        </div>
      </section>

      <SiteFooter variant="home" />

      <MenuDrawer open={menuOpen} onOpenChange={setMenuOpen} onHowToPlay={() => setHowToPlayOpen(true)} />
      <HowToPlayDialog open={howToPlayOpen} onOpenChange={setHowToPlayOpen} />
    </div>
  );
}
