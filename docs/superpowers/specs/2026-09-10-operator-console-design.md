# Atmora Operator Console — Frontend-Only Design

## Goal
Extend the current Atmora public experience into a complete frontend-only product ecosystem under `/app`, using synthetic demo data and no backend, authentication, database, or fake server actions.

## Product boundary
- Public marketing routes remain visually and structurally intact.
- `/app` is directly accessible with no login/auth gate.
- All console values are synthetic demo data and are labelled as such where a user could mistake them for live device data.
- No write action may imply a remote side effect. Client preferences may persist to `localStorage` only.
- Water safety states remain explicit: RAW CONDENSATE → TREATED → VERIFICATION → VERIFIED FOR INTENDED USE.

## Route system
- `/app/overview`
- `/app/devices`
- `/app/devices/:deviceId`
- `/app/fleet`
- `/app/analytics`
- `/app/water`
- `/app/water/:batchId`
- `/app/alerts`
- `/app/maintenance`
- `/app/reports`
- `/app/settings`
- `/app` canonicalizes to `/app/overview` in the route resolver.

## Visual system
The Operator Console is a distinct product surface that still belongs to Atmora. It uses Atmospheric Black, Night Surface, Condensate White, Steel Blue, Measurement Cyan and semantic status colours. Layouts use thin rules, spatial data fields, large instrument readouts, restrained translucency, editorial headings, industrial media and fast interface motion. It avoids generic SaaS bento grids and repeated rounded cards.

## Shell
Desktop uses a persistent left rail with Atmora wordmark, primary modules, synthetic-demo badge, compact environment summary and a return-to-site link. The content area has a context header, route title, clock-free synthetic status label, and responsive utility controls. Mobile uses a compact top bar and horizontally scrollable module rail rather than shrinking the desktop sidebar.

## Core page designs
- Overview: current device hero, water today, climate, dew point, tank/treatment/energy/alerts, SVG production + atmospheric charts and recent activity.
- Devices: searchable/filterable fleet table, status and water-state filters, responsive card fallback, row-to-detail navigation.
- Device detail: concept device visual, telemetry strip, production/climate/energy/evidence panels, treatment and maintenance timeline.
- Fleet: editorial fleet statement, geographic schematic map, status summary, alerts rail, fleet table.
- Analytics: 24H/7D/30D/90D periods, production/energy/climate/operating-window visualizations built with SVG/CSS.
- Water: evidence state pipeline plus searchable batch ledger.
- Water batch: evidence-object layout with climate, condensation, treatment, verification and explicit synthetic status.
- Alerts: severity filters and non-destructive acknowledge UI held in local component state only.
- Maintenance: service condition timeline, component life indicators, due/attention states.
- Reports: document-oriented report library with frontend preview cards; download controls are disabled/labelled demo unless a real file exists.
- Settings: units, display density, motion preference and notification-demo preferences persisted to `localStorage` only.

## Motion
Public site keeps slow physics. Console uses fast interface motion: 140–220ms state changes, line/chart draw-in, route content crossfade, row highlight, filter transitions and alert emphasis. No global page wipe inside `/app`; operator navigation should feel immediate.

## Responsive and accessibility
Target 1440, 1280, 1024, 768, 430, 390 and 360. All interactive elements are keyboard reachable, 44px touch targets on mobile, visible focus, semantic tables where tables are retained, labels for filters/search, reduced-motion support, sufficient status text beyond colour, and horizontal overflow must remain zero.

## Architecture
`src/app/` owns shell and route pages. `src/data/` owns immutable synthetic datasets. `src/components/` retains shared public primitives. Existing router is extended to resolve operator routes and dynamic IDs. Operator navigation bypasses cinematic page transitions and route-hero preloading. Console styling lives in `src/styles/console.css` and `src/styles/console-responsive.css`.
