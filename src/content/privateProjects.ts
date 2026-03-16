import type { ShowcaseCardItem } from './types';

export const privateProjects: ShowcaseCardItem[] = [
  {
    title: 'Cabal SDXL Trainer',
    description:
      'Built from ground-up trainer primarily for SDXL model finetuning and LoRA training. Particularly useful for fast prototyping, experimentation and custom arches. Features multiple non-standard features and advanced text handling.'
  },
  {
    title: 'VAE Trainer',
    description:
      'Custom trainer for Variational Autoencoders, in which all of my VAEs have been trained. Features many research paper implementations, as well as features exclusive to this trainer. Additionally includes strong augmentation factory and variable goals for experimentation.'
  },
  {
    title: 'CLIP Trainer',
    description:
      'This project targets models used as text encoders in many Diffusion Models. Has implementation from multiple papers, and allows for efficient training at low VRAM, which allows to achieve much better training, as CLIPs directly benefit from high batch.'
  },
  {
    title: 'Cabal Scraper',
    description:
      'A specialized scraper for Danbooru, Safebooru branch, and other boorus. Based highly parallelized worker structure, which allows to minimize bottlenecks. Includes multiple filters based on score, tags, resolution, similarity, and others. Allows to scrape in multiple models: standard id scrape, tag scrape (scrape specific tag), csv scrape (list of tags in csv table, with controls for specific range of scrape), cloud scrape (Scrape of ids with parallel archive preparation and upload to cloud storage), and some other utility scrape features.'
  },
  {
    title: 'Cabal HF Data Utils',
    description: 'Set of utilities for uploading and retrieving data from structured repositories on Huggingface.'
  },
  {
    title: 'SFR-DB',
    description:
      'A database for image retrieval based on similarity of features, particularly style. Utilizes Dinov2/3 for building embedding database, which then allows for comparison of them.'
  },
  {
    title: 'Chain Filering',
    description:
      'Custom node-based UI, specialized for highly customizable data filtering, utilizing AI models. Scalable across multiple GPUs.'
  },
  {
    title: '...And many others',
    description:
      'Other less significant, interesting, still in-development stage, or unrelated to ML projects.'
  }
];
