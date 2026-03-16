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
      },
      {
        repoId: 'Anzhc/MS-LC-EQ-D-VR_VAE',
        description:
          'An SDXL VAE lineup reproducing results of the EQ-VAE paper, while applying few fixes proposed in VIVAT paper. Significantly outperforming original SDXL vae and other EQ VAEs known at the time, while requiring relatively low compute to train.'
      },
      {
        repoId: 'Anzhc/Z-Image_Anime_VAE',
        description:
          'A Decoder-only finetune of the Flux1 VAE(Z-Image uses Flux 1 VAE), reducing oversharpening and jpeg artifacts of the original, helping anime art generation.'
      },
      {
        repoId: 'Anzhc/Noobai11-CLIP-L-and-BigG-Anime-Text-Encoders',
        description:
          "Special project testing text encoders in Noobai model, their performance in retrieval task, and finetuning them on an anime-specific dataset, as well as showcasing performance on the token count well beyond architectural limit of 77. (Refer to Post section for full research)"
      },
      {
        repoId: 'Anzhc/SDXL-Text-Encoder-Longer-CLIP-L',
        description:
          "Experimental finetune on smaller dataset, consisting of data only with 225 or more tokens, essentially pinning CLIP to 3+ chunks. Benchmarks show that CLIP is capable of retrieval far beyond it's limits, even at the range of 300 and even 400 tokens."
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
