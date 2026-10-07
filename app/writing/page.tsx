import type { Metadata } from "next";
import PageHeader from "@/components/pages/PageHeader";
import WritingIndex from "@/components/pages/WritingIndex";
import { articles, papers } from "@/content/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: "Articles on building products and systems, and research papers.",
};

export default function WritingPage() {
  return (
    <>
      <PageHeader
        code="A-03"
        eyebrow="Writing"
        title="Notes, essays and papers"
        lede="Long-form notes from the work: performance, interfaces, offline-first and the occasional paper."
        aside={`${articles.length} articles · ${papers.length} papers`}
      />
      <section className="section--tight">
        <WritingIndex />
      </section>
    </>
  );
}
