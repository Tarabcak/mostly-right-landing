# Mostly Right — Design System

Brutalist-minimal, instrument-panel aesthetic for an AI-native data SDK that serves prediction-market traders and agents. Bloomberg terminal stripped to essentials.

## What this brand is

Mostly Right ships a Python SDK + API (`pip install mostlyright`) that unifies Kalshi and Polymarket prices **plus** the real-world data that settles each contract. Weather ships first; sports, economics, esports, commodities follow.

- **Audience:** quants, AI-agent builders, Kalshi/Polymarket traders. Technical. Self-selecting.
- **Surfaces:** marketing site (`/`), weather SDK page (`/weather/`), pitch deck (`/pitch/*`), Python library, docs.
- **Product tone:** research-grade, not sales-y. "Built by quants, not marketed to them."

## Sources (for future maintainers)

- **Repo (source of truth):** `github.com/Tarabcak/mostly-right-landing` (main)
- **DESIGN.md** in repo root — codified design rules and decisions log
- **PLAN.md** — execution plan for landing + weather + pitch
- **src/styles/** — `global.css`, `homepage.css`, `pitch.css`, `weather.css`
- **reference/llms.txt**, **reference/llms-full.txt** — product copy snapshot, preserved here

## Index (this folder)

| File | Purpose |
|---|---|
| `README.md` | You are here. Foundations, content rules, iconography. |
| `SKILL.md` | Agent-invocable skill wrapper. |
| `colors_and_type.css` | Tokens: colors, type scale, spacing, motion. |
| `assets/` | Logos (white / light / dark), favicons if any. |
| `fonts/` | Self-hosted `.woff2` — **MISSING, see Caveats.** |
| `preview/` | One small HTML card per token group, registered to the Design System tab. |
| `ui_kits/landing/` | High-fidelity recreation of the marketing site. |
| `ui_kits/pitch/` | Pitch-deck slide templates (Title, Stat split, Code split, Team, etc). |
| `reference/` | Snapshotted product copy from the repo's `public/llms*.txt`. |

---

## Content Fundamentals

**Voice.** First-person plural. "We built the API we wished existed." Direct, lowercase-first sentences, no corporate softening. Confident without swagger. Example openers from the deck and llms.txt:

- "Prediction markets just exploded."
- "We use it to trade every day."
- "If the stack works for weather, it works for everything."

**Who-speaks.** "We" (the company) → "you" (the reader, a technical builder). Never "our customers," never "users," rarely "teams." Agents are addressed as first-class readers ("if you are an agent trying to understand the product, fetch /llms-full.txt").

**Casing.**
- Body: sentence case. Quiet, readable.
- Interactive text (nav, buttons, labels, eyebrows): **UPPERCASE** with `letter-spacing: .06em` (buttons/links) or `.12em` (eyebrows).
- Numbers and identifiers: kept in-line, monospace, e.g. `KNYC-HIGH-2026-04-15`, `$2B → $23B`, `75% win rate`.

**Length.** Short lines. Section leads max ~2 short sentences. Body paragraphs 2–4 lines. Every claim earns its space.

**Data-as-copy.** Numbers are content, not decoration. When a sentence can become a stat block, it should: `$2B → $23B` reads louder than "10× growth." Use `font-variant-numeric: tabular-nums` everywhere digits appear.

**Em-dashes** — yes. **Arrows** → yes (both → and ←, used for transitions: "Weather first → sports, economics, and more"). **Ellipses …** — only inside code blocks that are actually truncated.

**Emoji.** Never. Not in marketing, not in docs, not in pitch. Unicode used as *structural* markup (├── └── → · ×) is welcome; pictographs are not.

**Tone examples from the repo you should imitate:**

> "When you force people to back their opinions with money, the noise disappears."
> "We store raw-as-reported. First observation wins. Your backtest matches reality."
> "Not a trading app. Not another exchange. The infrastructure layer underneath."

**Anti-tone:** avoid "empower," "seamless," "delight," "revolutionary," "cutting-edge," any word a SaaS landing page uses.

---

## Visual Foundations

**Colors.** Monochrome + ONE accent (`#4ade80`, reserved for LIVE/status only — never on buttons, links, borders, decoration).
- Page: `#0a0a0a`. Occasional alt section: `#0d0d0d`.
- Text ladder: `#fff → .9 → .55 → .5 → .35 → .25` opacity. No mid-grays from a Tailwind palette; opacity on white.
- Borders: `rgba(255,255,255,.1)` default, `.2` inputs, `.5` focus.
- Form states: `#35BE76` success / `#BE3535` error — these are *state colors, not brand accents*.

**Type.** Two families, two roles.
- **Funnel Display 400** — headlines, stat numbers. Geometric sans with subtle character.
- **JetBrains Mono 400/700** — body, UI, labels, code, data. The mono body is the single strongest identity marker. **Do not replace it.**

Strict five-tier scale (enforce across every surface):

| Tier | Role | Size |
|---|---|---|
| Marquee | Hero H1, anchor-section H2 | `clamp(60px,7vw,80px)` |
| Standard | Section H2 | `clamp(32px,4vw,44px)` |
| Minor | Card H3 | 22–26px |
| Body | Paragraphs, UI | 14–15px |
| Label | Eyebrows, counters | 11–13px, 700, uppercase |

Every section opens at Standard; anchor sections (one per page max) use Marquee. Numbers in data contexts: `font-variant-numeric: tabular-nums` is **mandatory**.

**Spacing.** 8px base. Section padding: 80 / 112 (anchor) / 56 (mobile). Inner padding 48 / 24. Max content width 1200px.

**Backgrounds.** Flat black. No gradients. No hero images. No photography. No textures. The one ambient element is the **ASCII wave canvas** — a monospace character field that breathes under the hero (see `src/scripts/wave-animation.ts`). That's the motif. No other illustrations.

**Animation.** Intentional, not decorative.
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for reveals (fast start, gentle land). `cubic-bezier(0.33, 1, 0.68, 1)` for button hovers. `cubic-bezier(0.34, 1.56, 0.64, 1)` for CTA scale-in only.
- Durations: 0.5–0.8s reveals, 0.3s hovers, 0.15s press, 2s live pulse.
- Stagger: 0.15s between siblings.
- **Signature motion:** `.live-dot` — opacity pulse (1 → 0.35 → 1) over 2s, `ease-in-out`, infinite. Only for status indicators.

**Hover states.** Buttons: dark fill slides up from the bottom via a `::before` pseudo-element translateY. Links: color transition to `--text-primary`. Logos: opacity bump `.8 → 1`.

**Press states.** `scale(0.96)` for buttons, `scale(0.94)` for icon-sized targets. No color change on press.

**Borders.** 1px `rgba(255,255,255,.1)` everywhere. 2px solid white on primary buttons. Sharp corners. Always.

**Radii.** `0`. Everywhere. Photos, cards, inputs, buttons, avatars, modals. **Brutalist. No exceptions.**

**Shadow system.** None. The one depth cue is `box-shadow: 0 0 0 3px rgba(255,255,255,.05)` on focused inputs — a *halo*, not a drop shadow. The brand has no drop shadows anywhere else.

**Transparency & blur.** Sparingly. `backdrop-filter: blur(8–12px)` on modal overlays and the pitch-deck top nav. Terminal-block backgrounds use `rgba(10,10,10,.85)` over the canvas wave.

**Imagery.** None. No stock photo, no 3D render, no illustration, no dashboard mockup. The hero counterweight is a **terminal block** — a monospace readout that resembles live product data. If an image is ever needed, it's warm-neutral b&w at most; but prefer type.

**Layout rules.**
- Max width 1200px centered.
- Left-aligned hero and body. **Never** centered. Stat blocks may center.
- Forced section rhythm: no two adjacent sections may share shape. Vary alignment, grid column count, or content type.
- 2-col hero (text left, instrument right) on desktop, stacked on mobile.
- Mobile breakpoint: 768px, single.

**Cards.** `padding: 40px` desktop, `24px` mobile. `1px solid rgba(255,255,255,.1)` border. **No** background fill by default; `rgba(255,255,255,.06)` for terminal/code blocks only. No shadow, no radius.

**Numbered patterns.** Features and pain points use `counter-increment` with `decimal-leading-zero`: `01`, `02`, `03` rendered in label-sized `--text-faint` mono above each block.

---

## Iconography

**This brand uses no icons.** Not Lucide, not Heroicons, not custom SVGs, not emoji. The aesthetic is aggressively type-only.

What it uses instead:

- **ASCII / box-drawing characters** (`├── candles`, `└── cli_record`, `→`, `←`, `·`, `×`) — promoted to a signature. Used as list markers, dividers, and flow arrows. Rendered in `--font-mono` at body or minor size.
- **Monospace glyphs** (`>`, `$`, `#`) — prompt-style markers in terminal blocks.
- **Numbered eyebrows** — `01`, `02`, `03` via CSS counters; these replace icons for feature lists.
- **The live dot** — a 7×7px green square with the `livePulse` animation. The only pictographic element in the system.

If you ever *must* introduce an icon (unlikely — ask first): use Lucide at 1.5px stroke, `currentColor`, 16–20px, never inside a circle, never filled, never decorative.

**Logos** in `assets/`:

- `logo-white.svg` — white wordmark on dark. Default everywhere.
- `logo.svg`, `logo-light.svg` — lighter variants.
- `logo-dark.svg` — dark wordmark for light surfaces (rare — this brand is dark-first).

Logo height: 28px nav, 22px footer, 24px pitch nav. Opacity `.8 → 1` on hover. Never recolor.

**ASCII animation motif.** The hero canvas (`wave-animation.ts`) is the product's signature visual. A 200-column monospace field where each cell is one of `' .,;:!|/\-_~^\``, animated as a gentle horizontal sine band. It's abstract but resembles weather fronts / chart noise / a printer readout. Use this vocabulary (mono characters over flat black, sub-1-opacity, slow drift) whenever a moving background is needed. Never swap in particles, meshes, gradients, or Three.js scenes.

---

## Caveats

- **Fonts missing.** The repo references self-hosted `funnel-display-latin.woff2` and `jetbrains-mono-latin.woff2` in `/public/fonts/`, but those weren't in the imported tree. `colors_and_type.css` falls back to Google Fonts. **Please attach the two `.woff2` files** so we can drop the Google Fonts import.
- **Favicon / OG image** not imported (referenced `/favicon.png`, `/og-image.png`).
- **Pitch slide backgrounds** — the pitch pages are plain black; the UI-kit recreation matches. If there's a branded OG/cover image you use externally, please share it.
