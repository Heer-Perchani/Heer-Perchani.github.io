// ── Portfolio Park: walk between scenes and open a project card per flower ──
const park = document.getElementById('park');
const scenes = [...document.querySelectorAll('.scene')];
const flowerGroups = [...document.querySelectorAll('.scene-flowers')];
const backBtn = document.getElementById('back-btn');
const nextBtn = document.getElementById('next-btn');
const finishBtn = document.getElementById('finish-btn');
const sceneCount = document.getElementById('scene-count');
const character = document.getElementById('character');
const bubble = document.getElementById('bubble');
const lastScene = scenes.length - 1;
let currentScene = 0;

const sceneLines = [
  'Tap a flower to open a project, or press Next to walk with me!',
  'More flowers this way. Each one is a project.',
  'Still walking? You can also skip to the full page at the top.',
  'Almost at the end of the park!',
  "That's the whole park! Tap below to see everything on one page.",
];

function say(text) {
  bubble.textContent = text;
  bubble.classList.add('show');
}

// Load a scene image only when it's about to be needed (they're ~1.3 MB each)
function loadScene(i) {
  const img = scenes[i];
  if (img && img.dataset.src) {
    img.src = img.dataset.src;
    delete img.dataset.src;
  }
}

function goToScene(i) {
  if (i < 0 || i > lastScene || i === currentScene) return;
  loadScene(i);
  currentScene = i;
  scenes.forEach((img, n) => img.classList.toggle('is-active', n === i));
  flowerGroups.forEach((group, n) => { group.hidden = n !== i; });
  backBtn.disabled = i === 0;
  nextBtn.hidden = i === lastScene;
  finishBtn.hidden = i !== lastScene;
  sceneCount.textContent = `Stop ${i + 1} of ${scenes.length}`;
  say(sceneLines[i]);
  loadScene(i + 1);
  if (i === lastScene) wave();
}

backBtn.addEventListener('click', () => goToScene(currentScene - 1));
nextBtn.addEventListener('click', () => goToScene(currentScene + 1));
backBtn.disabled = true;

// When Next disappears at the last stop, keep keyboard focus on the controls
nextBtn.addEventListener('click', () => { if (nextBtn.hidden) finishBtn.focus(); });

// Arrow keys walk, but only while the park is on screen and no card is open
let parkVisible = true;
new IntersectionObserver(([entry]) => { parkVisible = entry.intersectionRatio > 0.5; },
  { threshold: [0, 0.5, 1] }).observe(park);

document.addEventListener('keydown', (e) => {
  if (!parkVisible || dialog.open || e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.key === 'ArrowRight') { e.preventDefault(); goToScene(currentScene + 1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); goToScene(currentScene - 1); }
});

// Swipe on touch screens: swipe left to walk forward, right to walk back
let touchStart = null;
park.addEventListener('touchstart', (e) => {
  const t = e.changedTouches[0];
  touchStart = { x: t.clientX, y: t.clientY };
}, { passive: true });
park.addEventListener('touchend', (e) => {
  if (!touchStart) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStart.x;
  const dy = t.clientY - touchStart.y;
  touchStart = null;
  if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
  goToScene(currentScene + (dx < 0 ? 1 : -1));
}, { passive: true });

// ── Heer waves hello ──
function wave() {
  character.src = 'waving.png';
  setTimeout(() => { character.src = 'standing.png'; }, 1600);
}

window.addEventListener('load', () => {
  setTimeout(() => { wave(); bubble.classList.add('show'); }, 400);
  setTimeout(() => { if (currentScene === 0) say(sceneLines[0]); }, 3200);
  loadScene(1);
});

// ── Project cards: copy the matching card from the one-page overview ──
const dialog = document.getElementById('project-dialog');
const dialogBody = document.getElementById('dialog-body');
const projectCards = [...document.querySelectorAll('#projects .card')];
let lastFlower = null;

function openProject(id, flower) {
  const card = document.getElementById(`project-${id}`);
  if (!card) return;
  lastFlower = flower;
  dialogBody.innerHTML =
    `<p class="kicker">Project ${projectCards.indexOf(card) + 1} of ${projectCards.length}</p>` + card.innerHTML;
  dialogBody.querySelector('h3').id = 'dialog-title';
  dialog.showModal();
  dialog.querySelector('.inline-link').focus();
}

function closeProject() {
  dialog.close();
}

document.querySelectorAll('.flower').forEach((flower) => {
  flower.addEventListener('click', () => openProject(flower.dataset.project, flower));
});
document.getElementById('dialog-close').addEventListener('click', closeProject);
// Clicks on the dimmed backdrop land on the <dialog> itself, outside its box
dialog.addEventListener('click', (e) => {
  if (e.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  if (!inside) closeProject();
});
dialog.addEventListener('close', () => { if (lastFlower) lastFlower.focus(); });

// Keep Tab cycling inside the open card
dialog.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const items = [...dialog.querySelectorAll('a[href], button')];
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

// Sections scroll to just below the sticky nav, whatever height it wraps to
const navbar = document.querySelector('.navbar');
new ResizeObserver(() => {
  document.documentElement.style.setProperty('--nav-h', `${navbar.offsetHeight}px`);
}).observe(navbar);

// ── "Skip the walk": move keyboard focus to the overview, not just the scroll position ──
document.querySelectorAll('a[href="#about"]').forEach((link) => {
  link.addEventListener('click', () => {
    setTimeout(() => document.getElementById('about').focus({ preventScroll: true }), 0);
  });
});
