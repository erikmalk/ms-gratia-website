# MS Gratia Portfolio

A production-ready Next.js App Router portfolio for LA-based makeup and special effects artist MS Gratia.

## Stack

- Next.js App Router
- TypeScript
- Static-first content sourced from `assets/media-manifest.json`
- Minimal dependencies
- Optional Resend-powered contact form API

## Routes

- `/`
- `/work`
- `/beauty`
- `/creative`
- `/special-effects`
- `/credits`
- `/resume` → redirects to `/credits`
- `/about`
- `/contact`

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run typecheck
npm run build
```

## Environment

Copy `.env.example` to `.env.local` if needed.

- `NEXT_PUBLIC_SITE_URL` for production metadata/canonical URLs
- `RESEND_API_KEY` to enable the contact form API
- `RESEND_FROM_EMAIL` optional sender override

If `RESEND_API_KEY` is absent, the contact page gracefully falls back to a `mailto:` action in the UI.

## Content / Media

- Portfolio media is derived from `assets/media-manifest.json`
- Optimized assets remain in `public/media`
- Source/original assets under `assets/originals` are intentionally ignored by git and left untouched

## Notes

- The Credits / Resume page uses the provided known public-site credits list.
- Matching archive imagery is used where filenames clearly align; one credit (Miller Lite — It's Miller Time) currently renders without paired artwork because no obvious matching manifest filename exists.
