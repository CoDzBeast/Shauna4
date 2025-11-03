# Phase 1 — Analysis & Documentation

## 1.1 Visual Audit

### Page inventory

The exported `html` document for Honeybear Bake Shop contains the following top-level sections (derived from `data-section-id` attributes and headings parsed from the markup):

| Section ID | Heading level | Primary heading |
| --- | --- | --- |
| `6033d4b8593810664e4e1967` | 1 | We’re HoneybearBake Shop. |
| `60352fdc0e32566d34936e71` | 1 | How To Order |
| `60356307a58f2e29e05d3067` | 1 | Sweet Wordsfrom the Cookie Monsters |
| `60342253d45dfd7037861f0c` | 1 | Honeybear in the news |
| `603421ff9fbb0f7c39047427` | 1 | Upcoming Events |
| `603592602fc0de71abda9217` | 1 | Meet Hannah |
| `6036cc9b1b7f2e41dd11c9f7` | 1 | Follow us on Instagram |
| `606600cc0b52ab02c0e7a94f` | – | (no heading) |

### Screenshot capture plan

| Breakpoint | Viewport (px) | Notes |
| --- | --- | --- |
| Mobile | 375 × 812 | Capture hero, ordering CTA, testimonials carousel position, footer. |
| Tablet | 834 × 1112 | Verify grid reflow of hero text and imagery, check sticky header behavior. |
| Desktop | 1440 × 900 | Document base desktop layout plus overlay menu states. |

For each breakpoint record:

- Default scroll position.
- Header sticky state after scrolling past hero.
- Overlay navigation open state (burger → overlay).
- Hover state for primary and secondary buttons (`ORDER`, `This Week's Cookies`, `Do It For The 'Gram`).

> **Note:** Attempting to automate capture with Playwright inside the provided environment failed because the browser binaries required by Playwright are not available. Screenshots will need to be captured manually using Chrome DevTools Device Mode or another headless capture tool with access to the remote assets.

### Typography & palette

- **Font family:** `Poppins` (weights 300, 400, 500, 700) via Google Fonts.
- **Global palette variables:** Inline styles reference Squarespace variables such as `--darkAccent-hsl`, `--white-hsl`, and `--headerBorderColor`. Exact color values require fetching the hosted `site.css`, which is blocked from the current environment (HTTP 403). Document these by capturing the stylesheet externally.
- **Text hierarchy:** Headings extracted from the markup are listed above; hero copy uses `<h1>` / `<h2>` pairs, subsequent sections rely on `<h1>` blocks styled for section titles.

### Measurement checklist

To replicate the layout precisely, record the following metrics during manual inspection (Chrome DevTools → Computed tab):

- Hero section spacing: top/bottom padding values (`.content-wrapper` inline styles).
- Column widths in the hero grid (12-column Squarespace grid: spans 2 / 3 / 7 columns on desktop).
- Button padding, border radius, and hover transition duration (`data-animation-role=button`).
- Card spacing within testimonials/news/events sections (inspect `.sqs-block-image` and `.sqs-block-html`).
- Instagram embed dimensions and gutter spacing within the gallery grid.

Document these in a spreadsheet or extend this report once measurements are captured.

## 1.2 Asset Extraction

- A machine-readable export of asset URLs is available in [`analysis/assets.csv`](assets.csv). It lists 22 remote images referenced in the page markup, including hero imagery (`Edited_Home(21).png`), press badges, and background textures.
- Additional media embedded via `<iframe>` elements (Instagram reels) are enumerated under the interaction mapping below; video thumbnails should be captured manually.
- Favicons and OpenGraph images are declared in the `<head>` section; verify sizes and download the highest-resolution variants as needed.

> **Reminder:** Actual asset files live on Squarespace's CDN. Download each asset at its native dimensions (strip query parameters like `?format=1000w` to retrieve originals) to preserve fidelity.

## 1.3 Interaction Mapping

A structured CSV (`analysis/interaction_mapping.csv`) captures the primary interactive elements observed in the markup, including header toggles, CTA hover states, and embedded media. Use this sheet to add new rows for:

- Form elements (none present in the current export; confirm once you access live environment).
- Loading animations triggered by the Squarespace animation engine (`data-animation-role=content|image`).
- Scroll-triggered opacity transitions controlled by inline styles (e.g., `.section-background-overlay`).

### Suggested spreadsheet columns

When expanding the mapping, retain the following headers:

1. Component name
2. Trigger (Hover, Click, Scroll, Load)
3. Behavior/Description
4. Notes (include selectors, asset references, or video links)

## Next steps

1. Use a full browser with network access to capture the screenshot set defined above.
2. Measure and log spacing/typography values per section, appending them to this document or a dedicated spreadsheet.
3. Verify interactions against the live site to confirm animations (e.g., fade-in timings) and update the CSV accordingly.
