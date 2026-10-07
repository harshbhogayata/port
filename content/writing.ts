import type { Article, Paper } from "./types";

// PLACEHOLDER — titles, dates and bodies are stand-ins.

export const articles: Article[] = [
  {
    slug: "the-92ms-rewrite",
    kind: "Article",
    title: "The 92ms rewrite: taking sync off the hot path",
    date: "2025-11-04",
    readingTime: "9 min",
    tags: ["Systems", "Performance"],
    excerpt: "What we learned moving a realtime engine from transactional broadcast to an ordered stream, without anyone noticing the migration.",
    body: [
      { type: "p", text: "For two years, every keystroke in our planning tool waited for a database transaction before anyone else could see it. It worked, until it didn't." },
      { type: "h2", text: "Find where the time actually goes" },
      { type: "p", text: "We traced ten thousand real edits end to end. The database wasn't slow; it was simply in the wrong place. Broadcast waited on durability, and durability waited on locks." },
      { type: "quote", text: "Ordering is what correctness needed. Durability could follow a few milliseconds later." },
      { type: "h2", text: "Order first, persist second" },
      { type: "p", text: "We moved broadcast onto a per-document ordered stream and made persistence asynchronous, with snapshots and an operation log for recovery." },
      { type: "code", lang: "go", text: "func (d *Doc) Apply(op Op) error {\n  seq := d.stream.Append(op) // ordered, fast\n  d.broadcast(seq, op)        // peers see it now\n  d.persist.Enqueue(seq, op)  // durable a few ms later\n  return nil\n}" },
      { type: "h2", text: "What I'd do differently" },
      { type: "list", items: ["Profile the client from day one", "Shadow traffic earlier", "Write the rollback plan before the rollout plan"] },
      { type: "p", text: "The rewrite took seven months. The migration took one evening, and nobody noticed. That was the point." },
    ],
  },
  {
    slug: "interfaces-that-tell-the-truth",
    kind: "Article",
    title: "Designing interfaces that tell the truth about latency",
    date: "2025-06-18",
    readingTime: "7 min",
    tags: ["Interaction", "Frontend"],
    excerpt: "Optimistic UI is a promise. Here's how to make one you can keep, and how to apologise gracefully when you can't.",
    body: [
      { type: "p", text: "An optimistic interface tells the user something has happened before it has. That's a promise, and promises need a plan for when they break." },
      { type: "h2", text: "Three honest states" },
      { type: "list", items: ["Done: confirmed by the server", "Pending: shown, but quietly marked", "Failed: reverted, with a reason and a retry"] },
      { type: "p", text: "Most bugs live in the transition from pending to failed. Design that moment first." },
    ],
  },
  {
    slug: "offline-first-is-a-product-decision",
    kind: "Article",
    title: "Offline-first is a product decision, not a technical one",
    date: "2024-09-02",
    readingTime: "6 min",
    tags: ["Mobile", "Product"],
    excerpt: "A week in twelve shops taught me more about sync than any paper did.",
    body: [
      { type: "p", text: "We stopped treating offline as an error state and started treating it as the normal case. Everything else followed from that one decision." },
    ],
  },
  {
    slug: "a-case-for-boring-infrastructure",
    kind: "Article",
    title: "A case for boring infrastructure",
    date: "2024-02-12",
    readingTime: "5 min",
    tags: ["Engineering"],
    excerpt: "Spend your novelty budget where users can feel it.",
    body: [{ type: "p", text: "Every team has a novelty budget. Spend it on the product, and buy the infrastructure off the shelf." }],
  },
];

export const papers: Paper[] = [
  {
    slug: "latency-aware-conflict-resolution",
    kind: "Paper",
    title: "Latency-Aware Conflict Resolution for Collaborative Editing on Mobile Networks",
    authors: ["H. Bhogayata", "A. Co-Author", "B. Advisor"],
    venue: "Workshop on Mobile Systems (placeholder)",
    date: "2021-05-01",
    abstract:
      "Collaborative editors assume stable, low-latency links. We study conflict rates under real mobile network traces and propose a latency-aware merge policy that reduces user-visible conflicts by 41% without additional round trips.",
    pdf: "#",
    doi: "10.0000/placeholder.2021.001",
    bibtex:
      "@inproceedings{bhogayata2021latency,\n  title={Latency-Aware Conflict Resolution for Collaborative Editing on Mobile Networks},\n  author={Bhogayata, Harsh and Co-Author, A. and Advisor, B.},\n  booktitle={Workshop on Mobile Systems},\n  year={2021}\n}",
  },
  {
    slug: "perceived-performance-mobile-commerce",
    kind: "Paper",
    title: "Measuring Perceived Performance in Mobile Commerce Interfaces",
    authors: ["H. Bhogayata", "C. Co-Author"],
    venue: "Student Research Symposium (placeholder)",
    date: "2020-11-01",
    abstract:
      "We compare objective load metrics with user-reported speed across 1,200 sessions and find that skeleton states and stable layouts predict perceived speed better than raw load time.",
    pdf: "#",
    bibtex:
      "@inproceedings{bhogayata2020perceived,\n  title={Measuring Perceived Performance in Mobile Commerce Interfaces},\n  author={Bhogayata, Harsh and Co-Author, C.},\n  year={2020}\n}",
  },
];

export const allWriting = [...articles, ...papers].sort((a, b) => (a.date < b.date ? 1 : -1));
export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" }) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });
}
