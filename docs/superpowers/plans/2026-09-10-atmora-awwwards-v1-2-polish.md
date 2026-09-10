# Atmora Awwwards v1.2 Motion Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Deepen the existing five-route Atmora site with more cinematic, route-specific motion and faster-feeling navigation without adding runtime dependencies or sacrificing reduced-motion behavior.

**Architecture:** Keep the existing History API router and custom transition overlay. Add reusable line-based cinematic headings, destination imagery inside route transitions, progressive route-hero asset preloading, and CSS scroll-driven hero exit choreography behind feature detection. All additions remain optional enhancements over the existing static and reduced-motion experience.

**Tech Stack:** React 19, TypeScript, Vite, CSS, History API, IntersectionObserver, Pointer Events, CSS scroll-driven animations when supported.

**Spec:** `docs/superpowers/specs/2026-09-10-atmora-awwwards-multipage-design.md`

## Global Constraints
- Native scroll only; no Lenis.
- No GSAP, React Router, or new WebGL dependency.
- `prefers-reduced-motion` must disable nonessential choreography while preserving all content.
- Concept, synthetic, illustrative, measured and verified states remain explicit.
- Motion must stay restrained: slow physics, fast interface.
- Target widths remain 1440, 1280, 1024, 768, 430, 390 and 360.

---

### Task 1: Cinematic heading primitive

**Files:**
- Create: `src/components/CinematicHeading.tsx`
- Modify: `src/components/EditorialPageHero.tsx`
- Modify: `src/marketing/Hero.tsx`
- Modify: `src/pages/TechnologyPage.tsx`
- Modify: `src/pages/PlatformPage.tsx`
- Modify: `src/pages/LabPage.tsx`
- Modify: `src/pages/PilotPage.tsx`
- Modify: `src/styles/motion.css`
- Test: `tests/test_multipage_source.py`

**Interfaces:**
- Produces: `CinematicHeading({ as, id, className, lines })` where `lines` is a readonly string array.
- Consumers: Home hero and all route-specific editorial heroes.

- [x] Add source-contract assertions for the component, per-line wrappers and reduced-motion selectors.
- [x] Run `python -m unittest tests.test_multipage_source -v` and confirm the new test fails because the primitive is absent.
- [x] Implement the primitive and convert hero headings to line arrays.
- [x] Re-run the source suite and confirm it passes.

### Task 2: Destination-media route transition

**Files:**
- Modify: `src/components/PageTransition.tsx`
- Modify: `src/styles/motion.css`
- Test: `tests/test_multipage_source.py`

**Interfaces:**
- Consumes: existing route path and `ATMORA_ASSETS` manifest.
- Produces: route-specific transition media with `page-transition__media` and a restrained image-mask reveal.

- [x] Add a failing source-contract assertion requiring a route-to-transition-asset map and `page-transition__media` styling.
- [x] Run source tests and confirm RED.
- [x] Implement route-specific transition imagery and mask choreography.
- [x] Re-run source tests and confirm GREEN.

### Task 3: Scroll-driven hero exit choreography

**Files:**
- Modify: `src/styles/motion.css`
- Modify: `src/styles/responsive.css`
- Test: `tests/test_multipage_source.py`

**Interfaces:**
- Produces: progressive enhancement under `@supports (animation-timeline: view())` for hero media, copy and page index.
- Reduced-motion contract: all scroll-driven animations explicitly disabled.

- [x] Add a failing assertion for `animation-timeline:view()` and explicit reduced-motion opt-out.
- [x] Run source tests and confirm RED.
- [x] Add subtle page-hero and home-hero exit animations behind feature detection.
- [x] Re-run source tests and confirm GREEN.

### Task 4: Route-hero asset warmup and final QA

**Files:**
- Modify: `src/lib/assets.ts`
- Modify: `src/components/RouteLink.tsx`
- Modify: `package.json`
- Modify: `README.md`
- Modify: `START_HERE_RU.md`
- Modify: `docs/QA.md`
- Test: `tests/test_multipage_source.py`

**Interfaces:**
- Produces: `heroAssetForRoute(path)` and `preloadRouteHero(path)`; `RouteLink` warms destination hero media on hover/focus/fine-pointer intent.

- [x] Add a failing source assertion for route hero asset warmup.
- [x] Run source tests and confirm RED.
- [x] Implement idempotent image warmup and link intent handlers.
- [x] Re-run `npm test` and the complete static QA matrix.
- [x] Render/inspect representative 1440 and 390 transition + hero frames and fix any overflow/crop regression.
- [x] Bump package version to `1.2.0`, update QA documentation, commit, and package source + full handoff archives.
