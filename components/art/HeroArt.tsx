"use client";

import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { whenRevealed } from "@/lib/reveal";
import { sk, skRect, skBowl, skArc, poly, fmt, K, type Pt } from "./geometry";

/* ─────────── Monogram construction (local, un-projected units) ─────────── */
type Fade = "top" | "bottom" | "right" | "none";
const RECTS: { id: string; r: [number, number, number, number]; fade: Fade }[] = [
  { id: "L", r: [150, 20, 246, 500], fade: "top" },
  { id: "X", r: [246, 205, 430, 290], fade: "none" },
  { id: "S", r: [430, 20, 526, 500], fade: "bottom" },
];
const BOWLS: { id: string; x0: number; y0: number; y1: number; xr: number; fade: Fade }[] = [
  { id: "T", x0: 620, y0: 20, y1: 240, xr: 822, fade: "right" },
  { id: "B", x0: 620, y0: 262, y1: 500, xr: 852, fade: "bottom" },
];
const LIME: [number, number, number, number] = [526, 196, 604, 292];
const DEPTH: [number, number] = [-46, -24];

const off = ([x, y]: Pt, d = DEPTH): Pt => [x + d[0], y + d[1] + K * d[0]];

function extrusion(x0: number, y0: number, x1: number, y1: number) {
  const f = skRect(x0, y0, x1, y1);
  const b = f.map((p) => off(p));
  return {
    front: f,
    left: [f[0], f[3], b[3], b[0]] as Pt[],
    top: [f[0], f[1], b[1], b[0]] as Pt[],
  };
}

const GRAD_DIR: Record<Fade, { x1: number; y1: number; x2: number; y2: number }> = {
  top: { x1: 0, y1: 1, x2: 0, y2: 0 },
  bottom: { x1: 0, y1: 0, x2: 0, y2: 1 },
  right: { x1: 0, y1: 0.2, x2: 1, y2: 0.8 },
  none: { x1: 0, y1: 0, x2: 0, y2: 1 },
};

function Dither({ id, freq = 0.95, seed = 4 }: { id: string; freq?: number; seed?: number }) {
  return (
    <filter id={id} x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={1} seed={seed} result="noise" />
      <feComponentTransfer in="noise" result="contrast">
        <feFuncR type="linear" slope="3.2" intercept="-1.1" />
        <feFuncG type="linear" slope="3.2" intercept="-1.1" />
        <feFuncB type="linear" slope="3.2" intercept="-1.1" />
      </feComponentTransfer>
      <feColorMatrix in="contrast" type="luminanceToAlpha" result="na" />
      <feComposite in="SourceAlpha" in2="na" operator="arithmetic" k1="0" k2="1" k3="-1" k4="0.5" result="mix" />
      <feComponentTransfer in="mix" result="mask">
        <feFuncA type="discrete" tableValues="0 1" />
      </feComponentTransfer>
      <feComponentTransfer in="SourceGraphic" result="solid">
        <feFuncA type="discrete" tableValues="0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1" />
      </feComponentTransfer>
      <feComposite in="solid" in2="mask" operator="in" />
    </filter>
  );
}

function FadeGrad({ id, fade, color, from = 1, to = 0.02, hold = 0.45 }: { id: string; fade: Fade; color: string; from?: number; to?: number; hold?: number }) {
  const d = GRAD_DIR[fade];
  return (
    <linearGradient id={id} {...d}>
      <stop offset="0" style={{ stopColor: color, stopOpacity: from }} />
      <stop offset={hold} style={{ stopColor: color, stopOpacity: fade === "none" ? from : from * 0.96 }} />
      <stop offset="1" style={{ stopColor: color, stopOpacity: fade === "none" ? from : to }} />
    </linearGradient>
  );
}

const VB = "0 0 1000 1000";

export default function HeroArt() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const layers = gsap.utils.toArray<SVGSVGElement>(".hart__layer", el);
      const rm = reducedMotion();

      // Intro: drafting order — lines, nodes, faces, fronts, lime, labels.
      const intro = () => {
        if (rm) return;
        const tl = gsap.timeline({ defaults: { ease: "draft" } });
        tl.fromTo(".hart__draw", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.6, stagger: 0.05, ease: "draftInOut" })
          .fromTo(".hart__node", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.6, stagger: 0.05, ease: "back.out(2.5)" }, 0.5)
          .fromTo(".hart__layer--ghost", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, 0.3)
          .fromTo(".hart__layer--side", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "draftInOut" }, 0.45)
          .fromTo(".hart__layer--front", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "draftInOut" }, 0.6)
          .fromTo(".hart__lime", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.8, ease: "back.out(2)" }, 1.5)
          .fromTo(".hart__label", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, stagger: 0.08 }, 1.2)
          .add(() => {
            el.querySelectorAll<SVGTextElement>(".hart__label tspan[data-scramble]").forEach((t, i) => {
              gsap.to(t, { duration: 1, delay: i * 0.05, scrambleText: { text: t.dataset.scramble!, chars: "01-/_#", speed: 0.6 } });
            });
          }, 1.2);
      };

      gsap.set([".hart__layer--side", ".hart__layer--front", ".hart__layer--ghost", ".hart__label", ".hart__lime"], rm ? {} : { autoAlpha: 1 });
      if (!rm) {
        gsap.set(".hart__layer--front", { clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(".hart__layer--side", { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(".hart__lime", { scale: 0, transformOrigin: "50% 50%" });
        gsap.set(".hart__label", { autoAlpha: 0 });
        gsap.set(".hart__layer--ghost", { autoAlpha: 0 });
      }
      const cancel = whenRevealed(intro);

      // A node travels the isometric orbit, forever.
      const orbit = el.querySelector<SVGPathElement>(".hart__orbit");
      const runner = el.querySelector<SVGCircleElement>(".hart__runner");
      let tween: gsap.core.Tween | null = null;
      if (orbit && runner && !rm) {
        const len = orbit.getTotalLength();
        const p = { t: 0 };
        tween = gsap.to(p, {
          t: 1,
          duration: 9,
          repeat: -1,
          ease: "none",
          onUpdate: () => {
            const pt = orbit.getPointAtLength(len * p.t);
            runner.setAttribute("cx", String(pt.x));
            runner.setAttribute("cy", String(pt.y));
          },
        });
      }

      // Pointer parallax by layer depth.
      let unbind = () => {};
      if (!rm && window.matchMedia("(pointer: fine)").matches) {
        const movers = layers.map((l) => {
          const depth = parseFloat(l.dataset.depth || "0");
          return { depth, x: gsap.quickTo(l, "x", { duration: 1.2, ease: "power3" }), y: gsap.quickTo(l, "y", { duration: 1.2, ease: "power3" }) };
        });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(nx * 34 * m.depth);
            m.y(ny * 22 * m.depth);
          });
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        unbind = () => window.removeEventListener("pointermove", onMove);
      }

      // Scroll: the construction comes apart as you leave the hero.
      if (!rm) {
        const st = { trigger: el, start: "top top", end: "bottom top", scrub: 0.8 };
        gsap.to(".hart__explode--front", { yPercent: -10, xPercent: 3, ease: "none", scrollTrigger: st });
        gsap.to(".hart__explode--side", { yPercent: -3, xPercent: -4, ease: "none", scrollTrigger: st });
        gsap.to(".hart__explode--lime", { yPercent: -22, xPercent: 9, ease: "none", scrollTrigger: st });
        gsap.to(".hart__explode--lines", { yPercent: 6, opacity: 0.35, ease: "none", scrollTrigger: st });
      }

      return () => {
        cancel();
        tween?.kill();
        unbind();
      };
    },
    { scope: root },
  );

  /* ─────────── Geometry ─────────── */
  const ex = RECTS.map((p) => ({ ...p, ...extrusion(...p.r) }));
  const lime = extrusion(...LIME);
  const bowlTops = BOWLS.map((b) => {
    const f0 = sk(b.x0, b.y0);
    const f1 = sk(b.xr - (b.y1 - b.y0) / 2, b.y0);
    const fl = sk(b.x0, b.y1);
    return {
      ...b,
      front: skBowl(b.x0, b.y0, b.y1, b.xr),
      back: skBowl(b.x0, b.y0, b.y1, b.xr, DEPTH[0], DEPTH[1]),
      left: [f0, fl, off(fl), off(f0)] as Pt[],
      top: [f0, f1, off(f1), off(f0)] as Pt[],
    };
  });

  const vLines = [150, 430, 620, 868];
  const hLines = [20, 247, 500];
  const nodes: Pt[] = [
    [150, 228],
    [150, 590],
    [150, 642],
    [150, 850],
    [430, 33],
    [868, 384],
    sk(620, 20),
    sk(852, 381),
  ];
  const orbitPath = skArc(640, 300, 330, -38, 128);
  const orbitFull = skArc(640, 300, 330, 0, 360, 120);
  const a0 = sk(640 + 330 * Math.cos((-38 * Math.PI) / 180), 300 + 330 * Math.sin((-38 * Math.PI) / 180));
  const a1 = sk(640 + 330 * Math.cos((128 * Math.PI) / 180), 300 + 330 * Math.sin((128 * Math.PI) / 180));
  const dimA = sk(430, -18);
  const dimB = sk(526, -18);
  const angle = (Math.atan(K) * 180) / Math.PI;

  return (
    <div ref={root} className="hart" aria-hidden="true">
      {/* 1 · construction lines */}
      <div className="hart__explode hart__explode--lines">
        <svg className="hart__layer hart__layer--lines" data-depth="0.15" viewBox={VB}>
          {vLines.map((x) => (
            <line key={`v${x}`} className="hart__draw hart__ln" x1={x} y1={-40} x2={x} y2={1040} />
          ))}
          {hLines.map((y) => {
            const [x1, y1] = sk(-120, y);
            const [x2, y2] = sk(1120, y);
            return <line key={`h${y}`} className="hart__draw hart__ln" x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
          <line className="hart__draw hart__ln hart__ln--faint" x1={-40} y1={940} x2={1040} y2={314} />
          <line className="hart__draw hart__ln hart__ln--faint" x1={-40} y1={600} x2={700} y2={171} />
          <circle className="hart__ln hart__ln--dash" cx={548} cy={470} r={392} />
          <path className="hart__draw hart__ln hart__ln--faint" d={orbitFull} />
        </svg>
      </div>

      {/* 2 · ghost planes */}
      <div className="hart__explode hart__explode--side">
        <svg className="hart__layer hart__layer--ghost" data-depth="0.4" viewBox={VB}>
          <defs>
            <linearGradient id="hg-ghost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: "var(--art-ghost)", stopOpacity: 0.95 }} />
              <stop offset="1" style={{ stopColor: "var(--art-ghost)", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <polygon points={poly(skRect(338, -60, 418, 620))} fill="url(#hg-ghost)" />
          <polygon points={poly(skRect(604, 60, 640, 640))} fill="url(#hg-ghost)" />
          <polygon points={poly(skRect(80, 120, 140, 700))} fill="url(#hg-ghost)" opacity="0.6" />
        </svg>

        {/* 3 · extrusion faces */}
        <svg className="hart__layer hart__layer--side" data-depth="0.75" viewBox={VB}>
          <defs>
            <Dither id="hd-side" freq={1.05} seed={11} />
            <FadeGrad id="hg-side" fade="bottom" color="var(--art-side)" hold={0.25} />
            <FadeGrad id="hg-top" fade="right" color="var(--art-top)" hold={0.3} />
          </defs>
          <g filter="url(#hd-side)">
            {bowlTops.map((b) => (
              <path key={`bk${b.id}`} d={b.back} fill="url(#hg-side)" />
            ))}
            {ex.map((p) => (
              <g key={`s${p.id}`}>
                <polygon points={poly(p.left)} fill="url(#hg-side)" />
                <polygon points={poly(p.top)} fill="url(#hg-top)" />
              </g>
            ))}
            {bowlTops.map((b) => (
              <g key={`bs${b.id}`}>
                <polygon points={poly(b.left)} fill="url(#hg-side)" />
                <polygon points={poly(b.top)} fill="url(#hg-top)" />
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* 4 · front faces */}
      <div className="hart__explode hart__explode--front">
        <svg className="hart__layer hart__layer--front" data-depth="1" viewBox={VB}>
          <defs>
            <Dither id="hd-front" freq={1.15} seed={3} />
            {(["top", "bottom", "right", "none"] as Fade[]).map((f) => (
              <FadeGrad key={f} id={`hg-front-${f}`} fade={f} color="var(--blue)" hold={f === "right" ? 0.55 : f === "top" ? 0.62 : 0.68} />
            ))}
          </defs>
          <g filter="url(#hd-front)">
            {ex.map((p) => (
              <polygon key={p.id} points={poly(p.front)} fill={`url(#hg-front-${p.fade})`} />
            ))}
            {bowlTops.map((b) => (
              <path key={b.id} d={b.front} fill={`url(#hg-front-${b.fade})`} />
            ))}
          </g>
        </svg>
      </div>

      {/* 5 · the lime joint */}
      <div className="hart__explode hart__explode--lime">
        <svg className="hart__layer hart__layer--lime" data-depth="1.4" viewBox={VB}>
          <g className="hart__lime">
            <polygon points={poly(lime.left)} fill="var(--art-lime-side)" />
            <polygon points={poly(lime.top)} fill="var(--art-lime-top)" />
            <polygon points={poly(lime.front)} fill="var(--lime)" />
          </g>
        </svg>
      </div>

      {/* 6 · nodes, dimensions, labels */}
      <svg className="hart__layer hart__layer--ui" data-depth="0.25" viewBox={VB}>
        <path className="hart__draw hart__orbit" d={orbitPath} />
        {[...nodes, a0, a1].map(([x, y], i) => (
          <circle key={i} className="hart__node" cx={fmt(x)} cy={fmt(y)} r={6.5} />
        ))}
        <circle className="hart__runner" cx={a0[0]} cy={a0[1]} r={4.5} />

        <g className="hart__label hart__dim" transform={`rotate(${angle.toFixed(2)} ${dimA[0]} ${dimA[1]})`}>
          <line x1={dimA[0]} y1={dimA[1]} x2={dimA[0] + 96 / Math.cos(Math.atan(K))} y2={dimA[1]} />
          <line x1={dimA[0]} y1={dimA[1] - 7} x2={dimA[0]} y2={dimA[1] + 7} />
          <line x1={dimA[0] + 96 / Math.cos(Math.atan(K))} y1={dimA[1] - 7} x2={dimA[0] + 96 / Math.cos(Math.atan(K))} y2={dimA[1] + 7} />
          <text x={(dimA[0] + dimB[0]) / 2 + 22} y={dimA[1] - 10} textAnchor="middle">
            <tspan data-scramble="96">96</tspan>
          </text>
        </g>

        {[
          { x: 18, y: 222, n: "01", t: "Design" },
          { x: 914, y: 396, n: "02", t: "Build" },
          { x: 914, y: 864, n: "03", t: "Ship" },
        ].map((l) => (
          <g key={l.n} className="hart__label">
            <text x={l.x} y={l.y}>
              <tspan data-scramble={l.n}>{l.n}</tspan>
            </text>
            <text x={l.x} y={l.y + 24}>
              <tspan data-scramble={l.t}>{l.t}</tspan>
            </text>
            <line x1={l.x} y1={l.y + 50} x2={l.x + 22} y2={l.y + 50} />
          </g>
        ))}
        <g className="hart__label">
          {["Web /", "Mobile /", "Systems /", "Products"].map((t, i) => (
            <text key={t} x={18} y={714 + i * 22}>
              <tspan data-scramble={t}>{t}</tspan>
            </text>
          ))}
          <line x1={18} y1={818} x2={40} y2={818} />
        </g>
        <text className="hart__label hart__coord" x={a1[0] + 14} y={a1[1] + 26}>
          <tspan data-scramble={`θ ${angle.toFixed(0)}°`}>θ {angle.toFixed(0)}°</tspan>
        </text>
      </svg>
    </div>
  );
}
