# CodeConduit

A static company website for custom software, web applications, DevOps, and digital automation. Plain HTML, CSS, and JavaScript, with no build step or paid dependencies. Only the `site/` directory is published.

## Preview

From this directory, run `node scripts/preview.mjs`, then open http://127.0.0.1:4173. Alternatively, run `python -m http.server 4173 --directory site`, or open `site/index.html` directly. Panchang and Switzer load from Fontshare, with Arial and system sans-serif fallbacks.

## Contact behavior

The project brief creates a `mailto:` draft addressed to Clint@codeconduit.com. The visitor sends it from their own email application; the website does not submit, store, or email form entries itself. A copyable brief is also shown for webmail users. No analytics, cookies, third-party scripts, or tracking are included.

## Structure

- `site/index.html`: copy, services, contact address, and metadata.
- `site/styles.css`: layout, colors, typography, and responsive styles.
- `site/app.js`: workflow explorer and email brief preparation.
- `site/assets/`: favicon, social graphic, and font attribution.
- `scripts/preview.mjs`: local preview server.

The interface artwork is illustrative. No customer names, results, testimonials, prices, or client projects are claimed.
