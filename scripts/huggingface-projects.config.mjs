export const profileConfigs = [
  {
    id: 'anzhc',
    title: 'Personal',
    profileHref: 'https://huggingface.co/Anzhc',
    moreHref: 'https://huggingface.co/Anzhc/models',
    featuredItems: [
      {
        repoId: 'Anzhc/Anzhcs-VAEs',
        description:
          'Collection of VAE(Variational Autoencoder) models, experiments, and finetunes, particularly for SDXL, targetting improved visuals for generations.'
      },
      {
        repoId: 'Anzhc/Anzhcs_YOLOs',
        description:
          'Collection of YOLO models, encompassing detection, segmentation, classification and their downstream usage. Includes models made specifically for Adetailer, scoring models, narrow taggers and other utility applications.'
      }
    ]
  },
  {
    id: 'cabal-research',
    title: 'Cabal Research',
    profileHref: 'https://huggingface.co/CabalResearch',
    moreHref: 'https://huggingface.co/CabalResearch/models',
    featuredItems: [
      {
        repoId: 'CabalResearch/NoobAI-Flux2VAE-RectifiedFlow-0.3',
        description:
          'Direct continuation of NoobAI-Flux2VAE-RectifiedFlow, improving upon the earlier Prototype.'
      },
      {
        repoId: 'CabalResearch/NoobAI-Flux2VAE-RectifiedFlow',
        description:
          'Experimental architecture of an SDXL model using new VAE, bringing 32 channel latents to the arch. An early Prototype, trained in a tight budget.'
      }
    ]
  },
  {
    id: 'chenkin-rf',
    title: 'ChenkinRF',
    profileHref: 'https://huggingface.co/ChenkinRF',
    moreHref: 'https://huggingface.co/ChenkinRF/models',
    featuredItems: [
      {
        repoId: 'ChenkinRF/ChenkinNoob-XL-v0.3-Rectified-Flow',
        description:
          'Continuation of ChenkinNoob-XL-v0.2-Rectified-Flow, particularly improving character knowledge, sharpness and stability of the model.'
      },
      {
        repoId: 'ChenkinRF/ChenkinNoob-XL-v0.2-Rectified-Flow',
        description: 'Initial conversion of Chenkin model from eps prediction to rectified flow.'
      }
    ]
  }
];
