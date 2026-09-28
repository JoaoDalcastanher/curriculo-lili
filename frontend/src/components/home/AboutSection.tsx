import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import { Box, Chip, Container, Stack, Typography } from "@mui/material";
import type { ReactElement } from "react";

import type { Profile, ValueIcon } from "@/models/profile";
import { fonts, palette } from "@/theme/theme";

import { Decoration } from "./Decoration";
import { SectionHeading } from "./SectionHeading";

const valueIcons: Record<ValueIcon, ReactElement> = {
  heart: <FavoriteRoundedIcon />,
  sprout: <SpaRoundedIcon />,
  lightbulb: <LightbulbRoundedIcon />,
  palette: <PaletteRoundedIcon />,
  chat: <ChatBubbleRoundedIcon />,
  book: <AutoStoriesRoundedIcon />,
};

const cardTones = [
  { bg: palette.terracottaSoft, fg: palette.terracotta },
  { bg: palette.sageSoft, fg: palette.sage },
  { bg: palette.mustardSoft, fg: "#B7801B" },
  { bg: "#D8E7F2", fg: "#4F83AA" },
] as const;

type AboutSectionProps = {
  profile: Profile;
};

export function AboutSection({ profile }: AboutSectionProps) {
  return (
    <Box
      id="sobre"
      component="section"
      sx={{ position: "relative", py: { xs: 10, md: 14 }, scrollMarginTop: 72 }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 6, md: 10 },
            alignItems: "start",
          }}
        >
          <Stack spacing={4}>
            <SectionHeading
              eyebrow="um pouco sobre mim"
              title="Educar é um ato de carinho e coragem."
            />
            <Stack spacing={2.5}>
              {profile.about.map((paragraph) => (
                <Typography key={paragraph} color="text.secondary">
                  {paragraph}
                </Typography>
              ))}
            </Stack>
            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
              {profile.subjects.map((subject) => (
                <Chip
                  key={subject}
                  label={subject}
                  sx={{
                    backgroundColor: palette.white,
                    border: `1.5px solid ${palette.paperDeep}`,
                    color: palette.ink,
                    py: 2.5,
                    px: 0.5,
                  }}
                />
              ))}
            </Stack>
          </Stack>

          {profile.quote !== null && (
            <Box sx={{ position: "relative", pt: { xs: 0, md: 8 } }}>
              <Decoration
                shape="star"
                color={palette.terracotta}
                size={44}
                rotate={-14}
                sx={{ top: { xs: -18, md: 40 }, right: 24, zIndex: 2 }}
              />
              <Box
                component="figure"
                sx={{
                  m: 0,
                  position: "relative",
                  p: { xs: 4, md: 5 },
                  backgroundColor: palette.mustardSoft,
                  borderRadius: "6px 6px 28px 6px",
                  transform: "rotate(-1.5deg)",
                  boxShadow: "0 24px 50px -28px rgba(30, 42, 59, 0.45)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    width: 110,
                    height: 30,
                    transform: "translateX(-50%) rotate(2deg)",
                    backgroundColor: "rgba(255,255,255,0.6)",
                    borderRadius: "4px",
                  },
                }}
              >
                <Typography
                  component="blockquote"
                  sx={{
                    m: 0,
                    fontFamily: fonts.display,
                    fontStyle: "italic",
                    fontSize: { xs: "1.45rem", md: "1.75rem" },
                    lineHeight: 1.4,
                    color: palette.ink,
                  }}
                >
                  {`“${profile.quote.text}”`}
                </Typography>
                <Typography
                  component="figcaption"
                  sx={{
                    mt: 3,
                    fontFamily: fonts.hand,
                    fontSize: "1.7rem",
                    color: palette.terracotta,
                  }}
                >
                  {`— ${profile.quote.author}`}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            mt: { xs: 8, md: 12 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
            gap: 2.5,
          }}
        >
          {profile.values.map((value, index) => {
            const tone = cardTones[index % cardTones.length];
            return (
              <Box
                key={value.title}
                sx={{
                  p: 3.5,
                  borderRadius: "28px",
                  backgroundColor: palette.white,
                  border: `1.5px solid ${palette.paperDeep}`,
                  transition: "transform 250ms ease, box-shadow 250ms ease",
                  "&:hover": {
                    transform: "translateY(-6px) rotate(-0.6deg)",
                    boxShadow: "0 22px 40px -24px rgba(30, 42, 59, 0.35)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "16px",
                    display: "grid",
                    placeItems: "center",
                    backgroundColor: tone.bg,
                    color: tone.fg,
                    mb: 2.5,
                  }}
                >
                  {valueIcons[value.icon]}
                </Box>
                <Typography variant="h6" component="h3" sx={{ mb: 1, lineHeight: 1.3 }}>
                  {value.title}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: "0.98rem", lineHeight: 1.6 }}>
                  {value.description}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
