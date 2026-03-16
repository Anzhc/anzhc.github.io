import type { ProjectItem } from './types';

export const projects: ProjectItem[] = [
  {
    name: 'Signal Board',
    blurb: 'Minimal operating dashboard for product and support teams.',
    description:
      'A clean analytics surface that turns scattered operational data into a readable decision layer. Designed to keep scanning easy on both large monitors and smaller laptops.',
    links: [
      { label: 'Live Demo', href: 'https://example.com', external: true },
      { label: 'Repository', href: 'https://github.com/yourname/project', external: true }
    ],
    stack: ['Vue 3', 'TypeScript', 'Charts', 'REST APIs'],
    highlights: ['Card-based layout', 'Keyboard-friendly filters', 'Fast first paint on static hosting']
  },
  {
    name: 'Studio Portfolio System',
    blurb: 'Reusable portfolio template for service-led businesses.',
    description:
      'A content-first marketing framework with modular sections, polished typography, and lightweight animation. Intended for teams that need a premium presentation without a complex stack.',
    links: [{ label: 'Case Study', href: 'https://example.com/case-study', external: true }],
    stack: ['Vue 3', 'Vite', 'Content modules', 'GitHub Pages'],
    highlights: ['Single-page architecture', 'Theme persistence', 'Fast static deployment']
  }
];
