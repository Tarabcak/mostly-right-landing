import type { APIRoute, GetStaticPaths } from 'astro';
import { generateOgImage } from '../../utils/og';

const pages = [
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

export const getStaticPaths: GetStaticPaths = () => {
  return pages.map((page) => ({
    params: { slug: page.slug },
    props: page,
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, description } = props as (typeof pages)[number];
  const png = await generateOgImage(title, description);

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
