import type { Metadata } from "next";
import PageHeader from "@/components/pages/PageHeader";
import Specimen from "@/components/pages/Specimens";
import { Reveal } from "@/components/motion/Motion";
import { lab } from "@/content/site";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Lab",
  description: "Experiments, prototypes and small tools. Most of them are interactive.",
};

export default function LabPage() {
  return (
    <>
      <PageHeader
        code="A-04"
        eyebrow="Lab"
        title="Experiments, mostly playable"
        lede="Small studies in interaction, rendering and motion. Nothing here is a product, and everything here taught me something."
        aside={`${pad(lab.length)} specimens`}
      />
      <section className="section--tight">
        <Reveal as="ul" className="wrap lab" childrenStagger y={50}>
          {lab.map((x, i) => (
            <li key={x.slug} className="labc">
              <div className="labc__stage">
                <Specimen kind={x.specimen} />
              </div>
              <div className="labc__meta">
                <span className="mono blue">X-{pad(i + 1)}</span>
                <span className="mono mute">{x.date}</span>
              </div>
              <h2 className="labc__title">{x.title}</h2>
              <p className="mute">{x.description}</p>
              <p className="labc__links mono">
                {x.links.demo ? (
                  <a href={x.links.demo} className="u-line">
                    Demo ↗
                  </a>
                ) : null}
                {x.links.code ? (
                  <a href={x.links.code} className="u-line">
                    Code ↗
                  </a>
                ) : null}
              </p>
            </li>
          ))}
        </Reveal>
      </section>
    </>
  );
}
