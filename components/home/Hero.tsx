"use client";

import { useRef } from "react";
import TLink from "@/components/chrome/TLink";
import HeroArt from "@/components/art/HeroArt";
import { profile } from "@/content/profile";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { whenRevealed } from "@/lib/reveal";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.set(".hero__line-inner", { yPercent: 115, rotate: 3 });
      gsap.set([".hero__lede", ".hero__ctas > *", ".hero__now", ".hero__scroll"], { autoAlpha: 0, y: 24 });
      const cancel = whenRevealed(() => {
        gsap
          .timeline({ delay: 0.1 })
          .to(".hero__line-inner", { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.1 })
          .to(".hero__lede", { autoAlpha: 1, y: 0, duration: 1.1 }, 0.55)
          .to(".hero__ctas > *", { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0.7)
          .to([".hero__now", ".hero__scroll"], { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, 0.9);
      });

      // Leaving the hero: lines drift at different speeds.
      gsap.utils.toArray<HTMLElement>(".hero__line").forEach((line, i) => {
        gsap.to(line, {
          yPercent: -18 - i * 14,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      });
      return cancel;
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero" aria-labelledby="hero-title">
      <HeroArt />
      <div className="hero__inner wrap">
        <h1 id="hero-title" className="hero__title display">
          <span className="sr-only">{profile.name}, </span>
          {["Software", "Development", "Engineer"].map((w, i) => (
            <span key={w} className="hero__line">
              <span className="hero__line-inner">
                {w}
                {i === 2 ? <span className="dot">.</span> : null}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero__lede">{profile.positioning}</p>

        <div className="hero__ctas">
          <TLink href="/#work" className="btn" cursor="Scroll">
            <span>Explore work</span>
            <svg className="arrow" width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">
              <path d="M0 7h20M14 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </TLink>
          <TLink href="/resume" className="link-line" cursor="Read">
            <span>Read résumé</span>
            <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
              <path d="M1 12L12 1M3 1h9v9" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </TLink>
        </div>

        <TLink href={profile.currently.href} className="hero__now" cursor="Peek">
          <span className="status-dot" aria-hidden="true" />
          <span className="mono caps mute hero__now-k">Currently</span>
          <span className="hero__now-sep" aria-hidden="true" />
          <span className="hero__now-p">{profile.currently.project}</span>
          <span className="mute">{profile.currently.status}</span>
          <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
            <path d="M1 12L12 1M3 1h9v9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </TLink>
      </div>

      <div className="hero__scroll mono mute" aria-hidden="true">
        <span>Scroll</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
}
