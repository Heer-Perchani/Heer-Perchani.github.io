// Sections scroll to just below the sticky nav, whatever height it wraps to
const navbar = document.querySelector('.navbar');
new ResizeObserver(() => {
  document.documentElement.style.setProperty('--nav-h', `${navbar.offsetHeight}px`);
}).observe(navbar);
