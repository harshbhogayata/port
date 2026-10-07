import type { Metadata } from "next";
import PageHeader from "@/components/pages/PageHeader";
import WorkIndex from "@/components/pages/WorkIndex";
import { projects } from "@/content/projects";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Work",
  description: "Projects and case studies: products, systems and the stories behind them.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        code="A-02"
        eyebrow="Work"
        title="Everything on the drawing board"
        lede="Featured case studies, side projects and open source. Each sheet has the backstory, the constraints and the decisions that shaped it."
        aside={`${pad(projects.length)} entries`}
      />
      <section className="section--tight">
        <WorkIndex />
      </section>
    </>
  );
}
