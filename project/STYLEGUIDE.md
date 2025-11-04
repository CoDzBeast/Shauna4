# Honeybear Bake Shop Style Guide

This style guide outlines the foundations that keep the Honeybear Bake Shop interface cohesive across pages and components. Refer to it when designing new sections or extending existing UI elements.

## Brand Personality

- **Tone**: Playful, welcoming, and craft-focused.
- **Visual Language**: Warm neutrals paired with saturated dessert-inspired accents. Rounded corners and soft shadows communicate approachability.
- **Accessibility Goals**: Maintain WCAG AA contrast and ensure motion is optional for motion-sensitive visitors.

## Color Palette

| Token | Hex | Usage |
| --- | --- | --- |
| `--color-primary` | `#ffcf70` | Primary CTAs, highlight badges, focus elements. |
| `--color-primary-dark` | `#f2a541` | Hover state for primary CTAs, emphasis elements. |
| `--color-secondary` | `#34263a` | Primary text on light surfaces, navigation items. |
| `--color-accent` | `#c94b1e` | Accent buttons, hover states, important links. |
| `--color-highlight` | `#ffe8ba` | Soft backgrounds for callouts and sections. |
| `--color-background` | `#fffaf4` | Page background. |
| `--color-surface` | `#ffffff` | Cards, modals, navigation drawer. |
| `--color-surface-alt` | `#fff4f0` | Alternate backgrounds, testimonials. |
| `--color-text` | `#2b1b2a` | Body copy. |
| `--color-text-muted` | `#6c5a68` | Helper text, metadata. |
| `--color-border` | `rgba(43, 27, 42, 0.12)` | Card dividers, subtle outlines. |
| `--color-focus` | `#4e3274` | Focus ring color, ensure strong contrast. |

## Typography

- **Primary Typeface**: [Poppins](https://fonts.google.com/specimen/Poppins)
  - Headings: Bold (`--font-weight-bold`) with tight leading (1.1).
  - Body: Regular (`--font-weight-regular`) with 1.6 line-height for readability.
- **Scale**: `clamp()` responsive sizing for headlines; body copy remains at `1rem` for consistency.
- **Best Practices**: Keep headings concise (max ~52 characters). Use sentence case for friendly tone.

## Spacing & Layout

- **Base Unit**: `--spacing-unit` = 8px.
- **Stacking**: Use `var(--spacing-4)` for vertical spacing between sections; adjust responsively using utility tokens (`--spacing-7`, `--spacing-9`).
- **Container**: `--container-max` = 1120px; gutters shrink on mobile via `--container-gutter-tight`.
- **Border Radius**: Rounded surfaces use `--radius-md` or `--radius-lg`; interactive controls such as buttons use pill-shaped 999px radius.
- **Shadows**: `--shadow-soft` for cards, `--shadow-elevated` for overlays/drawers.

## Iconography & Imagery

- Favor bright, high-resolution photography with ample whitespace.
- Apply rounded corners (`--radius-sm`) and lazy-load images using `loading="lazy"` unless above the fold.
- Maintain descriptive `alt` text that conveys context for screen reader users.

## Motion & Interaction

- **Transitions**: Use `--transition-base` (200ms ease) for most hover states; reserve `--transition-fast` for quick affordances like menu toggles.
- **Entrance Animations**: Elements with `[data-animate]` fade and translate upward once visible. Honor `prefers-reduced-motion` by revealing content immediately without animation (handled in JavaScript).
- **Focus States**: Never remove focus outlines; use `--focus-ring` and `--focus-ring-strong` for accessible highlighting.

## Components

### Buttons

- Primary buttons (`.button--primary`) use the honey-yellow palette and convert to `--color-primary-dark` on hover.
- Ghost buttons outline with `--color-secondary` and invert to filled on hover.
- Always pair iconography with `gap: var(--spacing-0-5)` and center align.

### Navigation

- Sticky header with translucent backdrop blur.
- Mobile navigation slides in from the right, overlaying a dimmed backdrop. Ensure `aria-expanded`, `aria-controls`, and `aria-hidden` stay synchronized (see `js/main.js`).
- Desktop navigation switches to an inline layout above the `48rem` breakpoint.

### Carousel

- Testimonials display in a flex-based track. At 64rem and above the carousel reveals 3 slides per page.
- Dots are generated programmatically; ensure `aria-label` values remain descriptive.

### Forms

- Inline validation surfaces via `.form__error` with an `aria-live="polite"` region for announcements.
- Buttons display a loading state text (`Sending…`) and disable during submission.

## Accessibility Checklist

- Provide descriptive `alt` text for photography and logos.
- Confirm color contrast ratios meet or exceed 4.5:1 for body text (Poppins regular on the warm cream background passes).
- Ensure all focusable elements remain keyboard accessible.
- Motion is optional via `prefers-reduced-motion` detection.

## Usage Notes

- Keep additions consistent with CSS custom properties defined in `css/variables.css`.
- Prefer utility classes already present in `css/global.css` before introducing new bespoke styles.
- For new sections, mirror the `.section` wrapper structure (`.section`, `.section__inner`, `.section__header`).

Happy baking—and building! 🍪
