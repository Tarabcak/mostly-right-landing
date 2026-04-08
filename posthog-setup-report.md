# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Mostly Right landing site. The integration uses the PostHog web snippet (no npm package required) initialized via a reusable `src/components/posthog.astro` component that is injected into `<head>` on every page through `BaseLayout.astro`. Environment variables (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`) are loaded from `.env` so no credentials are hardcoded. Ten custom events are tracked across the waitlist conversion funnel, pitch deck investor flow, and site engagement signals. Users are identified in PostHog on successful waitlist signup using their email address.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `waitlist_signup_submitted` | User submitted the waitlist form with a valid email | `src/scripts/waitlist.ts` |
| `waitlist_signup_succeeded` | User was successfully added to the waitlist | `src/scripts/waitlist.ts` |
| `waitlist_signup_failed` | Signup failed due to server or network error (includes `reason` property) | `src/scripts/waitlist.ts` |
| `waitlist_signup_already_registered` | Email was already on the waitlist | `src/scripts/waitlist.ts` |
| `hero_cta_clicked` | User clicked the primary "Get Early Access" button in the hero section | `src/components/HeroSection.astro` |
| `mission_modal_opened` | User opened the "Our Mission" modal | `src/scripts/modal.ts` |
| `pitch_deck_viewed` | User landed on the pitch deck intro page (top of investor funnel) | `src/pages/pitch/intro.astro` |
| `pitch_slide_navigated` | User navigated between pitch deck slides (includes `direction`, `from_slide`, `to_slide`, `slide_index`) | `src/scripts/pitch-nav.ts` |
| `pitch_deck_completed` | User reached the final team slide of the pitch deck | `src/pages/pitch/team.astro` |
| `cta_clicked` | User clicked a nav or section CTA (reserved for future nav instrumentation) | `src/components/Nav.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/374082/dashboard/1444179)
- **Waitlist Signup Conversion Funnel** — hero CTA → submitted → succeeded: [View insight](https://us.posthog.com/project/374082/insights/WMC4dGxF)
- **Waitlist Signups Over Time** — daily new signups trend: [View insight](https://us.posthog.com/project/374082/insights/QuDgwDI8)
- **Pitch Deck Completion Funnel** — viewed → completed: [View insight](https://us.posthog.com/project/374082/insights/2PgO94PF)
- **Mission Modal Opens vs Signups** — engagement vs conversion correlation: [View insight](https://us.posthog.com/project/374082/insights/JEm33ccG)
- **Signup Failure Reasons** — breakdown by error type: [View insight](https://us.posthog.com/project/374082/insights/YeqeMZTf)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
