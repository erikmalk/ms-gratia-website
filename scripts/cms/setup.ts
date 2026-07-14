import { readFile } from 'node:fs/promises';
import path from 'node:path';
import postgres from 'postgres';

import { catalogAssets, categoryDetails, categorySlugs, seedAssignments } from '../../lib/cms/catalog';

const main = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is required.');

  const sql = postgres(databaseUrl, { max: 1, prepare: false });

  try {
  const migration = await readFile(path.join(process.cwd(), 'db/migrations/001_cms.sql'), 'utf8');
  await sql.unsafe(migration);

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
      await transaction`
        insert into cms_categories (slug, title, description, display_order, cover_filename)
        values (${slug}, ${detail.title}, ${detail.description}, ${displayOrder + 1}, ${detail.cover})
        on conflict (slug) do update set
          title = excluded.title,
          description = excluded.description,
          display_order = excluded.display_order,
          updated_at = now()
      `;

      const [{ count }] = await transaction<{ count: string }[]>`
        select count(*)::text as count from cms_category_items where category_slug = ${slug}
      `;
      if (Number(count) === 0) {
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

  const [{ count }] = await sql<{ count: string }[]>`select count(*)::text as count from cms_assets`;
  if (Number(count) !== 220) throw new Error(`Expected 220 CMS assets, found ${count}.`);
  console.log(`CMS database ready: ${count} assets across ${categorySlugs.length} categories.`);
  } finally {
    await sql.end();
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'CMS setup failed.');
  process.exitCode = 1;
});
