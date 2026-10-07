import type { Education, Experience, Recognition, Testimonial } from "./types";

// PLACEHOLDER — companies, dates and quotes are stand-ins.

export const experience: Experience[] = [
  {
    company: "Curator",
    role: "Founder & Engineer",
    start: "2025",
    end: "Now",
    location: "Remote",
    summary: "Designing and building a calmer reading library for web and mobile.",
    achievements: [
      "Took the product from prototype to launch build as the sole engineer",
      "Designed an optimistic sync model shared across three platforms",
      "Runs a private beta with weekly releases",
    ],
  },
  {
    company: "Northwind Labs",
    role: "Software Development Engineer II",
    start: "2023",
    end: "2025",
    location: "Bengaluru",
    summary: "Led realtime infrastructure for a collaborative planning product.",
    achievements: [
      "Rebuilt a realtime sync engine and cut its latency by an order of magnitude",
      "Led a zero-downtime migration for 3,000 active teams",
      "Introduced incident reviews and on-call runbooks",
    ],
  },
  {
    company: "Fieldstone Systems",
    role: "Software Development Engineer",
    start: "2021",
    end: "2023",
    location: "Ahmedabad",
    summary: "Built an offline-first payments app for small merchants, then led its mobile team.",
    achievements: [
      "Designed the local-first data model and the sync queue",
      "Grew the app to 40,000 daily merchants",
      "Grew from individual contributor to mobile lead",
    ],
  },
  {
    company: "Orbital Studio",
    role: "Software Engineering Intern",
    start: "2020",
    end: "2021",
    location: "Remote",
    summary: "Shipped client web apps and an internal component library.",
    achievements: ["Shipped three client products", "Started the studio's first shared component library"],
  },
];

export const education: Education[] = [
  {
    institution: "University Name",
    degree: "B.Tech, Computer Science & Engineering",
    start: "2017",
    end: "2021",
    location: "Gujarat, India",
    notes: ["Thesis: latency-aware conflict resolution for collaborative editing", "Graduated with distinction"],
  },
];

export const recognition: Recognition[] = [
  { year: "2025", kind: "Talk", title: "Speaker, React India", detail: "Designing interfaces that tell the truth about latency" },
  { year: "2024", kind: "Award", title: "Engineering Excellence Award", detail: "Northwind Labs, for the realtime sync rewrite" },
  { year: "2022", kind: "Feature", title: "Awwwards Honorable Mention", detail: "Portfolio v2" },
  { year: "2019", kind: "Award", title: "Winner, national hackathon", detail: "Offline-first health records for rural clinics" },
];

export const testimonials: Testimonial[] = [
  {
    quote: "Harsh has the rare ability to care about a pixel and a packet in the same afternoon. His work changed how our customers talk about the product.",
    name: "Ananya Rao",
    role: "Engineering Manager",
    company: "Northwind Labs",
  },
  {
    quote: "He went and sat with the people who would use it before writing a line of code. That week is why the product works.",
    name: "Daniel Okafor",
    role: "Head of Product",
    company: "Fieldstone Systems",
  },
  {
    quote: "Calm in incidents, generous in reviews, and allergic to unnecessary complexity. I'd work with him again tomorrow.",
    name: "Meera Shah",
    role: "Staff Engineer",
    company: "Northwind Labs",
  },
];

export const stackLayers = [
  { name: "Interface", note: "How it feels", tools: [
    { name: "Figma", projects: ["curator", "kalakari"] },
    { name: "Motion design", projects: ["curator"] },
    { name: "Accessibility", projects: ["flood-archive"] },
    { name: "Design systems", projects: ["portfolio"] },
  ] },
  { name: "Client", note: "How it runs on your device", tools: [
    { name: "TypeScript", projects: ["curator", "talentorbit", "kalakari"] },
    { name: "React", projects: ["talentorbit", "curator"] },
    { name: "Next.js", projects: ["curator", "flood-archive"] },
    { name: "React Native", projects: ["curator", "kalakari"] },
  ] },
  { name: "API", note: "How the pieces talk", tools: [
    { name: "Node.js", projects: ["talentorbit"] },
    { name: "GraphQL", projects: [] },
    { name: "REST", projects: ["kalakari"] },
    { name: "WebSockets", projects: ["talentorbit"] },
  ] },
  { name: "Services", note: "Where the work happens", tools: [
    { name: "Go", projects: [] },
    { name: "Python", projects: ["flood-archive"] },
    { name: "Queues & streams", projects: ["curator"] },
    { name: "gRPC", projects: [] },
  ] },
  { name: "Data", note: "What has to be right", tools: [
    { name: "PostgreSQL", projects: ["curator", "talentorbit", "kalakari"] },
    { name: "Redis", projects: ["curator"] },
    { name: "PostGIS", projects: ["flood-archive"] },
    { name: "Elasticsearch", projects: ["talentorbit"] },
  ] },
  { name: "Infra", note: "Where it lives", tools: [
    { name: "AWS", projects: ["talentorbit"] },
    { name: "Kubernetes", projects: [] },
    { name: "Cloudflare", projects: ["curator"] },
    { name: "Docker", projects: [] },
  ] },
  { name: "Tooling", note: "How it stays healthy", tools: [
    { name: "OpenTelemetry", projects: [] },
    { name: "Playwright", projects: ["portfolio"] },
    { name: "GitHub Actions", projects: [] },
    { name: "Vitest", projects: [] },
  ] },
]; // PLACEHOLDER

export const repos = [
  { name: "signal", description: "OpenTelemetry traces as readable terminal timelines.", language: "Go", stars: "1.1k" },
  { name: "paperplane", description: "Email templates as typed React components.", language: "TypeScript", stars: "640" },
  { name: "dither-kit", description: "Ordered and noise dithering for the web, in one shader.", language: "GLSL", stars: "210" },
  { name: "hlc-ts", description: "Hybrid logical clocks for offline-first apps.", language: "TypeScript", stars: "180" },
]; // PLACEHOLDER

export const githubStats = { contributions: "1,284", repos: "42", stars: "2.3k", prsMerged: "96" }; // PLACEHOLDER
