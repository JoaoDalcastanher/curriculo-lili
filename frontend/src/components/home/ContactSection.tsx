import { Box } from "@mui/material";

import type { Contact } from "@/models/profile";
import { fonts, layout, palette } from "@/theme/theme";

type ContactSectionProps = {
  contact: Contact;
};

const arrow = (
  <svg
    viewBox="0 0 24 24"
    width="17"
    height="17"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

const linkBaseSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.6rem",
  minHeight: "3.25rem",
  px: "1.5rem",
  borderRadius: "0.7rem",
  fontWeight: 800,
  fontSize: "1rem",
  transition: "background 0.3s, transform 0.3s, color 0.3s",
} as const;

const primaryLinkSx = {
  ...linkBaseSx,
  backgroundColor: palette.white,
  color: palette.ink,
  "&:hover": { backgroundColor: palette.sun, color: palette.ink, transform: "translateY(-3px)" },
} as const;

const outlineLinkSx = {
  ...linkBaseSx,
  border: `2px solid ${palette.white}`,
  color: palette.white,
  "&:hover": { backgroundColor: palette.white, color: palette.ink, transform: "translateY(-3px)" },
} as const;

export function ContactSection({ contact }: ContactSectionProps) {
  return (
    <Box
      component="section"
      id="contato"
      aria-label="Contato"
      sx={{ scrollMarginTop: layout.headerHeight, pb: "clamp(3rem,6vw,5rem)" }}
    >
      <Box sx={{ maxWidth: layout.maxWidth, mx: "auto", px: layout.gutter }}>
        <Box
          data-reveal=""
          sx={{
            position: "relative",
            overflow: "hidden",
            p: "clamp(2.5rem,7vw,5.5rem) clamp(1.5rem,6vw,5rem)",
            borderRadius: "1.25rem",
            backgroundColor: palette.green,
            color: palette.white,
          }}
        >
          <Box
            aria-hidden="true"
            data-float=""
            sx={{
              position: "absolute",
              right: "-4rem",
              bottom: "-5rem",
              width: "16rem",
              height: "16rem",
              borderRadius: "50%",
              backgroundColor: palette.sun,
            }}
          />
          <Box
            aria-hidden="true"
            data-float=""
            sx={{
              position: "absolute",
              right: "9rem",
              bottom: "5.5rem",
              width: "3rem",
              height: "3rem",
              borderRadius: "50%",
              backgroundColor: palette.peach,
            }}
          />
          <Box sx={{ position: "relative", maxWidth: "38rem" }}>
            <Box
              component="h2"
              sx={{
                m: 0,
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: "clamp(3rem,8vw,5.75rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.045em",
              }}
            >
              {contact.title}
            </Box>
            <Box
              component="p"
              sx={{
                m: "1.5rem 0 0",
                maxWidth: "30rem",
                fontSize: "1.15rem",
                lineHeight: 1.6,
                textWrap: "pretty",
              }}
            >
              {contact.text}
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", mt: "2.25rem" }}>
              {contact.links.map((link, index) => {
                const external = link.kind !== "email";
                return (
                  <Box
                    key={link.kind}
                    component="a"
                    href={link.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    sx={index === 0 ? primaryLinkSx : outlineLinkSx}
                  >
                    {link.label}
                    {arrow}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
