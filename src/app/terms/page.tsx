import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/game/site-header";
import { SiteFooter } from "@/components/game/site-footer";

export const metadata: Metadata = {
  title: "Terms of Service",
};

const CONTACT_EMAIL = "oculordle@gmail.com";

const H2_CLASS = "font-display text-xl font-bold tracking-tight text-ink";
const P_CLASS = "text-[15px] leading-relaxed text-ink-soft";
const UL_CLASS = "list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-ink-soft";
const LINK_CLASS = "text-cobalt underline decoration-cobalt/30 underline-offset-2 hover:text-cobalt-hover";
const CALLOUT_CLASS = "rounded-xl border border-border-strong bg-surface-sunken px-5 py-4 text-[13.5px] leading-relaxed text-ink-soft";

export default function TermsPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-9 px-7 py-11.5">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[34px] font-extrabold tracking-tight text-ink">Terms of Service</h1>
          <p className="font-mono text-[11px] tracking-[0.1em] text-slate uppercase">
            Effective Date: July 31, 2026 · Last Updated: July 31, 2026
          </p>
        </div>

        <p className={P_CLASS}>
          Welcome to Oculordle. These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the
          Oculordle website, games, and related services (collectively, the &ldquo;Service&rdquo;), operated by
          Oculordle (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing or using the Service, you
          agree to be bound by these Terms. If you do not agree, do not use the Service.
        </p>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>1. What Oculordle Is</h2>
          <p className={P_CLASS}>
            Oculordle is a daily educational game in which players attempt to identify ophthalmic conditions and
            diagnoses from clinical presentations, images, and case descriptions. The Service is intended for
            medical education, training, and entertainment.
          </p>
          <div className={CALLOUT_CLASS}>
            <p>
              <strong className="font-semibold text-ink">The Service is for medical education only and is not
              medical advice.</strong>{" "}
              Content on Oculordle — including case descriptions, images, diagnoses,
              explanations, and any feedback — is provided solely for educational purposes. It is not a substitute
              for professional medical judgment, diagnosis, or treatment, and must not be used to diagnose or treat
              any actual patient or condition. Nothing on the Service creates a physician&ndash;patient
              relationship. If you or anyone else may have a medical condition, consult a qualified healthcare
              professional. In an emergency, contact your local emergency services.
            </p>
          </div>
          <p className={P_CLASS}>
            You are solely responsible for how you apply anything learned through the Service. We make no
            representation that the content is complete, current, or clinically accurate for any specific
            situation.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>2. Eligibility</h2>
          <p className={P_CLASS}>
            You must be at least 13 years old (or the minimum age of digital consent in your jurisdiction, if
            higher) to use the Service. By using Oculordle, you represent that you meet this requirement and that
            you have the legal capacity to agree to these Terms. The Service is designed with medical students,
            trainees, and clinicians in mind, but availability of the Service is not restricted to any professional
            group and does not imply any endorsement or certification.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>3. Accounts</h2>
          <p className={P_CLASS}>
            Some features may require you to create an account. If you create one, you agree to provide accurate
            information and to keep your login credentials confidential. You are responsible for all activity that
            occurs under your account. Notify us promptly if you believe your account has been accessed without
            your authorization.
          </p>
          <p className={P_CLASS}>
            We may suspend or terminate accounts that violate these Terms, are inactive for an extended period, or
            are used in a way that harms the Service or other users.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>4. Acceptable Use</h2>
          <p className={P_CLASS}>When using Oculordle, you agree not to:</p>
          <ul className={UL_CLASS}>
            <li>Use the Service for any unlawful purpose or in violation of these Terms;</li>
            <li>
              Attempt to reverse-engineer, scrape, harvest, or bulk-download the case database, answers, images, or
              other content, except as expressly permitted;
            </li>
            <li>
              Use automated systems, bots, or scripts to interact with the Service in ways that disrupt it or gain
              an unfair advantage;
            </li>
            <li>Interfere with, overload, or attempt to gain unauthorized access to the Service, its servers, or related systems;</li>
            <li>Circumvent, disable, or interfere with security-related features or usage limits;</li>
            <li>
              Redistribute, resell, or publicly repost Oculordle content as if it were your own or for commercial
              gain without permission;
            </li>
            <li>Misrepresent the Service as a source of clinical or diagnostic authority.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>5. Intellectual Property</h2>
          <p className={P_CLASS}>
            The Service, including its design, code, game mechanics, text, curated case content, branding, and the
            Oculordle name and logo, is owned by us or our licensors and is protected by intellectual property
            laws. We grant you a limited, personal, non-exclusive, non-transferable, revocable license to access
            and use the Service for your own educational and personal use, subject to these Terms.
          </p>
          <p className={P_CLASS}>
            Clinical images and case materials may be sourced from third parties or used under license or
            applicable educational-use provisions. Rights in those materials remain with their respective owners.
            You may not extract or reuse them outside the Service except as permitted by their underlying licenses.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>6. User Content and Feedback</h2>
          <p className={P_CLASS}>
            If the Service allows you to submit content (such as comments, suggested cases, or feedback), you
            retain ownership of what you submit but grant us a worldwide, royalty-free, non-exclusive license to
            use, reproduce, modify, and display that content in connection with operating and improving the
            Service. You represent that you have the rights to submit it and that it does not infringe anyone&rsquo;s
            rights or include confidential patient information. Do not submit any real, identifiable patient data.
          </p>
          <p className={P_CLASS}>
            Any feedback or ideas you share may be used by us without obligation or compensation to you.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>7. Third-Party Links and Services</h2>
          <p className={P_CLASS}>
            The Service may reference or link to third-party websites, tools, or resources. We do not control and
            are not responsible for third-party content or practices. Your use of third-party services is governed
            by their own terms and policies.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>8. Privacy</h2>
          <p className={P_CLASS}>
            Your use of the Service is also governed by our{" "}
            <Link href="/privacy" className={LINK_CLASS}>
              Privacy Policy
            </Link>
            , which explains what information we collect and how we use it. By using the Service, you consent to
            those practices.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>9. Disclaimers</h2>
          <div className={CALLOUT_CLASS}>
            <p className="uppercase">
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without warranties of any
              kind, whether express, implied, or statutory, including without limitation implied warranties of
              merchantability, fitness for a particular purpose, accuracy, and non-infringement.
            </p>
          </div>
          <p className={P_CLASS}>
            Without limiting the foregoing, we make no warranty that the Service will be uninterrupted, secure, or
            error-free, that content will be accurate or reliable, or that the Service is appropriate for any
            particular clinical, professional, or educational purpose. As stated above, the Service is not medical
            advice.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>10. Limitation of Liability</h2>
          <div className={CALLOUT_CLASS}>
            <p className="uppercase">
              To the maximum extent permitted by law, in no event will Oculordle or its operators, contributors, or
              licensors be liable for any indirect, incidental, special, consequential, or punitive damages, or any
              loss of data, profits, or goodwill, arising out of or relating to your use of (or inability to use)
              the Service, even if advised of the possibility of such damages.
            </p>
            <p className="mt-3 uppercase">
              To the maximum extent permitted by law, our total liability for all claims relating to the Service
              will not exceed the greater of (a) the amount you paid us, if any, to use the Service in the twelve
              months before the claim, or (b) CAD $100.
            </p>
          </div>
          <p className={P_CLASS}>
            Some jurisdictions do not allow certain limitations, so some of the above may not apply to you. Nothing
            in these Terms limits liability that cannot be limited by law.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>11. Indemnification</h2>
          <p className={P_CLASS}>
            You agree to indemnify and hold harmless Oculordle and its operators from any claims, damages, losses,
            or expenses (including reasonable legal fees) arising out of your misuse of the Service, your violation
            of these Terms, or your violation of any law or the rights of a third party.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>12. Changes to the Service and Terms</h2>
          <p className={P_CLASS}>
            We may modify, suspend, or discontinue any part of the Service at any time. We may also update these
            Terms from time to time. When we do, we will revise the &ldquo;Last Updated&rdquo; date above, and
            material changes may be communicated through the Service. Your continued use after changes take effect
            constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>13. Termination</h2>
          <p className={P_CLASS}>
            You may stop using the Service at any time. We may suspend or terminate your access to the Service,
            with or without notice, if you violate these Terms or if we discontinue the Service. Sections that by
            their nature should survive termination — including intellectual property, disclaimers, limitation of
            liability, and indemnification — will survive.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>14. Governing Law</h2>
          <p className={P_CLASS}>
            These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada
            applicable therein, without regard to conflict-of-law principles. You agree to the exclusive
            jurisdiction of the courts located in Ontario, Canada for any dispute arising out of or relating to
            these Terms or the Service, except where prohibited by applicable law.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>15. Contact</h2>
          <p className={P_CLASS}>
            Questions about these Terms can be sent to us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASS}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <p className="border-t border-border pt-6 font-mono text-[11px] tracking-[0.1em] text-slate uppercase italic">
          For medical education only — not medical advice.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
