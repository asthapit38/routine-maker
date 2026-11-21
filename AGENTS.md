# routine-maker

Next.js (App Router, TypeScript) app exported as a static PWA (`out/`) that
builds a weekly duty roster. See `README.md` for behavior, setup, validation
commands and the software factory section.

- Fresh checkout: `npm ci`.
- Dev server: `npm run dev -- -p <port>` (no service worker in dev).
- Build: `npm run build` writes the static site, including the generated
  `sw.js`, to `out/`. Serve it with `python3 -m http.server -d out <port>` to
  test offline and updates.
- Lint and types: `npm run lint`, `npm run typecheck`.
- Deploy: Vercel and Netlify run `npm run build` and publish `out/`
  (`vercel.json`, `netlify.toml`).
- The root `index.html` is still the source of the app's markup, styles and
  script until the component port. The build serves them unchanged; the root
  `sw.js` is the service worker template, and `manifest.webmanifest` and
  `icons/` are copied into `public/` (generated, gitignored).
- Validation: `bash factory/checks.sh` still runs only the legacy syntax checks
  (inline script, `sw.js`, manifest and `vercel.json`). Also run
  `npm run lint && npm run typecheck && npm run build`.
