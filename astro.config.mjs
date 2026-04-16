import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://mostlyright.xyz',
  output: 'static',
  trailingSlash: 'always',

  build: {
    format: 'directory'
  },

  adapter: cloudflare()
});