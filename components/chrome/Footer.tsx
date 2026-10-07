"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import TLink from "./TLink";
import Clock from "./Clock";
import { profile } from "@/content/profile";
import { projects, projectHref } from "@/content/projects";
import { gsap, SplitText, reducedMotion } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { copyText, cn, pad } from "@/lib/utils";

const CYCLE = 7; // seconds per project
const R = 10; // trace corner radius

type Geo = { w: number; h: number; paths: string[]; nodes: { x: number; y: number }[]; ends: { x: number; y: number }[] };

/** Orthogonal trace with rounded corners: node → down to its lane → across → down into the card. */
function trace(x0: number, y0: number, lane: number, x1: number, y1: number) {
  if (Math.abs(x1 - x0) < R * 2) return `M${x0} ${y0} V${y1}`;
  const d = x1 > x0 ? 1 : -1;
  return [
    `M${x0} ${y0}`,
    `V${lane - R}`,
    `Q${x0} ${lane} ${x0 + R * d} ${lane}`,
    `H${x1 - R * d}`,
    `Q${x1} ${lane} ${x1} ${lane + R}`,
    `V${y1}`,
  ].join(" ");
}

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [copied, setCopied] = useState(false);
  const intent = useRef<number | undefined>(undefined);
  const p = projects[active];
  const [user, domain] = profile.email.split("@");

  /* ── measure: traces follow the real layout ── */
  const measure = useCallback(() => {
    const b = board.current;
    const c = card.current;
    if (!b || !c) return;
    const br = b.getBoundingClientRect();
    const cr = c.getBoundingClientRect();
    const anchors = Array.from(b.querySelectorAll<HTMLElement>(".fx__anchor"));
    const n = anchors.length;
    const nodeY = anchors[0] ? anchors[0].getBoundingClientRect().top - br.top + 4 : 120;
    const cardTop = cr.top - br.top;
    const gap = Math.max(14, Math.min(22, (cardTop - nodeY - 40) / (n + 1)));
    const right = cr.right - br.left;
    const nodes: Geo["nodes"] = [];
    const ends: Geo["ends"] = [];
    const paths = anchors.map((a, i) => {
      const ar = a.getBoundingClientRect();
      const x = Math.round(ar.left - br.left + ar.width / 2);
      const lane = nodeY + 30 + i * gap;
      const end = Math.round(right - Math.min(96, cr.width * 0.12) - i * gap);
      nodes.push({ x, y: nodeY });
      ends.push({ x: end, y: cardTop });
      return trace(x, nodeY + 6, lane, end, cardTop);
    });
    setGeo({ w: br.width, h: br.height, paths, nodes, ends });
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (board.current) ro.observe(board.current);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  /* ── only cycle while the footer is on screen ── */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !visible || reducedMotion()) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % projects.length), CYCLE * 1000);
    return () => window.clearTimeout(id);
  }, [active, paused, visible]);

  /* ── draw the active trace, then send a signal along it ── */
  useEffect(() => {
    const el = board.current;
    if (!el || !geo || reducedMotion()) return;
    const path = el.querySelector<SVGPathElement>(`.fx__trace--on`);
    const packet = el.querySelector<SVGRectElement>(".fx__packet");
    const port = el.querySelector<SVGCircleElement>(".fx__port-ring");
    if (!path || !packet) return;
    const len = path.getTotalLength();
    const tl = gsap.timeline();
    tl.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.1, ease: "draftInOut" });
    const t = { v: 0 };
    const travel = gsap.timeline({ repeat: -1, repeatDelay: 0.9, delay: 1 });
    travel
      .set(packet, { autoAlpha: 1 })
      .to(t, {
        v: 1,
        duration: 1.6,
        ease: "power1.inOut",
        onUpdate: () => {
          const pt = path.getPointAtLength(len * t.v);
          packet.setAttribute("x", String(pt.x - 4));
          packet.setAttribute("y", String(pt.y - 4));
        },
      })
      .set(packet, { autoAlpha: 0 })
      .fromTo(port, { scale: 0.4, autoAlpha: 1, transformOrigin: "50% 50%" }, { scale: 2.6, autoAlpha: 0, duration: 0.8, ease: "power2.out" });
    return () => {
      tl.kill();
      travel.kill();
      gsap.set(packet, { autoAlpha: 0 });
    };
  }, [active, geo]);

  /* ── swap the panel copy ── */
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = panel.current;
    if (!el || reducedMotion()) return;
    // Swapped nodes are keyed by project, so these are always fresh elements React won't touch again.
    const split = SplitText.create(el.querySelectorAll(".fx__pname, .fx__pdesc"), { type: "lines", mask: "lines", linesClass: "split-line" });
    const tw = gsap.fromTo(split.lines, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.05 });
    const swaps = gsap.fromTo(
      root.current!.querySelectorAll("[data-swap]"),
      { yPercent: 100, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.6, stagger: 0.04 },
    );
    return () => {
      tw.kill();
      swaps.kill();
      split.revert();
    };
  }, [active]);

  const copy = () => {
    copyText(profile.email, "Email copied. Talk soon");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.8 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const subject = encodeURIComponent(`About ${p.title}`);
  const hasStory = p.backstory.length > 0;

  return (
    <footer
      ref={root}
      className="fx"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="wrap">
        <div ref={board} className="fx__board">
          <div className="fx__tabs" role="tablist" aria-label="Projects">
            {projects.map((x, i) => (
              <button
                key={x.slug}
                type="button"
                role="tab"
                id={`fx-tab-${x.slug}`}
                aria-selected={i === active}
                aria-controls="fx-panel"
                className={cn("fx__tab", i === active && "is-on", paused && "is-paused")}
                onClick={() => setActive(i)}
                onMouseEnter={() => {
                  window.clearTimeout(intent.current);
                  intent.current = window.setTimeout(() => setActive(i), 140);
                }}
                onMouseLeave={() => window.clearTimeout(intent.current)}
                data-cursor="Route"
              >
                <span className="fx__tab-bar" aria-hidden="true">
                  <i key={`${active}-${i}`} style={{ animationDuration: `${CYCLE}s` }} />
                </span>
                <span className="fx__name">{x.title}</span>
                <span className="fx__desc">{x.short}</span>
                <span className="fx__anchor" aria-hidden="true" />
              </button>
            ))}
          </div>

          {geo ? (
            <svg className="fx__routes" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
              {geo.paths.map((d, i) =>
                i === active ? null : <path key={i} d={d} className="fx__trace" />,
              )}
              <path key={`on-${active}`} d={geo.paths[active]} className="fx__trace fx__trace--on" />
              {geo.nodes.map((n, i) => (
                <circle key={i} cx={n.x} cy={n.y + 6} r={5} className={cn("fx__node", i === active && "is-on")} />
              ))}
              <circle className="fx__port-ring" cx={geo.ends[active].x} cy={geo.ends[active].y} r={7} />
              <rect className="fx__packet" width={8} height={8} />
            </svg>
          ) : null}

          <div className="fx__split">
            <div ref={panel} className="fx__panel" id="fx-panel" role="tabpanel" aria-labelledby={`fx-tab-${p.slug}`}>
              <p className="fx__kicker mono">
                <span className="blue">P-{pad(active + 1)}</span>
                <span className="mute"> · {p.type.join(" · ")} · {p.year}</span>
              </p>
              <h2 key={`n-${p.slug}`} className="fx__pname">
                {p.title}
              </h2>
              <p key={`d-${p.slug}`} className="fx__pdesc">
                {p.tagline}
              </p>
              <TLink href={projectHref(p)} className="link-line fx__explore" cursor="Open">
                <span key={p.slug} data-swap>
                  Explore {p.title}
                </span>
                <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
                  <path d="M1 12L12 1M3 1h9v9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </TLink>
            </div>

            <div ref={card} className="fx__card">
              <svg className="fx__grain" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <radialGradient id="fx-g" cx="1" cy="0" r="1">
                    <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
                    <stop offset="0.7" stopColor="#fff" stopOpacity="0" />
                  </radialGradient>
                  <filter id="fx-d" x="0" y="0" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves={1} seed={5} result="n" />
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
                    <feComposite in="SourceGraphic" in2="mask" operator="in" />
                  </filter>
                </defs>
                <rect width="400" height="300" fill="url(#fx-g)" filter="url(#fx-d)" />
              </svg>

              <p className="fx__card-k">Email me</p>
              <a className="fx__email" href={`mailto:${profile.email}`} data-cursor="Write">
                <span className="fx__email-user">{user}</span>
                <span className="fx__email-domain">@{domain}</span>
              </a>
              <a className="fx__go" href={`mailto:${profile.email}?subject=${subject}`} aria-label={`Email me about ${p.title}`} data-cursor="Write">
                <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
                  <path d="M3 27L27 3M8 3h19v19" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </a>
              <p className="fx__card-meta mono">
                {profile.replyTime.replace(".", "")} · <Clock />
              </p>
              <div className="fx__card-foot">
                <a className="fx__ask" href={`mailto:${profile.email}?subject=${subject}`}>
                  <span key={p.slug} data-swap>
                    Ask about {p.title}
                  </span>
                </a>
                <button type="button" className="fx__copy" onClick={copy} data-cursor="Copy">
                  {copied ? "Copied ✓" : "Copy email"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="fx__links">
          <TLink href="/resume" className="fx__resume">
            Read my résumé
          </TLink>
          <nav className="fx__social" aria-label="Elsewhere">
            {profile.socials
              .filter((s) => s.href.startsWith("http") && s.label !== "X")
              .map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="u-line">
                  {s.label}
                </a>
              ))}
            <TLink href="/writing" className="u-line">
              Writing
            </TLink>
            <button type="button" className="fx__top mono" onClick={toTop} aria-label="Back to top" data-cursor="Top">
              ↑
            </button>
          </nav>
        </div>

        <div className="fx__base">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span className="fx__count">
            <span className="mono blue">
              {pad(active + 1)} / {pad(projects.length)}
            </span>
            <span key={p.slug} className="fx__note" data-swap>
              {p.note}
            </span>
          </span>
          <TLink href={hasStory ? `${projectHref(p)}#backstory` : projectHref(p)} className="fx__story">
            <span key={p.slug} data-swap>
              {hasStory ? `Why I made ${p.title}` : `How the ${p.title.toLowerCase()} evolved`}
            </span>
            <svg width="11" height="11" viewBox="0 0 13 13" aria-hidden="true">
              <path d="M1 12L12 1M3 1h9v9" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </TLink>
        </div>
      </div>
    </footer>
  );
}
