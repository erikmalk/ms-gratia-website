# Mini CMS implementation specification

Status: implemented temporary utility

## Goal

Give one editor an unlisted interface for assigning every available media asset to dynamic portfolio categories, controlling image and menu order, and soft-archiving/recovering assets and categories. Persist edits in Neon Postgres and publish the state to the existing minimalist site.

## Acceptance criteria

- Catalog contains every deduplicated manifest asset (including the showreel video) plus the six manually curated credit images; its total is derived in code.
- Selection view displays all non-archived records by default; “Show archived” recovers hidden records.
- Thumbnail size slider changes grid density.
- Every image shows all active category checkboxes. Checked categories show their current 1-based sort value.
- The showreel video appears in the catalog but cannot be assigned to image galleries.
- Archive is a soft delete. Archived assets disappear publicly but retain category/order metadata; restoring recovers their prior assignments.
- Sort view chooses one category and supports pointer drag/drop plus keyboard-accessible up/down controls.
- One explicit Save transaction persists archive state, membership, and normalized contiguous category positions.
- Public category and work pages use DB ordering only when `CMS_PUBLIC_READS=true`; otherwise committed data remains a safe fallback.
- Route and APIs are authenticated, no-store/noindex, same-origin for writes, and rate-limited.
- CMS URL is not in navigation or sitemap and is disallowed in robots.
- Category names are editable and ordinary categories can be added, ordered, archived, shown, and restored.
- Empty and archived categories disappear publicly without deleting their image assignments.
- The reserved Home category controls `/`, retains its image order, and never appears in navigation.

## Data model

- `cms_assets`: filename primary key, public path, alt text, dimensions, source category/type/hash, nullable `archived_at`.
- `cms_categories`: stable URL slug, title/description/display order/cover filename, nullable `archived_at`, and `is_home` marker.
- `cms_category_items`: many-to-many asset/category join with category-specific unique position.
- `cms_rate_limits`: atomic fixed-window counters keyed by HMAC-hashed scope/IP.

Assets remain in committed `public/media`; Postgres stores metadata and editorial state, never image bytes.

## Security model

A high-entropy `CMS_ROUTE_SECRET` creates an unguessable route. Visiting it exchanges the secret for a signed eight-hour HttpOnly cookie; all CMS APIs independently validate that cookie. The route is temporary and suitable for this one-editor utility, not a future multi-user CMS. A durable replacement should use managed identity/SSO and role-based authorization.

## Deployment sequence

1. Provision a production Neon Postgres integration on the canonical Vercel project.
2. Configure `DATABASE_URL`, `CMS_ROUTE_SECRET`, and `CMS_SESSION_SECRET` as server-only production secrets.
3. Run `npm run cms:setup` against that Neon database and verify the reported total matches the derived catalog count.
4. Deploy with `CMS_PUBLIC_READS=false` initially and validate the CMS catalog/edit persistence.
5. Set `CMS_PUBLIC_READS=true`, redeploy, make a reversible ordering test, and confirm the public category changes.
6. Verify canonical host remains `https://msgratia.vercel.app`.

## Test matrix

- Static gates: lint, strict typecheck, production build.
- Catalog invariant: setup reports the catalog-derived total and the UI displays the same total.
- Authentication: wrong slug 404; APIs without cookie 404; valid slug gets session.
- Selection: assign/unassign changes sort values; archive hides; show archived restores.
- Ordering: drag and arrow controls normalize positions; save and reload preserve order.
- Public read: enabled DB order is visible on category pages; database outage falls back to committed order.
- Responsive: grid and sort controls work at desktop and mobile widths.
- SEO/security: CMS absent from sitemap/navigation; robots disallow; noindex/no-store/no-referrer headers.

## Out of scope

Uploads, hard deletion, category URL editing after creation, copy/SEO editing beyond category names, credit editing, multi-user access, roles, and permanent authentication.
