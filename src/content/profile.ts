import type { NavItem, Profile } from './types';
import avatarImage from '../../media/pfp.jpg';

export const profile: Profile = {
  name: 'Anzhc',
  title: 'Senior Frontend Engineer & Product-Focused Builder',
  location: 'Based in Austin, TX',
  intro:
    'I design and ship elegant interfaces for teams that care about clarity, performance, and durable product decisions.',
  avatarImage,
  avatarAlt: 'Jordan Vale portrait',
  summary:
    'Frontend engineer focused on clean product execution, durable UI systems, and interfaces that stay readable under real-world complexity.',
  availability: 'Open to staff-level frontend, design systems, and product engineering roles',
  primaryLinks: [
    { label: 'Email', href: 'mailto:email@mai.mail' },
    { label: 'GitHub', href: 'https://github.com/yourname', external: true },
    { label: 'Hugging Face', href: 'https://huggingface.co/yourname', external: true }
  ],
  stats: [
    { value: '8+', label: 'years shipping web products' },
    { value: '14', label: 'launches across SaaS and internal tools' },
    { value: '3', label: 'design systems scaled across teams' }
  ]
};

export const navItems: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'models', label: 'Models' },
  { id: 'projects', label: 'Projects' },
  { id: 'posts', label: 'Posts' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' }
];
