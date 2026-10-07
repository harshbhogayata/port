"use client";

import { useMemo, useState } from "react";
import TLink from "@/components/chrome/TLink";
import IsoStack from "@/components/art/IsoStack";
import { projects, projectHref } from "@/content/projects";
import type { Project } from "@/content/types";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { cn, pad } from "@/lib/utils";

const FILTERS = ["All", "Product", "Web", "Mobile", "Systems", "Open source"] as const;
type Filter = (typeof FILTERS)[number];

const genericLayers = (p: Project) =>
  p.layers.length ? p.layers : [{ name: p.type[0] ?? "Project" }, { name: p.stack[0] ?? "Core" }, { name: p.stack[1] ?? "Infra" }];

export default function WorkIndex() {
  const [filter, setFilter] = useState<Filter>("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const list = useMemo(() => (filter === "All" ? projects : projects.filter((p) => p.type.includes(filter))), [filter]);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from(".wi__item", { y: 40, autoAlpha: 0, duration: 0.9, stagger: 0.06 });
    },
    { dependencies: [filter, view], revertOnUpdate: true },
  );

  return (
    <div className="wrap wi">
      <div className="wi__bar">
        <div className="wi__filters" role="group" aria-label="Filter projects">
          {FILTERS.map((f) => {
            const count = f === "All" ? projects.length : projects.filter((p) => p.type.includes(f)).length;
            return (
              <button key={f} type="button" className={cn("chip", filter === f && "is-on")} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {f}
                <sup className="mono">{pad(count)}</sup>
              </button>
            );
          })}
        </div>
        <div className="wi__views mono" role="group" aria-label="View">
          {(["grid", "list"] as const).map((v) => (
            <button key={v} type="button" className={cn(view === v && "is-on")} aria-pressed={view === v} onClick={() => setView(v)}>
              {v === "grid" ? "Grid" : "List"}
            </button>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <ul className="wi__grid">
          {list.map((p, i) => (
            <li key={p.slug} className="wi__item">
              <TLink href={projectHref(p)} className="wtile" cursor={p.featured ? "Open case" : "Open"}>
                <div className="wtile__art">
                  <IsoStack layers={genericLayers(p)} keyIndex={p.featured ? p.keyLayer : 0} labels={false} open={0.2} />
                </div>
                <div className="wtile__meta mono">
                  <span className="blue">P-{pad(i + 1)}</span>
                  <span className="mute">{p.year}</span>
                </div>
                <h2 className="wtile__title">{p.title}</h2>
                <p className="wtile__tag">{p.tagline}</p>
                <p className="wtile__outcome mono">{p.outcome}</p>
              </TLink>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="wi__list">
          <li className="wi__list-head mono mute" aria-hidden="true">
            <span>No.</span>
            <span>Project</span>
            <span>Role</span>
            <span>Type</span>
            <span>Outcome</span>
            <span>Year</span>
          </li>
          {list.map((p, i) => (
            <li key={p.slug} className="wi__item">
              <TLink href={projectHref(p)} className="wline" cursor="Open">
                <span className="mono blue">{pad(i + 1)}</span>
                <span className="wline__title">{p.title}</span>
                <span className="mute">{p.role}</span>
                <span className="mono mute">{p.type.join(", ")}</span>
                <span>{p.outcome}</span>
                <span className="mono">{p.year}</span>
              </TLink>
            </li>
          ))}
        </ul>
      )}
      {list.length === 0 ? <p className="mono mute wi__empty">Nothing filed under {filter} yet.</p> : null}
    </div>
  );
}
