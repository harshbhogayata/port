"use client";

import { useEffect, useRef, useState } from "react";
import { toggleTheme } from "@/lib/theme";

const TOKENS = ["--paper", "--ink", "--ink-2", "--mute", "--mute-2", "--blue", "--blue-2", "--lime"];

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  return !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
}

function rgbOf(value: string) {
  const probe = document.createElement("span");
  probe.style.color = value;
  document.body.appendChild(probe);
  const c = getComputedStyle(probe).color;
  probe.remove();
  return c;
}

type Spec = {
  rect: DOMRect;
  tag: string;
  font: string;
  size: string;
  weight: string;
  tracking: string;
  color: string;
  token?: string;
  pad: [number, number, number, number];
};

/**
 * Press S: the site shows its own redlines — the real grid, element boxes,
 * padding, and the type + colour tokens in use under the cursor.
 */
export default function SpecMode() {
  const [on, setOn] = useState(false);
  const [spec, setSpec] = useState<Spec | null>(null);
  const tokenMap = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "s" || e.key === "S") setOn((v) => !v);
      if (e.key === "t" || e.key === "T") toggleTheme();
      if (e.key === "Escape") setOn(false);
    };
    const onToggle = () => setOn((v) => !v);
    window.addEventListener("keydown", onKey);
    window.addEventListener("hb:spec", onToggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hb:spec", onToggle);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("spec-on", on);
    if (!on) {
      setSpec(null);
      return;
    }
    const map = new Map<string, string>();
    const styles = getComputedStyle(document.documentElement);
    TOKENS.forEach((t) => map.set(rgbOf(styles.getPropertyValue(t).trim()), t));
    tokenMap.current = map;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
        if (!el || el.closest(".spec, .cur")) return;
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const family = cs.fontFamily.split(",")[0].replace(/["']/g, "").replace(" Variable", "");
        setSpec({
          rect,
          tag: el.tagName.toLowerCase() + (el.classList[0] ? `.${el.classList[0]}` : ""),
          font: family,
          size: `${parseFloat(cs.fontSize).toFixed(0)}/${cs.lineHeight === "normal" ? "normal" : parseFloat(cs.lineHeight).toFixed(0)}`,
          weight: cs.fontWeight,
          tracking: cs.letterSpacing === "normal" ? "0" : `${(parseFloat(cs.letterSpacing) / parseFloat(cs.fontSize)).toFixed(3)}em`,
          color: cs.color,
          token: tokenMap.current.get(cs.color),
          pad: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map((v) => parseFloat(v)) as Spec["pad"],
        });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [on]);

  if (!on) return null;

  const r = spec?.rect;
  const cardLeft = r ? Math.min(r.left, (typeof window !== "undefined" ? window.innerWidth : 1200) - 280) : 0;
  const cardTop = r ? (r.bottom + 150 < (typeof window !== "undefined" ? window.innerHeight : 800) ? r.bottom + 10 : Math.max(10, r.top - 140)) : 0;

  return (
    <div className="spec" aria-hidden="true">
      <div className="spec__grid wrap">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <div className="spec__legend mono">
        <b>Spec mode</b>
        <span>12 col · gutter var(--col-gap) · margin var(--gutter)</span>
        <span>Hover anything · S or Esc to exit</span>
      </div>
      {r && spec ? (
        <>
          <div className="spec__box" style={{ left: r.left, top: r.top, width: r.width, height: r.height }}>
            <span
              className="spec__pad"
              style={{
                borderTopWidth: spec.pad[0],
                borderRightWidth: spec.pad[1],
                borderBottomWidth: spec.pad[2],
                borderLeftWidth: spec.pad[3],
              }}
            />
            <span className="spec__w mono">{Math.round(r.width)}</span>
            <span className="spec__h mono">{Math.round(r.height)}</span>
          </div>
          <span className="spec__guide spec__guide--l" style={{ left: r.left }} />
          <span className="spec__guide spec__guide--r" style={{ left: r.right }} />
          <span className="spec__guide-h" style={{ top: r.top }} />
          <span className="spec__guide-h" style={{ top: r.bottom }} />
          <div className="spec__card mono" style={{ left: Math.max(10, cardLeft), top: cardTop }}>
            <p className="spec__tag">{spec.tag}</p>
            <p>
              <span>Type</span>
              {spec.font} · {spec.size} · {spec.weight}
            </p>
            <p>
              <span>Track</span>
              {spec.tracking}
            </p>
            <p>
              <span>Colour</span>
              <i style={{ background: spec.color }} />
              {spec.token ?? spec.color}
            </p>
            <p>
              <span>Pad</span>
              {spec.pad.map((p) => Math.round(p)).join(" ")}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}
