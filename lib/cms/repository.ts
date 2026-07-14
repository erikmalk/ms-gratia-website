import type { CategorySlug, MediaItem } from '@/lib/site-data';
import { catalogAssets, categoryDetails, categorySlugs, type CmsAsset } from '@/lib/cms/catalog';
import { getSql, isCmsDatabaseConfigured } from '@/lib/cms/db';

export type CmsCategory = {
  slug: CategorySlug;
  title: string;
  description: string;
  cover: MediaItem;
  items: MediaItem[];
};

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
  category_slug: CategorySlug | null;
  position: number | null;
};

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

export const getDatabaseCategories = async (): Promise<CmsCategory[]> => {
  const sql = getSql();
  const rows = await sql<AssetRow[]>`
    select a.filename, a.src, a.alt_text, a.width, a.height, a.source_category,
      a.media_type, a.duration_seconds, a.sha256, a.archived_at,
      ci.category_slug, ci.position
    from cms_category_items ci
    join cms_assets a on a.filename = ci.asset_filename
    where a.archived_at is null
    order by ci.category_slug, ci.position
  `;
  const covers = await sql<{ slug: CategorySlug; cover_filename: string }[]>`
    select slug, cover_filename from cms_categories order by display_order
  `;
  const lookup = new Map(rows.map((row) => [row.filename, toMediaItem(row)]));
  const fallback = new Map(catalogAssets.map((asset) => [asset.filename, asset]));

  return categorySlugs.map((slug) => {
    const detail = categoryDetails[slug];
    const coverFilename = covers.find((item) => item.slug === slug)?.cover_filename ?? detail.cover;
    const firstActiveItem = rows.find((row) => row.category_slug === slug);
    const cover = lookup.get(coverFilename) ?? (firstActiveItem ? toMediaItem(firstActiveItem) : fallback.get(coverFilename));
    if (!cover) throw new Error(`Missing cover asset for ${slug}.`);
    return {
      slug,
      title: detail.title,
      description: detail.description,
      cover,
      items: rows.filter((row) => row.category_slug === slug).map(toMediaItem),
    };
  });
};

export const getArchivedFilenames = async (): Promise<Set<string>> => {
  if (!isCmsDatabaseConfigured() || process.env.CMS_PUBLIC_READS !== 'true') return new Set();
  try {
    const sql = getSql();
    const rows = await sql<{ filename: string }[]>`select filename from cms_assets where archived_at is not null`;
    return new Set(rows.map((row) => row.filename));
  } catch (error) {
    console.error('CMS archive read failed; showing committed homepage.', error);
    return new Set();
  }
};

export const getPublicCategories = async (fallbackCategories: CmsCategory[]) => {
  if (!isCmsDatabaseConfigured() || process.env.CMS_PUBLIC_READS !== 'true') return fallbackCategories;
  try {
    return await getDatabaseCategories();
  } catch (error) {
    console.error('CMS public read failed; using committed fallback.', error);
    return fallbackCategories;
  }
};
