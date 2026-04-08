// ASCII wave interference pattern for pitch deck intro
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const canvas = document.getElementById('pitchWaveCanvas') as HTMLCanvasElement;
  if (canvas) {
    const ctx = canvas.getContext('2d')!;
    const BG_COLOR = '#0A0A0A';
    const CHAR_COLOR = '232, 230, 224';
    const waveChars = ' .,;:!|/\\-_~^`';
    const COLS = 100;

    let cellW: number, cellH: number, rows: number, w: number, h: number;
    let time = 0;
    let mouseX = -1000;
    let mouseY = -1000;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.parentElement?.offsetWidth || window.innerWidth;
      h = canvas.parentElement?.offsetHeight || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      cellW = w / COLS;
      cellH = cellW * 1.6;
      rows = Math.ceil(h / cellH);
      const fontSize = Math.max(8, cellH * 0.6);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
    }

    resize();
    window.addEventListener('resize', () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouseX = -1000;
      mouseY = -1000;
    });

    function draw() {
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, w, h);

      for (let row = 0; row < rows; row++) {
        const py = row * cellH + cellH / 2;

        for (let col = 0; col < COLS; col++) {
          const px = col * cellW + cellW / 2;

          // Two-wave interference
          const noise = Math.sin(col * 0.1 + time) * Math.cos(row * 0.15 - time * 0.5);
          const wave = Math.sin(col * 0.05 + row * 0.05 + time);
          const val = (noise + wave + 2) / 4; // normalize to 0-1

          // Mouse influence
          const dx = px - mouseX;
          const dy = py - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseRadius = 300;
          const mouseInf = dist < mouseRadius ? (1 - dist / mouseRadius) : 0;

          // Base opacity + mouse boost
          const baseOpacity = val * 0.4;
          const opacity = Math.min(baseOpacity + mouseInf * 0.6, 1);

          if (opacity < 0.03) continue;

          // Character from density
          const charIdx = Math.floor(val * (waveChars.length - 1));
          const char = waveChars[Math.min(charIdx, waveChars.length - 1)];
          if (char === ' ') continue;

          // Subtle offset near mouse
          const offsetX = mouseInf > 0 ? (dx / dist) * mouseInf * 2 : 0;

          ctx.fillStyle = `rgba(${CHAR_COLOR}, ${opacity.toFixed(2)})`;
          ctx.fillText(char, px + offsetX, py);
        }
      }

      time += 0.02;
      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);

    // Fade in
    requestAnimationFrame(() => canvas.classList.add('loaded'));
  }
}
