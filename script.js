(() => {
  'use strict';

  // ===== Mobile nav toggle =====
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const navMenu = document.getElementById('navMenu');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    navMenu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===== Copy-to-clipboard =====
  const toast = document.getElementById('toast');
  let toastTimer;
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-show'), 1800);
  };

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const target = document.getElementById(btn.dataset.copy);
      if (!target) return;
      const text = target.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard');
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); showToast('Copied'); }
        catch { showToast('Copy failed'); }
        document.body.removeChild(ta);
      }
    });
  });

  // ===== Smooth scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ===== Scroll-reveal with stagger =====
  const reveals = document.querySelectorAll('[data-reveal]');
  // Stagger siblings within the same parent
  const groups = new Map();
  reveals.forEach((el) => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, 0);
    const idx = groups.get(parent);
    el.style.setProperty('--reveal-delay', `${Math.min(idx * 0.08, 0.6)}s`);
    groups.set(parent, idx + 1);
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  // ===== Counter animation =====
  const formatNum = (n) => n.toLocaleString('en-US');
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseInt(el.dataset.count, 10);
        const duration = 1800;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = formatNum(Math.floor(end * eased));
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = formatNum(end);
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => cio.observe(el));
  }

  // ===== Memes auto-scroll: duplicate children for seamless loop =====
  const memesTrack = document.getElementById('memesTrack');
  if (memesTrack) {
    Array.from(memesTrack.children).forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      memesTrack.appendChild(clone);
    });
  }

  // ===== Konami easter egg =====
  const konami = ['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'];
  let buf = [];
  window.addEventListener('keydown', (e) => {
    buf.push(e.key.toLowerCase());
    if (buf.length > konami.length) buf.shift();
    if (buf.length === konami.length && buf.every((k, i) => k === konami[i])) {
      document.body.animate(
        [{ filter: 'invert(1) hue-rotate(180deg)' }, { filter: 'none' }],
        { duration: 700, easing: 'ease-out' }
      );
      showToast('Trolled. Welcome to the family.');
      buf = [];
    }
  });
})();
