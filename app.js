// ── ASCII Wave — Full hero background ─────────────────────────────────────
(function() {
  const canvas = document.getElementById('waveCanvas');
  const ctx = canvas.getContext('2d');
  
  const chars = ' .:-=+*#%@';
  const cellSize = 12;
  const fontPx = 10;
  let cols, rows, time = 0;
  let w, h;
  
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / cellSize);
    rows = Math.ceil(h / cellSize);
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  function draw() {
    ctx.fillStyle = '#e8dcc8';
    ctx.fillRect(0, 0, w, h);
    
    ctx.font = `${fontPx}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const wave1 = Math.sin(x * 0.1 + time * 0.05);
        const wave2 = Math.cos(y * 0.1 + time * 0.03);
        const wave3 = Math.sin((x + y) * 0.05 - time * 0.02);
        
        const val = (wave1 + wave2 + wave3 + 3) / 6;
        const charIdx = Math.floor(val * (chars.length - 1));
        const ch = chars[charIdx];
        
        if (ch === ' ') continue;
        
        const opacity = 0.06 + (val * 0.22);
        
        ctx.fillStyle = `rgba(44, 30, 16, ${opacity})`;
        ctx.fillText(ch, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
      }
    }
    
    time += 0.02;
    requestAnimationFrame(draw);
  }
  
  draw();
})();

// ── Form ──────────────────────────────────────────────────────────────────
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
