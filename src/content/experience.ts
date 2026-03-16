import type { ExperienceItem } from './types';

export const experience: ExperienceItem[] = [
  {
    company: 'Northstar Labs',
    role: 'Senior Frontend Engineer',
    period: '2022 - Present',
    location: 'Remote',
    summary:
      'Lead implementation across customer-facing product areas and internal platform improvements for a B2B operations suite.',
    achievements: [
      'Built a reusable UI foundation that reduced repeated feature delivery time across three product squads.',
      'Partnered with design to simplify high-density workflows and improve task completion for core user journeys.',
      'Introduced build and deployment guardrails that made releases more predictable for the frontend team.'
    ],
    tech: ['Vue', 'TypeScript', 'Vite', 'CSS architecture', 'Story-driven UI reviews'],
    website: 'https://example.com'
  },
  {
    company: 'Common Thread Studio',
    role: 'Frontend Engineer',
    period: '2019 - 2022',
    location: 'Chicago, IL',
    summary:
      'Worked across brand sites, product launches, and internal tools with an emphasis on UI quality and implementation speed.',
    achievements: [
      'Delivered a modular marketing site system that let the team launch new pages without duplicating layout code.',
      'Improved accessibility patterns and keyboard behavior across shared components used by multiple clients.',
      'Collaborated with backend and content teams to keep static deployments simple and reliable.'
    ],
    tech: ['Vue', 'JavaScript', 'SCSS', 'Static hosting', 'Content modeling']
  }
];
