import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))

import render_static_qa as qa  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402


class StaticLayoutTests(unittest.TestCase):
    def test_all_target_breakpoints_have_no_horizontal_overflow(self):
        html = qa.inlined_html(qa.production_css())
        with sync_playwright() as pw:
            browser = pw.chromium.launch(
                headless=True,
                executable_path='/usr/bin/chromium',
                args=['--no-sandbox', '--disable-dev-shm-usage'],
            )
            try:
                for width in (1440, 1280, 1024, 768, 430, 390, 360):
                    page = browser.new_page(viewport={'width': width, 'height': 844})
                    page.set_content(html, wait_until='load')
                    overflow = page.evaluate(
                        'Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - window.innerWidth'
                    )
                    page.close()
                    self.assertLessEqual(
                        overflow,
                        0,
                        f'{width}px layout overflows horizontally by {overflow}px',
                    )
            finally:
                browser.close()

    def test_interactive_climate_ranges_have_accessible_labels(self):
        html = qa.inlined_html(qa.production_css())
        with sync_playwright() as pw:
            browser = pw.chromium.launch(
                headless=True,
                executable_path='/usr/bin/chromium',
                args=['--no-sandbox', '--disable-dev-shm-usage'],
            )
            try:
                page = browser.new_page(viewport={'width': 390, 'height': 844})
                page.set_content(html, wait_until='load')
                unlabeled = page.evaluate(
                    "Array.from(document.querySelectorAll('input[type=range]')).filter(i => (!i.labels || i.labels.length === 0) && !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby')).length"
                )
                page.close()
                self.assertEqual(unlabeled, 0, 'All climate range inputs need accessible labels')
            finally:
                browser.close()

    def test_reduced_motion_exposes_static_condensation_stages(self):
        html = qa.inlined_html(qa.production_css())
        with sync_playwright() as pw:
            browser = pw.chromium.launch(
                headless=True,
                executable_path='/usr/bin/chromium',
                args=['--no-sandbox', '--disable-dev-shm-usage'],
            )
            try:
                page = browser.new_page(viewport={'width': 390, 'height': 844})
                page.emulate_media(reduced_motion='reduce')
                page.set_content(html, wait_until='load')
                display = page.evaluate("getComputedStyle(document.querySelector('.condensation__static')).display")
                stage_count = page.locator('.condensation__static li').count()
                page.close()
                self.assertEqual(display, 'grid')
                self.assertEqual(stage_count, 8)
            finally:
                browser.close()


if __name__ == '__main__':
    unittest.main()
