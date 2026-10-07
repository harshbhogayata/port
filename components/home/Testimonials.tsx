"use client";

import { useEffect, useRef, useState } from "react";
import SectionLabel from "./SectionLabel";
import { testimonials } from "@/content/career";
import { gsap, SplitText, reducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const DURATION = 8;

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const quote = useRef<HTMLQuoteElement>(null);
  const first = useRef(true);
  const t = testimonials[index];

  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % testimonials.length), DURATION * 1000);
    return () => window.clearTimeout(id);
  }, [index, paused]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = quote.current;
    if (!el || reducedMotion()) return;
    const split = SplitText.create(el.querySelector("p")!, { type: "lines", mask: "lines", linesClass: "split-line" });
    const tw = gsap.from(split.lines, { yPercent: 110, duration: 1, stagger: 0.06 });
    return () => {
      tw.kill();
      split.revert();
    };
  }, [index]);

  return (
    <section
      className="kind section"
      id="kind-words"
      aria-labelledby="kind-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="wrap">
        <SectionLabel num="09" title="Kind words" right="From people I've built with" />
        <h2 id="kind-title" className="sr-only">
          Testimonials
        </h2>
        <figure className="kind__fig">
          <span className="kind__mark" aria-hidden="true">
            &ldquo;
          </span>
          <blockquote ref={quote} className="kind__quote" aria-live="polite">
            <p key={index}>{t.quote}</p>
          </blockquote>
          <figcaption className="kind__who">
            <span className="kind__name">{t.name}</span>
            <span className="mono mute">
              {t.role}, {t.company}
            </span>
          </figcaption>
        </figure>
        <div className="kind__tabs" role="tablist" aria-label="Choose a testimonial">
          {testimonials.map((x, i) => (
            <button
              key={x.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={cn("kind__tab", i === index && "is-active", paused && "is-paused")}
              onClick={() => setIndex(i)}
              data-cursor="Read"
            >
              <span className="kind__tab-bar">
                <i key={`${index}-${i}`} style={{ animationDuration: `${DURATION}s` }} />
              </span>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              <span>{x.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
