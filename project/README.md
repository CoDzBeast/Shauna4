# Honeybear Bake Shop Front-End Project

This repository provides the production-ready front-end for the Honeybear Bake Shop website. Use it as the starting point for feature development, quality assurance, and deployment.

## 0. Quick Links

- [Visual Style Guide](./STYLEGUIDE.md)
- [JavaScript Function Reference](./js/README.md)
- [Deployment Playbook](./docs/DEPLOYMENT.md)

## 1. Project Structure

```
project/
├── index.html
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── global.css
│   └── components/
├── js/
│   ├── main.js
│   └── components/
├── assets/
│   ├── images/
│   ├── fonts/
│   └── icons/
└── README.md
```

- **index.html**: root HTML document.
- **css/**: shared stylesheets and component-specific styles inside `components/`.
- **js/**: global entry point (`main.js`) and component scripts inside `components/`.
- **assets/**: static files separated into `images/`, `fonts/`, and `icons/`.
- **README.md**: documentation for project setup and workflow.

## 2. Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/) (optional) for running linting/minification scripts.
- A local web server (recommended: [Live Server VS Code extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)).
- Chrome DevTools (or similar) for responsive design mode, Lighthouse, and network inspections.

### Running Locally

1. Clone the repository and `cd` into `project/`.
2. Start a static server (e.g., via Live Server or `npx http-server`).
3. Navigate to the served `index.html` in your browser.
4. Make edits inside `css/` or `js/` and refresh to verify changes. `js/main.min.js` should be regenerated with `npx terser js/main.js -o js/main.min.js` after modifying the source file.

### Recommended Extensions & Tools

- **Visual QA**: PerfectPixel overlay, WhatFont, ColorZilla.
- **Layout Helpers**: CSS Grid/Flexbox generators.
- **Formatting**: Prettier, EditorConfig, stylelint (optional).

## 3. Quality Assurance Checklist

Use this checklist before every release to satisfy the QA requirements from the project brief.

1. **Links** – Verify all internal anchors and external links resolve correctly.
2. **Forms** – Submit the contact form with valid/invalid values to confirm validation, status messages, and reset behavior.
3. **Animations** – Scroll through the page ensuring `[data-animate]` elements receive the `is-visible` class; confirm motion is disabled when `prefers-reduced-motion` is active.
4. **Console** – Inspect DevTools for warnings or errors (expect a single informational log message).
5. **Responsive Layout** – Test at 320px, 768px, 1024px, and 1440px widths. Pay special attention to navigation, carousel layouts, and typography scaling.
6. **Performance** – Run [Lighthouse](https://developers.google.com/web/tools/lighthouse) or WebPageTest. Aim for <3s Largest Contentful Paint on a Fast 3G profile. Use the hero image preload (configured in `index.html`) and defer non-critical scripts to stay within budget.

Document findings (including screenshots, browser/version, and steps) in pull requests or QA reports.

## 4. Documentation

- **Style Guide** – Shared colors, typography, and spacing conventions live in [`STYLEGUIDE.md`](./STYLEGUIDE.md).
- **JavaScript Reference** – Data attributes, validation rules, and carousel logic are described in [`js/README.md`](./js/README.md).
- **Accessibility** – Follow the checklist in the style guide and keep aria attributes synchronized with interactive state (see `js/main.js`).

## 5. Deployment

Deployment instructions for Netlify, Vercel, and GitHub Pages—including custom domain, SSL, and analytics configuration—are documented in [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).

## 6. Maintenance Notes

- Populate `css/components/` and `js/components/` with modular files as the project grows.
- Replace remote image URLs with locally hosted assets before going live to eliminate third-party dependencies.
- Update the documentation links above whenever you add new tooling or workflow guidance.
