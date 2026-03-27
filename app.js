// ── ASCII Wave Animation ──────────────────────────────────────────────────
// Pure canvas + math, no libraries
(function() {
  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Config
  const BG_COLOR = '#0a0a0a';
  const CHAR_COLOR = 'rgba(200, 200, 195,';  // opacity appended
  const COLS = 120;
  const charSet = ' .,;:!|/\\-_~^';
  
  // Market words (green = sports/weather, blue = politics/econ)
  const WORDS = [
    { text: 'TRUMP', color: '#1C57BE' },
    { text: 'NBA', color: '#35BE76' },
    { text: 'WEATHER', color: '#35BE76' },
    { text: 'FED', color: '#1C57BE' },
    { text: 'BTC', color: '#1C57BE' },
    { text: 'F1', color: '#35BE76' },
    { text: 'RAIN', color: '#35BE76' },
    { text: 'AI', color: '#1C57BE' },
    { text: 'NFL', color: '#35BE76' },
    { text: 'ELECTION', color: '#1C57BE' },
  ];

  let cellW, cellH, rows, w, h;
  let time = 0;

  // Mouse state
  let mouse = { x: -1, y: -1 };
  let smooth = { x: -1, y: -1 };
  let mouseDecay = 0;
  let mouseActive = false;

  // ── Resize ──────────────────────────────────────────────────────────────
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    w = canvas.parentElement?.offsetWidth || window.innerWidth;
    h = canvas.parentElement?.offsetHeight || window.innerHeight;
    
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    
    cellW = w / COLS;
    cellH = cellW * 1.6;
    rows = Math.ceil(h / cellH);
    
    // Set font once
    const fontSize = Math.max(8, cellH * 0.6);
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }

  resize();
  window.addEventListener('resize', resize);

  // Mouse events
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouseActive = true;
    mouseDecay = 1.0;
  });
  window.addEventListener('mouseleave', () => { mouseActive = false; });
  window.addEventListener('touchmove', (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
    mouseActive = true;
    mouseDecay = 1.0;
  }, { passive: true });
  window.addEventListener('touchend', () => { mouseActive = false; });

  // ── Wave amplitude function ─────────────────────────────────────────────
  function waveAmp(col, band, t) {
    const nx = col / COLS;  // normalized 0–1
    return 0.15 * Math.sin(nx * 5 + t + band) + 
           0.1 * Math.cos(nx * 10 - t * 0.5);
  }

  // ── Draw frame ──────────────────────────────────────────────────────────
  function draw() {
    // Clear
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, w, h);

    // Smooth mouse
    if (smooth.x < 0) { smooth.x = mouse.x; smooth.y = mouse.y; }
    smooth.x += (mouse.x - smooth.x) * 0.08;
    smooth.y += (mouse.y - smooth.y) * 0.08;
    if (!mouseActive) mouseDecay *= 0.99;
    const doMouse = mouseDecay > 0.01 && smooth.x >= 0;

    // Draw each cell
    for (let row = 0; row < rows; row++) {
      const band = Math.floor(row / 4);  // horizontal striations
      const cy = row * cellH + cellH / 2;
      const normalizedY = row / rows;

      for (let col = 0; col < COLS; col++) {
        const cx = col * cellW + cellW / 2;
        
        // Get wave amplitude at this column
        let amp = waveAmp(col, band, time);
        
        // Mouse interaction: displace wave toward cursor
        if (doMouse) {
          const dx = (cx - smooth.x) / w;
          const dy = (cy - smooth.y) / h;
          const distSq = dx * dx + dy * dy;
          const pull = Math.exp(-distSq / 0.015) * mouseDecay;
          const mouseNormY = smooth.y / h;
          amp += (mouseNormY - 0.5 - amp) * pull * 0.6;
        }
        
        // Gaussian density: how close is this row to wave center?
        const distFromCenter = normalizedY - (0.5 + amp);
        const density = Math.exp(-(distFromCenter * distFromCenter) / 0.02);
        
        // Skip low density cells
        if (density < 0.05) continue;
        
        // Map density to character
        const charIndex = Math.floor(density * (charSet.length - 1));
        const ch = charSet[charIndex];
        if (ch === ' ') continue;
        
        // Draw with opacity proportional to density
        const opacity = (density * 0.6).toFixed(2);
        ctx.fillStyle = `${CHAR_COLOR}${opacity})`;
        ctx.fillText(ch, cx, cy);
      }
    }

    // Draw 2 subtle words at 100% opacity
    const numWords = 2;
    for (let i = 0; i < numWords; i++) {
      // Slowly cycle through words
      const wordIndex = (Math.floor(time * 0.3) + i * 4) % WORDS.length;
      const word = WORDS[wordIndex];
      
      // Drift position slowly across screen
      const drift = (time * 0.1 + i * 50) % (COLS - word.text.length - 4);
      const col = Math.floor(drift + 2);
      
      // Follow wave at this column
      const nx = col / COLS;
      const waveY = 0.5 + 0.15 * Math.sin(nx * 5 + time) + 0.1 * Math.cos(nx * 10 - time * 0.5);
      const row = Math.floor(waveY * rows);
      const cy = row * cellH + cellH / 2;
      
      // Draw word at 100% opacity
      ctx.fillStyle = word.color;
      for (let c = 0; c < word.text.length; c++) {
        const cx = (col + c) * cellW + cellW / 2;
        ctx.fillText(word.text[c], cx, cy);
      }
    }

    // Advance time (slower)
    time += 0.005;
    
    requestAnimationFrame(draw);
  }

  // Start animation
  requestAnimationFrame(draw);
})();

// ── Supabase Waitlist ──────────────────────────────────────────────────────
(function() {
  var SUPABASE_URL = 'https://jdwyfaswivyyawuoxbty.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_I6GYExqvcHFK4Rk-7cHrAQ_YqCGMIid';
  var FORM_RESET_DELAY_MS = 4000;
  var DEFAULT_NOTE = 'No spam. Early users get free API access.';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var form = document.querySelector('.cta-form');
  if (!form) return;
  var inputEl = form.querySelector('.cta-input');
  var btnEl = form.querySelector('.cta-btn');
  var noteEl = document.querySelector('.cta-note');

  var sb = null;
  try {
    if (typeof window.supabase !== 'undefined') {
      sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
  } catch (err) {
    console.error('[waitlist] Supabase init failed:', err);
  }

  var submitting = false;
  var resetTimer = null;

  function clearErrorState() {
    inputEl.classList.remove('error');
    form.classList.remove('error');
    noteEl.classList.remove('error');
  }

  function triggerShake() {
    form.classList.remove('error');
    inputEl.classList.remove('error');
    void form.offsetWidth;
    form.classList.add('error');
    inputEl.classList.add('error');
  }

  function setFormState(state, message) {
    switch (state) {
      case 'submitting':
        clearErrorState();
        inputEl.disabled = true;
        btnEl.disabled = true;
        btnEl.classList.add('loading');
        btnEl.textContent = 'Submitting\u2026';
        break;
      case 'success':
        submitting = false;
        clearErrorState();
        inputEl.disabled = true;
        inputEl.classList.add('success');
        btnEl.disabled = true;
        btnEl.classList.remove('loading');
        btnEl.textContent = "You're on the list";
        btnEl.classList.add('success');
        noteEl.textContent = "We'll be in touch.";
        noteEl.className = 'cta-note success';
        break;
      case 'duplicate':
        setFormState('success');
        break;
      case 'validation-error':
        submitting = false;
        triggerShake();
        noteEl.textContent = message || 'Please enter a valid email.';
        noteEl.className = 'cta-note error';
        inputEl.focus();
        scheduleReset();
        break;
      case 'error':
        submitting = false;
        btnEl.classList.remove('loading');
        btnEl.disabled = false;
        btnEl.textContent = 'Get Early Access';
        inputEl.disabled = false;
        triggerShake();
        noteEl.textContent = message || 'Something went wrong. Try again.';
        noteEl.className = 'cta-note error';
        scheduleReset();
        break;
    }
  }

  function scheduleReset() {
    clearTimeout(resetTimer);
    resetTimer = setTimeout(function() {
      clearErrorState();
      inputEl.disabled = false;
      inputEl.classList.remove('success');
      btnEl.disabled = false;
      btnEl.classList.remove('loading', 'success');
      btnEl.textContent = 'Get Early Access';
      noteEl.textContent = DEFAULT_NOTE;
      noteEl.className = 'cta-note';
    }, FORM_RESET_DELAY_MS);
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (submitting) return;

    var email = inputEl.value.trim();
    
    if (!email) {
      setFormState('validation-error', 'Please enter your email.');
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setFormState('validation-error', 'Please enter a valid email.');
      return;
    }

    if (!sb) {
      setFormState('error', 'Still loading. Try again.');
      return;
    }

    submitting = true;
    setFormState('submitting');

    try {
      var result = await sb.from('waitlist').insert({ email });

      if (!result.error) {
        setFormState('success');
      } else if (result.error.code === '23505') {
        setFormState('duplicate');
      } else {
        console.error('[waitlist]', result.error);
        setFormState('error');
      }
    } catch (err) {
      console.error('[waitlist]', err);
      setFormState('error');
    }
  });
})();
