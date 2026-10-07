import type { Metadata } from "next";
import PageHeader from "@/components/pages/PageHeader";
import SectionLabel from "@/components/home/SectionLabel";
import TLink from "@/components/chrome/TLink";
import { Reveal } from "@/components/motion/Motion";
import { buildDate } from "@/components/chrome/TitleBlock";

export const metadata: Metadata = {
  title: "Colophon",
  description: "How this site is built: stack, type, colour, motion and performance budgets.",
};

const stack = [
  { k: "Framework", v: "Next.js (App Router), React, TypeScript" },
  { k: "Motion", v: "GSAP with ScrollTrigger, SplitText and DrawSVG; Lenis for smooth scroll" },
  { k: "Art", v: "Procedural SVG: oblique and isometric projections, noise-dithered gradients" },
  { k: "Type", v: "Inter Tight and JetBrains Mono, self-hosted variable fonts" },
  { k: "Hosting", v: "Static where possible, edge where not" },
  { k: "Analytics", v: "Privacy-friendly, cookie-free (to be wired)" },
];

const tokens = [
  { name: "--paper", light: "#f6f7f9", dark: "#061029" },
  { name: "--ink", light: "#0a0b0e", dark: "#eef2ff" },
  { name: "--blue", light: "#1638ff", dark: "#5b7bff" },
  { name: "--lime", light: "#d7f22c", dark: "#d7f22c" },
  { name: "--mute", light: "#677084", dark: "#8d9abd" },
];

const budgets = [
  { k: "Largest Contentful Paint", v: "< 1.5 s" },
  { k: "Cumulative Layout Shift", v: "< 0.05" },
  { k: "Interaction to Next Paint", v: "< 200 ms" },
  { k: "Home page JavaScript", v: "< 150 KB gzip" },
];

export default function ColophonPage() {
  // cubic-bezier(0.22, 1, 0.36, 1) plotted in a 200×200 box
  const curve = "M0 200 C44 0, 72 0, 200 0";
  return (
    <>
      <PageHeader
        code="A-07"
        eyebrow="Colophon"
        title="How this site is drawn"
        lede="Built by hand as a drawing set: one grid, two colours, one easing curve. Here's everything that went into it."
        aside={`Last built ${buildDate()}`}
      />

      <section className="section--tight">
        <div className="wrap">
          <SectionLabel num="01" title="Stack" />
          <Reveal as="dl" className="colo__dl" childrenStagger y={20}>
            {stack.map((s) => (
              <div key={s.k}>
                <dt className="mono mute">{s.k}</dt>
                <dd>{s.v}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section--tight">
        <div className="wrap">
          <SectionLabel num="02" title="Typography" />
          <div className="colo__type">
            <Reveal className="colo__specimen">
              <p className="colo__big">Aa</p>
              <p className="mono mute">Inter Tight · 100–900 · display & text</p>
              <p className="colo__glyphs">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 → ↗ ·</p>
            </Reveal>
            <Reveal className="colo__specimen">
              <p className="colo__big mono-big">Aa</p>
              <p className="mono mute">JetBrains Mono · labels, data & annotations</p>
              <p className="colo__glyphs mono">A-00 · 18:51 IST · x 1032 y 418 · {"{ }"} =&gt;</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="wrap">
          <SectionLabel num="03" title="Colour" right="Paper by day, blueprint by night (in IST)" />
          <Reveal as="ul" className="colo__swatches" childrenStagger y={20}>
            {tokens.map((t) => (
              <li key={t.name}>
                <span className="colo__sw">
                  <i style={{ background: t.light }} />
                  <i style={{ background: t.dark }} />
                </span>
                <span className="mono">{t.name}</span>
                <span className="mono mute">
                  {t.light} / {t.dark}
                </span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section--tight">
        <div className="wrap colo__motion">
          <SectionLabel num="04" title="Motion" right="One curve for everything" />
          <div className="colo__motion-grid">
            <Reveal className="colo__curve">
              <svg viewBox="-10 -10 220 220" aria-label="Easing curve cubic-bezier(0.22, 1, 0.36, 1)" role="img">
                <rect x="0" y="0" width="200" height="200" className="colo__box" />
                <line x1="0" y1="200" x2="44" y2="0" className="colo__handle" />
                <line x1="200" y1="0" x2="72" y2="0" className="colo__handle" />
                <path d={curve} className="colo__path" />
                <circle cx="44" cy="0" r="4" className="colo__cp" />
                <circle cx="72" cy="0" r="4" className="colo__cp" />
                <circle r="6" className="colo__ball">
                  <animateMotion dur="2.4s" repeatCount="indefinite" path={curve} keyPoints="0;1;1" keyTimes="0;0.7;1" calcMode="linear" />
                </circle>
              </svg>
            </Reveal>
            <Reveal className="colo__motion-text" childrenStagger>
              <p className="h3">cubic-bezier(0.22, 1, 0.36, 1)</p>
              <p className="mute">
                A fast start and a long, soft landing. Every reveal, transition and hover on the site uses this one curve, so the whole thing moves like one
                object. With reduced motion turned on, motion becomes simple fades.
              </p>
              <p className="mono mute">Durations: 0.25s for feedback · 0.6s for UI · 0.9–1.3s for reveals</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="wrap">
          <SectionLabel num="05" title="Performance budgets" right="Targets, checked before every release" />
          <Reveal as="dl" className="colo__budgets" childrenStagger y={20}>
            {budgets.map((b) => (
              <div key={b.k}>
                <dd>{b.v}</dd>
                <dt className="mono mute">{b.k}</dt>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section--tight">
        <div className="wrap">
          <SectionLabel num="06" title="Accessibility & credits" />
          <Reveal className="colo__credits" childrenStagger>
            <p>
              Keyboard first: every interaction works without a mouse, focus is always visible, and motion respects your system settings. Art is decorative
              and hidden from screen readers; the content never depends on it.
            </p>
            <p className="mute">
              Hidden extras: press <kbd>S</kbd> for spec mode, <kbd>T</kbd> to switch themes, <kbd>⌘K</kbd> for the command palette. See{" "}
              <TLink href="/archive" className="u-line blue">
                the archive
              </TLink>{" "}
              for earlier versions.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
