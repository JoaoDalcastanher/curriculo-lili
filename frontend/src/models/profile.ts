// Domain models for the teacher profile (Policy 002 — reusable types live in models/).
// The actual content lives in `content/profile.ts`; components only receive these shapes.

export type ISOYearMonth = string; // "YYYY-MM"

export type Experience = {
  role: string;
  institution: string;
  location: string;
  start: ISOYearMonth;
  end: ISOYearMonth | null; // null = emprego atual
  description: string;
  highlights: string[];
};

export type Education = {
  degree: string;
  institution: string;
  start: ISOYearMonth;
  end: ISOYearMonth | null;
  note: string | null;
};

export type Value = {
  title: string;
  description: string;
  icon: ValueIcon;
};

export type ValueIcon = "heart" | "sprout" | "lightbulb" | "palette" | "chat" | "book";

export type ContactKind = "email" | "whatsapp" | "instagram" | "linkedin";

export type ContactLink = {
  kind: ContactKind;
  label: string;
  href: string;
};

export type Stat = {
  value: string;
  label: string;
};

export type Quote = {
  text: string;
  author: string;
};

export type Profile = {
  name: string;
  fullName: string;
  title: string;
  tagline: string;
  location: string;
  photoUrl: string | null;
  about: string[];
  quote: Quote | null;
  teachingSince: ISOYearMonth;
  subjects: string[];
  values: Value[];
  experiences: Experience[];
  education: Education[];
  contacts: ContactLink[];
};
