// ── Wave Field — optimized ASCII wave with mouse interaction ──────────────
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const BG_COLOR = '#0a0a0a';

  // Responsive column count: mobile 50, desktop 120 (original density)
  function getCols() {
    return window.innerWidth < 768 ? 50 : 120;
  }

  const charSet = ' .,;:!|/\\-_~^';
  
  // Market topic words with colors: green (#35BE76) for sports/weather, blue (#1C57BE) for politics/econ
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
  
  let COLS = getCols();
  let cellW, cellH, rowCount, time = 0;
  let w, h;
  let animationId = null;
  let isVisible = true;
  let lastFrameTime = 0;
  const TARGET_FPS = 30;
  const FRAME_DURATION = 1000 / TARGET_FPS;

  // Pre-compute opacity colors (avoid string allocation in loop)
  const colorCache = new Map();
  function getColor(opacity, bright) {
    const key = `${Math.round(opacity * 100)}-${bright ? 1 : 0}`;
    if (!colorCache.has(key)) {
      const a = bright ? Math.min(opacity * 1.4, 0.85) : opacity;
      colorCache.set(key, `rgba(200, 200, 195, ${a.toFixed(2)})`);
    }
    return colorCache.get(key);
  }

  // Mouse state
  let mouse = { x: -1, y: -1 };
  let smooth = { x: -1, y: -1 };
  let mouseDecay = 0;
  let mouseActive = false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x
    const parent = canvas.parentElement;
    w = parent.offsetWidth || window.innerWidth;
    h = parent.offsetHeight || window.innerHeight;
    COLS = getCols();
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cellW = w / COLS;
    cellH = cellW * 1.6;
    rowCount = Math.ceil(h / cellH);
    
    // Set font once on resize (not every frame)
    const fontSize = Math.max(8, cellW * 0.85);
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }

  resize();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  // Mouse events
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

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isVisible = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    } else {
      isVisible = true;
      lastFrameTime = 0;
      if (!animationId) animationId = requestAnimationFrame(draw);
    }
  });

  // Pause when scrolled out of view
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !animationId) {
      lastFrameTime = 0;
      animationId = requestAnimationFrame(draw);
    }
  }, { threshold: 0.1 });
  observer.observe(canvas);

  function draw(timestamp) {
    if (!isVisible) {
      animationId = null;
      return;
    }

    // Throttle to target FPS
    if (timestamp - lastFrameTime < FRAME_DURATION) {
      animationId = requestAnimationFrame(draw);
      return;
    }
    lastFrameTime = timestamp;

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, w, h);

    // Smooth mouse
    if (smooth.x < 0) { smooth.x = mouse.x; smooth.y = mouse.y; }
    smooth.x += (mouse.x - smooth.x) * 0.08;
    smooth.y += (mouse.y - smooth.y) * 0.08;
    if (!mouseActive) mouseDecay *= 0.99;

    const t = time;
    const doMouse = mouseDecay > 0.01 && smooth.x >= 0;

    // Animated words that pop in and out
    const wordCells = new Map(); // key: "row,col" -> { char, color, opacity }
    const numSlots = Math.min(5, Math.floor(COLS / 20)); // ~5 word slots
    const cycleDuration = 3.0; // seconds per word cycle
    
    for (let i = 0; i < numSlots; i++) {
      // Each slot has its own phase, offset so they don't all change at once
      const slotPhase = (t * 0.4 + i * 1.3) % cycleDuration;
      
      // Lifecycle: 0-0.3 fade in, 0.3-2.7 visible, 2.7-3.0 fade out
      let opacity = 1.0;
      if (slotPhase < 0.3) {
        opacity = slotPhase / 0.3; // fade in
      } else if (slotPhase > cycleDuration - 0.3) {
        opacity = (cycleDuration - slotPhase) / 0.3; // fade out
      }
      
      if (opacity < 0.05) continue; // skip if invisible
      
      // Which word to show (changes each cycle)
      const cycleIndex = Math.floor((t * 0.4 + i * 1.3) / cycleDuration);
      const wordIndex = (cycleIndex + i * 3) % WORDS.length;
      const word = WORDS[wordIndex];
      
      // Position: pseudo-random but stable within a cycle
      const seed = Math.sin(cycleIndex * 127.1 + i * 311.7) * 43758.5453;
      const rnd = seed - Math.floor(seed);
      const rnd2 = Math.sin(seed * 127.1) * 43758.5453;
      const rnd2n = rnd2 - Math.floor(rnd2);
      
      const col = Math.floor(rnd * (COLS - word.text.length - 4)) + 2;
      const rowRange = Math.floor(rowCount * 0.3); // center 30% of rows
      const rowStart = Math.floor(rowCount * 0.35);
      const row = rowStart + Math.floor(rnd2n * rowRange);
      
      // Register each character
      for (let c = 0; c < word.text.length; c++) {
        wordCells.set(`${row},${col + c}`, { 
          char: word.text[c], 
          color: word.color,
          opacity: opacity 
        });
      }
    }

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
        if (doMouse) {
          const dx = (cx - smooth.x) / w;
          const dy = (cy - smooth.y) / h;
          const distSq = dx * dx + dy * dy;
          const pull = Math.exp(-distSq / 0.015) * mouseDecay;
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

        // Check if this cell is part of a word
        const wordCell = wordCells.get(`${row},${col}`);
        if (wordCell && density > 0.3) {
          // Render word character with animated opacity
          ch = wordCell.char;
          // Convert hex to rgba with opacity
          const hex = wordCell.color;
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${wordCell.opacity})`;
        } else if (density > 0.6) {
          // Scatter probability numbers in dense zones
          const hash = Math.sin(col * 127.1 + row * 311.7) * 43758.5453;
          const rnd = hash - Math.floor(hash);
          if (rnd > 0.85) {
            const prob = Math.floor(((Math.sin(col * 0.7 + row * 0.3 + t * 0.5) + 1) / 2) * 100);
            const digits = prob.toString().padStart(2, '0');
            ch = digits[Math.floor(rnd * 10) % 2];
            ctx.fillStyle = getColor(opacity, true);
          } else {
            ctx.fillStyle = getColor(opacity, false);
          }
        } else {
          ctx.fillStyle = getColor(opacity, false);
        }
        ctx.fillText(ch, cx, cy);
      }
    }

    // Heartbeat timing
    const beat = Math.sin(time * 0.15);
    const eased = beat * beat * beat * beat;
    time += 0.003 + 0.005 * eased;
    
    animationId = requestAnimationFrame(draw);
  }

  animationId = requestAnimationFrame(draw);
})();

// ── Supabase Waitlist ──────────────────────────────────────────────────────
(function() {
  var SUPABASE_URL = 'https://jdwyfaswivyyawuoxbty.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_I6GYExqvcHFK4Rk-7cHrAQ_YqCGMIid';
  var FORM_RESET_DELAY_MS = 4000;
  var DEFAULT_NOTE = 'No spam. Early users get free API access.';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Cache DOM elements first — listener must attach even if Supabase fails
  var form = document.querySelector('.cta-form');
  if (!form) return;
  var inputEl = form.querySelector('.cta-input');
  var btnEl = form.querySelector('.cta-btn');
  var noteEl = document.querySelector('.cta-note');

  // Init client — wrapped in try-catch so a bad key/version never kills the listener
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
    // Remove and re-add to restart animation
    form.classList.remove('error');
    inputEl.classList.remove('error');
    void form.offsetWidth; // Force reflow
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
        // Show same success state to prevent email enumeration
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
    
    // Custom validation
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
