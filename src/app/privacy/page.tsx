import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/game/site-header";
import { SiteFooter } from "@/components/game/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const CONTACT_EMAIL = "oculordle@gmail.com";

const H2_CLASS = "font-display text-xl font-bold tracking-tight text-ink";
const P_CLASS = "text-[15px] leading-relaxed text-ink-soft";
const UL_CLASS = "list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-ink-soft";
const LINK_CLASS = "text-cobalt underline decoration-cobalt/30 underline-offset-2 hover:text-cobalt-hover";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-9 px-7 py-11.5">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[34px] font-extrabold tracking-tight text-ink">Privacy Policy</h1>
          <p className="font-mono text-[11px] tracking-[0.1em] text-slate uppercase">
            Effective Date: July 31, 2026 · Last Updated: July 31, 2026
          </p>
        </div>

        <p className={P_CLASS}>
          This Privacy Policy explains how Oculordle (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
          collects, uses, and protects information when you use the Oculordle website, games, and related services
          (the &ldquo;Service&rdquo;). By using the Service, you agree to the practices described here. This Policy
          works alongside our{" "}
          <Link href="/terms" className={LINK_CLASS}>
            Terms of Service
          </Link>
          .
        </p>

        <p className={P_CLASS}>
          Oculordle is an educational ophthalmology game. We aim to collect as little personal information as
          possible and to be clear about what we do collect.
        </p>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>1. Information We Collect</h2>
          <p className={P_CLASS}>
            <strong className="font-semibold text-ink">Account information.</strong> If you create an account, we
            collect the information you provide, such as your email address, a username, and a securely hashed
            password. We do not store your password in plain text. If you sign in through a third-party provider
            (for example, Google), we receive basic profile information from that provider as permitted by your
            settings there.
          </p>
          <p className={P_CLASS}>
            <strong className="font-semibold text-ink">Gameplay data.</strong> To run the game and features like
            streaks, statistics, and history, we may collect and store data about how you play — for example, your
            guesses, scores, completion streaks, timestamps, and progress. When you are not signed in, some of this
            data may be stored locally in your browser rather than on our servers.
          </p>
          <p className={P_CLASS}>
            <strong className="font-semibold text-ink">Technical and usage data.</strong> Like most websites, we
            automatically receive certain information when you access the Service, such as your IP address, browser
            type, device and operating system information, referring pages, and interactions with the Service. This
            helps us keep the Service secure and working properly.
          </p>
          <p className={P_CLASS}>
            <strong className="font-semibold text-ink">Analytics data.</strong> We may use analytics tools to
            understand how the Service is used in aggregate — for example, which cases are played most or where
            users encounter errors.
          </p>
          <p className={P_CLASS}>
            <strong className="font-semibold text-ink">Communications.</strong> If you contact us (for example, by
            email or through a feedback form), we keep your message and contact details so we can respond.
          </p>
          <p className={P_CLASS}>
            We do not ask for, and you should never submit, real or identifiable patient information through the
            Service.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>2. How We Use Information</h2>
          <p className={P_CLASS}>We use the information above to:</p>
          <ul className={UL_CLASS}>
            <li>Operate, maintain, and improve the Service and its features;</li>
            <li>Create and manage your account and keep it secure;</li>
            <li>Save and display your gameplay progress, streaks, and statistics;</li>
            <li>Understand usage and improve game content and difficulty;</li>
            <li>Diagnose technical issues and protect against fraud, abuse, and security threats;</li>
            <li>Respond to your questions, feedback, and requests;</li>
            <li>Comply with legal obligations.</li>
          </ul>
          <p className={P_CLASS}>
            We do not sell your personal information, and we do not use your data to serve you targeted
            third-party advertising.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>3. Legal Bases for Processing</h2>
          <p className={P_CLASS}>
            Where required by law (for example, for users in the EU/UK), we rely on the following legal bases: your
            consent (which you may withdraw at any time); performance of our agreement with you (to provide the
            Service and your account); our legitimate interests (such as securing and improving the Service); and
            compliance with legal obligations. In Canada, we handle personal information in accordance with
            applicable privacy legislation, including PIPEDA, on the basis of your consent and other permitted
            grounds.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>4. Cookies and Local Storage</h2>
          <p className={P_CLASS}>
            The Service uses cookies and similar technologies (including your browser&rsquo;s local storage) to
            keep you signed in, remember your preferences, store gameplay progress on your device, and measure
            usage. You can control or clear cookies and local storage through your browser settings, though
            disabling them may affect features such as saved streaks or staying logged in.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>5. How We Share Information</h2>
          <p className={P_CLASS}>We share personal information only in limited circumstances:</p>
          <ul className={UL_CLASS}>
            <li>
              <strong className="font-semibold text-ink">Service providers.</strong> We use third parties to host,
              operate, and support the Service — for example, cloud hosting, database, authentication, and
              analytics providers. They process information on our behalf and are permitted to use it only to
              provide services to us.
            </li>
            <li>
              <strong className="font-semibold text-ink">Legal and safety.</strong> We may disclose information if
              required by law, legal process, or a governmental request, or where necessary to protect the rights,
              safety, or property of Oculordle, our users, or others.
            </li>
            <li>
              <strong className="font-semibold text-ink">Business transfers.</strong> If Oculordle is involved in a
              merger, acquisition, or transfer of assets, information may be transferred as part of that
              transaction, subject to this Policy.
            </li>
          </ul>
          <p className={P_CLASS}>We do not sell your personal information to third parties.</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>6. International Data Transfers</h2>
          <p className={P_CLASS}>
            The Service may be hosted and processed on servers located outside your country, including outside
            Canada (for example, in the United States). Where we transfer personal information across borders, we
            take steps to ensure it remains protected consistent with this Policy and applicable law. By using the
            Service, you acknowledge that your information may be processed in these locations.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>7. Data Retention</h2>
          <p className={P_CLASS}>
            We keep personal information for as long as needed to provide the Service and for the purposes
            described in this Policy — for example, while your account is active. We may retain certain information
            longer where necessary to comply with legal obligations, resolve disputes, or enforce our agreements.
            When information is no longer needed, we take reasonable steps to delete or anonymize it. Gameplay data
            stored locally in your browser remains until you clear it.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>8. Security</h2>
          <p className={P_CLASS}>
            We use reasonable technical and organizational measures to protect personal information against loss,
            misuse, and unauthorized access — including password hashing and encryption in transit. No method of
            transmission or storage is completely secure, however, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>9. Your Rights and Choices</h2>
          <p className={P_CLASS}>
            Depending on where you live, you may have rights to access, correct, update, delete, or export your
            personal information, to object to or restrict certain processing, and to withdraw consent. You can
            exercise these rights, or ask questions about your data, by contacting us at the address below. We will
            respond as required by applicable law. You may also disable cookies or clear local storage through your
            browser at any time.
          </p>
          <p className={P_CLASS}>
            If you are in a jurisdiction with a data protection authority, you have the right to lodge a complaint
            with it, though we encourage you to contact us first so we can help.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>10. Children&rsquo;s Privacy</h2>
          <p className={P_CLASS}>
            The Service is not directed to children under 13 (or the minimum age of digital consent in your
            jurisdiction, if higher), and we do not knowingly collect personal information from them. If you
            believe a child has provided us personal information, please contact us and we will take appropriate
            steps to delete it.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>11. Third-Party Links</h2>
          <p className={P_CLASS}>
            The Service may link to third-party websites or resources that we do not control. This Policy does not
            apply to those third parties, and we encourage you to review their privacy policies.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>12. Changes to This Policy</h2>
          <p className={P_CLASS}>
            We may update this Policy from time to time. When we do, we will revise the &ldquo;Last Updated&rdquo;
            date above, and we may notify you of material changes through the Service. Your continued use after
            changes take effect constitutes acceptance of the updated Policy.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className={H2_CLASS}>13. Contact Us</h2>
          <p className={P_CLASS}>
            If you have questions or requests regarding this Policy or your personal information, contact us at{" "}
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
