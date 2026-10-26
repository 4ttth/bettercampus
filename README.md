# BetterCampus

An **unofficial**, mobile-friendly redesign of the HAU Campus++ student portal (`hau.campus-erp.com`).
It is not affiliated with, endorsed by, or supported by Holy Angel University.

**Install:** https://4ttth.github.io/bettercampus/ has steps for desktop, Android and iPhone.

The redesign runs **on the real portal**: login, sessions, reCAPTCHA and every form still go
to the original backend. It only changes what you see. It never reads, stores or sends your
password, and it sends no data anywhere.

## How it works

```
src/
  core.js         shared helpers (BC namespace, element builder, icons, text helpers)
  data/           portal.js (background fetch + table readers), parsers.js, store.js
  app/            shell.js (adaptive nav + hash router), ui.js (cards, rows, tabs…), schedule.js
  app/views/      home.js, academics.js, finances.js, me.js
  pages/          login.js, dashboard.js (Main.php → the app), skin.js (all other portal
                  pages inside the shell), error.js (session-ended screen)
  router.js       picks the page module for the current URL
  main.js         entry point (runs at document_start)
  styles/         base.css (tokens), app.css, login.css, skin.css, status.css
site/index.html   install page source
wrappers/         extension manifest + userscript header
dev/server.mjs    offline harness that serves pages saved in samples/
design/navigation.md  information architecture, page inventory, session rules
build.mjs         bundles everything (see Build)
docs/             GENERATED: the published site (install page + userscript)
```

**How it connects to the real backend:**
- **Login:** the portal's own form controls are moved into the new layout, never recreated, so reCAPTCHA and the POST stay intact.
- **`Main.php` (the app):** after login, `Main.php` becomes the app. Home, Academics, Finances and Me are rebuilt from the portal's own pages, which are loaded in the background with read-only GETs and parsed.
- **Every other portal page:** pages with forms, such as Pay online, Change password and Faculty evaluation, are shown inside the same navigation shell with their original form untouched.
- **Session rules:** the portal allows one login at a time, and loading `Login.php` signs you out, so the app never requests it in the background. See [design/navigation.md](design/navigation.md).

## Build

Needs Node 18+. There are no dependencies.

```bash
npm run build
```

This produces:
- `dist/extension/`: the browser extension, for loading unpacked during development
- `dist/bettercampus.user.js`: the userscript
- `docs/`: the public site (`index.html`, `bettercampus.user.js`, `bettercampus.meta.js`)

The version, site URL and repo URL all come from `package.json` (`version`, `homepage`, `repository.url`).
Use `npm run watch` to rebuild whenever `src/` or `site/` changes.

### Offline testing harness

1. Save portal pages yourself (Ctrl+S, "Webpage, Complete") into `samples/`. That folder is gitignored because it holds personal data.
2. Run:

   ```bash
   npm run harness
   ```

3. Open http://localhost:5174/Student/Main.php. The install page preview is at http://localhost:5174/docs/.

## Publishing (one-time setup)

1. Create an empty public repo named `bettercampus` on GitHub under `4ttth`.
2. Push this repo to it.
3. On GitHub, go to **Settings → Pages → Build and deployment**. Choose **Deploy from a branch**, branch `main`, folder `/docs`.
4. After a minute the site is live at https://4ttth.github.io/bettercampus/. Share that link.

If you use a different account or repo name, update `homepage` and `repository.url` in `package.json`, then rebuild. Do this **before** anyone installs: script managers use the URLs baked into the installed copy to find updates.

## Releasing an update

1. Make your changes, and test them in the harness or the unpacked extension.
2. Bump `version` in `package.json` (for example `0.2.0` → `0.2.1`). Without a higher version, nobody gets the update.
3. Run `npm run build` and commit, including `docs/`.
4. Push to `main`. Tampermonkey and Userscripts check `bettercampus.meta.js` and update everyone automatically, usually within a day. Users can also force a check from the app.

## Installing from source (development)

- **Chrome / Edge / Brave:** go to `chrome://extensions`, turn on Developer mode, click **Load unpacked** and pick `dist/extension`. Click the extension's reload icon after each rebuild.
- **Firefox:** `about:debugging` → This Firefox → **Load Temporary Add-on…** → pick `dist/extension/manifest.json`. If nothing changes on the portal, allow the extension on `hau.campus-erp.com` from the Extensions button.
- **Safari (Mac/iOS):** on a Mac with Xcode, run `xcrun safari-web-extension-converter dist/extension --app-name BetterCampus`. Distributing through the App Store needs an Apple Developer account ($99/yr).

## Turning it off

- **In the app:** Me → **Switch to classic portal**, or **Classic view** on the login page. A "Use BetterCampus" button then switches it back on.
- **One page only:** add `?bc=off` to any portal URL for a one-time classic view.

## Adding a page

1. Create `src/pages/<name>.js`:
   ```js
   BC.pages.grades = {
     match: (path) => /\/grades\.php$/i.test(path),
     run: () => { /* build #bc-root, move the portal's nodes into it */ },
   };
   ```
2. Add `src/styles/<name>.css` with selectors scoped under `#bc-root` or `html.bc-page-<name>`.
3. Run `npm run build`.

Rules that keep it working in every browser:
- Use only plain DOM APIs: no `chrome.*`, `browser.*` or `GM_*`.
- Move existing form controls into the new layout instead of cloning them.
- Lay out for phones first, keep tap targets at 44px or more, and use 16px or larger input text (iOS zooms into smaller text).
- Never commit `samples/` or anything copied from it. It contains real student data.

## Status

- ✅ Login page
- ✅ App on `Main.php`: Home, Academics (Schedule, Grades, Enrollment), Finances (Overview, Transactions, Receipts), Me
- ✅ Every other portal page wrapped in the same navigation
- ✅ "Session ended" screen in place of the portal's error page
- ✅ Tried on the live portal (desktop)
