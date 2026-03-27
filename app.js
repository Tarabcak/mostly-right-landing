// ── ASCII Wave Animation with Word Overlays ───────────────────────────────
// Pure canvas + math, no libraries
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Config
  const BG_COLOR = '#0A0A0A';
  const CHAR_COLOR = '232, 230, 224';  // E8E6E0 as RGB
  const waveChars = ' .,;:!|/\\-_~^`';  // space lowest, backtick highest

  // Responsive columns: 50 mobile, 120 desktop
  function getCols() {
    return window.innerWidth < 768 ? 50 : 120;
  }

  let COLS = getCols();
  let cellW, cellH, rows, w, h;
  let time = 0;

  // ── Resize ──────────────────────────────────────────────────────────────
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    w = canvas.parentElement?.offsetWidth || window.innerWidth;
    h = canvas.parentElement?.offsetHeight || window.innerHeight;
    
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    
    COLS = getCols();  // responsive columns
    cellW = w / COLS;
    cellH = cellW * 1.6;
    rows = Math.ceil(h / cellH);
    
    // Font: cellH * 0.6
    const fontSize = Math.max(8, cellH * 0.6);
    ctx.font = `${fontSize}px "JetBrains Mono", "Fragment Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }

  resize();
  window.addEventListener('resize', () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);  // reset before resize
    resize();
  });

  // ── Draw frame ──────────────────────────────────────────────────────────
  function draw() {
    // Clear
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, w, h);

    // Draw each cell
    for (let row = 0; row < rows; row++) {
      const band = Math.floor(row / 4);  // horizontal striations
      const py = row * cellH + cellH / 2;

      for (let col = 0; col < COLS; col++) {
        const px = col * cellW + cellW / 2;
        const nx = col / COLS;
        
        // Two overlapping waves
        const amp = 0.15 * Math.sin(nx * 5 + time + band) + 
                    0.1 * Math.cos(nx * 10 - time * 0.5);
        
        // Gaussian density from wave centerline
        const dist = (row / rows) - (0.5 + amp);
        const density = Math.exp(-(dist * dist) / 0.02);
        
        // Skip low density
        if (density < 0.05) continue;
        
        // Wave character based on density
        const charIdx = Math.floor(density * (waveChars.length - 1));
        const char = waveChars[Math.min(charIdx, waveChars.length - 1)];
        
        if (char === ' ') continue;
        
        const opacity = density * 0.6;
        ctx.fillStyle = `rgba(${CHAR_COLOR}, ${opacity.toFixed(2)})`;
        ctx.fillText(char, px, py);
      }
    }

    // Advance time (slower)
    time += 0.008;
    
    requestAnimationFrame(draw);
  }

  // Start
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
