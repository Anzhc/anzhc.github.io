import type { NavItem, Profile } from './types';
import avatarImage from '../../media/pfp.jpg';

export const profile: Profile = {
  name: 'Anzhc',
  title: 'AI Enthusiast',
  intro: 'I try to make things happen.',
  avatarImage,
  avatarAlt: 'Anzhc avatar',
  primaryLinks: [
    { label: 'Email', href: 'mailto:anzhc1@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/Anzhc', external: true },
    { label: 'Hugging Face', href: 'https://huggingface.co/Anzhc', external: true }
  ]
};

export const navItems: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'models', label: 'Models' },
  { id: 'projects', label: 'Open Projects' },
  { id: 'website-work', label: 'Website Work' },
  { id: 'private-projects', label: 'Private Projects' },
  { id: 'posts', label: 'Posts' },
  { id: 'experience', label: 'Experience' }
];
