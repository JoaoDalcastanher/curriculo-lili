import { Box, Container, Stack, Typography } from "@mui/material";

import type { Experience } from "@/models/profile";
import { fonts, palette } from "@/theme/theme";
import { formatPeriod } from "@/utils/datetime";

import { SectionHeading } from "./SectionHeading";

type TimelineSectionProps = {
  experiences: Experience[];
};

export function TimelineSection({ experiences }: TimelineSectionProps) {
  return (
    <Box
      id="trajetoria"
      component="section"
      sx={{
        position: "relative",
        py: { xs: 10, md: 14 },
        backgroundColor: palette.ink,
        color: palette.white,
        scrollMarginTop: 72,
        backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <Container maxWidth="md">
        <SectionHeading
          eyebrow="por onde passei"
          title="Minha trajetória em sala de aula"
          tone="light"
        />
        <Box
          component="ol"
          sx={{ listStyle: "none", p: 0, m: 0, mt: { xs: 6, md: 8 }, position: "relative" }}
        >
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              left: { xs: 9, md: 11 },
              top: 12,
              bottom: 12,
              borderLeft: `2px dashed rgba(255,255,255,0.25)`,
            }}
          />
          {experiences.map((experience, index) => {
            const isCurrent = experience.end === null;
            return (
              <Box
                component="li"
                key={`${experience.institution}-${experience.start}`}
                sx={{
                  position: "relative",
                  pl: { xs: 5, md: 7 },
                  pb: index === experiences.length - 1 ? 0 : { xs: 6, md: 7 },
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 6,
                    width: { xs: 20, md: 24 },
                    height: { xs: 20, md: 24 },
                    borderRadius: "50%",
                    backgroundColor: isCurrent ? palette.terracotta : palette.ink,
                    border: `3px solid ${isCurrent ? palette.terracottaSoft : palette.mustard}`,
                    boxShadow: isCurrent ? `0 0 0 8px rgba(210, 100, 63, 0.2)` : "none",
                  }}
                />
                <Stack spacing={1.5}>
                  <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>
                    <Typography
                      sx={{
                        fontFamily: fonts.hand,
                        fontSize: "1.55rem",
                        color: palette.mustard,
                        lineHeight: 1,
                      }}
                    >
                      {formatPeriod(experience.start, experience.end)}
                    </Typography>
                    {isCurrent && (
                      <Box
                        component="span"
                        sx={{
                          px: 1.25,
                          py: 0.25,
                          borderRadius: "999px",
                          backgroundColor: palette.terracotta,
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        Atual
                      </Box>
                    )}
                  </Stack>
                  <Typography variant="h4" component="h3" sx={{ color: palette.white }}>
                    {experience.role}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: "rgba(255,255,255,0.75)" }}>
                    {`${experience.institution} · ${experience.location}`}
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.72)", maxWidth: "60ch" }}>
                    {experience.description}
                  </Typography>
                  {experience.highlights.length > 0 && (
                    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, pt: 0.5 }}>
                      {experience.highlights.map((highlight) => (
                        <Box
                          key={highlight}
                          component="span"
                          sx={{
                            px: 1.75,
                            py: 0.75,
                            borderRadius: "999px",
                            border: "1.5px solid rgba(255,255,255,0.22)",
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            color: palette.sageSoft,
                          }}
                        >
                          {highlight}
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
