// Pitch deck navigation
(function() {
  const slides = [
    '/pitch/intro/',
    '/pitch/traction/',
    '/pitch/origin/',
    '/pitch/problem/',
    '/pitch/solution/',
    '/pitch/competitive/',
    '/pitch/distribution/',
    '/pitch/business-model/',
    '/pitch/team/'
  ];

  const path = window.location.pathname.replace(/\/$/, '') + '/';
  const current = slides.findIndex(s => path.includes(s.replace(/\/$/, '')));
  const total = slides.length;

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
