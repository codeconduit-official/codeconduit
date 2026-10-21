# CodeConduit

A static company website for custom software, web applications, DevOps, and digital automation. Plain HTML, CSS, and JavaScript. Only the `site/` directory is published.

## Preview

Run `npm run preview` (or `node scripts/preview.mjs`), then open http://127.0.0.1:4173. Fonts (Instrument Serif, Inter, JetBrains Mono) are self-hosted in `site/assets/fonts/`; see `site/assets/FONTS.md`.

`npm test` runs the automated checks (page loads, no browser errors, no broken links or images, fonts load, contact links, no sideways scrolling on a phone, robots and sitemap).

## Contact

There is no contact form. The contact section links to **project@codeconduit.com** with a prefilled subject and a Copy address button. No analytics, cookies, third-party scripts, or tracking are included. Hosting providers can still maintain normal access logs.

## Structure

- `site/index.html`: copy, services, contact address, and metadata.
- `site/styles.css`: layout, colors, typography, and responsive styles.
- `site/app.js`: workflow explorer and copy-address button.
- `site/assets/`: logos, favicons, social image, and fonts.
- `scripts/`: preview server and tests.
