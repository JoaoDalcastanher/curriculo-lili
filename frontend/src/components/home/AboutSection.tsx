import { Box } from "@mui/material";
import type { ReactElement } from "react";

import type { About, ValueIcon, ValueTone } from "@/models/profile";
import { fonts, palette, transitionOut } from "@/theme/theme";

import { PageContainer, Section, SectionHeader } from "./layout";

type AboutSectionProps = {
  about: About;
};

const iconStroke = { fill: "none", stroke: palette.ink, strokeWidth: 2.6 } as const;

const valueIcons: Record<ValueIcon, ReactElement> = {
  heart: (
    <svg
      viewBox="0 0 48 48"
      width="44"
      height="44"
      {...iconStroke}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M24 40s-14-8.8-14-20a8 8 0 0 1 14-5.2A8 8 0 0 1 38 20c0 11.2-14 20-14 20z" />
    </svg>
  ),
  clock: (
    <svg
      viewBox="0 0 48 48"
      width="44"
      height="44"
      {...iconStroke}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="16" />
      <path d="M24 14v10l7 5" />
    </svg>
  ),
  sparkle: (
    <svg
      viewBox="0 0 48 48"
      width="44"
      height="44"
      {...iconStroke}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M24 4C26 16 32 22 44 24C32 26 26 32 24 44C22 32 16 26 4 24C16 22 22 16 24 4Z" />
    </svg>
  ),
  circles: (
    <svg viewBox="0 0 48 48" width="44" height="44" {...iconStroke} aria-hidden="true">
      <circle cx="18" cy="24" r="11" />
      <circle cx="30" cy="24" r="11" />
    </svg>
  ),
};

const tones: Record<ValueTone, { background: string; hover: string }> = {
  peach: { background: palette.peach, hover: palette.peachHover },
  sun: { background: palette.sun, hover: palette.sunHover },
  mint: { background: palette.mint, hover: palette.mintHover },
  sand: { background: palette.sand, hover: palette.sandHover },
};

const hairline = `1px solid ${palette.hairline}`;

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <Section id="sobre" label="Sobre">
      <PageContainer>
        <SectionHeader title="Sobre" lead={about.lead} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,24rem),1fr))",
            gap: "clamp(2.5rem,6vw,5rem)",
            mt: "clamp(2.5rem,5vw,4rem)",
            alignItems: "start",
          }}
        >
          <div data-reveal="">
            {about.paragraphs.map((paragraph, index) => (
              <Box
                key={paragraph}
                component="p"
                sx={{
                  m: index === 0 ? 0 : "1.25rem 0 0",
                  fontSize: "1.14rem",
                  lineHeight: 1.75,
                  textWrap: "pretty",
                }}
              >
                {paragraph}
              </Box>
            ))}
          </div>
          <div data-reveal="">
            <Box component="h3" sx={{ m: "0 0 0.75rem", fontWeight: 800, fontSize: "1rem" }}>
              Áreas de atuação
            </Box>
            <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, borderBottom: hairline }}>
              {about.areas.map((area) => (
                <Box
                  key={area}
                  component="li"
                  sx={{ py: "0.8rem", borderTop: hairline, fontWeight: 600, fontSize: "1.05rem" }}
                >
                  {area}
                </Box>
              ))}
            </Box>
          </div>
        </Box>

        <Box
          component="figure"
          data-reveal=""
          sx={{ m: "clamp(4.5rem,9vw,7rem) 0 0", maxWidth: "62rem" }}
        >
          <Box
            component="blockquote"
            sx={{
              m: 0,
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: "clamp(1.75rem,4.4vw,3.1rem)",
              lineHeight: 1.18,
              letterSpacing: "-0.025em",
              color: palette.green,
              textWrap: "pretty",
            }}
          >
            {`“${about.quote.before}`}
            <Box
              component="mark"
              sx={{
                background: `linear-gradient(transparent 58%, ${palette.sun} 58%, ${palette.sun} 92%, transparent 92%)`,
                color: palette.ink,
              }}
            >
              {about.quote.highlight}
            </Box>
            {`${about.quote.after}”`}
          </Box>
          <Box
            component="figcaption"
            sx={{
              mt: "1.5rem",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              gap: "0.75rem",
            }}
          >
            <Box
              component="span"
              sx={{ fontFamily: fonts.hand, fontWeight: 700, fontSize: "1.9rem", lineHeight: 1 }}
            >
              {about.quote.author}
            </Box>
            <Box
              component="cite"
              sx={{
                fontStyle: "normal",
                fontSize: "0.98rem",
                fontWeight: 600,
                color: palette.muted,
              }}
            >
              {about.quote.source}
            </Box>
          </Box>
        </Box>

        <Box
          component="h3"
          data-reveal=""
          sx={{
            m: "clamp(4.5rem,9vw,7rem) 0 1.5rem",
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: "clamp(1.6rem,3vw,2.1rem)",
            letterSpacing: "-0.025em",
          }}
        >
          {about.valuesTitle}
        </Box>
        <Box
          data-stagger=""
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            "@media (min-width:540px)": { gridTemplateColumns: "repeat(2,minmax(0,1fr))" },
            "@media (min-width:1110px)": { gridTemplateColumns: "repeat(4,minmax(0,1fr))" },
            gap: "1rem",
          }}
        >
          {about.values.map((value, index) => {
            const tone = tones[value.tone];
            const tilt = index % 2 === 0 ? "-0.6deg" : "0.6deg";
            return (
              <div key={value.title}>
                <Box
                  sx={{
                    height: "100%",
                    p: "1.75rem 1.75rem 2rem",
                    borderRadius: "1rem",
                    backgroundColor: tone.background,
                    transition: `transform 0.4s ${transitionOut}, box-shadow 0.4s, background 0.4s`,
                    "&:hover": {
                      transform: `translateY(-6px) rotate(${tilt})`,
                      backgroundColor: tone.hover,
                      boxShadow: "0 26px 40px -26px rgba(34,51,44,0.55)",
                    },
                  }}
                >
                  {valueIcons[value.icon]}
                  <Box
                    component="h4"
                    sx={{
                      m: "2.5rem 0 0.5rem",
                      fontFamily: fonts.display,
                      fontWeight: 700,
                      fontSize: "1.4rem",
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {value.title}
                  </Box>
                  <Box component="p" sx={{ m: 0, fontSize: "1rem", lineHeight: 1.55 }}>
                    {value.description}
                  </Box>
                </Box>
              </div>
            );
          })}
        </Box>
      </PageContainer>
    </Section>
  );
}
