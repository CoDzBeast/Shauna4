# Honeybear Bake Shop JavaScript Overview

This project keeps JavaScript lean and framework-free for performance. The entry file `main.js` progressively enhances the static markup with accessible interactions. This document summarizes each module and the data attributes used to hook into the DOM.

## Entry File: `main.js`

### Navigation Drawer
- **Selectors**: `[data-js="nav-toggle"]`, `[data-js="nav-menu"]`, `[data-js="nav-overlay"]`
- **Key Functions**:
  - `syncMenuAria(isOpen)`: Keeps `aria-hidden` accurate for the mobile menu.
  - `toggleNav(forceState)`: Opens/closes the drawer and toggles overlay/body scroll lock.
  - `resetNavState()`: Clears drawer state on breakpoint changes.
  - `handleViewportChange()`: Watches the `48rem` breakpoint to ensure the desktop nav stays visible.
- **Enhancements**: Locks page scrolling while the menu is open, closes on `Escape`, and restores state on desktop.

### Sticky Header Behavior
- **Selectors**: `.site-header`
- **Function**: `updateHeaderOnScroll()` adds `site-header--scrolled` and optionally `site-header--hidden` classes to adjust chrome while scrolling.
- **Implementation Notes**: Uses `requestAnimationFrame` to throttle scroll work and respects `prefers-reduced-motion` to avoid unexpected motion.

### Section Entrance Animations
- **Selectors**: `[data-animate]`
- **Behavior**: Intersection Observer adds `is-visible` once the element enters view. When `prefers-reduced-motion` is enabled or the browser lacks support, elements are shown immediately.

### Testimonials Carousel
- **Selectors**: `[data-js="carousel"]`, `[data-js="carousel-track"]`, `[data-js="carousel-slide"]`, `[data-js="carousel-prev"]`, `[data-js="carousel-next"]`, `[data-js="carousel-dots"]`
- **Class**: `TestimonialsCarousel`
  - Calculates `slidesPerView` using breakpoint definitions.
  - Generates accessible pagination dots with `role="tab"` and `aria-label` hints.
  - Disables navigation controls at bounds and updates `aria-selected` state on dots.
- **Responsiveness**: Shows 1 slide on mobile, 2 on tablets, and 3 on desktop.

### Contact Form Enhancements
- **Selectors**: `[data-js="contact-form"]`, `.form__field`, `[data-js="field-error"]`, `[data-js="form-status"]`, `[data-js="form-submit"]`
- **Helpers**:
  - `setStatus(type, message)`: Updates the status banner for success/error/loading states.
  - `setFieldError(field, message)`: Shows inline errors and toggles `aria-invalid` on inputs.
  - `validateField(field)`: Applies required and email-format checks.
- **Workflow**: Prevents submission when validation fails, focuses the first invalid field, simulates async submission, and resets the form with a success message.
- **Extensibility**: Replace the `setTimeout` block with an actual `fetch`/XHR request when wiring to a backend or form service.

### Global Utilities
- `yearElement`: Auto-updates the footer year.
- Console log indicates script readiness for debugging.

## Component Scripts
Currently there are no additional component-specific scripts in `js/components/`. Add future modules here and import them via your bundler or include from `main.js`.

## Data Attribute Cheat Sheet

| Attribute | Purpose |
| --- | --- |
| `data-js="nav-toggle"` | Button that opens/closes the mobile navigation drawer. |
| `data-js="nav-menu"` | Wrapper containing navigation links; toggled with `site-nav__menu--open`. |
| `data-js="nav-overlay"` | Clickable overlay that closes the menu when active. |
| `data-js="carousel"` | Root carousel element used to instantiate `TestimonialsCarousel`. |
| `data-js="carousel-track"` | Slide container translated horizontally when navigating. |
| `data-js="carousel-slide"` | Individual testimonial slide. |
| `data-js="carousel-prev"` | Previous button for the carousel. |
| `data-js="carousel-next"` | Next button for the carousel. |
| `data-js="carousel-dots"` | Pagination dot container. |
| `data-js="contact-form"` | Contact form enhanced with validation. |
| `data-js="field-error"` | Inline error message element for a field. |
| `data-js="form-status"` | Region announcing submission status. |
| `data-js="form-submit"` | Submit button that displays loading and success states. |
| `data-js="year"` | Footer span automatically updated to the current year. |

## Testing Checklist for JS Features

1. Open the responsive dev tools and verify the menu toggle works below and above 48rem widths.
2. Scroll past 120px to confirm the header hides/reveals appropriately.
3. Observe testimonial slides and control buttons at different breakpoints.
4. Submit the contact form with missing and invalid data to confirm inline errors.
5. Submit a valid form and ensure the success banner renders and the button resets after ~1.2s.

Keep this document updated when you introduce new data attributes or components.
