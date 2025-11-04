/**
 * Entry point for client-side interactions.
 * Use this file to initialize components and bind event listeners.
 */

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('[data-js="nav-toggle"]');
  const navMenu = document.querySelector('[data-js="nav-menu"]');
  const navOverlay = document.querySelector('[data-js="nav-overlay"]');
  const body = document.body;
  const desktopQuery = window.matchMedia('(min-width: 48rem)');
  const reduceMotionQuery = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  const reduceMotion = reduceMotionQuery ? reduceMotionQuery.matches : false;
  const header = document.querySelector('.site-header');

  /**
   * Keep the navigation menu's aria-hidden attribute in sync with its visual state.
   * On desktop widths the menu is always visible, so we remove the attribute entirely.
   *
   * @param {boolean} isOpen - Whether the mobile navigation is currently expanded.
   */
  const syncMenuAria = (isOpen) => {
    if (!navMenu) return;
    if (desktopQuery.matches) {
      navMenu.removeAttribute('aria-hidden');
    } else {
      navMenu.setAttribute('aria-hidden', String(!isOpen));
    }
  };

  /**
   * Toggle the primary navigation drawer and supporting UI affordances.
   * Accepts an optional boolean to force a particular state (e.g. close on Escape).
   *
   * @param {boolean} [forceState]
   */
  const toggleNav = (forceState) => {
    if (!navMenu || !navToggle) return;
    const isOpen = typeof forceState === 'boolean'
      ? forceState
      : !navMenu.classList.contains('site-nav__menu--open');

    navMenu.classList.toggle('site-nav__menu--open', isOpen);
    navOverlay?.classList.toggle('is-active', isOpen);
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    body.classList.toggle('is-lock-scroll', isOpen);
    syncMenuAria(isOpen);
  };

  /**
   * Restore the mobile navigation to its default closed state.
   * Used when the viewport switches to desktop layouts or when closing the overlay.
   */
  const resetNavState = () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('site-nav__menu--open');
    navOverlay?.classList.remove('is-active');
    navToggle.classList.remove('is-active');
    body.classList.remove('is-lock-scroll');
    navToggle.setAttribute('aria-expanded', 'false');
    syncMenuAria(false);
  };

  navToggle?.addEventListener('click', () => toggleNav());
  navOverlay?.addEventListener('click', () => toggleNav(false));

  navMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggleNav(false));
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      toggleNav(false);
    }
  });

  /**
   * Keep the navigation accessible when breakpoints change by clearing
   * residual mobile-only state that could hide the desktop menu.
   */
  const handleViewportChange = () => {
    if (desktopQuery.matches) {
      resetNavState();
    } else {
      syncMenuAria(false);
    }
  };

  if (typeof desktopQuery.addEventListener === 'function') {
    desktopQuery.addEventListener('change', handleViewportChange);
  } else if (typeof desktopQuery.addListener === 'function') {
    desktopQuery.addListener(handleViewportChange);
  }

  handleViewportChange();

  let lastScrollY = window.scrollY;
  let isTicking = false;

  /**
   * Apply header styling updates based on scroll position.
   * Adds a subtle elevation and hides the bar while scrolling down on larger screens.
   */
  const updateHeaderOnScroll = () => {
    if (!header) {
      isTicking = false;
      return;
    }

    const currentScrollY = window.scrollY;
    const isScrolled = currentScrollY > 16;
    const isScrollingDown = currentScrollY > lastScrollY;
    const shouldHide = !reduceMotion && isScrollingDown && currentScrollY > 120;

    header.classList.toggle('site-header--scrolled', isScrolled);
    if (shouldHide) {
      header.classList.add('site-header--hidden');
    } else {
      header.classList.remove('site-header--hidden');
    }

    if (currentScrollY <= 0) {
      header.classList.remove('site-header--hidden');
    }

    lastScrollY = currentScrollY;
    isTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      isTicking = true;
      window.requestAnimationFrame(updateHeaderOnScroll);
    }
  }, { passive: true });

  updateHeaderOnScroll();

  // Intersection Observer powered entrance animations with a reduce-motion fallback.
  const animatedElements = Array.from(document.querySelectorAll('[data-animate]'));
  if (animatedElements.length) {
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            currentObserver.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1,
      });

      animatedElements.forEach((element) => observer.observe(element));
    } else {
      animatedElements.forEach((element) => element.classList.add('is-visible'));
    }
  }

  /**
   * Progressive enhancement carousel tailored for the testimonials section.
   * Uses translateX transforms instead of manipulating scroll for smoother performance.
   */
  class TestimonialsCarousel {
    constructor(root) {
      this.root = root;
      this.track = root.querySelector('[data-js="carousel-track"]');
      this.slides = Array.from(root.querySelectorAll('[data-js="carousel-slide"]'));
      this.prevButton = root.querySelector('[data-js="carousel-prev"]');
      this.nextButton = root.querySelector('[data-js="carousel-next"]');
      this.dotsWrapper = root.querySelector('[data-js="carousel-dots"]');
      this.dots = [];
      this.currentPage = 0;
      this.slidesPerView = 1;
      this.breakpoints = [
        { query: '(min-width: 64rem)', slides: 3 },
        { query: '(min-width: 48rem)', slides: 2 },
      ];
      this.handleResize = this.handleResize.bind(this);
      this.init();
    }

    /**
     * Initialize DOM references, create pagination dots, bind listeners, and paint the first view.
     */
    init() {
      if (!this.track || this.slides.length === 0) return;
      this.slidesPerView = this.getSlidesPerView();
      this.createDots();
      this.bindEvents();
      this.update();
    }

    /**
     * Determine how many testimonial slides should be visible per viewport size.
     *
     * @returns {number}
     */
    getSlidesPerView() {
      const matchedBreakpoint = this.breakpoints.find((breakpoint) => window.matchMedia(breakpoint.query).matches);
      return matchedBreakpoint ? matchedBreakpoint.slides : 1;
    }

    /**
     * Calculate the total number of carousel "pages" based on slides per view.
     *
     * @returns {number}
     */
    getPageCount() {
      return Math.ceil(this.slides.length / this.slidesPerView);
    }

    /** Attach click, resize, and breakpoint listeners for carousel controls. */
    bindEvents() {
      this.prevButton?.addEventListener('click', () => this.move(-1));
      this.nextButton?.addEventListener('click', () => this.move(1));
      window.addEventListener('resize', this.handleResize);

      this.breakpoints.forEach((breakpoint) => {
        const mq = window.matchMedia(breakpoint.query);
        const listener = () => {
          this.updateSlidesPerView();
          this.update();
        };

        if (typeof mq.addEventListener === 'function') {
          mq.addEventListener('change', listener);
        } else if (typeof mq.addListener === 'function') {
          mq.addListener(listener);
        }
      });
    }

    /** Debounce expensive updates so layout recalculations occur in a rAF tick. */
    handleResize() {
      window.requestAnimationFrame(() => {
        this.updateSlidesPerView();
        this.update();
      });
    }

    /**
     * Refresh slidesPerView when breakpoints change and rebuild pagination if necessary.
     */
    updateSlidesPerView() {
      const nextValue = this.getSlidesPerView();
      if (nextValue === this.slidesPerView) return;
      this.slidesPerView = nextValue;
      this.createDots();
      this.update();
    }

    /** Build accessible pagination dots tied to the current number of pages. */
    createDots() {
      if (!this.dotsWrapper) return;
      const pageCount = this.getPageCount();
      this.currentPage = Math.min(this.currentPage, Math.max(0, pageCount - 1));
      this.dotsWrapper.innerHTML = '';
      this.dots = [];

      for (let index = 0; index < pageCount; index += 1) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'carousel__dot';
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-label', `Show testimonial ${index + 1}`);
        button.addEventListener('click', () => {
          this.currentPage = index;
          this.update();
        });
        this.dotsWrapper.appendChild(button);
        this.dots.push(button);
      }
    }

    /**
     * Advance the carousel forward or backward by one page and update the UI.
     *
     * @param {number} direction - Typically -1 for previous or 1 for next.
     */
    move(direction) {
      const pageCount = this.getPageCount();
      if (pageCount <= 1) {
        this.update();
        return;
      }

      this.currentPage = Math.min(Math.max(this.currentPage + direction, 0), pageCount - 1);
      this.update();
    }

    /**
     * Synchronize button disabled states and aria-selected attributes for dots.
     *
     * @param {number} pageCount
     */
    updateControls(pageCount) {
      if (this.prevButton) {
        this.prevButton.disabled = this.currentPage <= 0;
      }

      if (this.nextButton) {
        this.nextButton.disabled = this.currentPage >= pageCount - 1;
      }

      if (this.dots.length) {
        this.dots.forEach((dot, index) => {
          dot.setAttribute('aria-selected', index === this.currentPage ? 'true' : 'false');
        });
      }
    }

    /**
     * Core render loop: translate the track to the active page and update controls.
     */
    update() {
      if (!this.track) return;
      const pageCount = this.getPageCount();
      this.currentPage = Math.min(this.currentPage, Math.max(0, pageCount - 1));
      const maxIndex = Math.max(0, this.slides.length - this.slidesPerView);
      const baseIndex = Math.min(this.currentPage * this.slidesPerView, maxIndex);
      const targetSlide = this.slides[baseIndex];
      const offset = targetSlide ? targetSlide.offsetLeft : 0;
      this.track.style.transform = `translateX(-${offset}px)`;
      this.updateControls(pageCount);
    }
  }

  document.querySelectorAll('[data-js="carousel"]').forEach((carousel) => {
    // eslint-disable-next-line no-new
    new TestimonialsCarousel(carousel);
  });

  // Enhanced contact form validation and friendly status messaging.
  const contactForm = document.querySelector('[data-js="contact-form"]');
  if (contactForm) {
    const fields = Array.from(contactForm.querySelectorAll('.form__field'));
    const statusElement = contactForm.querySelector('[data-js="form-status"]');
    const submitButton = contactForm.querySelector('[data-js="form-submit"]');
    const submitDefaultLabel = submitButton?.textContent || 'Submit';

    if (statusElement) {
      statusElement.hidden = true;
    }

    /**
     * Update the form status helper text and styling for success, error, or idle states.
     *
     * @param {('success'|'error'|'loading'|'idle')} type
     * @param {string} message
     */
    const setStatus = (type, message) => {
      if (!statusElement) return;
      statusElement.textContent = message;
      statusElement.classList.remove('form__status--success', 'form__status--error');

      if (!message) {
        statusElement.hidden = true;
        statusElement.removeAttribute('data-status');
        if (typeof statusElement.blur === 'function') {
          statusElement.blur();
        }
        return;
      }

      statusElement.hidden = false;
      statusElement.dataset.status = type;
      if (typeof statusElement.focus === 'function') {
        window.requestAnimationFrame(() => {
          try {
            statusElement.focus({ preventScroll: true });
          } catch (error) {
            statusElement.focus();
          }
        });
      }

      if (type === 'success') {
        statusElement.classList.add('form__status--success');
      } else if (type === 'error') {
        statusElement.classList.add('form__status--error');
      }
    };

    /**
     * Display or clear error messaging for an individual form field.
     *
     * @param {HTMLElement} field
     * @param {string} message
     */
    const setFieldError = (field, message) => {
      const input = field.querySelector('.form__input');
      const errorElement = field.querySelector('[data-js="field-error"]');
      if (!input || !errorElement) return;
      errorElement.textContent = message;
      if (message) {
        input.setAttribute('aria-invalid', 'true');
        errorElement.hidden = false;
      } else {
        input.removeAttribute('aria-invalid');
        errorElement.hidden = true;
      }
    };

    /**
     * Run client-side validation rules for a given field and return an error message, if any.
     *
     * @param {HTMLElement} field
     * @returns {string}
     */
    const validateField = (field) => {
      const input = field.querySelector('.form__input');
      if (!input) return '';
      const value = input.value.trim();
      let message = '';

      if (input.hasAttribute('required') && !value) {
        message = 'Please fill out this field.';
      } else if (input.type === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          message = 'Please enter a valid email address.';
        }
      }

      setFieldError(field, message);
      return message;
    };

    fields.forEach((field) => {
      setFieldError(field, '');
      const input = field.querySelector('.form__input');
      if (!input) return;
      input.addEventListener('input', () => {
        if (statusElement && statusElement.dataset.status !== 'success') {
          setStatus('idle', '');
        }
        validateField(field);
      });
      input.addEventListener('blur', () => {
        validateField(field);
      });
    });

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const invalidFields = fields.filter((field) => validateField(field));

      if (invalidFields.length) {
        setStatus('error', 'Let’s fix the highlighted fields.');
        const firstInvalidInput = invalidFields[0].querySelector('.form__input');
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        return;
      }

      setStatus('loading', 'Sending your message…');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute('aria-busy', 'true');
        submitButton.textContent = 'Sending…';
      }

      window.setTimeout(() => {
        setStatus('success', 'Thanks for reaching out! We’ll reply soon.');
        contactForm.reset();
        fields.forEach((field) => setFieldError(field, ''));
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute('aria-busy');
          submitButton.textContent = submitDefaultLabel;
        }
      }, 1200);
    });
  }

  const yearElement = document.querySelector('[data-js="year"]');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  console.info('Honeybear Bake Shop UI ready.');
});
