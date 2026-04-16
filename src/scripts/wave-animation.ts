let animId: number | null = null;
let resizeHandler: (() => void) | null = null;

function init(): void {
  // Clean up previous animation loop
  if (animId !== null) cancelAnimationFrame(animId);
  if (resizeHandler) window.removeEventListener('resize', resizeHandler);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('waveCanvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext('2d')!;
  const BG_COLOR = '#0A0A0A';
  const CHAR_COLOR = '232, 230, 224';
  const waveChars = ' .,;:!|/\\-_~^`';

  function getCols(): number {
    return window.innerWidth < 768 ? 80 : 200;
  }

  let COLS = getCols();
  let cellW: number;
  let cellH: number;
  let rows: number;
  let w: number;
  let h: number;
  let time = 0;
  let firstFrame = true;

  function resize(): void {
    const dpr = window.devicePixelRatio || 1;
    w = canvas!.parentElement?.offsetWidth || window.innerWidth;
    h = canvas!.parentElement?.offsetHeight || window.innerHeight;
    canvas!.width = w * dpr;
    canvas!.height = h * dpr;
    ctx.scale(dpr, dpr);
    COLS = getCols();
    cellW = w / COLS;
    cellH = cellW * 1.6;
    rows = Math.ceil(h / cellH);
    const fontSize = Math.max(8, cellH * 0.6);
    ctx.font = `${fontSize}px "JetBrains Mono", "Fragment Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }

  resize();
  resizeHandler = () => { ctx.setTransform(1, 0, 0, 1, 0, 0); resize(); };
  window.addEventListener('resize', resizeHandler);

  function draw(): void {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, w, h);

    for (let row = 0; row < rows; row++) {
      const band = Math.floor(row / 4);
      const py = row * cellH + cellH / 2;

      for (let col = 0; col < COLS; col++) {
        const px = col * cellW + cellW / 2;
        const nx = col / COLS;
        const amp =
          0.15 * Math.sin(nx * 5 + time + band) +
          0.1 * Math.cos(nx * 10 - time * 0.5);
        const dist = row / rows - (0.5 + amp);
        const density = Math.exp(-(dist * dist) / 0.02);

        if (density < 0.05) continue;

        const charIdx = Math.floor(density * (waveChars.length - 1));
        const char = waveChars[Math.min(charIdx, waveChars.length - 1)];
        if (char === ' ') continue;

        const opacity = density * 0.8;
        ctx.fillStyle = `rgba(${CHAR_COLOR}, ${opacity.toFixed(2)})`;
        ctx.fillText(char, px, py);
      }
    }

    time += 0.008;

    if (firstFrame) {
      canvas!.classList.add('loaded');
      firstFrame = false;
    }

    animId = requestAnimationFrame(draw);
  }

  animId = requestAnimationFrame(draw);
}

document.addEventListener('astro:page-load', init);
