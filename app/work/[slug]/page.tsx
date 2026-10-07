import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TLink from "@/components/chrome/TLink";
import IsoStack from "@/components/art/IsoStack";
import CaseToc from "@/components/pages/CaseToc";
import Architecture from "@/components/pages/Architecture";
import { SplitReveal, Reveal, CountUp } from "@/components/motion/Motion";
import { projects, getProject, featuredProjects } from "@/content/projects";
import { pad } from "@/lib/utils";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.title, description: `${p.tagline} ${p.outcome}.` };
}

const SECTIONS = [
  { id: "backstory", label: "Backstory" },
  { id: "problem", label: "Problem & constraints" },
  { id: "role", label: "My role" },
  { id: "process", label: "Process" },
  { id: "architecture", label: "Architecture" },
  { id: "decisions", label: "Decisions" },
  { id: "hard-part", label: "The hard part" },
  { id: "outcome", label: "Outcome" },
  { id: "reflection", label: "Reflection" },
];

export default async function CasePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const index = projects.indexOf(p);
  const full = p.featured;
  const pool = full ? featuredProjects : projects;
  const next = pool[(pool.indexOf(p) + 1) % pool.length];

  return (
    <article className="case">
      <header className="case__cover wrap">
        <Reveal className="ph__meta mono" y={10}>
          <span>
            <span className="blue">Sheet A-02.{pad(index + 1)}</span>
            <span className="mute"> · {p.type.join(" · ")}</span>
          </span>
          <span className="mute">{p.status ?? p.year}</span>
        </Reveal>
        <div className="case__cover-grid">
          <div>
            <SplitReveal as="h1" className="case__title" trigger="enter">
              {p.title}
            </SplitReveal>
            <Reveal className="case__tagline lead" delay={0.25}>
              {p.tagline}
            </Reveal>
            <Reveal className="case__outcome" delay={0.35}>
              <span className="wcard__outcome-k mono">Outcome</span>
              {p.outcome}
            </Reveal>
          </div>
          {p.layers.length ? (
            <Reveal className="case__art" y={60} delay={0.2}>
              <IsoStack layers={p.layers} keyIndex={p.keyLayer} open={0.6} title={`${p.title} architecture`} />
            </Reveal>
          ) : null}
        </div>
        <Reveal as="dl" className="case__meta" childrenStagger y={16}>
          {[
            { k: "Role", v: p.role },
            { k: "Team", v: p.team },
            { k: "Duration", v: p.duration },
            { k: "Year", v: p.year },
            { k: "Stack", v: p.stack.join(", ") },
          ].map((m) => (
            <div key={m.k}>
              <dt className="mono mute">{m.k}</dt>
              <dd>{m.v}</dd>
            </div>
          ))}
          {p.links.live || p.links.repo ? (
            <div>
              <dt className="mono mute">Links</dt>
              <dd className="case__links">
                {p.links.live ? (
                  <a href={p.links.live} className="u-line">
                    Live ↗
                  </a>
                ) : null}
                {p.links.repo ? (
                  <a href={p.links.repo} className="u-line">
                    Code ↗
                  </a>
                ) : null}
              </dd>
            </div>
          ) : null}
        </Reveal>
      </header>

      {full ? (
        <div className="case__body wrap">
          <aside className="case__aside">
            <CaseToc items={SECTIONS} />
          </aside>
          <div className="case__content">
            <section id="backstory" className="cs">
              <p className="cs__k mono">01 · Backstory</p>
              {p.backstory.map((b, i) => (
                <Reveal key={i} as="p" className={i === 0 ? "cs__lead" : "cs__p"}>
                  {b}
                </Reveal>
              ))}
            </section>

            <section id="problem" className="cs">
              <p className="cs__k mono">02 · Problem & constraints</p>
              <Reveal as="p" className="cs__lead">
                {p.problem}
              </Reveal>
              <Reveal as="ul" className="cs__constraints" childrenStagger>
                {p.constraints.map((c, i) => (
                  <li key={c}>
                    <span className="mono blue">C-{pad(i + 1)}</span>
                    {c}
                  </li>
                ))}
              </Reveal>
            </section>

            <section id="role" className="cs">
              <p className="cs__k mono">03 · My role</p>
              <Reveal as="ul" className="cs__bullets" childrenStagger>
                {p.myRole.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </Reveal>
            </section>

            <section id="process" className="cs">
              <p className="cs__k mono">04 · Process</p>
              <Reveal className="cs__process" childrenStagger>
                {p.process.map((s, i) => (
                  <div key={s.stage} className="cs__stage">
                    <span className="mono blue">{pad(i + 1)}</span>
                    <h3 className="h3">{s.stage}</h3>
                    <p className="mute">{s.text}</p>
                  </div>
                ))}
              </Reveal>
            </section>

            <section id="architecture" className="cs">
              <p className="cs__k mono">05 · Architecture</p>
              <Reveal as="p" className="cs__p">
                The system, layer by layer. Hover a layer to lift it out; the lime cube marks where the key decision lives.
              </Reveal>
              <Architecture layers={p.layers} keyIndex={p.keyLayer} title={p.title} />
            </section>

            <section id="decisions" className="cs">
              <p className="cs__k mono">06 · Decisions & trade-offs</p>
              <div className="cs__decisions">
                {p.decisions.map((d, i) => (
                  <Reveal key={d.title} className="dec">
                    <p className="mono blue">D-{pad(i + 1)}</p>
                    <h3 className="h3">{d.title}</h3>
                    <ul className="dec__opts">
                      {d.options.map((o) => (
                        <li key={o} className={o === d.choice ? "is-chosen" : undefined}>
                          <span className="dec__box" aria-hidden="true" />
                          {o}
                          {o === d.choice ? <span className="tag tag--lime">Chosen</span> : null}
                        </li>
                      ))}
                    </ul>
                    <p className="dec__why">
                      <span className="mono mute">Why</span>
                      {d.why}
                    </p>
                  </Reveal>
                ))}
              </div>
            </section>

            <section id="hard-part" className="cs">
              <p className="cs__k mono">07 · The hard part</p>
              <SplitReveal as="h3" className="cs__h">
                {p.hardPart.title}
              </SplitReveal>
              {p.hardPart.body.map((b) => (
                <Reveal key={b} as="p" className="cs__p">
                  {b}
                </Reveal>
              ))}
            </section>

            <section id="outcome" className="cs">
              <p className="cs__k mono">08 · Outcome</p>
              <Reveal className="cs__metrics" childrenStagger>
                {p.metrics.map((m) => (
                  <div key={m.label}>
                    <CountUp value={m.value} className="cs__metric" />
                    <span className="mono mute">{m.label}</span>
                  </div>
                ))}
              </Reveal>
            </section>

            <section id="reflection" className="cs">
              <p className="cs__k mono">09 · Reflection</p>
              <Reveal as="blockquote" className="cs__reflect">
                <p>{p.reflection}</p>
                <footer className="mono mute">What I&rsquo;d do differently</footer>
              </Reveal>
            </section>
          </div>
        </div>
      ) : (
        <div className="wrap case__short">
          <Reveal as="p" className="cs__lead">
            A smaller project, so there&rsquo;s no full write-up yet. The code and the short version are linked above.
          </Reveal>
        </div>
      )}

      <TLink href={`/work/${next.slug}`} className="case__next" cursor="Next">
        <span className="wrap case__next-inner">
          <span className="mono">Next sheet · {next.type.join(" · ")}</span>
          <span className="case__next-title">
            {next.title}
            <svg width="0.6em" height="0.6em" viewBox="0 0 22 22" aria-hidden="true">
              <path d="M1 21L21 1M5 1h16v16" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <span className="case__next-tag">{next.tagline}</span>
        </span>
      </TLink>
    </article>
  );
}
