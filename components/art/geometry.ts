/** Shared drafting geometry: an oblique "skew" projection for the monogram and a true isometric projection for plates. */

export type Pt = [number, number];

export const fmt = (n: number) => Math.round(n * 10) / 10;
export const poly = (pts: Pt[]) => pts.map(([x, y]) => `${fmt(x)},${fmt(y)}`).join(" ");

/* ─────────── Oblique projection for the hero monogram ─────────── */
export const K = 0.58; // slope of receding horizontals (≈30°)
export const C = -60;

export const sk = (x: number, y: number): Pt => [x, y + K * x + C];

export function skRect(x0: number, y0: number, x1: number, y1: number): Pt[] {
  return [sk(x0, y0), sk(x1, y0), sk(x1, y1), sk(x0, y1)];
}

/** A "D" bowl: straight left edge at x0, round right side reaching xr. Returns a path in projected space. */
export function skBowl(x0: number, y0: number, y1: number, xr: number, dx = 0, dy = 0) {
  const h = y1 - y0;
  const r = h / 2;
  const xs = xr - r; // where the straight top edge meets the curve
  const k = 0.5523 * r;
  const P = (x: number, y: number) => sk(x + dx, y + dy);
  const pts = {
    a: P(x0, y0),
    b: P(xs, y0),
    c1: P(xs + k, y0),
    c2: P(xr, y0 + r - k),
    m: P(xr, y0 + r),
    c3: P(xr, y0 + r + k),
    c4: P(xs + k, y1),
    e: P(xs, y1),
    f: P(x0, y1),
  };
  const p = (q: Pt) => `${fmt(q[0])} ${fmt(q[1])}`;
  return `M${p(pts.a)} L${p(pts.b)} C${p(pts.c1)} ${p(pts.c2)} ${p(pts.m)} C${p(pts.c3)} ${p(pts.c4)} ${p(pts.e)} L${p(pts.f)} Z`;
}

/** Sample a circle drawn on the oblique plane (it projects to an ellipse). */
export function skArc(cx: number, cy: number, r: number, a0: number, a1: number, steps = 64) {
  const out: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = ((a0 + ((a1 - a0) * i) / steps) * Math.PI) / 180;
    out.push(sk(cx + r * Math.cos(t), cy + r * Math.sin(t)));
  }
  return "M" + out.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join(" L");
}

/* ─────────── Isometric projection for plates / stacks ─────────── */
const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);

export function iso(ox: number, oy: number, s = 1) {
  return (u: number, v: number, z = 0): Pt => [ox + (u - v) * COS * s, oy + (u + v) * SIN * s - z];
}
