"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "./Transition";
import { sheets } from "@/content/site";
import { projects } from "@/content/projects";
import { articles } from "@/content/writing";
import { profile } from "@/content/profile";
import { toggleTheme } from "@/lib/theme";
import { copyText, cn } from "@/lib/utils";
import { getLenis } from "@/lib/lenis";

type Item = { id: string; group: string; label: string; hint?: string; run: () => void };

function score(query: string, text: string) {
  const q = query.toLowerCase().trim();
  if (!q) return 1;
  const t = text.toLowerCase();
  if (t.includes(q)) return 2 + (t.startsWith(q) ? 1 : 0);
  let i = 0;
  for (const ch of t) if (ch === q[i]) i++;
  return i === q.length ? 1 : 0;
}

export default function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => {
      setOpen(false);
      navigate(href);
    };
    return [
      ...sheets.map((s) => ({ id: s.href, group: "Sheets", label: s.title, hint: s.code, run: go(s.href) })),
      ...projects.filter((p) => p.featured).map((p) => ({ id: p.slug, group: "Work", label: p.title, hint: p.year, run: go(`/work/${p.slug}`) })),
      ...articles.map((a) => ({ id: a.slug, group: "Writing", label: a.title, hint: a.readingTime, run: go(`/writing/${a.slug}`) })),
      { id: "copy", group: "Actions", label: "Copy email address", hint: profile.email, run: () => { setOpen(false); copyText(profile.email, "Email copied"); } },
      { id: "theme", group: "Actions", label: "Toggle Paper / Blueprint mode", hint: "T", run: () => { setOpen(false); toggleTheme(); } },
      { id: "spec", group: "Actions", label: "Toggle spec mode", hint: "S", run: () => { setOpen(false); window.dispatchEvent(new CustomEvent("hb:spec")); } },
      { id: "top", group: "Actions", label: "Back to top", hint: "↑", run: () => { setOpen(false); getLenis()?.scrollTo(0) ?? window.scrollTo({ top: 0, behavior: "smooth" }); } },
      ...profile.socials.filter((s) => s.href.startsWith("http")).map((s) => ({ id: s.label, group: "Elsewhere", label: s.label, hint: s.handle, run: () => { setOpen(false); window.open(s.href, "_blank", "noopener"); } })),
    ];
  }, [navigate]);

  const results = useMemo(
    () =>
      items
        .map((it) => ({ it, s: Math.max(score(query, it.label), score(query, it.group) * 0.5) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => (query ? b.s - a.s : 0))
        .map((r) => r.it),
    [items, query],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("hb:palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hb:palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      getLenis()?.stop();
      requestAnimationFrame(() => input.current?.focus());
    } else {
      getLenis()?.start();
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  let lastGroup = "";
  return (
    <div className="cmdk" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="cmdk__panel" role="dialog" aria-modal="true" aria-label="Command palette" data-lenis-prevent>
        <div className="cmdk__bar">
          <span className="mono blue">⌘K</span>
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a sheet, project or action…"
            aria-label="Search"
            aria-controls="cmdk-list"
            aria-activedescendant={results[active] ? `cmdk-${results[active].id}` : undefined}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                results[active]?.run();
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }}
          />
          <span className="mono mute">esc</span>
        </div>
        <ul ref={list} id="cmdk-list" className="cmdk__list" role="listbox">
          {results.length === 0 ? <li className="cmdk__empty mono mute">Nothing on this sheet. Try another word.</li> : null}
          {results.map((r, i) => {
            const showGroup = r.group !== lastGroup;
            lastGroup = r.group;
            return (
              <li key={r.group + r.id} role="none">
                {showGroup ? <p className="cmdk__group mono mute">{r.group}</p> : null}
                <button
                  type="button"
                  role="option"
                  id={`cmdk-${r.id}`}
                  aria-selected={i === active}
                  data-index={i}
                  className={cn("cmdk__item", i === active && "is-active")}
                  onMouseMove={() => setActive(i)}
                  onClick={r.run}
                >
                  <span>{r.label}</span>
                  {r.hint ? <span className="mono mute">{r.hint}</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="cmdk__foot mono mute">
          <span>↑↓ move</span>
          <span>↵ open</span>
          <span>T theme · S spec</span>
        </div>
      </div>
    </div>
  );
}
