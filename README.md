# Atmora — Full Frontend Ecosystem v2.0

A production-oriented React/TypeScript website for **Atmora**, an atmospheric-water-generation platform concept. Its creative system is built around one product-specific idea: **a threshold changes the state** — air crosses the dew point into condensation, water crosses treatment and verification thresholds into evidence, and a pilot crosses assumptions into a measured decision.

## Public website architecture

| Route | Role |
| --- | --- |
| `/` | Campaign entry: atmosphere, physical thesis, route gateways and pilot CTA |
| `/technology` | Dew-point physics, signature condensation sequence, device pathway and energy context |
| `/platform` | Climate instrument, spatial telemetry, Intelligence and Cloud |
| `/lab` | Evidence methodology, water states and Water Batch traceability |
| `/pilot` | Site context, decision framework, hard questions and progressive site assessment |
| `/privacy` | Truthful local-demo vs remote-submit data states and deployment responsibilities |
| `/404` | Real not-found state used by prerendered hosting fallbacks |

Routing uses the browser History API through `src/hooks/useRouter.tsx` and `src/lib/routes.ts`; no routing framework is added. The production build prerenders the six public routes plus `404.html` through `scripts/prerender.mjs`.

## Operator Console — frontend-only product demo

Atmora v2.0 extends the cinematic public website into a complete **frontend-only Operator Console**. It is available directly at `/app` (canonicalized to `/app/overview`) and deliberately has **no login, auth service, database or device API**. Every operational number, alert, report object, fleet position and water-batch record is marked as **SYNTHETIC DEMO DATA**.

| Route | Frontend role |
| --- | --- |
| `/app/overview` | Device A-001 command overview, production/climate metrics and recent activity |
| `/app/devices` | Searchable device fleet with status + water-state filtering |
| `/app/devices/:deviceId` | Device detail, concept system view, climate/energy charts and service state |
| `/app/fleet` | Spatial fleet schematic, operator attention rail and availability summary |
| `/app/analytics` | 24H / 7D / 30D / 90D production, energy and climate analysis |
| `/app/water` | Canonical water-state chain and searchable synthetic batch ledger |
| `/app/water/:batchId` | Water-batch evidence object with climate, treatment and verification separation |
| `/app/alerts` | Severity filters and **local-only** acknowledgement UI |
| `/app/maintenance` | Service-life visualization with progress semantics |
| `/app/reports` | Frontend report-library previews; no fake PDF generation |
| `/app/settings` | Local units, density, motion and notification-display preferences |

The console uses one `ConsolePreferencesProvider` and browser `localStorage` for UI preferences only. °C/°F and L/gal choices propagate through all measurement pages. Operator navigation is horizontally self-revealing on mobile, keyboard/focus states are explicit, and reduced-motion can be controlled either by the OS or by the local console preference.

The `/app` tree is intentionally **noindex/nofollow + no-store** at runtime and at supported hosting layers. Public navigation exposes it as **Operator demo**, never as a fake login.

Console verification:

```bash
npm run qa:console
python scripts/render_console_qa.py --width 1440 --width 390
```

The renderer covers 11 representative console scenes. The full submission matrix is **11 scenes × 7 widths = 77 combinations** at `1440 / 1280 / 1024 / 768 / 430 / 390 / 360`.
The final offline v2.0 gate reports **77/77 console combinations** plus **42/42 public combinations**, all with `0 px` horizontal overflow. Automated checks total **10 core + 83 source + 13 browser/static = 106 passing tests**.

## Run locally

```bash
npm install
npm run dev
```

Vite normally serves `http://localhost:5173`.

Useful verification commands:

```bash
npm test
npm run qa:assets
npm run qa:static
npm run typecheck
npm run lint
npm run build
npm run qa:runtime
npm run verify:release
```

`verify:release` is the strongest local contract: source/core tests + asset budget + TypeScript + ESLint + production build/prerender + Playwright runtime tests.

`npm run qa:runtime` is environment-adaptive: it prefers `ATMORA_CHROMIUM_PATH`, then a Chromium/Chrome/Brave executable already on `PATH`, then an existing Playwright Chromium. If none is available it installs Playwright Chromium once and runs the runtime suite in Chromium-only mode. Use `npm run qa:crossbrowser` when Chromium + Firefox + WebKit are already installed and you explicitly want the full three-engine matrix. Set `ATMORA_QA_NO_BROWSER_INSTALL=1` to forbid automatic browser downloads.

## Termux / Android

Do **not** run `npm install` while the project lives under `/storage/emulated/0/...`. Android shared storage can reject npm's Unix symlinks in `node_modules/.bin` and produce `EACCES`.

Copy the source into Termux private storage first:

```bash
mkdir -p ~/projects/atmora
cp -r ~/storage/downloads/atmora-awwwards-v2.0-source/. ~/projects/atmora/
cd ~/projects/atmora
rm -rf node_modules
npm install
npm run verify:release
npm run dev
```

A healthy project path looks like `/data/data/com.termux/files/home/projects/atmora`.

## Signature interaction and motion architecture

The website intentionally avoids a heavyweight global animation stack: no Lenis, no GSAP, no routing framework and no global Three.js/WebGL dependency.

- `CondensationStory` + `condensationTimeline.ts` define the physically ordered sequence `ambient → cooling → threshold → nucleation → growth → coalescence → flow → collection`. Visible water cannot begin above the dew point.
- `DewPointField` is a lightweight Canvas 2D optical layer that begins only after threshold, pauses offscreen and is suppressed for reduced motion/data.
- `PageTransition` uses Atmora's own dry state → dew line → condensed state grammar and bounds destination-media readiness so navigation cannot become a permanent loader.
- `DewProgress` and route-hero scroll choreography update continuous values outside React render loops.
- `MotionOrchestrator` provides IntersectionObserver/CSS-variable fallbacks where native scroll-driven animation is unavailable.
- `CinematicHeading` uses line masks, not per-character gimmicks.
- `RouteLink` retains normal link semantics and selectively warms destination hero media on user intent.

`prefers-reduced-motion`, reduced-data, forced-colors/high-contrast and keyboard paths are first-class fallbacks.

## Distinct route art direction

Technology, Platform, Atmora Lab and Pilot intentionally do not share one generic hero template:

- **Technology** — physical instrument around surface temperature and dew point.
- **Platform** — operational field where conditions become measurement, interpretation and decision.
- **Atmora Lab** — evidence/publication composition around batch state and verification scope.
- **Pilot** — site-first environmental scene followed by a GO / CHANGE / STOP decision framework.

The custom `AtmoraWordmark` is vector-based and uses the threshold motif instead of a generic droplet logo.


## v1.5 runtime motion and composition polish

v1.5 is a focused jury/runtime pass on top of the v1.4 submission hardening. It does not add a new animation framework; it removes timing ambiguity and closes visual defects that static screenshots could hide.

- internal-route `CinematicHeading` lines now reveal when their route copy becomes visible instead of being able to remain at the masked `translateY(112%)` start state;
- page-transition JS and CSS share one timing source in `src/lib/motionTimings.ts`: **360 ms cover + 420 ms reveal = ~780 ms total**;
- transition media/dew-line animations are bounded inside that same window so route phase changes do not cut CSS animation mid-flight;
- mobile navigation remains **persistent/fixed** after the hero and keeps its scrolled treatment instead of becoming an absolute first-frame-only control;
- coarse-pointer/touch input resets desktop optical offsets on pointer takeover/cancel so hover state cannot stick after tap;
- Technology mobile instrument labels and values are separated into deliberate typographic levels;
- Technology desktop threshold annotation no longer crosses the hero headline;
- Lab desktop reserves real negative space between the editorial ledger and evidence record, while 430/390/360 preserve the full `EVIDENCE BEFORE CONFIDENCE.` title without hidden clipping;
- Pilot's first desktop viewport reveals the complete `A SITE BEFORE A MACHINE.` proposition rather than deferring the core line below the fold;
- the mobile menu now inerts the actual `.footer` element rather than a stale selector.

## v1.4 submission hardening

v1.4 closes several release-quality gaps found by forensic QA:

- adds `/privacy` as a real prerendered route instead of hiding data behavior in form microcopy;
- requires explicit privacy acknowledgement before a configured remote assessment request can be sent;
- keeps local-demo assessment data local and labels that state clearly;
- fixes a production typography cascade bug that could reset body copy to the browser serif font;
- reserves intrinsic dimensions for production images and expands responsive `srcset` coverage;
- adds `og:image:alt`, Twitter image alt, `og:site_name` and `noindex, nofollow` for the real 404;
- adds favicon + web manifest metadata;
- makes the navigation legible on the light Privacy surface;
- respects iOS safe-area insets in the mobile navigation/legal shell;
- ships explicit immutable asset caching plus conservative security/privacy headers in `public/_headers` and `vercel.json`;
- allows STATIC RENDER PROOF to run in route/width batches instead of one long fragile process.

## Site assessment backend and privacy

The progressive assessment uses an isolated adapter in `src/lib/assessment.ts`.

Without configuration it is deliberately a **LOCAL DEMO** and does not transmit or pretend to persist a lead. To connect a real endpoint:

```bash
cp .env.example .env.local
```

Set:

```text
VITE_ATMORA_ASSESSMENT_ENDPOINT=https://your-domain.example/api/assessment
```

When a remote endpoint exists, the final step requires explicit privacy acknowledgement and POSTs the assessment JSON with an 8-second timeout and explicit error state. The deployment operator still needs to provide its actual legal entity, retention, processors, deletion/request procedure, server-side validation and anti-spam policy; this repository does not fabricate them.

## SEO / prerender / hosting

`src/lib/routeMeta.json` is the source of truth for route title, description and social metadata. `scripts/prerender.mjs` emits route-specific HTML, truthful JSON-LD and a real `404.html`. With `ATMORA_SITE_URL`, canonical URLs and sitemap output use the production origin:

```bash
ATMORA_SITE_URL=https://atmora.example npm run build
```

Hosting hardening is explicit:

- `public/_redirects` routes each Netlify deep link to its prerendered HTML and preserves a true 404;
- `public/_headers` applies immutable caching to `/assets/*` plus `nosniff`, strict-origin referrer policy and disabled camera/microphone/geolocation permissions by default;
- `vercel.json` mirrors the cache/security header intent for Vercel.

A strict CSP is intentionally not hard-coded because a real assessment endpoint may be cross-origin and the production origin is not known in this source package.

## Assets and performance contracts

`public/assets/manifest.json` records truth-aware media. The current set contains **69 images / 4.91 MiB total**, including responsive AVIF/WebP ladders and dedicated mobile hero crops.

`npm run qa:assets` enforces:

- total image payload ≤ 6 MiB;
- any single image ≤ 260 KiB;
- desktop LCP AVIF ≤ 120 KiB;
- mobile LCP AVIF ≤ 90 KiB.

Critical route media use `srcset`/`sizes`, explicit dimensions and route-specific preloads. Selected heavy below-fold sections use `content-visibility:auto`; sticky physics chapters are deliberately excluded.

## Product truth

Concept device/cutaway/environment imagery is not presented as validated deployed hardware. Cloud/Fleet/Water Batch interface studies remain synthetic demonstrations. Climate/energy values are illustrative unless separately supported by evidence.

The site does **not** invent customers, pilots, partners, awards, laboratory verification, potable certification, validated yield, universal SEC, AI accuracy or environmental savings. Raw condensate, treated water, verification and verified-for-intended-use remain distinct states.

## Project structure

```text
src/
  components/          routing, interaction and typography primitives
  hooks/               router, progress and capability coordination
  lib/                 climate, routes, metadata, assessment and physics timeline
  marketing/           editorial/product chapters + authored route heroes
  pages/               Home, Technology, Platform, Lab, Pilot, Privacy and 404
  styles/              tokens, global, site, responsive and motion CSS
public/assets/          responsive production media + truth manifest
public/_headers         Netlify cache/security headers
scripts/                prerender, asset-budget and STATIC RENDER QA utilities
tests/e2e/              real-runtime Playwright release contract
docs/                   design history, implementation plans and QA record
```

## Static vs real-runtime QA

Full STATIC RENDER PROOF:

```bash
npm run qa:static
```

Target widths are `1440 / 1280 / 1024 / 768 / 430 / 390 / 360`. To keep QA reproducible in constrained environments, render a route/width batch directly:

```bash
python scripts/render_multipage_qa.py --route privacy --width 390
python scripts/render_multipage_qa.py --route technology --width 1440 --width 390
```

Static proof verifies layout, crops, overflow and selected fallback states. It does **not** prove the bundled React/Vite runtime, exact Fontsource loading, motion timing or Core Web Vitals. The final gate remains `npm run verify:release` on a machine with dependencies and Playwright browsers installed. See `docs/QA.md` for the exact evidence boundary.


## v1.5.1 dependency hotfix

The v1.5 package manifest accidentally referenced non-existent `eslint@10.10.0` / `@eslint/js@10.10.0`. v1.5.1 pins the verified maintenance pair `eslint@9.39.5` + `@eslint/js@9.39.5`. After extracting, run `npm install` to generate `package-lock.json`, then `npm run verify:release`.

## v1.5.2 runtime gate hotfix

v1.5.2 fixes the first real dependency-backed gate failures reported on Arch Linux: optional responsive `srcSet` fields are widened to the shared `AtmoraAsset` type before collection mapping, navigation no longer calls `setState` synchronously inside an effect, router effect dependencies are lint-clean, and Playwright can run against an existing system Chromium with `ATMORA_CHROMIUM_PATH` + `ATMORA_CHROMIUM_ONLY=1` when browser downloads are unavailable.
