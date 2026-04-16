if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Skip animation entirely for users who prefer reduced motion
} else {
  const canvas = document.getElementById('waveCanvas') as HTMLCanvasElement | null;
  if (canvas) {
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
    let mouseX = -1000;
    let mouseY = -1000;

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
    window.addEventListener('resize', () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
    });

    document.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    document.addEventListener('mouseleave', () => {
      mouseX = -1000;
      mouseY = -1000;
    });

    function draw(): void {
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, w, h);

      for (let row = 0; row < rows; row++) {
        const py = row * cellH + cellH / 2;

        for (let col = 0; col < COLS; col++) {
          const px = col * cellW + cellW / 2;

          const noise = Math.sin(col * 0.1 + time) * Math.cos(row * 0.1 - time * 0.5);
          const wave = Math.sin(col * 0.05 + row * 0.05 + time);
          let intensity = (noise + wave + 1) / 2;

          const dx = px - mouseX;
          const dy = py - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            intensity += (1 - dist / 150) * 0.5;
          }

          intensity = Math.min(intensity, 1);

          if (intensity < 0.05) continue;

          const charIdx = Math.floor(intensity * (waveChars.length - 1));
          const char = waveChars[Math.min(charIdx, waveChars.length - 1)];
          if (char === ' ') continue;

          const opacity = intensity * 0.8;
          ctx.fillStyle = `rgba(${CHAR_COLOR}, ${opacity.toFixed(2)})`;
          ctx.fillText(char, px, py);
        }
      }

      time += 0.003;

      if (firstFrame) {
        canvas!.classList.add('loaded');
        firstFrame = false;
      }

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }
}
