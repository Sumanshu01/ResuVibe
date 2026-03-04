<div align="center">
  <h1 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;">🌈 <span style="background:linear-gradient(90deg,#7b2ff7,#f107a3); -webkit-background-clip:text; color:transparent;">RESUVIBE</span></h1>
  <p style="font-size:1.05rem; color:#444; margin-top:0.25rem">Resume Vibe — an ultra-light, customizable resume & portfolio template</p>
  <p>
    <img alt="status" src="https://img.shields.io/badge/Status-Production-brightgreen" />
    <img alt="tech" src="https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JS-blue" />
    <img alt="license" src="https://img.shields.io/badge/License-MIT-yellow" />
  </p>
</div>

---

## 🔎 Project Summary

**RESUVIBE** is a single-page, static resume/portfolio template designed for fast loading, easy customization, and clear presentation of professional information. It ships as plain HTML, CSS and JavaScript so you can edit it in any editor and deploy it anywhere static files are supported.

This README documents the project's goals, file layout, technical architecture, development workflow, customization guidance, and maintenance notes.

## 🎯 Goals

- Provide a minimal, print-friendly resume template that looks great on screen.
- Keep the code small and framework-free for portability.
- Make it easy to customize structure, content, layout, and theme colors.
- Follow accessibility and semantic HTML best practices.

## ✅ Key Features

- Clean, readable single-page layout with clear sectioning for contact, summary, experience, skills, education, and portfolio links.
- Responsive layout (mobile-first) using CSS Flexbox and Grid.
- Small interactive enhancements via `script.js` (no external libraries).
- Easy theming via a small set of color variables and CSS custom properties.
- Ready for static hosting (GitHub Pages, Netlify, Vercel, S3, etc.).

## 📁 Project Files (what to edit)

- `index.html` — Edit the page content: your name, contact details, summary, experience, projects, links.
- `style.css` — Edit or extend layout, typography, spacing, and theme tokens.
- `script.js` — Small behaviors, e.g., mobile nav toggle, print helpers, or simple DOM utilities.
- `package.json` — Optional metadata; not required to run the site.

## ⚙️ Detailed Technical Specifications

### HTML / Markup

- Document: HTML5 (`<!doctype html>`).
- Semantic structure: `header` for hero/contact, `main` containing `section` elements (Summary, Experience, Projects, Skills, Education), and `footer` for contact/social links.
- Accessibility: headings are hierarchical (`h1` → `h2`), images include `alt` text, and interactive controls use `button` elements or `a` with ARIA where needed.

Recommendations:
- Use `role="navigation"` for the main nav if present.
- Provide `aria-label` on landmark regions when multiple of the same type exist.

### CSS / Styling

- Architecture: single-file CSS focused on readability. Use a small token section at the top for colors, spacing and typography.
- Core systems:
  - Typography: system UI stack for fast rendering and consistent fallback.
  - Layout: mobile-first breakpoints with Flexbox for column layouts and Grid for multi-column sections.
  - Color tokens: CSS custom properties (root-level `--color-primary`, `--color-accent`, `--text`, etc.).

Example tokens (in `:root`):
```
:root {
  --color-primary-start: #7b2ff7;
  --color-primary-end: #f107a3;
  --color-accent: #f107a3;
  --text-default: #222;
  --muted: #666;
  --bg: #fff;
}
```

Breakpoints (suggested):
- small: up to 599px (mobile)
- medium: 600px–1023px (tablet)
- large: 1024px+ (desktop)

### JavaScript / Behavior

- Language: ES6+ (vanilla). Keep functionality unobtrusive and progressive.
- Recommended patterns:
  - Event delegation for lists and repeated controls.
  - `data-` attributes for behavior hooks rather than coupling via classes.
  - Minimal DOM writes; prefer toggling classes for visual changes.

Common behaviors to implement in `script.js`:
- Mobile navigation toggles.
- Smooth scrolling to sections.
- Print-friendly helpers (hide interactive-only elements before printing).

### Performance

- Keep payloads minimal: avoid large images and third-party scripts.
- Use SVG or optimized raster images (WebP/AVIF where supported).
- For production, gzip/Brotli responses and set appropriate caching headers when deploying.

### Accessibility (A11y)

- Use semantic HTML and ensure heading order is logical.
- Provide sufficient color contrast for text and interactive elements.
- Ensure all interactive elements are reachable via keyboard (tab order) and have visible focus styles.
- Test with Lighthouse, axe, or screen readers to validate.

### Browser Support

- Target: evergreen browsers (latest Chrome, Edge, Firefox, Safari).
- Graceful degradation: content remains readable in older browsers; advanced visual flourishes may be reduced.

### Security

- Static sites have low attack surface, but follow best practices:
  - Do not include plaintext secrets in source code.
  - Sanitize any user-provided content before embedding (if added later).

## 🔧 Development & Local Preview

Prerequisites: Node.js installed only if you want a simple static server. No build step required.

Quick preview with `npx`:

```bash
npx serve .
```

Or with a global `serve` installation:

```bash
npm install -g serve
serve .
```

To edit: open `index.html` in any editor and change the content blocks. Refresh the browser to see updates.

## 🎨 Theming & Customization Guide

- Colors: change the CSS variables in `:root` (see tokens above).
- Typography: replace the system stack or add a web font in the `head` of `index.html`.
- Layout: adjust breakpoint values in `style.css` and tweak `max-width` on the content container.
- Adding sections: copy an existing `section` block in `index.html`, update the `id` and heading, and add to navigation if needed.

Print-friendly tips:
- Add a `@media print` section in `style.css` to adjust page breaks and hide non-essential UI (nav toggles, animations).

Exporting to PDF:
- Use the browser Print → Save as PDF. Use print CSS to improve pagination and font sizes.

## 🧪 Testing & Validation

- HTML: W3C HTML validator.
- CSS: check in multiple viewport sizes; use browser devtools for layout debugging.
- Accessibility: Lighthouse (DevTools), axe browser extension.

## 📦 Deployment

- GitHub Pages: push to a repository and enable Pages from the `main` branch (or `docs/` folder).
- Netlify / Vercel: drag-and-drop the site folder or connect repository for automatic deploys.

Example GitHub Pages (basic):

```bash
git init
git add .
git commit -m "Add RESUVIBE site"
# Create repo and push; enable GitHub Pages in repo settings
```

## 📞 Developer & Maintainer

- **Name:** Sumanshu Jindal
- **Email:** sumanshujindal01@gmail.com
- **GitHub:** https://github.com/YOUR_GITHUB  
  (Replace `YOUR_GITHUB` with your GitHub username or profile URL.)

## ⚖️ License

This project is provided under the MIT license. Include a `LICENSE` file in the repo if you'd like to make this explicit.

---

<p align="center">Made with ❤️ — edit freely and make it yours.</p>
