import { Box } from "@mui/material";
import { useRef, useState } from "react";

import { prefersReducedMotion } from "@/animation/motionFlags";
import { ProjectMotion } from "@/animation/ProjectMotion";
import type { ProjectFilter } from "@/models/homeUi";
import type { Project } from "@/models/profile";
import { fonts, palette, transitionOut } from "@/theme/theme";

import { PageContainer, Section, SectionHeader } from "./layout";
import { PhotoSlot } from "./PhotoSlot";
import { Shape } from "./Shape";

type ProjectsSectionProps = {
  lead: string;
  projects: Project[];
  filters: ProjectFilter[];
  formatTags: (tags: string[]) => string;
  onOpen: (id: string) => void;
};

const TAG_SEPARATOR = "|";

type ProjectCardProps = Pick<ProjectsSectionProps, "formatTags" | "onOpen"> & {
  project: Project;
};

function ProjectCard({ project, formatTags, onOpen }: ProjectCardProps) {
  const open = () => onOpen(project.id);
  return (
    <Box data-card="" data-id={project.id} data-tags={project.tags.join(TAG_SEPARATOR)}>
      <Box
        data-card-inner=""
        onClick={open}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: "16px",
          backgroundColor: palette.white,
          color: palette.ink,
          cursor: "pointer",
          transition: `transform 0.45s ${transitionOut}, box-shadow 0.45s, background 0.45s`,
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 34px 60px -30px rgba(20,34,28,0.75)",
            backgroundColor: palette.offWhite,
          },
        }}
      >
        <Box
          sx={{ position: "relative", aspectRatio: "16 / 10", backgroundColor: palette.paperDeep }}
        >
          <PhotoSlot photo={project.cover} />
        </Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: "1.5rem 1.5rem 1.35rem" }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: "0.25rem 1rem",
              fontWeight: 700,
              fontSize: "0.92rem",
              color: palette.muted,
            }}
          >
            <span>{project.group}</span>
            <span>{project.year}</span>
          </Box>
          <Box
            component="h3"
            sx={{
              m: "0.6rem 0 0.5rem",
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: "clamp(1.5rem,2.6vw,1.8rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
            }}
          >
            {project.title}
          </Box>
          <Box
            component="p"
            sx={{ m: "0 0 1.25rem", fontSize: "1rem", lineHeight: 1.6, textWrap: "pretty" }}
          >
            {project.summary}
          </Box>
          <Box
            sx={{
              mt: "auto",
              pt: "1rem",
              borderTop: `1px solid ${palette.hairlineSoft}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <Box
              component="span"
              sx={{ fontWeight: 800, fontSize: "0.9rem", color: palette.green }}
            >
              {formatTags(project.tags)}
            </Box>
            <Box
              component="button"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                open();
              }}
              aria-label={`Ver projeto ${project.title}`}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                minHeight: "2.75rem",
                p: 0,
                border: 0,
                background: "transparent",
                font: "inherit",
                fontWeight: 800,
                fontSize: "0.95rem",
                color: palette.ink,
                cursor: "pointer",
              }}
            >
              Ver projeto
              <svg
                viewBox="0 0 24 24"
                width="17"
                height="17"
                fill="none"
                stroke={palette.coral}
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export function ProjectsSection({
  lead,
  projects,
  filters,
  formatTags,
  onOpen,
}: ProjectsSectionProps) {
  const [active, setActive] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const filtering = useRef(false);

  const selectFilter = (tag: string | null) => {
    const grid = gridRef.current;
    if (tag === active || filtering.current || grid === null) {
      return;
    }
    setActive(tag);
    filtering.current = true;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-card]"));
    const matches = (card: HTMLElement) =>
      tag === null || (card.dataset.tags ?? "").split(TAG_SEPARATOR).includes(tag);
    void new ProjectMotion(prefersReducedMotion()).filter(cards, matches).finally(() => {
      filtering.current = false;
    });
  };

  return (
    <Section id="projetos" label="Projetos" background={palette.green} color={palette.white}>
      <Shape
        kind="squiggle"
        color={palette.sun}
        size="12rem"
        parallax={0.15}
        placement={{ top: "clamp(0.75rem,2.5vw,2.25rem)", right: "7%" }}
      />
      <Shape
        kind="dot"
        color={palette.coral}
        size="4.25rem"
        parallax={0.2}
        placement={{ bottom: "5%", left: "-1.75rem" }}
      />
      <PageContainer>
        <SectionHeader title="Projetos" lead={lead} tone="light" />

        <Box
          data-reveal=""
          role="group"
          aria-label="Filtrar projetos"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.25rem 1.75rem",
            mt: "clamp(2.5rem,5vw,3.5rem)",
          }}
        >
          {filters.map((filter) => {
            const pressed = filter.tag === active;
            return (
              <Box
                key={filter.label}
                component="button"
                type="button"
                aria-pressed={pressed}
                onClick={() => selectFilter(filter.tag)}
                sx={{
                  minHeight: "2.75rem",
                  p: 0,
                  border: 0,
                  borderBottom: "3px solid",
                  borderBottomColor: pressed ? palette.sun : "transparent",
                  background: "transparent",
                  font: "inherit",
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  color: pressed ? palette.white : palette.mint,
                  cursor: "pointer",
                  transition: "color 0.25s, border-color 0.25s",
                  "&:hover": { color: palette.white },
                }}
              >
                {filter.label}
              </Box>
            );
          })}
        </Box>

        <Box
          ref={gridRef}
          data-stagger=""
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,22rem),1fr))",
            gap: "clamp(1rem,2.5vw,1.75rem)",
            mt: "2rem",
          }}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              formatTags={formatTags}
              onOpen={onOpen}
            />
          ))}
        </Box>
      </PageContainer>
    </Section>
  );
}
