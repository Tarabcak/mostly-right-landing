import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mostlyright.xyz',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory'
  }
});
