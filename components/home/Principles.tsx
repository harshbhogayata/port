"use client";

import { useRef } from "react";
import TLink from "@/components/chrome/TLink";
import SectionLabel from "./SectionLabel";
import { SplitReveal } from "@/components/motion/Motion";
import { principles } from "@/content/profile";
import { gsap, useGSAP } from "@/lib/gsap";
import { pad } from "@/lib/utils";

export default function Principles() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 960px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.current!.querySelector<HTMLElement>(".prin__track")!;
        const distance = () => track.scrollWidth - window.innerWidth + 40;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".prin__pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(".prin__bar i", { scaleX: self.progress }),
          },
        });
        gsap.from(".prin__card > *", {
          y: 50,
          autoAlpha: 0,
          stagger: 0.035,
          duration: 1.1,
          scrollTrigger: { trigger: ".prin__track", start: "top 88%", once: true },
        });
        // numbers drift against the track
        gsap.utils.toArray<HTMLElement>(".prin__card").forEach((card) => {
          gsap.fromTo(
            card.querySelector(".prin__num"),
            { xPercent: 40 },
            { xPercent: -40, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="prin" id="principles" aria-labelledby="prin-title">
      <div className="prin__pin">
        <div className="wrap prin__head">
          <SectionLabel num="03" title="Principles" right="How I build" />
          <SplitReveal className="h2" id="prin-title" dot>
            {"Four beliefs, each with a receipt"}
          </SplitReveal>
        </div>
        <div className="prin__track">
          {principles.map((p, i) => (
            <article key={p.title} className="prin__card">
              <span className="prin__num" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <h3 className="prin__title">{p.title}</h3>
              <p className="prin__body">{p.body}</p>
              <TLink href={p.proof.href} className="prin__proof" cursor="Proof">
                <span className="mono mute">Proof</span>
                <span>{p.proof.label}</span>
                <span aria-hidden="true" className="blue">
                  →
                </span>
              </TLink>
            </article>
          ))}
          <div className="prin__end" aria-hidden="true">
            <span className="prin__end-sq" />
          </div>
        </div>
        <div className="wrap">
          <div className="prin__bar" aria-hidden="true">
            <i />
          </div>
        </div>
      </div>
    </section>
  );
}
