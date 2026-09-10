# Atmora Frontend Ecosystem v2.0 QA status

## Scope

## v2.0 Operator Console QA scope

The public cinematic site remains covered by the existing v1.5 contracts. v2.0 adds a separate frontend-only operator product surface under `/app` with **SYNTHETIC DEMO DATA** and no auth/backend/device connection.

Representative console routes/scenes:

```text
/app/overview
/app/devices
/app/devices/A-001
/app/fleet
/app/analytics
/app/water
/app/water/A-00284
/app/alerts
/app/maintenance
/app/reports
/app/settings
```

Static console proof targets:

```text
11 scenes × 7 widths = 77 combinations
1440 / 1280 / 1024 / 768 / 430 / 390 / 360
```

The console source contracts cover route resolution, dynamic device/batch records, frontend-only boundaries, unit conversion, local preferences, device + water-state filters, reduced motion, active mobile navigation reveal, hosting-level `noindex/nofollow` + `no-store`, public `Operator demo` discovery, spatial-map semantics and maintenance progress semantics. `scripts/render_console_qa.py` is exposed as `npm run qa:console`.

Fresh v2.0 console proof: **11 scenes × 7 widths = 77/77 combinations**, each reporting **0 px horizontal overflow** at `1440 / 1280 / 1024 / 768 / 430 / 390 / 360`. The 1440 and 360 contact sheets were visually inspected after the final filter/preferences/accessibility pass.
Fresh v2.0 public proof was also regenerated after the `Operator demo` integration: **6 routes × 7 widths = 42/42 combinations**, each reporting **0 px horizontal overflow**. Together the handoff carries **119 responsive render combinations** across public + operator surfaces.

A STATIC RENDER PROOF remains layout evidence rather than a substitute for the dependency-backed React/Vite runtime. A release still requires `npm run verify:release` on a machine with installed dependencies.


Current public routes:

```text
/  /technology  /platform  /lab  /pilot  /privacy  /404
```

v1.5 keeps the v1.4 submission hardening and adds a focused runtime-motion/composition pass: shared transition timing, persistent mobile navigation, route `CinematicHeading` reveal behavior, touch-safe optical media, Technology instrument/threshold geometry, Lab ledger separation and Pilot first-viewport composition.

## Fresh offline evidence boundary

This sandbox has system TypeScript/Python/Chromium tooling but does **not** have the npm-installed React/Vite dependency tree. npm registry access has repeatedly timed out here, so dependency-backed `typecheck`, `lint`, Vite `build`, real-runtime Playwright and Lighthouse are not claimed as passing.

The final numeric snapshot is refreshed immediately before the v1.5 handoff. Current enforced contracts include:

- **10 core tests** for climate, assessment consent, public/operator routing, dew-point/condensation order and console unit conversion;
- **64 public source/architecture tests** covering authored heroes, runtime timing, motion fallbacks, accessibility, prerender, social metadata, hosting configuration, safe areas, image dimensions and QA tooling;
- **19 Operator Console source tests** covering frontend-only data provenance, console routing/shell/pages, filters, unit preferences, local persistence, hosting noindex boundaries, accessibility semantics and release scripts;
- **10 Chromium geometry/motion tests** for cinematic heading reveal, route-title gutters, Technology instrument/threshold collisions, Lab ledger spacing, Pilot first-view composition and transition geometry;
- **3 static layout/accessibility tests** for the seven target breakpoints, climate labels and reduced-motion condensation fallback;
- combined fresh automated offline gate: **10 core + 83 source + 13 browser/static = 106 passing tests**;
- asset budget of **69 images / 4.91 MiB**;
- full **6 routes × 7 widths = 42/42** STATIC RENDER PROOF combinations at `1440 / 1280 / 1024 / 768 / 430 / 390 / 360`, each reporting `0 px` horizontal overflow;
- cinematic internal clipping detection rather than viewport overflow alone.


## v1.5 runtime and visual regression work

### CinematicHeading runtime reveal

Forensic review found that the shared masked heading primitive starts at `translateY(112%)`, while the explicit entrance animation had only been guaranteed for the Home hero. A browser regression now verifies that authored route hero copy moves to the visible state when `data-visible=true`. This protects Technology, Platform, Lab and Pilot from shipping a headline that static proof shows but the React runtime can leave masked.

### One page-transition clock

The router previously switched cover/reveal phases on different durations from the CSS keyframes, creating a risk of a visible snap mid-transition. `src/lib/motionTimings.ts` is now the single source for **360 ms cover + 420 ms reveal (~780 ms total)**, and `PageTransition` exports those values as CSS custom properties. The image/dew-line animations are intentionally shorter than their owning phase.

### Technology composition

Technology received two geometry fixes backed by browser tests: mobile condition labels are visually separated from their measurements, and the desktop dew-point annotation is kept out of the giant `AIR CROSSES A LINE.` typography. The threshold line remains a compositional boundary rather than becoming decoration through the copy.

### Lab and Pilot first-view composition

Lab reserves real layout width/negative space for its evidence record instead of relying on overflow masks or a lucky font metric. Mobile widths 430/390/360 keep the full `EVIDENCE BEFORE CONFIDENCE.` statement. Pilot's scene/panel relationship is tightened so its complete site-first proposition appears in the initial desktop composition.

### Persistent navigation and pointer takeover

Mobile navigation remains fixed/persistent as its scrolled-state logic intended. Touch/pointer cancellation resets optical offsets so a desktop hover response cannot remain visually stuck after a tap. The mobile menu also inerts the real `.footer` node while open.

## v1.4 correctness work

### Privacy and assessment truthfulness

Without `VITE_ATMORA_ASSESSMENT_ENDPOINT`, Site Assessment remains explicitly LOCAL DEMO and does not transmit entered data. With an endpoint configured, the final step requires explicit privacy acknowledgement before the remote request. `/privacy` documents frontend behavior without inventing legal entity, retention or processor facts that only a real deployment can define.

### Typography

Forensic static QA exposed a production cascade defect: `body,input,button{font:inherit}` caused the `body` itself to inherit the browser's `<html>` font and could reset body copy to Times New Roman while explicit display/mono faces masked the problem. v1.4 removes `body` from that shorthand reset and centralizes `--font-sans`, `--font-condensed` and `--font-mono` family tokens. A Chromium computed-style regression test protects this path.

### Route surface contrast and mobile safe areas

Privacy uses an explicit light navigation surface; the primary nav no longer becomes white-on-white above the mineral page. Mobile nav/legal spacing includes `env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`, and the document opts into `viewport-fit=cover` so the site can behave correctly around iOS display cutouts.

### Media / CLS / WPO contracts

All production `<img>` elements reserve intrinsic width/height. Critical media retain AVIF/WebP ladders and responsive source selection. The asset budget remains:

```text
total image payload        <= 6 MiB
single image               <= 260 KiB
desktop LCP AVIF           <= 120 KiB
mobile LCP AVIF            <= 90 KiB
```

### SEO / social / 404

Route metadata now includes social-image alt text. Prerender output emits `og:site_name`, `og:image:alt`, `twitter:image:alt`, per-route robots metadata and `noindex, nofollow` for the true 404. Favicon and webmanifest are first-party assets. `ATMORA_SITE_URL` remains the source for production canonical/sitemap origin.

### Hosting hardening

`public/_headers` and `vercel.json` set immutable caching for fingerprinted `/assets/*` and conservative headers:

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

A strict CSP is intentionally deferred until the production assessment endpoint/origin is known, instead of shipping a guessed policy that can break a legitimate cross-origin submit.

### Static QA reproducibility

`scripts/render_multipage_qa.py` supports route/width filters, for example:

```bash
python scripts/render_multipage_qa.py --route privacy --width 390
python scripts/render_multipage_qa.py --route technology --width 1440 --width 390
```

This avoids turning one long 6×7 renderer process into a single point of failure in constrained environments.

## STATIC RENDER PROOF limitations

Static proof uses a maintained DOM mirror with production CSS and local production media. It is valid evidence for layout, crop, horizontal overflow, internal cinematic title clipping, selected accessibility fallbacks and visual hierarchy.

It does **not** prove:

- bundled React/Vite execution;
- exact npm Fontsource file loading/rendering;
- route transition or Canvas/RAF frame pacing;
- production LCP/CLS/INP;
- Safari/Firefox/iOS runtime behavior.

## Product-truth review

The UI continues to distinguish concept/synthetic/illustrative states from validated evidence. It does not invent customers, partners, awards, laboratory verification, potable certification, validated field yield, universal SEC, AI accuracy, environmental savings or pilot outcomes. Raw condensate, treated water, verification and verified-for-intended-use remain semantically distinct.

## Real release gate

On Termux/macOS/Linux/CI where npm dependencies are available:

```bash
npm install
npm run verify:release
```

Runtime Playwright QA is deliberately resilient to local browser setup. `qa:runtime` selects an explicit/system/existing Playwright Chromium and, when allowed, installs Playwright Chromium if none exists. This avoids a 159-test false failure caused purely by absent browser executables. Use `qa:crossbrowser` only after installing all three Playwright engines when the full cross-browser matrix is required.

Once a real `package-lock.json` is generated and committed, prefer:

```bash
npm ci
npm run verify:release
```

Then run the final deployment pass:

1. Chrome, Firefox and Safari desktop;
2. Chrome Android and Safari iOS;
3. keyboard-only, touch and fine-pointer paths;
4. reduced motion/data and forced/high-contrast modes;
5. 200–400% zoom, orientation change and safe-area devices;
6. refresh/deep-link/404/Back-Forward scroll restoration/mobile menu/complete assessment flow;
7. Lighthouse + WebPageTest/Core Web Vitals;
8. production canonical/sitemap/OG validation;
9. console + network audit with zero accidental missing media/runtime exceptions.

Performance targets remain **LCP ≤2.5s, CLS ≤0.05, INP ≤200ms**. These are targets, not claims, until measured against the deployed production build.
