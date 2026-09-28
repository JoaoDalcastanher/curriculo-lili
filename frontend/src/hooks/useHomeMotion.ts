import { useEffect } from "react";

import { HomeMotion } from "@/animation/HomeMotion";
import { prefersReducedMotion, revealEverything } from "@/animation/motionFlags";

/** Starts the page choreography once, after hydration. */
export function useHomeMotion(): void {
  useEffect(() => {
    if (prefersReducedMotion()) {
      revealEverything();
      return;
    }
    const motion = new HomeMotion();
    try {
      motion.start();
    } catch (error) {
      console.error("Falha ao iniciar animações", error);
      revealEverything();
    }
    const onResize = () => motion.measure();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      motion.destroy();
    };
  }, []);
}
