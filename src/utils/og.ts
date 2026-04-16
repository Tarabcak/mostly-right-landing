import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const OG_WIDTH = 1200;
const OG_HEIGHT = 633;

// Read background image as base64 (use og-bg.png — clean bg without text)
let bgBase64: string | null = null;
const bgPath = join(process.cwd(), 'src', 'assets', 'og-bg.png');
if (existsSync(bgPath)) {
  bgBase64 = `data:image/png;base64,${readFileSync(bgPath).toString('base64')}`;
}

// Read logo SVG as base64
const logoPath = join(process.cwd(), 'public', 'logo-white.svg');
const logoBase64 = `data:image/svg+xml;base64,${readFileSync(logoPath).toString('base64')}`;

// Load fonts from local TTF files (satori requires TTF/OTF, not woff2)
const funnelDisplayFont = readFileSync(join(process.cwd(), 'src', 'assets', 'funnel-display.ttf'));
const jetbrainsMonoFont = readFileSync(join(process.cwd(), 'src', 'assets', 'jetbrains-mono.ttf'));

export async function generateOgImage(title: string): Promise<Buffer> {

  const children: unknown[] = [];

  // Background
  if (bgBase64) {
    children.push({
      type: 'img',
      props: {
        src: bgBase64,
        width: OG_WIDTH,
        height: OG_HEIGHT,
        style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
      },
    });
  }

  // Content overlay
  children.push({
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      },
      children: [
        // Top: logo
        {
          type: 'div',
          props: {
            style: { display: 'flex' },
            children: [
              {
                type: 'img',
                props: {
                  src: logoBase64,
                  height: 36,
                  style: { opacity: 0.9 },
                },
              },
            ],
          },
        },
        // Bottom: title + description
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            },
            children: [
              {
                type: 'h1',
                props: {
                  style: {
                    fontFamily: 'Funnel Display',
                    fontSize: '52px',
                    fontWeight: 400,
                    color: '#ffffff',
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                    margin: 0,
                    maxWidth: '700px',
                  },
                  children: title,
                },
              },
            ],
          },
        },
      ],
    },
  });

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#0a0a0a',
        },
        children,
      },
    },
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: [
        {
          name: 'Funnel Display',
          data: funnelDisplayFont,
          weight: 400 as const,
          style: 'normal' as const,
        },
        {
          name: 'JetBrains Mono',
          data: jetbrainsMonoFont,
          weight: 400 as const,
          style: 'normal' as const,
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: OG_WIDTH },
  });

  return Buffer.from(resvg.render().asPng());
}
