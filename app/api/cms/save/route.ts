import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hasCmsSession } from '@/lib/cms/auth';
import { catalogAssetCount, catalogAssets, categorySlugs } from '@/lib/cms/catalog';
import { getSql } from '@/lib/cms/db';
import { enforceRateLimit } from '@/lib/cms/rate-limit';

const categorySchema = z.enum(categorySlugs as [string, ...string[]]);
const payloadSchema = z.object({
  archived: z.array(z.string().min(1).max(180)).max(catalogAssetCount),
  categories: z.record(categorySchema, z.array(z.string().min(1).max(180)).max(catalogAssetCount)),
});

export async function POST(request: Request) {
  if (!(await hasCmsSession())) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  if (!(await enforceRateLimit(request, 'cms-write', 30, 60))) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 });
  }

  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid CMS state.' }, { status: 400 });

  const known = new Set(catalogAssets.map((item) => item.filename));
  const knownImages = new Set(catalogAssets.filter((item) => item.type === 'image').map((item) => item.filename));
  const archived = [...new Set(parsed.data.archived)];
  if (archived.some((filename) => !known.has(filename))) {
    return NextResponse.json({ error: 'Unknown asset.' }, { status: 400 });
  }

  const normalized = categorySlugs.map((slug) => ({
    slug,
    filenames: [...new Set(parsed.data.categories[slug] ?? [])],
  }));
  if (normalized.some((category) => category.filenames.every((filename) => archived.includes(filename)))) {
    return NextResponse.json({ error: 'Every category must contain at least one visible image.' }, { status: 400 });
  }
  if (normalized.some((category) => category.filenames.some((filename) => !knownImages.has(filename)))) {
    return NextResponse.json({ error: 'A category contains an unknown or non-image asset.' }, { status: 400 });
  }

  try {
    const sql = getSql();
    await sql.begin(async (transaction) => {
      await transaction`update cms_assets set archived_at = null`;
      if (archived.length) await transaction`update cms_assets set archived_at = now() where filename in ${transaction(archived)}`;
      await transaction`delete from cms_category_items`;
      for (const category of normalized) {
        for (const [position, filename] of category.filenames.entries()) {
          await transaction`
            insert into cms_category_items (category_slug, asset_filename, position)
            values (${category.slug}, ${filename}, ${position + 1})
          `;
        }
      }
    });
  } catch (error) {
    console.error('CMS save failed.', error);
    return NextResponse.json({ error: 'Unable to save changes.' }, { status: 500 });
  }

  revalidatePath('/');
  revalidatePath('/work');
  categorySlugs.forEach((slug) => revalidatePath(`/${slug}`));
  return NextResponse.json({ ok: true });
}
