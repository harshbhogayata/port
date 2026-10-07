export type Stage = "Design" | "Build" | "Ship";

export type Metric = { value: string; label: string };

export type Decision = {
  title: string;
  options: string[];
  choice: string;
  why: string;
};

export type Project = {
  slug: string;
  title: string;
  /** Two- or three-word descriptor, e.g. "Hiring platform". */
  short: string;
  /** A short line used in the footer, e.g. "read with more care". */
  note: string;
  tagline: string;
  outcome: string;
  year: string;
  duration: string;
  role: string;
  team: string;
  type: ("Web" | "Mobile" | "Systems" | "Product" | "Open source")[];
  stack: string[];
  featured: boolean;
  /** Overrides the default /work/[slug] destination. */
  href?: string;
  status?: string;
  links: { live?: string; repo?: string };
  /** Layers drawn in the exploded architecture art, top → bottom. */
  layers: { name: string; detail: string }[];
  /** Index of the layer where the key decision lives (drawn in solid blue). */
  keyLayer: number;
  metrics: Metric[];
  backstory: string[];
  problem: string;
  constraints: string[];
  myRole: string[];
  process: { stage: Stage; text: string }[];
  decisions: Decision[];
  hardPart: { title: string; body: string[] };
  reflection: string;
};

export type Experience = {
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
  summary: string;
  achievements: string[];
};

export type Education = {
  institution: string;
  degree: string;
  start: string;
  end: string;
  location: string;
  notes: string[];
};

export type Article = {
  slug: string;
  kind: "Article";
  title: string;
  date: string;
  readingTime: string;
  tags: string[];
  excerpt: string;
  body: ArticleBlock[];
};

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "code"; lang: string; text: string }
  | { type: "list"; items: string[] };

export type Paper = {
  slug: string;
  kind: "Paper";
  title: string;
  authors: string[];
  venue: string;
  date: string;
  abstract: string;
  pdf?: string;
  doi?: string;
  bibtex: string;
};

export type Testimonial = { quote: string; name: string; role: string; company: string };

export type LabItem = {
  slug: string;
  title: string;
  description: string;
  date: string;
  specimen: "dither" | "magnet" | "latency" | "type" | "spring" | "ascii";
  links: { demo?: string; code?: string };
};

export type Version = {
  rev: string;
  year: string;
  title: string;
  stack: string[];
  concept: string;
  learned: string;
  url?: string;
  current?: boolean;
};

export type Recognition = { year: string; title: string; detail: string; kind: string };
