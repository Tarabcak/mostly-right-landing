/** Reusable ASCII animation primitives. Each export is a canvas-based
 * renderer: `mount(canvas, opts?)` → `{ stop }`. Drop-in replacements for
 * each other — all full-bleed, pure monospace, brand-tuned to the Mostly
 * Right palette (dark bg, dim white ink, accent-live green optional).
 *
 * Usage:
 *   const { stop } = AsciiAnims.wave(document.querySelector('canvas'));
 *   // later: stop();
 */
(function () {
  const AsciiAnims = {};

  // ── shared runloop helper ────────────────────────────────────────────────
  function frame(canvas, draw) {
    const ctx = canvas.getContext('2d');
    let raf = 0, stopped = false, t0 = performance.now();
    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);
    function tick() {
      if (stopped) return;
      draw(ctx, (performance.now() - t0) / 1000, canvas.clientWidth, canvas.clientHeight);
      raf = requestAnimationFrame(tick);
    }
    tick();
    return {
      stop() { stopped = true; cancelAnimationFrame(raf); window.removeEventListener('resize', resize); }
    };
  }

  // ── 1. WAVE ──────────────────────────────────────────────────────────────
  // Smooth horizontal sine-field. The signature background from the site.
  AsciiAnims.wave = (canvas, opts = {}) => {
    const charset = opts.charset || ' ·.:+-=*#';
    const fontSize = opts.fontSize || 14;
    return frame(canvas, (ctx, t, w, h) => {
      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      ctx.textBaseline = 'top';
      const cw = fontSize * 0.62, ch = fontSize * 1.1;
      const cols = Math.ceil(w / cw), rows = Math.ceil(h / ch);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const n = Math.sin(x * 0.12 + t * 0.9) + Math.sin(y * 0.2 - t * 0.5) + Math.sin((x + y) * 0.07 + t);
          const idx = Math.floor(((n + 3) / 6) * (charset.length - 1));
          const c = charset[Math.max(0, Math.min(charset.length - 1, idx))];
          if (c === ' ') continue;
          const dim = (n + 3) / 6;
          ctx.fillStyle = `rgba(255,255,255,${0.08 + dim * 0.35})`;
          ctx.fillText(c, x * cw, y * ch);
        }
      }
    });
  };

  // ── 2. RAIN ──────────────────────────────────────────────────────────────
  // Matrix-style vertical cascade. Columns drop at independent speeds, head
  // is brightest, tail fades.
  AsciiAnims.rain = (canvas, opts = {}) => {
    const charset = opts.charset || '01';
    const fontSize = opts.fontSize || 14;
    const accent = opts.accent || null; // e.g. '#4ade80' for a few green columns
    let cols = null;
    return frame(canvas, (ctx, t, w, h) => {
      const cw = fontSize * 0.62, ch = fontSize * 1.1;
      const colCount = Math.ceil(w / cw);
      if (!cols || cols.length !== colCount) {
        cols = Array.from({ length: colCount }, (_, i) => ({
          y: Math.random() * -h,
          speed: 20 + Math.random() * 80,
          len: 6 + Math.floor(Math.random() * 18),
          green: accent && Math.random() < 0.08,
        }));
      }
      ctx.fillStyle = 'rgba(10,10,10,0.18)'; ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      ctx.textBaseline = 'top';
      for (let i = 0; i < colCount; i++) {
        const c = cols[i];
        c.y += c.speed * 0.016;
        if (c.y - c.len * ch > h) { c.y = Math.random() * -h * 0.3; c.speed = 20 + Math.random() * 80; }
        for (let k = 0; k < c.len; k++) {
          const yy = c.y - k * ch;
          if (yy < 0 || yy > h) continue;
          const ch0 = charset[Math.floor(Math.random() * charset.length)];
          const alpha = (1 - k / c.len) * 0.9;
          ctx.fillStyle = c.green
            ? (k === 0 ? accent : `rgba(74,222,128,${alpha * 0.5})`)
            : (k === 0 ? 'rgba(255,255,255,.95)' : `rgba(255,255,255,${alpha * 0.35})`);
          ctx.fillText(ch0, i * cw, yy);
        }
      }
    });
  };

  // ── 3. TICKER ────────────────────────────────────────────────────────────
  // Bloomberg-style horizontal scroll of market tickers, multi-row, each row
  // scrolls at a different speed. Not animated noise — animated *content*.
  AsciiAnims.ticker = (canvas, opts = {}) => {
    const rows = opts.rows || [
      'KXHIGHNY-26APR18-T71  0.62 ↑  ·  KXHIGHNY-26APR18-T68  0.41 ↓  ·  POLY-WEATHER-NYC-75  0.58 →  ·  KXHIGHLA-26APR18-T78  0.33 ↓  ·',
      'NBM  71°F  ·  GFS  72°F  ·  HRRR  70°F  ·  ECMWF  73°F  ·  OBS  69.3°F  ·  CLI  pending  ·  LST-aware  ·',
      'IEM T-group  OK  ·  AWC METAR  OK  ·  NCEI GHCNh  OK  ·  GOES-16  OK  ·  GOES-19  OK  ·  NWS CLI  OK  ·',
    ];
    const fontSize = opts.fontSize || 13;
    return frame(canvas, (ctx, t, w, h) => {
      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      ctx.textBaseline = 'top';
      const ch = Math.floor(h / rows.length);
      rows.forEach((text, i) => {
        const speed = 40 + i * 25;
        const fullW = ctx.measureText(text + '   ').width;
        const offset = (t * speed) % fullW;
        const y = i * ch + (ch - fontSize) / 2;
        ctx.fillStyle = `rgba(255,255,255,${0.35 + (i === 0 ? 0.35 : 0)})`;
        for (let x = -offset; x < w; x += fullW) {
          ctx.fillText(text + '   ', x, y);
        }
        if (i < rows.length - 1) {
          ctx.strokeStyle = 'rgba(255,255,255,.1)';
          ctx.beginPath(); ctx.moveTo(0, (i + 1) * ch); ctx.lineTo(w, (i + 1) * ch); ctx.stroke();
        }
      });
    });
  };

  // ── 4. GRID PULSE ────────────────────────────────────────────────────────
  // Radial pulses from random origins on a character grid. Slow, meditative —
  // good behind long-form copy.
  AsciiAnims.grid = (canvas, opts = {}) => {
    const fontSize = opts.fontSize || 14;
    const pulses = [];
    return frame(canvas, (ctx, t, w, h) => {
      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      ctx.textBaseline = 'top';
      const cw = fontSize * 0.62, ch = fontSize * 1.1;
      const cols = Math.ceil(w / cw), rows = Math.ceil(h / ch);
      // spawn
      if (Math.random() < 0.04 && pulses.length < 6) {
        pulses.push({ x: Math.random() * cols, y: Math.random() * rows, born: t });
      }
      // base grid
      ctx.fillStyle = 'rgba(255,255,255,.06)';
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        ctx.fillText('·', x * cw, y * ch);
      }
      // pulses
      for (let p = pulses.length - 1; p >= 0; p--) {
        const age = t - pulses[p].born;
        if (age > 4) { pulses.splice(p, 1); continue; }
        const r = age * 14;
        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
          const d = Math.hypot(x - pulses[p].x, y - pulses[p].y);
          const band = Math.abs(d - r);
          if (band < 0.9) {
            const a = (1 - age / 4) * (1 - band);
            ctx.fillStyle = `rgba(255,255,255,${a * 0.9})`;
            ctx.fillText(band < 0.4 ? '+' : '·', x * cw, y * ch);
          }
        }
      }
    });
  };

  // ── 5. FLOW FIELD ────────────────────────────────────────────────────────
  // Perlin-ish direction field rendered as arrows. Slow vector drift.
  AsciiAnims.flow = (canvas, opts = {}) => {
    const fontSize = opts.fontSize || 14;
    const arrows = ['→', '↗', '↑', '↖', '←', '↙', '↓', '↘'];
    return frame(canvas, (ctx, t, w, h) => {
      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      ctx.textBaseline = 'top';
      const cw = fontSize * 1.2, ch = fontSize * 1.2; // wider — arrows want space
      const cols = Math.ceil(w / cw), rows = Math.ceil(h / ch);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const angle = Math.sin(x * 0.15 + t * 0.3) + Math.cos(y * 0.2 - t * 0.25);
          const idx = Math.floor(((angle + 2) / 4) * arrows.length) % arrows.length;
          const dim = 0.1 + Math.abs(Math.sin(x * 0.1 + y * 0.1 + t * 0.4)) * 0.35;
          ctx.fillStyle = `rgba(255,255,255,${dim})`;
          ctx.fillText(arrows[Math.abs(idx)], x * cw, y * ch);
        }
      }
    });
  };

  // ── 6. TYPED LOG ─────────────────────────────────────────────────────────
  // Infinite scrolling terminal log — lines append with a typing effect,
  // auto-scroll. Great hero background when you want "a system is running".
  AsciiAnims.log = (canvas, opts = {}) => {
    const fontSize = opts.fontSize || 13;
    const lineTemplates = opts.lines || [
      '[%ts%] ingest:IEM  rows=%n%  ok',
      '[%ts%] ingest:AWC  rows=%n%  ok',
      '[%ts%] reconcile:NYC  priority=IEM>AWC>GHCNh  ok',
      '[%ts%] snapshot:NYC  as_of=%ts%  v=%v%',
      '[%ts%] kalshi:KXHIGHNY-26APR18-T71  mid=%p%  book=%n%',
      '[%ts%] settle:NWS CLI  pending=%n%',
      '[%ts%] forecast:NBM  h=6  cities=60  ok',
      '[%ts%] agent:as_tools  exported=%n%  format=toon',
    ];
    const lines = [];
    let typing = null; // { text, idx, y }
    let lastSpawn = 0;
    function genLine() {
      const pad = n => String(n).padStart(2, '0');
      const d = new Date();
      const ts = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
      const t = lineTemplates[Math.floor(Math.random() * lineTemplates.length)];
      return t
        .replace(/%ts%/g, ts)
        .replace(/%n%/g, () => String(Math.floor(10 + Math.random() * 9990)))
        .replace(/%p%/g, () => (Math.random()).toFixed(3))
        .replace(/%v%/g, () => `v0.${4 + Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 9)}`);
    }
    return frame(canvas, (ctx, t, w, h) => {
      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      ctx.textBaseline = 'top';
      const ch = fontSize * 1.5;
      const maxLines = Math.ceil(h / ch) + 2;
      if (!typing && t - lastSpawn > 0.25) {
        typing = { text: genLine(), idx: 0, startedAt: t };
        lastSpawn = t;
      }
      if (typing) {
        const charsPerSec = 80;
        const shown = Math.floor((t - typing.startedAt) * charsPerSec);
        typing.idx = Math.min(shown, typing.text.length);
        if (typing.idx >= typing.text.length) { lines.push(typing.text); typing = null; }
      }
      while (lines.length > maxLines) lines.shift();
      for (let i = 0; i < lines.length; i++) {
        const age = lines.length - i;
        const alpha = Math.max(0.1, 1 - age / maxLines);
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.7})`;
        ctx.fillText(lines[i], 16, h - (lines.length - i) * ch - (typing ? ch : 0));
      }
      if (typing) {
        ctx.fillStyle = 'rgba(255,255,255,.9)';
        ctx.fillText(typing.text.slice(0, typing.idx), 16, h - ch);
        // cursor
        const cursorX = 16 + ctx.measureText(typing.text.slice(0, typing.idx)).width;
        if (Math.floor(t * 2) % 2 === 0) {
          ctx.fillStyle = '#4ade80';
          ctx.fillRect(cursorX + 1, h - ch + 3, fontSize * 0.55, fontSize);
        }
      }
    });
  };

  window.AsciiAnims = AsciiAnims;
})();
