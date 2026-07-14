---
name: ms-gratia-website
description: Maintain, test, and deploy the MS Gratia portfolio and its temporary image CMS. Use for any work involving this repository, media catalog, category ordering, Vercel deployment, canonical domains, or Neon data.
---

# MS Gratia website

## Always establish the canonical project first

- Durable repository: `https://github.com/erikmalk/ms-gratia-website`, local path `/Users/gratia/Projects/ms-gratia-website`.
- Durable Vercel project: `local-hoist/ms-gratia-website`, project ID `prj_szBaYn2IdFZ5HTCTlOkhW9jRgezw`.
- **Only canonical public URL:** `https://msgratia.vercel.app`.
- All removable noncanonical named aliases were deleted on 2026-07-14. Vercel still creates immutable deployment URLs, but they must never be emitted in metadata or shared as canonical.
- `msgratia.com` / `www.msgratia.com` currently point at a separate Wix site. Do not use them here unless an explicit DNS migration is requested.
- Before deploying, inspect `git remote -v`, `.vercel/project.json`, `git status`, and production env names. Never deploy from an unrelated checkout/project.
- Keep `NEXT_PUBLIC_SITE_URL` absent or exactly `https://msgratia.vercel.app`. Remove stale project aliases/domains in Vercel when permissions allow; never delete the canonical alias.

## Architecture

- Next.js 15 App Router, React 19, strict TypeScript, npm lockfile.
- Public media files are immutable committed derivatives under `public/media`.
- `assets/media-manifest.json` contains 214 deduplicated masters/derivatives (213 images + one showreel video). Six newer credit images are manually added by `lib/cms/catalog.ts`. The CMS invariant is exactly **220 assets**.
- The public site has six categories: Celebrity, Beauty, Editorial, Advertising, Film, SFX.
- `lib/site-data.ts` remains the safe committed fallback. When `CMS_PUBLIC_READS=true` and Neon is healthy, home/category/work ordering comes from Postgres.
- CMS code is under `lib/cms`, `components/cms`, `app/api/cms`, and the secret branch of `app/[slug]/page.tsx`.
- Database schema is `db/migrations/001_cms.sql`; seed runner is `npm run cms:setup`. It is idempotent and does not overwrite a non-empty category order.

## Temporary CMS security and operation

- The URL is `/${CMS_ROUTE_SECRET}`. Never commit or print its value in docs/screenshots.
- The route secret is exchanged for an eight-hour signed HttpOnly/SameSite=Strict session cookie. API reads/writes require that session and use DB-backed rate limits.
- CMS pages are noindex/noarchive, excluded from sitemap, disallowed in robots, and use no-store/no-referrer headers.
- The selection view displays all 220 assets, supports thumbnail sizing, six category checkboxes with visible order, soft archive, and recovery.
- The sort view supports drag/drop and accessible up/down controls. Save writes all category orders and archive state transactionally.
- Runtime uploads are intentionally unsupported: Vercel's filesystem is immutable. Add new optimized files and manifest data in the repository, or adopt object storage as a separately specified feature.

## Required environment variables

- `DATABASE_URL`: Neon pooled Postgres URL, server-only.
- `CMS_ROUTE_SECRET`: UUID/random route segment, server-only.
- `CMS_SESSION_SECRET`: at least 32 random bytes/64 hex chars, server-only.
- `CMS_PUBLIC_READS=true`: enables DB category ordering on public pages after seeding.
- `NEXT_PUBLIC_SITE_URL=https://msgratia.vercel.app` (optional because code fallback is canonical).
- Never expose CMS/database secrets through `NEXT_PUBLIC_*`.
- Use separate Neon databases/branches for preview and production; previews must not mutate production.

## Workflow

1. `git status --short`; inspect the canonical project/link.
2. `npm ci` (or `npm install` only when intentionally changing dependencies).
3. If schema/catalog changed: set a local `DATABASE_URL`, run `npm run cms:setup`, and confirm it reports 220 assets.
4. Run `npm run lint && npm run typecheck && npm run build`.
5. Browser-test the portfolio and CMS, including archive/restore and an ordering change; restore original state after the test.
6. Deploy only to `local-hoist/ms-gratia-website`.
7. Smoke-test `https://msgratia.vercel.app`, canonical tags, robots, sitemap, six categories, and secret CMS URL.

## Vercel deployment

Use authenticated Vercel CLI or the dashboard. A reliable CLI path is:

```bash
npx --yes vercel@55.0.0 pull --yes --environment=production
npx --yes vercel@55.0.0 build --prod
npx --yes vercel@55.0.0 deploy --prebuilt --prod
```

If CLI auth is absent, use the already logged-in Erik Chrome profile with Local Hoist browser tools. Never ask for or handle a Google password. Ensure migrations/seeding and production environment variables are complete before enabling `CMS_PUBLIC_READS=true`.

## Safe removal after the temporary CMS is retired

Remove the CMS route/API/components/styles, `lib/cms`, migration/setup scripts and CMS env vars. First export or translate category assignments back into committed `site-data.ts`; verify public galleries match; then remove Neon integration. Do not delete `public/media` or the canonical Vercel project.
