// Domain models for the teacher profile (Policy 002 — reusable types live in models/).
// The actual content lives in `content/profile.ts`; components only receive these shapes.

/** A year range. `end: null` means "até hoje". */
export type YearRange = {
  start: number;
  end: number | null;
};

export type Stat = {
  value: number;
  label: string;
};

export type Hero = {
  greeting: string;
  specialty: string;
  tagline: string;
  photo: Photo;
};

/** A photo slot. `src: null` renders a friendly placeholder with the hint. */
export type Photo = {
  src: string | null;
  alt: string;
  hint: string;
};

export type ValueTone = "peach" | "sun" | "mint" | "sand";

export type ValueIcon = "heart" | "clock" | "sparkle" | "circles";

export type Value = {
  title: string;
  description: string;
  icon: ValueIcon;
  tone: ValueTone;
};

/** Quote with one highlighted fragment, rendered as `before <mark>highlight</mark> after`. */
export type Quote = {
  before: string;
  highlight: string;
  after: string;
  author: string;
  source: string;
};

export type About = {
  lead: string;
  paragraphs: string[];
  areasTitle: string;
  areas: string[];
  quote: Quote;
  valuesTitle: string;
  values: Value[];
};

export type ExperienceKind = "work" | "study";

export type Experience = {
  kind: ExperienceKind;
  role: string;
  school: string;
  period: YearRange;
  description: string;
};

export type Trajectory = {
  lead: string;
  experiences: Experience[];
};

export type ProjectStep = {
  title: string;
  description: string;
};

export type Testimonial = {
  text: string;
  author: string;
};

/**
 * A project or academic work. Only `id`, `title`, `kind`, `year`, `tags`,
 * `authors` and `reference` are required; the detail blocks (goal, steps,
 * learnings, gallery, testimonial) are hidden while empty.
 */
export type Project = {
  id: string;
  title: string;
  subtitle: string | null;
  /** e.g. "Apresentação em congresso". */
  kind: string;
  year: number;
  tags: string[];
  /** Authors as cited in the Lattes (e.g. "CUNHA, G. A."). */
  authors: string[];
  /** Full bibliographic reference, as in the Lattes. */
  reference: string;
  summary: string | null;
  goal: string | null;
  cover: Photo;
  steps: ProjectStep[];
  learnings: string[];
  gallery: Photo[];
  testimonial: Testimonial | null;
};

export type Projects = {
  lead: string;
  allLabel: string;
  /** Filter tags, in display order. */
  filters: string[];
  items: Project[];
};

export type Degree = {
  kind: string;
  title: string;
  institution: string;
  period: YearRange;
  note: string | null;
};

export type EventParticipation = {
  name: string;
  /** e.g. "Oficina", "Palestra". */
  kind: string;
  year: number;
};

export type Education = {
  degrees: Degree[];
  eventsTitle: string;
  events: EventParticipation[];
};

export type ContactKind = "email" | "lattes";

export type ContactLink = {
  kind: ContactKind;
  label: string;
  href: string;
};

export type Contact = {
  title: string;
  text: string;
  links: ContactLink[];
};

export type Profile = {
  name: string;
  fullName: string;
  title: string;
  hero: Hero;
  about: About;
  trajectory: Trajectory;
  projects: Projects;
  education: Education;
  contact: Contact;
};
