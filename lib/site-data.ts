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

const mediaLookup = new Map(allMedia.map((item) => [item.filename, item]));

const pickMedia = (filenames: string[]) =>
  filenames
    .map((filename) => mediaLookup.get(filename))
    .filter((item): item is MediaItem => Boolean(item));

const categoryMedia = (slug: CategorySlug) => {
  if (slug === 'creative') {
    return allMedia.filter(
      (item) => (item.category === 'creative' || item.category === 'branding') && item.type === 'image',
    );
  }

  return allMedia.filter((item) => item.category === slug && item.type === 'image');
};

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
  aboutCopy: [
    "I'm a LA-based makeup and special effects artist, specializing in film and TV. I've had the privilege of working on numerous production projects and collaborating with a variety of special effects shops in Los Angeles.",
    "I love collaborating with other creatives to bring ideas to life. Let's team up and make something amazing!",
  ],
  totalAssets: data.counts.unique_assets,
};

export const navigation = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/beauty', label: 'Beauty' },
  { href: '/creative', label: 'Creative' },
  { href: '/special-effects', label: 'Special Effects' },
  { href: '/credits', label: 'Credits / Resume' },
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
    title: 'Beauty',
    shortTitle: 'Beauty',
    eyebrow: 'Refined skin, editorial detail',
    description:
      'A polished edit of portrait, fashion, and beauty-driven makeup work with a clean editorial sensibility.',
    cover: mediaLookup.get('blue-hand-beauty-portrait.webp')!,
    preview: pickMedia([
      'blue-hand-beauty-portrait.webp',
      'sheila-flower-beauty.webp',
      'imats-neon-beauty.webp',
      'marjorie-beauty-portrait.webp',
      'teal-mohawk-beauty.webp',
      'pink-eye-beauty.webp',
    ]),
    items: categoryMedia('beauty'),
  },
  {
    slug: 'creative',
    title: 'Creative',
    shortTitle: 'Creative',
    eyebrow: 'Concept, campaign, image-making',
    description:
      'Conceptual beauty, branded imagery, and stylized production stills spanning music, fashion, and visual storytelling.',
    cover: mediaLookup.get('painted-body-profile.webp')!,
    preview: pickMedia([
      'painted-body-profile.webp',
      'surya-creative-beauty.webp',
      'woods-fantasy-portrait.webp',
      'guardians-three-poster.webp',
      'meta-quest-two-still.webp',
      'le-fleur-performance-still.webp',
    ]),
    items: categoryMedia('creative'),
  },
  {
    slug: 'special-effects',
    title: 'Special Effects',
    shortTitle: 'Special Effects',
    eyebrow: 'Texture, prosthetics, transformation',
    description:
      'Character work, prosthetics, sculpture, aging, wounds, and practical effects built for camera-ready realism.',
    cover: mediaLookup.get('old-age-sculpt-profile.webp')!,
    preview: pickMedia([
      'old-age-sculpt-profile.webp',
      'stitched-smile-closeup.webp',
      'older-man-head-bust.webp',
      'prosthetic-skin-seam.webp',
      'burned-hand-prosthetic.webp',
      'artist-applying-bald-cap.webp',
    ]),
    items: categoryMedia('special-effects'),
  },
];

export const featuredHomeMedia = pickMedia([
  'old-age-sculpt-profile.webp',
  'blue-hand-beauty-portrait.webp',
  'painted-body-profile.webp',
  'guardians-three-poster.webp',
  'le-fleur-performance-still.webp',
  'meta-quest-two-still.webp',
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
