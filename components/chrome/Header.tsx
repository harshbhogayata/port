"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import TLink from "./TLink";
import Monogram from "./Monogram";
import Clock from "./Clock";
import ThemeToggle from "./ThemeToggle";
import IndexMenu from "./IndexMenu";
import { profile } from "@/content/profile";
import { sheets, sheetFor } from "@/content/site";
import { pad, cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > 320 && y > last.current + 4) setHidden(true);
      else if (y < last.current - 4 || y < 320) setHidden(false);
      last.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const sheet = sheetFor(pathname);

  return (
    <>
      <header className={cn("hdr", scrolled && "hdr--scrolled", hidden && !open && "hdr--hidden")}>
        <div className="hdr__inner wrap">
          <TLink href="/" className="hdr__brand" aria-label={`${profile.name}, home`} cursor="Home">
            <Monogram size={44} className="hdr__mono" />
            <span className="hdr__name">
              <span>{profile.first}</span>
              <span>{profile.last}</span>
            </span>
          </TLink>

          <div className="hdr__sheet mono" aria-hidden="true">
            <span className="blue">{sheet.code}</span>
            <span>{sheet.title}</span>
          </div>

          <div className="hdr__loc">
            <span className="mute">Based in {profile.location}</span>
            <Clock />
          </div>

          <ThemeToggle />

          <button
            type="button"
            className={cn("hdr__index", open && "is-open")}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="index-menu"
            data-cursor={open ? "Close" : "Index"}
          >
            <span className="hdr__index-label">{open ? "Close" : "Index"}</span>
            <span className="hdr__index-count mono">{pad(sheets.length)}</span>
            <span className="hdr__burger" aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="hdr__index-rule" aria-hidden="true" />
          </button>
        </div>
      </header>
      <IndexMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
