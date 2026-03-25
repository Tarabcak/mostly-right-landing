// ── Wave Field — 120-col grid with mouse interaction ──────────────────────
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('waveCanvas');
  const ctx = canvas.getContext('2d');
  const BG_COLOR = '#0a0a0a'; // matches --bg-primary

  let COLS = window.innerWidth < 768 ? 50 : 120;
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
    const parent = canvas.parentElement;
    w = parent.offsetWidth || window.innerWidth;
    h = parent.offsetHeight || window.innerHeight;
    COLS = w < 768 ? 50 : 120;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cellW = w / COLS;
    cellH = cellW * 1.6;
    rowCount = Math.ceil(h / cellH);
  }

  resize();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 100);
  });

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
    ctx.fillStyle = BG_COLOR;
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

        // Wave amplitude
        let waveAmp = 0.15 * Math.sin(normalizedX * 5 + t + band)
                    + 0.1 * Math.cos(normalizedX * 10 - t * 0.5);

        // Mouse wave displacement
        if (mouseDecay > 0.01 && smooth.x >= 0) {
          const dx = (cx - smooth.x) / w;
          const dy = (cy - smooth.y) / h;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const pull = Math.exp(-dist * dist / 0.015) * mouseDecay;
          const mouseNormY = smooth.y / h;
          waveAmp += (mouseNormY - 0.5 - waveAmp) * pull * 0.6;
        }

        const distFromCenter = normalizedY - (0.5 + waveAmp);
        const density = Math.exp(-(distFromCenter * distFromCenter) / 0.02);

        if (density < 0.05) continue;

        const ci = Math.floor(density * (charSet.length - 1));
        let ch = charSet[ci];
        if (ch === ' ') continue;

        const opacity = density * 0.6;

        // Scatter probability numbers in the dense zones
        const hash = Math.sin(col * 127.1 + row * 311.7) * 43758.5453;
        const rnd = hash - Math.floor(hash);
        if (density > 0.6 && rnd > 0.85) {
          const prob = Math.floor(((Math.sin(col * 0.7 + row * 0.3 + t * 0.5) + 1) / 2) * 100);
          const digits = prob.toString().padStart(2, '0');
          const digitIdx = Math.floor(rnd * 10) % 2;
          ch = digits[digitIdx];
          ctx.fillStyle = `rgba(200, 200, 195, ${Math.min(opacity * 1.4, 0.85)})`;
        } else {
          ctx.fillStyle = `rgba(200, 200, 195, ${opacity})`;
        }
        ctx.fillText(ch, cx, cy);
      }
    }

    // Heartbeat with easing
    const beat = Math.sin(time * 0.15);
    const eased = beat * beat * beat * beat;
    const heartbeat = 0.003 + 0.005 * eased;
    time += heartbeat;
    requestAnimationFrame(draw);
  }

  draw();
})();

// ── Supabase Waitlist ──────────────────────────────────────────────────────
(function() {
  var SUPABASE_URL = 'https://jdwyfaswivyyawuoxbty.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_I6GYExqvcHFK4Rk-7cHrAQ_YqCGMIid';
  var FORM_RESET_DELAY_MS = 4000;
  var DEFAULT_NOTE = 'No spam. Early users get free API access.';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Init client once — defer ordering guarantees supabase-js loads first
  var sb = typeof window.supabase !== 'undefined'
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

  // Cache DOM elements once
  var form = document.querySelector('.cta-form');
  var inputEl = form.querySelector('.cta-input');
  var btnEl = form.querySelector('.cta-btn');
  var noteEl = document.querySelector('.cta-note');

  var submitting = false;
  var resetTimer = null;

  function setFormState(state, message) {
    switch (state) {
      case 'submitting':
        inputEl.disabled = true;
        btnEl.disabled = true;
        btnEl.textContent = 'Submitting\u2026';
        break;
      case 'success':
        submitting = false;
        inputEl.disabled = true;
        btnEl.disabled = true;
        btnEl.textContent = "You're on the list";
        btnEl.classList.add('success');
        noteEl.textContent = "We'll be in touch.";
        noteEl.className = 'cta-note success';
        break;
      case 'duplicate':
        submitting = false;
        noteEl.textContent = "You're already signed up!";
        noteEl.className = 'cta-note info';
        scheduleReset();
        break;
      case 'error':
        submitting = false;
        noteEl.textContent = message || 'Something went wrong. Try again.';
        noteEl.className = 'cta-note error';
        scheduleReset();
        break;
    }
  }

  function scheduleReset() {
    clearTimeout(resetTimer);
    resetTimer = setTimeout(function() {
      inputEl.disabled = false;
      btnEl.disabled = false;
      btnEl.textContent = 'Get Early Access';
      inputEl.value = '';
      inputEl.focus();
      noteEl.textContent = DEFAULT_NOTE;
      noteEl.className = 'cta-note';
    }, FORM_RESET_DELAY_MS);
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (submitting) return;

    var email = inputEl.value.trim();
    if (!email || !EMAIL_RE.test(email)) return;

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
        setFormState('error');
      }
    } catch (err) {
      console.error('[waitlist]', err);
      setFormState('error');
    }
  });
})();
