import { Box } from "@mui/material";

import type { Profile, Stat } from "@/models/profile";
import { fonts, layout, palette } from "@/theme/theme";

import { PhotoSlot } from "./PhotoSlot";
import { Shape } from "./Shape";

type HeroSectionProps = {
  profile: Profile;
  stats: Stat[];
};

const buttonBaseSx = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "3.25rem",
  px: "1.5rem",
  borderRadius: "0.7rem",
  fontWeight: 800,
  fontSize: "1rem",
  transition: "background 0.3s, transform 0.3s, box-shadow 0.3s, color 0.3s",
} as const;

export function HeroSection({ profile, stats }: HeroSectionProps) {
  const { hero } = profile;
  return (
    <Box
      component="section"
      id="inicio"
      aria-label="Início"
      sx={{
        position: "relative",
        overflow: "clip",
        pt: `calc(${layout.headerHeight} + clamp(2.5rem,7vw,5.5rem))`,
        pb: "clamp(4.5rem,9vw,8rem)",
      }}
    >
      <Shape
        kind="sparkle"
        color={palette.coral}
        size="2.25rem"
        parallax={0.2}
        placement={{ top: "7%", right: "6%" }}
      />
      <Shape
        kind="squiggle"
        color={palette.peach}
        size="11rem"
        parallax={0.1}
        placement={{ bottom: "7%", left: "6%" }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: layout.maxWidth,
          mx: "auto",
          px: layout.gutter,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,24rem),1fr))",
          gap: "clamp(3.5rem,6vw,5rem)",
          alignItems: "center",
        }}
      >
        <div>
          <Box
            component="p"
            data-hero=""
            sx={{
              m: "0 0 0.2rem",
              fontFamily: fonts.hand,
              fontWeight: 700,
              fontSize: "2rem",
              lineHeight: 1,
              color: palette.green,
            }}
          >
            {hero.greeting}
          </Box>
          <Box
            component="h1"
            aria-label={`${profile.name}, ${profile.title}`}
            sx={{
              m: 0,
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: "clamp(4rem,14.5vw,8.5rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
              color: palette.ink,
            }}
          >
            <Box
              component="span"
              sx={{ position: "relative", display: "inline-block", pb: "0.12em" }}
            >
              <Box component="span" aria-hidden="true" sx={{ display: "inline-flex" }}>
                {Array.from(profile.name).map((letter, index) => (
                  <Box
                    key={`${letter}-${index}`}
                    component="span"
                    data-letter=""
                    sx={{ display: "inline-block" }}
                  >
                    {letter}
                  </Box>
                ))}
              </Box>
              <Box
                component="svg"
                aria-hidden="true"
                viewBox="0 0 400 30"
                preserveAspectRatio="none"
                sx={{
                  position: "absolute",
                  left: 0,
                  bottom: "-0.04em",
                  width: "100%",
                  height: "0.2em",
                  overflow: "visible",
                }}
              >
                <path
                  data-underline=""
                  d="M5 20 C 90 8, 210 4, 395 13"
                  pathLength={1}
                  fill="none"
                  stroke={palette.sun}
                  strokeWidth="9"
                  strokeLinecap="round"
                  style={{ strokeDasharray: 1 }}
                />
              </Box>
            </Box>
            <Box
              component="span"
              aria-hidden="true"
              data-hero=""
              sx={{
                display: "block",
                mt: "0.28em",
                fontSize: "0.4em",
                fontWeight: 500,
                letterSpacing: "-0.025em",
                color: palette.green,
              }}
            >
              {profile.title}
            </Box>
          </Box>
          <Box
            component="p"
            data-hero=""
            sx={{ m: "1rem 0 0", fontWeight: 700, fontSize: "1rem", color: palette.muted }}
          >
            {hero.specialty}
          </Box>
          <Box
            component="p"
            data-hero=""
            sx={{
              m: "1.75rem 0 0",
              maxWidth: "28rem",
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: "clamp(1.3rem,2.4vw,1.6rem)",
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
              color: palette.ink,
              textWrap: "pretty",
            }}
          >
            {hero.tagline}
          </Box>
          <Box
            data-hero=""
            sx={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", mt: "2.25rem" }}
          >
            <Box
              component="a"
              href="#projetos"
              sx={{
                ...buttonBaseSx,
                gap: "0.65rem",
                backgroundColor: palette.green,
                color: palette.white,
                "&:hover": {
                  backgroundColor: palette.ink,
                  color: palette.white,
                  transform: "translateY(-3px)",
                  boxShadow: "0 16px 28px -18px rgba(34,51,44,0.9)",
                },
              }}
            >
              Conheça meus projetos
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Box>
            <Box
              component="a"
              href="#contato"
              sx={{
                ...buttonBaseSx,
                border: `2px solid ${palette.green}`,
                color: palette.green,
                "&:hover": {
                  backgroundColor: palette.mint,
                  color: palette.ink,
                  transform: "translateY(-3px)",
                },
              }}
            >
              Entre em contato
            </Box>
          </Box>
          <Box
            component="dl"
            data-hero=""
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${stats.length},minmax(0,1fr))`,
              gap: "1rem",
              maxWidth: "28rem",
              m: "3.25rem 0 0",
            }}
          >
            {stats.map((stat) => (
              <Box key={stat.label} sx={{ display: "flex", flexDirection: "column-reverse" }}>
                <Box
                  component="dt"
                  sx={{
                    mt: "0.45rem",
                    fontSize: "0.92rem",
                    fontWeight: 700,
                    lineHeight: 1.3,
                    color: palette.muted,
                  }}
                >
                  {stat.label}
                </Box>
                <Box
                  component="dd"
                  sx={{
                    m: 0,
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: "clamp(2.4rem,5vw,3.25rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                    color: palette.ink,
                  }}
                >
                  <span data-count={stat.value}>{stat.value}</span>
                </Box>
              </Box>
            ))}
          </Box>
        </div>

        <Box
          data-hero-photo=""
          sx={{
            position: "relative",
            width: "min(100%,30rem)",
            mx: "auto",
            aspectRatio: "1 / 1.1",
          }}
        >
          <Box
            data-blob=""
            sx={{
              position: "absolute",
              inset: "-6% -8% -4% -6%",
              backgroundColor: palette.mint,
              borderRadius: "42% 58% 63% 37% / 45% 40% 60% 55%",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: "12% 0% 0% 14%",
              backgroundColor: palette.sun,
              borderRadius: "60% 40% 45% 55% / 55% 50% 50% 45%",
              transform: "rotate(-8deg)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: "3% 8% 7% 3%",
              overflow: "hidden",
              backgroundColor: palette.paperDeep,
              borderRadius: "55% 45% 50% 50% / 50% 56% 44% 50%",
            }}
          >
            <PhotoSlot photo={hero.photo} eager />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
