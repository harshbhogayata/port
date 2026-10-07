"use client";

import { useRef } from "react";
import SectionLabel from "./SectionLabel";
import ContributionGraph from "@/components/art/ContributionGraph";
import { SplitReveal, CountUp, Reveal } from "@/components/motion/Motion";
import { githubStats, repos } from "@/content/career";
import { profile } from "@/content/profile";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";

export default function OpenSource() {
  const root = useRef<HTMLElement>(null);
  const gh = profile.socials.find((s) => s.label === "GitHub");

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from(".contrib__c", {
        scale: 0,
        transformOrigin: "50% 50%",
        duration: 0.5,
        ease: "back.out(2)",
        stagger: { each: 0.0016, from: "start" },
        scrollTrigger: { trigger: ".contrib", start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  const stats = [
    { v: githubStats.contributions, k: "Contributions this year" },
    { v: githubStats.repos, k: "Public repositories" },
    { v: githubStats.stars, k: "Stars earned" },
    { v: githubStats.prsMerged, k: "PRs merged upstream" },
  ];

  return (
    <section ref={root} className="oss section" id="open-source" aria-labelledby="oss-title">
      <div className="wrap">
        <SectionLabel num="06" title="Open source" right={gh ? gh.handle : undefined} />
        <div className="oss__head">
          <SplitReveal className="h2" id="oss-title" dot>
            {"Shipping in public"}
          </SplitReveal>
          <Reveal as="dl" className="oss__stats" childrenStagger>
            {stats.map((s) => (
              <div key={s.k}>
                <dd>
                  <CountUp value={s.v} />
                </dd>
                <dt className="mono mute">{s.k}</dt>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="oss__graph">
          <ContributionGraph />
          <div className="oss__legend mono mute">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((l) => (
              <i key={l} className={`contrib__key contrib__c--${l}`} />
            ))}
            <span>More</span>
            <i className="contrib__key contrib__c--5" />
            <span>Launch week</span>
          </div>
        </div>

        <Reveal as="ul" className="oss__repos" childrenStagger>
          {repos.map((r) => (
            <li key={r.name}>
              <a href={gh ? `${gh.href}/${r.name}` : "#"} target="_blank" rel="noopener noreferrer" className="repo" data-cursor="GitHub">
                <span className="repo__top mono">
                  <span className="blue">{gh ? gh.handle.replace("@", "") : ""}/</span>
                  {r.name}
                </span>
                <span className="repo__desc">{r.description}</span>
                <span className="repo__meta mono mute">
                  <span>
                    <i className="repo__lang" /> {r.language}
                  </span>
                  <span>★ {r.stars}</span>
                </span>
              </a>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
