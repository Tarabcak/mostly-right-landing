---
name: mostly-right-design
description: Use this skill to generate well-branded interfaces and assets for Mostly Right, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference

- **Palette:** monochrome on `#0a0a0a`, white at opacity (90/55/50/35/25%). One accent `#4ade80` reserved for LIVE/status dots only — never on buttons, links, borders, or decoration.
- **Type:** Funnel Display 400 (headlines, stats), JetBrains Mono 400/700 (everything else). Tabular-nums mandatory on data.
- **Radius:** 0. Always. No exceptions.
- **No gradients. No drop shadows. No icons. No illustrations. No emoji.**
- **Signature motion:** `.live-dot` opacity pulse 2s. Reveals use `cubic-bezier(0.16,1,0.3,1)`.
- **Ambient visual:** ASCII monospace wave canvas — the only animated background the brand uses.
- **Voice:** first-person plural, lowercase-first, confident. Numbers as content (`$2B → $23B`). Never "empower," "seamless," "revolutionary."
- **Layout:** 1200px max, left-aligned, forced section rhythm.
