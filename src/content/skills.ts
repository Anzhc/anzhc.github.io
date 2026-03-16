import type { SkillGroup } from './types';

export const skillGroups: SkillGroup[] = [
  {
    title: 'Frontend Craft',
    description: 'Practical tools and patterns for shipping maintainable interfaces.',
    items: ['Vue 3', 'TypeScript', 'Vite', 'Design systems', 'Accessibility', 'Responsive UI']
  },
  {
    title: 'Product Delivery',
    description: 'Execution habits that keep teams moving without sacrificing quality.',
    items: ['Roadmap collaboration', 'Technical discovery', 'Prototyping', 'Cross-functional planning', 'QA handoff']
  },
  {
    title: 'Platform Thinking',
    description: 'System-level improvements that compound over multiple projects.',
    items: ['Component APIs', 'Performance tuning', 'Frontend architecture', 'Documentation', 'GitHub Actions']
  }
];
