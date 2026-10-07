"use client";

import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

export function headerOffset() {
  if (typeof window === "undefined") return 0;
  const v = getComputedStyle(document.documentElement).getPropertyValue("--header-h");
  const probe = document.createElement("div");
  probe.style.height = v || "80px";
  document.body.appendChild(probe);
  const h = probe.getBoundingClientRect().height;
  probe.remove();
  return h;
}

export function scrollToTarget(target: string | number | HTMLElement, immediate = false) {
  const lenis = getLenis();
  const el = typeof target === "string" ? (document.querySelector(target) as HTMLElement | null) : target;
  if (el === null) return;
  const offset = typeof el === "number" ? 0 : -headerOffset() * 0.6;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement | number, { offset, immediate, duration: 1.4 });
  } else if (typeof el === "number") {
    window.scrollTo({ top: el, behavior: immediate ? "auto" : "smooth" });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
  }
}
