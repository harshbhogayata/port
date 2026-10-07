import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TLink from "@/components/chrome/TLink";
import ReadingProgress from "@/components/pages/ReadingProgress";
import CaseToc from "@/components/pages/CaseToc";
import { SplitReveal, Reveal } from "@/components/motion/Motion";
import { articles, getArticle, formatDate } from "@/content/writing";
import { profile } from "@/content/profile";

type Params = { slug: string };

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return { title: a.title, description: a.excerpt, openGraph: { type: "article", publishedTime: a.date } };
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const i = articles.indexOf(a);
  const next = articles[(i + 1) % articles.length];
  const headings = a.body.filter((b) => b.type === "h2").map((b) => ({ id: slugify(b.text), label: b.text }));
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    datePublished: a.date,
    author: { "@type": "Person", name: profile.name },
  };

  return (
    <article className="article">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ReadingProgress />
      <header className="wrap article__head">
        <Reveal className="ph__meta mono" y={10}>
          <span>
            <TLink href="/writing" className="blue u-line">
              ← Writing
            </TLink>
            <span className="mute"> · {a.tags.join(" · ")}</span>
          </span>
          <span className="mute">
            {formatDate(a.date, { day: "numeric", month: "long", year: "numeric" })} · {a.readingTime}
          </span>
        </Reveal>
        <SplitReveal as="h1" className="article__title" trigger="enter">
          {a.title}
        </SplitReveal>
        <Reveal as="p" className="lead article__excerpt" delay={0.3}>
          {a.excerpt}
        </Reveal>
      </header>

      <div className="wrap case__body article__layout">
        <aside className="case__aside">{headings.length ? <CaseToc items={headings} /> : null}</aside>
        <div className="article__body">
          {a.body.map((b, k) => {
            switch (b.type) {
              case "h2":
                return (
                  <h2 key={k} id={slugify(b.text)}>
                    {b.text}
                  </h2>
                );
              case "quote":
                return (
                  <blockquote key={k}>
                    <p>{b.text}</p>
                  </blockquote>
                );
              case "code":
                return (
                  <figure key={k} className="code">
                    <figcaption className="mono mute">{b.lang}</figcaption>
                    <pre>
                      <code>{b.text}</code>
                    </pre>
                  </figure>
                );
              case "list":
                return (
                  <ul key={k}>
                    {b.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                );
              default:
                return <p key={k}>{b.text}</p>;
            }
          })}
          <p className="article__sign mono mute">
            {profile.name} · {formatDate(a.date, { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {next.slug !== a.slug ? (
        <TLink href={`/writing/${next.slug}`} className="case__next" cursor="Read next">
          <span className="wrap case__next-inner">
            <span className="mono">Read next · {next.readingTime}</span>
            <span className="case__next-title case__next-title--sm">{next.title}</span>
          </span>
        </TLink>
      ) : null}
    </article>
  );
}
