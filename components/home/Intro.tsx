"use client";

import { useRef } from "react";
import SectionLabel from "./SectionLabel";
import Pronounce from "./Pronounce";
import Portrait from "@/components/art/Portrait";
import { Reveal } from "@/components/motion/Motion";
import { profile } from "@/content/profile";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";

export default function Intro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.fromTo(
        ".intro__w",
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: { trigger: ".intro__text", start: "top 78%", end: "bottom 45%", scrub: 0.5 },
        },
      );
    },
    { scope: root },
  );

  const words = profile.intro.split(" ");

  return (
    <section ref={root} className="intro section" id="intro" aria-label="Introduction">
      <div className="wrap">
        <SectionLabel num="01" title="Introduction" right="Who's drawing this" />
        <p className="intro__text">
          {words.map((w, i) => (
            <span key={i} className={`intro__w${w.startsWith("Harsh") ? " intro__w--name" : ""}`}>
              {w}{" "}
            </span>
          ))}
        </p>

        <div className="intro__grid">
          <Reveal className="intro__name" childrenStagger>
            <p className="mono mute">Say it like this</p>
            <p className="intro__name-big">{profile.name}</p>
            <div className="intro__say">
              <Pronounce />
              <div>
                <p className="intro__phon">{profile.pronunciation.phonetic}</p>
                <p className="mono mute">{profile.pronunciation.ipa}</p>
              </div>
            </div>
            <p className="intro__meaning">{profile.pronunciation.meaning}</p>
          </Reveal>
          <Reveal className="intro__portrait" y={60}>
            <Portrait />
          </Reveal>
          <Reveal className="intro__facts" childrenStagger>
            {[
              { k: "Based in", v: `${profile.city}, ${profile.location}` },
              { k: "Focus", v: "Web, mobile & the systems behind them" },
              { k: "Currently", v: `${profile.currently.project}, ${profile.currently.status.toLowerCase()}` },
              { k: "Status", v: profile.availability.label },
            ].map((f) => (
              <div key={f.k} className="intro__fact">
                <p className="mono mute">{f.k}</p>
                <p>{f.v}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
