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

export interface Profile {
  name: string;
  title: string;
  intro: string;
  avatarImage: string;
  avatarAlt: string;
  primaryLinks: ActionLink[];
}

export interface AboutContent {
  lead: string;
  paragraphs: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location?: string;
  summary: string;
  achievements?: string[];
  tech?: string[];
  website?: string;
}

export interface EducationItem {
  institution: string;
  program: string;
  period: string;
  location?: string;
  details?: string;
  extras?: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  repoPath: string;
  href: string;
  description: string;
  monthlyDownloads: number;
}

export interface ProjectGroup {
  id: string;
  title: string;
  sourceHref: string;
  moreCount: number;
  moreHref: string;
  items: ProjectItem[];
}

export interface ProjectsContent {
  generatedAt: string;
  groups: ProjectGroup[];
}

export interface ShowcaseCardItem {
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
}
