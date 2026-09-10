#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / 'public' / 'assets'

MAX_TOTAL_BYTES = 6 * 1024 * 1024
MAX_SINGLE_IMAGE_BYTES = 260 * 1024
MAX_LCP_AVIF_BYTES = 120 * 1024
MAX_MOBILE_LCP_AVIF_BYTES = 90 * 1024

LCP_DESKTOP = (
    'hero-condensation.avif',
    'condensation-flow.avif',
    'cloud-dashboard.avif',
    'water-batch.avif',
    'usecase-hospitality.avif',
)
LCP_MOBILE = (
    'hero-condensation-mobile.avif',
    'condensation-flow-mobile.avif',
    'cloud-dashboard-mobile.avif',
    'water-batch-mobile.avif',
    'usecase-hospitality-mobile.avif',
)


def fail(message: str) -> None:
    raise SystemExit(f'ASSET BUDGET FAIL: {message}')


def main() -> None:
    media = [path for path in ASSET_DIR.iterdir() if path.is_file() and path.suffix.lower() in {'.avif', '.webp', '.png', '.jpg', '.jpeg'}]
    total = sum(path.stat().st_size for path in media)
    if total > MAX_TOTAL_BYTES:
        fail(f'total image payload {total / 1024 / 1024:.2f} MiB exceeds {MAX_TOTAL_BYTES / 1024 / 1024:.2f} MiB')

    oversized = [path for path in media if path.stat().st_size > MAX_SINGLE_IMAGE_BYTES]
    if oversized:
        fail('single image budget exceeded: ' + ', '.join(f'{path.name}={path.stat().st_size / 1024:.1f} KiB' for path in oversized))

    for name in LCP_DESKTOP:
        path = ASSET_DIR / name
        if not path.exists():
            fail(f'missing desktop LCP AVIF {name}')
        if path.stat().st_size > MAX_LCP_AVIF_BYTES:
            fail(f'{name} is {path.stat().st_size / 1024:.1f} KiB; desktop LCP cap is {MAX_LCP_AVIF_BYTES / 1024:.0f} KiB')

    for name in LCP_MOBILE:
        path = ASSET_DIR / name
        if not path.exists():
            fail(f'missing mobile LCP AVIF {name}')
        if path.stat().st_size > MAX_MOBILE_LCP_AVIF_BYTES:
            fail(f'{name} is {path.stat().st_size / 1024:.1f} KiB; mobile LCP cap is {MAX_MOBILE_LCP_AVIF_BYTES / 1024:.0f} KiB')

    print(f'ASSET BUDGET PASS: {len(media)} images, {total / 1024 / 1024:.2f} MiB total')
    print(f'  single image <= {MAX_SINGLE_IMAGE_BYTES / 1024:.0f} KiB')
    print(f'  desktop LCP AVIF <= {MAX_LCP_AVIF_BYTES / 1024:.0f} KiB')
    print(f'  mobile LCP AVIF <= {MAX_MOBILE_LCP_AVIF_BYTES / 1024:.0f} KiB')


if __name__ == '__main__':
    main()
