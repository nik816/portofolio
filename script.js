/* ==========================================================================
   Portofolio — Niko Afriyanto
   Isi: 1 Util  2 Sapaan & foto  3 Navbar  4 Hero  5 About  6 Reveal
        7 Proyek (filter + galeri VELLORA)  8 Kontak  9 Efek halus (tilt, spotlight, latar)
   ========================================================================== */
(() => {
  window.__niko = true;

  /* 1. UTIL ---------------------------------------------------------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const HAS_IO = 'IntersectionObserver' in window;

  /* Satu pengelola animasi untuk semua canvas (otomatis berhenti saat tab tersembunyi) */
  const tasks = [];
  let raf = 0;
  const tick = () => { raf = 0; if (document.hidden) return; for (const f of tasks) f(); raf = requestAnimationFrame(tick); };
  const addTask = f => { tasks.push(f); if (!raf && !document.hidden) raf = requestAnimationFrame(tick); };
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !raf && tasks.length) raf = requestAnimationFrame(tick); });

  /* Posisi kursor (dipakai latar jaringan dan kursor kustom) */
  let mx = -9999, my = -9999;

  /* 1b. BOOT: layar loading singkat (~1 detik), bisa dilewati dengan klik/tombol ------ */
  const boot = $('#boot');
  const root = document.documentElement;
  if (boot) {
    if (RM) { boot.remove(); root.classList.remove('booting'); }
    else {
      const lc = $('#boot-canvas'), lx = lc.getContext('2d'), flash = $('#boot-flash');
      const bar = $('#boot-bar'), txt = $('#boot-text');
      let LW = 0, LH = 0;
      const size = () => { LW = lc.width = innerWidth; LH = lc.height = innerHeight; };
      size();
      /* Cabang petir: sedikit cabang, warna biru, tanpa guncangan layar */
      const build = (x, y, tx, ty, d, out) => {
        const pts = [[x, y]], n = 11;
        for (let i = 1; i <= n; i++) {
          const t = i / n, nx = x + (tx - x) * t + (Math.random() - .5) * (d ? 50 : 70), ny = y + (ty - y) * t;
          pts.push([nx, ny]);
          if (d < 1 && Math.random() < .2) build(nx, ny, nx + (Math.random() - .5) * 280, ny + 70 + Math.random() * 200, d + 1, out);
        }
        out.push({ pts, d });
      };
      const strike = big => {
        const n = big ? 3 : 1;
        for (let k = 0; k < n; k++) {
          const out = [], x = Math.random() * LW;
          build(x, -10, x + (Math.random() - .5) * 360, LH * (.45 + Math.random() * .5), 0, out);
          for (const b of out) {
            lx.beginPath();
            b.pts.forEach((q, i) => i ? lx.lineTo(q[0], q[1]) : lx.moveTo(q[0], q[1]));
            lx.lineJoin = 'round';
            lx.shadowColor = '#3D7BFF'; lx.shadowBlur = big ? 30 : 20;
            lx.strokeStyle = '#6EA0FF'; lx.lineWidth = b.d ? 2 : (big ? 4.5 : 3.5); lx.stroke();
            lx.shadowBlur = 0; lx.strokeStyle = '#E6EEFF'; lx.lineWidth = b.d ? .8 : 1.6; lx.stroke();
          }
        }
        flash.animate([{ opacity: big ? .4 : .18 }, { opacity: 0 }], { duration: big ? 520 : 260 });
      };
      const T0 = performance.now(), DUR = 750;
      let fin = false;
      const finish = () => {
        if (fin) return;
        fin = true;
        strike(true);
        setTimeout(() => { boot.classList.add('done'); root.classList.remove('booting'); }, 170);
        setTimeout(() => boot.remove(), 900);
      };
      const frame = now => {
        if (fin || !boot.isConnected) return;
        lx.shadowBlur = 0; lx.fillStyle = 'rgba(2,4,12,.14)'; lx.fillRect(0, 0, LW, LH);
        const e = now - T0, k = Math.min(1, e / DUR), p = Math.round((1 - Math.pow(1 - k, 2)) * 100);
        bar.style.width = p + '%';
        txt.textContent = 'BOOTING PORTFOLIO... ' + p + '%';
        if (p >= 100 && (document.readyState === 'complete' || e >= 1300)) return finish();
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
      setTimeout(() => { if (!fin) strike(false); }, 140);
      setTimeout(() => { if (!fin) strike(false); }, 430);
      setTimeout(finish, 1500);                       // batas maksimal
      boot.addEventListener('click', finish);         // lewati
      addEventListener('keydown', finish, { once: true });
    }
  }

  /* 2. SAPAAN & FOTO ------------------------------------------------------- */
  const hour = new Date().getHours();
  $('#greet').textContent =
    hour >= 5 && hour < 11 ? 'Selamat pagi' :
    hour >= 11 && hour < 15 ? 'Selamat siang' :
    hour >= 15 && hour < 18 ? 'Selamat sore' : 'Selamat malam';

  const photo = $('#portrait-photo');
  const photoImg = photo && $('img', photo);
  if (photoImg) {
    const showFallback = () => photo.classList.add('nop');
    photoImg.addEventListener('error', showFallback);
    if (photoImg.complete && !photoImg.naturalWidth) showFallback();
  }

  /* 3. NAVBAR -------------------------------------------------------------- */
  const menuBtn = $('#menu-btn');
  const menu = $('#mobile-menu');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  };
  menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
  });
  document.addEventListener('click', e => {
    if (menu.classList.contains('open') && !e.target.closest('.site-header')) setMenu(false);
  });
  matchMedia('(min-width: 800px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* Bar progres scroll */
  const progress = $('#progress');
  let progressQueued = false;
  const updateProgress = () => {
    progressQueued = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  };
  addEventListener('scroll', () => {
    if (!progressQueued) { progressQueued = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  updateProgress();

  /* Tandai section yang sedang dilihat */
  if (HAS_IO) {
    const links = $$('.nav-links a, .mobile-menu a');
    const spy = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => {
        const on = a.getAttribute('href') === '#' + e.target.id;
        a.classList.toggle('active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }), { rootMargin: '-45% 0px -50% 0px' });
    ['home', 'about', 'skills', 'exp', 'works', 'contact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* 4. HERO ---------------------------------------------------------------- */
  const words = ['HTML', 'CSS', 'JAVASCRIPT', 'PHP', 'LARAVEL', 'MYSQL', 'GIT', 'FIGMA', 'UI/UX', 'TRADING'];
  const row = words.map(w => `<span>${w}</span>`).join('');
  $('#marquee').innerHTML = row + row + row + row;

  /* Teks peran yang diketik (statis jika reduced motion) */
  const roles = ['Siswa PPLG', 'Pemula web developer', 'Belajar UI/UX', 'Menjelajah Laravel'];
  const roleEl = $('#role');
  if (!RM) {
    let ri = 0, ci = roles[0].length, deleting = true;
    const step = () => {
      const w = roles[ri];
      roleEl.textContent = w.slice(0, ci);
      if (!deleting && ci === w.length) { deleting = true; return setTimeout(step, 1600); }
      if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      ci += deleting ? -1 : 1;
      setTimeout(step, deleting ? 35 : 70);
    };
    setTimeout(step, 2200);
  }

  /* 5. ABOUT: terminal + statistik ----------------------------------------- */
  const termLines = [
    ['$ whoami', 'k'],
    ['Niko Afriyanto, siswa PPLG', 'o'],
    ['$ cat sekolah.txt', 'k'],
    ["SMK Ma'arif Walisongo Kajoran", 'o'],
    ['$ cat fokus.txt', 'k'],
    ['HTML, CSS, JavaScript, PHP, Laravel, MySQL, dasar UI/UX (Figma)', 'o'],
    ['$ cat cara-belajar.txt', 'k'],
    ['Praktik langsung: belajar, coba di proyek kecil, catat di GitHub.', 'o'],
    ['$ cat hobi.txt', 'k'],
    ['Bola voli, dan trading sebagai minat tambahan.', 'o']
  ];
  const termBody = $('#terminal-body');
  let termStarted = false;
  const fillTerminal = () => {
    termBody.innerHTML = termLines.map(([, c]) => `<div class="${c}"></div>`).join('');
    $$('div', termBody).forEach((d, i) => { d.textContent = termLines[i][0]; });
  };
  /* Pesan tinggi terminal sejak awal (isi penuh diukur lalu dikosongkan),
     supaya halaman tidak melompat dan anchor tidak meleset saat teks diketik. */
  const reserveTerminal = () => {
    fillTerminal();
    termBody.style.minHeight = '';
    termBody.style.minHeight = termBody.offsetHeight + 'px';
    if (!RM) termBody.textContent = '';
  };
  reserveTerminal();
  let lastTermW = innerWidth;
  addEventListener('resize', () => {
    if (termStarted || innerWidth === lastTermW) return;
    lastTermW = innerWidth;
    reserveTerminal();
  });
  const runTerminal = () => {
    if (termStarted) return;
    termStarted = true;
    if (RM) return;   // reduced motion: isi sudah tampil penuh
    termBody.textContent = '';
    let i = 0, j = 0, line = null;
    const type = () => {
      if (i >= termLines.length) return;
      const [text, cls] = termLines[i];
      if (!line) { line = document.createElement('div'); line.className = cls; termBody.append(line); }
      if (j < text.length) {
        line.textContent = text.slice(0, ++j);
        setTimeout(type, cls === 'k' ? 40 : 14);
      } else { i++; j = 0; line = null; setTimeout(type, 250); }
    };
    type();
  };

  const animateCount = el => {
    const target = +el.dataset.count;
    if (RM) { el.textContent = target; return; }
    const t0 = performance.now(), dur = 900;
    const tick = now => {
      const k = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* 6. SCROLL REVEAL ------------------------------------------------------- */
  const onReveal = el => {
    $$('[data-width]', el).forEach(b => { b.style.width = b.dataset.width + '%'; });
    $$('[data-count]', el).forEach(animateCount);
    if (el.id === 'terminal' || $('#terminal', el)) runTerminal();
  };
  const reveals = $$('.reveal');
  if (HAS_IO) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('in');
      onReveal(el);
      io.unobserve(el);
      // Setelah selesai, lepas kelas reveal agar transisi hover kartu normal kembali.
      setTimeout(() => { el.classList.remove('reveal', 'in'); el.style.transitionDelay = ''; }, 1000);
    }), { threshold: 0.12 });
    reveals.forEach(el => {
      const idx = [...el.parentElement.children].indexOf(el);
      el.style.transitionDelay = (idx % 3) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(el => { el.classList.add('in'); onReveal(el); });
  }

  /* 7. PROYEK -------------------------------------------------------------- */
  /* Filter */
  const filterBtns = $$('.filter');
  const projectCards = $$('.project');
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => { b.classList.remove('on'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('on');
    btn.setAttribute('aria-pressed', 'true');
    const f = btn.dataset.filter;
    projectCards.forEach(c => {
      const categories = (c.dataset.category || '').split(/\s+/);
      c.hidden = f !== 'all' && !categories.includes(f);
    });
  }));

  /* Galeri VELLORA: hanya screenshot yang benar-benar ada yang ditampilkan.
     Dimuat saat section mendekati layar, bukan saat halaman dibuka. */
  const gallery = $('#vellora-shots');
  const initGallery = () => {
    let shots = [];
    try { shots = JSON.parse(gallery.dataset.shots).map(([src, label]) => ({ src, label })); } catch (e) { /* data rusak */ }
    const mainImg = $('img', gallery);
    const link = $('.shot-link', gallery);
    const thumbs = $('#vellora-thumbs');
    const ok = [];
    let done = 0;

    const show = s => {
      mainImg.src = s.src;
      link.href = s.src;
      link.setAttribute('aria-label', 'Buka screenshot ' + s.label + ' ukuran penuh di tab baru');
      mainImg.alt = 'Tampilan ' + s.label + ' website VELLORA';
      $$('button', thumbs).forEach(b => {
        const on = b.dataset.src === s.src;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on);
      });
    };
    const finish = () => {
      if (++done < shots.length) return;
      const list = ok.filter(Boolean);
      if (!list.length) { gallery.classList.add('nop'); return; }
      if (list.length > 1) {
        thumbs.hidden = false;
        list.forEach(s => {
          const b = document.createElement('button');
          b.type = 'button';
          b.dataset.src = s.src;
          b.setAttribute('aria-label', 'Lihat tampilan ' + s.label);
          b.setAttribute('aria-pressed', 'false');
          const box = document.createElement('span');
          box.className = 'thumb-img';
          const img = document.createElement('img');
          img.src = s.src; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
          box.append(img);
          const cap = document.createElement('span');
          cap.className = 'thumb-cap mono';
          cap.textContent = s.label;
          b.append(box, cap);
          b.addEventListener('click', () => show(s));
          thumbs.append(b);
        });
      }
      show(list[0]);
    };
    if (!shots.length) { gallery.classList.add('nop'); return; }
    shots.forEach((s, i) => {
      const probe = new Image();
      probe.onload = () => { ok[i] = s; finish(); };
      probe.onerror = finish;
      probe.src = s.src;
    });
  };
  if (gallery) {
    if (HAS_IO) {
      const go = new IntersectionObserver(es => {
        if (es[0].isIntersecting) { go.disconnect(); initGallery(); }
      }, { rootMargin: '800px 0px' });
      go.observe(gallery);
    } else initGallery();
  }

  /* 8. KONTAK: salin email ------------------------------------------------- */
  const copyBtn = $('#copy-email');
  const copyStatus = $('#copy-status');
  const copyText = async text => {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* coba cara lama */ }
    try {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.append(ta); ta.select();
      const okCopy = document.execCommand('copy');
      ta.remove();
      return okCopy;
    } catch (e) { return false; }
  };
  copyBtn.addEventListener('click', async () => {
    const ok = await copyText($('#email-text').textContent.trim());
    copyBtn.textContent = ok ? 'Tersalin' : 'Gagal menyalin';
    copyStatus.textContent = ok ? 'Email berhasil disalin' : 'Email gagal disalin, silakan salin manual';
    setTimeout(() => { copyBtn.textContent = 'Salin'; copyStatus.textContent = ''; }, 1800);
  });

  /* 9. EFEK HALUS ---------------------------------------------------------- */
  if (FINE && !RM) {
    /* Sorotan cahaya mengikuti kursor pada kartu */
    $$('.card').forEach(card => card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    }));
    /* Potret miring tipis mengikuti kursor */
    const tilt = $('[data-tilt]');
    const zone = tilt && tilt.parentElement;
    if (zone) {
      zone.addEventListener('pointermove', e => {
        const r = zone.getBoundingClientRect();
        const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
        tilt.style.transform = `perspective(900px) rotateY(${(x - .5) * 7}deg) rotateX(${(.5 - y) * 7}deg)`;
      });
      zone.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
    }
  }

  /* Latar jaringan titik: ringan, dijeda saat tab tersembunyi, statis jika reduced motion */
  const cv = $('#bg');
  if (cv && cv.getContext) {
    const ctx = cv.getContext('2d');
    const DPR = Math.min(devicePixelRatio || 1, 1.5);
    let W = 0, H = 0, nodes = [], raf = 0;
    const build = () => {
      W = innerWidth; H = innerHeight;
      cv.width = W * DPR; cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const n = W < 700 ? 18 : 34;
      nodes = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
        violet: i % 4 === 0
      }));
    };
    const draw = move => {
      ctx.clearRect(0, 0, W, H);
      for (const p of nodes) {
        if (move) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        }
        ctx.fillStyle = p.violet ? 'rgba(139,92,246,.55)' : 'rgba(110,160,255,.55)';
        ctx.fillRect(p.x, p.y, 2, 2);
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(110,160,255,${.14 * (1 - d / 130)})`;
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
          }
        }
      }
    };
    const loop = () => { raf = 0; if (document.hidden) return; draw(true); raf = requestAnimationFrame(loop); };
    build();
    if (RM) draw(false);
    else {
      loop();
      document.addEventListener('visibilitychange', () => { if (!document.hidden && !raf) raf = requestAnimationFrame(loop); });
    }
    let lastW = innerWidth, resizeTimer = 0;
    addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (innerWidth === lastW) return;   // abaikan perubahan tinggi (bar alamat mobile)
        lastW = innerWidth; build(); if (RM) draw(false);
      }, 200);
    });
  }
})();
