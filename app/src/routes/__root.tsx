import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import studioCss from "../studio.css?url";
import { scrollScrubTheme } from "../scroll-scrub-scenes";
import { reportHiggsfieldError } from "../lib/higgsfield-error-reporting";
// Page metadata (browser <title>/favicon + social og: tags) committed into the
// repo by the marketplace meta API and read at BUILD time — no runtime fetch.
// Editing it via the app settings UI rewrites this file and redeploys the app.
import appMetaJson from "../app-meta.json";
import { siteUrl } from '../site-config';

declare const __HF_DESIGN_INSPECTOR__: boolean;

// Built-in defaults for any field that isn't set in app-meta.json.
const DEFAULT_TITLE = "BOLDTAKE";
const DEFAULT_DESCRIPTION = "Рекламна студія";

type AppMeta = {
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  favicon_url?: string | null;
  og_video_url?: string | null;
  // Read by the Higgsfield platform (marketplace feed card), never by the
  // app itself — keep it in this file, don't render it.
  marketplace_cover_url?: string | null;
};

const appMeta = appMetaJson as AppMeta;

// Build the document head (title / description / og: / twitter: / favicon) from
// app-meta.json, falling back to the defaults above for any unset field.
// og_title/og_description double as the browser <title> and meta description;
// og_image_url (when set) also drives the twitter card + image. Built from
// inline tag literals (conditional spreads for the optional image/favicon) so
// it matches the head() shape TanStack expects.
// favicon/og images live in THIS app's own /assets, so the host is never
// inherent. app-meta.json may carry an absolute higgsfield-app URL with a STALE
// host — baked from the app this one was copied/remixed/renamed from — which would
// serve the wrong app's favicon/og. Strip any higgsfield-app host (prod
// higgsfield.app + dev higgsfield-dev.app) down to a root-relative path so it
// always resolves against whoever serves THIS page (preview / prod / custom
// domain). Genuinely external URLs (a CDN image the owner set) are left absolute.
const APP_HOST_ZONES = ["higgsfield.app", "higgsfield-dev.app"];

function toOwnAssetUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("/")) return value; // already root-relative
  try {
    const u = new URL(value);
    const isAppHost = APP_HOST_ZONES.some(
      (zone) => u.hostname === zone || u.hostname.endsWith(`.${zone}`),
    );
    if (isAppHost) return u.pathname + u.search;
    return value; // external host (CDN, etc.) — keep absolute
  } catch {
    return value; // not a parseable URL — leave as-is
  }
}

function buildHead(meta: AppMeta) {
  const title = meta.og_title ?? DEFAULT_TITLE;
  const description = meta.og_description ?? DEFAULT_DESCRIPTION;
  const ogImagePath = toOwnAssetUrl(meta.og_image_url);
  const ogImage = ogImagePath ? new URL(ogImagePath, siteUrl).href : null;
  const favicon = toOwnAssetUrl(meta.favicon_url);
  const ogVideo = toOwnAssetUrl(meta.og_video_url);

  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title },
      { name: "description", content: description },
      { name: "author", content: "BOLDTAKE" },
      { name: "theme-color", content: scrollScrubTheme.background },
      { property: "og:url", content: `${siteUrl}/` },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "BOLDTAKE" },
      { property: "og:locale", content: "uk_UA" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:card", content: ogImage ? "summary_large_image" : "summary" },

      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { property: "og:image:width", content: "1600" },
            { property: "og:image:height", content: "838" },
            { property: "og:image:alt", content: "BOLDTAKE — рекламна студія" },
            { name: "twitter:image:alt", content: "BOLDTAKE — рекламна студія" },
            { name: "twitter:image", content: ogImage },
          ]
        : []),
      // Cover video (og:video) — the animated counterpart of og:image; the
      // Higgsfield feed cards also play it on hover.
      ...(ogVideo ? [{ property: "og:video", content: ogVideo }] : []),
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: studioCss },
      { rel: "canonical", href: `${siteUrl}/` },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ...(favicon ? [{ rel: "icon", href: favicon, ...(favicon.endsWith(".png") ? { type: "image/png", sizes: "192x192" } : {}) }] : []),
    ],
  };
}

function NotFoundComponent() {
  return (
    <main className="error-page">
      <h1>Сторінку не знайдено</h1>
      <p>Перейдіть на головну, щоб переглянути роботи студії.</p>
      <Link to="/">На головну ↗</Link>
    </main>
  );
}
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportHiggsfieldError(error, { boundary: "root" });
  }, [error]);
  return (
    <main className="error-page">
      <h1>Не вдалося відкрити сторінку</h1>
      <button
        onClick={() => {
          router.invalidate();
          reset();
        }}
      >
        Спробувати ще раз
      </button>
      <a href="/">На головну</a>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // Read the committed page metadata at build time (no runtime fetch).
  head: () => buildHead(appMeta),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" data-theme="default-dark" style={{ colorScheme: "dark" }}>
      {/* Marketplace apps are permanently dark: data-theme is pinned on <html>
          above. Do not add quanta's bootstrapScript/ThemeController, a theme
          toggle, or a light mode. */}
      <head>
        <HeadContent />
      </head>
      <body className="studio-body">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if (!__HF_DESIGN_INSPECTOR__) {
      return;
    }

    void import("../module/design-inspector/runtime")
      .then(({ installHiggsfieldDesignInspector }) => {
        installHiggsfieldDesignInspector();
      })
      .catch((error) => {
        reportHiggsfieldError(
          error instanceof Error ? error : new Error("Failed to load design inspector"),
          {
            boundary: "higgsfield_design_inspector_import",
          },
        );
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
