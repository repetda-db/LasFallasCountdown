
/* ══════════════════════════════════════════════════
   Las Fallas Countdown — app.js
══════════════════════════════════════════════════ */

// ── Config ────────────────────────────────────────
const FALLAS_MONTH = 2;   // 0-indexed → March
const FALLAS_DAY   = 15;
const FALLAS_END_DAY = 19; // Festival lasts until March 19

// ── State ─────────────────────────────────────────
let lang       = localStorage.getItem('fallas_lang') || 'en';
let theme      = localStorage.getItem('fallas_theme') || 'day';
let imagesData = [];
let t9n        = {};
let timerID    = null;

// ── Init ──────────────────────────────────────────
async function init() {
  await loadTranslations();
  await loadImages();
  applyTheme(theme, false);
  applyLang(lang);
  setDailyBackground();
  startCountdown();
  bindEvents();
}

// ── Load JSON data ────────────────────────────────
async function loadTranslations() {
  try {
    const r = await fetch('data/translations.json');
    t9n = await r.json();
  } catch (e) {
    console.warn('Could not load translations.json', e);
    t9n = {};
  }
}

async function loadImages() {
  try {
    const r = await fetch('data/images.json');
    imagesData = await r.json();
  } catch (e) {
    console.warn('Could not load images.json', e);
    imagesData = [];
  }
}

// ── i18n ──────────────────────────────────────────
function tr(key) {
  return (t9n[lang] && t9n[lang][key]) ? t9n[lang][key] : key;
}

function applyLang(l) {
  lang = l;
  localStorage.setItem('fallas_lang', l);
  document.getElementById('lang-select').value = l;

  document.getElementById('main-title').textContent       = tr('title');
  document.getElementById('main-subtitle').textContent    = tr('subtitle');
  document.getElementById('countdown-label').textContent  = tr('countdown_label');
  document.getElementById('lbl-days').textContent         = tr('days');
  document.getElementById('lbl-hours').textContent        = tr('hours');
  document.getElementById('lbl-minutes').textContent      = tr('minutes');
  document.getElementById('lbl-seconds').textContent      = tr('seconds');
  document.getElementById('nav-history-btn').textContent  = '📜 ' + tr('history');
  document.getElementById('nav-home-btn').textContent     = '🏠 ' + tr('home');
  document.getElementById('nav-info-btn').textContent     = '📷 ' + tr('imageInfo');
  document.getElementById('img-credit-text').textContent  = tr('img_credit');
  document.getElementById('theme-btn').textContent        = theme === 'night' ? '☀️ ' + tr('themeDay') : '🌙 ' + tr('themeNight');
  document.getElementById('modal-title-text').textContent = tr('imageInfo');
  document.getElementById('info-key-title').textContent   = tr('photoTitle');
  document.getElementById('info-key-loc').textContent     = tr('location');
  document.getElementById('info-key-date').textContent    = tr('date');
  document.getElementById('info-key-src').textContent     = tr('source');
  document.getElementById('info-key-photo').textContent   = tr('photographer');
  document.getElementById('modal-close-btn').textContent  = tr('close');
  document.getElementById('history-title-el').textContent = tr('historyTitle');
  document.getElementById('celebration-text').textContent = tr('celebration');
  document.getElementById('celebration-sub').textContent  = tr('celebrationSub');
}

// ── Theme ─────────────────────────────────────────
function applyTheme(t, save = true) {
  theme = t;
  if (save) localStorage.setItem('fallas_theme', t);
  if (t === 'night') {
    document.body.classList.add('night');
  } else {
    document.body.classList.remove('night');
  }
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = t === 'night' ? '☀️ ' + tr('themeDay') : '🌙 ' + tr('themeNight');
}

function toggleTheme() {
  applyTheme(theme === 'night' ? 'day' : 'night');
}

// ── Daily Background ──────────────────────────────
function setDailyBackground() {
  if (!imagesData.length) return;
  const today   = new Date();
  const dayIdx  = today.getDate() % imagesData.length;
  const imgData = imagesData[dayIdx];

  const bg = document.getElementById('bg-image');
  bg.style.opacity = 0;
  setTimeout(() => {
    bg.style.backgroundImage = `url('images/${imgData.filename}')`;
    bg.style.opacity = 1;
  }, 400);

  // Populate modal
  document.getElementById('info-val-title').textContent  = imgData.title        || '—';
  document.getElementById('info-val-loc').textContent    = imgData.location      || '—';
  document.getElementById('info-val-date').textContent   = imgData.date          || '—';
  document.getElementById('info-val-src').textContent    = imgData.source        || '—';
  document.getElementById('info-val-photo').textContent  = imgData.photographer  || '—';

  // Schedule midnight refresh
  scheduleMidnightRefresh();
}

function scheduleMidnightRefresh() {
  const now  = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const ms   = next - now;
  setTimeout(() => { setDailyBackground(); }, ms);
}

// ── Countdown ─────────────────────────────────────
function getNextFallas() {
  const now  = new Date();
  const year = now.getFullYear();
  let target = new Date(year, FALLAS_MONTH, FALLAS_DAY, 0, 0, 0);
  if (now >= target) {
    // Check if we are currently IN the festival (Mar 15–19)
    const endDate = new Date(year, FALLAS_MONTH, FALLAS_END_DAY + 1, 0, 0, 0);
    if (now < endDate) return null; // festival is happening NOW
    target = new Date(year + 1, FALLAS_MONTH, FALLAS_DAY, 0, 0, 0);
  }
  return target;
}

function startCountdown() {
  if (timerID) clearInterval(timerID);
  tick();
  timerID = setInterval(tick, 1000);
}

function tick() {
  const target = getNextFallas();

  if (!target) {
    showCelebration();
    return;
  }

  const now  = new Date();
  const diff = target - now;

  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000)  / 60000);
  const seconds = Math.floor((diff % 60000)    / 1000);

  document.getElementById('val-days').textContent    = String(days).padStart(2, '0');
  document.getElementById('val-hours').textContent   = String(hours).padStart(2, '0');
  document.getElementById('val-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('val-seconds').textContent = String(seconds).padStart(2, '0');
}

// ── Celebration & Fireworks ───────────────────────
function showCelebration() {
  clearInterval(timerID);
  document.getElementById('celebration').classList.add('active');
  startFireworks();
}

// ── Fireworks Engine ──────────────────────────────
let fwAnimID = null;
const particles = [];

function startFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function spawnBurst() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.6;
    const colors = ['#ffd700','#ff6b00','#ff4500','#fff','#ff69b4','#00e5ff','#c084fc'];
    const count  = 60 + Math.floor(Math.random() * 40);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 4;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 2,
        decay: 0.012 + Math.random() * 0.01
      });
    }
  }

  let lastBurst = 0;
  function loop(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (ts - lastBurst > 700) { spawnBurst(); lastBurst = ts; }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x    += p.vx;
      p.y    += p.vy;
      p.vy   += 0.06;   // gravity
      p.alpha -= p.decay;
      if (p.alpha <= 0) { particles.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur  = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    fwAnimID = requestAnimationFrame(loop);
  }
  fwAnimID = requestAnimationFrame(loop);
}

// ── Modal helpers ─────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// ── Section toggles ───────────────────────────────
function showHistory() {
  document.getElementById('hero-content').classList.add('hidden');
  document.getElementById('history-section').classList.add('visible');
  document.getElementById('fan-section').classList.remove('visible');
}

function showFan() {
  document.getElementById('hero-content').classList.add('hidden');
  document.getElementById('fan-section').classList.add('visible');
  document.getElementById('history-section').classList.remove('visible');
}

function showHome() {
  document.getElementById('hero-content').classList.remove('hidden');
  document.getElementById('history-section').classList.remove('visible');
  document.getElementById('fan-section').classList.remove('visible');
}

// ── Events ────────────────────────────────────────
function bindEvents() {
  document.getElementById('theme-btn').addEventListener('click', toggleTheme);
  document.getElementById('lang-select').addEventListener('change', e => applyLang(e.target.value));
  document.getElementById('nav-info-btn').addEventListener('click', () => openModal('info-modal'));
  document.getElementById('img-credit-bar').addEventListener('click', () => openModal('info-modal'));
  document.getElementById('modal-close-btn').addEventListener('click', () => closeModal('info-modal'));
  document.getElementById('info-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('info-modal')) closeModal('info-modal');
  });
  document.getElementById('nav-history-btn').addEventListener('click', showHistory);
  document.getElementById('nav-fan-btn').addEventListener('click', showFan);
  document.getElementById('nav-home-btn').addEventListener('click', showHome);
}

// ── Start ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
