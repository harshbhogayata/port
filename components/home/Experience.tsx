"use client";

import { useState } from "react";
import TLink from "@/components/chrome/TLink";
import SectionLabel from "./SectionLabel";
import { SplitReveal, Reveal } from "@/components/motion/Motion";
import { experience, education } from "@/content/career";
import { cn } from "@/lib/utils";

type Row = { key: string; years: string; title: string; org: string; place: string; summary: string; points: string[] };

function Rows({ rows, initial = 0 }: { rows: Row[]; initial?: number | null }) {
  const [open, setOpen] = useState<number | null>(initial);
  return (
    <Reveal as="ol" className="xrows" childrenStagger y={30}>
      {rows.map((r, i) => {
        const isOpen = open === i;
        return (
          <li key={r.key} className={cn("xrow", isOpen && "is-open")}>
            <button
              type="button"
              className="xrow__head"
              aria-expanded={isOpen}
              aria-controls={`xrow-${r.key}`}
              onClick={() => setOpen(isOpen ? null : i)}
              data-cursor={isOpen ? "Close" : "Expand"}
            >
              <span className="xrow__node" aria-hidden="true" />
              <span className="xrow__years mono">{r.years}</span>
              <span className="xrow__title">
                <span className="xrow__role">{r.title}</span>
                <span className="xrow__org">{r.org}</span>
              </span>
              <span className="xrow__place mono mute">{r.place}</span>
              <span className="xrow__plus" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
            <div className="xrow__panel" id={`xrow-${r.key}`} role="region">
              <div className="xrow__panel-inner">
                <p className="xrow__summary">{r.summary}</p>
                <ul className="xrow__points">
                  {r.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        );
      })}
    </Reveal>
  );
}

export default function Experience() {
  const jobs: Row[] = experience.map((e) => ({
    key: e.company,
    years: `${e.start} — ${e.end}`,
    title: e.role,
    org: e.company,
    place: e.location,
    summary: e.summary,
    points: e.achievements,
  }));
  const school: Row[] = education.map((e) => ({
    key: e.institution,
    years: `${e.start} — ${e.end}`,
    title: e.degree,
    org: e.institution,
    place: e.location,
    summary: e.notes[0] ?? "",
    points: e.notes.slice(1),
  }));

  return (
    <section className="exp section" id="experience" aria-labelledby="exp-title">
      <div className="wrap">
        <SectionLabel num="05" title="Experience & education" right={`${experience.length} roles · ${education.length} degree`} />
        <div className="exp__head">
          <SplitReveal className="h2" id="exp-title" dot>
            {"Where I’ve done the work"}
          </SplitReveal>
          <TLink href="/resume" className="link-line" cursor="Read">
            Full résumé
            <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
              <path d="M1 12L12 1M3 1h9v9" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </TLink>
        </div>
        <Rows rows={jobs} />
        <p className="exp__sub mono mute">Education</p>
        <Rows rows={school} initial={null} />
      </div>
    </section>
  );
}
