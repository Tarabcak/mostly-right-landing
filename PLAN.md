# Mostly Right Landing — Execution Plan

**Date:** 2026-04-05
**Status:** Ready for implementation
**Scope:** Homepage restructure + weather subpage introduction

---

## Current State

Single `index.html` (~26KB), vanilla HTML/CSS/JS, no build system, no router. One page: hero, 4 feature cards, email CTA, mission modal. Supabase waitlist backend. Static site deployment.

## Critique of Current Homepage

1. **No launch wedge.** Says "AI-native stack for prediction markets" but gives no indication what's live now. Reads like a coming-soon page.
2. **No vertical entry point.** Weather isn't mentioned anywhere. No path from homepage to product detail.
3. **Feature cards are abstract.** "Unified market data" and "Real-world source data" are accurate but generic — could describe any fintech data company.
4. **Navigation is thin.** Only two links: "Our Mission" modal and "Get Early Access." No Docs, no Dashboard, no Weather.
5. **CTA is one-dimensional.** Every button leads to the same waitlist form. No differentiation between "learn more" and "sign up."

---

## Phase 1 — Structural Setup

**Goal:** Introduce multi-page structure without breaking existing deployment.

| # | Change | File(s) | Notes |
|---|--------|---------|-------|
| 1.1 | Extract shared CSS into `style.css` | New: `style.css`, Edit: `index.html` | Extract `<style>` block. Both pages share the design system. |
| 1.2 | Duplicate nav/footer in both pages | — | No framework = no partials. Accept duplication for 2 pages. |
| 1.3 | Create `weather/index.html` | New: `weather/index.html` | Static routing: `/weather/` resolves to this. Works on GitHub Pages, Vercel, Netlify. |
| 1.4 | Add `404.html` | New: `404.html` | Catch bad routes, redirect to `/`. |

**Resulting structure:**
```
/
├── index.html          # Homepage
├── style.css           # Shared styles
├── app.js              # Shared JS (wave + supabase)
├── weather/
│   └── index.html      # Weather subpage
├── 404.html
├── favicon.png
└── logo-*.svg
```

---

## Phase 2 — Homepage Restructure

**Goal:** Rewrite homepage sections to match the brief's narrative arc.

### 2.1 Navigation Update

**Current:** `Logo | Our Mission | Get Early Access`

**New:**
```
Logo | Weather | Docs↗ | Dashboard↗ | Get Early Access
```

- "Weather" links to `/weather/`
- "Docs" links to `https://docs.mostlyright.xyz` (external, new tab)
- "Dashboard" links to TBD URL (external, new tab) — **DECISION NEEDED**
- "Get Early Access" links to `#early-access` (same behavior)
- "Our Mission" moves to footer only

**Mobile:** Show "Weather" + "Our Mission" as text links, hide filled button. No hamburger needed for 2 text links.

### 2.2 Hero Section

Keep the headline. Tighten the subline. Add dual CTA.

```
H1: The AI-native stack for prediction markets.
Sub: Market data, resolution data, and infrastructure —
     built for AI agents, researchers, and strategists.
CTA: [GET EARLY ACCESS]  [SEE WEATHER →]
```

Two CTAs: primary (waitlist) + secondary ghost button linking to `/weather/`.

### 2.3 Platform Value Section (replace current feature cards)

Restructure from 4 generic cards to 3 focused pillars:

```
01. Unified market data
Every contract from Kalshi and Polymarket in one schema. Historical
prices, settlements, order book data, resolution criteria. Normalized
so you query once, not twice.

02. Real-world resolution data
The source data markets actually settle against. Weather stations,
economic releases, verified outcomes — cleaned and aligned to contract
settlement logic, not just raw feeds.

03. Research-grade infrastructure
Backtest strategies against historical data with realistic conditions.
Deploy live with exchange connectivity. Settlement-aware pipelines that
know when a contract resolves and what data proves it.
```

Keep the numbered card layout. Drop card 04 ("Backtesting & live deployment") and fold into pillar 03.

### 2.4 NEW: "Launching with Weather" Section

Insert between platform pillars and CTA section.

```
Label: LAUNCHING WITH
Heading: Starting with weather.
Body: Weather prediction markets are one of the hardest verticals to get right.
      Messy source data, strict settlement windows, and real money on the line.
      We built Mostly Right's first vertical here because if the stack works
      for weather, it works for everything.
CTA: [EXPLORE WEATHER →]  (ghost button, links to /weather/)
```

Position: between two `.divider` elements. Full-width section with `--bg-section` (#0d0d0d) background.

### 2.5 CTA Section Update

Keep the email form. Add secondary CTAs below:

```
[Email input] [Get Early Access]
No spam. Early users get free API access.

────────────────────────────────────
Read the docs →  |  Open the dashboard →  |  Explore weather →
```

Three text links below the form for people not ready to sign up.

### 2.6 Footer Update

```
Logo
Weather · Docs · Dashboard · Early Access
Our Mission (opens modal, same as current)
© 2026 Mostly Right
```

---

## Phase 3 — Weather Subpage (`/weather/`)

**Goal:** Dedicated product page for the weather vertical.

### Page Structure

| Section | Content |
|---------|---------|
| **Nav** | Identical to homepage (shared markup) |
| **Hero** | H1: "The most comprehensive weather SDK for prediction markets." Sub: "30 fields per observation. 20 stations. Three sources, deduplicated and settlement-verified. pip install mostlyright." CTAs: `[GET EARLY ACCESS]` + `[READ THE DOCS →]` |
| **Why weather is hard** | 4 pain point cards (single-column layout, max-width 640px, left-aligned). Numbered, same typography as homepage feature cards. See full copy below. |
| **What we deliver** | Two-column contrast layout. Left: the problem (dimmed text). Right: what Mostly Right does (brighter text). See full copy below. |
| **CTA** | Same email form as homepage. Below: `READ THE DOCS →` `OPEN DASHBOARD →` `BACK TO HOMEPAGE →` |
| **Footer** | Identical to homepage |

**Hero height:** `60vh` instead of `100vh`. This is a product page, not a landing. Get to the content faster.

**No canvas wave animation** on weather subpage. Cleaner, faster load, differentiates from homepage.

### "Why weather data is hard" — full copy

```
01. Settlement sources disagree
Kalshi settles on NWS CLI via NOWData. Robinhood settles on
Weather Underground. ForecastEx won't say. Same city, same day,
different official temperature. No one has built the unified
settlement data layer yet.

02. Raw data is free but unusable
Three government sources (AWC, IEM, GHCNh), each with different
precision, different gaps, different formats. Quants scrape,
parse METAR text, handle missing values, and manage dedup
across sources. Every team rebuilds this from scratch.

03. Historical and live data don't match
IEM gives you whole-degree Fahrenheit from a Kelvin roundtrip.
AWC gives you tenths precision from T-group parsing. Train your
model on one, run it on the other, and your backtest results
are fiction. Column parity matters.

04. Corrections distort backtests
A station revises its 3 PM reading at 6 PM. If your historical
data includes the correction, your backtest sees data that didn't
exist at decision time. We store raw-as-reported. First observation
wins. Your backtest matches reality.
```

### "What you get" — full copy (contrast layout)

```
THE PROBLEM                         MOSTLY RIGHT
──────────                          ────────────

Three sources, three formats,       One row per observation. Source-
three precision levels.             priority dedup. 30 identical fields
                                    whether live or historical.

METAR text needs manual parsing     Parsed, validated, QC'd. T-group
for usable temperature data.        tenths precision preserved. Float64
                                    through the entire pipeline.

Corrections silently replace        Raw-as-reported storage. First
original observations.              observation wins. Backtest against
                                    what actually existed.

No way to verify a settlement       CLI reports with report-type
matched the observed data.          priority. Settlement confidence
                                    scoring per market.
```

---

## Phase 4 — Polish & Ship

| # | Task |
|---|------|
| 4.1 | Mobile QA: test nav, section stacking, form on small screens |
| 4.2 | Update meta tags: `<title>`, `<meta description>`, OG tags for both pages |
| 4.3 | Add `<link rel="canonical">` to both pages |
| 4.4 | Verify Supabase waitlist form works on `/weather/` (same JS, same table) |
| 4.5 | Lighthouse check: performance, accessibility |
| 4.6 | Cross-browser spot check (Safari, Firefox, Chrome) |

---

## Rollout Order

```
1. Phase 1   — structural setup (shared CSS, weather dir, 404)
2. Phase 2.1 — nav update (both pages get the new nav)
3. Phase 3   — weather subpage (net-new, no regression risk)
4. Phase 2.2–2.6 — homepage content restructure
5. Phase 4   — polish, QA, meta tags
```

Ship weather subpage first — it's additive. Homepage copy changes are more subjective and may need iteration.

---

## Design System — Existing Rules (DO NOT BREAK)

The current site has a strong, coherent identity: industrial, monochrome, sharp. Every new element must feel like it was always part of this site.

### Existing Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a0a0a` | Page background |
| `--bg-section` | `#0d0d0d` | Alternate section bg |
| `--text-primary` | `#fff` | Headlines |
| `--text-heading` | `rgba(255,255,255,.9)` | Section titles |
| `--text-body` | `rgba(255,255,255,.55)` | Body text |
| `--text-muted` | `rgba(255,255,255,.5)` | Feature card descriptions |
| `--text-subtle` | `rgba(255,255,255,.35)` | Nav links, footer, notes |
| `--text-faint` | `rgba(255,255,255,.25)` | Feature card numbers |
| `--border-default` | `rgba(255,255,255,.1)` | Dividers |
| `--border-input` | `rgba(255,255,255,.2)` | Form inputs |
| `--border-focus` | `rgba(255,255,255,.5)` | Focus rings |
| `--surface-white` | `#fff` | Buttons |
| `--surface-dark` | `#0a0a0a` | Button hover fill |
| Success | `#35BE76` | Form success |
| Error | `#BE3535` | Form error |

### Typography

- **Display:** Funnel Display, weight 400, `clamp(48px, 7vw, 88px)` for H1. `letter-spacing: -0.02em`. `line-height: 1.05`.
- **Body/UI:** JetBrains Mono, weight 400 (body), 700 (buttons/labels). 12-15px range.
- **Interactive text:** Always uppercase + `letter-spacing: 0.06em`.
- The monospace body text is the single strongest identity marker. Do not replace it.

### Spacing (base unit: 8px)

- Nav padding: `32px 48px`
- Hero bottom padding: `100px`
- Feature section: `140px 0`
- Feature grid gap: `56px` vertical, `80px` horizontal
- CTA section: `80px 48px 120px`
- Footer: `32px 48px`
- Mobile padding: `24px` horizontal (consistent everywhere)

### Interaction Patterns

- **Buttons:** white fill, dark text. Hover = dark fill slides up via `::before`. Easing: `cubic-bezier(0.33, 1, 0.68, 1)`.
- **Load animations:** `cubic-bezier(0.16, 1, 0.3, 1)` — fast spring-style ease. Staggered from 0.1s to 0.8s.
- **Active state:** `scale(0.96)` or `scale(0.94)`.
- **Focus:** `2px solid var(--border-focus)`, `outline-offset: 4px`.
- **Border radius:** 0 everywhere. Sharp corners are part of the identity.
- **No color accents.** Monochrome only.

### Layout

- Max width: `1200px`, centered with `margin: 0 auto`.
- Feature grid: `grid-template-columns: repeat(2, 1fr)` desktop, `1fr` mobile.
- Mobile breakpoint: `768px` only.
- Hero alignment: `flex-end` — content pushed to bottom of viewport.

### DO

1. Use existing CSS custom properties for all new elements. No inline hex values.
2. Keep border-radius at 0. No rounded corners.
3. JetBrains Mono for all body/UI. Funnel Display only for section headings.
4. Uppercase + `letter-spacing: 0.06em` for all interactive text.
5. Same button pattern: white fill, `::before` slide-up hover. Copy `.cta-btn` CSS.
6. Same animation easing values. No new curves.
7. Stagger below-fold animations via IntersectionObserver (not on page load).
8. `48px` horizontal padding desktop, `24px` mobile. Keep consistent.

### DON'T

- Add color accents, gradients, or non-monochrome elements.
- Add icons or illustrations. This site is type-only.
- Add border-radius to any element.
- Use a different font on any page.
- Add shadows, glows, or depth effects.
- Change the button hover mechanic.

---

## New CSS Additions (exact specs)

### Ghost Button (secondary CTA)

```css
.cta-btn.ghost {
  background: transparent;
  color: var(--surface-white);
  border: 1px solid rgba(255,255,255,.3);
}
.cta-btn.ghost::before {
  background: var(--surface-white);
}
.cta-btn.ghost:hover {
  color: var(--surface-dark);
}
```

### Hero Dual-CTA Container

```css
.hero-ctas {
  display: flex;
  gap: 16px;
  align-items: center;
}
/* Mobile: stack vertically, both full-width */
@media (max-width: 768px) {
  .hero-ctas {
    flex-direction: column;
  }
  .hero-ctas .cta-btn { width: 100%; text-align: center; }
}
```

### CTA Secondary Links

```css
.cta-links {
  display: flex;
  gap: 32px;
  justify-content: center;
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid var(--border-default);
}
.cta-links a {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-subtle);
  text-decoration: none;
  letter-spacing: .06em;
  transition: color 0.3s ease;
}
.cta-links a:hover { color: var(--text-primary); }
/* Mobile: stack vertically */
@media (max-width: 768px) {
  .cta-links { flex-direction: column; gap: 16px; }
}
```

### External Link Arrow (nav)

```css
.nav-text-link .ext-arrow {
  font-size: 10px;
  opacity: 0.5;
  margin-left: 2px;
}
```

### "Launching with Weather" Section

```css
.weather-launch {
  background: var(--bg-section);
  padding: 100px 0;
}
.weather-launch-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
}
.weather-launch-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--text-faint);
  text-transform: uppercase;
  letter-spacing: .12em;
  margin-bottom: 16px;
}
.weather-launch h2 {
  font-family: 'Funnel Display', sans-serif;
  font-weight: 400;
  font-size: clamp(28px, 4vw, 42px);
  color: var(--text-heading);
  margin-bottom: 24px;
  line-height: 1.15;
}
.weather-launch p {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  line-height: 1.85;
  color: var(--text-muted);
  max-width: 640px;
  margin-bottom: 36px;
}
/* Animation: triggered by IntersectionObserver */
.weather-launch .weather-launch-label,
.weather-launch h2,
.weather-launch p,
.weather-launch .cta-btn {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.weather-launch .revealed {
  opacity: 1;
  transform: translateY(0);
}
@media (max-width: 768px) {
  .weather-launch { padding: 60px 0; }
  .weather-launch-inner { padding: 0 24px; }
  .weather-launch p { font-size: 13px; }
}
```

### Weather Subpage — Contrast Columns

```css
.contrast-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px 80px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
}
.contrast-col-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .12em;
  margin-bottom: 32px;
}
.contrast-col-label.problem { color: var(--text-faint); }
.contrast-col-label.solution { color: var(--text-subtle); }
.contrast-item {
  margin-bottom: 32px;
}
.contrast-item.problem p {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  line-height: 1.85;
  color: var(--text-subtle);
}
.contrast-item.solution p {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  line-height: 1.85;
  color: var(--text-body);
}
@media (max-width: 768px) {
  .contrast-grid { grid-template-columns: 1fr; gap: 36px; padding: 0 24px; }
}
```

---

## Risks & Open Questions

| # | Item | Impact | Mitigation |
|---|------|--------|------------|
| 1 | **Dashboard URL unknown.** Nav and CTAs reference it. | Broken links or placeholder | Get URL before Phase 2.1. If not ready, link to docs and add dashboard later. |
| 2 | **Nav duplication across 2 HTML files.** | Drift between pages | Acceptable at 2 pages. If page 3 arrives, introduce a static site generator. |
| 3 | **Weather copy references real data sources.** Pain points name AWC, IEM, GHCNh, METAR, NWS CLI. | Builds credibility with quants who know these sources | Keep — this is public government data, not proprietary. The specificity IS the differentiation. |
| 4 | **No build step = no cache busting.** Extracting `style.css` adds caching risk. | Stale styles after redeploy | Version query param: `style.css?v=2`. Manual but sufficient. |
| 5 | **Mission modal fate.** Brief doesn't mention it. | Could feel disconnected | Keep for now, revisit after homepage copy is finalized. |
| 6 | **Scope creep into framework.** Tempting to add Astro/11ty for partials. | Delays shipping | Resist. Ship vanilla. Revisit when page 3 arrives. |

---

## Decisions Needed

1. **Dashboard URL** — what should the dashboard nav link point to?
2. **SDK positioning tone** — the weather subpage now leads with "most comprehensive weather SDK." Confirm this matches how you want to position it externally. The specificity (30 fields, 3 sources, settlement verification) backs the claim.
3. **Mission modal** — keep as-is, update to match new messaging, or remove?
