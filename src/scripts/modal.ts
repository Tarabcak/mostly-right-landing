function init(): void {
  const modal = document.getElementById('principles-modal');
  const openBtn = document.getElementById('principles-open');
  const footerMission = document.getElementById('footer-mission');
  const closeBtn = document.getElementById('principles-close');

  if (!modal) return;

  // --- Modal open ---
  const openModal = (e: Event): void => {
    e.preventDefault();
    modal.classList.add('active');
  };

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (footerMission) footerMission.addEventListener('click', openModal);

  // --- Modal close ---
  const closeModal = (): void => {
    modal.classList.remove('active');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Backdrop click
  modal.addEventListener('click', (e: MouseEvent) => {
    if (e.target === modal) closeModal();
  });

  // Escape key
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // --- Smooth scroll for real anchor links ---
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    const href = link.getAttribute('href');
    // Skip bare "#" links (modal triggers, etc.) — only scroll to real section anchors
    if (!href || href === '#') return;

    link.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;

      const start = window.scrollY;
      const end = target.getBoundingClientRect().top + start - 40;
      const distance = end - start;
      const duration = 1000;
      let startTime: number | null = null;

      function easeInOutExpo(t: number): number {
        if (t === 0) return 0;
        if (t === 1) return 1;
        if (t < 0.5) {
          return Math.pow(2, 20 * t - 10) / 2;
        }
        return (2 - Math.pow(2, -20 * t + 10)) / 2;
      }

      function step(ts: number): void {
        if (startTime === null) startTime = ts;
        const elapsed = ts - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutExpo(progress);
        window.scrollTo(0, start + distance * eased);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
