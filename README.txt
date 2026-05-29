LA MAISON DU SAVOIR - REACT / VITE / TYPESCRIPT

This project is now a single-page React app built with Vite and TypeScript.

Included:
- one-page layout for Home / About / Programs / News / Contact
- multilingual support: French, English, Arabic, Spanish
- GSAP-based intro, scroll reveal, parallax, and stat counter animations
- responsive navigation and mobile contact actions
- Netlify-compatible contact form markup

Local commands:
1. `npm install`
2. `npm run dev`
3. `npm run build`
4. `npm run preview`

Static deployment:
- build output is generated in `dist/`
- SEO files (`robots.txt` and `sitemap.xml`) are generated at build time

Google / SEO configuration:
- copy `.env.example` to `.env` when you want to override production settings
- set `VITE_SITE_URL` to your published website URL for sitemap, robots, canonical links and open graph metadata
- set `VITE_GOOGLE_SITE_VERIFICATION` to the code provided by Google Search Console for site ownership verification
- set `VITE_GA_MEASUREMENT_ID` only if you want Google Analytics 4 tracking
- run `npm run build`, then deploy `dist/` and submit the generated `sitemap.xml`/`robots.txt` to Google Search Console

Main source files:
- `src/App.tsx`
- `src/styles.css`
- `assets/translations.js`
