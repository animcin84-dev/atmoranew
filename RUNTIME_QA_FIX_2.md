# ATMORA v2.0 — Runtime QA Fix 2

This patch addresses the two real Chromium runtime failures exposed after the browser-launch fix.

## 1. Mobile navigation focus

The overlay previously transitioned `visibility` for the full UI duration. React attempted to focus the first mobile navigation link on the next animation frame, while Chromium could still consider the overlay hidden. The overlay now becomes `visibility: visible` immediately when opening and delays `visibility: hidden` until the close fade completes.

Expected runtime behavior:
- opening the mobile menu moves focus to `Technology`;
- Tab / Shift+Tab stay inside the dialog;
- Escape closes it;
- focus returns to the menu trigger.

## 2. 400% reflow QA

The old test used `document.documentElement.style.zoom = '4'`. CSS `zoom` magnifies the desktop layout without changing responsive media-query evaluation, so it is not a faithful browser-zoom/reflow test.

The runtime test now models the effective CSS viewport directly: a 1440×900 viewport at 400% is approximately 360×225 CSS pixels. Responsive media queries therefore participate exactly as they do when the browser exposes the reduced CSS viewport.

## Local verification performed for this patch

- source tests: 85 / 85 pass
- core + Playwright-launcher tests: 14 / 14 pass
- asset budget: pass (69 images, 4.91 MiB)

Full Playwright runtime must be run on a machine with the npm dependencies installed:

```bash
npm install
npm run qa:runtime
```
