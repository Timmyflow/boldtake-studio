# BOLDTAKE → Vercel

Deployed on 2026-09-20: https://boldtake-studio.vercel.app. Original Higgsfield site remains unchanged.

GitHub: https://github.com/Timmyflow/boldtake-studio (main).
Vercel: timur15/boldtake-studio, connected to GitHub main with root directory app.
Initial deployment: dpl_4N2YNJNL5TEP8YjahnD4nyJWXJDu, READY.
User requested deployment on the existing Hobby plan after being informed of its commercial-use restriction. No upgrade or purchase performed.

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
- Saved GitHub validation workflow for standard Ubuntu runners in ci/github-validation.yml. It is not active: the available Git credential lacks workflow scope. Source was published as a new snapshot; original local history remains on migration-history.
- Production build and six existing tests pass.
- Local HTTP checks: homepage 200, robots and sitemap 200, /app redirects, unknown URL 404, full video reachable.

## Remaining

1. Inspect deployed desktop/mobile layouts, scroll animation, video playback, modal close, FAQ accordion, pricing selection, and Telegram handoff in a browser when access is available.
2. Connect the chosen custom domain later; set VITE_SITE_URL and rebuild when changing domain.

Public HTTP verification passed: homepage and six linked JS/CSS assets 200, robots and sitemap 200, canonical uses the assigned vercel.app domain, /app redirects to root, unknown URL returns 404. All four full videos return 206 with valid Content-Range headers. GitHub connection and root directory verified through Vercel API.

## Local use

From app/: bun install --frozen-lockfile, bun run test, bun run build.
Preview: bun run preview --host 127.0.0.1 --port 4173.

The brief form prepares a Telegram message to lmaze22; the visitor sends it. There is no lead database to migrate. No message was sent during checks.

Browser security verification previously blocked the localhost preview, so visual and interactive QA is still outstanding. Successful builds and HTTP checks are not visual acceptance. Production Vercel media delivery correctly honors byte-range requests.
