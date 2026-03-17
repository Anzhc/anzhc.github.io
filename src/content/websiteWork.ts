import type { WebsiteWorkItem } from './types';
import aecImage from '../../media/AEC.png';

export const websiteWork: WebsiteWorkItem[] = [
  {
    title: 'ArcEnCiel.io',
    href: 'https://arcenciel.io',
    imageSrc: aecImage,
    imageAlt: 'ArcEnCie icon',
    descriptionBeforeLink:
      'I am one of the developers of AEC. My contributions to it include: ',
    linkLabel: 'Users page',
    linkHref: 'https://arcenciel.io/users',
    descriptionAfterLink:
      ' design, minor features to creator pages, bug fixes, moderation tools including implementation of moderation dashboard finished with Detection Models, and other features related to general design and QoL.'
  }
];
