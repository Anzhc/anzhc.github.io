export type Theme = 'dark' | 'light';

export interface ActionLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface Profile {
  name: string;
  title: string;
  location: string;
  intro: string;
  avatarImage: string;
  avatarAlt: string;
  summary: string;
  availability: string;
  primaryLinks: ActionLink[];
  stats: StatItem[];
}

export interface AboutContent {
  lead: string;
  paragraphs: string[];
  highlights: string[];
}

export interface SkillGroup {
  title: string;
  description: string;
  items: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  achievements: string[];
  tech: string[];
  website?: string;
}

export interface ProjectItem {
  name: string;
  blurb: string;
  description: string;
  links: ActionLink[];
  stack: string[];
  highlights: string[];
}

export interface EducationItem {
  institution: string;
  program: string;
  period: string;
  location: string;
  details: string;
  extras: string[];
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
}

export interface ContactContent {
  heading: string;
  message: string;
  availability: string;
  links: ContactLink[];
}
