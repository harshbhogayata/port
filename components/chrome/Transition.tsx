"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { getLenis, scrollToTarget } from "@/lib/lenis";
import { markCovered, markRevealed } from "@/lib/reveal";
import { sheetFor } from "@/content/site";

type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const useNavigate = () => useContext(TransitionContext).navigate;

const COLS = 8;

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const pendingHash = useRef("");
  const busy = useRef(false);
  const [dest, setDest] = useState(() => sheetFor(pathname));

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        if (url.hash) scrollToTarget(url.hash);
        else scrollToTarget(0);
        return;
      }
      if (busy.current) return;
      if (reducedMotion() || !root.current) {
        router.push(url.pathname + url.hash);
        return;
      }
      busy.current = true;
      pending.current = url.pathname;
      pendingHash.current = url.hash;
      setDest(sheetFor(url.pathname));
      markCovered();
      getLenis()?.stop();

      const el = root.current;
      const cols = el.querySelectorAll(".pt__col");
      gsap
        .timeline({
          onComplete: () => router.push(url.pathname + url.hash, { scroll: false }),
        })
        .set(el, { visibility: "visible" })
        .fromTo(
          cols,
          { scaleY: 0, transformOrigin: "50% 0%" },
          { scaleY: 1, duration: 0.62, ease: "draftInOut", stagger: { each: 0.04, from: "start" } },
        )
        .fromTo(el.querySelector(".pt__rule"), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "draft" }, 0.25)
        .fromTo(
          el.querySelectorAll(".pt__meta > *"),
          { yPercent: 110 },
          { yPercent: 0, duration: 0.6, stagger: 0.05 },
          0.32,
        )
        .fromTo(el.querySelector(".pt__lime"), { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.6 }, 0.38);
    },
    [router],
  );

  // The new route has rendered under the cover: reset scroll and uncover.
  useEffect(() => {
    if (!pending.current) return;
    pending.current = null;
    const el = root.current!;
    window.scrollTo(0, 0);
    const lenis = getLenis();
    lenis?.scrollTo(0, { immediate: true, force: true });
    lenis?.start();

    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (pendingHash.current) scrollToTarget(pendingHash.current, true);
      const cols = el.querySelectorAll(".pt__col");
      gsap
        .timeline({
          delay: 0.12,
          onStart: () => {
            window.setTimeout(markRevealed, 180);
          },
          onComplete: () => {
            gsap.set(el, { visibility: "hidden" });
            busy.current = false;
          },
        })
        .to(el.querySelectorAll(".pt__meta > *"), { yPercent: -110, duration: 0.45, stagger: 0.04, ease: "draftInOut" })
        .to(el.querySelector(".pt__lime"), { scale: 0, duration: 0.4, ease: "draftInOut" }, 0)
        .to(el.querySelector(".pt__rule"), { scaleX: 0, transformOrigin: "100% 50%", duration: 0.5, ease: "draftInOut" }, 0)
        .to(
          cols,
          { scaleY: 0, transformOrigin: "50% 100%", duration: 0.7, ease: "draftInOut", stagger: { each: 0.04, from: "start" } },
          0.15,
        )
        .set(el.querySelector(".pt__rule"), { transformOrigin: "0% 50%" });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div ref={root} className="pt" aria-hidden="true">
        <div className="pt__cols">
          {Array.from({ length: COLS }, (_, i) => (
            <span key={i} className="pt__col" />
          ))}
        </div>
        <div className="pt__center">
          <span className="pt__lime" />
          <div className="pt__meta">
            <span className="mono">Sheet {dest.code}</span>
            <span className="pt__title">{dest.title}</span>
          </div>
        </div>
        <span className="pt__rule" />
      </div>
    </TransitionContext.Provider>
  );
}
