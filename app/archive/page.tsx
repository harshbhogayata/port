import type { Metadata } from "next";
import PageHeader from "@/components/pages/PageHeader";
import { Reveal } from "@/components/motion/Motion";
import { versions } from "@/content/site";

export const metadata: Metadata = {
  title: "Archive",
  description: "Every version of this portfolio, and what each one taught me.",
};

/** PLACEHOLDER sketches: replace with real screenshots of each version. */
function Sketch({ rev }: { rev: string }) {
  if (rev === "v3")
    return (
      <svg viewBox="0 0 480 300" className="vsk vsk--v3" aria-hidden="true">
        <rect width="480" height="300" className="vsk__bg" />
        <rect x="24" y="70" width="150" height="16" className="vsk__ink" />
        <rect x="24" y="92" width="190" height="16" className="vsk__ink" />
        <rect x="24" y="114" width="130" height="16" className="vsk__ink" />
        <rect x="24" y="150" width="140" height="6" className="vsk__mute" />
        <rect x="24" y="180" width="64" height="18" className="vsk__blue" />
        <g transform="translate(300 40) skewY(30)">
          <rect x="0" y="0" width="24" height="120" className="vsk__blue" />
          <rect x="24" y="48" width="40" height="22" className="vsk__blue" />
          <rect x="64" y="0" width="24" height="120" className="vsk__blue" />
          <rect x="88" y="46" width="20" height="26" className="vsk__lime" />
        </g>
        <line x1="0" y1="30" x2="480" y2="30" className="vsk__line" />
      </svg>
    );
  if (rev === "v2")
    return (
      <svg viewBox="0 0 480 300" className="vsk vsk--v2" aria-hidden="true">
        <rect width="480" height="300" fill="#06070b" />
        {Array.from({ length: 140 }, (_, i) => (
          <circle key={i} cx={(i * 97) % 480} cy={(i * 53) % 300} r={(i % 3) + 0.6} fill="#7a8cff" opacity={0.25 + (i % 5) / 8} />
        ))}
        <rect x="140" y="130" width="200" height="22" fill="#fff" />
        <rect x="190" y="160" width="100" height="8" fill="#8c93a8" />
      </svg>
    );
  return (
    <svg viewBox="0 0 480 300" className="vsk vsk--v1" aria-hidden="true">
      <rect width="480" height="300" fill="#fff" />
      <circle cx="240" cy="70" r="30" fill="#d9dde6" />
      <rect x="170" y="116" width="140" height="12" fill="#2a2e37" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={110 + (i % 3) * 90} y={150 + Math.floor(i / 3) * 26} width="78" height="16" rx="8" fill="#e9ecf2" />
      ))}
      <rect x="0" y="270" width="480" height="30" fill="#2a2e37" />
    </svg>
  );
}

export default function ArchivePage() {
  return (
    <>
      <PageHeader
        code="A-06"
        eyebrow="Archive"
        title="Three versions, one practice"
        lede="Every portfolio is a snapshot of what its author believed at the time. Here are mine, with what each one taught me."
        aside={`${versions.length} revisions`}
      />

      <section className="section--tight">
        <div className="wrap">
          <Reveal className="rev">
            <table className="rev__table">
              <thead>
                <tr className="mono mute">
                  <th>Rev</th>
                  <th>Year</th>
                  <th>Title</th>
                  <th>Stack</th>
                  <th>What I learned</th>
                </tr>
              </thead>
              <tbody>
                {versions.map((v) => (
                  <tr key={v.rev} className={v.current ? "is-current" : undefined}>
                    <td className="mono blue">{v.rev}</td>
                    <td className="mono">{v.year}</td>
                    <td>{v.title}</td>
                    <td className="mono mute">{v.stack.join(", ")}</td>
                    <td>{v.learned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          <ol className="versions">
            {versions.map((v) => (
              <Reveal as="li" key={v.rev} className="ver" y={60}>
                <div className="ver__frame">
                  <div className="ver__chrome mono" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span>harshbhogayata.com · {v.rev}</span>
                  </div>
                  <Sketch rev={v.rev} />
                </div>
                <div className="ver__text">
                  <p className="mono">
                    <span className="blue">{v.rev}</span> <span className="mute">· {v.year}</span>
                    {v.current ? <span className="tag tag--lime ver__now">You are here</span> : null}
                  </p>
                  <h2 className="h3">{v.title}</h2>
                  <p className="mute">{v.concept}</p>
                  <p className="ver__learned">
                    <span className="mono mute">Learned</span>
                    {v.learned}
                  </p>
                  {v.url ? (
                    <a href={v.url} className="link-line">
                      Visit {v.rev} ↗
                    </a>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal className="ver__next">
            <p className="mono blue">v4 · someday</p>
            <p className="h3">Whatever I learn from this one.</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
