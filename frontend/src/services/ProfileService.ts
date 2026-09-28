// Presentation logic over the static profile content — no data access, no network.
// Kept as a class (CLAUDE.md: services are classes) so pages stay free of logic.

import type { Education, Experience, Profile, Stat } from "@/models/profile";
import { yearMonthSortKey, yearsSince } from "@/utils/datetime";

export class ProfileService {
  constructor(private readonly profile: Profile) {}

  getProfile(): Profile {
    return this.profile;
  }

  /** Most recent first; ongoing positions always on top. */
  getExperiences(): Experience[] {
    return [...this.profile.experiences].sort((a, b) => {
      const byEnd = yearMonthSortKey(b.end) - yearMonthSortKey(a.end);
      return byEnd !== 0 ? byEnd : yearMonthSortKey(b.start) - yearMonthSortKey(a.start);
    });
  }

  getEducation(): Education[] {
    return [...this.profile.education].sort(
      (a, b) => yearMonthSortKey(b.end) - yearMonthSortKey(a.end),
    );
  }

  getYearsTeaching(now: Date = new Date()): number {
    return yearsSince(this.profile.teachingSince, now);
  }

  getStats(now: Date = new Date()): Stat[] {
    const years = this.getYearsTeaching(now);
    return [
      { value: `${years}+`, label: years === 1 ? "ano em sala de aula" : "anos em sala de aula" },
      { value: String(this.profile.experiences.length), label: "escolas e experiências" },
      { value: String(this.profile.education.length), label: "formações" },
    ];
  }

  getInitials(): string {
    return this.profile.name.slice(0, 1).toUpperCase();
  }
}
