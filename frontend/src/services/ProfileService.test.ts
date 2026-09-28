import { describe, expect, test } from "bun:test";

import { profile as siteProfile } from "@/content/profile";
import type { Experience, Profile } from "@/models/profile";

import { ProfileService } from "./ProfileService";

function experience(role: string, start: string, end: string | null): Experience {
  return {
    role,
    institution: "Escola",
    location: "Cidade",
    start,
    end,
    description: "",
    highlights: [],
  };
}

const fixture: Profile = {
  ...siteProfile,
  name: "lili",
  teachingSince: "2016-02",
  experiences: [
    experience("antiga", "2016-02", "2017-12"),
    experience("atual", "2021-02", null),
    experience("meio", "2018-02", "2020-12"),
  ],
  education: [
    { degree: "Graduação", institution: "U", start: "2013-02", end: "2016-12", note: null },
    { degree: "Pós", institution: "U", start: "2019-03", end: "2020-12", note: null },
  ],
};

const service = new ProfileService(fixture);
const NOW = new Date("2026-09-28T12:00:00Z");

describe("ProfileService", () => {
  test("lists experiences most recent first, ongoing on top", () => {
    expect(service.getExperiences().map((item) => item.role)).toEqual(["atual", "meio", "antiga"]);
  });

  test("does not mutate the original content", () => {
    service.getExperiences();
    expect(fixture.experiences[0].role).toBe("antiga");
  });

  test("lists education most recent first", () => {
    expect(service.getEducation().map((item) => item.degree)).toEqual(["Pós", "Graduação"]);
  });

  test("builds hero stats", () => {
    expect(service.getStats(NOW)).toEqual([
      { value: "10+", label: "anos em sala de aula" },
      { value: "3", label: "escolas e experiências" },
      { value: "2", label: "formações" },
    ]);
  });

  test("uses singular label for one year", () => {
    const oneYear = new ProfileService({ ...fixture, teachingSince: "2025-06" });
    expect(oneYear.getStats(NOW)[0]).toEqual({ value: "1+", label: "ano em sala de aula" });
  });

  test("derives the initial from the name", () => {
    expect(service.getInitials()).toBe("L");
  });
});

describe("site content", () => {
  test("has valid year-month dates everywhere", () => {
    const pattern = /^\d{4}-(0[1-9]|1[0-2])$/;
    const dates = [
      siteProfile.teachingSince,
      ...siteProfile.experiences.flatMap((item) => [item.start, item.end]),
      ...siteProfile.education.flatMap((item) => [item.start, item.end]),
    ].filter((value): value is string => value !== null);
    dates.forEach((value) => expect(value).toMatch(pattern));
  });

  test("has at least one contact", () => {
    expect(siteProfile.contacts.length).toBeGreaterThan(0);
  });
});
