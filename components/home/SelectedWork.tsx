"use client";

import { useRef } from "react";
import TLink from "@/components/chrome/TLink";
import IsoStack from "@/components/art/IsoStack";
import SectionLabel from "./SectionLabel";
import { SplitReveal, CountUp } from "@/components/motion/Motion";
import { featuredProjects } from "@/content/projects";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { pad } from "@/lib/utils";

export default function SelectedWork() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const cards = gsap.utils.toArray<HTMLElement>(".wcard");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (next) {
          gsap.to(card.querySelector(".wcard__inner"), {
            scale: 0.92,
            yPercent: -2,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 15%", scrub: true },
          });
          gsap.to(card.querySelector(".wcard__shade"), {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
          });
        }
        // the architecture comes apart as each card settles
        gsap.fromTo(
          card.querySelector(".iso"),
          { "--open": 0 },
          { "--open": 0.55, ease: "none", scrollTrigger: { trigger: card, start: "top 85%", end: "top 20%", scrub: 0.6 } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="work section" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <SectionLabel num="02" title="Selected work" right={`${pad(featuredProjects.length)} projects · 2023–2026`} />
        <div className="work__head">
          <SplitReveal className="h2" id="work-title" dot>
            {"Things I’ve designed, built and shipped"}
          </SplitReveal>
          <p className="work__intro lead">
            Each one started with a backstory, a constraint and a decision worth explaining. Open a sheet to read it.
          </p>
        </div>

        <div className="work__stack">
          {featuredProjects.map((p, i) => (
            <article key={p.slug} className="wcard" style={{ "--i": i } as React.CSSProperties}>
              <TLink href={`/work/${p.slug}`} className="wcard__inner" cursor="Open case">
                <header className="wcard__meta mono">
                  <span>
                    <span className="blue">P-{pad(i + 1)}</span>
                    <span className="mute"> / {pad(featuredProjects.length)}</span>
                  </span>
                  <span className="mute">{p.type.join(" · ")}</span>
                  <span>{p.status ? <span className="tag tag--lime">{p.status}</span> : p.year}</span>
                </header>

                <div className="wcard__body">
                  <div className="wcard__text">
                    <h3 className="wcard__title">{p.title}</h3>
                    <p className="wcard__tagline">{p.tagline}</p>
                    <p className="wcard__outcome">
                      <span className="wcard__outcome-k mono">Outcome</span>
                      {p.outcome}
                    </p>
                    <dl className="wcard__dl">
                      <div>
                        <dt className="mono mute">Role</dt>
                        <dd>{p.role}</dd>
                      </div>
                      <div>
                        <dt className="mono mute">Year</dt>
                        <dd>{p.year}</dd>
                      </div>
                      <div className="wcard__dl-wide">
                        <dt className="mono mute">Stack</dt>
                        <dd>{p.stack.slice(0, 5).join(", ")}</dd>
                      </div>
                    </dl>
                    <span className="wcard__cta link-line">
                      Read the case study
                      <svg width="20" height="12" viewBox="0 0 22 14" aria-hidden="true">
                        <path d="M0 7h20M14 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                    </span>
                  </div>
                  <div className="wcard__art">
                    <IsoStack layers={p.layers} keyIndex={p.keyLayer} open={0} title={`${p.title} architecture`} />
                  </div>
                </div>

                <footer className="wcard__metrics">
                  {p.metrics.map((m) => (
                    <div key={m.label}>
                      <CountUp value={m.value} className="wcard__metric" />
                      <span className="mono mute">{m.label}</span>
                    </div>
                  ))}
                </footer>
                <span className="wcard__shade" aria-hidden="true" />
              </TLink>
            </article>
          ))}
        </div>

        <div className="work__all">
          <TLink href="/work" className="link-line" cursor="All work">
            See all work, including side projects
            <svg width="20" height="12" viewBox="0 0 22 14" aria-hidden="true">
              <path d="M0 7h20M14 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </TLink>
        </div>
      </div>
    </section>
  );
}
