import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";
import { sheets } from "@/content/site";
import { projects } from "@/content/projects";
import { articles } from "@/content/writing";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.site;
  return [
    ...sheets.map((s) => ({ url: `${base}${s.href === "/" ? "" : s.href}`, changeFrequency: "monthly" as const })),
    { url: `${base}/uses` },
    ...projects.filter((p) => !p.href).map((p) => ({ url: `${base}/work/${p.slug}` })),
    ...articles.map((a) => ({ url: `${base}/writing/${a.slug}`, lastModified: a.date })),
  ];
}
