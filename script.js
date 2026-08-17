// Reveal on scroll (kept lightweight)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Experience accordion: expand in place instead of navigating to a new page.
async function loadExperienceDetail(detailsEl) {
  const url = detailsEl.getAttribute('data-url');
  const container = detailsEl.querySelector('.exp-inline');
  if (!url || !container) return;
  if (container.dataset.loaded === '1') return;

  container.innerHTML = '<div class="exp-inline-loading">加载详情…</div>';

  try {
    const res = await fetch(url, { cache: 'no-cache' });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const hero = doc.querySelector('.detail-hero');
    const body = doc.querySelector('.detail-body');

    const wrap = document.createElement('div');

    if (hero) {
      const title = hero.querySelector('h1')?.textContent?.trim();
      const meta = hero.querySelector('.meta');

      const heroBox = document.createElement('div');
      heroBox.className = 'exp-inline-hero';

      if (title) {
        const h4 = document.createElement('h4');
        h4.textContent = title;
        heroBox.appendChild(h4);
      }

      if (meta) {
        const metaBox = document.createElement('div');
        metaBox.className = 'exp-inline-meta';
        metaBox.innerHTML = meta.innerHTML;
        heroBox.appendChild(metaBox);
      }

      wrap.appendChild(heroBox);
    }

    if (body) {
      const blocks = Array.from(body.querySelectorAll('.detail-block')).slice(0, 3);
      blocks.forEach((blk) => {
        wrap.appendChild(blk.cloneNode(true));
      });
    }

    container.innerHTML = '';
    container.appendChild(wrap);
    container.dataset.loaded = '1';
  } catch {
    container.innerHTML = '<div class="exp-inline-loading">加载失败，请刷新重试。</div>';
  }
}

function closeOtherAccordions(active) {
  document.querySelectorAll('details.exp-acc[open]').forEach((d) => {
    if (d !== active) d.open = false;
  });
}

function preserveViewportPosition(anchor, beforeTop) {
  requestAnimationFrame(() => {
    const afterTop = anchor.getBoundingClientRect().top;
    const delta = afterTop - beforeTop;
    if (Math.abs(delta) < 1) return;
    window.scrollBy({ top: delta, behavior: 'auto' });
  });
}

function updateAccordionToggleText(detailsEl) {
  const toggle = detailsEl.querySelector('.exp-more');
  if (!toggle) return;
  toggle.innerHTML = detailsEl.open ? '点击关闭 <i>↑</i>' : '点击查看详情 <i>↓</i>';
}

async function settleAccordionPosition(detailsEl, summary, beforeTop) {
  preserveViewportPosition(summary, beforeTop);

  const container = detailsEl.querySelector('.exp-inline');
  const wasLoaded = container?.dataset.loaded === '1';
  if (!wasLoaded) {
    await loadExperienceDetail(detailsEl);
    preserveViewportPosition(summary, beforeTop);
  }
}

document.querySelectorAll('details.exp-acc').forEach((d) => {
  const summary = d.querySelector('summary');
  if (!summary) return;

  updateAccordionToggleText(d);

  summary.addEventListener('click', async (event) => {
    event.preventDefault();
    const beforeTop = summary.getBoundingClientRect().top;

    if (d.open) {
      d.open = false;
      updateAccordionToggleText(d);
      preserveViewportPosition(summary, beforeTop);
      return;
    }

    closeOtherAccordions(d);
    d.open = true;
    document.querySelectorAll('details.exp-acc').forEach(updateAccordionToggleText);
    await settleAccordionPosition(d, summary, beforeTop);
  });
});


// Click Spark: inspired by React Bits click-spark, implemented in lightweight vanilla JS.
(function initClickSpark() {
  const canvas = document.getElementById('click-spark');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  const sparks = [];
  const colors = ['#ff9fb8', '#e9c37a', '#7cd0ff', '#f6f2ea'];
  let raf = null;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createSpark(x, y) {
    const count = 10;
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.22;
      sparks.push({
        x,
        y,
        angle,
        life: 0,
        maxLife: 28 + Math.random() * 8,
        speed: 2.1 + Math.random() * 1.2,
        length: 12 + Math.random() * 10,
        color: colors[i % colors.length],
        width: 1.4 + Math.random() * 1.1,
      });
    }

    if (!raf) raf = requestAnimationFrame(draw);
  }

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = sparks.length - 1; i >= 0; i -= 1) {
      const s = sparks[i];
      s.life += 1;
      const t = s.life / s.maxLife;
      const ease = 1 - Math.pow(1 - t, 3);
      const distance = s.speed * s.life;
      const x1 = s.x + Math.cos(s.angle) * distance;
      const y1 = s.y + Math.sin(s.angle) * distance;
      const tail = s.length * (1 - t * 0.4);
      const x2 = s.x + Math.cos(s.angle) * (distance + tail);
      const y2 = s.y + Math.sin(s.angle) * (distance + tail);

      ctx.globalAlpha = Math.max(0, 1 - ease);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      if (s.life >= s.maxLife) sparks.splice(i, 1);
    }

    ctx.globalAlpha = 1;
    if (sparks.length) {
      raf = requestAnimationFrame(draw);
    } else {
      raf = null;
    }
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointerdown', (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    createSpark(event.clientX, event.clientY);
  }, { passive: true });
})();

// Vertical scroll progress for portfolio page
const progressBar = document.querySelector('.scroll-progress span');
function updateScrollProgress() {
  if (!progressBar) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
  progressBar.style.height = `${progress}%`;
}
updateScrollProgress();
window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);

// Back to top button
const backToTop = document.querySelector('.back-to-top');
function updateBackToTop() {
  if (!backToTop) return;
  backToTop.classList.toggle('is-visible', window.scrollY > 520);
}
if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  updateBackToTop();
  window.addEventListener('scroll', updateBackToTop, { passive: true });
}
