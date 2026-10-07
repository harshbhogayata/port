import SectionLabel from "./SectionLabel";
import { Reveal } from "@/components/motion/Motion";
import { recognition } from "@/content/career";

export default function Recognition() {
  return (
    <section className="recog section--tight" id="recognition" aria-label="Recognition">
      <div className="wrap">
        <SectionLabel num="08" title="Recognition" right="Talks, awards & features" />
        <Reveal as="ul" className="recog__list" childrenStagger y={20}>
          {recognition.map((r) => (
            <li key={r.title} className="recog__row">
              <span className="mono blue">{r.year}</span>
              <span className="mono mute recog__kind">{r.kind}</span>
              <span className="recog__title">{r.title}</span>
              <span className="mute recog__detail">{r.detail}</span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
