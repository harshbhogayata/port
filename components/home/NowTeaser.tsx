import TLink from "@/components/chrome/TLink";
import SectionLabel from "./SectionLabel";
import { Reveal } from "@/components/motion/Motion";
import { now } from "@/content/profile";

export default function NowTeaser() {
  const cols = [
    { k: "Building", v: now.building },
    { k: "Learning", v: now.learning },
    { k: "Reading", v: now.reading },
  ];
  return (
    <section className="nowt section--tight" id="now" aria-label="Now">
      <div className="wrap">
        <SectionLabel num="10" title="Now" right={`Updated ${now.updated}`} />
        <TLink href="/now" className="nowt__board" cursor="Open /now">
          <Reveal className="nowt__cols" childrenStagger>
            {cols.map((c) => (
              <div key={c.k} className="nowt__col">
                <p className="mono blue">{c.k}</p>
                <ul>
                  {c.v.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
          <span className="nowt__more mono">
            More on /now <span aria-hidden="true">→</span>
          </span>
        </TLink>
      </div>
    </section>
  );
}
