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
    navToggle.setAttribute('aria-expanded', String(isOpen));
    body.classList.toggle('is-lock-scroll', isOpen);
    syncMenuAria(isOpen);
  };

  const resetNavState = () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('site-nav__menu--open');
    navOverlay?.classList.remove('is-active');
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

  const yearElement = document.querySelector('[data-js="year"]');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  console.info('Honeybear Bake Shop UI ready.');
});
