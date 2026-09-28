// The <html> class that hides animated elements until Motion takes over.
// Added by an inline script before first paint (see routes/__root.tsx) so the
// prerendered HTML never flashes the final state before the entrance plays.
// Without JS, or with prefers-reduced-motion, the class is never added and
// everything is simply visible.

export const MOTION_CLASS = "js-motion";

export const MOTION_BOOT_SCRIPT = `(function(){try{if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("${MOTION_CLASS}")}}catch(e){}})();`;

/** Initial hidden state for elements the entrance animation reveals. */
export const motionHiddenStyles = {
  [`html.${MOTION_CLASS} [data-hero], html.${MOTION_CLASS} [data-letter], html.${MOTION_CLASS} [data-hero-photo]`]:
    { opacity: 0 },
  [`html.${MOTION_CLASS} [data-underline]`]: { strokeDashoffset: 1 },
} as const;

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Stops the entrance from being hidden (used when Motion is off or fails). */
export function revealEverything(): void {
  document.documentElement.classList.remove(MOTION_CLASS);
}
