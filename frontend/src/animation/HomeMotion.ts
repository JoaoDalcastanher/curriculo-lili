// Page-level choreography ported from the Claude Design handoff: hero entrance,
// living blob, floating shapes, parallax, scroll reveals and the timeline line.
// DOM hooks are data attributes rendered by the home components.

import { animate, inView, scroll, stagger } from "motion";

import { easing } from "@/theme/theme";

import { MOTION_CLASS } from "./motionFlags";

type ParallaxLayer = {
  element: HTMLElement;
  speed: number;
  center: number;
};

const BLOB_SHAPES = [
  "42% 58% 63% 37% / 45% 40% 60% 55%",
  "58% 42% 38% 62% / 55% 62% 38% 45%",
  "48% 52% 55% 45% / 38% 52% 48% 62%",
  "42% 58% 63% 37% / 45% 40% 60% 55%",
];

function all<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

function setCounter(element: HTMLElement, value: number): void {
  element.textContent = String(Math.round(value));
}

export class HomeMotion {
  private stops: VoidFunction[] = [];
  private layers: ParallaxLayer[] = [];

  start(): void {
    this.hero();
    this.blob();
    this.floats();
    this.parallax();
    this.reveals();
    this.timeline();
  }

  /** Re-measure parallax anchors after a resize. */
  measure(): void {
    this.layers.forEach((layer) => {
      layer.element.style.transform = "none";
      const rect = layer.element.getBoundingClientRect();
      layer.center = rect.top + window.scrollY + rect.height / 2;
    });
    this.applyParallax();
  }

  destroy(): void {
    this.stops.forEach((stop) => stop());
    this.stops = [];
  }

  private hero(): void {
    const letters = all("[data-letter]");
    const letterDelay = stagger(0.055, { startDelay: 0.15 });
    animate(letters, { opacity: [0, 1] }, { duration: 0.35, delay: letterDelay });
    animate(
      letters,
      { y: [70, 0], rotate: [10, 0] },
      { type: "spring", stiffness: 240, damping: 17, delay: letterDelay },
    );
    all<SVGPathElement>("[data-underline]").forEach((path) => {
      animate(
        path,
        { strokeDashoffset: [1, 0] },
        { duration: 1, delay: 0.75, ease: [...easing.out] },
      );
    });
    animate(
      all("[data-hero]"),
      { opacity: [0, 1], y: [18, 0] },
      { duration: 0.8, ease: [...easing.out], delay: stagger(0.07, { startDelay: 0.4 }) },
    );
    all("[data-hero-photo]").forEach((photo) => {
      animate(photo, { opacity: [0, 1] }, { duration: 0.6, delay: 0.3 });
      animate(
        photo,
        { scale: [0.9, 1], rotate: [-3, 0] },
        { type: "spring", stiffness: 110, damping: 18, delay: 0.3 },
      );
    });
    all("[data-count]").forEach((element) => {
      const target = Number(element.dataset.count);
      setCounter(element, 0);
      animate(0, target, {
        duration: 1.8,
        delay: 1,
        ease: [...easing.count],
        onUpdate: (value) => setCounter(element, value),
      });
    });
    // The entrance owns visibility from here on.
    document.documentElement.classList.remove(MOTION_CLASS);
  }

  private blob(): void {
    all("[data-blob]").forEach((blob) => {
      animate(
        blob,
        { borderRadius: BLOB_SHAPES },
        { duration: 16, repeat: Infinity, ease: "easeInOut" },
      );
      animate(
        blob,
        { rotate: [0, 6, -4, 0] },
        { duration: 22, repeat: Infinity, ease: "easeInOut" },
      );
    });
  }

  private floats(): void {
    all("[data-float]").forEach((element, index) => {
      const tilt = index % 2 === 0 ? -9 : 9;
      animate(
        element,
        { y: [0, -14, 0], rotate: [0, tilt, 0] },
        {
          duration: 7 + (index % 4) * 1.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.4,
        },
      );
    });
  }

  private parallax(): void {
    this.layers = all("[data-parallax]").map((element) => ({
      element,
      speed: Number(element.dataset.parallax),
      center: 0,
    }));
    this.measure();
    this.stops.push(scroll(() => this.applyParallax()));
  }

  private applyParallax(): void {
    const middle = window.scrollY + window.innerHeight / 2;
    this.layers.forEach((layer) => {
      const offset = ((layer.center - middle) * layer.speed).toFixed(1);
      layer.element.style.transform = `translate3d(0,${offset}px,0)`;
    });
  }

  private reveals(): void {
    const fold = window.innerHeight * 0.9;
    all("[data-reveal]").forEach((element) => {
      if (element.getBoundingClientRect().top < fold) {
        return;
      }
      element.style.opacity = "0";
      this.stops.push(
        inView(
          element,
          () => {
            animate(
              element,
              { opacity: [0, 1], y: [32, 0] },
              { duration: 0.9, ease: [...easing.out] },
            );
          },
          { amount: 0.15 },
        ),
      );
    });
    all("[data-stagger]").forEach((container) => {
      if (container.getBoundingClientRect().top < fold) {
        return;
      }
      const children = Array.from(container.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement,
      );
      children.forEach((child) => {
        child.style.opacity = "0";
      });
      this.stops.push(
        inView(
          container,
          () => {
            animate(
              children,
              { opacity: [0, 1], y: [40, 0] },
              { duration: 0.85, ease: [...easing.out], delay: stagger(0.09) },
            );
          },
          { amount: 0.08 },
        ),
      );
    });
  }

  private timeline(): void {
    const timeline = document.querySelector<HTMLElement>("[data-timeline]");
    const line = timeline?.querySelector<HTMLElement>("[data-tl-line]");
    if (timeline === null || timeline === undefined || line === null || line === undefined) {
      return;
    }
    line.style.transform = "scaleY(0)";
    this.stops.push(
      scroll(
        (progress: number) => {
          line.style.transform = `scaleY(${progress.toFixed(4)})`;
        },
        { target: timeline, offset: ["start 75%", "end 55%"] },
      ),
    );
    const fold = window.innerHeight * 0.85;
    all("[data-tl-item]", timeline).forEach((item) => {
      if (item.getBoundingClientRect().top < fold) {
        return;
      }
      item.style.opacity = "0";
      this.stops.push(
        inView(
          item,
          () => {
            animate(
              item,
              { opacity: [0, 1], x: [-18, 0] },
              { duration: 0.8, ease: [...easing.out] },
            );
          },
          { amount: 0.3 },
        ),
      );
    });
  }
}
