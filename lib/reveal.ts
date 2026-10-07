"use client";

/**
 * Tiny gate shared by the preloader and page transitions.
 * Entry animations wait until the page is actually uncovered.
 */
let revealed = false;
const listeners = new Set<() => void>();

export function markCovered() {
  revealed = false;
}

export function markRevealed() {
  revealed = true;
  const pending = [...listeners];
  listeners.clear();
  pending.forEach((fn) => fn());
}

export function whenRevealed(fn: () => void) {
  if (revealed) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
