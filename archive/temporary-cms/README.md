# Retired temporary CMS archive

The temporary image CMS was retired on 2026-07-14. Nothing in this directory is imported by the active Next.js application or exposed as a route.

## Preserved material

- `state/production-export.json`: credential-free export of all CMS assets, categories, archive timestamps, and assignments.
- `source/`: the former UI, API routes, data layer, migrations, setup script, and styles.
- `implementation-spec.md`: original behavior and security specification.
- `assets/portfolio-state.json`: the smaller final public snapshot consumed by `lib/portfolio.ts`.

No database URL, route secret, session secret, or session cookie is archived.

## Future admin-panel restoration

Build a new authenticated admin area with managed identity and role checks. Import or adapt the archived schema/state and editor UI, but do not restore the secret URL authentication model. Keep admin API routes behind authorization middleware and retain same-origin validation, rate limits, no-store responses, and transactional saves.
