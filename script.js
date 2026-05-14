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

  // ===== Copy-to-clipboard for CA address =====
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
        showToast('✓ Copied to clipboard');
      } catch {
        // Fallback for non-secure contexts
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); showToast('✓ Copied'); }
        catch { showToast('✗ Copy failed'); }
        document.body.removeChild(ta);
      }
    });
  });

  // ===== Smooth scroll for nav anchors (with offset for fixed nav) =====
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

  // ===== Memes rail: drag-to-scroll (desktop) =====
  const rail = document.getElementById('memesRail');
  if (rail) {
    let isDown = false, startX = 0, scrollLeft = 0;
    rail.addEventListener('mousedown', (e) => {
      isDown = true;
      rail.style.cursor = 'grabbing';
      startX = e.pageX - rail.offsetLeft;
      scrollLeft = rail.scrollLeft;
    });
    rail.addEventListener('mouseleave', () => { isDown = false; rail.style.cursor = ''; });
    rail.addEventListener('mouseup', () => { isDown = false; rail.style.cursor = ''; });
    rail.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - rail.offsetLeft;
      rail.scrollLeft = scrollLeft - (x - startX) * 1.2;
    });
  }

  // ===== Konami code easter egg: ↑↑↓↓←→←→BA =====
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let buf = [];
  window.addEventListener('keydown', (e) => {
    buf.push(e.key.toLowerCase());
    if (buf.length > konami.length) buf.shift();
    const match = buf.length === konami.length && buf.every((k, i) => k === konami[i].toLowerCase());
    if (match) {
      document.body.classList.add('flash-trolled');
      showToast('😈 TROLLED! Welcome to the family.');
      setTimeout(() => document.body.classList.remove('flash-trolled'), 700);
      buf = [];
    }
  });
})();
