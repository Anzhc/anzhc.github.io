import type { ExperienceItem } from './types';

export const experience: ExperienceItem[] = [
  {
    company: 'Self-employed',
    role: 'Freelance Artist / Asset Creator / ML Specialist',
    period: '2019 - Today',
    summary:
      "Main occupation. I've delivered multiple hundreds of commissions, then pivoted to asset creation, for which later I've created semi-automated pipelines with usage of YOLO models. Additionally, I've been commissioned to develop datasets for and train some of the Detection/Segmentation Models.\n\nMy later work revolves heavily around large training runs and more diverse models, like VAEs, CLIPs and various heads on top of pretrained models. Specifically for purposes of Cabal Research group. That also extends to further development of various YOLO models, particularly for narrow tagging purposes."
  },
  {
    company: 'Pose Labs (Temporary contract)',
    role: 'ML Researcher',
    period: '08.2023 - 03.2024',
    summary:
      'A temporary position at a startup. My main work there was research of photo angles, data processing for further training, training of YOLO models for face detection and adjacent features, as well as research write-ups on the pipelines with them, effect of IP-Adapter in specific setups and general automated likeness transfer in early Stable Diffusion days.'
  }
];
