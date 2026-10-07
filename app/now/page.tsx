import type { Metadata } from "next";
import PageHeader from "@/components/pages/PageHeader";
import { Reveal } from "@/components/motion/Motion";
import { now } from "@/content/profile";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Now",
  description: "What I'm building, learning and reading this month.",
};

export default function NowPage() {
  const rows = [
    { k: "Building", v: now.building },
    { k: "Learning", v: now.learning },
    { k: "Reading", v: now.reading },
    { k: "Listening", v: now.listening },
    { k: "Location", v: [now.location] },
  ];
  return (
    <>
      <PageHeader
        code="A-05"
        eyebrow="Now"
        title="What I'm doing now"
        lede={
          <>
            A snapshot of this month, updated by hand. It&rsquo;s a{" "}
            <a className="u-line blue" href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer">
              now page
            </a>
            , so if you&rsquo;re reading this later, things have probably moved on.
          </>
        }
        aside={`Updated ${now.updated}`}
      />
      <section className="section--tight">
        <div className="wrap">
          <ol className="nowp">
            {rows.map((r, i) => (
              <Reveal as="li" key={r.k} className="nowp__row" y={30}>
                <span className="mono blue">{pad(i + 1)}</span>
                <h2 className="nowp__k">{r.k}</h2>
                <ul className="nowp__v">
                  {r.v.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
