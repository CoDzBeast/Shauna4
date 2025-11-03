# Honeybear Bake Shop Front-End Project

This repository provides the base project structure and tooling checklist for the Honeybear Bake Shop website. Use it as the starting point for feature development and design implementation.

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

## 2. Development Environment

Follow these steps to ensure a smooth development workflow:

1. **Set up live reload**
   - Use a lightweight server with hot reload, such as the [Live Server VS Code extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or [Browsersync](https://browsersync.io/).
   - Configure it to serve the `project/` directory so `index.html` updates automatically when files change.

2. **Configure version control**
   - Initialize Git inside the repository (already configured in this project).
   - Create feature branches for new work and make frequent commits with descriptive messages.
   - Use `.gitkeep` placeholders to track otherwise-empty directories.

3. **Install measurement tools**
   - Add the [PerfectPixel Chrome extension](https://www.welldonecode.com/perfectpixel/) to overlay design comps on the implementation for pixel-perfect alignment.

4. **Set up testing across browsers**
   - Test the site in current versions of Chrome, Firefox, Safari, and Edge.
   - Use browser-specific dev tools to confirm layout consistency and responsive behavior.
   - Document any browser-specific fixes in pull requests.

## 3. Next Steps

- Populate `css/components/` and `js/components/` with component-specific logic as new features are added.
- Replace placeholder assets with production-ready images, fonts, and icons.
- Update this README with additional tooling or workflow notes as the project evolves.
