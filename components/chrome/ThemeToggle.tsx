"use client";

import { useEffect, useState } from "react";
import { toggleTheme, type Theme } from "@/lib/theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const read = () => setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    read();
    window.addEventListener("hb:theme", read);
    return () => window.removeEventListener("hb:theme", read);
  }, []);
  return theme;
}

export default function ThemeToggle({ withLabel = false }: { withLabel?: boolean }) {
  const theme = useTheme();
  const next = theme === "dark" ? "Paper" : "Blueprint";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} mode`}
      data-cursor={next}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" className="theme-toggle__half" />
      </svg>
      {withLabel ? <span className="mono">{theme === "dark" ? "Blueprint" : "Paper"} mode</span> : null}
    </button>
  );
}
