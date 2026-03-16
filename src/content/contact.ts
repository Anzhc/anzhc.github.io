import type { ContactContent } from './types';

export const contact: ContactContent = {
  heading: 'Let’s build something calm, useful, and durable.',
  message:
    'Use this section for hiring outreach, freelance inquiries, or a short call to connect. Keep it simple: one sentence is enough.',
  availability: 'Best for product engineering, frontend architecture, and design system work.',
  links: [
    { label: 'Email', value: 'avery@example.com', href: 'mailto:avery@example.com' },
    { label: 'LinkedIn', value: 'linkedin.com/in/yourname', href: 'https://linkedin.com/in/yourname' },
    { label: 'GitHub', value: 'github.com/yourname', href: 'https://github.com/yourname' }
  ]
};
