// Presentation logic over the static profile content — no data access, no network.
// Kept as a class (CLAUDE.md: services are classes) so components stay free of logic.

import type { ProjectFilter } from "@/models/homeUi";
import type { Course, Experience, Profile, Project } from "@/models/profile";
import { yearRangeSortKey } from "@/utils/datetime";

export class ProfileService {
  constructor(private readonly profile: Profile) {}

  getProfile(): Profile {
    return this.profile;
  }

  /** Experiences, most recent first (ongoing on top). */
  getExperiences(): Experience[] {
    return [...this.profile.trajectory.experiences].sort(
      (a, b) => yearRangeSortKey(b.period) - yearRangeSortKey(a.period),
    );
  }

  getCurrentExperience(): Experience | null {
    return this.getExperiences().find((item) => item.period.end === null) ?? null;
  }

  getPastExperiences(): Experience[] {
    return this.getExperiences().filter((item) => item.period.end !== null);
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

  /** { hours: 40, year: 2023 } → "40 h · 2023"; without hours → "2019". */
  formatCourseInfo(course: Course): string {
    return course.hours === null ? String(course.year) : `${course.hours} h · ${course.year}`;
  }

  /** "01", "02"… for project steps. */
  formatStepNumber(index: number): string {
    return String(index + 1).padStart(2, "0");
  }
}
