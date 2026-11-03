import { Box } from "@mui/material";

import type { PedagogicalResource } from "@/models/profile";
import { fonts, palette, transitionOut } from "@/theme/theme";

import { PageContainer, Section, SectionHeader } from "./layout";

type ResourceSectionProps = {
  resource: PedagogicalResource;
};

const playIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
  </svg>
);

export function ResourceSection({ resource }: ResourceSectionProps) {
  return (
    <Section id="recurso" label={resource.title}>
      <PageContainer>
        <SectionHeader title={resource.title} lead={resource.lead} />
        <Box
          data-reveal=""
          sx={{
            position: "relative",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,18rem),1fr))",
            gap: "clamp(1.5rem,4vw,3rem)",
            alignItems: "center",
            mt: "clamp(2rem,5vw,3.5rem)",
            p: "clamp(1.75rem,5vw,3.5rem)",
            borderRadius: "1.25rem",
            backgroundColor: palette.mint,
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              left: "-4rem",
              bottom: "-5rem",
              width: "14rem",
              height: "14rem",
              borderRadius: "50%",
              backgroundColor: palette.sun,
              opacity: 0.55,
            }}
          />
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src={resource.image.src ?? undefined}
              alt={resource.image.alt}
              loading="lazy"
              sx={{ width: "min(100%,16rem)", height: "auto", borderRadius: "1rem" }}
            />
          </Box>
          <Box sx={{ position: "relative" }}>
            <Box
              component="p"
              sx={{ m: 0, fontWeight: 700, fontSize: "0.98rem", color: palette.muted }}
            >
              {resource.kind}
            </Box>
            <Box
              component="h3"
              sx={{
                m: "0.75rem 0 1rem",
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: "clamp(2rem,5vw,3rem)",
                lineHeight: 1,
                letterSpacing: "-0.035em",
                color: palette.ink,
              }}
            >
              {resource.name}
            </Box>
            <Box
              component="p"
              sx={{
                m: 0,
                maxWidth: "34rem",
                fontSize: "1.08rem",
                lineHeight: 1.6,
                color: palette.ink,
                textWrap: "pretty",
              }}
            >
              {resource.description}
            </Box>
            <Box
              component="ul"
              sx={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", m: "1.5rem 0 0", p: 0 }}
            >
              {resource.skills.map((skill) => (
                <Box
                  key={skill}
                  component="li"
                  sx={{
                    listStyle: "none",
                    px: "0.9rem",
                    py: "0.35rem",
                    borderRadius: "999px",
                    backgroundColor: palette.white,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: palette.green,
                  }}
                >
                  {skill}
                </Box>
              ))}
            </Box>
            <Box
              component="a"
              href={resource.href}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                minHeight: "3.25rem",
                mt: "2rem",
                px: "1.6rem",
                borderRadius: "0.7rem",
                backgroundColor: palette.green,
                color: palette.white,
                fontWeight: 800,
                fontSize: "1.05rem",
                textDecoration: "none",
                transition: `background 0.3s, transform 0.3s ${transitionOut}`,
                "&:hover": {
                  backgroundColor: palette.ink,
                  transform: "translateY(-3px)",
                },
              }}
            >
              {playIcon}
              {resource.cta}
            </Box>
          </Box>
        </Box>
      </PageContainer>
    </Section>
  );
}
