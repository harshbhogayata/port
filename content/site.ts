import type { LabItem, Version } from "./types";

/** The drawing set: every route is a sheet. */
export const sheets = [
  { code: "A-00", href: "/", title: "Home", description: "The short story: work, principles and how to reach me." },
  { code: "A-01", href: "/about", title: "About", description: "Backstory, my name, principles and education." },
  { code: "A-02", href: "/work", title: "Work", description: "Projects and case studies, with the stories behind them." },
  { code: "A-03", href: "/writing", title: "Writing", description: "Articles and research papers." },
  { code: "A-04", href: "/lab", title: "Lab", description: "Experiments, prototypes and small tools." },
  { code: "A-05", href: "/now", title: "Now", description: "What I'm building, learning and reading this month." },
  { code: "A-06", href: "/archive", title: "Archive", description: "Every version of this portfolio, and what each taught me." },
  { code: "A-07", href: "/colophon", title: "Colophon", description: "How this site is built, and how fast it is." },
  { code: "A-08", href: "/resume", title: "Résumé", description: "One page, printable, with a PDF." },
  { code: "A-09", href: "/contact", title: "Contact", description: "Start a conversation." },
] as const;

export function sheetFor(pathname: string) {
  if (pathname === "/") return sheets[0];
  const match = [...sheets].reverse().find((s) => s.href !== "/" && pathname.startsWith(s.href));
  return match ?? { code: "A-404", href: pathname, title: "Not found", description: "" };
}

// PLACEHOLDER
export const lab: LabItem[] = [
  { slug: "dither", title: "Noise dither", description: "Gradients printed as dots, rendered with an SVG filter chain.", date: "2026", specimen: "dither", links: { code: "#" } },
  { slug: "magnet", title: "Magnetic field", description: "A grid of points that leans toward your cursor.", date: "2026", specimen: "magnet", links: { demo: "#" } },
  { slug: "latency", title: "Latency, felt", description: "The same button at 0, 100, 300 and 1000ms. Try them.", date: "2025", specimen: "latency", links: { demo: "#" } },
  { slug: "type", title: "Variable specimen", description: "Weight follows your pointer across one variable font axis.", date: "2025", specimen: "type", links: { demo: "#" } },
  { slug: "spring", title: "Spring sketches", description: "Studies in stiffness and damping for interface motion.", date: "2024", specimen: "spring", links: { code: "#" } },
  { slug: "ascii", title: "ASCII weather", description: "Today's forecast for Ahmedabad, drawn in characters.", date: "2024", specimen: "ascii", links: { demo: "#" } },
];

// PLACEHOLDER
export const versions: Version[] = [
  {
    rev: "v3",
    year: "2026",
    title: "The drawing set",
    stack: ["Next.js", "GSAP", "Lenis", "TypeScript"],
    concept: "Every page is a sheet in an architectural drawing set; the monogram is built, not drawn.",
    learned: "Constraints make a visual language. One easing curve, two colours, one grid.",
    current: true,
  },
  {
    rev: "v2",
    year: "2022",
    title: "Dark & kinetic",
    stack: ["Gatsby", "Three.js", "Styled Components"],
    concept: "A WebGL particle field and a lot of scroll-jacking.",
    learned: "Spectacle ages fast. Recruiters left before the intro finished.",
    url: "#",
  },
  {
    rev: "v1",
    year: "2019",
    title: "Hello, world",
    stack: ["HTML", "CSS", "jQuery"],
    concept: "A single page, a photo, and a list of every technology I had ever touched.",
    learned: "A list of skills says less than one project explained well.",
    url: "#",
  },
];
