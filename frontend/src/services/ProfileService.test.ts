import { describe, expect, test } from "bun:test";

import { profile as siteProfile } from "@/content/profile";
import type { Experience, Profile, Project } from "@/models/profile";

import { ProfileService } from "./ProfileService";

function experience(role: string, start: number, end: number | null): Experience {
  return { role, school: "Escola", period: { start, end }, description: "" };
}

function project(id: string, tags: string[]): Project {
  return { ...siteProfile.projects.items[0], id, tags };
}

const fixture: Profile = {
  ...siteProfile,
  trajectory: {
    lead: "",
    experiences: [
      experience("estágio", 2014, 2015),
      experience("atual", 2021, null),
      experience("alfabetizadora", 2018, 2021),
    ],
  },
  projects: {
    lead: "",
    allLabel: "Todos",
    filters: ["Leitura", "Ciências", "Artes", "Música"],
    items: [project("a", ["Ciências", "Família"]), project("b", ["Leitura"])],
  },
};

const service = new ProfileService(fixture);

describe("trajectory", () => {
  test("lists experiences most recent first", () => {
    expect(service.getExperiences().map((item) => item.role)).toEqual([
      "atual",
      "alfabetizadora",
      "estágio",
    ]);
  });

  test("splits the current job from the past ones", () => {
    expect(service.getCurrentExperience()?.role).toBe("atual");
    expect(service.getPastExperiences().map((item) => item.role)).toEqual([
      "alfabetizadora",
      "estágio",
    ]);
  });

  test("has no current job when every experience ended", () => {
    const ended = new ProfileService({
      ...fixture,
      trajectory: { lead: "", experiences: [experience("x", 2010, 2012)] },
    });
    expect(ended.getCurrentExperience()).toBeNull();
  });

  test("does not mutate the original content", () => {
    service.getExperiences();
    expect(fixture.trajectory.experiences[0].role).toBe("estágio");
  });
});

describe("project filters", () => {
  test("starts with 'Todos' and keeps only tags used by some project, in order", () => {
    expect(service.getProjectFilters()).toEqual([
      { label: "Todos", tag: null },
      { label: "Leitura", tag: "Leitura" },
      { label: "Ciências", tag: "Ciências" },
    ]);
  });

  test("matches projects by tag, and everything for 'Todos'", () => {
    const [a, b] = fixture.projects.items;
    expect(service.projectMatches(a, "Ciências")).toBe(true);
    expect(service.projectMatches(b, "Ciências")).toBe(false);
    expect(service.projectMatches(b, null)).toBe(true);
  });

  test("finds projects by id", () => {
    expect(service.findProject("b")?.id).toBe("b");
    expect(service.findProject("nao-existe")).toBeNull();
    expect(service.findProject(null)).toBeNull();
  });
});

describe("formatting", () => {
  test("joins tags", () => {
    expect(service.formatTags(["Artes", "Leitura"])).toBe("Artes / Leitura");
  });

  test("formats course info with and without hours", () => {
    expect(service.formatCourseInfo({ name: "x", hours: 40, year: 2023 })).toBe("40 h · 2023");
    expect(service.formatCourseInfo({ name: "x", hours: null, year: 2019 })).toBe("2019");
  });

  test("pads step numbers", () => {
    expect(service.formatStepNumber(0)).toBe("01");
    expect(service.formatStepNumber(9)).toBe("10");
  });
});

describe("site content", () => {
  const { projects } = siteProfile;

  test("project ids are unique and URL-safe", () => {
    const ids = projects.items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id).toMatch(/^[a-z0-9-]+$/));
  });

  test("every project tag is a configured filter", () => {
    projects.items.forEach((item) =>
      item.tags.forEach((tag) => expect(projects.filters).toContain(tag)),
    );
  });

  test("gallery photos have unique alt texts within a project", () => {
    projects.items.forEach((item) => {
      const alts = item.gallery.map((photo) => photo.alt);
      expect(new Set(alts).size).toBe(alts.length);
    });
  });

  test("has exactly one current job", () => {
    const current = siteProfile.trajectory.experiences.filter((item) => item.period.end === null);
    expect(current).toHaveLength(1);
  });
});
