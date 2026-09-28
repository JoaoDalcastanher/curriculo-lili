import { Box } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { EducationSection } from "@/components/home/EducationSection";
import { HeroSection } from "@/components/home/HeroSection";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import { TimelineSection } from "@/components/home/TimelineSection";
import { navItems } from "@/content/navigation";
import { profile } from "@/content/profile";
import { ProfileService } from "@/services/ProfileService";
import { getCurrentYear } from "@/utils/datetime";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const profileService = new ProfileService(profile);

function HomePage() {
  const data = profileService.getProfile();
  return (
    <Box sx={{ minHeight: "100vh", overflowX: "clip" }}>
      <SiteHeader name={data.name} items={navItems} />
      <Box component="main">
        <HeroSection
          profile={data}
          stats={profileService.getStats()}
          initials={profileService.getInitials()}
        />
        <AboutSection profile={data} />
        <TimelineSection experiences={profileService.getExperiences()} />
        <EducationSection education={profileService.getEducation()} />
        <ContactSection name={data.name} contacts={data.contacts} />
      </Box>
      <SiteFooter fullName={data.fullName} year={getCurrentYear()} />
    </Box>
  );
}
