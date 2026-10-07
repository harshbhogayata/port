export type Theme = "light" | "dark";
export type ThemePref = Theme | "auto";

const KEY = "hb:theme";

/** The site keeps my hours: paper by day in India, blueprint after dark. */
export function autoTheme(): Theme {
  const h = parseInt(
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()),
    10,
  );
  return h >= 7 && h < 19 ? "light" : "dark";
}

export function getPref(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "auto";
  } catch {
    return "auto";
  }
}

export function applyPref(pref: ThemePref) {
  try {
    if (pref === "auto") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch {}
  const theme = pref === "auto" ? autoTheme() : pref;
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new CustomEvent("hb:theme", { detail: { pref, theme } }));
}

export function toggleTheme() {
  const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  applyPref(current === "dark" ? "light" : "dark");
}

/** Runs before paint (inlined in <head>) to avoid a theme flash and skip the preloader on repeat visits. */
export const bootScript = `(function(){try{var d=document.documentElement;var t=null;try{t=localStorage.getItem('${KEY}')}catch(e){}if(t!=='light'&&t!=='dark'){var h=parseInt(new Intl.DateTimeFormat('en-GB',{hour:'2-digit',hour12:false,timeZone:'Asia/Kolkata'}).format(new Date()),10);t=(h>=7&&h<19)?'light':'dark'}d.dataset.theme=t;try{if(sessionStorage.getItem('hb:visited'))d.dataset.visited='1'}catch(e){}if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)d.dataset.visited='1'}catch(e){}})();`;
