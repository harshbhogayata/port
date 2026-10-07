"use client";

import TLink from "@/components/chrome/TLink";
import Clock from "@/components/chrome/Clock";
import SectionLabel from "./SectionLabel";
import { SplitReveal, Reveal, useMagnetic } from "@/components/motion/Motion";
import { profile } from "@/content/profile";
import { copyText } from "@/lib/utils";

export default function Contact({ num = "11", standalone = false }: { num?: string; standalone?: boolean }) {
  const mag = useMagnetic<HTMLButtonElement>(0.18);
  return (
    <section className="contact section" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        {!standalone ? <SectionLabel num={num} title="Contact" right={profile.replyTime} /> : null}
        <SplitReveal className="contact__title" id="contact-title" as={standalone ? "h1" : "h2"} trigger={standalone ? "enter" : "scroll"} dot>
          {"Let’s build something that ships"}
        </SplitReveal>

        <div className="contact__grid">
          <Reveal className="contact__main" childrenStagger>
            <p className="mono mute">Write to me</p>
            <button
              ref={mag}
              type="button"
              className="contact__email"
              onClick={() => copyText(profile.email, "Email copied. Talk soon")}
              data-cursor="Copy"
            >
              <span>{profile.email}</span>
              <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
                <rect x="7.5" y="7.5" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3.5 18.5v-15h15" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <div className="contact__links">
              <a href={`mailto:${profile.email}`} className="link-line">
                Open in mail app
                <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
                  <path d="M1 12L12 1M3 1h9v9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </a>
              {!standalone ? (
                <TLink href="/contact" className="link-line">
                  Use the project form
                  <svg width="20" height="12" viewBox="0 0 22 14" aria-hidden="true">
                    <path d="M0 7h20M14 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </TLink>
              ) : null}
            </div>
          </Reveal>

          <Reveal className="contact__side" childrenStagger>
            <div className="contact__block">
              <p className="mono mute">Availability</p>
              <p className="contact__avail">
                <span className={profile.availability.open ? "status-dot" : "status-dot status-dot--off"} aria-hidden="true" />
                {profile.availability.label}
              </p>
            </div>
            <div className="contact__block">
              <p className="mono mute">Local time</p>
              <p>
                <Clock withOffset />
              </p>
            </div>
            <ul className="contact__socials">
              {profile.socials
                .filter((s) => s.label !== "Email")
                .map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" data-cursor={s.label}>
                      <span>{s.label}</span>
                      <span className="mono mute">{s.handle}</span>
                      <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
                        <path d="M1 12L12 1M3 1h9v9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </a>
                  </li>
                ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
