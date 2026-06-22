/* ═══════════════════════════════════════════════════════
   UnDesigned — script.js
   Sahadat Khan | Brand & Visual Designer
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── EmailJS init ──
  if (typeof emailjs !== 'undefined') {
    emailjs.init("-XJxZKIcbvResZydf");
  }

  // ════════════════════════════════════
  // 1. THEME TOGGLE
  // ════════════════════════════════════
  const html = document.documentElement;

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('ud-theme', theme);
    document.querySelectorAll('.theme-toggle').forEach(toggle => {
      toggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      toggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
    });
  }

  // Init: check saved, else default dark
  const savedTheme = localStorage.getItem('ud-theme') || 'dark';
  applyTheme(savedTheme);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lowCoreCount = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  const lowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;
  const lowPerformanceDevice =
    navigator.connection?.saveData ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
    (lowCoreCount && lowMemory);
  let themeTransitionRunning = false;

  function getRevealGeometry(toggle) {
    const rect = toggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.max(
      Math.hypot(x, y),
      Math.hypot(window.innerWidth - x, y),
      Math.hypot(x, window.innerHeight - y),
      Math.hypot(window.innerWidth - x, window.innerHeight - y)
    );

    html.style.setProperty('--theme-reveal-x', `${x}px`);
    html.style.setProperty('--theme-reveal-y', `${y}px`);
    html.style.setProperty('--theme-reveal-radius', `${Math.ceil(radius)}px`);
  }

  async function fadeToTheme(theme) {
    document.body.classList.add('theme-fade');
    await new Promise(resolve => setTimeout(resolve, 140));
    applyTheme(theme);
    requestAnimationFrame(() => document.body.classList.remove('theme-fade'));
    await new Promise(resolve => setTimeout(resolve, 180));
  }

  async function transitionToTheme(theme, toggle) {
    if (reduceMotion.matches) {
      applyTheme(theme);
      return;
    }

    if (!document.startViewTransition || lowPerformanceDevice) {
      await fadeToTheme(theme);
      return;
    }

    getRevealGeometry(toggle);
    const transition = document.startViewTransition(() => applyTheme(theme));
    await transition.finished;
  }

  document.querySelectorAll('.theme-toggle').forEach(toggle => {
    const toggleTheme = async (event) => {
      event.preventDefault();
      if (themeTransitionRunning) return;

      const current = html.getAttribute('data-theme');
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      themeTransitionRunning = true;
      toggle.disabled = true;

      try {
        await transitionToTheme(nextTheme, toggle);
      } finally {
        themeTransitionRunning = false;
        toggle.disabled = false;
        toggle.focus({ preventScroll: true });
      }
    };

    toggle.addEventListener('click', toggleTheme);
  });

  // ════════════════════════════════════
  // 2. PAGE LOADER
  // ════════════════════════════════════
  const loader = document.getElementById('pageLoader');
  const loaderFill = document.getElementById('loaderFill');

  let progress = 0;
  document.body.style.overflow = 'hidden';

  const fillInterval = setInterval(() => {
    progress += Math.random() * 20;
    if (progress >= 92) { progress = 92; clearInterval(fillInterval); }
    if (loaderFill) loaderFill.style.width = progress + '%';
  }, 70);

  function hideLoader() {
    clearInterval(fillInterval);
    if (loaderFill) loaderFill.style.width = '100%';
    setTimeout(() => {
      if (loader) loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 350);
  }

  window.addEventListener('load', hideLoader);
  // Fallback
  setTimeout(() => { if (loader && !loader.classList.contains('hidden')) hideLoader(); }, 3000);

  // Image skeletons + fade-in
  document.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src') || '';
    const isRaster = /\.(webp|png|jpe?g|gif|avif)$/i.test(src);
    const isUiImage = img.closest('.page-loader, .nav-logo, .hero-big-title, .footer-logo, .social-btn, .lightbox');

    if (!isRaster || isUiImage) return;

    const shell = img.parentElement;
    img.classList.add('image-fade');

    if (shell) shell.classList.add('image-loading');

    const markLoaded = () => {
      img.classList.add('is-loaded');
      if (shell) {
        shell.classList.add('image-loaded');
        setTimeout(() => shell.classList.remove('image-loading'), 400);
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
    } else {
      img.addEventListener('load', markLoaded, { once: true });
      img.addEventListener('error', markLoaded, { once: true });
    }
  });

  // ════════════════════════════════════
  // 3. SCROLL PROGRESS BAR
  // ════════════════════════════════════
  const scrollBar = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    if (!scrollBar) return;
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    scrollBar.style.width = (docH > 0 ? (scrollTop / docH) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // ════════════════════════════════════
  // 4. BACK TO TOP
  // ════════════════════════════════════
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ════════════════════════════════════
  // 5. NAVBAR — fullwidth ↔ island
  // ════════════════════════════════════
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateNavbar() {
    if (!navbar) return;
    const isScrolled = window.scrollY > 80;
    navbar.classList.toggle('island', isScrolled);
    navbar.classList.toggle('fullwidth', !isScrolled);

    // Active link
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });

  // ════════════════════════════════════
  // 6. MOBILE MENU
  // ════════════════════════════════════
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileMenuClose');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-link');

  function openMenu() {
    mobileMenu?.classList.add('open');
    mobileBackdrop?.classList.add('open');
    hamburger?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileMenu?.classList.remove('open');
    mobileBackdrop?.classList.remove('open');
    hamburger?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => mobileMenu?.classList.contains('open') ? closeMenu() : openMenu());
  mobileClose?.addEventListener('click', closeMenu);
  mobileBackdrop?.addEventListener('click', closeMenu);
  mobileNavLinks.forEach(l => l.addEventListener('click', closeMenu));

  // ════════════════════════════════════
  // 7. SMOOTH SCROLL
  // ════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ════════════════════════════════════
  // 8. LIGHTBOX
  // ════════════════════════════════════
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 300);
  }

  document.querySelectorAll('.lightbox-trigger img, .eletech-profile-img').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeLightbox(); closeMenu(); }
  });

  // ════════════════════════════════════
  // 9. SCROLL REVEAL
  // ════════════════════════════════════
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay * 1000);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.delay = (i % 4 * 0.07).toFixed(2);
    revealObs.observe(el);
  });

  // ════════════════════════════════════
  // 10. COUNTER ANIMATION
  // ════════════════════════════════════
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const steps = 55;
    const stepTime = duration / steps;
    let step = 0;

    const ease = t => 1 - Math.pow(1 - t, 3); // ease-out cubic

    const timer = setInterval(() => {
      step++;
      const val = Math.round(ease(step / steps) * target);
      el.textContent = val + suffix;
      if (step >= steps) {
        clearInterval(timer);
        el.textContent = target + suffix;
      }
    }, stepTime);
  }

  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.about-stat-number').forEach(animateCounter);
        statsObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  const aboutStats = document.querySelector('.about-stats');
  if (aboutStats) statsObs.observe(aboutStats);

  // ════════════════════════════════════
  // 11. FAQ — hover (desktop) + click (mobile/touch)
  // ════════════════════════════════════
  const faqItems = document.querySelectorAll('.faq-item');
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');

    if (isTouchDevice) {
      // Touch: click toggles open
      btn?.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open')); // close others
        if (!isOpen) item.classList.add('open');
      });
    }
    // Desktop: CSS :hover handles it — JS adds .open for click toggle as bonus
    btn?.addEventListener('click', () => {
      if (!isTouchDevice) {
        item.classList.toggle('open');
      }
    });
  });

  // ════════════════════════════════════
  // 12. SERVICES — hover (desktop) + click (mobile)
  // ════════════════════════════════════
  const serviceCards = document.querySelectorAll('.service-card');

  if (isTouchDevice) {
    serviceCards.forEach(card => {
      const header = card.querySelector('.service-header');
      header?.addEventListener('click', () => {
        const isOpen = card.classList.contains('expanded');
        serviceCards.forEach(c => c.classList.remove('expanded'));
        if (!isOpen) card.classList.add('expanded');
      });
    });
  }

  // ════════════════════════════════════
  // 13. CONTACT FORM TOGGLE
  // ════════════════════════════════════
  const formTrigger = document.getElementById('formTrigger');
  const formWrap = document.getElementById('contactFormWrap');
  let formOpen = false;

  if (formTrigger && formWrap) {
    formTrigger.addEventListener('click', () => {
      formOpen = !formOpen;
      formWrap.classList.toggle('open', formOpen);
      formTrigger.setAttribute('aria-expanded', String(formOpen));
      formTrigger.setAttribute('aria-label', formOpen ? 'Close Project Form' : 'Open Project Form');
      const triggerLabel = formTrigger.querySelector('.contact-primary-label');
      if (triggerLabel) triggerLabel.textContent = formOpen ? 'Close Project Form' : 'Send Project Details';
      if (formOpen) {
        setTimeout(() => formWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 200);
      }
    });
  }

  const copyEmail = document.getElementById('copyEmail');
  const emailCopyStatus = document.getElementById('emailCopyStatus');
  let copyFeedbackTimer;

  copyEmail?.addEventListener('click', async () => {
    const email = copyEmail.dataset.email;
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      const hint = copyEmail.querySelector('.contact-email-hint');
      if (hint) hint.textContent = 'Copied to clipboard';
      if (emailCopyStatus) emailCopyStatus.textContent = `${email} copied to clipboard`;
      copyEmail.classList.add('is-copied');

      clearTimeout(copyFeedbackTimer);
      copyFeedbackTimer = setTimeout(() => {
        if (hint) hint.textContent = 'Click to copy';
        copyEmail.classList.remove('is-copied');
      }, 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });

  // ════════════════════════════════════
  // 14. EMAILJS FORM SUBMIT
  // ════════════════════════════════════
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('formSubmitBtn');
  const successMsg = document.getElementById('formSuccess');
  const errorMsg = document.getElementById('formError');

  if (contactForm && typeof emailjs !== 'undefined') {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (submitBtn) { submitBtn.textContent = 'Sending...'; submitBtn.disabled = true; }
      if (successMsg) successMsg.style.display = 'none';
      if (errorMsg) errorMsg.style.display = 'none';

      emailjs.sendForm('service_sgt1ygl', 'template_6b3vq08', this)
        .then(() => {
          if (successMsg) successMsg.style.display = 'block';
          contactForm.reset();
          if (submitBtn) {
            submitBtn.innerHTML = 'Send Message <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            submitBtn.disabled = false;
          }
        })
        .catch(err => {
          console.error('EmailJS error:', err);
          if (errorMsg) errorMsg.style.display = 'block';
          if (submitBtn) {
            submitBtn.innerHTML = 'Send Message <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            submitBtn.disabled = false;
          }
        });
    });
  }

  // ════════════════════════════════════
  // 15. CALENDLY PLACEHOLDER CHECK
  // ════════════════════════════════════
  const calendlyBtn = document.getElementById('calendlyBtn');
  if (calendlyBtn) {
    const link = calendlyBtn.getAttribute('href');
    if (!link || link === 'YOUR_CALENDLY_LINK') {
      calendlyBtn.addEventListener('click', e => {
        e.preventDefault();
        // Silently do nothing until link is set
        // You can add: alert('Booking coming soon!')
      });
      calendlyBtn.style.opacity = '0.6';
      calendlyBtn.title = 'Booking link coming soon';
    }
  }

});
