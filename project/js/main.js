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
  const header = document.querySelector('.site-header');

  const syncMenuAria = (isOpen) => {
    if (!navMenu) return;
    if (desktopQuery.matches) {
      navMenu.removeAttribute('aria-hidden');
    } else {
      navMenu.setAttribute('aria-hidden', String(!isOpen));
    }
  };

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

  const updateHeaderOnScroll = () => {
    if (!header) {
      isTicking = false;
      return;
    }

    const currentScrollY = window.scrollY;
    const isScrolled = currentScrollY > 16;
    const isScrollingDown = currentScrollY > lastScrollY;
    const shouldHide = isScrollingDown && currentScrollY > 120;

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

  const animatedElements = Array.from(document.querySelectorAll('[data-animate]'));
  if (animatedElements.length) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
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

    init() {
      if (!this.track || this.slides.length === 0) return;
      this.slidesPerView = this.getSlidesPerView();
      this.createDots();
      this.bindEvents();
      this.update();
    }

    getSlidesPerView() {
      const matchedBreakpoint = this.breakpoints.find((breakpoint) => window.matchMedia(breakpoint.query).matches);
      return matchedBreakpoint ? matchedBreakpoint.slides : 1;
    }

    getPageCount() {
      return Math.ceil(this.slides.length / this.slidesPerView);
    }

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

    handleResize() {
      window.requestAnimationFrame(() => {
        this.updateSlidesPerView();
        this.update();
      });
    }

    updateSlidesPerView() {
      const nextValue = this.getSlidesPerView();
      if (nextValue === this.slidesPerView) return;
      this.slidesPerView = nextValue;
      this.createDots();
      this.update();
    }

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

    move(direction) {
      const pageCount = this.getPageCount();
      if (pageCount <= 1) {
        this.update();
        return;
      }

      this.currentPage = Math.min(Math.max(this.currentPage + direction, 0), pageCount - 1);
      this.update();
    }

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

  const contactForm = document.querySelector('[data-js="contact-form"]');
  if (contactForm) {
    const fields = Array.from(contactForm.querySelectorAll('.form__field'));
    const statusElement = contactForm.querySelector('[data-js="form-status"]');
    const submitButton = contactForm.querySelector('[data-js="form-submit"]');
    const submitDefaultLabel = submitButton?.textContent || 'Submit';

    const setStatus = (type, message) => {
      if (!statusElement) return;
      statusElement.textContent = message;
      statusElement.dataset.status = type;
      statusElement.classList.remove('form__status--success', 'form__status--error');

      if (type === 'success') {
        statusElement.classList.add('form__status--success');
      } else if (type === 'error') {
        statusElement.classList.add('form__status--error');
      }
    };

    const setFieldError = (field, message) => {
      const input = field.querySelector('.form__input');
      const errorElement = field.querySelector('[data-js="field-error"]');
      if (!input || !errorElement) return;
      errorElement.textContent = message;
      if (message) {
        input.setAttribute('aria-invalid', 'true');
      } else {
        input.removeAttribute('aria-invalid');
      }
    };

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
      let hasErrors = false;

      fields.forEach((field) => {
        const message = validateField(field);
        if (message) {
          hasErrors = true;
        }
      });

      if (hasErrors) {
        setStatus('error', 'Let’s fix the highlighted fields.');
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
