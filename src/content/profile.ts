import type { NavItem, Profile } from './types';

export const profile: Profile = {
  name: 'Jordan Vale',
  title: 'Senior Frontend Engineer & Product-Focused Builder',
  location: 'Based in Austin, TX',
  intro:
    'I design and ship elegant interfaces for teams that care about clarity, performance, and durable product decisions.',
  summary:
    'Frontend engineer focused on clean product execution, durable UI systems, and interfaces that stay readable under real-world complexity.',
  availability: 'Open to staff-level frontend, design systems, and product engineering roles',
  primaryLinks: [
    { label: 'Email Me', href: 'mailto:avery@example.com' },
    { label: 'GitHub', href: 'https://github.com/yourname', external: true },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/yourname', external: true }
  ],
  stats: [
    { value: '8+', label: 'years shipping web products' },
    { value: '14', label: 'launches across SaaS and internal tools' },
    { value: '3', label: 'design systems scaled across teams' }
  ]
};

export const navItems: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' }
];
