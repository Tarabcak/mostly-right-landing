function init(): void {
  const els = document.querySelectorAll<HTMLElement>('.reveal');
  if (!els.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('revealed'));
    return;
  }

  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('revealed'));
    return;
  }

  // Group reveal elements by their closest section parent
  const sections = new Map<Element, HTMLElement[]>();
  els.forEach((el) => {
    const section = el.closest('section, .hero-wrapper, .launching-section, .cta-section');
    if (section) {
      if (!sections.has(section)) sections.set(section, []);
      sections.get(section)!.push(el);
    } else {
      // No section parent — observe individually
      if (!sections.has(el)) sections.set(el, [el]);
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const children = sections.get(entry.target);
          if (children) {
            children.forEach((el) => el.classList.add('revealed'));
          }
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.01,
    }
  );

  sections.forEach((_, section) => observer.observe(section));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
