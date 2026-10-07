import type { Metadata } from "next";
import PageHeader from "@/components/pages/PageHeader";
import Portrait from "@/components/art/Portrait";
import Pronounce from "@/components/home/Pronounce";
import SectionLabel from "@/components/home/SectionLabel";
import TLink from "@/components/chrome/TLink";
import { Reveal, SplitReveal } from "@/components/motion/Motion";
import { profile, principles, milestones, interests } from "@/content/profile";
import { education } from "@/content/career";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: `The story behind ${profile.name}: backstory, principles, education and life outside work.`,
};

// PLACEHOLDER bio
const bio = [
  "I grew up taking things apart, first radios, then websites. The first time something I built was used by a stranger, I was hooked on that feeling and I still chase it.",
  "Today I work across the whole surface of a product. I'm as happy tuning the easing on a button as I am tracing a slow query through three services. Most of the interesting problems live where those two worlds meet.",
  "I've worked in early teams and in larger ones, on products for merchants, planners and readers. Right now I'm building Curator, a calmer way to keep what's worth reading.",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        code="A-01"
        eyebrow="About"
        title="Engineer by way of curiosity"
        lede={profile.intro}
        aside={`${profile.city}, ${profile.location}`}
      />

      <section className="section about-open">
        <div className="wrap about-open__grid">
          <Reveal className="about-open__portrait" y={60}>
            <Portrait />
          </Reveal>
          <Reveal className="about-open__bio" childrenStagger>
            {bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <div className="about-open__links">
              <TLink href="/resume" className="link-line">
                Read the résumé <span aria-hidden="true">→</span>
              </TLink>
              <TLink href="/work" className="link-line">
                See the work <span aria-hidden="true">→</span>
              </TLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section--tight about-name">
        <div className="wrap">
          <SectionLabel num="01" title="On my name" right="Pronunciation & meaning" />
          <div className="about-name__grid">
            <SplitReveal className="about-name__big">{profile.name}</SplitReveal>
            <Reveal className="about-name__detail" childrenStagger>
              <div className="intro__say">
                <Pronounce />
                <div>
                  <p className="intro__phon">{profile.pronunciation.phonetic}</p>
                  <p className="mono mute">{profile.pronunciation.ipa}</p>
                </div>
              </div>
              <p className="about-name__meaning">{profile.pronunciation.meaning}</p>
              <p className="mono mute">Press play for the recording.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section about-story">
        <div className="wrap">
          <SectionLabel num="02" title="Backstory" right="A few turning points" />
          <ol className="tl">
            {milestones.map((m, i) => (
              <Reveal as="li" key={m.year + m.title} className="tl__item" y={40}>
                <span className="tl__year">{m.year}</span>
                <span className="tl__node" aria-hidden="true" />
                <div className="tl__body">
                  <p className="mono blue">M-{pad(i + 1)}</p>
                  <h3 className="h3">{m.title}</h3>
                  <p className="mute">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section about-principles">
        <div className="wrap">
          <SectionLabel num="03" title="Principles" right="The long version" />
          <ol className="plist">
            {principles.map((p, i) => (
              <Reveal as="li" key={p.title} className="plist__row" y={30}>
                <span className="plist__num">{pad(i + 1)}</span>
                <h3 className="plist__title">{p.title}</h3>
                <div className="plist__body">
                  <p>{p.body}</p>
                  <TLink href={p.proof.href} className="u-line blue">
                    {p.proof.label} →
                  </TLink>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section--tight about-edu">
        <div className="wrap">
          <SectionLabel num="04" title="Education" />
          {education.map((e) => (
            <Reveal key={e.institution} className="edu">
              <span className="mono blue">
                {e.start} — {e.end}
              </span>
              <div>
                <h3 className="h3">{e.degree}</h3>
                <p className="mute">
                  {e.institution}, {e.location}
                </p>
              </div>
              <ul className="edu__notes">
                {e.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section about-life">
        <div className="wrap">
          <SectionLabel num="05" title="Outside of work" />
          <Reveal as="ul" className="life" childrenStagger y={30}>
            {interests.map((x, i) => (
              <li key={x}>
                <span className="mono blue">{pad(i + 1)}</span>
                {x}
              </li>
            ))}
          </Reveal>
          <Reveal className="about-cta">
            <p className="h3">Want the rest of the story?</p>
            <TLink href="/contact" className="btn">
              Say hello <span className="arrow">→</span>
            </TLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
