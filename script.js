/* ═══════════════════════════════════════
   UnDesigned — script.js
   Sahadat Khan | Brand & Visual Designer
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── EMAILJS INIT ───
  emailjs.init("-XJxZKIcbvResZydf");

  // ═══════════════════════════════════
  // PAGE LOADER
  // ═══════════════════════════════════
  const loader     = document.getElementById('pageLoader');
  const loaderFill = document.getElementById('loaderFill');

  let progress = 0;
  const fillInterval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 95) { progress = 95; clearInterval(fillInterval); }
    loaderFill.style.width = progress + '%';
  }, 80);

  window.addEventListener('load', () => {
    clearInterval(fillInterval);
    loaderFill.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 400);
  });

  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 3000);

  // ═══════════════════════════════════
  // SCROLL PROGRESS BAR
  // ═══════════════════════════════════
  const scrollBar = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // ═══════════════════════════════════
  // BACK TO TOP
  // ═══════════════════════════════════
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ═══════════════════════════════════
  // HAMBURGER + MOBILE MENU
  // ═══════════════════════════════════
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Create backdrop dynamically
  const backdrop = document.createElement('div');
  backdrop.className = 'mobile-menu-backdrop';
  document.body.appendChild(backdrop);

  // Add close button inside menu
  const closeBtn = document.createElement('button');
  closeBtn.className = 'mobile-menu-close';
  closeBtn.innerHTML = '✕';
  closeBtn.setAttribute('aria-label', 'Close menu');
  mobileMenu.appendChild(closeBtn);

  function openMenu() {
    mobileMenu.classList.add('open');
    backdrop.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    backdrop.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  closeBtn.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMenu();
      closeLightbox();
    }
  });

  // ═══════════════════════════════════
  // LIGHTBOX
  // ═══════════════════════════════════
  const lightbox         = document.getElementById('lightbox');
  const lightboxImg      = document.getElementById('lightboxImg');
  const lightboxClose    = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  document.querySelectorAll('.lightbox-trigger img').forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(img.src, img.alt);
    });
  });

  document.querySelectorAll('.eletech-profile-img, .carousel-full-img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);

  // ═══════════════════════════════════
  // CUSTOM CURSOR — desktop only
  // ═══════════════════════════════════
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  // Only run on devices with a fine pointer (mouse)
  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    });

    (function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, .project-section, .service-card, .asset-cell, .lightbox-trigger').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width       = '48px';
        ring.style.height      = '48px';
        ring.style.borderColor = 'rgba(82,99,235,0.8)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width       = '32px';
        ring.style.height      = '32px';
        ring.style.borderColor = 'rgba(82,99,235,0.5)';
      });
    });
  } else {
    // Hide cursor elements on touch devices
    if (dot)  dot.style.display  = 'none';
    if (ring) ring.style.display = 'none';
  }

  // ═══════════════════════════════════
  // NAVBAR — fullwidth → island on scroll
  // ═══════════════════════════════════
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 80) {
      navbar.classList.remove('fullwidth');
      navbar.classList.add('island');
    } else {
      navbar.classList.remove('island');
      navbar.classList.add('fullwidth');
    }
    updateActiveNav();
  }

  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });

  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) current = s.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  // ═══════════════════════════════════
  // SMOOTH SCROLL
  // ═══════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ═══════════════════════════════════
  // SCROLL REVEAL
  // ═══════════════════════════════════
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay * 1000);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  document.querySelectorAll('.project-section').forEach((el, i) => {
    el.dataset.delay = (i * 0.07).toFixed(2);
  });

  // ═══════════════════════════════════
  // COUNTER ANIMATION — analog meter style
  // ═══════════════════════════════════
  function animateCounter(el) {
    const target  = parseInt(el.dataset.target, 10);
    const suffix  = el.dataset.suffix || '';
    const duration = 1800; // ms
    const steps    = 60;
    const stepTime  = duration / steps;
    let current    = 0;

    // Ease out cubic
    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      current = Math.round(easeOut(progress) * target);

      el.textContent = current + suffix;

      // Pulse on each tick — analog meter feel
      el.classList.add('counting');
      setTimeout(() => el.classList.remove('counting'), 80);

      if (step >= steps) {
        clearInterval(timer);
        el.textContent = target + suffix; // ensure exact final value
      }
    }, stepTime);
  }

  // Trigger counter when about section is visible
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.about-stat-number').forEach(el => {
          animateCounter(el);
        });
        statsObserver.unobserve(entry.target); // run only once
      }
    });
  }, { threshold: 0.3 });

  const aboutStats = document.querySelector('.about-stats');
  if (aboutStats) statsObserver.observe(aboutStats);

  // ═══════════════════════════════════
  // CONTACT FORM — hover + click toggle
  // ═══════════════════════════════════
  const formTrigger = document.getElementById('formTrigger');
  const formWrap    = document.getElementById('contactFormWrap');
  let formOpen = false;

  if (formTrigger && formWrap) {
    formTrigger.addEventListener('mouseenter', () => {
      if (!formOpen) formWrap.classList.add('open');
    });
    formTrigger.addEventListener('click', () => {
      formOpen = !formOpen;
      formWrap.classList.toggle('open', formOpen);
      if (formOpen) {
        setTimeout(() => formWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
      }
    });
  }

  // ═══════════════════════════════════
  // EMAILJS FORM SUBMIT
  // ═══════════════════════════════════
  const contactForm = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('formSubmitBtn');
  const successMsg  = document.getElementById('formSuccess');
  const errorMsg    = document.getElementById('formError');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled    = true;
      successMsg.style.display = 'none';
      errorMsg.style.display   = 'none';

      emailjs.sendForm('service_sgt1ygl', 'template_6b3vq08', this)
        .then(() => {
          successMsg.style.display = 'block';
          contactForm.reset();
          submitBtn.innerHTML = 'Send Message <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          submitBtn.disabled  = false;
        })
        .catch(err => {
          console.error('EmailJS error:', err);
          errorMsg.style.display = 'block';
          submitBtn.innerHTML = 'Send Message <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          submitBtn.disabled  = false;
        });
    });
  }

});
