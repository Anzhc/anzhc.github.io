import type { ShowcaseCardItem } from './types';
import clipPostImage from '../../media/clip_post.png';
import eqPostImage from '../../media/eq_post.png';

export const posts: ShowcaseCardItem[] = [
  {
    title: 'CLIPs in Noobai Model are Flawed',
    description:
      'A small research about text encoders in an anime model, finding task collapse, and consequently "reviving" it in CLIP L, which in turn improves generation quality. Additionally, finetuned CLIP BigG achieves strong R@1 performance on substantial validation set of ~5000 images - over 80% - at high token count.',
    href: 'https://www.reddit.com/r/StableDiffusion/comments/1o1u2zm/text_encoders_in_noobai_are_dramatically_flawed_a/',
    imageSrc: clipPostImage,
    imageAlt: 'Preview image for the CLIPs in Noobai research post'
  },
  {
    title: 'Halving Loss in Stable Diffusion with EQ VAE',
    description:
      'Practical application and outcomes of the EQ VAE in SDXL model, which leads to halving of the loss, and visually cleaner output.',
    href: 'https://www.reddit.com/r/StableDiffusion/comments/1mdn3bo/eqvae_halving_loss_in_stable_diffusion_and/',
    imageSrc: eqPostImage,
    imageAlt: 'Preview image for the EQ VAE Stable Diffusion post'
  }
];
