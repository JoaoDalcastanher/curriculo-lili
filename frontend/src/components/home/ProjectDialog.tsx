// Project details. Opens by morphing out of its card (shared-element motion)
// and closes back into it. Escape, the close button or a click on the
// backdrop close it; focus moves in on open and back to the card on close.

import { Box } from "@mui/material";
import { useEffect, useLayoutEffect, useRef } from "react";

import { prefersReducedMotion } from "@/animation/motionFlags";
import { ProjectMotion } from "@/animation/ProjectMotion";
import type { Project } from "@/models/profile";
import { fonts, palette } from "@/theme/theme";

import { PhotoSlot } from "./PhotoSlot";

type ProjectDialogProps = {
  project: Project;
  /** Skip the opening morph (e.g. when opened from the URL on load). */
  instant: boolean;
  formatTags: (tags: string[]) => string;
  formatAuthors: (authors: string[]) => string;
  formatStepNumber: (index: number) => string;
  onClosed: () => void;
};

function findCard(id: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-card][data-id="${id}"] [data-card-inner]`);
}

const sectionTitleSx = {
  m: "3rem 0 1.25rem",
  fontFamily: fonts.display,
  fontWeight: 700,
  fontSize: "1.6rem",
  letterSpacing: "-0.02em",
} as const;

const edgeRadius = "clamp(0px, calc((100vw - 640px) * 0.08), 24px)";

export function ProjectDialog({
  project,
  instant,
  formatTags,
  formatAuthors,
  formatStepNumber,
  onClosed,
}: ProjectDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const busy = useRef(false);
  // A close requested while the opening morph runs is replayed once it ends.
  const closeRequested = useRef(false);

  const parts = () => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (panel === null || backdrop === null) {
      return null;
    }
    return {
      panel,
      backdrop,
      fades: Array.from(panel.querySelectorAll<HTMLElement>("[data-panel-fade]")),
    };
  };

  const close = () => {
    const dialogParts = parts();
    if (dialogParts === null) {
      return;
    }
    if (busy.current) {
      closeRequested.current = true;
      return;
    }
    busy.current = true;
    const card = findCard(project.id);
    void new ProjectMotion(prefersReducedMotion()).close(card, dialogParts).finally(() => {
      busy.current = false;
      onClosed();
      card?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    });
  };

  useLayoutEffect(() => {
    const dialogParts = parts();
    if (dialogParts === null) {
      return;
    }
    busy.current = true;
    const card = findCard(project.id);
    const motion = new ProjectMotion(instant || prefersReducedMotion());
    void motion.open(card, dialogParts).finally(() => {
      busy.current = false;
      if (closeRequested.current) {
        close();
      }
    });
    closeRef.current?.focus({ preventScroll: true });
    // Only on mount: the dialog is remounted for each project.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          close();
        }
      }}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: "clamp(0px, calc((100vw - 640px) * 0.08), 40px)",
      }}
    >
      <Box
        ref={backdropRef}
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: palette.backdrop,
          pointerEvents: "none",
        }}
      />
      <Box
        ref={panelRef}
        data-panel=""
        role="dialog"
        aria-modal="true"
        aria-labelledby="projeto-titulo"
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "56rem",
          height: "100%",
          overflowY: "auto",
          overscrollBehavior: "contain",
          backgroundColor: palette.white,
          color: palette.ink,
          borderRadius: edgeRadius,
        }}
      >
        <Box
          data-panel-fade=""
          sx={{
            position: "sticky",
            top: 0,
            height: 0,
            zIndex: 3,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Box
            ref={closeRef}
            component="button"
            type="button"
            onClick={close}
            sx={{
              m: "0.9rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              minHeight: "2.75rem",
              px: "1rem",
              border: 0,
              borderRadius: "0.6rem",
              backgroundColor: palette.white,
              color: palette.ink,
              font: "inherit",
              fontWeight: 800,
              fontSize: "0.95rem",
              cursor: "pointer",
              boxShadow: "0 8px 20px -10px rgba(34,51,44,0.5)",
              transition: "background 0.25s",
              "&:hover": { backgroundColor: palette.mint },
            }}
          >
            Fechar
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </Box>
        </Box>

        <Box
          sx={{ position: "relative", aspectRatio: "16 / 10", backgroundColor: palette.paperDeep }}
        >
          <PhotoSlot photo={project.cover} eager />
        </Box>

        <Box sx={{ p: "clamp(1.5rem,4.5vw,3rem) clamp(1.5rem,4.5vw,3rem) 0" }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: "0.25rem 1rem",
              fontWeight: 700,
              fontSize: "1rem",
              color: palette.muted,
            }}
          >
            <span>{project.kind}</span>
            <span>{project.year}</span>
          </Box>
          <Box
            component="h2"
            id="projeto-titulo"
            sx={{
              m: "0.6rem 0 0.75rem",
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: "clamp(2.2rem,5.5vw,3.6rem)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            {project.title}
          </Box>
          {project.subtitle !== null && (
            <Box
              component="p"
              sx={{
                m: "0 0 1rem",
                fontFamily: fonts.display,
                fontWeight: 500,
                fontSize: "clamp(1.2rem,2.4vw,1.45rem)",
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
                color: palette.ink,
                textWrap: "pretty",
              }}
            >
              {project.subtitle}
            </Box>
          )}
          <Box component="p" sx={{ m: 0, fontWeight: 800, fontSize: "1rem", color: palette.green }}>
            {formatTags(project.tags)}
          </Box>
        </Box>

        <Box
          data-panel-fade=""
          sx={{ p: "clamp(2rem,4.5vw,3rem) clamp(1.5rem,4.5vw,3rem) clamp(2.5rem,5vw,3.5rem)" }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,18rem),1fr))",
              gap: "2rem 3rem",
              pt: "1.5rem",
              borderTop: "1px solid rgba(34,51,44,0.14)",
            }}
          >
            <div>
              <Box component="h3" sx={{ m: "0 0 0.6rem", fontWeight: 800, fontSize: "1rem" }}>
                Autoria
              </Box>
              <Box component="p" sx={{ m: 0, fontSize: "1.02rem", lineHeight: 1.6 }}>
                {formatAuthors(project.authors)}
              </Box>
            </div>
            <div>
              <Box component="h3" sx={{ m: "0 0 0.6rem", fontWeight: 800, fontSize: "1rem" }}>
                Referência
              </Box>
              <Box
                component="p"
                sx={{
                  m: 0,
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  color: palette.muted,
                  textWrap: "pretty",
                }}
              >
                {project.reference}
              </Box>
            </div>
          </Box>

          {(project.goal !== null || project.learnings.length > 0) && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,18rem),1fr))",
                gap: "2rem 3rem",
                mt: "3rem",
              }}
            >
              {project.goal !== null && (
                <div>
                  <Box component="h3" sx={{ m: "0 0 0.6rem", fontWeight: 800, fontSize: "1rem" }}>
                    Objetivo
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      m: 0,
                      fontFamily: fonts.display,
                      fontWeight: 500,
                      fontSize: "1.3rem",
                      lineHeight: 1.4,
                      letterSpacing: "-0.01em",
                      textWrap: "pretty",
                    }}
                  >
                    {project.goal}
                  </Box>
                </div>
              )}
              {project.learnings.length > 0 && (
                <div>
                  <Box component="h3" sx={{ m: "0 0 0.3rem", fontWeight: 800, fontSize: "1rem" }}>
                    O que as crianças aprenderam e produziram
                  </Box>
                  <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
                    {project.learnings.map((learning) => (
                      <Box
                        key={learning}
                        component="li"
                        sx={{
                          display: "flex",
                          gap: "0.75rem",
                          py: "0.65rem",
                          borderBottom: `1px solid ${palette.hairlineSoft}`,
                          fontSize: "1.02rem",
                          lineHeight: 1.5,
                        }}
                      >
                        <Box
                          component="span"
                          aria-hidden="true"
                          sx={{
                            flex: "none",
                            mt: "0.55rem",
                            width: "0.5rem",
                            height: "0.5rem",
                            backgroundColor: palette.coral,
                            transform: "rotate(45deg)",
                          }}
                        />
                        <span>{learning}</span>
                      </Box>
                    ))}
                  </Box>
                </div>
              )}
            </Box>
          )}

          {project.steps.length > 0 && (
            <>
              <Box component="h3" sx={sectionTitleSx}>
                Como foi feito
              </Box>
              <Box
                component="ol"
                sx={{
                  listStyle: "none",
                  m: 0,
                  p: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,15rem),1fr))",
                  gap: "1.5rem 2rem",
                }}
              >
                {project.steps.map((step, index) => (
                  <li key={step.title}>
                    <Box
                      aria-hidden="true"
                      sx={{
                        fontFamily: fonts.display,
                        fontWeight: 700,
                        fontSize: "2.4rem",
                        lineHeight: 1,
                        letterSpacing: "-0.04em",
                        color: palette.green,
                      }}
                    >
                      {formatStepNumber(index)}
                    </Box>
                    <Box
                      aria-hidden="true"
                      sx={{
                        width: "2rem",
                        height: "4px",
                        m: "0.7rem 0 0.9rem",
                        backgroundColor: palette.sun,
                      }}
                    />
                    <Box
                      component="h4"
                      sx={{ m: "0 0 0.35rem", fontWeight: 800, fontSize: "1.08rem" }}
                    >
                      {step.title}
                    </Box>
                    <Box
                      component="p"
                      sx={{
                        m: 0,
                        fontSize: "1rem",
                        lineHeight: 1.6,
                        color: palette.muted,
                        textWrap: "pretty",
                      }}
                    >
                      {step.description}
                    </Box>
                  </li>
                ))}
              </Box>
            </>
          )}

          {project.gallery.length > 0 && (
            <>
              <Box component="h3" sx={sectionTitleSx}>
                Galeria
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,14rem),1fr))",
                  gap: "0.75rem",
                }}
              >
                {project.gallery.map((photo) => (
                  <Box
                    key={photo.alt}
                    sx={{
                      position: "relative",
                      aspectRatio: "4 / 3",
                      borderRadius: "0.75rem",
                      overflow: "hidden",
                      backgroundColor: palette.paperDeep,
                    }}
                  >
                    <PhotoSlot photo={photo} />
                  </Box>
                ))}
              </Box>
            </>
          )}

          {project.testimonial !== null && (
            <Box
              component="figure"
              sx={{
                m: "3rem 0 0",
                p: "clamp(1.75rem,4vw,2.5rem)",
                borderRadius: "1rem",
                backgroundColor: palette.mint,
              }}
            >
              <Box
                component="blockquote"
                sx={{
                  m: 0,
                  fontFamily: fonts.display,
                  fontWeight: 500,
                  fontSize: "clamp(1.3rem,2.8vw,1.7rem)",
                  lineHeight: 1.3,
                  letterSpacing: "-0.015em",
                  textWrap: "pretty",
                }}
              >
                {`“${project.testimonial.text}”`}
              </Box>
              <Box
                component="figcaption"
                sx={{
                  mt: "1rem",
                  fontFamily: fonts.hand,
                  fontWeight: 700,
                  fontSize: "1.6rem",
                  lineHeight: 1,
                  color: palette.green,
                }}
              >
                {project.testimonial.author}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
