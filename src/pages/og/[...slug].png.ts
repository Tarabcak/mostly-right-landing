import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '../../utils/og';

// Static landing pages. Docs pages are auto-discovered below.
const staticPages = [
  {
    slug: 'home',
    title: 'The AI-native stack for prediction markets.',
    description: 'One API for prediction market data and the real-world data that drives it. Built for AI agents, LLMs, and quants.',
  },
  {
    slug: 'weather',
    title: 'The complete weather SDK for prediction markets.',
    description: 'Observations, forecasts, satellite, and settlement. All the data behind every Kalshi and Polymarket weather contract.',
  },
];

export const getStaticPaths: GetStaticPaths = async () => {
  // Auto-enumerate Starlight docs pages so every MDX gets a Satori OG.
  // entry.id under docsLoader is the slug path (e.g. "docs/introduction",
  // "docs/sdk/installation"). Routes at `/og/{slug}.png` match the rest
  // param and emit PNGs alongside the corresponding doc page.
  const docsEntries = await getCollection('docs');
  const docsPages = docsEntries.map((entry) => ({
    slug: entry.id,
    title: entry.data.title,
    description: entry.data.description ?? '',
  }));

  return [...staticPages, ...docsPages].map((page) => ({
    params: { slug: page.slug },
    props: page,
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title } = props as { slug: string; title: string; description: string };
  const png = await generateOgImage(title);

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
