"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { markRevealed } from "@/lib/reveal";
import { getLenis } from "@/lib/lenis";

/**
 * First visit only (per session): the sheet is drafted — grid lines draw,
 * the monogram is inked, a counter runs — then the sheet lifts away.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = root.current;
    const skip = document.documentElement.dataset.visited === "1" || reducedMotion();
    if (!el || skip) {
      setDone(true);
      markRevealed();
      return;
    }
    getLenis()?.stop();
    const count = el.querySelector<HTMLElement>(".pl__count")!;
    const counter = { v: 0 };
    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    const tl = gsap.timeline({ paused: true });
    tl.fromTo(el.querySelectorAll(".pl__line"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.1, stagger: 0.06, ease: "draftInOut" })
      .fromTo(el.querySelectorAll(".pl__ink"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.9, stagger: 0.12, ease: "draftInOut" }, 0.2)
      .fromTo(el.querySelectorAll(".pl__node"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.4, stagger: 0.05 }, 0.5)
      .to(counter, {
        v: 100,
        duration: 1.35,
        ease: "power2.inOut",
        onUpdate: () => {
          count.textContent = String(Math.round(counter.v)).padStart(3, "0");
        },
      }, 0)
      .fromTo(el.querySelector(".pl__lime"), { scale: 0 }, { scale: 1, duration: 0.5, ease: "back.out(2)" }, 1.05)
      .addLabel("exit", "+=0.12")
      .to(el.querySelectorAll(".pl__meta"), { autoAlpha: 0, y: -10, duration: 0.35, stagger: 0.03 }, "exit")
      .to(el.querySelector(".pl__art"), { scale: 0.92, autoAlpha: 0, duration: 0.6, ease: "draftInOut" }, "exit")
      .to(el, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.9,
        ease: "draftInOut",
        onStart: () => {
          window.setTimeout(() => {
            getLenis()?.start();
            markRevealed();
          }, 220);
        },
      }, "exit+=0.15")
      .add(() => {
        try {
          sessionStorage.setItem("hb:visited", "1");
        } catch {}
        setDone(true);
      });

    let cancelled = false;
    Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1200))]).then(() => {
      if (!cancelled) tl.play();
    });
    return () => {
      cancelled = true;
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="pl" aria-hidden="true">
      <svg className="pl__grid" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        {[180, 500, 820].map((x) => (
          <line key={`v${x}`} className="pl__line" x1={x} y1="0" x2={x} y2="1000" vectorEffect="non-scaling-stroke" />
        ))}
        {[260, 740].map((y) => (
          <line key={`h${y}`} className="pl__line" x1="0" y1={y} x2="1000" y2={y} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="pl__art">
        <svg viewBox="0 0 120 120" width="120" height="120">
          <path className="pl__ink" d="M14 18v84M14 60h40M54 18v84" />
          <path className="pl__ink" d="M54 18h26a20 20 0 0 1 0 40H54M54 59h29a21.5 21.5 0 0 1 0 43H54" />
          {[
            [14, 18],
            [54, 18],
            [14, 102],
            [54, 102],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} className="pl__node" cx={x} cy={y} r="3.2" />
          ))}
          <rect className="pl__lime" x="56" y="54" width="10" height="10" />
        </svg>
      </div>
      <p className="pl__meta pl__meta--tl mono">Harsh Bhogayata · Portfolio Rev {process.env.NEXT_PUBLIC_REV}</p>
      <p className="pl__meta pl__meta--tr mono">Drafting sheet A-00</p>
      <p className="pl__meta pl__meta--bl mono">
        <span className="pl__count">000</span>
        <span className="mute"> / 100</span>
      </p>
      <p className="pl__meta pl__meta--br mono">Design · Build · Ship</p>
    </div>
  );
}
