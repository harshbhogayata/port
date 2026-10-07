import { seeded } from "@/lib/utils";

/**
 * PLACEHOLDER portrait: a halftone study inside a drafting frame.
 * Replace with a photo processed into the same dithered blue style.
 */
export default function Portrait({ label = "Portrait · placeholder" }: { label?: string }) {
  const rnd = seeded(7);
  const dots: { x: number; y: number; r: number }[] = [];
  const cols = 34;
  const rows = 42;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = 20 + i * 10 + (j % 2 ? 5 : 0);
      const y = 20 + j * 10;
      // a head-and-shoulders silhouette as a density field
      const head = 1 - Math.hypot((x - 190) / 78, (y - 170) / 96);
      const body = 1 - Math.hypot((x - 190) / 170, (y - 470) / 150);
      const light = (x - 60) / 340;
      const v = Math.max(head, body * 0.95) * (0.55 + light * 0.55) + (rnd() - 0.5) * 0.12;
      if (v > 0.02) dots.push({ x, y, r: Math.min(4.6, 0.6 + v * 5.2) });
    }
  }
  return (
    <figure className="portrait">
      <svg viewBox="0 0 380 460" role="img" aria-label={label}>
        <rect x="0.5" y="0.5" width="379" height="459" className="portrait__frame" />
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r.toFixed(2)} className="portrait__dot" />
        ))}
        {[
          [0, 0],
          [380, 0],
          [0, 460],
          [380, 460],
        ].map(([x, y]) => (
          <g key={`${x}${y}`} className="portrait__crop">
            <line x1={x === 0 ? -14 : x + 14} y1={y} x2={x === 0 ? -4 : x + 4} y2={y} />
            <line x1={x} y1={y === 0 ? -14 : y + 14} x2={x} y2={y === 0 ? -4 : y + 4} />
          </g>
        ))}
        <rect x="300" y="380" width="22" height="22" fill="var(--lime)" />
      </svg>
      <figcaption className="mono mute">
        <span>Fig. 01</span>
        <span>{label}</span>
      </figcaption>
    </figure>
  );
}
