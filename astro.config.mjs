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
      title: 'MostlyRight Docs',
      description: 'Settlement truth layer for prediction markets',
      customCss: ['./src/styles/docs-overrides.css'],
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
