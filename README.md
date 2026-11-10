# Bueno Landscaping

Website for Bueno Landscaping Inc., Patchogue, NY: https://buenolandscapinginc.com

Next.js 16 (App Router), TypeScript, one global stylesheet with BEM class names.

## Run

```bash
npm install
npm run dev         # http://localhost:3000
npm run lint
npm run typecheck
npm run build
```

Copy `.env.example` to `.env.local` and fill in the values.

## Deploy

```bash
bash deploy/deploy.sh
```

Builds the Docker image locally (needs Docker Desktop), ships it over SSH and restarts the container. `NEXT_PUBLIC_*` values are compiled in, so they are set in the script. Runtime secrets live in `.env` on the server, never in git.

The server can't run sharp, so photos are resized ahead of time: after adding a photo to `public/images/`, run `npm run images`.

## Content

All editable content is in `src/config/`:

- `site.ts`: name, phone, address, hours, navigation.
- `services.ts`: one entry per service page (copy, photos, SEO, FAQ). The homepage, services index, quote form, sitemap and schema read from it.
- `work.ts`, `work-images.ts`: job photos (frames from the client's TikTok, see `scripts/media/`).
- `reviews.ts`: real reviews copied word for word. Never write or edit review text.
- `blog.ts`: blog posts; the text of each is in `src/content/blog/<slug>.mdx`.

## Blog agent

A scheduled Claude Code agent publishes one post three times a week. It follows `scripts/blog-agent/AGENT.md`, takes topics from `topics.md`, checks the draft with `check.mjs` and sends it to `POST /api/blog/publish` (bearer token `BLOG_PUBLISH_TOKEN` in the server's `.env`; without it the route is a 404). It never commits.

- Published posts are JSON files in a volume on the server (`/data/blog` in the container), not in git. Hand-written posts stay MDX.
- The server checks every post against `src/lib/blog-rules.mjs` (the same rules `check.mjs` runs), allows one API post per 12 hours, and picks the cover from the work photos (`src/config/blog-covers.ts`).
- Pages that list posts are revalidated on publish and once after each server start, so new posts show up without a rebuild.
- Tests: `npm run build && npm run test:blog`.

Rules for all copy: plain and direct, no em dashes, no invented facts (prices, guarantees, licenses, years in business, project counts). Anything that needs the client's confirmation is marked `TODO: confirm with client`.
