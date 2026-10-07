import { useId } from "react";
import { iso, poly, fmt, type Pt } from "./geometry";
import { cn, pad } from "@/lib/utils";

type Layer = { name: string; detail?: string };

type Props = {
  layers: Layer[];
  keyIndex?: number;
  active?: number | null;
  labels?: boolean;
  className?: string;
  /** Resting gap between plates (0 = stacked, 1 = fully exploded). */
  open?: number;
  title?: string;
};

const W = 210;
const T = 10;
const GAP = 50;
const SPREAD = 28;

/**
 * An exploded isometric stack: each layer of a system as a plate.
 * The key layer is solid blue; a lime cube marks the decision that mattered most.
 */
export default function IsoStack({ layers, keyIndex, active = null, labels = true, className, open = 0.25, title }: Props) {
  const uid = useId().replace(/:/g, "");
  const n = layers.length;
  const ox = 200;
  const top = 34;
  const oy = top + (n - 1) * (GAP + SPREAD);
  const P = iso(ox, oy);
  const height = oy + W + T + 40;
  const width = labels ? 700 : 400;
  const cx = ox;
  const zTop = (n - 1) * GAP;

  return (
    <svg
      className={cn("iso", className)}
      viewBox={`0 0 ${width} ${fmt(height)}`}
      style={{ "--open": open } as React.CSSProperties}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <filter id={`d${uid}`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves={1} seed={9} result="n" />
          <feComponentTransfer in="n" result="c">
            <feFuncR type="linear" slope="3" intercept="-1" />
            <feFuncG type="linear" slope="3" intercept="-1" />
            <feFuncB type="linear" slope="3" intercept="-1" />
          </feComponentTransfer>
          <feColorMatrix in="c" type="luminanceToAlpha" result="na" />
          <feComposite in="SourceAlpha" in2="na" operator="arithmetic" k2="1" k3="-1" k4="0.5" result="m" />
          <feComponentTransfer in="m" result="mask">
            <feFuncA type="discrete" tableValues="0 1" />
          </feComponentTransfer>
          <feComponentTransfer in="SourceGraphic" result="s">
            <feFuncA type="discrete" tableValues="0 1 1 1 1 1 1 1 1 1" />
          </feComponentTransfer>
          <feComposite in="s" in2="mask" operator="in" />
        </filter>
        <linearGradient id={`g${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--blue)", stopOpacity: 1 }} />
          <stop offset="0.55" style={{ stopColor: "var(--blue)", stopOpacity: 0.95 }} />
          <stop offset="1" style={{ stopColor: "var(--blue)", stopOpacity: 0.1 }} />
        </linearGradient>
      </defs>

      {/* corner verticals + data path stay valid at any spread: x is constant per corner */}
      <g className="iso__guides">
        {[ox - W * 0.866, ox, ox + W * 0.866].map((x) => (
          <line key={x} x1={fmt(x)} y1={8} x2={fmt(x)} y2={fmt(height - 8)} />
        ))}
      </g>
      <line className="iso__path" x1={cx} y1={fmt(oy - zTop + W * 0.5 - (n - 1) * SPREAD)} x2={cx} y2={fmt(oy + W * 0.5)} />

      {[...layers].map((_, ri) => {
        // draw bottom plate first
        const i = n - 1 - ri;
        const layer = layers[i];
        const k = n - 1 - i;
        const z = k * GAP;
        const isKey = i === keyIndex;
        const isActive = active === i;
        const topFace: Pt[] = [P(0, 0, z), P(W, 0, z), P(W, W, z), P(0, W, z)];
        const left: Pt[] = [P(0, W, z), P(W, W, z), P(W, W, z - T), P(0, W, z - T)];
        const right: Pt[] = [P(W, 0, z), P(W, W, z), P(W, W, z - T), P(W, 0, z - T)];
        const grid = [0.25, 0.5, 0.75].flatMap((f) => [
          [P(W * f, 0, z), P(W * f, W, z)],
          [P(0, W * f, z), P(W, W * f, z)],
        ]);
        const corner = P(W, 0, z);
        const labelX = ox + W * 0.866 + 54;
        const cube = (u: number, v: number, s: number) => {
          const h = s;
          return {
            top: [P(u, v, z + h), P(u + s, v, z + h), P(u + s, v + s, z + h), P(u, v + s, z + h)] as Pt[],
            left: [P(u, v + s, z + h), P(u + s, v + s, z + h), P(u + s, v + s, z), P(u, v + s, z)] as Pt[],
            right: [P(u + s, v, z + h), P(u + s, v + s, z + h), P(u + s, v + s, z), P(u + s, v, z)] as Pt[],
          };
        };
        const c = cube(W - 52, W - 52, 26);

        return (
          <g
            key={layer.name + i}
            className={cn("iso__plate", isKey && "is-key", isActive && "is-active")}
            style={{ "--k": k } as React.CSSProperties}
          >
            <polygon className="iso__side iso__side--l" points={poly(left)} />
            <polygon className="iso__side iso__side--r" points={poly(right)} />
            <polygon className="iso__top" points={poly(topFace)} />
            {isKey ? <polygon points={poly(topFace)} fill={`url(#g${uid})`} filter={`url(#d${uid})`} /> : null}
            <g className="iso__grid">
              {grid.map(([a, b], gi) => (
                <line key={gi} x1={fmt(a[0])} y1={fmt(a[1])} x2={fmt(b[0])} y2={fmt(b[1])} />
              ))}
            </g>
            {isKey ? (
              <g className="iso__cube">
                <polygon points={poly(c.left)} fill="var(--art-lime-side)" />
                <polygon points={poly(c.right)} fill="var(--art-lime-top)" />
                <polygon points={poly(c.top)} fill="var(--lime)" />
              </g>
            ) : null}
            {labels ? (
              <g className="iso__label">
                <line x1={fmt(corner[0] + 8)} y1={fmt(corner[1])} x2={fmt(labelX - 10)} y2={fmt(corner[1])} />
                <circle cx={fmt(corner[0])} cy={fmt(corner[1])} r={3.5} />
                <text x={fmt(labelX)} y={fmt(corner[1] - 6)} className="iso__name">
                  <tspan className="iso__num">{pad(i + 1)}</tspan> {layer.name}
                </text>
                {layer.detail ? (
                  <text x={fmt(labelX)} y={fmt(corner[1] + 16)} className="iso__detail">
                    {layer.detail}
                  </text>
                ) : null}
              </g>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
