/* ============================================================
   Palm & Berry — interactions
   loader · staged hero intro · scroll-driven hero · parallax
   leaves · reveals · 3D card tilt
   ============================================================ */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroIn = () => document.documentElement.classList.add('hero-in');

  /* ---------- 1. JUNGLE LOADER ---------- */
  const loader = $('#loader');
  if (loader) {
    // respect reduced-motion: show the fully-grown bamboo instead of the animation
    if (reduce) $$('.ldr-bamboo').forEach((b) => { b.src = 'images/bamboo_grown.png'; });
    document.documentElement.classList.add('loading');
    const start = performance.now();
    const MIN = 2400; // min on-screen time so the animation is enjoyed
    let finished = false;
    const finish = () => {
      if (finished) return; finished = true;
      const wait = Math.max(0, MIN - (performance.now() - start));
      setTimeout(() => {
        loader.classList.add('done');
        document.documentElement.classList.remove('loading');
        heroIn();                       // kick off the staged hero intro
        setTimeout(() => loader.remove(), 1100);
      }, wait);
    };
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish);
    // safety: never hang
    setTimeout(finish, 6000);
  } else {
    heroIn();
  }

  /* ---------- 2. HEADER scrolled state ---------- */
  const header = $('.site-header');
  const onScrollHeader = () => header && header.classList.toggle('scrolled', scrollY > 24);

  /* ---------- 3. SCROLL-DRIVEN HERO ---------- */
  const hero = $('.hero');
  const heroVideo = $('.hero-video');
  const heroCopy = $('.hero-copy');
  const heroScrim = $('.hero-scrim');
  const cue = $('.scroll-cue');
  const floats = $$('.hero-float');
  const decoLeaves = $$('.deco-leaf');
  const byoSection = $('#build');
  const byoTrack = $('.byo-track');
  const byoRail = $('.byo-rail');
  const byoProgress = $('.byo-progress i');

  let mx = 0, my = 0;            // smoothed mouse
  let tmx = 0, tmy = 0;         // target mouse
  if (!reduce) {
    addEventListener('mousemove', (e) => {
      tmx = (e.clientX / innerWidth - 0.5) * 2;
      tmy = (e.clientY / innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  const tick = () => {
    const y = scrollY;

    // hero progress while it is pinned
    if (hero) {
      const total = hero.offsetHeight - innerHeight;
      const p = clamp(y / (total || 1), 0, 1);
      if (heroVideo) heroVideo.style.transform = `scale(${1 + 0.16 * p})`;
      if (heroCopy) {
        heroCopy.style.transform = `translateY(${-90 * p}px)`;
        heroCopy.style.opacity = `${clamp(1 - p * 1.35, 0, 1)}`;
      }
      if (heroScrim) heroScrim.style.opacity = `${1 + p * 0.25}`;
      if (cue) cue.style.opacity = `${clamp(1 - p * 3, 0, 1)}`;
    }

    // mouse parallax on hero floating leaves
    mx = lerp(mx, tmx, 0.06); my = lerp(my, tmy, 0.06);
    floats.forEach((el) => {
      const px = +el.dataset.px || 0, py = +el.dataset.py || 0;
      el.style.transform = `translate3d(${mx * px}px, ${my * py + y * 0.04}px, 0)`;
    });

    // scroll parallax on section deco leaves
    decoLeaves.forEach((el) => {
      const sp = +el.dataset.speed || 0.1;
      const r = el.getBoundingClientRect();
      const off = (r.top + r.height / 2 - innerHeight / 2);
      el.style.transform = `translateY(${-off * sp}px)`;
    });

    // sticky toppings rail — section pins while the strip pans through the
    // fixed-width window, scrubbed by scroll progress through the pinned region
    if (byoSection && byoTrack && byoRail && !reduce) {
      const dist = byoSection.offsetHeight - innerHeight;
      const p = clamp(-byoSection.getBoundingClientRect().top / (dist || 1), 0, 1);
      const maxShift = Math.max(0, byoTrack.scrollWidth - byoRail.clientWidth);
      byoTrack.style.transform = `translateX(${-maxShift * p}px)`;
      if (byoProgress) byoProgress.style.width = `${8 + p * 92}%`;
    }

    onScrollHeader();
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  /* ---------- 4. REVEAL ON SCROLL ---------- */
  const revealSel = '.section-head,.pcard,.scard,.tcard,.gr-card,.greviews-head,.feature,.loc-photo,.loc-info,.loc-map,.ig-block,.ig-grid a,.footer-grid > *';
  $$(revealSel).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--rd', (i % 4) * 70 + 'ms');
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach((el) => io.observe(el));
  } else {
    $$('.reveal').forEach((el) => el.classList.add('in'));
  }

  /* ---------- 5. MOBILE NAV DRAWER ---------- */
  const burger = $('.burger');
  const setNav = (open) => {
    document.body.classList.toggle('nav-open', open);
    burger?.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger?.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü');
  };
  burger?.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
  $('.nav-backdrop')?.addEventListener('click', () => setNav(false));
  $$('.nav-collapse a').forEach((a) => a.addEventListener('click', () => setNav(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

  /* ---------- 6. ensure hero video plays + mobile poster ---------- */
  if (heroVideo) {
    if (matchMedia('(max-width:600px)').matches) heroVideo.poster = 'images/hero_mobile_nb.png';
    const play = () => heroVideo.play?.().catch(() => {});
    heroVideo.muted = true;
    heroVideo.playbackRate = 0.85;   // subtle slow-motion = instant cinema
    play();
    addEventListener('click', play, { once: true });
  }

  /* ---------- 7. 3D TILT on product / signature cards ---------- */
  if (!reduce && matchMedia('(pointer:fine)').matches) {
    $$('.pcard,.scard').forEach((card) => {
      let rafId = 0;
      card.addEventListener('mousemove', (e) => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform =
            `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateY(-6px)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
        card.style.transform = '';
      });
    });
  }
})();
