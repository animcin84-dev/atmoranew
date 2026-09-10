# Atmora Awwwards Multi-page Upgrade Design

## Goal
Transform the current single-page Atmora experience into a production-oriented multi-page cinematic website while preserving scientific honesty, accessibility, native scrolling, and mobile art direction.

## Routes
- `/` — campaign-level introduction: atmosphere, condensation, system, use-case and pilot teasers.
- `/technology` — atmospheric physics, dew point, condensation sequence, concept device architecture and energy context.
- `/platform` — measurement-first intelligence, Atmora Cloud, climate/energy interpretation and operational evidence.
- `/lab` — evidence states, traceability, synthetic Water Batch interface and scientific operating principles.
- `/pilot` — pilot methodology, use-case scenes, hard questions and progressive site assessment.

## Navigation and transition model
Use a small History API router rather than add a routing dependency. Internal route links push browser history, preserve normal modifier-click/new-tab behavior, support back/forward, announce the new route to assistive technology, reset scroll intentionally, and fall back to ordinary links when JavaScript is unavailable.

Page navigation uses one signature transition: a condensation-like dark veil covers the old page, route metadata appears briefly, content switches while covered, then the veil reveals the new page. `prefers-reduced-motion` skips the choreography and navigates immediately.

## Motion language
- Slow physics: background drift, optical media movement, dew-line progress.
- Fast interface: 180–300 ms links, menu, state changes.
- Scroll reveals use clipping/masks and small translation, not universal fade-up.
- Selected media receives a restrained pointer parallax/refraction response on fine pointers only.
- Page-specific hero media and typography establish route identity.
- All meaningful content is readable without animation.

## Page composition
Home remains the cinematic campaign entry, but no longer carries every detailed product section. Technology owns physics/device, Platform owns intelligence/cloud, Lab owns evidence/batch, Pilot owns qualification/conversion. Cross-route editorial teasers keep the narrative connected.

## Accessibility and performance
- WCAG 2.2 AA target.
- Route announcer and visible focus.
- 44px touch targets.
- Reduced-motion equivalent.
- No scroll hijacking or smooth-scroll dependency.
- No new WebGL dependency for the multi-page pass.
- Existing local assets remain the only required media; concept/synthetic labels stay visible.
- Avoid adding dependencies while npm registry access is unavailable.

## Verification
Core routing behavior receives automated tests. Static source audits verify route coverage and transition/reduced-motion contracts. Static render proof is explicitly labeled as a local DOM mirror, not a bundled React runtime. Final React build/typecheck/lint is run only when dependencies are available.
