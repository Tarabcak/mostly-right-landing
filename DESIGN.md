# Design System -- Mostly Right

## Product Context
- **What this is:** Landing site and pitch deck for Mostly Right, a Python SDK and API for prediction-market traders and AI agents. Weather ships first.
- **Who it's for:** Quants, AI agent builders, Kalshi/Polymarket traders. Technical audience, self-selects. Not enterprise buyers.
- **Space/industry:** Developer tools, fintech infrastructure, prediction-market data.
- **Project type:** Marketing site + pitch deck (Astro, vanilla CSS, no component framework beyond Astro islands).

## Aesthetic Direction
- **Direction:** **Refined Brutalist-Minimal** pushed toward *Instrument Panel* energy. Bloomberg terminal stripped to essentials. Trading cockpit, not SaaS landing.
- **Decoration level:** **Intentional** (upgraded from pure minimal). Type and data do the work. Three admitted primitives: type-only data visualizations, one signature motion, one accent color.
- **Mood:** Confident, precise, research-grade. Should feel like an instrument, not a pitch. The audience should feel it was built *by* quants, not *marketed to* them.
- **Reference points:** Linear (monospace signature + grid animations), Cursor (live product artifact in hero), Vercel (restrained palette + one accent), Bloomberg Terminal (density + instrument aesthetic).

## Typography
- **Display/Hero:** Funnel Display, weight 400 — geometric sans with personality. Carries headlines and stat numbers.
- **Body/UI/Labels/Code/Data:** JetBrains Mono, weights 400 and 700 — monospace everywhere. Reinforces "built for developers" positioning. Data-native.
- **Numbers in data contexts:** `font-variant-numeric: tabular-nums` (MANDATORY on stat rows, tables, terminal blocks, ASCII grids).
- **Loading:** Self-hosted `.woff2` files in `/public/fonts/`, preloaded in `BaseLayout.astro`.

### Strict 3-tier scale (enforce across all pages)
| Tier | Role | Size | Weight | Line-height | Tracking |
|------|------|------|--------|-------------|----------|
| Marquee | Hero H1, Anchor-section H2 | clamp(60px, 7vw, 80px) | 400 | 1.05 | -0.02em |
| Standard | Section H2 | clamp(32px, 4vw, 44px) | 400 | 1.15 | -0.02em |
| Minor | Pillar/Card H3, Agent-tile keys | 22-26px | 400 | 1.3 | -0.01em |
| Body | Paragraphs, UI copy | 14-15px | 400 | 1.75-1.85 | 0 |
| Label | Eyebrows, counters, stat labels | 11-13px | 700 | 1.4 | 0.06-0.14em |

**Rule:** Every section opens at Standard. Anchor sections (one per page max — e.g., Proof) use Marquee. Never more than one Marquee per section.

## Color
- **Approach:** **Monochrome + ONE accent.** Accent reserved exclusively for LIVE/status signals.
- **Background:** #0a0a0a
- **Text primary:** #fff
- **Text heading:** rgba(255,255,255,.9)
- **Text body:** rgba(255,255,255,.55)
- **Text muted:** rgba(255,255,255,.5)
- **Text subtle:** rgba(255,255,255,.35)
- **Text faint:** rgba(255,255,255,.25)
- **Border default:** rgba(255,255,255,.1)
- **Border input:** rgba(255,255,255,.2)
- **Border focus:** rgba(255,255,255,.5)
- **Surface white:** #fff (CTAs, buttons)
- **Surface card:** rgba(255,255,255,.06) (code blocks, terminal blocks, tree cards)
- **Accent LIVE:** `#4ade80` (Terminal Green) — allowed ONLY on: live-status pulse dots, "LIVE" badges, a sparkline stroke (if ever added). NEVER on buttons, links, borders, large type, or decoration.
- **Success:** #35BE76 (form success state only — carryover, not a design-system accent)
- **Error:** #BE3535 (form error state only — carryover, not a design-system accent)

**Rule:** If tempted to use the accent anywhere except LIVE/status, stop. The scarcity of the accent is the point.

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable.
- **Base section padding:** 80px (standard) / 112px (anchor sections) / 56px (mobile).
- **Inner padding:** 48px desktop / 24px mobile.
- **Max content width:** 1200px.

## Layout
- **Approach:** Grid-disciplined with **forced section rhythm**.
- **Max content width:** 1200px, centered.
- **Border radius:** 0px everywhere. Brutalist. No exceptions.
- **Alignment:** Left-aligned body text by default. Never center hero text. Never center body paragraphs. Stat blocks may center.
- **FORCED RHYTHM RULE:** No two adjacent sections may share the same shape. Vary at least one of: alignment, density, grid column count, content-type (prose vs data vs code), or background card. The page's rhythm is itself a design element.

### Page composition rules
- Hero: 2-column on desktop (text left, instrument/data right), single column on mobile.
- Pain/Package/Agents: 2×2 grid.
- Weather/Markets/CodePreview: full-width with asymmetric inner elements.
- Proof: anchor section, centered 3-stat.
- What's Next: 2×2 grid with horizontal rhythm break from preceding section.

## Motion
- **Approach:** **Intentional** (upgraded from minimal-functional). Reveals for comprehension + one signature motion primitive + one live pulse.
- **Primary easing:** cubic-bezier(0.16, 1, 0.3, 1) — fast start, gentle land.
- **Button easing:** cubic-bezier(0.33, 1, 0.68, 1).
- **Bounce easing:** cubic-bezier(0.34, 1.56, 0.64, 1) — CTA button scale-in only.
- **Durations:** 0.5s-0.8s reveals, 0.3s hovers, 0.15s press feedback, 2s live pulse.
- **Stagger pattern:** 0.15s delay between siblings.
- **Signature motion primitive:** *Live pulse* — slow opacity breathing (1 → 0.3 → 1 over 2s, `ease-in-out`, infinite) on elements tagged `.live-dot`. Reserved for status indicators.
- **Reduced motion:** All animations collapse to 0.01ms; live pulse hidden.

## Interaction Patterns
- **Button hover:** Dark fill slides up from bottom via `::before` translateY.
- **Button press:** scale(0.96).
- **Focus visible:** 2px solid rgba(255,255,255,.5), 4px offset.
- **Links:** Color transition on hover; `color: inherit` by default to prevent default-blue leak on wrapper anchors.

## Signature Moves (our "own face")
1. **Monospace data grids as first-class design elements** — not hidden in code blocks. Stat rows, source lists, ASCII trees, terminal-style cards are all composition-level elements.
2. **Terminal-output-as-hero** — substitute for product screenshots. Hero has a mono readout block opposite the text that looks like a live instrument.
3. **ASCII-art dividers and trees** — `├── candles`, `└── cli_record`. Promote to signature, don't apologize for it.
4. **Aggressive left-alignment** — refuses centered hero convention. The whole page reads like a trading terminal readout, not a marketing page.
5. **Pure type-only visualizations** — no chart libraries ever. If we need to show data, we use monospace + borders.

## Anti-patterns (do NOT do)
- Centered hero text or body paragraphs
- Rounded corners on any element
- Icons in circles, decorative icons, illustrations
- Gradients as primary surfaces (hero backgrounds, card fills)
- Accent color on buttons, links, borders, or decoration
- More than one Marquee-scale heading per section
- Two adjacent sections with identical layout shape
- Product mockup screenshots (we don't have product yet — use terminal/data blocks instead)

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-07 | Initial design system created | Extracted from existing homepage, extended for pitch deck via /design-consultation |
| 2026-04-07 | Hero stat capped at 100px | 140px was too dominant, 100px reads well without overwhelming |
| 2026-04-07 | Block stat numbers capped at 48px | 72px felt like a billboard, 48px feels like data |
| 2026-04-07 | Pitch deck horizontal padding 64px | 48px felt cramped in single-viewport slides |
| 2026-04-07 | No accent color | Monochrome reinforces the research-grade positioning |
| 2026-04-15 | Section padding reduced 120 → 80px (anchor 112px) | Page was 9,657px / 12 viewports. 1,920px was pure padding. Matches Stripe/Vercel density norms. |
| 2026-04-15 | H2 size tiered: Marquee / Standard / Minor | Uniform 48px across 8 sections created no hierarchy. Anchor sections now use Marquee (60-80px), others Standard (32-44px). |
| 2026-04-15 | Added `#4ade80` Terminal Green as accent, scoped to LIVE/status only | Landscape research (Vercel/Linear/Cursor) showed pure monochrome reads austere. One accent with strict scarcity = unmistakable. |
| 2026-04-15 | Decoration upgraded minimal → intentional | Pure type was reading as "unfinished," not "brutalist." Added three primitives: type-only data viz, one signature motion, one accent. |
| 2026-04-15 | Forced section rhythm rule added | 8 identical eyebrow+h2+body sections = cookie-cutter AI-slop pattern. No two adjacent sections may share shape. |
| 2026-04-15 | Terminal-block-as-hero pattern codified | Substitute for missing product screenshot. Makes the hero feel like an instrument readout. Solves the "underweight hero" audit finding. |
| 2026-04-15 | Code syntax colors stripped to opacity variants | Purple/blue/green Dracula-theme violated "monochrome only." Syntax highlighting now uses only white opacity variants. |
