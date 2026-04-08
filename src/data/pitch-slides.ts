export interface SlideData {
  slug: string;
  title: string;
  description: string;
  prev: string | null;
  next: string | null;
}

export const slides: SlideData[] = [
  { slug: 'intro', title: 'Mostly Right — Prediction markets just exploded', description: 'From $300M to $22B in a year. AI agents are the next wave of traders.', prev: null, next: 'traction' },
  { slug: 'traction', title: 'Mostly Right — We already trade with it', description: '75% win rate over 60 days. When the data breaks, we lose money.', prev: 'intro', next: 'origin' },
  { slug: 'origin', title: 'Mostly Right — Two weeks to test one idea', description: 'The data infrastructure for prediction markets does not exist.', prev: 'traction', next: 'solution' },
  { slug: 'solution', title: 'Mostly Right — The API we wished existed', description: 'We use it to trade every day. Weather first, then sports, economics, and more.', prev: 'origin', next: 'competitive' },
  { slug: 'competitive', title: 'Mostly Right — We go deep where the edge is', description: 'Everyone scrapes prices. We bring in the data that tells you when prices are wrong.', prev: 'solution', next: 'distribution' },
  { slug: 'distribution', title: 'Mostly Right — Free tools pull developers in', description: 'AI coding tools made strategy building accessible. Free tools are how builders find us.', prev: 'competitive', next: 'business-model' },
  { slug: 'business-model', title: 'Mostly Right — The more they trade the more we earn', description: 'Users pay for what they consume. As we add verticals, usage grows with the data.', prev: 'distribution', next: 'team' },
  { slug: 'team', title: 'Mostly Right — Built by three founders', description: 'Vu, Rob, and Vojta. Friends and former colleagues, building Mostly Right since early 2026.', prev: 'business-model', next: null },
];

export function getSlideBySlug(slug: string): SlideData | undefined {
  return slides.find(s => s.slug === slug);
}

export function getSlideIndex(slug: string): number {
  return slides.findIndex(s => s.slug === slug);
}
