import manifest from '@/assets/media-manifest.json';

export type CategorySlug = 'celebrity' | 'beauty' | 'editorial' | 'advertising' | 'film' | 'sfx';

export type MediaItem = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category: string;
  type: 'image' | 'video';
  filename: string;
  durationSeconds?: number;
};

type ManifestAsset = {
  derivative_filename: string;
  derivative_path: string;
  media_type: 'image' | 'video';
  category: string;
  derivative_width: number;
  derivative_height: number;
  duration_seconds?: number;
};

type ManifestFile = {
  counts: {
    unique_assets: number;
  };
  assets: ManifestAsset[];
};

const data = manifest as ManifestFile;

const altFromFilename = (filename: string) =>
  filename
    .replace(/\.[^.]+$/, '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const allMedia: MediaItem[] = data.assets.map((asset) => ({
  id: asset.derivative_filename,
  src: `/${asset.derivative_path.replace(/^public\//, '')}`,
  alt: altFromFilename(asset.derivative_filename),
  width: asset.derivative_width,
  height: asset.derivative_height,
  category: asset.category,
  type: asset.media_type,
  filename: asset.derivative_filename,
  durationSeconds: asset.duration_seconds,
}));

/* Legacy Instagram references were removed because their source files were not included in the repository.
   All displayed media below is resolved from committed local assets. */
const instagramMedia: MediaItem[] = [
  {
    id: 'instagram-bymsgratia-DXH-CXrEnwX',
    src: '/media/instagram/bymsgratia/DXH-CXrEnwX.jpg',
    alt: 'Soft beauty portrait with an elegant updo',
    width: 1080,
    height: 1390,
    category: 'beauty',
    type: 'image',
    filename: 'DXH-CXrEnwX.jpg',
  },
  {
    id: 'instagram-bymsgratia-DXH9Mg4kuvC',
    src: '/media/instagram/bymsgratia/DXH9Mg4kuvC.jpg',
    alt: 'Natural blonde beauty portrait',
    width: 1080,
    height: 1440,
    category: 'beauty',
    type: 'image',
    filename: 'DXH9Mg4kuvC.jpg',
  },
  {
    id: 'instagram-bymsgratia-DXH_8CZkjYp',
    src: '/media/instagram/bymsgratia/DXH_8CZkjYp.jpg',
    alt: 'Classic red lip beauty look',
    width: 1080,
    height: 1391,
    category: 'beauty',
    type: 'image',
    filename: 'DXH_8CZkjYp.jpg',
  },
  {
    id: 'instagram-bymsgratia-DYOj0colFOD',
    src: '/media/instagram/bymsgratia/DYOj0colFOD.jpg',
    alt: 'Sculpted red carpet makeup',
    width: 1080,
    height: 1440,
    category: 'beauty',
    type: 'image',
    filename: 'DYOj0colFOD.jpg',
  },
  {
    id: 'instagram-bymsgratia-DYOlf-plD-V',
    src: '/media/instagram/bymsgratia/DYOlf-plD-V.jpg',
    alt: 'Performance beauty look with a dramatic veil',
    width: 1080,
    height: 1439,
    category: 'creative',
    type: 'image',
    filename: 'DYOlf-plD-V.jpg',
  },
  {
    id: 'instagram-bymsgratia-DYOiT1DFDJP',
    src: '/media/instagram/bymsgratia/DYOiT1DFDJP.jpg',
    alt: 'Colorful character makeup for performance',
    width: 1080,
    height: 1365,
    category: 'creative',
    type: 'image',
    filename: 'DYOiT1DFDJP.jpg',
  },
  {
    id: 'instagram-bymsgratia-DaBe2Nokull',
    src: '/media/instagram/bymsgratia/DaBe2Nokull.jpg',
    alt: 'Cinematic subway action still',
    width: 1080,
    height: 1080,
    category: 'creative',
    type: 'image',
    filename: 'DaBe2Nokull.jpg',
  },
  {
    id: 'instagram-bymsgratia-DaBhI8Ako2J',
    src: '/media/instagram/bymsgratia/DaBhI8Ako2J.jpg',
    alt: 'Cinematic subway character still',
    width: 1080,
    height: 1079,
    category: 'creative',
    type: 'image',
    filename: 'DaBhI8Ako2J.jpg',
  },
  {
    id: 'instagram-bymsgratia-Daf7F_OlJXi',
    src: '/media/instagram/bymsgratia/Daf7F_OlJXi.jpg',
    alt: 'Black and white wet-look beauty portrait',
    width: 1080,
    height: 1439,
    category: 'beauty',
    type: 'image',
    filename: 'Daf7F_OlJXi.jpg',
  },
  {
    id: 'instagram-bymsgratia-Daf_ep_FBPQ',
    src: '/media/instagram/bymsgratia/Daf_ep_FBPQ.jpg',
    alt: 'Black and white profile beauty portrait',
    width: 1080,
    height: 1440,
    category: 'beauty',
    type: 'image',
    filename: 'Daf_ep_FBPQ.jpg',
  },
  {
    id: 'instagram-msgratia-Ct1zCWXPw-Y',
    src: '/media/instagram/msgratia/Ct1zCWXPw-Y.jpg',
    alt: 'Detailed old age prosthetic makeup',
    width: 720,
    height: 900,
    category: 'special-effects',
    type: 'image',
    filename: 'Ct1zCWXPw-Y.jpg',
  },
  {
    id: 'instagram-msgratia-CzMVXdFvJ4j',
    src: '/media/instagram/msgratia/CzMVXdFvJ4j.jpg',
    alt: 'Practical creature character makeup',
    width: 1080,
    height: 1350,
    category: 'special-effects',
    type: 'image',
    filename: 'CzMVXdFvJ4j.jpg',
  },
  {
    id: 'instagram-msgratia-CvsvVR6S6Ul',
    src: '/media/instagram/msgratia/CvsvVR6S6Ul.jpg',
    alt: 'Wet-look editorial beauty portrait',
    width: 1080,
    height: 1350,
    category: 'beauty',
    type: 'image',
    filename: 'CvsvVR6S6Ul.jpg',
  },
  {
    id: 'instagram-msgratia-Cvu57WxSshH',
    src: '/media/instagram/msgratia/Cvu57WxSshH.jpg',
    alt: 'Natural editorial portrait',
    width: 1080,
    height: 1350,
    category: 'beauty',
    type: 'image',
    filename: 'Cvu57WxSshH.jpg',
  },
  {
    id: 'instagram-msgratia-DXaGdxqkvmO',
    src: '/media/instagram/msgratia/DXaGdxqkvmO.jpg',
    alt: 'Polished pastel editorial beauty',
    width: 1080,
    height: 1439,
    category: 'beauty',
    type: 'image',
    filename: 'DXaGdxqkvmO.jpg',
  },
  {
    id: 'instagram-msgratia-DXPyEIeEtJ4',
    src: '/media/instagram/msgratia/DXPyEIeEtJ4.jpg',
    alt: 'Black and white period character still',
    width: 1080,
    height: 1440,
    category: 'creative',
    type: 'image',
    filename: 'DXPyEIeEtJ4.jpg',
  },
  {
    id: 'instagram-msgratia-CwTPz4Ev1K3',
    src: '/media/instagram/msgratia/CwTPz4Ev1K3.jpg',
    alt: 'Graphic science fiction character makeup',
    width: 1080,
    height: 1350,
    category: 'creative',
    type: 'image',
    filename: 'CwTPz4Ev1K3.jpg',
  },
  {
    id: 'instagram-msgratia-C-n0Qa-SXRP',
    src: '/media/instagram/msgratia/C-n0Qa-SXRP.jpg',
    alt: 'Costumed character production still',
    width: 1080,
    height: 1080,
    category: 'creative',
    type: 'image',
    filename: 'C-n0Qa-SXRP.jpg',
  },
  {
    id: 'instagram-msgratia-C07naKxvx4K',
    src: '/media/instagram/msgratia/C07naKxvx4K.jpg',
    alt: 'Period film character makeup',
    width: 1080,
    height: 1343,
    category: 'creative',
    type: 'image',
    filename: 'C07naKxvx4K.jpg',
  },
  {
    id: 'instagram-msgratia-DXPnnsemUz0',
    src: '/media/instagram/msgratia/DXPnnsemUz0.jpg',
    alt: 'Horror character makeup',
    width: 1080,
    height: 1351,
    category: 'special-effects',
    type: 'image',
    filename: 'DXPnnsemUz0.jpg',
  },
  {
    id: 'instagram-msgratia-DXaIFJrEq05',
    src: '/media/instagram/msgratia/DXaIFJrEq05.jpg',
    alt: 'Snowbound creature character work',
    width: 1080,
    height: 1438,
    category: 'special-effects',
    type: 'image',
    filename: 'DXaIFJrEq05.jpg',
  },
];

const creditMedia: MediaItem[] = [
  {
    id: 'emancipation-credit-poster.webp',
    src: '/media/emancipation-credit-poster.webp',
    alt: 'Emancipation poster featuring Will Smith',
    width: 1167,
    height: 1463,
    category: 'film',
    type: 'image',
    filename: 'emancipation-credit-poster.webp',
  },
  {
    id: 'bride-credit-poster.webp',
    src: '/media/bride-credit-poster.webp',
    alt: 'The Bride poster featuring Jessie Buckley and Christian Bale',
    width: 1080,
    height: 1351,
    category: 'film',
    type: 'image',
    filename: 'bride-credit-poster.webp',
  },
  {
    id: 'digger-credit-poster.webp',
    src: '/media/digger-credit-poster.webp',
    alt: 'Digger poster featuring Tom Cruise',
    width: 1095,
    height: 1372,
    category: 'film',
    type: 'image',
    filename: 'digger-credit-poster.webp',
  },
  {
    id: 'ahsoka-credit-poster.webp',
    src: '/media/ahsoka-credit-poster.webp',
    alt: 'Star Wars Ahsoka poster',
    width: 1156,
    height: 1383,
    category: 'film',
    type: 'image',
    filename: 'ahsoka-credit-poster.webp',
  },
  {
    id: 'maestro-credit-poster.webp',
    src: '/media/maestro-credit-poster.webp',
    alt: 'Maestro poster featuring Carey Mulligan and Bradley Cooper',
    width: 1126,
    height: 1361,
    category: 'film',
    type: 'image',
    filename: 'maestro-credit-poster.webp',
  },
  {
    id: 'deadpool-wolverine-credit-still.webp',
    src: '/media/deadpool-wolverine-credit-still.webp',
    alt: 'Deadpool and Wolverine sitting together in a forest',
    width: 1116,
    height: 1124,
    category: 'film',
    type: 'image',
    filename: 'deadpool-wolverine-credit-still.webp',
  },
];

const mediaLookup = new Map([...allMedia, ...creditMedia].map((item) => [item.filename, item]));

const pickMedia = (filenames: string[]) =>
  filenames
    .map((filename) => mediaLookup.get(filename))
    .filter((item): item is MediaItem => Boolean(item));

export const site = {
  name: 'MS Gratia',
  title: 'MS Gratia — Makeup & Special Effects Artist',
  description:
    'Editorial portfolio for LA-based makeup and special effects artist Gratia, featuring beauty, creative, film, television, and prosthetic work.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://msgratia.vercel.app',
  email: 'gratiamalk@gmail.com',
  phone: '323-633-7343',
  instagram: '@msgratia',
  instagramUrl: 'https://www.instagram.com/msgratia/',
  workInstagram: '@bymsgratia',
  workInstagramUrl: 'https://www.instagram.com/bymsgratia/',
  aboutCopy: [
    "I'm a LA-based makeup and special effects artist, specializing in film and TV. I've had the privilege of working on numerous production projects and collaborating with a variety of special effects shops in Los Angeles.",
    "I love collaborating with other creatives to bring ideas to life. Let's team up and make something amazing!",
  ],
  totalAssets: data.counts.unique_assets + creditMedia.length,
};

export const navigation = [
  { href: '/celebrity', label: 'Celebrity' },
  { href: '/beauty', label: 'Beauty' },
  { href: '/editorial', label: 'Editorial' },
  { href: '/advertising', label: 'Advertising' },
  { href: '/film', label: 'Film' },
  { href: '/sfx', label: 'SFX' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

const advertisingMedia = allMedia.filter(
  (item) => (item.category === 'branding' || /campaign|brand|converse|quest|fleur|denim|nfl|retail|testimonial/.test(item.filename)) && item.type === 'image',
);

const filmMedia = pickMedia([
  'emancipation-credit-poster.webp',
  'bride-credit-poster.webp',
  'digger-credit-poster.webp',
  'ahsoka-credit-poster.webp',
  'maestro-credit-poster.webp',
  'deadpool-wolverine-credit-still.webp',
  'guardians-three-poster.webp',
  'dogtooth-poster-design.webp',
  'dead-ringers-poster.webp',
  'muse-compliance-title-card.webp',
]);

export const categories: Array<{
  slug: CategorySlug;
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  cover: MediaItem;
  preview: MediaItem[];
  items: MediaItem[];
}> = [
  {
    slug: 'celebrity',
    title: 'Celebrity',
    shortTitle: 'Celebrity',
    eyebrow: 'Celebrity',
    description: 'Camera-ready makeup for talent, appearances, and portraiture.',
    cover: mediaLookup.get('marjorie-beauty-portrait.webp')!,
    preview: pickMedia(['marjorie-beauty-portrait.webp', 'editorial-male-portrait.webp', 'coco-headshot-portrait.webp']),
    items: pickMedia(['marjorie-beauty-portrait.webp', 'editorial-male-portrait.webp', 'coco-headshot-portrait.webp', 'jerome-male-portrait.webp']),
  },
  {
    slug: 'beauty',
    title: 'Beauty',
    shortTitle: 'Beauty',
    eyebrow: 'Beauty',
    description: 'Polished beauty makeup and refined portrait work.',
    cover: mediaLookup.get('blue-hand-beauty-portrait.webp')!,
    preview: pickMedia(['blue-hand-beauty-portrait.webp', 'sheila-flower-beauty.webp', 'imats-neon-beauty.webp']),
    items: pickMedia([
      'blue-hand-beauty-portrait.webp',
      'sheila-flower-beauty.webp',
      'imats-neon-beauty.webp',
      'pink-eye-beauty.webp',
      'teal-mohawk-beauty.webp',
      'marjorie-beauty-portrait.webp',
    ]),
  },
  {
    slug: 'editorial',
    title: 'Editorial',
    shortTitle: 'Editorial',
    eyebrow: 'Editorial',
    description: 'Fashion, performance, and concept-driven image making.',
    cover: mediaLookup.get('painted-body-profile.webp')!,
    preview: pickMedia(['painted-body-profile.webp', 'surya-creative-beauty.webp', 'woods-fantasy-portrait.webp']),
    items: pickMedia(['painted-body-profile.webp', 'surya-creative-beauty.webp', 'woods-fantasy-portrait.webp', 'ice-queen-bodypaint.webp', 'gold-body-beauty.webp']),
  },
  {
    slug: 'advertising',
    title: 'Advertising',
    shortTitle: 'Advertising',
    eyebrow: 'Advertising',
    description: 'Commercial, campaign, and branded production work.',
    cover: mediaLookup.get('meta-quest-two-still.webp')!,
    preview: advertisingMedia.slice(0, 3),
    items: advertisingMedia,
  },
  {
    slug: 'film',
    title: 'Film',
    shortTitle: 'Film',
    eyebrow: 'Film',
    description: 'Film, television, and character work.',
    cover: mediaLookup.get('emancipation-credit-poster.webp')!,
    preview: filmMedia.slice(0, 3),
    items: filmMedia,
  },
  {
    slug: 'sfx',
    title: 'SFX',
    shortTitle: 'SFX',
    eyebrow: 'SFX',
    description: 'Prosthetics, creatures, aging, and character transformation.',
    cover: mediaLookup.get('old-age-sculpt-profile.webp')!,
    preview: pickMedia(['old-age-sculpt-profile.webp', 'stitched-smile-closeup.webp', 'artist-applying-bald-cap.webp']),
    items: pickMedia([
      'old-age-sculpt-profile.webp',
      'stitched-smile-closeup.webp',
      'artist-applying-bald-cap.webp',
      'burned-hand-prosthetic.webp',
    ]),
  },
];

export const featuredHomeMedia = pickMedia([
  'blue-hand-beauty-portrait.webp',
  'sheila-flower-beauty.webp',
  'painted-body-profile.webp',
  'old-age-sculpt-profile.webp',
  'surya-creative-beauty.webp',
  'guardians-three-poster.webp',
  'emancipation-credit-poster.webp',
]);

export const heroVideo = mediaLookup.get('gratia-showreel-video.mp4')!;

export const aboutPortrait = mediaLookup.get('gratia-side-profile-edit.webp') ?? mediaLookup.get('gratia-side-profile.webp')!;
export const contactImage = mediaLookup.get('gratia-contact-card.webp')!;

export const credits = [
  {
    title: 'Guardians of the Galaxy Vol. 3',
    role: 'Hair Technician / SFX Shop',
    image: mediaLookup.get('guardians-three-poster.webp'),
  },
  {
    title: 'Dogtooth',
    role: 'On-Set Makeup Artist',
    image: mediaLookup.get('dogtooth-poster-design.webp'),
  },
  {
    title: 'le FLEUR*',
    role: 'On-Set Makeup Artist',
    image: mediaLookup.get('le-fleur-performance-still.webp'),
  },
  {
    title: 'Converse',
    role: 'On-Set Makeup Artist',
    image: mediaLookup.get('converse-logo-still-edit-3.webp'),
  },
  {
    title: 'Meta Quest 2',
    role: 'Hair Technician / SFX Shop',
    image: mediaLookup.get('meta-quest-two-still.webp'),
  },
  {
    title: 'Emancipation',
    role: 'SFX Hair Artist',
    image: mediaLookup.get('emancipation-credit-poster.webp'),
  },
  {
    title: 'The Bride!',
    role: 'SFX Hair Artist',
    image: mediaLookup.get('bride-credit-poster.webp'),
  },
  {
    title: 'Digger',
    role: 'SFX Hair Artist',
    image: mediaLookup.get('digger-credit-poster.webp'),
  },
  {
    title: 'Star Wars: Ahsoka',
    role: 'SFX Hair Artist',
    image: mediaLookup.get('ahsoka-credit-poster.webp'),
  },
  {
    title: 'Maestro',
    role: 'SFX Hair Artist',
    image: mediaLookup.get('maestro-credit-poster.webp'),
  },
  {
    title: 'Deadpool & Wolverine',
    role: 'SFX Hair Artist',
    image: mediaLookup.get('deadpool-wolverine-credit-still.webp'),
  },
  {
    title: 'Lil Yachty — Say Something',
    role: 'On-Set Makeup Artist',
    image: mediaLookup.get('lil-yachty-poster.webp'),
  },
  {
    title: "Miller Lite — It's Miller Time",
    role: 'Hair Technician / SFX Shop',
    image: undefined,
  },
  {
    title: 'DENIM',
    role: 'On-Set Makeup Artist',
    image: mediaLookup.get('denim-brand-layout.webp'),
  },
  {
    title: 'Dead Ringers',
    role: 'Hair Technician / SFX Shop',
    image: mediaLookup.get('dead-ringers-poster.webp'),
  },
  {
    title: 'Muse — Compliance',
    role: 'Hair Technician / SFX Shop',
    image: mediaLookup.get('muse-compliance-title-card.webp'),
  },
] as const;

export const featuredCredits = credits.filter((credit) => credit.image).slice(0, 6);

export const getCategory = (slug: CategorySlug) => categories.find((category) => category.slug === slug)!;

export const routeList = [
  '/',
  '/work',
  '/credits',
  '/resume',
  '/about',
  '/contact',
];
