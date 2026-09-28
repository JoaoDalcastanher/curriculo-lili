import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";

import type { Profile, Stat } from "@/models/profile";
import { fonts, palette } from "@/theme/theme";

import { Decoration } from "./Decoration";

const rise = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const draw = keyframes`
  from { stroke-dashoffset: 400; }
  to { stroke-dashoffset: 0; }
`;

const morph = keyframes`
  0%, 100% { border-radius: 58% 42% 55% 45% / 48% 58% 42% 52%; }
  50% { border-radius: 44% 56% 42% 58% / 58% 44% 56% 42%; }
`;

type HeroSectionProps = {
  profile: Profile;
  stats: Stat[];
  initials: string;
};

function riseIn(delayMs: number) {
  return { animation: `${rise} 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) ${delayMs}ms both` };
}

function Portrait({ profile, initials }: Pick<HeroSectionProps, "profile" | "initials">) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 440,
        aspectRatio: "1 / 1",
        mx: "auto",
        ...riseIn(300),
      }}
    >
      <Decoration shape="dots" color={palette.sage} size={96} sx={{ top: -18, left: -12 }} />
      <Decoration
        shape="star"
        color={palette.mustard}
        size={62}
        rotate={12}
        sx={{ top: "6%", right: "2%", zIndex: 2 }}
      />
      <Decoration
        shape="ring"
        color={palette.sky}
        size={80}
        sx={{ bottom: "4%", left: "-4%", zIndex: 2 }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: "6%",
          backgroundColor: palette.terracottaSoft,
          animation: `${morph} 14s ease-in-out infinite`,
          transform: "rotate(-6deg) translate(4%, 4%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: "6%",
          overflow: "hidden",
          display: "grid",
          placeItems: "center",
          background: `linear-gradient(145deg, ${palette.terracotta} 0%, #E58A5E 55%, ${palette.mustard} 100%)`,
          animation: `${morph} 14s ease-in-out infinite reverse`,
          boxShadow: "0 30px 60px -25px rgba(210, 100, 63, 0.55)",
        }}
      >
        {profile.photoUrl === null ? (
          <Typography
            aria-hidden
            sx={{
              fontFamily: fonts.display,
              fontStyle: "italic",
              fontWeight: 800,
              fontSize: { xs: "9rem", md: "12rem" },
              color: "rgba(255,255,255,0.92)",
              lineHeight: 1,
            }}
          >
            {initials}
          </Typography>
        ) : (
          <Box
            component="img"
            src={profile.photoUrl}
            alt={`Foto de ${profile.name}`}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: { xs: "0%", md: "-6%" },
          zIndex: 3,
          px: 2.5,
          py: 1.25,
          borderRadius: "14px",
          backgroundColor: palette.white,
          boxShadow: "0 18px 40px -18px rgba(30, 42, 59, 0.35)",
          transform: "rotate(3deg)",
        }}
      >
        <Typography
          sx={{ fontFamily: fonts.hand, fontSize: "1.6rem", lineHeight: 1.1, color: palette.ink }}
        >
          {`${profile.title} ✏️`}
        </Typography>
      </Box>
    </Box>
  );
}

export function HeroSection({ profile, stats, initials }: HeroSectionProps) {
  return (
    <Box
      id="inicio"
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        pt: { xs: 6, md: 10 },
        pb: { xs: 8, md: 12 },
      }}
    >
      <Decoration
        shape="squiggle"
        color={palette.sageSoft}
        size={180}
        rotate={-8}
        sx={{ top: 40, left: "-60px" }}
      />
      <Decoration
        shape="circle"
        color={palette.mustardSoft}
        size={260}
        sx={{ bottom: -120, right: "38%", opacity: 0.7 }}
      />
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
            gap: { xs: 6, md: 8 },
            alignItems: "center",
          }}
        >
          <Stack spacing={3.5}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ color: palette.inkSoft, ...riseIn(0) }}
            >
              <PlaceOutlinedIcon fontSize="small" />
              <Typography variant="overline" sx={{ lineHeight: 1 }}>
                {`${profile.title} · ${profile.location}`}
              </Typography>
            </Stack>

            <Typography
              variant="h1"
              component="h1"
              sx={{ fontSize: { xs: "4.5rem", sm: "6rem", md: "7.5rem" }, ...riseIn(100) }}
            >
              Oi, eu sou a{" "}
              <Box
                component="span"
                sx={{
                  position: "relative",
                  display: "inline-block",
                  color: palette.terracotta,
                  fontStyle: "italic",
                }}
              >
                {profile.name}
                <Box
                  component="svg"
                  aria-hidden
                  viewBox="0 0 300 30"
                  preserveAspectRatio="none"
                  sx={{
                    position: "absolute",
                    left: "-4%",
                    bottom: "-0.12em",
                    width: "108%",
                    height: "0.28em",
                    overflow: "visible",
                  }}
                >
                  <path
                    d="M4 20 C 60 4, 120 28, 180 14 S 270 8, 296 16"
                    fill="none"
                    stroke={palette.mustard}
                    strokeWidth="9"
                    strokeLinecap="round"
                    style={{ strokeDasharray: 400, animation: `${draw} 1.4s ease-out 700ms both` }}
                  />
                </Box>
              </Box>
            </Typography>

            <Typography
              sx={{
                fontFamily: fonts.display,
                fontStyle: "italic",
                fontSize: { xs: "1.35rem", md: "1.6rem" },
                lineHeight: 1.45,
                color: palette.inkSoft,
                maxWidth: "32ch",
                ...riseIn(200),
              }}
            >
              {profile.tagline}
            </Typography>

            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.5, ...riseIn(300) }}>
              <Button
                variant="contained"
                size="large"
                href="#trajetoria"
                endIcon={<ArrowDownwardRoundedIcon />}
              >
                Conheça minha trajetória
              </Button>
              <Button
                size="large"
                href="#contato"
                sx={{
                  color: palette.ink,
                  border: `2px solid ${palette.ink}`,
                  "&:hover": { backgroundColor: palette.ink, color: palette.white },
                }}
              >
                Vamos conversar
              </Button>
            </Stack>

            <Box
              component="dl"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: { xs: 3, md: 5 },
                m: 0,
                pt: 2,
                ...riseIn(450),
              }}
            >
              {stats.map((stat) => (
                <Box key={stat.label} sx={{ display: "flex", flexDirection: "column-reverse" }}>
                  <Typography
                    component="dt"
                    sx={{ color: palette.inkSoft, fontWeight: 700, fontSize: "0.95rem" }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    component="dd"
                    sx={{
                      m: 0,
                      fontFamily: fonts.display,
                      fontWeight: 800,
                      fontSize: "2.6rem",
                      lineHeight: 1.1,
                      color: palette.ink,
                    }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Stack>

          <Portrait profile={profile} initials={initials} />
        </Box>
      </Container>
    </Box>
  );
}
