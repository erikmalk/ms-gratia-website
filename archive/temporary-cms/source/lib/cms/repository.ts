import type { MediaItem } from '@/lib/site-data';
import { categories as fallbackCategories, featuredHomeMedia, navigation as fallbackNavigation } from '@/lib/site-data';
import { getSql, isCmsDatabaseConfigured } from '@/lib/cms/db';
import type { CmsAsset } from '@/lib/cms/catalog';

export type CmsCategoryState = {
  slug: string;
  title: string;
  description: string;
  displayOrder: number;
  archived: boolean;
  isHome: boolean;
};

export type CmsCategory = {
  slug: string;
  title: string;
  description: string;
  cover: MediaItem;
  items: MediaItem[];
};

export type NavigationItem = { href: string; label: string };

type AssetRow = {
  filename: string;
  src: string;
  alt_text: string;
  width: number;
  height: number;
  source_category: string;
  media_type: 'image' | 'video';
  duration_seconds: number | null;
  sha256: string | null;
  archived_at: Date | null;
  category_slug: string | null;
  position: number | null;
};

type CategoryRow = {
  slug: string;
  title: string;
  description: string;
  display_order: number;
  archived_at: Date | null;
  is_home: boolean;
  cover_filename: string;
};

const publicReadsEnabled = () => isCmsDatabaseConfigured() && process.env.CMS_PUBLIC_READS === 'true';

const toMediaItem = (row: AssetRow): MediaItem => ({
  id: row.filename,
  filename: row.filename,
  src: row.src,
  alt: row.alt_text,
  width: row.width,
  height: row.height,
  category: row.source_category,
  type: row.media_type,
  durationSeconds: row.duration_seconds ?? undefined,
});

export const getCmsAssets = async (): Promise<CmsAsset[]> => {
  const sql = getSql();
  const rows = await sql<AssetRow[]>`
    select a.filename, a.src, a.alt_text, a.width, a.height, a.source_category,
      a.media_type, a.duration_seconds, a.sha256, a.archived_at,
      ci.category_slug, ci.position
    from cms_assets a
    left join cms_category_items ci on ci.asset_filename = a.filename
    order by a.filename, ci.category_slug
  `;
  const byFilename = new Map<string, CmsAsset>();
  for (const row of rows) {
    const asset = byFilename.get(row.filename) ?? {
      ...toMediaItem(row),
      sha256: row.sha256,
      archived: Boolean(row.archived_at),
      assignments: {},
    };
    if (row.category_slug && row.position !== null) asset.assignments[row.category_slug] = row.position;
    byFilename.set(row.filename, asset);
  }
  return [...byFilename.values()];
};

export const getCmsCategories = async (): Promise<CmsCategoryState[]> => {
  const sql = getSql();
  const rows = await sql<CategoryRow[]>`
    select slug, title, description, display_order, archived_at, is_home, cover_filename
    from cms_categories
    order by display_order, slug
  `;
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.description,
    displayOrder: row.display_order,
    archived: Boolean(row.archived_at),
    isHome: row.is_home,
  }));
};

const getDatabaseCategories = async (): Promise<CmsCategory[]> => {
  const sql = getSql();
  const categoryRows = await sql<CategoryRow[]>`
    select slug, title, description, display_order, archived_at, is_home, cover_filename
    from cms_categories
    where archived_at is null and is_home = false
    order by display_order, slug
  `;
  const assetRows = await sql<AssetRow[]>`
    select a.filename, a.src, a.alt_text, a.width, a.height, a.source_category,
      a.media_type, a.duration_seconds, a.sha256, a.archived_at,
      ci.category_slug, ci.position
    from cms_category_items ci
    join cms_assets a on a.filename = ci.asset_filename
    join cms_categories c on c.slug = ci.category_slug
    where a.archived_at is null and a.media_type = 'image'
      and c.archived_at is null and c.is_home = false
    order by c.display_order, ci.position
  `;

  return categoryRows.flatMap((category) => {
    const rows = assetRows.filter((row) => row.category_slug === category.slug);
    if (!rows.length) return [];
    const items = rows.map(toMediaItem);
    const configuredCover = rows.find((row) => row.filename === category.cover_filename);
    return [{
      slug: category.slug,
      title: category.title,
      description: category.description,
      cover: configuredCover ? toMediaItem(configuredCover) : items[0],
      items,
    }];
  });
};

export const getPublicCategories = async (): Promise<CmsCategory[]> => {
  if (!publicReadsEnabled()) return fallbackCategories;
  try {
    return await getDatabaseCategories();
  } catch (error) {
    console.error('CMS public read failed; using committed fallback.', error);
    return fallbackCategories;
  }
};

export const getPublicCategory = async (slug: string): Promise<CmsCategory | undefined> =>
  (await getPublicCategories()).find((category) => category.slug === slug);

export const getHomeMedia = async (): Promise<MediaItem[]> => {
  if (!publicReadsEnabled()) return featuredHomeMedia;
  try {
    const sql = getSql();
    const rows = await sql<AssetRow[]>`
      select a.filename, a.src, a.alt_text, a.width, a.height, a.source_category,
        a.media_type, a.duration_seconds, a.sha256, a.archived_at,
        ci.category_slug, ci.position
      from cms_categories c
      join cms_category_items ci on ci.category_slug = c.slug
      join cms_assets a on a.filename = ci.asset_filename
      where c.is_home = true and c.archived_at is null
        and a.archived_at is null and a.media_type = 'image'
      order by ci.position
    `;
    return rows.map(toMediaItem);
  } catch (error) {
    console.error('CMS homepage read failed; using committed fallback.', error);
    return featuredHomeMedia;
  }
};

export const getPublicNavigation = async (): Promise<NavigationItem[]> => {
  if (!publicReadsEnabled()) return [...fallbackNavigation];
  const categories = await getPublicCategories();
  return [
    ...categories.map((category) => ({ href: `/${category.slug}`, label: category.title })),
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];
};
