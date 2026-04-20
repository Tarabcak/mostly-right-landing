// Expressive Code config loaded at runtime via dynamic import
// (astro-expressive-code picks this up automatically when it exists).
//
// This file is the only reliable home for PLUGIN INSTANCES —
// Starlight's integration stringifies its expressiveCode config via
// stableStringify, which drops plugin object methods (they aren't JSON-
// serializable). Loading plugins here keeps their hooks intact.
//
// Keep any option that is pure data (themes, styleOverrides, defaultProps)
// in astro.config.mjs for visibility. Only plugins need to live here.

import { defineEcConfig } from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

export default defineEcConfig({
  plugins: [pluginLineNumbers()],
  defaultProps: {
    showLineNumbers: true,
  },
});
