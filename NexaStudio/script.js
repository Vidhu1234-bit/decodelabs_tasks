/**
 * NexaStudio — script.js
 * Vanilla JavaScript: Mobile-First, No Dependencies
 *
 * Modules:
 *  1. DOM Helpers
 *  2. Sticky Nav + Scroll-based Active Link
 *  3. Hamburger / Mobile Menu
 *  4. Smooth Scroll
 *  5. Typed Hero Headline
 *  6. Scroll Reveal (IntersectionObserver)
 *  7. Animated Count-up Stats
 *  8. Portfolio Filter
 *  9. Contact Form Validation
 * 10. Back To Top Button
 * 11. Footer Year
 * 12. Init
 */

'use strict';

/* ============================================================
   1. DOM HELPERS
============================================================ */

/**
 * Shorthand querySelector
 * @param {string} selector
 * @param {Element|Document} [scope=document]
 * @returns {Element|null}
 */
function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

/**
 * Shorthand querySelectorAll (returns Array)
 * @param {string} selector
 * @param {Element|Document} [scope=document]
 * @returns {Element[]}
 */
function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

/**
 * Add an event listener; returns a cleanup function
 */
function on(target, event, handler, options) {
  target.addEventListener(event, handler, options);
  return () => target.removeEventListener(event, handler, options);
}

/**
 * Clamp a number between min and max
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/* ============================================================
   2. STICKY NAV + ACTIVE LINK HIGHLIGHT
============================================================ */
function initStickyNav() {
  const header   = qs('#site-header');
  const navLinks = qsa('.nav__link');

  if (!header) return;

  // --- Scrolled class (triggers glass blur) ---
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 30);
    highlightActiveLink();
  };

  on(window, 'scroll', onScroll, { passive: true });
  onScroll(); // run on init

  // --- Active link based on scroll position ---
  function highlightActiveLink() {
    const sections = navLinks
      .map(link => link.getAttribute('href')?.replace('#', ''))
      .filter(Boolean)
      .map(id => qs(`#${id}`))
      .filter(Boolean);

    let currentId = '';
    const scrollY = window.scrollY + 120; // offset for nav height

    sections.forEach(section => {
      if (section.offsetTop <= scrollY) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      const matches = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('is-active', matches);
      link.setAttribute('aria-current', matches ? 'page' : 'false');
    });
  }
}

/* ============================================================
   3. HAMBURGER / MOBILE MENU
============================================================ */
function initMobileMenu() {
  const hamburger    = qs('#hamburger-btn');
  const mobileMenu   = qs('#mobile-menu');
  const overlay      = qs('#mobile-overlay');
  const mobileLinks  = qsa('.nav__mobile-link');
  const body         = document.body;

  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden'; // prevent background scroll
    // Focus first link for accessibility
    mobileLinks[0]?.focus();
  }

  function closeMenu() {
    isOpen = false;
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
    hamburger.focus(); // return focus to trigger
  }

  function toggleMenu() {
    isOpen ? closeMenu() : openMenu();
  }

  on(hamburger, 'click', toggleMenu);
  on(overlay, 'click', closeMenu);

  // Close when a mobile link is clicked
  mobileLinks.forEach(link => {
    on(link, 'click', closeMenu);
  });

  // Close on Escape key
  on(document, 'keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  // Trap focus inside mobile menu when open
  on(mobileMenu, 'keydown', (e) => {
    if (!isOpen || e.key !== 'Tab') return;

    const focusableEls = Array.from(
      mobileMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
    ).filter(el => !el.disabled && el.offsetParent !== null);

    if (!focusableEls.length) return;

    const first = focusableEls[0];
    const last  = focusableEls[focusableEls.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

/* ============================================================
   4. SMOOTH SCROLL FOR ALL ANCHOR LINKS
============================================================ */
function initSmoothScroll() {
  const NAV_HEIGHT = 72; // matches --nav-height CSS variable

  on(document, 'click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetEl = qs(targetId);
    if (!targetEl) return;

    e.preventDefault();

    const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    });
  });
}

/* ============================================================
   5. TYPED HERO HEADLINE
============================================================ */
function initTypedText() {
  const target = qs('#typed-text');
  if (!target) return;

  const phrases = [
    'Brands.',
    'Websites.',
    'Campaigns.',
    'Experiences.',
    'The Future.',
  ];

  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;
  let isPaused     = false;

  const TYPE_SPEED   = 90;   // ms per character typed
  const DELETE_SPEED = 45;   // ms per character deleted
  const PAUSE_AFTER  = 1800; // ms pause after fully typed
  const PAUSE_BEFORE = 300;  // ms pause before deleting

  function type() {
    if (isPaused) return;

    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing
      charIndex++;
      target.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === currentPhrase.length) {
        // Fully typed — pause then delete
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          setTimeout(type, PAUSE_BEFORE);
        }, PAUSE_AFTER);
        return;
      }
    } else {
      // Deleting
      charIndex--;
      target.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;
    setTimeout(type, delay);
  }

  // Start with a short delay so the page loads first
  setTimeout(type, 800);
}

/* ============================================================
   6. SCROLL REVEAL (IntersectionObserver)
============================================================ */
function initScrollReveal() {
  const revealEls = qsa('.reveal-up, .reveal-left, .reveal-right');

  if (!revealEls.length) return;

  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.08,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealEls.forEach(el => observer.observe(el));
}

/* ============================================================
   7. ANIMATED COUNT-UP STATS
============================================================ */
function initCountUp() {
  const counters = qsa('[data-count]');
  if (!counters.length) return;

  const duration = 1800; // ms total animation

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const start  = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = clamp(elapsed / duration, 0, 1);
      const easedVal = Math.round(easeOutQuart(progress) * target);

      el.textContent = easedVal;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  // Trigger count-up when stats section enters viewport
  const statsSection = qs('.hero__stats');
  if (!statsSection) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => animateCounter(counter));
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsSection);
}

/* ============================================================
   8. PORTFOLIO FILTER
============================================================ */
function initPortfolioFilter() {
  const filterBtns = qsa('.work__filter');
  const workCards  = qsa('.work-card');

  if (!filterBtns.length || !workCards.length) return;

  filterBtns.forEach(btn => {
    on(btn, 'click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button state & ARIA
      filterBtns.forEach(b => {
        b.classList.toggle('work__filter--active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });

      // Show / hide cards
      workCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';

        if (filter === 'all' || categories.split(' ').includes(filter)) {
          card.classList.remove('is-hidden');
          // Small re-entrance animation
          card.style.animation = 'none';
          // Force reflow
          void card.offsetWidth;
          card.style.animation = '';
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

/* ============================================================
   9. CONTACT FORM VALIDATION
============================================================ */
function initContactForm() {
  const form        = qs('#contact-form');
  const submitBtn   = qs('#submit-btn');
  const successMsg  = qs('#form-success');

  if (!form) return;

  /* --- Validation rules --- */
  const rules = {
    name: {
      el:       () => qs('#name'),
      errorEl:  () => qs('#name-error'),
      groupEl:  () => qs('#group-name'),
      validate(val) {
        if (!val.trim())           return 'Full name is required.';
        if (val.trim().length < 2) return 'Name must be at least 2 characters.';
        return null;
      },
    },
    email: {
      el:       () => qs('#email'),
      errorEl:  () => qs('#email-error'),
      groupEl:  () => qs('#group-email'),
      validate(val) {
        if (!val.trim())          return 'Email address is required.';
        // RFC-5322 simplified
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(val.trim())) return 'Please enter a valid email address.';
        return null;
      },
    },
    subject: {
      el:       () => qs('#subject'),
      errorEl:  () => qs('#subject-error'),
      groupEl:  () => qs('#group-subject'),
      validate(val) {
        if (!val) return 'Please select a service.';
        return null;
      },
    },
    message: {
      el:       () => qs('#message'),
      errorEl:  () => qs('#message-error'),
      groupEl:  () => qs('#group-message'),
      validate(val) {
        if (!val.trim())            return 'A message is required.';
        if (val.trim().length < 15) return 'Message must be at least 15 characters.';
        return null;
      },
    },
  };

  /* --- Show / clear a single field error --- */
  function showError(ruleKey, message) {
    const rule = rules[ruleKey];
    rule.errorEl().textContent = message;
    rule.groupEl().classList.add('has-error');
    rule.el().setAttribute('aria-invalid', 'true');
  }

  function clearError(ruleKey) {
    const rule = rules[ruleKey];
    rule.errorEl().textContent = '';
    rule.groupEl().classList.remove('has-error');
    rule.el().setAttribute('aria-invalid', 'false');
  }

  /* --- Validate a single field --- */
  function validateField(ruleKey) {
    const rule  = rules[ruleKey];
    const value = rule.el().value;
    const error = rule.validate(value);

    if (error) {
      showError(ruleKey, error);
      return false;
    } else {
      clearError(ruleKey);
      return true;
    }
  }

  /* --- Inline validation on blur --- */
  Object.keys(rules).forEach(key => {
    const inputEl = rules[key].el();
    if (!inputEl) return;

    on(inputEl, 'blur', () => validateField(key));

    // Clear error as user types/changes after first blur
    on(inputEl, 'input', () => {
      if (rules[key].groupEl().classList.contains('has-error')) {
        validateField(key);
      }
    });
  });

  /* --- Submit handler --- */
  on(form, 'submit', (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    Object.keys(rules).forEach(key => {
      if (!validateField(key)) isValid = false;
    });

    if (!isValid) {
      // Focus first errored field
      const firstError = qs('.form-group.has-error input, .form-group.has-error select, .form-group.has-error textarea');
      firstError?.focus();
      return;
    }

    // --- Simulate async submission ---
    submitBtn.classList.add('btn--loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      // Success state
      submitBtn.classList.remove('btn--loading');
      submitBtn.disabled = false;

      form.hidden        = true;
      successMsg.hidden  = false;
      successMsg.focus();

      // Reset form for if user comes back
      form.reset();
      Object.keys(rules).forEach(key => clearError(key));
    }, 1800);
  });
}

/* ============================================================
   10. BACK TO TOP BUTTON
============================================================ */
function initBackToTop() {
  const btn = qs('#back-to-top');
  if (!btn) return;

  const SHOW_AFTER = 400; // px scrolled before showing

  on(window, 'scroll', () => {
    if (window.scrollY > SHOW_AFTER) {
      btn.removeAttribute('hidden');
    } else {
      btn.setAttribute('hidden', '');
    }
  }, { passive: true });

  on(btn, 'click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   11. FOOTER YEAR (auto-update copyright)
============================================================ */
function initFooterYear() {
  const yearEl = qs('#footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ============================================================
   12. INIT — Wire everything together
============================================================ */
function init() {
  initStickyNav();
  initMobileMenu();
  initSmoothScroll();
  initTypedText();
  initScrollReveal();
  initCountUp();
  initPortfolioFilter();
  initContactForm();
  initBackToTop();
  initFooterYear();
}

// Run after DOM is fully parsed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
