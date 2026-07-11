/* Interactive jungle vines v2 — lush cinematic edition.
   - Vines GROW into view as you scroll (progressive draw with easing)
   - Two depth layers (back = soft/thin, front = bold) for parallax richness
   - Tapered, smoothed ribbon stems with color run dark→light + gloss pass
   - Two-lobed leaves with midrib, gradient fill, cursor-reactive flutter
   - Berry clusters (brand magenta) + small blossoms that pop in
   - Ambient firefly/pollen field (screen-space, twinkling)
   - Verlet physics, cursor repel, viewport culling, DPR cap, pre-settled */
(() => {
  const canvas = document.getElementById('vines');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0, VH = 0, docH = 0, DPR = 1, t = 0, last = 0, scY = 0, raf = 0;
  let vines = [], pollen = [];
  const mouse = { x: -9999, y: -9999, sx: -9999, sy: -9999, active: false };

  const STEM_D = [44, 69, 20], STEM_M = [79, 115, 39], STEM_L = [127, 181, 66];
  const LEAVES = [
    ['#3f651d', '#6fa238'], ['#4c7423', '#8cc153'],
    ['#568127', '#9bcb5f'], ['#446b1e', '#7fb542'],
  ];
  const BERRY = '#9F1951', BERRY_L = '#D33F84', BERRY_D = '#6E0F36';
  const POLLEN_COLS = ['205,236,160', '255,233,168', '246,203,217'];

  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const outCubic = (x) => 1 - Math.pow(1 - x, 3);
  const outBack = (x) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const mixCol = (a, b, f) =>
    `rgb(${(a[0] + (b[0] - a[0]) * f) | 0},${(a[1] + (b[1] - a[1]) * f) | 0},${(a[2] + (b[2] - a[2]) * f) | 0})`;
  const stemCol = (f) => f < 0.5 ? mixCol(STEM_D, STEM_M, f * 2) : mixCol(STEM_M, STEM_L, (f - 0.5) * 2);

  /* ---------------- physics ---------------- */
  function chain(x0, y0, x1, y1, n, slack) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const f = i / (n - 1);
      const x = x0 + (x1 - x0) * f + (i > 0 && i < n - 1 ? Math.sin(f * Math.PI) * rand(-9, 9) : 0);
      const y = y0 + (y1 - y0) * f;
      pts.push({ x, y, ox: x, oy: y, pinned: false });
    }
    return { pts, seg: Math.hypot(x1 - x0, y1 - y0) * slack / (n - 1) };
  }

  function simChain(c, wind, gravScale) {
    const grav = 0.3 * gravScale, fr = 0.95, R = 110, F = 12, n = c.pts.length;
    for (let i = 0; i < n; i++) {
      const p = c.pts[i];
      if (p.pinned) continue;
      const vx = (p.x - p.ox) * fr, vy = (p.y - p.oy) * fr;
      p.ox = p.x; p.oy = p.y;
      p.x += vx; p.y += vy + grav;
      p.x += wind * (i / n);
      if (mouse.active) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < R * R) { const d = Math.sqrt(d2) || 1, f = (R - d) / R * F; p.x += dx / d * f; p.y += dy / d * f; }
      }
    }
    for (let it = 0; it < 8; it++) {
      for (let i = 0; i < n - 1; i++) {
        const a = c.pts[i], b = c.pts[i + 1];
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, df = (c.seg - d) / d * 0.5;
        const ox = dx * df, oy = dy * df;
        if (!a.pinned) { a.x -= ox; a.y -= oy; }
        if (!b.pinned) { b.x += ox; b.y += oy; }
      }
    }
  }

  /* ---------------- build ---------------- */
  function makeVine(py, layer) {
    const front = layer === 1;
    const n = Math.max(12, Math.round(W / (front ? 40 : 52)));
    const c = chain(0, py + rand(-24, 24), W, py + rand(-24, 24), n, 1.05);
    c.pts[0].pinned = true; c.pts[n - 1].pinned = true;

    const tendrils = [];
    const tcount = front ? 5 + (Math.random() * 3 | 0) : 2 + (Math.random() * 2 | 0);
    for (let ti = 0; ti < tcount; ti++) {
      const ai = 2 + Math.floor(Math.random() * (n - 4));
      const len = front ? rand(90, 220) : rand(60, 130);
      const tn = Math.max(6, Math.round(len / 16));
      const tc = chain(c.pts[ai].x, c.pts[ai].y, c.pts[ai].x + rand(-16, 16), c.pts[ai].y + len, tn, 1.04);
      tc.pts[0].pinned = true; tc.anchor = ai; tc.dir = Math.random() < 0.5 ? -1 : 1;
      tc.tipBerry = front && Math.random() < 0.4;
      tendrils.push(tc);
    }

    const leaves = [];
    const lstep = front ? 2 : 3;
    for (let i = 2; i < n - 2; i += lstep + (Math.random() * 2 | 0))
      leaves.push({
        ch: -1, i, side: Math.random() < 0.5 ? -1 : 1,
        size: front ? rand(10, 19) : rand(7, 12),
        cols: LEAVES[Math.random() * LEAVES.length | 0],
        ph: rand(0, 7), sp: rand(0.7, 1.4),
      });
    tendrils.forEach((tc, ti) => {
      for (let i = 1; i < tc.pts.length - 1; i += 2)
        leaves.push({
          ch: ti, i, side: Math.random() < 0.5 ? -1 : 1,
          size: front ? rand(8, 14) : rand(6, 10),
          cols: LEAVES[Math.random() * LEAVES.length | 0],
          ph: rand(0, 7), sp: rand(0.7, 1.4),
        });
    });

    const berries = [], blossoms = [];
    if (front) {
      const bcount = 2 + (Math.random() * 3 | 0);
      for (let b = 0; b < bcount; b++) {
        const i = 3 + Math.floor(Math.random() * (n - 6));
        const cnt = 3 + (Math.random() * 3 | 0), arr = [];
        for (let k = 0; k < cnt; k++)
          arr.push({ a: rand(0, Math.PI * 2), d: rand(3, 10), r: rand(2.6, 4.6), drop: rand(6, 14) });
        berries.push({ i, arr, ph: rand(0, 7) });
      }
      const flcount = 1 + (Math.random() * 2 | 0);
      for (let b = 0; b < flcount; b++)
        blossoms.push({ i: 3 + Math.floor(Math.random() * (n - 6)), size: rand(5.5, 8.5), ph: rand(0, 7) });
    }

    return {
      main: c, tendrils, leaves, berries, blossoms,
      baseY: py, phase: rand(0, 7), wind: rand(0.4, 0.9) * (front ? 1 : 0.6),
      layer, g: 0, started: false, gspeed: rand(0.5, 0.72),
    };
  }

  function build() {
    vines = [];
    W = window.innerWidth; VH = window.innerHeight;
    docH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    const frontYs = [0.22, 0.36, 0.50, 0.64, 0.78, 0.91];
    const backYs = [0.265, 0.415, 0.565, 0.715, 0.865];
    for (const f of backYs) vines.push(makeVine(docH * f, 0));
    for (const f of frontYs) vines.push(makeVine(docH * f, 1));

    // vines already above the current viewport start fully grown
    for (const v of vines)
      if (reduce || v.baseY < scY + VH * 0.8) { v.g = 1; v.started = true; }

    // pre-settle so vines start drooped (no settling pop)
    const ma = mouse.active; mouse.active = false;
    for (let s = 0; s < 60; s++)
      for (const v of vines) {
        simChain(v.main, 0, 1);
        for (const tc of v.tendrils) { const ap = v.main.pts[tc.anchor]; tc.pts[0].x = ap.x; tc.pts[0].y = ap.y; simChain(tc, 0, 1.3); }
      }
    mouse.active = ma;

    // screen-space firefly / pollen field
    pollen = [];
    if (!reduce) {
      const count = W < 600 ? 16 : 38;
      for (let i = 0; i < count; i++)
        pollen.push({
          x: rand(0, W), y: rand(0, VH), r: rand(1.2, 2.9),
          vy: rand(9, 22), sw: rand(0, 7), tw: rand(0, 7),
          col: POLLEN_COLS[Math.random() * POLLEN_COLS.length | 0],
        });
    }
  }

  function resize() {
    DPR = Math.min(1.75, window.devicePixelRatio || 1);
    canvas.width = Math.round(window.innerWidth * DPR);
    canvas.height = Math.round(window.innerHeight * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    build();
  }

  /* ---------------- update ---------------- */
  function update(dt) {
    for (const v of vines) {
      const sy = v.baseY - scY;
      if (!v.started && sy < VH * 0.85 && sy > -VH * 0.5) v.started = true;
      if (v.started && v.g < 1) v.g = Math.min(1, v.g + dt * v.gspeed);
      if (sy < -VH * 1.4 || sy > VH * 2.2) continue;
      const wind = reduce ? 0 : Math.sin(t * 0.0012 + v.phase) * v.wind;
      simChain(v.main, wind, 1);
      for (const tc of v.tendrils) { const ap = v.main.pts[tc.anchor]; tc.pts[0].x = ap.x; tc.pts[0].y = ap.y; simChain(tc, wind * 0.6, 1.3); }
    }
    for (const p of pollen) {
      p.y -= p.vy * dt;
      p.x += Math.sin(t * 0.0006 + p.sw) * 0.25;
      if (mouse.active) {
        const dx = p.x - mouse.sx, dy = p.y - mouse.sy, d2 = dx * dx + dy * dy;
        if (d2 < 8100) { const d = Math.sqrt(d2) || 1, f = (90 - d) / 90 * 1.6; p.x += dx / d * f; p.y += dy / d * f; }
      }
      if (p.y < -12) { p.y = VH + 12; p.x = rand(0, W); }
      if (p.x < -12) p.x = W + 12; else if (p.x > W + 12) p.x = -12;
    }
  }

  /* ---------------- drawing ---------------- */
  function drawChainSmooth(c, wTop, wTip, grow, gloss) {
    const pts = c.pts, n = pts.length;
    const total = (n - 1) * grow;
    const full = Math.floor(total), frac = total - full;
    if (full < 1 && frac <= 0) return;
    const segY = (i) => pts[i].y - scY;
    const lim = Math.min(full, n - 1);
    for (let i = 0; i < lim; i++) {
      const a = pts[i], b = pts[i + 1];
      const f = i / (n - 1);
      ctx.beginPath();
      if (i === 0) ctx.moveTo(a.x, segY(i));
      else ctx.moveTo((pts[i - 1].x + a.x) / 2, (segY(i - 1) + segY(i)) / 2);
      if (i === lim - 1 && frac === 0) ctx.quadraticCurveTo(a.x, segY(i), b.x, segY(i + 1));
      else ctx.quadraticCurveTo(a.x, segY(i), (a.x + b.x) / 2, (segY(i) + segY(i + 1)) / 2);
      ctx.lineWidth = wTop + (wTip - wTop) * f;
      ctx.strokeStyle = stemCol(f);
      ctx.stroke();
      if (gloss) {
        ctx.lineWidth = Math.max(0.5, (wTop + (wTip - wTop) * f) * 0.32);
        ctx.strokeStyle = 'rgba(255,255,255,.13)';
        ctx.stroke();
      }
    }
    // partial tip segment while growing
    if (frac > 0 && full < n - 1) {
      const a = pts[full], b = pts[full + 1];
      ctx.beginPath();
      ctx.moveTo(a.x, segY(full));
      ctx.lineTo(a.x + (b.x - a.x) * frac, segY(full) + (segY(full + 1) - segY(full)) * frac);
      ctx.lineWidth = wTop + (wTip - wTop) * (full / (n - 1));
      ctx.strokeStyle = stemCol(full / (n - 1));
      ctx.stroke();
    }
  }

  function leaf(x, y, ang, size, cols, near) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    const L = size * 2.1, Wd = size * 0.62;
    // blade — two slightly asymmetric lobes
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(L * 0.42, -Wd, L, -L * 0.04);
    ctx.quadraticCurveTo(L * 0.52, Wd * 0.88, 0, 0); ctx.closePath();
    const g = ctx.createLinearGradient(0, 0, L, 0);
    g.addColorStop(0, cols[0]); g.addColorStop(1, cols[1]);
    ctx.fillStyle = g; ctx.fill();
    // midrib vein
    ctx.beginPath(); ctx.moveTo(L * 0.06, 0);
    ctx.quadraticCurveTo(L * 0.5, -Wd * 0.08, L * 0.94, -L * 0.03);
    ctx.lineWidth = 0.9; ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.stroke();
    if (near) { // cursor glow-up
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(L * 0.42, -Wd, L, -L * 0.04);
      ctx.quadraticCurveTo(L * 0.52, Wd * 0.88, 0, 0); ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,.16)'; ctx.fill();
    }
    ctx.restore();
  }

  function berryCluster(x, y, cl, s, sway) {
    if (s <= 0.02) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate(sway); ctx.scale(s, s);
    for (const b of cl.arr) {
      const bx = Math.cos(b.a) * b.d, by = b.drop + Math.sin(b.a) * b.d * 0.5;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(bx, by);
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(60,90,30,.7)'; ctx.stroke();
      const g = ctx.createRadialGradient(bx - b.r * 0.35, by - b.r * 0.35, b.r * 0.1, bx, by, b.r);
      g.addColorStop(0, BERRY_L); g.addColorStop(0.7, BERRY); g.addColorStop(1, BERRY_D);
      ctx.beginPath(); ctx.arc(bx, by, b.r, 0, 7); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(bx - b.r * 0.32, by - b.r * 0.32, b.r * 0.22, 0, 7);
      ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fill();
    }
    ctx.restore();
  }

  function blossom(x, y, size, s, rot) {
    if (s <= 0.02) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    for (let p = 0; p < 5; p++) {
      ctx.save(); ctx.rotate((p / 5) * Math.PI * 2);
      ctx.beginPath(); ctx.ellipse(0, -size * 0.62, size * 0.34, size * 0.66, 0, 0, 7);
      ctx.fillStyle = '#FBE7EE'; ctx.fill();
      ctx.lineWidth = 0.8; ctx.strokeStyle = 'rgba(159,25,77,.25)'; ctx.stroke();
      ctx.restore();
    }
    ctx.beginPath(); ctx.arc(0, 0, size * 0.3, 0, 7);
    ctx.fillStyle = '#E0A93B'; ctx.fill();
    ctx.restore();
  }

  function curl(tip, prev, size, dir) {
    const ang = Math.atan2(tip.y - prev.y, tip.x - prev.x);
    ctx.save(); ctx.translate(tip.x, tip.y - scY); ctx.rotate(ang);
    ctx.beginPath(); ctx.moveTo(0, 0);
    const N = 22, turns = 1.35, cx = size * 0.9;
    for (let i = 1; i <= N; i++) {
      const f = i / N, a = f * turns * Math.PI * 2 * dir, r = size * (1 - f) * 0.9;
      ctx.lineTo(cx + r * Math.cos(a + Math.PI), r * Math.sin(a + Math.PI) * dir);
    }
    ctx.lineWidth = 1.1; ctx.strokeStyle = mixCol(STEM_M, STEM_M, 0); ctx.stroke();
    ctx.restore();
  }

  function drawVine(v) {
    const front = v.layer === 1;
    const ge = outCubic(v.g);
    const n = v.main.pts.length;
    const frontIdx = ge * (n - 1);

    drawChainSmooth(v.main, front ? 3.4 : 2.1, front ? 1.2 : 0.8, ge, front);

    for (const tc of v.tendrils) {
      const tg = clamp((frontIdx - tc.anchor) / 5, 0, 1);
      if (tg <= 0) continue;
      const m = tc.pts.length;
      drawChainSmooth(tc, front ? 1.9 : 1.2, front ? 0.7 : 0.5, tg, false);
      if (tg >= 1) {
        curl(tc.pts[m - 1], tc.pts[m - 2], 9, tc.dir);
        if (tc.tipBerry) {
          const tip = tc.pts[m - 1];
          berryCluster(tip.x, tip.y - scY,
            tc.berryCl || (tc.berryCl = { arr: [{ a: 0.4, d: 4, r: 3.4, drop: 7 }, { a: 2.5, d: 5, r: 2.8, drop: 10 }, { a: 4.4, d: 4, r: 3.0, drop: 12 }] }),
            1, Math.sin(t * 0.001 + tc.anchor) * 0.08);
        }
      }
    }

    for (const lf of v.leaves) {
      const c = lf.ch < 0 ? v.main : v.tendrils[lf.ch];
      const pts = c.pts; if (lf.i >= pts.length - 1) continue;
      let ls;
      if (lf.ch < 0) ls = clamp((frontIdx - lf.i) / 3, 0, 1);
      else {
        const tg = clamp((frontIdx - c.anchor) / 5, 0, 1);
        ls = clamp((tg * (pts.length - 1) - lf.i) / 2.5, 0, 1);
      }
      if (ls <= 0.02) continue;
      const a = pts[lf.i], b = pts[lf.i + 1];
      const sy = a.y - scY;
      const dxm = a.x - mouse.sx, dym = sy - mouse.sy;
      const near = mouse.active && dxm * dxm + dym * dym < 16900;
      const flut = reduce ? 0 : Math.sin(t * 0.0028 * lf.sp + lf.ph) * (near ? 0.22 : 0.09);
      const ang = Math.atan2(b.y - a.y, b.x - a.x) + lf.side * 1.1 + flut;
      const s = outBack(ls);
      leaf(a.x, sy, ang, lf.size * s, lf.cols, near);
    }

    for (const bc of v.berries) {
      const pts = v.main.pts; if (bc.i >= pts.length) continue;
      const s = outBack(clamp((frontIdx - bc.i) / 3.5, 0, 1));
      const p = pts[bc.i];
      berryCluster(p.x, p.y - scY, bc, s, reduce ? 0 : Math.sin(t * 0.0011 + bc.ph) * 0.09);
    }
    for (const fl of v.blossoms) {
      const pts = v.main.pts; if (fl.i >= pts.length) continue;
      const s = outBack(clamp((frontIdx - fl.i) / 3.5, 0, 1));
      const p = pts[fl.i];
      blossom(p.x, p.y - scY, fl.size, s, reduce ? 0 : Math.sin(t * 0.0009 + fl.ph) * 0.15);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, VH);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let pass = 0; pass < 2; pass++) {
      ctx.globalAlpha = pass === 0 ? 0.4 : 0.9;
      for (const v of vines) {
        if (v.layer !== pass) continue;
        const sy = v.baseY - scY;
        if (sy < -VH * 0.7 || sy > VH * 1.5) continue;
        if (v.g <= 0) continue;
        drawVine(v);
      }
    }
    // fireflies / pollen (screen-space)
    for (const p of pollen) {
      const a = 0.22 + 0.4 * Math.abs(Math.sin(t * 0.001 + p.tw));
      ctx.globalAlpha = a;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 2.2, 0, 7);
      ctx.fillStyle = `rgba(${p.col},.25)`; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fillStyle = `rgba(${p.col},.95)`; ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (document.hidden) { last = now; return; }
    scY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now; t = now;
    update(dt); draw();
  }

  const setMouse = (cx, cy) => { mouse.sx = cx; mouse.sy = cy; mouse.x = cx; mouse.y = cy + scY; mouse.active = true; };
  window.addEventListener('mousemove', (e) => setMouse(e.clientX, e.clientY), { passive: true });
  window.addEventListener('mouseout', () => { mouse.active = false; });
  window.addEventListener('touchmove', (e) => { if (e.touches[0]) setMouse(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  window.addEventListener('touchend', () => { mouse.active = false; });
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 200); }, { passive: true });
  window.addEventListener('load', () => setTimeout(resize, 100));

  resize();
  raf = requestAnimationFrame(frame);
})();
