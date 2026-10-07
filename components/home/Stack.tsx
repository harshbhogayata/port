"use client";

import { useRef, useState } from "react";
import TLink from "@/components/chrome/TLink";
import IsoStack from "@/components/art/IsoStack";
import SectionLabel from "./SectionLabel";
import { SplitReveal } from "@/components/motion/Motion";
import { stackLayers } from "@/content/career";
import { projects } from "@/content/projects";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn, pad } from "@/lib/utils";

const titleOf = (slug: string) => projects.find((p) => p.slug === slug)?.title ?? slug;

export default function Stack() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      root.current!.querySelectorAll<HTMLElement>(".stk__layer").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="stk section" id="stack" aria-labelledby="stk-title">
      <div className="wrap">
        <SectionLabel num="04" title="Tech stack" right="Grouped by layer, linked to proof" />
        <div className="stk__head">
          <SplitReveal className="h2" id="stk-title" dot>
            {"The whole stack"}
          </SplitReveal>
          <p className="lead stk__lede">From how it feels to where it lives. Every tool links to the project where I used it.</p>
        </div>
        <div className="stk__grid">
          <div className="stk__aside">
            <div className="stk__sticky">
              <IsoStack
                className="stk__iso"
                layers={stackLayers.map((l) => ({ name: l.name, detail: l.note }))}
                active={active}
                labels
                open={0.35}
                title="Tech stack drawn as layers"
              />
            </div>
          </div>
          <ol className="stk__list">
            {stackLayers.map((l, i) => (
              <li key={l.name} className={cn("stk__layer", active === i && "is-active")}>
                <div className="stk__layer-head">
                  <span className="mono blue">L-{pad(i + 1)}</span>
                  <h3 className="h3">{l.name}</h3>
                  <span className="mono mute">{l.note}</span>
                </div>
                <ul className="stk__tools">
                  {l.tools.map((t) => (
                    <li key={t.name} className="stk__tool">
                      <span className="stk__tool-name">{t.name}</span>
                      <span className="stk__tool-used mono">
                        {t.projects.length ? (
                          t.projects.map((slug, j) => (
                            <span key={slug}>
                              {j ? ", " : "Used in "}
                              <TLink href={`/work/${slug}`} className="u-line">
                                {titleOf(slug)}
                              </TLink>
                            </span>
                          ))
                        ) : (
                          <span className="mute">Comfortable</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
