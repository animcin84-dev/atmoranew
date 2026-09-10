# Atmora Awwwards Multi-page Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing Atmora single-page campaign into a cinematic, accessible five-route website with signature transitions and a reusable motion system.

**Architecture:** Keep Vite + React + TypeScript and avoid new runtime dependencies. Add a small History API router, route-aware shell, route-specific pages, transition/motion primitives, and reusable editorial page heroes; reuse existing truthful product sections under the route that owns them.

**Tech Stack:** React 19, TypeScript, Vite, CSS, History API, IntersectionObserver, Pointer Events.

**Spec:** `docs/superpowers/specs/2026-09-10-atmora-awwwards-multipage-design.md`

## Global Constraints
- Native scroll only; no Lenis.
- No new WebGL dependency in this pass.
- `prefers-reduced-motion` must expose complete content and skip route choreography.
- Preserve concept/synthetic/evidence labels and do not invent product claims.
- Target widths: 1440, 1280, 1024, 768, 430, 390, 360.

---

### Task 1: Route core and navigation contract
**Files:** Create `src/lib/routes.ts`; create `src/hooks/useRouter.ts`; create `src/components/RouteLink.tsx`; modify `tests/core.test.mjs`; modify `package.json`.
**Produces:** `RoutePath`, `ATMORA_ROUTES`, `normalizePathname`, `routeForPath`, client navigation primitives.
- [x] Write route tests for normalization, known paths, fallback and route metadata.
- [x] Run tests and confirm RED.
- [x] Implement pure route resolver and hook/link integration.
- [x] Run tests and confirm GREEN.

### Task 2: Route-aware cinematic shell
**Files:** Create `src/components/PageTransition.tsx`, `src/components/RouteAnnouncer.tsx`, `src/components/DewProgress.tsx`, `src/components/MotionOrchestrator.tsx`; modify `src/App.tsx`, `src/marketing/Nav.tsx`, `src/marketing/Footer.tsx`, `src/styles/motion.css`, `src/styles/site.css`.
**Produces:** Transition phases, route metadata veil, route announcements, global progress and reveal orchestration.
- [x] Add static contract test requiring transition and reduced-motion selectors; confirm RED.
- [x] Implement shell and CSS.
- [x] Confirm static contract GREEN.

### Task 3: Route-specific page heroes and pages
**Files:** Create `src/components/EditorialPageHero.tsx`; create `src/pages/HomePage.tsx`, `TechnologyPage.tsx`, `PlatformPage.tsx`, `LabPage.tsx`, `PilotPage.tsx`; create `src/marketing/RouteTeasers.tsx`, `EvidencePrinciples.tsx`; modify reusable sections only where route CTAs/IDs require it.
**Produces:** Five deliberately composed route experiences.
- [x] Add source audit asserting all five routes and page titles; confirm RED.
- [x] Implement pages and route-specific hero variants.
- [x] Confirm source audit GREEN.

### Task 4: Awwwards interaction layer
**Files:** Create `src/components/OpticalMedia.tsx`; modify `src/components/ArrowLink.tsx`, selected marketing sections, `src/styles/motion.css`, `src/styles/site.css`, `src/styles/responsive.css`.
**Produces:** restrained magnetic CTA response, optical media parallax, editorial line/media reveals, hover transitions, mobile-menu choreography.
- [x] Add reduced-motion/static source assertions; confirm RED.
- [x] Implement interactions with fine-pointer and reduced-motion guards.
- [x] Confirm assertions GREEN.

### Task 5: QA mirror, breakpoints and handoff
**Files:** Create/update `artifacts/preview-multipage.html`; create `scripts/render_multipage_qa.py`; create `tests/test_multipage_static.py`; update `README.md`, `START_HERE_RU.md`, `docs/QA.md`.
**Produces:** STATIC RENDER PROOF for major routes at desktop/mobile and precise runtime verification instructions.
- [x] Render and inspect 1440/390 route heroes plus representative 1024/768/430/360 checks.
- [x] Fix overflow/crop/type issues discovered in render review.
- [x] Run core tests and static audits.
- [x] Attempt full typecheck/lint/build; report network/dependency blockers without inflating status.
- [x] Package upgraded source and full handoff ZIPs.
