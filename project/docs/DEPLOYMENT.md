# Honeybear Bake Shop Deployment Playbook

Use this guide to deploy the static site confidently and cover hosting, domains, SSL, and analytics.

## 1. Choose a Hosting Platform

### Netlify (Recommended for forms & previews)
1. Create a Netlify account and install the CLI (`npm install -g netlify-cli`).
2. Run `netlify init` inside the `project/` directory and select **Deploy a site**.
3. Set the **build command** to `npm run build` (or `-` for none) and **publish directory** to `project`.
4. Push changes to your main branch; Netlify will create deploy previews automatically.
5. Enable the Forms feature if you plan to collect submissions server-side. Add `data-netlify="true"` and a hidden `form-name` input when connecting the contact form.

### Vercel
1. Sign in to [Vercel](https://vercel.com/) and import the Git repository.
2. Configure the project root to `project` and leave the build command blank for static hosting.
3. Vercel automatically provisions previews for pull requests and production deploys on `main`.

### GitHub Pages
1. Create a branch named `gh-pages` that contains the contents of the `project/` folder.
2. In your repository settings, enable Pages with the `gh-pages` branch and `/` root.
3. Use an action such as [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) to publish on push.

## 2. Custom Domain Setup

1. Purchase or manage the domain through your DNS provider (e.g., Google Domains, Cloudflare).
2. Add the custom domain within your hosting provider dashboard (Netlify/Vercel/Pages).
3. Create the required DNS records:
   - **Netlify**: Point CNAME for `www` to `your-site.netlify.app` and add an ANAME/ALIAS or A record for the root.
   - **Vercel**: Point CNAME to `cname.vercel-dns.com` or use the A records they provide.
   - **GitHub Pages**: Set a CNAME record to `<username>.github.io` and add the same domain to the repository settings.
4. Allow DNS propagation (can take up to 24 hours).

## 3. SSL/TLS Certificates

- Netlify, Vercel, and GitHub Pages all issue Let’s Encrypt certificates automatically once the custom domain is verified.
- Force HTTPS redirects in the hosting dashboard to avoid mixed content issues.
- Re-run Lighthouse to confirm no insecure requests remain.

## 4. Analytics & Monitoring

1. Choose an analytics provider:
   - **Privacy-first**: [Plausible](https://plausible.io/), [Fathom](https://usefathom.com/)
   - **Google Analytics 4** for advanced attribution
2. Paste the tracking snippet before the closing `</head>` tag in `index.html` or inject via the hosting platform.
3. Use [Netlify Analytics](https://www.netlify.com/products/analytics/) or [Vercel Web Analytics](https://vercel.com/analytics) if you prefer a server-side approach.
4. Set up uptime monitoring using services like UptimeRobot or Pingdom, and configure alerts for 200/500 errors.

## 5. Post-Deploy Checklist

- ✅ Run Lighthouse in production and compare to staging metrics.
- ✅ Validate forms by sending a test submission and confirming receipt (email or dashboard).
- ✅ Confirm all redirects (e.g., `www` → apex domain) are working.
- ✅ Verify social share images (`og:image`, `twitter:image`) load from the production domain.
- ✅ Capture and archive screenshots for design sign-off.

## 6. Rollback Strategy

- Netlify and Vercel let you promote any previous deploy with a single click.
- For GitHub Pages, revert to a known-good commit and push to `gh-pages`.
- Maintain release notes documenting the commit hash, deploy URL, and QA status for each launch.

Keep this guide updated as your tooling evolves or if you integrate CI/CD pipelines.
