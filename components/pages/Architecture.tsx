"use client";

import { useState } from "react";
import IsoStack from "@/components/art/IsoStack";
import { cn, pad } from "@/lib/utils";

type Layer = { name: string; detail: string };

/** Hover or focus a layer in the list and it lifts out of the drawing. */
export default function Architecture({ layers, keyIndex, title }: { layers: Layer[]; keyIndex: number; title: string }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="arch">
      <div className="arch__art">
        <IsoStack layers={layers} keyIndex={keyIndex} active={active} labels={false} open={0.75} title={`${title} architecture`} />
        <span className="arch__legend mono">
          <i className="arch__sq arch__sq--blue" /> Key layer <i className="arch__sq arch__sq--lime" /> Key decision
        </span>
      </div>
      <ol className="arch__list">
        {layers.map((l, i) => (
          <li key={l.name}>
            <button
              type="button"
              className={cn("arch__row", (active === i || (active === null && i === keyIndex)) && "is-on")}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              data-cursor="Inspect"
            >
              <span className="mono blue">{pad(i + 1)}</span>
              <span className="arch__name">{l.name}</span>
              <span className="arch__detail mute">{l.detail}</span>
              {i === keyIndex ? <span className="tag tag--lime">Key</span> : <span />}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
