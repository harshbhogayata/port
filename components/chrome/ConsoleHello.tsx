"use client";

import { useEffect } from "react";
import { profile } from "@/content/profile";

let said = false;

/** For the people who open DevTools first. */
export default function ConsoleHello() {
  useEffect(() => {
    if (said) return;
    said = true;
    console.log(
      "%c HB %c Hello, fellow inspector.\n\nThis site is a drawing set: press S for spec mode, ⌘K for the command palette, T to switch Paper/Blueprint.\nIf you're reading this, we should probably talk: " +
        profile.email,
      "background:#1638ff;color:#fff;font:700 14px/2 monospace;padding:2px 6px",
      "color:inherit;font:12px/1.6 monospace",
    );
  }, []);
  return null;
}
