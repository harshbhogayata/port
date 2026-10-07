"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/lenis";
import { cn, pad } from "@/lib/utils";

export default function CaseToc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const triggers = items.map((it) =>
      ScrollTrigger.create({
        trigger: `#${it.id}`,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => self.isActive && setActive(it.id),
      }),
    );
    const total = ScrollTrigger.create({
      trigger: ".case__body",
      start: "top 60%",
      end: "bottom 60%",
      onUpdate: (self) => setProgress(self.progress),
    });
    return () => {
      triggers.forEach((t) => t.kill());
      total.kill();
    };
  }, [items]);

  return (
    <nav className="toc" aria-label="On this page">
      <p className="mono mute">On this sheet</p>
      <ol>
        {items.map((it, i) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={cn("toc__link", active === it.id && "is-active")}
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget(`#${it.id}`);
              }}
            >
              <span className="mono">{pad(i + 1)}</span>
              {it.label}
            </a>
          </li>
        ))}
      </ol>
      <div className="toc__bar" aria-hidden="true">
        <i style={{ transform: `scaleY(${progress})` }} />
      </div>
      <p className="toc__pct mono mute" aria-hidden="true">
        {Math.round(progress * 100)
          .toString()
          .padStart(3, "0")}
        % read
      </p>
    </nav>
  );
}
