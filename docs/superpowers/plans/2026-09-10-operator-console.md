# Atmora Operator Console Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete frontend-only Atmora Operator Console under `/app` without changing the public site's product-truth boundary.

**Architecture:** Extend the existing History API router with operator/static and dynamic detail routes. Render an `OperatorShell` instead of the public Nav/Footer/transition stack for operator routes. Feed all screens from typed immutable synthetic datasets and keep UI-only preferences in localStorage.

**Tech Stack:** React 19, TypeScript 5, Vite 5, CSS, inline SVG; no backend and no new runtime dependency.

**Spec:** `docs/superpowers/specs/2026-09-10-operator-console-design.md`

## Global Constraints
- Frontend only: no auth, database, API, payments or fake remote persistence.
- Synthetic telemetry and evidence must be labelled.
- Treatment must not imply potable verification.
- Public marketing routes must keep current behaviour.
- No new runtime dependency unless unavoidable.
- Responsive targets: 1440, 1280, 1024, 768, 430, 390, 360.
- Reduced motion and WCAG-oriented keyboard/focus behaviour are mandatory.

---

### Task 1: Operator route contract
**Files:** Modify `src/lib/routes.ts`, `src/hooks/useRouter.tsx`, `src/lib/assets.ts`; Test `tests/test_operator_console_source.py`, `tests/core.test.mjs`.
**Interfaces:** Produces `isOperatorRoute(route)`, dynamic route resolution and immediate app-to-app navigation.
- [ ] Write route/source tests for all `/app` routes and dynamic device/batch detail routes.
- [ ] Run them and confirm RED because operator routes do not exist.
- [ ] Implement typed route resolution and app transition bypass.
- [ ] Run tests and confirm GREEN.

### Task 2: Synthetic data model
**Files:** Create `src/data/devices.ts`, `telemetry.ts`, `batches.ts`, `alerts.ts`, `maintenance.ts`, `reports.ts`; Test `tests/test_operator_console_source.py`.
**Interfaces:** Produces immutable typed datasets and lookup helpers used by all app pages.
- [ ] Add source tests requiring explicit `synthetic-demo` provenance and water-state terminology.
- [ ] Verify RED.
- [ ] Implement datasets and helpers.
- [ ] Verify GREEN.

### Task 3: Operator shell
**Files:** Create `src/app/OperatorShell.tsx`, `src/app/OperatorNav.tsx`, `src/app/AppHeader.tsx`; Modify `src/App.tsx`; Create `src/styles/console.css`, `console-responsive.css`; Modify `src/main.tsx` imports.
**Interfaces:** Produces desktop/mobile shell and module navigation.
- [ ] Add source tests for direct `/app` rendering and public-shell separation.
- [ ] Verify RED.
- [ ] Implement shell, responsive rail and synthetic-demo indicator.
- [ ] Verify GREEN and zero-overflow static structure.

### Task 4: Overview + data visualization primitives
**Files:** Create `src/app/components/MetricReadout.tsx`, `Sparkline.tsx`, `StatusChip.tsx`, `WaterStateBadge.tsx`, `src/app/pages/OverviewPage.tsx`.
**Interfaces:** Produces shared app primitives and overview dashboard.
- [ ] Add source tests for SVG/CSS charts and truthful labels.
- [ ] Verify RED.
- [ ] Implement overview.
- [ ] Verify GREEN.

### Task 5: Devices + device detail
**Files:** Create `src/app/pages/DevicesPage.tsx`, `DeviceDetailPage.tsx`.
**Interfaces:** Consumes device/telemetry/maintenance datasets; produces searchable/filterable fleet and detail view.
- [ ] Add source tests for filters, table semantics and detail-route lookup.
- [ ] Verify RED.
- [ ] Implement pages.
- [ ] Verify GREEN.

### Task 6: Fleet + analytics
**Files:** Create `src/app/pages/FleetPage.tsx`, `AnalyticsPage.tsx`, `src/app/components/FleetMap.tsx`, `RangeTabs.tsx`.
**Interfaces:** Produces schematic fleet map and interactive time-range analytics.
- [ ] Add source tests for map status labels and 24H/7D/30D/90D controls.
- [ ] Verify RED.
- [ ] Implement pages.
- [ ] Verify GREEN.

### Task 7: Water ledger + batch detail
**Files:** Create `src/app/pages/WaterPage.tsx`, `BatchDetailPage.tsx`.
**Interfaces:** Produces evidence-state chain, searchable ledger and detailed synthetic batch evidence object.
- [ ] Add tests requiring canonical safety-state language.
- [ ] Verify RED.
- [ ] Implement pages.
- [ ] Verify GREEN.

### Task 8: Alerts + maintenance + reports + settings
**Files:** Create `AlertsPage.tsx`, `MaintenancePage.tsx`, `ReportsPage.tsx`, `SettingsPage.tsx`, `src/app/useConsolePreferences.ts`.
**Interfaces:** Produces frontend-only alert acknowledgement, service timeline, report library and local settings persistence.
- [ ] Add tests forbidding fake server action wording and requiring localStorage-only settings.
- [ ] Verify RED.
- [ ] Implement pages.
- [ ] Verify GREEN.

### Task 9: Responsive/accessibility/motion polish
**Files:** Modify `src/styles/console.css`, `console-responsive.css`, `motion.css`; Test `tests/test_operator_console_source.py` and browser/static QA.
**Interfaces:** Final responsive console system.
- [ ] Add tests for reduced motion, mobile touch targets, focus styles and no horizontal overflow contract.
- [ ] Verify RED where applicable.
- [ ] Implement responsive/motion/accessibility rules.
- [ ] Verify GREEN.

### Task 10: Documentation and release verification
**Files:** Modify `README.md`, `START_HERE_RU.md`, `docs/QA.md`, `package.json`; create operator QA proof when available.
**Interfaces:** Documents frontend-only `/app` demo and verification commands.
- [ ] Update docs/version only after implementation.
- [ ] Run `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` where dependencies are available.
- [ ] Run source/static responsive verification and `git diff --check`.
- [ ] Commit the verified feature branch and package source/handoff artifacts.
