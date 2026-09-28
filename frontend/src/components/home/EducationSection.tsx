import { Box } from "@mui/material";

import type { Degree, Education, EventParticipation } from "@/models/profile";
import { fonts, palette, transitionOut } from "@/theme/theme";

import { displayTitleSx, PageContainer, Section } from "./layout";
import { Shape } from "./Shape";

type EducationSectionProps = {
  education: Education;
  formatDegreePeriod: (degree: Degree) => string;
  formatEvent: (event: EventParticipation) => string;
};

const hairline = `1px solid ${palette.hairline}`;

const blobColors = [palette.mint, palette.peach];

type DegreeCardProps = {
  degree: Degree;
  period: string;
  blob: string;
};

function DegreeCard({ degree, period, blob }: DegreeCardProps) {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        p: "clamp(1.75rem,4vw,2.5rem)",
        borderRadius: "1rem",
        backgroundColor: palette.white,
        boxShadow: "0 1px 0 rgba(34,51,44,0.06)",
        transition: `transform 0.4s ${transitionOut}, box-shadow 0.4s`,
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 28px 50px -30px rgba(34,51,44,0.5)",
        },
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          right: "-3rem",
          top: "-3rem",
          width: "9rem",
          height: "9rem",
          borderRadius: "50%",
          backgroundColor: blob,
        }}
      />
      <Box
        component="p"
        sx={{
          position: "relative",
          m: 0,
          fontWeight: 700,
          fontSize: "0.98rem",
          color: palette.muted,
        }}
      >
        {`${degree.kind} · ${period}`}
      </Box>
      <Box
        component="h3"
        sx={{
          position: "relative",
          m: "0.9rem 0 0.5rem",
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: "clamp(1.9rem,4vw,2.6rem)",
          lineHeight: 1.02,
          letterSpacing: "-0.035em",
        }}
      >
        {degree.title}
      </Box>
      <Box
        component="p"
        sx={{
          position: "relative",
          m: 0,
          fontWeight: 700,
          fontSize: "1.05rem",
          color: palette.green,
        }}
      >
        {degree.institution}
      </Box>
      {degree.note !== null && (
        <Box
          component="p"
          sx={{
            position: "relative",
            m: "1.25rem 0 0",
            fontSize: "1.02rem",
            lineHeight: 1.65,
            textWrap: "pretty",
          }}
        >
          {degree.note}
        </Box>
      )}
    </Box>
  );
}

export function EducationSection({
  education,
  formatDegreePeriod,
  formatEvent,
}: EducationSectionProps) {
  return (
    <Section id="formacao" label="Formação">
      <Shape
        kind="sparkle"
        color={palette.coral}
        size="2rem"
        parallax={0.18}
        placement={{ top: "22%", left: "48%" }}
      />
      <PageContainer>
        <Box data-reveal="" sx={{ pt: "1.25rem", borderTop: `2px solid ${palette.ink}` }}>
          <Box component="h2" sx={displayTitleSx}>
            Formação
          </Box>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,22rem),1fr))",
            gap: "clamp(2rem,5vw,4rem)",
            mt: "clamp(2.5rem,5vw,3.5rem)",
            alignItems: "start",
          }}
        >
          <Box data-reveal="" sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {education.degrees.map((degree, index) => (
              <DegreeCard
                key={`${degree.kind}-${degree.title}`}
                degree={degree}
                period={formatDegreePeriod(degree)}
                blob={blobColors[index % blobColors.length]}
              />
            ))}
          </Box>
          <div data-reveal="">
            <Box component="h3" sx={{ m: "0 0 0.5rem", fontWeight: 800, fontSize: "1rem" }}>
              {education.eventsTitle}
            </Box>
            <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, borderBottom: hairline }}>
              {education.events.map((event) => (
                <Box
                  key={event.name}
                  component="li"
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: "0.25rem 1.5rem",
                    py: "1rem",
                    borderTop: hairline,
                  }}
                >
                  <Box
                    component="span"
                    sx={{ flex: "1 1 16rem", fontWeight: 700, fontSize: "1.05rem" }}
                  >
                    {event.name}
                  </Box>
                  <Box
                    component="span"
                    sx={{ fontWeight: 600, fontSize: "0.95rem", color: palette.muted }}
                  >
                    {formatEvent(event)}
                  </Box>
                </Box>
              ))}
            </Box>
          </div>
        </Box>
      </PageContainer>
    </Section>
  );
}
