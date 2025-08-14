// ユーティリティ
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];

/* ===== ドロワー（オフキャンバス） ===== */
const hamburger = $('.hamburger');
const drawer    = $('#drawer');
const backdrop  = $('.drawer-backdrop');

const toggleDrawer = (open) => {
  const willOpen = open ?? !drawer.classList.contains('is-open');
  drawer.classList.toggle('is-open', willOpen);
  backdrop.classList.toggle('is-open', willOpen);
  hamburger.setAttribute('aria-expanded', String(willOpen));
  drawer.setAttribute('aria-hidden', String(!willOpen));
  document.body.style.overflow = willOpen ? 'hidden' : '';
};

if (hamburger && drawer && backdrop) {
  hamburger.addEventListener('click', () => toggleDrawer());
  backdrop.addEventListener('click', () => toggleDrawer(false));
  $$('#drawer a').forEach(a => a.addEventListener('click', () => toggleDrawer(false)));
}

/* ===== スクロール進捗バー ===== */
const bar = $('.progress .bar');
if (bar) {
  const onScrollProgress = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
    bar.style.width = (scrolled * 100).toFixed(2) + '%';
  };
  document.addEventListener('scroll', onScrollProgress, {passive:true});
  onScrollProgress();
}

/* ===== ヒーロー・パララックス ===== */
const heroBg = $('.hero-bg');
if (heroBg) {
  let lastY = 0;
  const parallax = () => {
    const y = window.scrollY;
    lastY += (y * 0.12 - lastY) * 0.06;
    heroBg.style.transform = `translate3d(0, ${lastY * 0.15}px, 0) scale(1.02)`;
    requestAnimationFrame(parallax);
  };
  parallax();
}

/* ===== 出現アニメーション ===== */
const appearTargets = $$('[data-animate]');
if (appearTargets.length > 0) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, {threshold: 0.14});
  appearTargets.forEach(t => io.observe(t));
}

/* ===== スクロールスパイ（ナビの現在地ハイライト） ===== */
const sections = ['about','strength','flow','items','faq','contact'].map(id => document.getElementById(id)).filter(Boolean);
const navLinks = $$('.site-nav .nav-link');
if (sections.length > 0 && navLinks.length > 0) {
  const setActive = (id) => {
    navLinks.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === `#${id}` ? 'true' : 'false'));
  };
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        setActive(e.target.id);
      }
    });
  }, {rootMargin:'-40% 0px -55% 0px', threshold: 0});
  sections.forEach(sec => spy.observe(sec));
}

/* ===== 3Dチルト（パフォーマンス軽量版） ===== */
const tiltEls = $$('.tilt');
tiltEls.forEach(card => {
  card.addEventListener('pointermove', (ev) => {
    const r = card.getBoundingClientRect();
    const x = (ev.clientX - r.left) / r.width - .5;
    const y = (ev.clientY - r.top)  / r.height - .5;
    card.style.transform = `rotateX(${(-y*6).toFixed(2)}deg) rotateY(${(x*8).toFixed(2)}deg) translateZ(0)`;
  });
  card.addEventListener('pointerleave', () => card.style.transform = 'translateZ(0)');
});

/* ===== フィルタ（取扱品目） ===== */
const chips = $$('.chip');
const cards = $$('.item-card');
if (chips.length > 0 && cards.length > 0) {
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => {
      c.classList.remove('is-active');
      c.setAttribute('aria-selected', 'false');
    });
    chip.classList.add('is-active');
    chip.setAttribute('aria-selected', 'true');
    const cat = chip.dataset.filter;
    cards.forEach(card => {
      const show = cat === 'all' || card.dataset.cat === cat;
      card.style.display = show ? '' : 'none';
    });
  }));
}

/* ===== フォーム簡易バリデーション ===== */
const form = $('#contact-form');
if (form) {
  const formMsg = $('#form-msg');
  const setErr = (input, msg) => {
    const errorEl = input.parentElement.querySelector('.error');
    if(errorEl) {
      input.setAttribute('aria-invalid','true');
      errorEl.textContent = msg || '';
    }
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    const name = $('#name'), email = $('#email');
    setErr(name); setErr(email);

    if (!name.value.trim()){ setErr(name, 'お名前を入力してください'); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){ setErr(email, 'メールアドレスの形式が正しくありません'); ok = false; }

    if (ok){
      form.reset();
      $$('.error', form).forEach(el => el.textContent = '');
      $$('[aria-invalid]', form).forEach(el => el.removeAttribute('aria-invalid'));
      if (formMsg) formMsg.textContent = '送信しました。担当より24時間以内にご連絡します。';
    } else {
      if (formMsg) formMsg.textContent = '';
    }
  });
}

/* ===== トップへ / モバイルCTA表示切替 ===== */
const toTop = $('.to-top');
const mobileCta = $('.mobile-cta');
if (toTop && mobileCta) {
  const onScrollUI = () => {
    const y = window.scrollY;
    toTop.classList.toggle('is-show', y > 480);
    mobileCta.classList.toggle('is-hide', y < 120);
  };
  document.addEventListener('scroll', onScrollUI, {passive:true});
  toTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
}

/* ===== ハンバーガーのアニメ効果 ===== */
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    const [l1,l2,l3] = hamburger.querySelectorAll('span');
    if (expanded){
      l1.style.transform = 'translateY(10px) rotate(45deg)';
      l2.style.opacity = '0';
      l3.style.transform = 'translateY(-10px) rotate(-45deg)';
    } else {
      l1.style.transform = ''; l2.style.opacity = ''; l3.style.transform = '';
    }
  });
}

/* ===== 数値アニメーション ===== */
const counters = $$('.stats strong');
const heroInner = $('.hero-inner');
if (counters.length > 0 && heroInner) {
  const animateCount = (el) => {
    const target = Number(el.dataset.count || 0);
    let n = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const tick = () => {
      n += step;
      if (n >= target){ el.textContent = target.toLocaleString('ja-JP'); return; }
      el.textContent = n.toLocaleString('ja-JP');
      requestAnimationFrame(tick);
    };
    tick();
  };
  const statObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        counters.forEach(animateCount);
        obs.disconnect();
      }
    });
  }, {threshold: 0.6});
  statObserver.observe(heroInner);
}

/* ===== スムーススクロール（ヘッダー高さ補正） ===== */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (ev) => {
    const id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    ev.preventDefault();
    const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 74;
    const y = window.pageYOffset + el.getBoundingClientRect().top - headerH + 1;
    window.scrollTo({top: y, behavior: 'smooth'});
  });
});
