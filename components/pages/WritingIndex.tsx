"use client";

import { useEffect, useState } from "react";
import WritingList from "@/components/home/WritingList";
import { articles, papers, formatDate } from "@/content/writing";
import { copyText, cn } from "@/lib/utils";

const TABS = ["All", "Articles", "Papers"] as const;
type Tab = (typeof TABS)[number];

export default function WritingIndex() {
  const [tab, setTab] = useState<Tab>("All");
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (papers.some((p) => p.slug === hash)) setOpen(hash);
  }, []);

  return (
    <div className="wrap">
      <div className="wi__bar">
        <div className="wi__filters" role="tablist" aria-label="Filter writing">
          {TABS.map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} className={cn("chip", tab === t && "is-on")} onClick={() => setTab(t)}>
              {t}
              <sup className="mono">{t === "All" ? articles.length + papers.length : t === "Articles" ? articles.length : papers.length}</sup>
            </button>
          ))}
        </div>
        <a className="mono u-line" href="/rss.xml">
          RSS feed
        </a>
      </div>

      {tab !== "Papers" ? (
        <section className="wx" aria-label="Articles">
          <p className="mono mute wx__k">Articles</p>
          <WritingList items={articles} />
        </section>
      ) : null}

      {tab !== "Articles" ? (
        <section className="wx" aria-label="Research papers">
          <p className="mono mute wx__k">Research papers</p>
          <ul className="papers">
            {papers.map((p) => {
              const isOpen = open === p.slug;
              return (
                <li key={p.slug} id={p.slug} className={cn("paper", isOpen && "is-open")}>
                  <button
                    type="button"
                    className="paper__head"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : p.slug)}
                    data-cursor={isOpen ? "Close" : "Abstract"}
                  >
                    <span className="mono blue">{formatDate(p.date, { year: "numeric" })}</span>
                    <span className="paper__title">{p.title}</span>
                    <span className="mono mute paper__venue">{p.venue}</span>
                    <span className="xrow__plus" aria-hidden="true">
                      <i />
                      <i />
                    </span>
                  </button>
                  <div className="xrow__panel">
                    <div className="xrow__panel-inner paper__panel">
                      <p className="mono mute">{p.authors.join(", ")}</p>
                      <p className="paper__abstract">{p.abstract}</p>
                      <div className="paper__actions">
                        {p.pdf ? (
                          <a className="link-line" href={p.pdf}>
                            PDF ↗
                          </a>
                        ) : null}
                        {p.doi ? (
                          <a className="link-line" href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer">
                            DOI ↗
                          </a>
                        ) : null}
                        <button type="button" className="link-line" onClick={() => copyText(p.bibtex, "BibTeX copied")} data-cursor="Copy">
                          Copy BibTeX
                        </button>
                      </div>
                      <pre className="paper__bib mono">{p.bibtex}</pre>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
