import manifest from '@/assets/media-manifest.json';
import type { CategorySlug, MediaItem } from '@/lib/site-data';

type ManifestAsset = {
  sha256: string;
  derivative_filename: string;
  derivative_path: string;
  media_type: 'image' | 'video';
  category: string;
  derivative_width: number;
  derivative_height: number;
  duration_seconds?: number;
};

type ManifestFile = { assets: ManifestAsset[] };

export type CmsAsset = MediaItem & {
  sha256: string | null;
  archived: boolean;
  assignments: Record<string, number | undefined>;
};

export const categorySlugs: CategorySlug[] = ['celebrity', 'beauty', 'editorial', 'advertising', 'film', 'sfx'];

export const categoryDetails: Record<CategorySlug, { title: string; description: string; cover: string }> = {
  celebrity: {
    title: 'Celebrity',
    description: 'Camera-ready makeup for talent, appearances, and portraiture.',
    cover: 'marjorie-beauty-portrait.webp',
  },
  beauty: {
    title: 'Beauty',
    description: 'Polished beauty makeup and refined portrait work.',
    cover: 'blue-hand-beauty-portrait.webp',
  },
  editorial: {
    title: 'Editorial',
    description: 'Fashion, performance, and concept-driven image making.',
    cover: 'painted-body-profile.webp',
  },
  advertising: {
    title: 'Advertising',
    description: 'Commercial, campaign, and branded production work.',
    cover: 'meta-quest-two-still.webp',
  },
  film: {
    title: 'Film',
    description: 'Film, television, and character work.',
    cover: 'emancipation-credit-poster.webp',
  },
  sfx: {
    title: 'SFX',
    description: 'Prosthetics, creatures, aging, and character transformation.',
    cover: 'old-age-sculpt-profile.webp',
  },
};

const creditAssets: Array<MediaItem & { sha256: null }> = [
  ['emancipation-credit-poster.webp', 'Emancipation poster featuring Will Smith', 1167, 1486],
  ['bride-credit-poster.webp', 'The Bride poster featuring Jessie Buckley and Christian Bale', 1080, 1351],
  ['digger-credit-poster.webp', 'Digger poster featuring Tom Cruise', 1095, 1372],
  ['ahsoka-credit-poster.webp', 'Star Wars Ahsoka poster', 1156, 1383],
  ['maestro-credit-poster.webp', 'Maestro poster featuring Carey Mulligan and Bradley Cooper', 1126, 1361],
  ['deadpool-wolverine-credit-still.webp', 'Deadpool and Wolverine sitting together in a forest', 1116, 1124],
].map(([filename, alt, width, height]) => ({
  id: filename as string,
  filename: filename as string,
  src: `/media/${filename}`,
  alt: alt as string,
  width: width as number,
  height: height as number,
  category: 'film',
  type: 'image',
  sha256: null,
}));

export const altFromFilename = (filename: string) =>
  filename
    .replace(/\.[^.]+$/, '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const data = manifest as ManifestFile;

export const catalogAssets: Array<MediaItem & { sha256: string | null }> = [
  ...data.assets.map((asset) => ({
    id: asset.derivative_filename,
    filename: asset.derivative_filename,
    src: `/${asset.derivative_path.replace(/^public\//, '')}`,
    alt: altFromFilename(asset.derivative_filename),
    width: asset.derivative_width,
    height: asset.derivative_height,
    category: asset.category,
    type: asset.media_type,
    durationSeconds: asset.duration_seconds,
    sha256: asset.sha256,
  })),
  ...creditAssets,
];

export const seedAssignments: Record<CategorySlug, string[]> = {
  celebrity: ['marjorie-beauty-portrait.webp', 'editorial-male-portrait.webp', 'coco-headshot-portrait.webp', 'jerome-male-portrait.webp'],
  beauty: [
    'blue-hand-beauty-portrait.webp',
    'sheila-flower-beauty.webp',
    'imats-neon-beauty.webp',
    'pink-eye-beauty.webp',
    'teal-mohawk-beauty.webp',
    'marjorie-beauty-portrait.webp',
  ],
  editorial: ['painted-body-profile.webp', 'surya-creative-beauty.webp', 'woods-fantasy-portrait.webp', 'ice-queen-bodypaint.webp', 'gold-body-beauty.webp'],
  advertising: catalogAssets
    .filter((item) => item.type === 'image' && (item.category === 'branding' || /campaign|brand|converse|quest|fleur|denim|nfl|retail|testimonial/.test(item.filename)))
    .map((item) => item.filename),
  film: [
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
  ],
  sfx: ['old-age-sculpt-profile.webp', 'stitched-smile-closeup.webp', 'artist-applying-bald-cap.webp', 'burned-hand-prosthetic.webp'],
};

export const catalogAssetCount = catalogAssets.length;

if (new Set(catalogAssets.map((asset) => asset.filename)).size !== catalogAssetCount) {
  throw new Error('CMS catalog contains duplicate filenames.');
}
