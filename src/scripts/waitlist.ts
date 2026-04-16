import { createClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    posthog?: { capture: (event: string, properties?: Record<string, unknown>) => void };
  }
}

const SUPABASE_URL = 'https://jdwyfaswivyyawuoxbty.supabase.co';
const SUPABASE_KEY = 'sb_publishable_I6GYExqvcHFK4Rk-7cHrAQ_YqCGMIid';
const FORM_RESET_DELAY_MS = 4000;
const DEFAULT_NOTE = 'No spam. Early users get free API access.';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const form = document.querySelector<HTMLFormElement>('.cta-form');
if (form) {
  const inputEl = form.querySelector<HTMLInputElement>('.cta-input');
  const btnEl = form.querySelector<HTMLButtonElement>('.cta-btn');
  const noteEl = document.querySelector<HTMLElement>('.cta-note');

  let sb: ReturnType<typeof createClient> | null = null;
  try {
    sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  } catch (err) {
    console.error('[waitlist] Supabase init failed:', err);
  }

  let submitting = false;
  let resetTimer: ReturnType<typeof setTimeout> | null = null;

  function clearErrorState(): void {
    if (!inputEl || !noteEl) return;
    inputEl.classList.remove('error');
    noteEl.textContent = DEFAULT_NOTE;
    noteEl.classList.remove('error');
  }

  function triggerShake(): void {
    if (!form) return;
    form.classList.remove('shake');
    // Force reflow to restart the animation
    void form.offsetWidth;
    form.classList.add('shake');
  }

  type FormState = 'idle' | 'submitting' | 'success' | 'error';

  function setFormState(state: FormState, message?: string): void {
    if (!inputEl || !btnEl || !noteEl) return;

    switch (state) {
      case 'idle':
        inputEl.disabled = false;
        btnEl.disabled = false;
        btnEl.textContent = 'Get early access';
        noteEl.textContent = DEFAULT_NOTE;
        noteEl.classList.remove('error', 'success');
        inputEl.classList.remove('error');
        break;

      case 'submitting':
        inputEl.disabled = true;
        btnEl.disabled = true;
        btnEl.textContent = 'Joining...';
        clearErrorState();
        break;

      case 'success':
        inputEl.disabled = true;
        btnEl.disabled = true;
        btnEl.textContent = 'You\'re in';
        inputEl.value = '';
        noteEl.textContent = message || 'Check your inbox for next steps.';
        noteEl.classList.remove('error');
        noteEl.classList.add('success');
        break;

      case 'error':
        inputEl.disabled = false;
        btnEl.disabled = false;
        btnEl.textContent = 'Get early access';
        inputEl.classList.add('error');
        noteEl.textContent = message || 'Something went wrong. Try again.';
        noteEl.classList.add('error');
        noteEl.classList.remove('success');
        triggerShake();
        break;
    }
  }

  function scheduleReset(): void {
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      setFormState('idle');
      submitting = false;
    }, FORM_RESET_DELAY_MS);
  }

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    if (submitting || !inputEl) return;

    const email = inputEl.value.trim();

    if (!email) {
      setFormState('error', 'Please enter your email.');
      return;
    }

    if (!EMAIL_RE.test(email)) {
      setFormState('error', 'That doesn\'t look like a valid email.');
      return;
    }

    submitting = true;
    setFormState('submitting');

    if (!sb) {
      setFormState('error', 'Service unavailable. Try again later.');
      scheduleReset();
      return;
    }

    try {
      const { error } = await sb
        .from('waitlist')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
          setFormState('success', 'You\'re already on the list!');
          window.posthog?.capture('waitlist_signup', { status: 'duplicate', page: window.location.pathname });
        } else {
          console.error('[waitlist] Insert error:', error);
          setFormState('error', 'Something went wrong. Try again.');
        }
      } else {
        setFormState('success');
        window.posthog?.capture('waitlist_signup', { status: 'new', page: window.location.pathname });
      }
    } catch (err) {
      console.error('[waitlist] Network error:', err);
      setFormState('error', 'Network error. Check your connection.');
    }

    scheduleReset();
  });
}
