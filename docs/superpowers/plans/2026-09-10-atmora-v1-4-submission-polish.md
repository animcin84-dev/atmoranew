# Atmora v1.4 Submission Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the remaining submission-level business-completeness and brand-metadata gaps that can be proven without an npm-installed runtime.

**Architecture:** Keep the existing Vite/React History API router and route metadata manifest. Add legal/privacy routes and remote-submit consent as truthful production safeguards, then add first-party browser/app identity assets and ensure prerender/hosting metadata cover the expanded public site. Finish with the full offline QA matrix and a v1.4 handoff.

**Tech Stack:** React 19, TypeScript, Vite, History API router, static prerender script, CSS, Python QA, Node core tests.

**Spec:** `/mnt/data/ATMORA_v1.2_AWWWARDS_FORENSIC_AUDIT_AND_PLAN.md`

## Global Constraints
- Preserve product truth: no fake certifications, customers, pilots, data, or legal entity claims.
- Remote assessment submission must require explicit privacy acknowledgement.
- Local demo mode must not transmit contact data.
- No new runtime dependency.
- All public routes must prerender and deep-link correctly.
- Target widths remain 1440, 1280, 1024, 768, 430, 390 and 360.

---

### Task 1: Privacy route and remote-submit consent

**Files:**
- Modify: `src/lib/assessment.ts`
- Modify: `src/lib/routes.ts`
- Modify: `src/lib/routeMeta.json`
- Modify: `src/App.tsx`
- Modify: `src/marketing/SiteAssessment.tsx`
- Modify: `src/marketing/Footer.tsx`
- Create: `src/pages/PrivacyPage.tsx`
- Modify: `public/_redirects`
- Modify: `vercel.json`
- Test: `tests/core.test.mjs`
- Test: `tests/test_multipage_source.py`

**Interfaces:**
- `AssessmentData.privacyAccepted: boolean`.
- `validateAssessmentStep(3, data)` rejects remote-ready contact submission without acknowledgement.
- `/privacy` is a real public route and prerender target.

- [x] Add failing core and source contracts.
- [x] Run the focused tests and confirm RED.
- [x] Implement privacy acknowledgement, route and page.
- [x] Re-run focused tests and confirm GREEN.

### Task 2: Browser/app identity metadata

**Files:**
- Create: `public/favicon.svg`
- Create: `public/site.webmanifest`
- Modify: `index.html`
- Modify: `scripts/prerender.mjs`
- Test: `tests/test_multipage_source.py`

**Interfaces:**
- Favicon and webmanifest are first-party static assets.
- Prerendered route documents preserve icon/manifest metadata.

- [x] Add failing source contract.
- [x] Confirm RED.
- [x] Add identity assets and head metadata.
- [x] Confirm GREEN.

### Task 3: Expanded route/release QA and v1.4 handoff

**Files:**
- Modify: `tests/core.test.mjs`
- Modify: `tests/e2e/runtime.spec.ts`
- Modify: `README.md`
- Modify: `START_HERE_RU.md`
- Modify: `docs/QA.md`
- Modify: `package.json`

**Interfaces:**
- Public route contract includes `/privacy` without changing numbered creative chapters 01–05.
- Release docs distinguish offline PASS from dependency-backed BLOCKED checks.

- [x] Extend route/runtime source contracts.
- [x] Run full offline verification and 6-route responsive matrix where applicable.
- [x] Bump package version to 1.4.0 and update docs.
- [x] Commit and package source + full handoff archives.
