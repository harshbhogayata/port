"use client";

import TLink from "@/components/chrome/TLink";
import { Reveal } from "@/components/motion/Motion";
import type { Article, Paper } from "@/content/types";
import { formatDate } from "@/content/writing";

export default function WritingList({ items }: { items: (Article | Paper)[] }) {
  return (
    <Reveal as="ul" className="wlist" childrenStagger y={24}>
      {items.map((it) => {
        const href = it.kind === "Article" ? `/writing/${it.slug}` : `/writing#${it.slug}`;
        return (
          <li key={it.slug}>
            <TLink href={href} className="wrow" cursor={it.kind === "Article" ? "Read" : "Abstract"}>
              <span className="wrow__date mono">{formatDate(it.date)}</span>
              <span className="wrow__kind">
                <span className={it.kind === "Paper" ? "tag tag--blue" : "tag"}>{it.kind}</span>
              </span>
              <span className="wrow__title">{it.title}</span>
              <span className="wrow__meta mono">{it.kind === "Article" ? it.readingTime : it.venue}</span>
              <span className="wrow__arrow" aria-hidden="true">
                <svg width="22" height="14" viewBox="0 0 22 14">
                  <path d="M0 7h20M14 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
            </TLink>
          </li>
        );
      })}
    </Reveal>
  );
}
