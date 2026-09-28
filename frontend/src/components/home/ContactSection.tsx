import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import type { ReactElement } from "react";

import type { ContactKind, ContactLink } from "@/models/profile";
import { fonts, palette } from "@/theme/theme";

import { Decoration } from "./Decoration";

const contactIcons: Record<ContactKind, ReactElement> = {
  email: <EmailRoundedIcon />,
  whatsapp: <WhatsAppIcon />,
  instagram: <InstagramIcon />,
  linkedin: <LinkedInIcon />,
};

type ContactSectionProps = {
  name: string;
  contacts: ContactLink[];
};

export function ContactSection({ name, contacts }: ContactSectionProps) {
  return (
    <Box id="contato" component="section" sx={{ py: { xs: 6, md: 10 }, scrollMarginTop: 72 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: "32px", md: "48px" },
            px: { xs: 3.5, md: 10 },
            py: { xs: 7, md: 11 },
            color: palette.white,
            background: `linear-gradient(135deg, ${palette.terracotta} 0%, #C9552F 60%, #B5472A 100%)`,
          }}
        >
          <Decoration
            shape="circle"
            color="rgba(255,255,255,0.08)"
            size={340}
            sx={{ top: -140, right: -100 }}
          />
          <Decoration
            shape="star"
            color={palette.mustard}
            size={54}
            rotate={18}
            sx={{ top: 36, right: { xs: 24, md: 90 } }}
          />
          <Decoration
            shape="squiggle"
            color="rgba(255,255,255,0.25)"
            size={140}
            sx={{ bottom: 10, left: -30 }}
          />
          <Stack spacing={3} sx={{ position: "relative", maxWidth: 720 }}>
            <Typography
              sx={{
                fontFamily: fonts.hand,
                fontSize: { xs: "1.7rem", md: "2rem" },
                color: palette.mustardSoft,
                lineHeight: 1,
              }}
            >
              vamos conversar?
            </Typography>
            <Typography variant="h2" component="h2" sx={{ color: palette.white }}>
              {`Escola, família ou curiosidade — a ${name} adora uma boa conversa.`}
            </Typography>
            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.5, pt: 2 }}>
              {contacts.map((contact) => (
                <Button
                  key={contact.kind}
                  href={contact.href}
                  target={contact.kind === "email" ? undefined : "_blank"}
                  rel={contact.kind === "email" ? undefined : "noopener noreferrer"}
                  startIcon={contactIcons[contact.kind]}
                  size="large"
                  sx={{
                    backgroundColor: palette.white,
                    color: palette.ink,
                    "&:hover": { backgroundColor: palette.mustardSoft },
                  }}
                >
                  {contact.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
