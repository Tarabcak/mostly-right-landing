# Design System -- Mostly Right

## Product Context
- **What this is:** Landing site and pitch deck for Mostly Right, a data API for AI agents and quants to trade prediction markets.
- **Who it's for:** Seed investors, YC partners, quants, AI agent builders.
- **Space/industry:** Prediction markets, fintech infrastructure, developer tools.
- **Project type:** Marketing site + presentation deck (vanilla HTML/CSS/JS, no frameworks).

## Aesthetic Direction
- **Direction:** Brutally Minimal
- **Decoration level:** Minimal -- typography and whitespace do all the work.
- **Mood:** Confident, precise, research-grade. Should feel like a Bloomberg terminal stripped to its essence. No decoration, no gradients, no color accents. The type and the data speak.

## Typography
- **Display/Hero:** Funnel Display, weight 400 -- geometric sans with personality, not generic. Carries headlines and stat numbers.
- **Body/UI/Labels/Code:** JetBrains Mono, weights 400 and 700 -- monospace everywhere. Reinforces the "built for developers" positioning. Data-native feel.
- **Loading:** Google Fonts CDN (`fonts.googleapis.com`).

### Type Scale -- Homepage
| Role | Font | Size | Weight | Line-height | Tracking |
|------|------|------|--------|-------------|----------|
| Hero heading | Funnel Display | clamp(48px, 7vw, 88px) | 400 | 1.05 | -0.02em |
| Feature heading | Funnel Display | 24px | 400 | -- | -- |
| CTA tagline | Funnel Display | clamp(24px, 3vw, 34px) | 400 | 1.25 | -- |
| Body | JetBrains Mono | 15px | 400 | 1.75 | -- |
| Body small | JetBrains Mono | 14px | 400 | 1.85 | -- |
| Nav link | JetBrains Mono | 12-13px | 700 | -- | .06em |
| Feature counter | JetBrains Mono | 12px | 400 | -- | .06em |
| Footer | JetBrains Mono | 11-12px | 700 | -- | .06em |

### Type Scale -- Pitch Deck
| Role | Font | Size | Weight | Line-height | Tracking |
|------|------|------|--------|-------------|----------|
| Slide headline | Funnel Display | clamp(40px, 5.5vw, 52px) | 400 | 1.15 | -0.02em |
| Hero stat (traction) | Funnel Display | clamp(64px, 10vw, 100px) | 400 | 1.0 | -0.03em |
| Block stat number | Funnel Display | clamp(36px, 5vw, 48px) | 400 | 1.0 | -0.03em |
| Stat unit | JetBrains Mono | 15px | 700 | -- | .06em |
| Body | JetBrains Mono | 16px | 400 | 1.75 | -- |
| Body small | JetBrains Mono | 13px | 400 | 1.75 | -- |
| Label | JetBrains Mono | 11px | 700 | -- | .12em |
| Code | JetBrains Mono | 13px | 400 | 1.7 | -- |
| Card label | JetBrains Mono | 12px | 700 | -- | .08em |
| Equation | Funnel Display | clamp(18px, 2.5vw, 28px) | 400 | 1.4 | -- |
| Nav button | JetBrains Mono | 12px | 700 | -- | .06em |

## Color
- **Approach:** Restrained -- monochrome only. No accent color.
- **Background:** #0a0a0a
- **Text primary:** #fff
- **Text heading:** rgba(255,255,255,.9)
- **Text body:** rgba(255,255,255,.55)
- **Text muted:** rgba(255,255,255,.5)
- **Text subtle:** rgba(255,255,255,.35)
- **Text faint:** rgba(255,255,255,.25)
- **Border:** rgba(255,255,255,.1)
- **Surface white:** #fff (CTAs, buttons)
- **Surface dark:** #0a0a0a (button hover fill)
- **Success:** #35BE76 (form success state only)
- **Error:** #BE3535 (form error state only)

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable

### Homepage
- Nav padding: 32px 48px (desktop), 16px 24px (mobile)
- Hero padding: 0 48px 100px (desktop), 0 24px 40px (mobile)
- Section padding: 140px 0 (features), 80px 48px (CTA)
- Max content width: 1200px

### Pitch Deck
- Slide padding: 80px 64px (desktop), 60px 24px (mobile)
- Headline to content gap: 56px
- Split gap: 64px
- Cards gap: 40px
- Card internal padding: 40px 36px
- Code block padding: 32px 28px
- Max content width: 1200px

## Layout
- **Approach:** Grid-disciplined
- **Max content width:** 1200px
- **Border radius:** 0px everywhere (brutalist, no rounding)
- **Homepage:** Bottom-anchored hero, 2-column feature grid, centered CTA section
- **Pitch deck:** Full-viewport slides, vertically centered content, fixed bottom nav bar

## Motion
- **Approach:** Intentional -- entrance animations that aid comprehension, no gratuitous movement.
- **Primary easing:** cubic-bezier(0.16, 1, 0.3, 1) -- fast start, gentle land
- **Button easing:** cubic-bezier(0.33, 1, 0.68, 1)
- **Bounce easing:** cubic-bezier(0.34, 1.56, 0.64, 1) -- CTA button scale-in
- **Durations:** 0.5s-0.8s for reveals, 0.3s for hovers/transitions, 0.15s for press feedback
- **Stagger pattern:** 0.15s delay between sibling elements (cards, split blocks)
- **Reduced motion:** All animations collapse to 0.01ms

## Interaction Patterns
- **Button hover:** Background fill slides up from bottom (translateY reveal)
- **Button press:** scale(0.96) feedback
- **Focus visible:** 2px solid rgba(255,255,255,.5), 4px offset
- **Links:** Color transition on hover, scale on press
- **Pitch deck navigation:** Arrow keys (left/right) + fixed bottom bar with prev/next

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-07 | Initial design system created | Extracted from existing homepage, extended for pitch deck via /design-consultation |
| 2026-04-07 | Hero stat capped at 100px | 140px was too dominant, 100px reads well without overwhelming |
| 2026-04-07 | Block stat numbers capped at 48px | 72px felt like a billboard, 48px feels like data |
| 2026-04-07 | Pitch deck horizontal padding 64px | 48px felt cramped in single-viewport slides |
| 2026-04-07 | No accent color | Monochrome reinforces the research-grade positioning |
