import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { Box, Container, Stack, Typography } from "@mui/material";

import type { Education } from "@/models/profile";
import { fonts, palette } from "@/theme/theme";
import { formatPeriod } from "@/utils/datetime";

import { Decoration } from "./Decoration";
import { SectionHeading } from "./SectionHeading";

type EducationSectionProps = {
  education: Education[];
};

const accents = [palette.terracotta, palette.sage, palette.mustard, palette.sky] as const;

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <Box
      id="formacao"
      component="section"
      sx={{ position: "relative", overflow: "hidden", py: { xs: 10, md: 14 }, scrollMarginTop: 72 }}
    >
      <Decoration shape="ring" color={palette.sageSoft} size={220} sx={{ top: -60, right: -70 }} />
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <SectionHeading eyebrow="sempre aprendendo" title="Formação" />
        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          {education.map((item, index) => {
            const accent = accents[index % accents.length];
            return (
              <Box
                key={`${item.institution}-${item.degree}`}
                sx={{
                  position: "relative",
                  p: { xs: 3.5, md: 4.5 },
                  borderRadius: "28px",
                  backgroundColor: palette.white,
                  border: `1.5px solid ${palette.paperDeep}`,
                  overflow: "hidden",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 8,
                    backgroundColor: accent,
                  },
                }}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: accent }}>
                    <SchoolRoundedIcon />
                    <Typography sx={{ fontFamily: fonts.hand, fontSize: "1.5rem", lineHeight: 1 }}>
                      {formatPeriod(item.start, item.end)}
                    </Typography>
                  </Stack>
                  <Typography variant="h4" component="h3">
                    {item.degree}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: palette.inkSoft }}>
                    {item.institution}
                  </Typography>
                  {item.note !== null && (
                    <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
                      {item.note}
                    </Typography>
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
