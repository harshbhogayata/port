"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Toast() {
  const [msg, setMsg] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let t: number;
    const on = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      setShow(true);
      window.clearTimeout(t);
      t = window.setTimeout(() => setShow(false), 2200);
    };
    window.addEventListener("hb:toast", on);
    return () => {
      window.removeEventListener("hb:toast", on);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div className={cn("toast", show && "is-shown")} role="status" aria-live="polite">
      <span className="toast__sq" aria-hidden="true" />
      <span className="mono">{msg}</span>
    </div>
  );
}
