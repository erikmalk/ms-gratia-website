import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hasCmsSession } from '@/lib/cms/auth';
import { catalogAssetCount, catalogAssets } from '@/lib/cms/catalog';
import { getSql } from '@/lib/cms/db';
import { enforceRateLimit } from '@/lib/cms/rate-limit';

const slugSchema = z.string().min(1).max(64).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const categorySchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().max(300),
  archived: z.boolean(),
  isHome: z.boolean(),
  filenames: z.array(z.string().min(1).max(180)).max(catalogAssetCount),
});
const payloadSchema = z.object({
  archived: z.array(z.string().min(1).max(180)).max(catalogAssetCount),
  categories: z.array(categorySchema).min(1).max(64),
});
const reservedSlugs = new Set(['about', 'api', 'contact', 'credits', 'resume', 'work']);

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
  const categories = parsed.data.categories.map((category) => ({
    ...category,
    filenames: [...new Set(category.filenames)],
  }));
  const slugs = categories.map((category) => category.slug);
  const homeCategories = categories.filter((category) => category.isHome);

  if (archived.some((filename) => !known.has(filename))) {
    return NextResponse.json({ error: 'Unknown asset.' }, { status: 400 });
  }
  if (new Set(slugs).size !== slugs.length || categories.some((category) => reservedSlugs.has(category.slug))) {
    return NextResponse.json({ error: 'A category URL is duplicated or reserved.' }, { status: 400 });
  }
  if (homeCategories.length !== 1 || homeCategories[0].slug !== 'home' || homeCategories[0].archived) {
    return NextResponse.json({ error: 'The Home category is required and cannot be archived.' }, { status: 400 });
  }
  if (categories.some((category) => category.slug === 'home' && !category.isHome)) {
    return NextResponse.json({ error: 'Home is a reserved category.' }, { status: 400 });
  }
  if (categories.some((category) => category.filenames.some((filename) => !knownImages.has(filename)))) {
    return NextResponse.json({ error: 'A category contains an unknown or non-image asset.' }, { status: 400 });
  }

  let previousSlugs: string[] = [];
  try {
    const sql = getSql();
    await sql.begin(async (transaction) => {
      const existing = await transaction<{ slug: string }[]>`select slug from cms_categories for update`;
      previousSlugs = existing.map((category) => category.slug);
      if (existing.some((category) => !slugs.includes(category.slug))) {
        throw new Error('STALE_CATEGORY_STATE');
      }

      await transaction`update cms_assets set archived_at = null`;
      if (archived.length) await transaction`update cms_assets set archived_at = now() where filename in ${transaction(archived)}`;

      await transaction`update cms_categories set display_order = display_order + 1000`;
      for (const [index, category] of categories.entries()) {
        const firstFilename = category.filenames[0] ?? catalogAssets.find((asset) => asset.type === 'image')!.filename;
        await transaction`
          insert into cms_categories (
            slug, title, description, display_order, cover_filename, archived_at, is_home
          ) values (
            ${category.slug}, ${category.title}, ${category.description}, ${index + 1}, ${firstFilename},
            ${category.archived ? new Date() : null}, ${category.isHome}
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
      for (const category of categories) {
        for (const [position, filename] of category.filenames.entries()) {
          await transaction`
            insert into cms_category_items (category_slug, asset_filename, position)
            values (${category.slug}, ${filename}, ${position + 1})
          `;
        }
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'STALE_CATEGORY_STATE') {
      return NextResponse.json({ error: 'Categories changed in another session. Reload before saving.' }, { status: 409 });
    }
    console.error('CMS save failed.', error);
    return NextResponse.json({ error: 'Unable to save changes.' }, { status: 500 });
  }

  revalidatePath('/');
  revalidatePath('/work');
  revalidatePath('/sitemap.xml');
  [...new Set([...previousSlugs, ...slugs])].forEach((slug) => revalidatePath(`/${slug}`));
  return NextResponse.json({ ok: true });
}
