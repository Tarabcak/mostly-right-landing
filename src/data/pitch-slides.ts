export interface SlideData {
  slug: string;
  title: string;
  description: string;
  prev: string | null;
  next: string | null;
}

export const slides: SlideData[] = [
  { slug: 'intro', title: 'Mostly Right — Prediction markets just exploded', description: 'Anyone with Claude Code can now trade like a hedge fund. From $2B to $23B monthly volume in six months.', prev: null, next: 'traction' },
  { slug: 'traction', title: 'Mostly Right — And we\'re already doing it. Profitably.', description: '75% win rate over 60 days. When the data breaks, we lose money.', prev: 'intro', next: 'origin' },
  { slug: 'origin', title: 'Mostly Right — Getting here wasn\'t easy', description: 'Every dev, quant, and agent hits the same wall. The infrastructure doesn\'t exist yet.', prev: 'traction', next: 'solution' },
  { slug: 'solution', title: 'Mostly Right — The API we wished existed', description: 'We use it to trade every day. Weather first, then sports, economics, and more.', prev: 'origin', next: 'competitive' },
  { slug: 'competitive', title: 'Mostly Right — Is anyone else doing this?', description: 'A few give you prices. But nobody goes deeper. Each vertical needs its own stack.', prev: 'solution', next: 'distribution' },
  { slug: 'distribution', title: 'Mostly Right — How do we get users?', description: 'AI coding tools made strategy building accessible. Free tools are how builders find us.', prev: 'competitive', next: 'business-model' },
  { slug: 'business-model', title: 'Mostly Right — How do we make money?', description: 'The more they trade, the more we earn. Usage-based pricing that grows with the market.', prev: 'distribution', next: 'team' },
  { slug: 'team', title: 'Mostly Right — The founders', description: 'Vu, Rob, and Vojta. Friends and former colleagues, building Mostly Right since early 2026.', prev: 'business-model', next: null },
];

export function getSlideBySlug(slug: string): SlideData | undefined {
  return slides.find(s => s.slug === slug);
}

export function getSlideIndex(slug: string): number {
  return slides.findIndex(s => s.slug === slug);
}
