import { seeded } from "@/lib/utils";

// PLACEHOLDER — generated deterministically; swap for GitHub's contribution calendar.
const WEEKS = 53;
const DAYS = 7;
const CELL = 11;
const GAP = 3;

function levels() {
  const rnd = seeded(2026);
  const out: number[] = [];
  for (let w = 0; w < WEEKS; w++) {
    const season = 0.45 + 0.4 * Math.sin((w / WEEKS) * Math.PI * 2.4 + 1.2);
    for (let d = 0; d < DAYS; d++) {
      const weekend = d === 0 || d === 6 ? 0.45 : 1;
      const r = rnd() * season * weekend;
      out.push(r > 0.62 ? 4 : r > 0.44 ? 3 : r > 0.28 ? 2 : r > 0.14 ? 1 : 0);
    }
  }
  // one standout streak, marked lime
  [[38, 2], [38, 3], [39, 1], [39, 4]].forEach(([w, d]) => (out[w * DAYS + d] = 5));
  return out;
}

const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

export default function ContributionGraph() {
  const data = levels();
  const width = WEEKS * (CELL + GAP);
  const height = DAYS * (CELL + GAP) + 22;
  return (
    <svg className="contrib" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Contribution activity over the last year">
      {MONTHS.map((m, i) => (
        <text key={m} x={i * ((WEEKS / 12) * (CELL + GAP))} y={10} className="contrib__m">
          {m}
        </text>
      ))}
      <g transform="translate(0 20)">
        {data.map((lv, i) => {
          const w = Math.floor(i / DAYS);
          const d = i % DAYS;
          return (
            <rect
              key={i}
              className={`contrib__c contrib__c--${lv}`}
              style={{ "--w": w } as React.CSSProperties}
              x={w * (CELL + GAP)}
              y={d * (CELL + GAP)}
              width={CELL}
              height={CELL}
            />
          );
        })}
      </g>
    </svg>
  );
}
