import manifest from '@/assets/media-manifest.json';

export type CategorySlug = 'beauty' | 'creative' | 'special-effects';

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

const mediaLookup = new Map([...allMedia, ...instagramMedia].map((item) => [item.filename, item]));

const pickMedia = (filenames: string[]) =>
  filenames
    .map((filename) => mediaLookup.get(filename))
    .filter((item): item is MediaItem => Boolean(item));

export const site = {
  name: 'MS Gratia',
  title: 'MS Gratia — Makeup & Special Effects Artist',
  description:
    'Editorial portfolio for LA-based makeup and special effects artist Gratia, featuring beauty, creative, film, television, and prosthetic work.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://msgratia.com',
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
  totalAssets: data.counts.unique_assets,
};

export const navigation = [
  { href: '/beauty', label: 'Fashion' },
  { href: '/creative', label: 'Film' },
  { href: '/special-effects', label: 'Special Effects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

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
    slug: 'beauty',
    title: 'Fashion',
    shortTitle: 'Fashion',
    eyebrow: 'Fashion',
    description: 'Beauty, editorial, and fashion makeup.',
    cover: mediaLookup.get('DXH-CXrEnwX.jpg')!,
    preview: pickMedia(['DXH-CXrEnwX.jpg', 'DXH9Mg4kuvC.jpg', 'DXH_8CZkjYp.jpg']),
    items: pickMedia([
      'DXH-CXrEnwX.jpg',
      'DXH9Mg4kuvC.jpg',
      'DXH_8CZkjYp.jpg',
      'DYOj0colFOD.jpg',
      'DYOlf-plD-V.jpg',
      'DYOiT1DFDJP.jpg',
      'DaBe2Nokull.jpg',
      'DaBhI8Ako2J.jpg',
      'Daf7F_OlJXi.jpg',
      'Daf_ep_FBPQ.jpg',
    ]),
  },
  {
    slug: 'creative',
    title: 'Film',
    shortTitle: 'Film',
    eyebrow: 'Film',
    description: 'Film, television, and character work.',
    cover: mediaLookup.get('DXPyEIeEtJ4.jpg')!,
    preview: pickMedia(['DXPyEIeEtJ4.jpg', 'C07naKxvx4K.jpg', 'C-n0Qa-SXRP.jpg']),
    items: pickMedia([
      'DXPyEIeEtJ4.jpg',
      'C07naKxvx4K.jpg',
      'C-n0Qa-SXRP.jpg',
      'CwTPz4Ev1K3.jpg',
      'DXaGdxqkvmO.jpg',
      'CvsvVR6S6Ul.jpg',
      'Cvu57WxSshH.jpg',
    ]),
  },
  {
    slug: 'special-effects',
    title: 'Special Effects',
    shortTitle: 'Special Effects',
    eyebrow: 'Special Effects',
    description: 'Prosthetics, creatures, aging, and character transformation.',
    cover: mediaLookup.get('Ct1zCWXPw-Y.jpg')!,
    preview: pickMedia(['Ct1zCWXPw-Y.jpg', 'CzMVXdFvJ4j.jpg', 'DXPnnsemUz0.jpg']),
    items: pickMedia([
      'Ct1zCWXPw-Y.jpg',
      'CzMVXdFvJ4j.jpg',
      'DXPnnsemUz0.jpg',
      'DXaIFJrEq05.jpg',
    ]),
  },
];

export const featuredHomeMedia = pickMedia([
  'DXH-CXrEnwX.jpg',
  'DXH9Mg4kuvC.jpg',
  'DXH_8CZkjYp.jpg',
  'Ct1zCWXPw-Y.jpg',
  'CzMVXdFvJ4j.jpg',
  'DXPyEIeEtJ4.jpg',
  'C07naKxvx4K.jpg',
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
    role: 'Hair Technician / SFX Shop',
    image: mediaLookup.get('emancipation-poster-design.webp'),
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
  '/beauty',
  '/creative',
  '/special-effects',
  '/credits',
  '/resume',
  '/about',
  '/contact',
];
