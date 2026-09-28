// Domain models for the teacher profile (Policy 002 — reusable types live in models/).
// The actual content lives in `content/profile.ts`; components only receive these shapes.

/** A year range. `end: null` means "até hoje". */
export type YearRange = {
  start: number;
  end: number | null;
};

export type Stat = {
  value: number;
  suffix: string;
  label: string;
};

export type Hero = {
  greeting: string;
  specialty: string;
  tagline: string;
  photo: Photo;
  stats: Stat[];
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
  areas: string[];
  quote: Quote;
  valuesTitle: string;
  values: Value[];
};

export type Experience = {
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

export type Project = {
  id: string;
  title: string;
  group: string;
  year: number;
  tags: string[];
  summary: string;
  goal: string;
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
  note: string;
};

export type Course = {
  name: string;
  hours: number | null;
  year: number;
};

export type Education = {
  degree: Degree;
  coursesTitle: string;
  courses: Course[];
};

export type ContactKind = "email" | "instagram" | "linkedin";

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
