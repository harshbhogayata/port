"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import type { LabItem } from "@/content/types";

function Dither() {
  const [seed, setSeed] = useState(3);
  return (
    <svg viewBox="0 0 300 200" className="spec-dither" onPointerEnter={() => setSeed((s) => s + 1)} role="img" aria-label="Dithered gradient">
      <defs>
        <radialGradient id="lab-g" cx="0.35" cy="0.4" r="0.7">
          <stop offset="0" style={{ stopColor: "var(--blue)", stopOpacity: 1 }} />
          <stop offset="1" style={{ stopColor: "var(--blue)", stopOpacity: 0 }} />
        </radialGradient>
        <filter id="lab-d" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={seed} result="n" />
          <feComponentTransfer in="n" result="c">
            <feFuncR type="linear" slope="3" intercept="-1" />
            <feFuncG type="linear" slope="3" intercept="-1" />
            <feFuncB type="linear" slope="3" intercept="-1" />
          </feComponentTransfer>
          <feColorMatrix in="c" type="luminanceToAlpha" result="na" />
          <feComposite in="SourceAlpha" in2="na" operator="arithmetic" k2="1" k3="-1" k4="0.5" result="m" />
          <feComponentTransfer in="m" result="mask">
            <feFuncA type="discrete" tableValues="0 1" />
          </feComponentTransfer>
          <feComponentTransfer in="SourceGraphic" result="s">
            <feFuncA type="discrete" tableValues="0 1 1 1 1 1 1 1 1 1" />
          </feComponentTransfer>
          <feComposite in="s" in2="mask" operator="in" />
        </filter>
      </defs>
      <rect width="300" height="200" fill="url(#lab-g)" filter="url(#lab-d)" />
    </svg>
  );
}

function Magnet() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const dots = Array.from(el.querySelectorAll<HTMLElement>("i"));
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      dots.forEach((d) => {
        const dx = px - d.offsetLeft;
        const dy = py - d.offsetTop;
        const dist = Math.hypot(dx, dy);
        const f = Math.max(0, 1 - dist / 140);
        gsap.to(d, { x: dx * f * 0.35, y: dy * f * 0.35, scale: 1 + f * 1.4, duration: 0.6, ease: "power3" });
      });
    };
    const leave = () => gsap.to(dots, { x: 0, y: 0, scale: 1, duration: 1, ease: "elastic.out(1, 0.4)" });
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <div ref={ref} className="spec-magnet" aria-hidden="true">
      {Array.from({ length: 96 }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}

function Latency() {
  const delays = [0, 100, 300, 1000];
  const [state, setState] = useState<Record<number, "idle" | "wait" | "done">>({});
  const press = (d: number) => {
    setState((s) => ({ ...s, [d]: "wait" }));
    window.setTimeout(() => setState((s) => ({ ...s, [d]: "done" })), d);
    window.setTimeout(() => setState((s) => ({ ...s, [d]: "idle" })), d + 1200);
  };
  return (
    <div className="spec-latency">
      {delays.map((d) => (
        <button key={d} type="button" className={`spec-latency__b is-${state[d] ?? "idle"}`} onClick={() => press(d)}>
          <span className="mono">{d}ms</span>
          <span>{state[d] === "wait" ? "Saving…" : state[d] === "done" ? "Saved ✓" : "Save"}</span>
        </button>
      ))}
    </div>
  );
}

function TypeSpec() {
  const [w, setW] = useState(500);
  return (
    <div
      className="spec-type"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setW(Math.round(100 + ((e.clientX - r.left) / r.width) * 800));
      }}
    >
      <span style={{ fontVariationSettings: `"wght" ${w}`, fontWeight: w }}>Aa</span>
      <span className="mono mute">wght {w}</span>
    </div>
  );
}

function Spring() {
  const ball = useRef<HTMLSpanElement>(null);
  return (
    <div
      className="spec-spring"
      onPointerDown={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        gsap.to(ball.current, {
          x: e.clientX - r.left - r.width / 2,
          y: e.clientY - r.top - r.height / 2,
          duration: 1.4,
          ease: "elastic.out(1, 0.32)",
        });
      }}
      data-cursor="Click"
    >
      <span ref={ball} className="spec-spring__ball" />
      <span className="mono mute spec-spring__hint">Click anywhere</span>
    </div>
  );
}

const FRAMES = [
  "   \\  |  /   \n    .---.    \n --(  ☼  )-- \n    '---'    \n   /  |  \\   ",
  "   \\  |  /   \n    .---.    \n -- (  ☼  ) --\n    '---'    \n   /  |  \\   ",
];

function Ascii() {
  const [f, setF] = useState(0);
  useEffect(() => {
    if (reducedMotion()) return;
    const id = window.setInterval(() => setF((x) => (x + 1) % FRAMES.length), 700);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="spec-ascii">
      <pre className="mono">{FRAMES[f]}</pre>
      <p className="mono">
        Ahmedabad · 31°C · clear <span className="mute">(placeholder)</span>
      </p>
    </div>
  );
}

export default function Specimen({ kind }: { kind: LabItem["specimen"] }) {
  switch (kind) {
    case "dither":
      return <Dither />;
    case "magnet":
      return <Magnet />;
    case "latency":
      return <Latency />;
    case "type":
      return <TypeSpec />;
    case "spring":
      return <Spring />;
    default:
      return <Ascii />;
  }
}
