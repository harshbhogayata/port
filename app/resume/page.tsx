import type { Metadata } from "next";
import { Reveal, SplitReveal } from "@/components/motion/Motion";
import PrintButton from "@/components/pages/PrintButton";
import TLink from "@/components/chrome/TLink";
import { profile } from "@/content/profile";
import { experience, education, stackLayers } from "@/content/career";
import { featuredProjects } from "@/content/projects";
import { papers } from "@/content/writing";

export const metadata: Metadata = {
  title: "Résumé",
  description: `${profile.name}: one-page résumé, printable, with a PDF download.`,
};

export default function ResumePage() {
  return (
    <div className="resume-page">
      <div className="wrap resume__bar">
        <p className="mono">
          <span className="blue">Sheet A-08</span> <span className="mute">· Résumé · Last updated October 2026</span>
        </p>
        <div className="resume__actions">
          <a href={profile.resumePdf} className="btn" download>
            Download PDF <span className="arrow">↓</span>
          </a>
          <PrintButton />
        </div>
      </div>

      <article className="wrap">
        <div className="resume">
          <header className="resume__head">
            <SplitReveal as="h1" className="resume__name" trigger="enter">
              {profile.name}
            </SplitReveal>
            <p className="resume__role">{profile.role}</p>
            <p className="resume__contact mono">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <span>
                {profile.city}, {profile.location}
              </span>
              {profile.socials
                .filter((s) => s.href.startsWith("http"))
                .map((s) => (
                  <a key={s.label} href={s.href}>
                    {s.href.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                ))}
            </p>
          </header>

          <Reveal as="section" className="resume__sec">
            <h2 className="resume__h mono">Summary</h2>
            <p>{profile.intro}</p>
          </Reveal>

          <Reveal as="section" className="resume__sec">
            <h2 className="resume__h mono">Experience</h2>
            {experience.map((e) => (
              <div key={e.company} className="resume__item">
                <p className="resume__line">
                  <b>{e.role}</b>, {e.company}
                  <span className="mono mute">
                    {e.start} to {e.end} · {e.location}
                  </span>
                </p>
                <ul>
                  {e.achievements.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>

          <Reveal as="section" className="resume__sec">
            <h2 className="resume__h mono">Selected projects</h2>
            {featuredProjects.map((p) => (
              <div key={p.slug} className="resume__item">
                <p className="resume__line">
                  <b>
                    <TLink href={`/work/${p.slug}`}>{p.title}</TLink>
                  </b>
                  , {p.short}
                  <span className="mono mute">{p.year}</span>
                </p>
                <p className="mute">
                  {p.tagline} {p.outcome}.
                </p>
              </div>
            ))}
          </Reveal>

          <Reveal as="section" className="resume__sec">
            <h2 className="resume__h mono">Education</h2>
            {education.map((e) => (
              <div key={e.institution} className="resume__item">
                <p className="resume__line">
                  <b>{e.degree}</b>, {e.institution}
                  <span className="mono mute">
                    {e.start} to {e.end}
                  </span>
                </p>
                <p className="mute">{e.notes.join(" · ")}</p>
              </div>
            ))}
          </Reveal>

          <Reveal as="section" className="resume__sec">
            <h2 className="resume__h mono">Skills</h2>
            <dl className="resume__skills">
              {stackLayers.map((l) => (
                <div key={l.name}>
                  <dt className="mono mute">{l.name}</dt>
                  <dd>{l.tools.map((t) => t.name).join(", ")}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal as="section" className="resume__sec">
            <h2 className="resume__h mono">Publications</h2>
            {papers.map((p) => (
              <p key={p.slug} className="resume__item">
                {p.authors.join(", ")}. <i>{p.title}</i>. {p.venue}, {p.date.slice(0, 4)}.
              </p>
            ))}
          </Reveal>
        </div>
      </article>
    </div>
  );
}
