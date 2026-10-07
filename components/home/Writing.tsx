import TLink from "@/components/chrome/TLink";
import SectionLabel from "./SectionLabel";
import WritingList from "./WritingList";
import { SplitReveal } from "@/components/motion/Motion";
import { allWriting, articles, papers } from "@/content/writing";

export default function Writing() {
  const latest = [...articles.slice(0, 2), papers[0]].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <section className="writing section" id="writing" aria-labelledby="writing-title">
      <div className="wrap">
        <SectionLabel num="07" title="Writing & research" right={`${articles.length} articles · ${papers.length} papers`} />
        <div className="writing__head">
          <SplitReveal className="h2" id="writing-title" dot>
            {"Notes from the work"}
          </SplitReveal>
          <TLink href="/writing" className="link-line" cursor="All">
            All {allWriting.length} pieces
            <svg width="20" height="12" viewBox="0 0 22 14" aria-hidden="true">
              <path d="M0 7h20M14 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </TLink>
        </div>
        <WritingList items={latest} />
      </div>
    </section>
  );
}
