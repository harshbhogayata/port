// ─────────────────────────────────────────────────────────────
// PLACEHOLDER CONTENT — every value here is safe to replace.
// Search for "PLACEHOLDER" across /content to find what's left.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Harsh Bhogayata",
  first: "Harsh",
  last: "Bhogayata",
  role: "Software Development Engineer",
  positioning: "I build web and mobile products, from the first interaction to the systems behind it.",
  location: "India",
  city: "Ahmedabad", // PLACEHOLDER
  timezone: "Asia/Kolkata",
  tzLabel: "IST",
  email: "work.harsh.bhogayata@gmail.com",
  replyTime: "I usually reply within a day.",
  availability: {
    open: true,
    label: "Open to select roles & collaborations", // PLACEHOLDER
    short: "Available",
  },
  pronunciation: {
    phonetic: "HURSH · bhoh-guh-YAA-tuh", // PLACEHOLDER — confirm
    ipa: "/ɦəɾʃ bʱoːɡəˈjaːʈaː/", // PLACEHOLDER — confirm
    audio: null as string | null, // drop a recording at /public/audio/name.mp3 and set "/audio/name.mp3"
    meaning: "Harsh comes from the Sanskrit harṣa — joy, delight.",
  },
  currently: {
    project: "Curator",
    status: "Preparing for launch",
    href: "/work/curator",
  },
  intro:
    "I'm Harsh, a software engineer who works across the whole surface of a product: the feel of a button, the shape of an API, the queue that sits behind it. I care about software that is fast, legible and hard to break, and I like being in the room from the first sketch to the last deploy.",
  socials: [
    { label: "GitHub", handle: "@harshbhogayata", href: "https://github.com/harshbhogayata" },
    { label: "LinkedIn", handle: "in/harshbhogayata", href: "https://www.linkedin.com/in/harshbhogayata" }, // PLACEHOLDER
    { label: "X", handle: "@harshbhogayata", href: "https://x.com/harshbhogayata" }, // PLACEHOLDER
    { label: "Email", handle: "work.harsh.bhogayata@gmail.com", href: "mailto:work.harsh.bhogayata@gmail.com" },
  ],
  resumePdf: "/resume.pdf", // PLACEHOLDER — add the file to /public
  site: "https://harshbhogayata.com", // PLACEHOLDER
};

export const principles = [
  {
    title: "Interfaces are promises.",
    body: "Every interaction promises what happens next. I design the system behind it to keep that promise under load, offline, and at 3am.",
    proof: { label: "Kalakari: listings that survive bad networks", href: "/work/kalakari" },
  },
  {
    title: "Performance is a feature.",
    body: "Speed is felt before it is measured. I treat latency budgets like design specs: written down, owned and reviewed.",
    proof: { label: "Curator: saving that never waits", href: "/work/curator" },
  },
  {
    title: "Boring infrastructure, interesting products.",
    body: "I spend novelty where users can feel it, and pick proven tools everywhere else. Fewer surprises, more shipping.",
    proof: { label: "Flood Archive: PostGIS and a static fallback", href: "/work/flood-archive" },
  },
  {
    title: "Ship, measure, then believe.",
    body: "Opinions are hypotheses until production says otherwise. Small releases, honest dashboards, quick reversals.",
    proof: { label: "TalentOrbit: scores you can argue with", href: "/work/talentorbit" },
  },
];

export const now = {
  updated: "October 2026", // PLACEHOLDER
  building: ["Curator: the launch build and the reading library", "This portfolio, v3"],
  learning: ["Rust for systems work", "Motion design for product interfaces"],
  reading: ["Designing Data-Intensive Applications (re-read)", "The Design of Everyday Things"],
  listening: ["Nils Frahm — All Melody"],
  location: "Ahmedabad, India",
};

export const uses = [
  { group: "Hardware", items: ["MacBook Pro 14\" M3", "LG 27\" 4K", "Keychron Q1", "iPhone + Pixel for testing"] },
  { group: "Editor & terminal", items: ["VS Code / Zed", "Ghostty + zsh", "JetBrains Mono"] },
  { group: "Design", items: ["Figma", "Rive", "Excalidraw for system sketches"] },
  { group: "Daily tools", items: ["Linear", "Raycast", "Arc", "Notion"] },
]; // PLACEHOLDER

export const interests = [
  "Long walks with no headphones",
  "Typography and old printing",
  "Cricket, mostly watching",
  "Cooking for too many people",
]; // PLACEHOLDER

export const milestones = [
  { year: "2014", title: "First program", body: "A calculator in QBasic that could not divide by zero, or by most other numbers." },
  { year: "2017", title: "Computer science", body: "Started a CS degree; spent more time building side projects than attending labs." },
  { year: "2020", title: "First shipped product", body: "An internship turned into a real app with real users and real bug reports." },
  { year: "2022", title: "First production incident", body: "Learned that systems fail at boundaries, and that calm runbooks beat clever code." },
  { year: "2025", title: "Started Curator", body: "Began building the product I wanted to use every day." },
]; // PLACEHOLDER
