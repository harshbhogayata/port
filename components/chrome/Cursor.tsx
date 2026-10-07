"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Drafting cursor: hairline crosshair across the viewport, a small reticle,
 * live coordinates, and a contextual label from [data-cursor].
 */
export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (hover: hover)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled || !root.current) return;
    const el = root.current;
    document.documentElement.classList.add("has-cursor");
    const reticle = el.querySelector<HTMLElement>(".cur__reticle")!;
    const vx = el.querySelector<HTMLElement>(".cur__x")!;
    const hy = el.querySelector<HTMLElement>(".cur__y")!;
    const coords = el.querySelector<HTMLElement>(".cur__coords")!;
    const label = el.querySelector<HTMLElement>(".cur__label")!;
    const labelText = el.querySelector<HTMLElement>(".cur__label-text")!;

    const rx = gsap.quickTo(reticle, "x", { duration: 0.35, ease: "power3" });
    const ry = gsap.quickTo(reticle, "y", { duration: 0.35, ease: "power3" });
    const lx = gsap.quickTo(label, "x", { duration: 0.5, ease: "power3" });
    const ly = gsap.quickTo(label, "y", { duration: 0.5, ease: "power3" });
    const xx = gsap.quickTo(vx, "x", { duration: 0.12, ease: "none" });
    const yy = gsap.quickTo(hy, "y", { duration: 0.12, ease: "none" });

    let current = "";
    let visible = false;

    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        el.classList.add("is-visible");
      }
      const { clientX: x, clientY: y } = e;
      rx(x);
      ry(y);
      lx(x);
      ly(y);
      xx(x);
      yy(y);
      coords.textContent = `x ${String(Math.round(x)).padStart(4, "0")}  y ${String(Math.round(y + window.scrollY)).padStart(5, "0")}`;
      coords.style.transform = `translate(${x + 16}px, ${y + 16}px)`;

      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor], a, button, input, textarea, select, label");
      let next = "";
      let interactive = false;
      if (target) {
        interactive = true;
        next = target.dataset.cursor ?? "";
        if (target.matches("input, textarea, select")) {
          interactive = false;
          el.classList.add("is-text");
        } else {
          el.classList.remove("is-text");
        }
      } else {
        el.classList.remove("is-text");
      }
      el.classList.toggle("is-hover", interactive);
      if (next !== current) {
        current = next;
        el.classList.toggle("has-label", Boolean(next));
        if (next) labelText.textContent = next;
      }
    };
    const onLeave = () => {
      visible = false;
      el.classList.remove("is-visible");
    };
    const onDown = () => el.classList.add("is-down");
    const onUp = () => el.classList.remove("is-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={root} className="cur" aria-hidden="true">
      <span className="cur__x" />
      <span className="cur__y" />
      <span className="cur__reticle">
        <i />
      </span>
      <span className="cur__coords mono" />
      <span className="cur__label">
        <span className="cur__label-text mono" />
      </span>
    </div>
  );
}
