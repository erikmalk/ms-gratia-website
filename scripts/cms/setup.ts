import { readFile } from 'node:fs/promises';
import path from 'node:path';
import postgres from 'postgres';

import portfolioSnapshot from '../../assets/portfolio-state.json';
import { catalogAssetCount, catalogAssets, categoryDetails, categorySlugs, seedAssignments } from '../../lib/cms/catalog';

type SnapshotCategory = {
  slug: string;
  title: string;
  description: string;
  displayOrder: number;
  coverFilename: string;
  archived: boolean;
  isHome: boolean;
  filenames: string[];
};

const main = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is required.');

  const sql = postgres(databaseUrl, { max: 1, prepare: false });

  try {
  const [{ cmsExists }] = await sql<{ cmsExists: boolean }[]>`
    select to_regclass('public.cms_assets') is not null as "cmsExists"
  `;
  const initialMigration = await readFile(path.join(process.cwd(), 'db/migrations/001_cms.sql'), 'utf8');
  await sql.unsafe(initialMigration);

  await sql.begin(async (transaction) => {
    for (const asset of catalogAssets) {
      await transaction`
        insert into cms_assets (
          filename, src, alt_text, width, height, source_category,
          media_type, duration_seconds, sha256
        ) values (
          ${asset.filename}, ${asset.src}, ${asset.alt}, ${asset.width}, ${asset.height},
          ${asset.category}, ${asset.type}, ${asset.durationSeconds ?? null}, ${asset.sha256}
        )
        on conflict (filename) do update set
          src = excluded.src,
          alt_text = excluded.alt_text,
          width = excluded.width,
          height = excluded.height,
          source_category = excluded.source_category,
          media_type = excluded.media_type,
          duration_seconds = excluded.duration_seconds,
          sha256 = excluded.sha256,
          updated_at = now()
      `;
    }

    for (const [displayOrder, slug] of categorySlugs.entries()) {
      const detail = categoryDetails[slug];
      const inserted = await transaction<{ slug: string }[]>`
        insert into cms_categories (slug, title, description, display_order, cover_filename)
        values (${slug}, ${detail.title}, ${detail.description}, ${displayOrder + 1}, ${detail.cover})
        on conflict (slug) do nothing
        returning slug
      `;

      if (inserted.length) {
        for (const [position, filename] of seedAssignments[slug].entries()) {
          await transaction`
            insert into cms_category_items (category_slug, asset_filename, position)
            values (${slug}, ${filename}, ${position + 1})
            on conflict (category_slug, asset_filename) do nothing
          `;
        }
      }
    }
  });

  const dynamicCategoryMigration = await readFile(path.join(process.cwd(), 'db/migrations/002_dynamic_categories.sql'), 'utf8');
  await sql.unsafe(dynamicCategoryMigration);

  const captionMigration = await readFile(path.join(process.cwd(), 'db/migrations/003_asset_captions.sql'), 'utf8');
  await sql.unsafe(captionMigration);

  if (!cmsExists) {
    const snapshotCategories = portfolioSnapshot.categories as SnapshotCategory[];
    const knownImages = new Set(catalogAssets.filter((asset) => asset.type === 'image').map((asset) => asset.filename));
    const archivedAssets = portfolioSnapshot.archivedAssets.filter((filename) => catalogAssets.some((asset) => asset.filename === filename));

    await sql.begin(async (transaction) => {
      await transaction`update cms_assets set archived_at = null`;
      if (archivedAssets.length) {
        await transaction`update cms_assets set archived_at = now() where filename in ${transaction(archivedAssets)}`;
      }

      await transaction`update cms_categories set display_order = display_order + 1000`;
      for (const category of snapshotCategories) {
        const filenames = category.filenames.filter((filename) => knownImages.has(filename));
        const coverFilename = knownImages.has(category.coverFilename) ? category.coverFilename : filenames[0];
        if (!coverFilename) continue;
        await transaction`
          insert into cms_categories (
            slug, title, description, display_order, cover_filename, archived_at, is_home
          ) values (
            ${category.slug}, ${category.title}, ${category.description}, ${category.displayOrder},
            ${coverFilename}, ${category.archived ? new Date() : null}, ${category.isHome}
          )
          on conflict (slug) do update set
            title = excluded.title,
            description = excluded.description,
            display_order = excluded.display_order,
            cover_filename = excluded.cover_filename,
            archived_at = excluded.archived_at,
            is_home = excluded.is_home,
            updated_at = now()
        `;
      }

      await transaction`delete from cms_category_items`;
      for (const category of snapshotCategories) {
        const filenames = category.filenames.filter((filename) => knownImages.has(filename));
        for (const [position, filename] of filenames.entries()) {
          await transaction`
            insert into cms_category_items (category_slug, asset_filename, position)
            values (${category.slug}, ${filename}, ${position + 1})
          `;
        }
      }
    });
  }

  const [{ count }] = await sql<{ count: string }[]>`select count(*)::text as count from cms_assets`;
  if (Number(count) !== catalogAssetCount) {
    throw new Error(`Expected ${catalogAssetCount} CMS assets, found ${count}.`);
  }
  const [{ categoryCount }] = await sql<{ categoryCount: string }[]>`select count(*)::text as "categoryCount" from cms_categories`;
  console.log(`CMS database ready: ${count} assets across ${categoryCount} categories.`);
  } finally {
    await sql.end();
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'CMS setup failed.');
  process.exitCode = 1;
});
