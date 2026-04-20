# Handoff: Mostly Right — Design System & Docs Site

## Overview

This bundle packages everything needed to implement **Mostly Right's** brand/design system and a production **developer docs site**. Mostly Right is an AI-native data SDK for prediction-market traders and agents — `pip install mostlyright`. The design is a brutalist-minimal, instrument-panel aesthetic inspired by a Bloomberg terminal stripped to essentials.

## About the Design Files

The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, not production code to ship as-is. Your job is to **recreate these HTML designs in the target codebase's existing environment** (the Astro + TypeScript site at `github.com/Tarabcak/mostly-right-landing`, or whichever framework ends up hosting the docs). Use its established patterns, build pipeline, and component library — do not copy the React/JSX files verbatim.

## Fidelity

**High-fidelity.** All colors, type scale, spacing, borders, and interactions are final and intended to be matched pixel-perfectly. Every token is explicit below.

## Scope in this handoff

Two deliverables live in this bundle:

1. **Design System** (`design_system/`) — tokens, content rules, iconography, per-asset preview cards
2. **Docs Site** (`docs/`) — the full docs UI kit: top bar, collapsible sidebar, content column, code blocks with terminal chrome, endpoint headers, params tables, callouts, live playground, ⌘K palette

The marketing landing page and pitch deck are **out of scope for this handoff** — they live in the same source repo and already have working production code.

---

## Screens / Views

### 1. Docs Shell

**Layout** — three-column flex:
- **Top bar** (sticky, full-width, 56px tall tight variant / 64px airy): logo 18px tall, `/ docs` eyebrow, spacer, search button (260px min-width), version tag, GitHub link. 1px bottom border.
- **Left sidebar** (260px tight / 280px airy, sticky, full-height scroll). 1px right border. Collapsible sections with chevron (▸ / ▾). Active page has a 2px white left-rail indicator at `left: -16px`.
- **Main content** (flex: 1, centered, `max-width: 680px` tight / 720px airy, `padding: 56px 48px 96px` tight / `72px 56px 96px` airy). **No right TOC** — this was intentionally removed for focus.

### 2. Content Column (Quickstart example)

- **Eyebrow** — uppercase, 11px, letter-spacing `.14em`, color `rgba(255,255,255,.28)`, 20px below
- **H1** — Funnel Display 400, **56px**, line-height 1.02, letter-spacing `-0.035em`. 24px below.
- **Lead paragraph** — Funnel Display 300, 17px, line-height 1.6, letter-spacing `-0.005em`, color `rgba(255,255,255,.60)`, max-width 620px. This is the ONLY Funnel moment in body copy — everything else is mono.
- **H2** — Funnel Display 400, 22px, line-height 1.25, letter-spacing `-0.01em`, with a monospace step number (`01`, `02`, `03`) prefixed in `rgba(255,255,255,.28)`, gap 12px, 56px top margin
- **Body paragraphs** — JetBrains Mono 14px, line-height 1.75, color `rgba(255,255,255,.60)`
- **Steps row** (top of Quickstart) — 3-column grid, 1px border, each cell has `01 / 02 / 03` eyebrow + step title
- **Footer** — ← Introduction / Authentication →, 12px mono, 1px top border, 96px top margin

### 3. Code Block (the distinctive module)

Terminal-chrome treatment to visually separate code from surrounding text:

- **Outer**: `border: 1px solid rgba(255,255,255,.18)`, bg `#080808`, `box-shadow: inset 0 1px 0 rgba(255,255,255,.03), 0 1px 0 rgba(0,0,0,.4)`
- **Title bar**: `background: rgba(255,255,255,.02)`, 1px bottom border
  - Three traffic-light dots on the left — `8px × 8px`, circular, colors `#3a3a3a / #2a2a2a / #2a2a2a`, gap 5px, each with `1px solid rgba(255,255,255,.06)` border
  - Lowercase mono tab labels (`python`, `bash`, `curl`). Active tab: white text, 1px green (`#4ade80`) bottom border, bg `#080808`. Inactive: muted gray.
  - Filename (when present) — right side, 11px mono, faint
  - Copy button — right edge, 10px uppercase `.1em` tracking. Turns green `✓ Copied` for 1200ms after click.
- **Line numbers gutter**: `background: rgba(0,0,0,.25)`, `padding: 18px 12px 18px 16px`, right-aligned, `color: rgba(255,255,255,.28)`, `min-width: 36px`, tabular-nums, `user-select: none`, 1px right border
- **Code**: `padding: 18px 20px`, `font-size: 13px`, `line-height: 1.7`, whitespace: pre

**Syntax token classes** (all driven by CSS variables so themes swap cleanly):
- `.tk-c` comments → `--code-comment` italic
- `.tk-s` strings → `--code-string`
- `.tk-k` keywords → `--code-keyword`
- `.tk-n` numbers → `--code-number` tabular
- `.tk-f` functions / json keys → `--code-fn`

### 4. Endpoint Header

Horizontal row, `padding: 14px 18px`, bg `--docs-bg-elevated`, 1px border:
- Method badge — colored by verb (`GET` `#4ade80`, `POST` `#60a5fa`, `PATCH` `#fbbf24`, `DELETE` `#f87171`), 11px bold, `.08em` tracking, `2px 8px` padding, 1px border in method color
- Path — 14px mono, white
- Right side — `auth · Bearer` and `rate · 600 req/min`, faint

### 5. Params Table

1px outer border. Each row:
- `14px 18px` padding, 1px top separator
- Row grid: name + type + optional `REQUIRED` caution badge on one line, description below
- Children rows collapsible — chevron `▸ / ▾ {n} fields` on right, expands inline with a 2px strong-border left rail

### 6. Callout

`14px 18px` padding, 1px border with a **3px colored left border** (note → blue `#60a5fa`, tip → green `#4ade80`, warn → amber `#fbbf24`, caution → red `#f87171`). Label (64px min-width) in the colored hue, uppercase tracked. Title white, body muted.

### 7. Playground

2-column grid (inputs | response) with a 1px center gutter.
- Header strip — green 6×6 square + `LIVE PLAYGROUND` label
- Inputs side: `REQUEST` eyebrow; stacked labeled text inputs; `format` segmented control (json / toon) — active has solid white bg + black text; big `Run request →` button (white bg, black text, 2px border, 12px 16px padding)
- Response side: `RESPONSE` eyebrow + `200 · 43ms` status on success; pre-formatted JSON with syntax highlighting; 240px min-height

### 8. ⌘K Palette

Modal, centered at 12vh from top, 620px wide, grouped results (Ask AI / Recent / Pages / API):
- Overlay `rgba(0,0,0,.72)`
- Input row — 14px mono, ESC key hint on the right
- Rows: `›` bullet (or `✦` green for Ask-AI), title + sub caption, hint on right
- Keyboard: arrow up/down, enter, esc. Selected row has elevated bg + 2px white left rail.
- Footer row with key-cap hints

---

## Interactions & Behavior

- **⌘K / Ctrl+K** toggles the palette globally. ESC closes.
- **Sidebar sections** collapse on header click; chevron rotates.
- **Code tabs** switch language; copy button shows `✓ Copied` for 1200ms.
- **Params rows with children** toggle open on click.
- **Playground** simulates a 650ms latency; cycles mid price by a small jitter each run for realism.
- **Theme toggle** (Tweaks panel) swaps `data-theme="dark|light"` on `<html>` — all tokens invert via CSS variables.

## State Management

Lift only what needs to persist:
- `shell` (`tight | airy`), `theme` (`dark | light`), `codeTheme` (`mono | contrast | dimmed`) — top-level, apply as data-attrs on `<html>`
- `activePage`, `activeSectionId` — derived from route
- Per-component local state for: code tab selection, sidebar section open/closed, params row expanded, cmdK open + query + selected index

No global store needed; React context or plain props is sufficient.

## Design Tokens

All tokens live in `design_system/colors_and_type.css` and `docs/tokens.css`. Key values:

### Colors (dark, default)
```
--docs-bg:             #0a0a0a
--docs-bg-elevated:    #0e0e0e
--docs-bg-code:        #080808
--docs-border:         rgba(255,255,255,0.08)
--docs-border-strong:  rgba(255,255,255,0.18)
--docs-fg-heading:     #ffffff
--docs-fg:             #e8e8e8
--docs-fg-muted:       rgba(255,255,255,0.60)
--docs-fg-subtle:      rgba(255,255,255,0.45)
--docs-fg-faint:       rgba(255,255,255,0.28)

--docs-accent-live:    #4ade80   // green, pulses
--docs-note:           #60a5fa
--docs-warn:           #fbbf24
--docs-caution:        #f87171
--docs-tip:            #4ade80
--docs-get:            #4ade80
--docs-post:           #60a5fa
--docs-patch:          #fbbf24
--docs-delete:         #f87171
```

### Typography
- **Display:** Funnel Display (self-host `.woff2` from the marketing repo's `public/fonts/`; fallback `ui-sans-serif, system-ui`). Use weights 300 / 400.
- **Mono:** JetBrains Mono (same source). Use 400 / 500 / 600 / 700. Enable `font-feature-settings: 'ss01', 'cv11'`.
- Body default: **mono 14px / line-height 1.65**. Don't drift off this.

### Spacing
Preferred rhythm: `8 / 14 / 18 / 24 / 28 / 44 / 56 / 80 / 96`. No arbitrary values.

### Borders & radius
- All borders 1px (module outer borders 1px `--docs-border-strong`).
- **`border-radius: 0` everywhere** — this is non-negotiable. Brutalist.

### Shadows
- Inset title-bar highlight: `inset 0 1px 0 rgba(255,255,255,.03)`
- Outer lift: `0 1px 0 rgba(0,0,0,.4)`
- Modal: `0 40px 80px rgba(0,0,0,0.5)`
- Otherwise avoid shadows.

## Assets

- **Logo files** (`design_system/assets/`): `logo-white.svg`, `logo-dark.svg`, `logo.svg`, `logo-light.svg` — already have inline fills (`fill="#ffffff"` / `fill="#0a0a0a"`) so no CSS dependency.
- **Fonts**: missing from this bundle. Pull `.woff2` files from the source repo's `public/fonts/` directory and self-host. Do not use Google Fonts CDN in production.
- **No icon set** — iconography is deliberately limited to: arrows (→ ← ↗), chevrons (▸ ▾), bullets (·), box-drawing chars when needed (├── └──), and the green status square. Do not introduce Lucide / Heroicons.

## Content Rules (strict)

- **Casing**: body in sentence case, interactive text (buttons, nav, labels, eyebrows) UPPERCASE with letter-spacing `.06em` (buttons) or `.12–.14em` (eyebrows).
- **No emoji.** Ever. Unicode used for structure is fine.
- **Em-dashes and arrows** are welcome; ellipses only inside truncated code.
- **Numbers are content** — always `font-variant-numeric: tabular-nums` where digits live.
- **Voice**: first-person plural ("we built"), addressed to "you". Agents are first-class readers.
- **Anti-tone**: avoid "seamless", "empower", "delight", "cutting-edge". If it sounds like SaaS marketing, rewrite.

## Files in this bundle

- `design_system/` — `README.md` (foundations + content rules), `SKILL.md`, `colors_and_type.css`, `assets/`, `preview/` (one card per token group)
- `docs/` — `index.html` (entry), `tokens.css`, `Shell.jsx` (TopBar + Sidebar), `Modules.jsx` (CodeTabs, Endpoint, Params, Callout, Playground, ⌘K, syntax highlighter), `Pages.jsx` (QuickstartPage, ApiRefPage)
- `reference/` — `llms.txt` (product copy snapshot)

## Source repo

`github.com/Tarabcak/mostly-right-landing` is the source of truth for the marketing site, brand, and existing tokens. Cross-check there before adding anything.
