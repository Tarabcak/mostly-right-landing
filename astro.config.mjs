import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi';

// Relabel internal-feeling OpenAPI tags before Starlight renders the
// sidebar. Source of truth for the relabel map — a future
// rename-at-source migration in the mostlyright API can delete this
// block without changing any other config.
const TAG_LABELS = {
  'Feature Catalog': 'Feature Reference',
  Snapshot: 'Real-Time Snapshot',
  Meta: 'About the API',
};


export default defineConfig({
  site: 'https://mostlyright.md',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    starlight({
      title: 'Mostly Right',
      description: 'Settlement truth layer for prediction markets',
      // Starlight's default assumes /favicon.svg (which we don't ship) —
      // point at the real PNG in public/. Same asset used by the landing
      // pages, so favicon matches across the whole site.
      favicon: '/favicon.png',
      customCss: ['./src/styles/docs-overrides.css'],
      // Force dark mode on every docs page — handoff DESIGN.md is
      // dark-only. The inline script sets data-theme BEFORE Starlight's
      // built-in ThemeProvider runs, so there's no light-mode flash on
      // users who have prefers-color-scheme: light. Also wipes any stale
      // 'light' choice from localStorage (prior versions of the site
      // may have surfaced a theme toggle we later removed).
      head: [
        {
          tag: 'script',
          content: `
            (function () {
              try {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.documentElement.setAttribute('data-code-theme', 'contrast');
                document.documentElement.style.colorScheme = 'dark';
                if (typeof localStorage !== 'undefined') {
                  localStorage.setItem('starlight-theme', 'dark');
                }
              } catch (e) {}
            })();
          `.trim(),
        },
      ],
      // Marketing wordmark (wave mark + "Mostly Right" lockup). Using
      // replacesTitle:true hides the text title so the SVG carries the
      // brand. The faint "/ docs" eyebrow is added in CSS so it can go
      // beside the wordmark without stretching the logo artwork.
      logo: {
        src: './src/assets/logo-white.svg',
        replacesTitle: true,
      },
      // Override SocialIcons with our custom component that renders
      // the version tag + "GitHub ↗" text link (per Claude design).
      // Override Search with our ⌘K palette (handoff §8 — grouped
      // results Ask AI / Recent / Pages / SDK / API, ✦ bullet for AI
      // rows, keyboard nav, ESC to close). Starlight's default
      // Pagefind search still builds the index (see pagefind output);
      // a future enhancement can pipe that into our palette.
      components: {
        SocialIcons: './src/components/docs/DocsTopRight.astro',
        Search: './src/components/docs/CmdK.astro',
        // Custom page title: renders optional `eyebrow` frontmatter
        // field above the H1, per handoff §2 Content Column ordering
        // (eyebrow → H1 → lead).
        PageTitle: './src/components/docs/PageTitle.astro',
        // Custom pagination: starlight-openapi generates pages at
        // runtime via middleware, so Starlight's native prev/next
        // (computed from the content collection at build time) ships
        // empty on API-ref pages. Our override reads the live sidebar
        // and falls back to that when pagination is empty.
        Pagination: './src/components/docs/Pagination.astro',
        // Custom <head>: Starlight doesn't emit og:image, twitter:image,
        // twitter:title, or twitter:description by default. The override
        // appends them, pointing at the Satori-generated OG PNG for each
        // page (see src/pages/og/[...slug].png.ts).
        Head: './src/components/docs/Head.astro',
      },
      // Remove right-rail TOC per design handoff — intentional
      // "No right TOC — removed for focus." The column centers on the
      // 720px main content instead. Per-page can re-enable if needed.
      tableOfContents: false,
      expressiveCode: {
        // Syntax tokens are flattened to monochrome via CSS overrides
        // in docs-overrides.css (`.expressive-code span[style^='--']`
        // block). Starlight's config serializer drops custom Shiki theme
        // objects — setting `themes: [{...}]` here has no effect. Instead
        // we let the default Night Owl theme render, then neutralize its
        // token colors in CSS. Matches handoff tokens.css monochrome
        // default (--code-fg: rgba(255,255,255,0.78)).
        // Plugins (line numbers) and defaultProps live in ec.config.mjs —
        // that file is dynamically imported so plugin methods survive
        // the integration's config serialization (functions can't ride
        // through JSON). Styling (data-only) can stay inline here.
        styleOverrides: {
          borderColor: 'rgba(255,255,255,0.18)',
          borderRadius: '0',
          codeBackground: '#080808',
          codeFontFamily: "'JetBrains Mono', monospace",
          codeFontSize: '13px',
          codeLineHeight: '1.7',
          frames: {
            frameBoxShadowCssValue: 'inset 0 1px 0 rgba(255,255,255,.03), 0 1px 0 rgba(0,0,0,.4)',
            editorActiveTabIndicatorBottomColor: '#4ade80',
            editorActiveTabIndicatorTopColor: 'transparent',
            editorActiveTabBackground: '#080808',
            editorTabBarBackground: 'rgba(255,255,255,0.02)',
            terminalTitlebarBackground: 'rgba(255,255,255,0.02)',
            terminalBackground: '#080808',
            terminalTitlebarBorderBottomColor: 'rgba(255,255,255,0.18)',
          },
        },
      },
      plugins: [
        starlightOpenAPI([
          {
            // 'docs/api' (NOT 'api') keeps the API reference under
            // /docs/api/ to match prose pages also under /docs/.
            base: 'docs/api',
            label: 'API Reference',
            schema: './src/content/docs/docs/_generated/openapi.json',
          },
        ]),
      ],
      sidebar: [
        {
          label: 'Get Started',
          items: [
            { label: 'Introduction', slug: 'docs/introduction' },
            { label: 'Quickstart', slug: 'docs/quickstart' },
            { label: 'Authentication', slug: 'docs/authentication' },
          ],
        },
        {
          label: 'SDK',
          items: [
            { label: 'Installation', slug: 'docs/sdk/installation' },
            { label: 'TherminalClient', slug: 'docs/sdk/therminal-client' },
            { label: 'WeatherLive', slug: 'docs/sdk/weather-live' },
          ],
        },
        {
          label: 'Concepts',
          items: [
            { label: 'Data sources', slug: 'docs/concepts/data-sources' },
            { label: 'Raw-as-reported', slug: 'docs/concepts/raw-as-reported' },
            { label: 'Observation schema', slug: 'docs/concepts/observation-schema' },
          ],
        },
        ...openAPISidebarGroups.map((g) => ({
          ...g,
          label: TAG_LABELS[g.label] ?? g.label,
        })),
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Tarabcak/mostlyright',
        },
      ],
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
});
