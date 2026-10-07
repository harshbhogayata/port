"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

function format(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: profile.timezone,
  }).format(date);
}

/** Minutes between the visitor's clock and mine (positive = I'm ahead). */
export function offsetFromVisitor() {
  const now = new Date();
  const mine = new Date(now.toLocaleString("en-US", { timeZone: profile.timezone }));
  const theirs = new Date(now.toLocaleString("en-US"));
  return Math.round((mine.getTime() - theirs.getTime()) / 60000);
}

export function describeOffset(mins: number) {
  if (Math.abs(mins) < 1) return "Same time as you";
  const h = Math.floor(Math.abs(mins) / 60);
  const m = Math.abs(mins) % 60;
  const span = `${h ? `${h}h` : ""}${h && m ? " " : ""}${m ? `${m}m` : ""}`;
  return `${span} ${mins > 0 ? "ahead of" : "behind"} you`;
}

export default function Clock({ withOffset = false }: { withOffset?: boolean }) {
  const [time, setTime] = useState<string | null>(null);
  const [offset, setOffset] = useState<string>("");

  useEffect(() => {
    const tick = () => setTime(format(new Date()));
    tick();
    setOffset(describeOffset(offsetFromVisitor()));
    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, []);

  const [hh, mm] = (time ?? "--:--").split(":");
  return (
    <span className="clock" suppressHydrationWarning>
      <span className="clock__time">
        {hh}
        <span className="clock__colon">:</span>
        {mm} {profile.tzLabel}
      </span>
      {withOffset && offset ? <span className="clock__offset"> · {offset}</span> : null}
    </span>
  );
}
