// Project grid filtering (FLIP) and the card → dialog shared-element morph,
// ported from the Claude Design handoff. Every method degrades to an instant
// change when motion is reduced.

import { animate, stagger } from "motion";

import { easing } from "@/theme/theme";

type MorphGeometry = {
  x: number;
  y: number;
  scale: number;
  from: string;
  to: string;
};

type DialogParts = {
  panel: HTMLElement;
  backdrop: HTMLElement;
  fades: HTMLElement[];
};

const CARD_RADIUS = 16;

export class ProjectMotion {
  constructor(private readonly reduced: boolean) {}

  /** Shows only cards whose `matches` is true, animating the transition. */
  async filter(cards: HTMLElement[], matches: (card: HTMLElement) => boolean): Promise<void> {
    const visible = (card: HTMLElement) => card.style.display !== "none";
    if (this.reduced) {
      cards.forEach((card) => {
        card.style.display = matches(card) ? "" : "none";
      });
      return;
    }
    const leaving = cards.filter((card) => visible(card) && !matches(card));
    const entering = cards.filter((card) => !visible(card) && matches(card));
    const staying = cards.filter((card) => visible(card) && matches(card));

    if (leaving.length > 0) {
      await animate(leaving, { opacity: 0, scale: 0.92 }, { duration: 0.2, ease: "easeIn" });
    }
    const before = new Map(staying.map((card) => [card, card.getBoundingClientRect()]));
    leaving.forEach((card) => {
      card.style.display = "none";
    });
    entering.forEach((card) => {
      card.style.display = "";
      card.style.opacity = "0";
    });
    staying.forEach((card) => {
      const first = before.get(card);
      const last = card.getBoundingClientRect();
      if (first === undefined) {
        return;
      }
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        animate(card, { x: [dx, 0], y: [dy, 0] }, { type: "spring", stiffness: 220, damping: 28 });
      }
    });
    if (entering.length > 0) {
      animate(
        entering,
        { opacity: [0, 1], scale: [0.92, 1], x: 0, y: 0 },
        { duration: 0.5, ease: [...easing.out], delay: stagger(0.06, { startDelay: 0.08 }) },
      );
    }
  }

  async open(source: HTMLElement | null, parts: DialogParts): Promise<void> {
    parts.panel.scrollTop = 0;
    if (source !== null) {
      source.style.visibility = "hidden";
    }
    if (this.reduced || source === null) {
      return;
    }
    const geometry = this.geometry(source, parts.panel);
    parts.panel.style.transformOrigin = "0 0";
    animate(parts.backdrop, { opacity: [0, 1] }, { duration: 0.4 });
    animate(parts.fades, { opacity: [0, 1] }, { duration: 0.35, delay: 0.32 });
    await animate(
      parts.panel,
      {
        x: [geometry.x, 0],
        y: [geometry.y, 0],
        scale: [geometry.scale, 1],
        clipPath: [geometry.from, geometry.to],
      },
      { duration: 0.62, ease: [...easing.morph] },
    );
    parts.panel.style.clipPath = "";
  }

  async close(source: HTMLElement | null, parts: DialogParts): Promise<void> {
    const restore = () => {
      if (source !== null) {
        source.style.visibility = "";
      }
    };
    if (this.reduced || source === null) {
      restore();
      return;
    }
    const { panel } = parts;
    if (panel.scrollTop > 2) {
      await animate(panel.scrollTop, 0, {
        duration: 0.3,
        ease: [...easing.out],
        onUpdate: (value) => {
          panel.scrollTop = value;
        },
      });
    }
    panel.style.transformOrigin = "0 0";
    const geometry = this.geometry(source, panel);
    animate(parts.fades, { opacity: 0 }, { duration: 0.15 });
    animate(parts.backdrop, { opacity: 0 }, { duration: 0.4, delay: 0.1 });
    await animate(
      panel,
      {
        x: [0, geometry.x],
        y: [0, geometry.y],
        scale: [1, geometry.scale],
        clipPath: [geometry.to, geometry.from],
      },
      { duration: 0.5, ease: [...easing.morph] },
    );
    restore();
  }

  /** Where the panel must start so it sits exactly over the source card. */
  private geometry(source: HTMLElement, panel: HTMLElement): MorphGeometry {
    const a = source.getBoundingClientRect();
    const b = panel.getBoundingClientRect();
    const scale = a.width / b.width;
    const clipBottom = Math.max(0, b.height - a.height / scale);
    const parsedRadius = parseFloat(getComputedStyle(panel).borderTopLeftRadius);
    const radius = Number.isNaN(parsedRadius) ? 0 : parsedRadius;
    return {
      x: a.left - b.left,
      y: a.top - b.top,
      scale,
      from: `inset(0px 0px ${clipBottom.toFixed(1)}px 0px round ${(CARD_RADIUS / scale).toFixed(1)}px)`,
      to: `inset(0px 0px 0px 0px round ${radius}px)`,
    };
  }
}
