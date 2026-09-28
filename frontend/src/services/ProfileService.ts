// Presentation logic over the static profile content — no data access, no network.
// Kept as a class (CLAUDE.md: services are classes) so components stay free of logic.

import type { ProjectFilter } from "@/models/homeUi";
import type {
  Degree,
  EventParticipation,
  Experience,
  ExperienceKind,
  Profile,
  Project,
  Stat,
} from "@/models/profile";
import { compareYearRangesDesc, formatYearRange } from "@/utils/datetime";

const ONGOING_LABEL: Record<ExperienceKind, string> = {
  work: "hoje",
  study: "em andamento",
};

export class ProfileService {
  constructor(private readonly profile: Profile) {}

  getProfile(): Profile {
    return this.profile;
  }

  /** Hero numbers, always derived from the content so they never go stale. */
  getStats(): Stat[] {
    const works = this.profile.projects.items.length;
    const events = this.profile.education.events.length;
    return [
      { value: works, label: works === 1 ? "trabalho apresentado" : "trabalhos apresentados" },
      { value: events, label: events === 1 ? "evento e oficina" : "eventos e oficinas" },
    ];
  }

  /** Experiences, most recent first (ongoing on top). */
  getExperiences(): Experience[] {
    return [...this.profile.trajectory.experiences].sort((a, b) =>
      compareYearRangesDesc(a.period, b.period),
    );
  }

  /** The ongoing job, highlighted as "emprego atual". */
  getCurrentExperience(): Experience | null {
    return (
      this.getExperiences().find((item) => item.kind === "work" && item.period.end === null) ?? null
    );
  }

  /** Everything else in the timeline, including ongoing studies. */
  getPastExperiences(): Experience[] {
    const current = this.getCurrentExperience();
    return this.getExperiences().filter((item) => item !== current);
  }

  formatExperiencePeriod(experience: Experience): string {
    return formatYearRange(experience.period, ONGOING_LABEL[experience.kind]);
  }

  formatDegreePeriod(degree: Degree): string {
    return formatYearRange(degree.period, ONGOING_LABEL.study);
  }

  /** "Todos" first, then the configured tags that at least one project uses. */
  getProjectFilters(): ProjectFilter[] {
    const used = new Set(this.profile.projects.items.flatMap((project) => project.tags));
    const tags = this.profile.projects.filters.filter((tag) => used.has(tag));
    return [
      { label: this.profile.projects.allLabel, tag: null },
      ...tags.map((tag) => ({ label: tag, tag })),
    ];
  }

  projectMatches(project: Project, tag: string | null): boolean {
    return tag === null || project.tags.includes(tag);
  }

  findProject(id: string | null): Project | null {
    return this.profile.projects.items.find((project) => project.id === id) ?? null;
  }

  formatTags(tags: string[]): string {
    return tags.join(" / ");
  }

  formatAuthors(authors: string[]): string {
    return authors.join("; ");
  }

  /** { kind: "Oficina", year: 2025 } → "Oficina · 2025". */
  formatEvent(event: EventParticipation): string {
    return `${event.kind} · ${event.year}`;
  }

  /** "01", "02"… for project steps. */
  formatStepNumber(index: number): string {
    return String(index + 1).padStart(2, "0");
  }
}
