import { defineConfig, loadEnv } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

const normalizeSiteUrl = (value) => {
  const url = new URL(value);

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('SITE_URL must use http:// or https://.');
  }

  url.hash = '';
  url.search = '';
  url.pathname = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;

  return url;
};

const createSeoPlugin = (siteUrl) => ({
  name: 'seo-metadata-and-assets',
  transformIndexHtml(html) {
    return html.replaceAll('__SITE_URL__', siteUrl.href);
  },
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'robots.txt',
      source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl.href}sitemap.xml\n`,
    });
    this.emitFile({
      type: 'asset',
      fileName: 'sitemap.xml',
      source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl.href}</loc>
  </url>
</urlset>
`,
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const hasProductionUrl = Boolean(env.SITE_URL?.trim());
  const siteUrl = normalizeSiteUrl(env.SITE_URL || 'http://localhost:5173/');

  if (mode === 'production' && !hasProductionUrl) {
    console.warn(
      '\n[seo] SITE_URL is not set. Using http://localhost:5173/ for this local build.\n' +
        '[seo] Set SITE_URL to the final public URL in the hosting environment before deployment.\n',
    );
  }

  return {
    // Keep the current GitHub Pages path for local builds. A production SITE_URL
    // automatically switches the base to the final host or subdirectory.
    base: hasProductionUrl ? siteUrl.pathname : '/aleksandra_masaz/',
    server: {
      port: 5173,
    },
    build: {
      assetsInlineLimit: 4096,
    },
    plugins: [
      createSeoPlugin(siteUrl),
      ViteImageOptimizer({
        // The hero is pre-encoded as high-quality WebP. Re-encoding it here
        // noticeably shifts the warm skin tones toward sepia.
        exclude: /hero-bg(?:-[^/]+)?\.webp$/i,
        // Keep <symbol> sprites intact (icons.svg) — SVGO drops "unused" symbols and ids by default
        svg: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeHiddenElems: false,
                  cleanupIds: false,
                  removeUselessDefs: false,
                },
              },
            },
          ],
        },
        png: { quality: 80 },
        jpeg: { quality: 80 },
        jpg: { quality: 80 },
        webp: { quality: 80 },
      }),
    ],
  };
});
