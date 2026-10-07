"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import TLink from "./TLink";
import ThemeToggle from "./ThemeToggle";
import TitleBlock from "./TitleBlock";
import { sheets, sheetFor } from "@/content/site";
import { profile } from "@/content/profile";
import { gsap, reducedMotion } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { copyText, cn } from "@/lib/utils";

export default function IndexMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const current = sheetFor(pathname);
  const [hover, setHover] = useState<number | null>(null);
  const first = useRef(true);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (first.current) {
      first.current = false;
      if (!open) return;
    }
    const rows = el.querySelectorAll(".idx__row-inner");
    const fades = el.querySelectorAll("[data-idx-fade]");
    const instant = reducedMotion();
    if (open) {
      getLenis()?.stop();
      document.documentElement.classList.add("menu-open");
      gsap
        .timeline()
        .set(el, { visibility: "visible" })
        .fromTo(
          el,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: instant ? 0 : 0.85, ease: "draftInOut" },
        )
        .fromTo(
          rows,
          { yPercent: 105 },
          { yPercent: 0, duration: instant ? 0 : 0.9, stagger: 0.045 },
          instant ? 0 : 0.3,
        )
        .fromTo(fades, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.05 }, instant ? 0 : 0.5);
      (el.querySelector(".idx__row a") as HTMLElement | null)?.focus({ preventScroll: true });
    } else {
      document.documentElement.classList.remove("menu-open");
      getLenis()?.start();
      gsap
        .timeline()
        .to(rows, { yPercent: -105, duration: instant ? 0 : 0.45, stagger: 0.02, ease: "draftInOut" })
        .to(el, { clipPath: "inset(0% 0% 0% 100%)", duration: instant ? 0 : 0.6, ease: "draftInOut" }, instant ? 0 : 0.2)
        .set(el, { visibility: "hidden" });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const preview = hover !== null ? sheets[hover] : current;

  return (
    <div
      ref={root}
      id="index-menu"
      className="idx"
      role="dialog"
      aria-modal="true"
      aria-label="Site index"
      aria-hidden={!open}
      data-lenis-prevent
    >
      <div className="idx__grid wrap">
        <nav className="idx__list" aria-label="Sheets">
          <p className="idx__eyebrow mono mute" data-idx-fade>
            Drawing set · {sheets.length} sheets
          </p>
          <ol>
            {sheets.map((s, i) => (
              <li
                key={s.code}
                className={cn("idx__row", s.code === current.code && "is-current")}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <div className="idx__row-inner">
                  <TLink href={s.href} cursor="Open" tabIndex={open ? 0 : -1}>
                    <span className="idx__code mono">{s.code}</span>
                    <span className="idx__title">{s.title}</span>
                    <span className="idx__mark" aria-hidden="true" />
                  </TLink>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        <aside className="idx__side">
          <div className="idx__preview" data-idx-fade>
            <p className="mono blue">{preview.code}</p>
            <p className="idx__preview-title">{preview.title}</p>
            <p className="idx__preview-desc">{preview.description}</p>
          </div>

          <div className="idx__actions" data-idx-fade>
            <p className="mono mute">Quick actions</p>
            <ul>
              <li>
                <button type="button" onClick={() => copyText(profile.email, "Email copied")} tabIndex={open ? 0 : -1} data-cursor="Copy">
                  Copy email <span className="mono mute">{profile.email}</span>
                </button>
              </li>
              <li>
                <TLink href="/resume" tabIndex={open ? 0 : -1}>
                  Résumé <span className="mono mute">A-08</span>
                </TLink>
              </li>
              <li>
                <button
                  type="button"
                  tabIndex={open ? 0 : -1}
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent("hb:palette"));
                  }}
                >
                  Command palette <span className="mono mute">⌘K</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  tabIndex={open ? 0 : -1}
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent("hb:spec"));
                  }}
                >
                  Spec mode <span className="mono mute">S</span>
                </button>
              </li>
              <li className="idx__theme">
                <ThemeToggle withLabel />
              </li>
            </ul>
          </div>

          <ul className="idx__socials" data-idx-fade>
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className="u-line">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          <div data-idx-fade>
            <TitleBlock sheet={current} compact />
          </div>
        </aside>
      </div>
    </div>
  );
}
