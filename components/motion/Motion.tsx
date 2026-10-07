"use client";

import { useEffect, useRef, type ElementType } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, reducedMotion } from "@/lib/gsap";
import { whenRevealed } from "@/lib/reveal";

type SplitProps = {
  as?: ElementType;
  className?: string;
  children: React.ReactNode;
  /** "scroll" waits for the element to enter; "enter" plays when the page is uncovered. */
  trigger?: "scroll" | "enter";
  delay?: number;
  stagger?: number;
  id?: string;
  /** Append the blue full stop, glued to the last word so it never wraps alone. */
  dot?: boolean;
};

function withDot(children: React.ReactNode) {
  if (typeof children !== "string") return children;
  const i = children.lastIndexOf(" ");
  return (
    <>
      {children.slice(0, i + 1)}
      <span className="nw">
        {children.slice(i + 1)}
        <span className="dot">.</span>
      </span>
    </>
  );
}

/** Headline reveal: lines rise out of masks. */
export function SplitReveal({ as: Tag = "h2", className, children, trigger = "scroll", delay = 0, stagger = 0.09, id, dot }: SplitProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion()) return;
      let split: SplitText | null = null;
      let cancel = () => {};
      gsap.set(el, { autoAlpha: 0 });
      const run = () => {
        split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { autoAlpha: 1 });
            return gsap.from(self.lines, {
              yPercent: 112,
              rotate: 2.5,
              transformOrigin: "0% 0%",
              duration: 1.15,
              stagger,
              delay,
              scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
            });
          },
        });
      };
      document.fonts.ready.then(() => {
        if (trigger === "enter") cancel = whenRevealed(run);
        else run();
      });
      return () => {
        cancel();
        split?.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} id={id}>
      {dot ? withDot(children) : children}
    </Tag>
  );
}

type RevealProps = {
  as?: ElementType;
  className?: string;
  children: React.ReactNode;
  y?: number;
  delay?: number;
  stagger?: number;
  /** Animate direct children instead of the wrapper. */
  childrenStagger?: boolean;
  start?: string;
  id?: string;
  style?: React.CSSProperties;
};

/** Fade + rise when scrolled into view. */
export function Reveal({ as: Tag = "div", className, children, y = 36, delay = 0, stagger = 0.08, childrenStagger, start = "top 90%", id, style }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion()) return;
      const targets = childrenStagger ? Array.from(el.children) : el;
      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 1.1,
        delay,
        stagger,
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className} id={id} style={style}>
      {children}
    </Tag>
  );
}

/** Counts numbers up when seen, keeping prefix/suffix (e.g. "p99 92ms", "40k", "99.98%"). */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion()) return;
      const m = value.match(/^(\D*)([\d.,]+)(.*)$/);
      if (!m) return;
      const [, pre, num, post] = m;
      const decimals = num.includes(".") ? num.split(".")[1].length : 0;
      const hasComma = num.includes(",");
      const target = parseFloat(num.replace(/,/g, ""));
      const obj = { v: 0 };
      const fmt = (v: number) => {
        const fixed = v.toFixed(decimals);
        return hasComma ? Number(fixed).toLocaleString("en-US", { minimumFractionDigits: decimals }) : fixed;
      };
      el.textContent = pre + fmt(0) + post;
      gsap.to(obj, {
        v: target,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: () => {
          el.textContent = pre + fmt(obj.v) + post;
        },
      });
    },
    { scope: ref },
  );
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

/** Element leans toward the pointer while hovered. */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
  return ref;
}

/** Refresh ScrollTrigger once everything (fonts, images) has settled. */
export function ScrollRefresh() {
  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
