import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";

type Sheet = { code: string; title: string };

const rev = process.env.NEXT_PUBLIC_REV ?? "1";
const sha = process.env.NEXT_PUBLIC_SHA ?? "dev";
const built = process.env.NEXT_PUBLIC_BUILT ?? new Date().toISOString();

export function buildDate() {
  return new Date(built).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}

export default function TitleBlock({ sheet, compact = false }: { sheet: Sheet; compact?: boolean }) {
  const cells = [
    { k: "Drawn by", v: profile.name },
    { k: "Project", v: "Portfolio, v3" },
    { k: "Sheet", v: `${sheet.code} · ${sheet.title}` },
    { k: "Revision", v: `Rev ${rev} · ${sha}` },
    { k: "Date", v: buildDate() },
    { k: "Scale", v: "1:1" },
  ];
  return (
    <dl className={cn("tb", compact && "tb--compact")}>
      {cells.map((c) => (
        <div key={c.k} className="tb__cell">
          <dt className="mono mute">{c.k}</dt>
          <dd suppressHydrationWarning>{c.v}</dd>
        </div>
      ))}
    </dl>
  );
}
