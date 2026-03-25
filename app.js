// ── Wave Field — 120-col grid with mouse interaction ──────────────────────
(function() {
  const canvas = document.getElementById('waveCanvas');
  const ctx = canvas.getContext('2d');
  
  const COLS = 120;
  const charSet = ' .,;:!|/\\-_~^';
  let cellW, cellH, rowCount, time = 0;
  let w, h;
  
  // Mouse
  let mouse = { x: -1, y: -1 };
  let smooth = { x: -1, y: -1 };
  let mouseDecay = 0;
  let mouseActive = false;
  
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cellW = w / COLS;
    cellH = cellW * 1.6;
    rowCount = Math.ceil(h / cellH);
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouseActive = true;
    mouseDecay = 1.0;
  });
  window.addEventListener('mouseleave', () => { mouseActive = false; });
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    mouse.x = t.clientX;
    mouse.y = t.clientY;
    mouseActive = true;
    mouseDecay = 1.0;
  }, { passive: true });
  window.addEventListener('touchend', () => { mouseActive = false; });
  
  function draw() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, w, h);
    
    const fontSize = Math.max(8, cellW * 0.85);
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Smooth mouse
    if (smooth.x < 0) { smooth.x = mouse.x; smooth.y = mouse.y; }
    smooth.x += (mouse.x - smooth.x) * 0.08;
    smooth.y += (mouse.y - smooth.y) * 0.08;
    if (!mouseActive) mouseDecay *= 0.993;
    
    const t = time;
    
    for (let row = 0; row < rowCount; row++) {
      const band = Math.floor(row / 4);
      const cy = row * cellH + cellH / 2;
      const normalizedY = row / rowCount;
      
      for (let col = 0; col < COLS; col++) {
        const cx = col * cellW + cellW / 2;
        const normalizedX = col / COLS;
        
        // Wave amplitude — exact spec
        let waveAmp = 0.15 * Math.sin(normalizedX * 5 + t + band)
                    + 0.1 * Math.cos(normalizedX * 10 - t * 0.5);
        
        // Mouse wave displacement — pulls the wave toward cursor
        if (mouseDecay > 0.01 && smooth.x >= 0) {
          const dx = (cx - smooth.x) / w;
          const dy = (cy - smooth.y) / h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const pull = Math.exp(-dist * dist / 0.015) * mouseDecay;
          const mouseNormY = smooth.y / h;
          waveAmp += (mouseNormY - 0.5 - waveAmp) * pull * 0.6;
        }
        
        // Distance from wave center
        const distFromCenter = normalizedY - (0.5 + waveAmp);
        
        // Gaussian density
        const density = Math.exp(-(distFromCenter * distFromCenter) / 0.02);
        
        if (density < 0.05) continue;
        
        // Map density to character
        const ci = Math.floor(density * (charSet.length - 1));
        let ch = charSet[ci];
        if (ch === ' ') continue;
        
        const opacity = density * 0.6;
        
        // Scatter probability numbers in the dense zones
        const hash = Math.sin(col * 127.1 + row * 311.7) * 43758.5453;
        const rnd = hash - Math.floor(hash);
        if (density > 0.6 && rnd > 0.85) {
          // Show a probability digit — cycles slowly over time
          const prob = Math.floor(((Math.sin(col * 0.7 + row * 0.3 + t * 0.5) + 1) / 2) * 100);
          const digits = prob.toString().padStart(2, '0');
          const digitIdx = Math.floor(rnd * 10) % 2;
          ch = digits[digitIdx];
          // Numbers get slightly brighter
          ctx.fillStyle = `rgba(200, 200, 195, ${Math.min(opacity * 1.4, 0.85)})`;
        } else {
          ctx.fillStyle = `rgba(200, 200, 195, ${opacity})`;
        }
        ctx.fillText(ch, cx, cy);
      }
    }
    
    // Heartbeat with easing — long slow drifts, gentle surges
    const beat = Math.sin(time * 0.15);           // slow cycle
    const eased = beat * beat * beat * beat;       // ease-in-out (stays slow longer)
    const heartbeat = 0.003 + 0.005 * eased;       // range: 0.003 – 0.008
    time += heartbeat;
    requestAnimationFrame(draw);
  }
  
  draw();
})();

function handleSubmit(e) {
  e.preventDefault();
  const input = e.target.querySelector('.cta-input');
  const btn = e.target.querySelector('.cta-btn');
  btn.textContent = 'Added to waitlist';
  btn.style.opacity = '0.5';
  input.disabled = true;
  btn.disabled = true;
  return false;
}
