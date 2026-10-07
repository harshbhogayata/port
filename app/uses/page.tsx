import type { Metadata } from "next";
import PageHeader from "@/components/pages/PageHeader";
import { Reveal } from "@/components/motion/Motion";
import { uses } from "@/content/profile";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Uses",
  description: "The hardware, editor and tools I use every day.",
};

export default function UsesPage() {
  return (
    <>
      <PageHeader code="A-07.1" eyebrow="Uses" title="The desk, the editor, the tools" lede="What I use to design, build and ship, for the curious and for future me." />
      <section className="section--tight">
        <div className="wrap uses">
          {uses.map((g, i) => (
            <Reveal key={g.group} className="uses__group">
              <p className="mono blue">
                {pad(i + 1)} · {g.group}
              </p>
              <ul>
                {g.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
