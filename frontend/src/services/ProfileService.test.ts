import { describe, expect, test } from "bun:test";

import { profile as siteProfile } from "@/content/profile";
import type { Experience, ExperienceKind, Profile, Project } from "@/models/profile";

import { ProfileService } from "./ProfileService";

function experience(
  role: string,
  kind: ExperienceKind,
  start: number,
  end: number | null,
): Experience {
  return { kind, role, school: "Escola", period: { start, end }, description: "" };
}

function project(id: string, tags: string[]): Project {
  return { ...siteProfile.projects.items[0], id, tags };
}

const fixture: Profile = {
  ...siteProfile,
  trajectory: {
    lead: "",
    experiences: [
      experience("ensino médio", "study", 2020, 2022),
      experience("pedagogia", "study", 2024, null),
      experience("monitora", "work", 2026, null),
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
      "monitora",
      "pedagogia",
      "ensino médio",
    ]);
  });

  test("highlights only the ongoing job, not ongoing studies", () => {
    expect(service.getCurrentExperience()?.role).toBe("monitora");
    expect(service.getPastExperiences().map((item) => item.role)).toEqual([
      "pedagogia",
      "ensino médio",
    ]);
  });

  test("has no current job when only studies are ongoing", () => {
    const studying = new ProfileService({
      ...fixture,
      trajectory: { lead: "", experiences: [experience("pedagogia", "study", 2024, null)] },
    });
    expect(studying.getCurrentExperience()).toBeNull();
    expect(studying.getPastExperiences()).toHaveLength(1);
  });

  test("labels ongoing work as 'hoje' and ongoing study as 'em andamento'", () => {
    const [work, study, done] = service.getExperiences();
    expect(service.formatExperiencePeriod(work)).toBe("2026 — hoje");
    expect(service.formatExperiencePeriod(study)).toBe("2024 — em andamento");
    expect(service.formatExperiencePeriod(done)).toBe("2020 — 2022");
  });

  test("does not mutate the original content", () => {
    service.getExperiences();
    expect(fixture.trajectory.experiences[0].role).toBe("ensino médio");
  });
});

describe("stats", () => {
  test("are derived from the content", () => {
    expect(service.getStats()).toEqual([
      { value: 2, label: "trabalhos apresentados" },
      { value: siteProfile.education.events.length, label: "eventos e oficinas" },
    ]);
  });

  test("use singular labels for one item", () => {
    const single = new ProfileService({
      ...fixture,
      projects: { ...fixture.projects, items: [project("a", ["Ciências"])] },
      education: { ...fixture.education, events: [siteProfile.education.events[0]] },
    });
    expect(single.getStats().map((stat) => stat.label)).toEqual([
      "trabalho apresentado",
      "evento e oficina",
    ]);
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
  test("joins tags and authors", () => {
    expect(service.formatTags(["Artes", "Leitura"])).toBe("Artes / Leitura");
    expect(service.formatAuthors(["CUNHA, G. A.", "KISTNER, L."])).toBe(
      "CUNHA, G. A.; KISTNER, L.",
    );
  });

  test("formats events and degree periods", () => {
    expect(service.formatEvent({ name: "x", kind: "Oficina", year: 2025 })).toBe("Oficina · 2025");
    expect(service.formatDegreePeriod(siteProfile.education.degrees[0])).toBe(
      "2024 — em andamento",
    );
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

  test("every work credits Gabrieli", () => {
    projects.items.forEach((item) => {
      expect(item.authors).toContain("CUNHA, G. A.");
      expect(item.reference).toContain("CUNHA, G. A.");
    });
  });

  test("has exactly one current job", () => {
    const current = siteProfile.trajectory.experiences.filter(
      (item) => item.kind === "work" && item.period.end === null,
    );
    expect(current).toHaveLength(1);
  });

  test("contacts are e-mail and Lattes only", () => {
    expect(siteProfile.contact.links.map((link) => link.kind)).toEqual(["email", "lattes"]);
  });
});
