# BOLDTAKE → Vercel

Prepared on 2026-09-20. Not yet deployed. Original Higgsfield site remains unchanged.

## Source

- Original: https://boldtake-studio.higgsfield.app/
- Exported Higgsfield revision: f8d6882.
- Backup: /Users/timur-tether/Projects/boldtake-source-f8d6882.zip
- Application root: app/.
- Stack: TanStack Start / React / Vite, Nitro Vercel preset, Bun.

## Completed

- Replaced Cloudflare build integration with Nitro Vercel output.
- Preserved site design and scroll engine.
- Disabled Higgsfield design inspector in the standalone build.
- Copied all four full portfolio videos into app/public/assets/films; previews were already local.
- Centralized canonical, Open Graph URL and sitemap origin in VITE_SITE_URL.
- Updated GitHub validation workflow for standard Ubuntu runners.
- Production build and six existing tests pass.
- Local HTTP checks: homepage 200, robots and sitemap 200, /app redirects, unknown URL 404, full video reachable.

## Remaining

1. Resolve hosting plan: connected Vercel team timur15 is Hobby. Vercel reserves Hobby for non-commercial use; this commercial studio needs a suitable plan. No upgrade or purchase was performed.
2. Create an empty private GitHub repository, e.g. Timmyflow/boldtake-studio. Connected GitHub tooling cannot create repositories. Browser access to GitHub was blocked because the admin-enforced policy could not be verified; no bypass attempted.
3. Push this local repository to the new repository through an authorized connection.
4. Import on Vercel, select root directory app, use the checked-in vercel.json and Node 24.
5. Set VITE_SITE_URL to the confirmed public domain before building. The current boldtake-studio.vercel.app value is a proposed address, not an assigned or verified domain.
6. Inspect deployed desktop/mobile layouts, scroll animation, video playback and seeking, modal close, FAQ accordion, pricing selection, and Telegram handoff.
7. Verify production canonical, sitemap, Open Graph and all media URLs, then connect the chosen custom domain.

## Local use

From app/: bun install --frozen-lockfile, bun run test, bun run build.
Preview: bun run preview --host 127.0.0.1 --port 4173.

The brief form prepares a Telegram message to lmaze22; the visitor sends it. There is no lead database to migrate. No message was sent during checks.

Browser security verification also blocked the localhost preview, so visual and interactive QA is still outstanding. Successful builds and HTTP checks are not visual acceptance. Local preview did not honor the tested video Range request (returned 200); verify seeking on Vercel's static asset delivery.
