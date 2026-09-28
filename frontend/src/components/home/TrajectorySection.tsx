import { Box } from "@mui/material";

import type { Experience } from "@/models/profile";
import { fonts, palette, transitionOut } from "@/theme/theme";

import { PageContainer, Section, SectionHeader } from "./layout";
import { Shape } from "./Shape";

type TrajectorySectionProps = {
  lead: string;
  current: Experience | null;
  past: Experience[];
  formatPeriod: (experience: Experience) => string;
};

type JobProps = {
  experience: Experience;
  formatPeriod: (experience: Experience) => string;
};

function CurrentJob({ experience, formatPeriod }: JobProps) {
  return (
    <Box component="li" data-tl-item="" sx={{ position: "relative", pb: "3rem" }}>
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          left: "calc(-3rem + 1px)",
          top: "1.9rem",
          width: "1.5rem",
          height: "1.5rem",
          borderRadius: "50%",
          backgroundColor: palette.sun,
          border: `4px solid ${palette.paperDeep}`,
        }}
      />
      <Box
        sx={{
          p: "clamp(1.5rem,4vw,2.25rem)",
          borderRadius: "1rem",
          backgroundColor: palette.ink,
          color: palette.white,
          transition: `transform 0.4s ${transitionOut}, box-shadow 0.4s, background 0.4s`,
          "&:hover": {
            transform: "translateY(-4px)",
            backgroundColor: palette.inkHover,
            boxShadow: "0 28px 50px -30px rgba(34,51,44,0.8)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "0.5rem 1rem",
          }}
        >
          <Box
            component="span"
            sx={{
              fontFamily: fonts.display,
              fontWeight: 600,
              fontSize: "1.05rem",
              color: palette.sun,
            }}
          >
            {formatPeriod(experience)}
          </Box>
          <Box
            component="span"
            sx={{
              fontFamily: fonts.hand,
              fontWeight: 700,
              fontSize: "1.5rem",
              lineHeight: 1,
              color: palette.peach,
            }}
          >
            emprego atual
          </Box>
        </Box>
        <Box
          component="h3"
          sx={{
            m: "0.75rem 0 0.3rem",
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: "clamp(1.5rem,3.2vw,2rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
          }}
        >
          {experience.role}
        </Box>
        <Box component="p" sx={{ m: 0, fontWeight: 700, fontSize: "1.02rem", color: palette.mint }}>
          {experience.school}
        </Box>
        <Box
          component="p"
          sx={{
            m: "1.1rem 0 0",
            maxWidth: "38rem",
            fontSize: "1.04rem",
            lineHeight: 1.7,
            textWrap: "pretty",
          }}
        >
          {experience.description}
        </Box>
      </Box>
    </Box>
  );
}

function PastJob({ experience, formatPeriod }: JobProps) {
  return (
    <Box component="li" data-tl-item="" sx={{ position: "relative", pb: "2.75rem" }}>
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          left: "calc(-2.8rem + 1px)",
          top: "0.25rem",
          width: "1.1rem",
          height: "1.1rem",
          borderRadius: "50%",
          backgroundColor: palette.paperDeep,
          border: `3px solid ${palette.green}`,
        }}
      />
      <Box
        component="span"
        sx={{
          fontFamily: fonts.display,
          fontWeight: 600,
          fontSize: "1.02rem",
          color: palette.green,
        }}
      >
        {formatPeriod(experience)}
      </Box>
      <Box
        component="h3"
        sx={{
          m: "0.4rem 0 0.2rem",
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: "clamp(1.3rem,2.6vw,1.55rem)",
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
        }}
      >
        {experience.role}
      </Box>
      <Box component="p" sx={{ m: 0, fontWeight: 700, fontSize: "1rem", color: palette.muted }}>
        {experience.school}
      </Box>
      <Box
        component="p"
        sx={{
          m: "0.75rem 0 0",
          maxWidth: "38rem",
          fontSize: "1.02rem",
          lineHeight: 1.7,
          textWrap: "pretty",
        }}
      >
        {experience.description}
      </Box>
    </Box>
  );
}

export function TrajectorySection({ lead, current, past, formatPeriod }: TrajectorySectionProps) {
  return (
    <Section id="trajetoria" label="Trajetória" background={palette.paperDeep}>
      <Shape
        kind="dot"
        color={palette.peach}
        size="6.5rem"
        parallax={0.12}
        placement={{ top: "26%", right: "-2.5rem" }}
      />
      <PageContainer>
        <SectionHeader title="Trajetória" lead={lead} />
        <Box
          data-timeline=""
          sx={{ position: "relative", maxWidth: "50rem", mt: "clamp(3rem,6vw,4.5rem)", pl: "3rem" }}
        >
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              left: "0.75rem",
              top: "0.5rem",
              bottom: "0.5rem",
              width: "2px",
              backgroundColor: "rgba(59,98,85,0.2)",
            }}
          >
            <Box
              data-tl-line=""
              sx={{
                position: "absolute",
                inset: 0,
                backgroundColor: palette.green,
                transformOrigin: "top",
              }}
            />
          </Box>
          <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0 }}>
            {current !== null && <CurrentJob experience={current} formatPeriod={formatPeriod} />}
            {past.map((experience) => (
              <PastJob
                key={`${experience.school}-${experience.period.start}`}
                experience={experience}
                formatPeriod={formatPeriod}
              />
            ))}
          </Box>
        </Box>
      </PageContainer>
    </Section>
  );
}
