function init(): void {
  const els = document.querySelectorAll<HTMLElement>('.reveal');
  if (!els.length) return;

  // Reduced-motion users: reveal everything immediately, no observer.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('revealed'));
    return;
  }

  if (!('IntersectionObserver' in window)) {
    // Fallback: just reveal all (no animation) so content isn't stuck invisible.
    els.forEach((el) => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      // Trigger when the top of the element is ~15% above the bottom of viewport
      rootMargin: '0px 0px -15% 0px',
      threshold: 0.01,
    }
  );

  els.forEach((el) => observer.observe(el));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
