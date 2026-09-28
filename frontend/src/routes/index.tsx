import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { EducationSection } from "@/components/home/EducationSection";
import { HeroSection } from "@/components/home/HeroSection";
import { ProjectDialog } from "@/components/home/ProjectDialog";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import { TrajectorySection } from "@/components/home/TrajectorySection";
import { navItems } from "@/content/navigation";
import { profile } from "@/content/profile";
import { useHomeMotion } from "@/hooks/useHomeMotion";
import { ProfileService } from "@/services/ProfileService";
import { getCurrentYear } from "@/utils/datetime";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const service = new ProfileService(profile);
const PROJECT_QUERY_PARAM = "projeto";

type OpenProject = {
  id: string;
  instant: boolean;
};

function HomePage() {
  const data = service.getProfile();
  const [open, setOpen] = useState<OpenProject | null>(null);
  useHomeMotion();

  // Deep link: /?projeto=horta opens that project directly.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get(PROJECT_QUERY_PARAM);
    if (service.findProject(id) !== null && id !== null) {
      setOpen({ id, instant: true });
    }
  }, []);

  const openProject = service.findProject(open?.id ?? null);
  const formatTags = (tags: string[]) => service.formatTags(tags);
  const formatAuthors = (authors: string[]) => service.formatAuthors(authors);

  return (
    <>
      <SiteHeader name={data.name} items={navItems} />
      <main>
        <HeroSection profile={data} stats={service.getStats()} />
        <AboutSection about={data.about} />
        <TrajectorySection
          lead={data.trajectory.lead}
          current={service.getCurrentExperience()}
          past={service.getPastExperiences()}
          formatPeriod={(experience) => service.formatExperiencePeriod(experience)}
        />
        <ProjectsSection
          lead={data.projects.lead}
          projects={data.projects.items}
          filters={service.getProjectFilters()}
          formatTags={formatTags}
          formatAuthors={formatAuthors}
          onOpen={(id) => setOpen((current) => current ?? { id, instant: false })}
        />
        <EducationSection
          education={data.education}
          formatDegreePeriod={(degree) => service.formatDegreePeriod(degree)}
          formatEvent={(event) => service.formatEvent(event)}
        />
        <ContactSection contact={data.contact} />
      </main>
      <SiteFooter fullName={data.fullName} year={getCurrentYear()} />
      {openProject !== null && open !== null && (
        <ProjectDialog
          key={openProject.id}
          project={openProject}
          instant={open.instant}
          formatTags={formatTags}
          formatAuthors={formatAuthors}
          formatStepNumber={(index) => service.formatStepNumber(index)}
          onClosed={() => setOpen(null)}
        />
      )}
    </>
  );
}
