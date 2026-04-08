// Pitch deck navigation
(function() {
  const slides = [
    '/pitch/intro/',
    '/pitch/traction/',
    '/pitch/origin/',
    '/pitch/solution/',
    '/pitch/competitive/',
    '/pitch/distribution/',
    '/pitch/business-model/',
    '/pitch/team/'
  ];

  const path = window.location.pathname.replace(/\/$/, '') + '/';
  const current = slides.findIndex(s => path.includes(s.replace(/\/$/, '')));
  const total = slides.length;

  // Prefetch adjacent slides for instant navigation
  function prefetch(url) {
    var link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }
  if (current > 0) prefetch(slides[current - 1]);
  if (current < total - 1) prefetch(slides[current + 1]);

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (current < total - 1) window.location.href = slides[current + 1];
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (current > 0) window.location.href = slides[current - 1];
    }
  });
})();
