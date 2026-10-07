import TLink from "@/components/chrome/TLink";

export default function NotFound() {
  return (
    <section className="nf">
      <svg className="nf__art" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {[120, 280, 440, 600, 760, 920].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="600" className="nf__grid" />
        ))}
        <path className="nf__lost" d="M-20 420 C 180 380, 260 120, 470 200 S 760 520, 1020 160" />
        <rect className="nf__sq" x="640" y="300" width="22" height="22" />
      </svg>
      <div className="wrap nf__inner">
        <p className="mono blue">Sheet A-404</p>
        <h1 className="nf__title">
          Sheet not found<span className="dot">.</span>
        </h1>
        <p className="lead">This drawing isn&rsquo;t in the set. It may have been moved, renamed or never drawn at all.</p>
        <div className="nf__links">
          <TLink href="/" className="btn">
            Back to the cover sheet <span className="arrow">→</span>
          </TLink>
          <TLink href="/work" className="link-line">
            See the work
          </TLink>
        </div>
      </div>
    </section>
  );
}
