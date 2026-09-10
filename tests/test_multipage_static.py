import unittest
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
import sys
sys.path.insert(0, str(ROOT / 'scripts'))
import render_multipage_qa as qa  # noqa: E402


class MultiPageStaticTests(unittest.TestCase):
    def test_route_teaser_headlines_do_not_clip_inside_mobile_grid(self):
        docs = qa.build_documents()
        html = qa.inline_assets(docs['home'])
        with sync_playwright() as pw:
            browser = pw.chromium.launch(
                headless=True,
                executable_path='/usr/bin/chromium',
                args=['--no-sandbox', '--disable-dev-shm-usage'],
            )
            try:
                for width in (430, 390, 360):
                    page = browser.new_page(viewport={'width': width, 'height': 844})
                    page.set_content(html, wait_until='load')
                    clipped = page.evaluate("""Array.from(document.querySelectorAll('.route-teaser__copy h3')).map((e) => ({text:e.textContent.trim(), overflow:e.scrollWidth-e.clientWidth})).filter((x) => x.overflow > 0)""")
                    page.close()
                    self.assertEqual(clipped, [], f'{width}px route teaser headlines clip: {clipped}')
            finally:
                browser.close()

    def test_route_hero_titles_preserve_mobile_gutter(self):
        docs = qa.build_documents()
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
            try:
                selectors = {
                    'technology': '.technology-hero__title',
                    'platform': '.platform-hero__title',
                    'lab': '.lab-hero__title',
                    'pilot': '.pilot-hero__title',
                }
                for route, selector in selectors.items():
                    page = browser.new_page(viewport={'width': 390, 'height': 844})
                    page.set_content(qa.inline_assets(docs[route]), wait_until='load')
                    box = page.locator(selector).bounding_box()
                    page.close()
                    self.assertIsNotNone(box)
                    self.assertLessEqual(box['x'] + box['width'], 372.5, f'{route} title violates right gutter')
            finally:
                browser.close()

    def test_mobile_transition_label_does_not_clip(self):
        docs = qa.build_documents()
        html = docs['home'].replace('<body>', '<body>' + qa.transition_markup())
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
            try:
                page = browser.new_page(viewport={'width': 390, 'height': 844})
                page.set_content(qa.inline_assets(html), wait_until='load')
                page.wait_for_timeout(420)
                clipped = page.evaluate("""(() => { const e=document.querySelector('.page-transition__content strong'); return {overflow:e.scrollWidth-e.clientWidth,right:e.getBoundingClientRect().right}; })()""")
                page.close()
                self.assertLessEqual(clipped['overflow'], 0, f"transition text clips internally: {clipped}")
                self.assertLessEqual(clipped['right'], 372.5, f"transition text violates mobile gutter: {clipped}")
            finally:
                browser.close()

    def test_mobile_transition_index_stays_on_one_line(self):
        docs = qa.build_documents()
        html = docs['home'].replace('<body>', '<body>' + qa.transition_markup())
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
            try:
                page = browser.new_page(viewport={'width': 390, 'height': 844})
                page.set_content(qa.inline_assets(html), wait_until='load')
                page.wait_for_timeout(420)
                metrics = page.evaluate("""(() => { const e=document.querySelector('.page-transition__index'); const r=e.getBoundingClientRect(); const cs=getComputedStyle(e); return {height:r.height,lineHeight:parseFloat(cs.lineHeight)||0,text:e.textContent.trim()}; })()""")
                page.close()
                self.assertLessEqual(metrics['height'], max(16, metrics['lineHeight'] * 1.35), f"transition index wrapped: {metrics}")
            finally:
                browser.close()

    def test_route_cinematic_heading_reveals_when_copy_becomes_visible(self):
        motion = (ROOT / 'src/styles/motion.css').read_text()
        html = f'''<!doctype html><style>:root{{--ease-physics:cubic-bezier(.2,.8,.2,1)}}{motion}</style>
        <section class="route-hero"><div id="copy" data-route-hero-copy>
          <h1 class="cinematic-heading"><span class="cinematic-heading__line"><span id="inner" class="cinematic-heading__inner">Evidence</span></span></h1>
        </div></section>'''
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
            try:
                page = browser.new_page(viewport={'width': 1000, 'height': 700})
                page.set_content(html, wait_until='load')
                before = page.locator('#inner').evaluate('(node) => getComputedStyle(node).transform')
                page.locator('#copy').evaluate('(node) => node.dataset.visible = "true"')
                page.wait_for_timeout(1000)
                after = page.locator('#inner').evaluate('(node) => getComputedStyle(node).transform')
                page.close()
                self.assertNotEqual(before, 'none', 'route heading should begin behind its line mask')
                self.assertEqual(after, 'none', 'visible route copy must reveal its cinematic heading')
            finally:
                browser.close()

    def test_pilot_desktop_primary_statement_is_complete_in_first_viewport(self):
        docs = qa.build_documents()
        html = qa.inline_assets(docs['pilot'])
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
            try:
                page = browser.new_page(viewport={'width': 1440, 'height': 900})
                page.set_content(html, wait_until='load')
                box = page.locator('.pilot-hero__title').bounding_box()
                page.close()
                self.assertIsNotNone(box)
                self.assertLessEqual(
                    box['y'] + box['height'],
                    884,
                    f"Pilot primary statement falls below the first desktop viewport: {box}",
                )
            finally:
                browser.close()

    def test_technology_mobile_instrument_separates_labels_from_values(self):
        docs = qa.build_documents()
        html = qa.inline_assets(docs['technology'])
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
            try:
                page = browser.new_page(viewport={'width': 390, 'height': 844})
                page.set_content(html, wait_until='load')
                rows = page.evaluate("""Array.from(document.querySelectorAll('.technology-hero__instrument > div')).map((row) => {
                  const label = row.querySelector('span').getBoundingClientRect();
                  const value = row.querySelector('strong').getBoundingClientRect();
                  return { labelBottom: label.bottom, valueTop: value.top, labelRight: label.right, valueLeft: value.left };
                })""")
                page.close()
                for row in rows:
                    self.assertLessEqual(
                        row['labelBottom'] + 2,
                        row['valueTop'],
                        f"Technology mobile label/value hierarchy collapsed: {row}",
                    )
            finally:
                browser.close()

    def test_technology_desktop_threshold_annotation_does_not_cross_headline(self):
        docs = qa.build_documents()
        html = qa.inline_assets(docs['technology'])
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
            try:
                page = browser.new_page(viewport={'width': 1440, 'height': 900})
                page.set_content(html, wait_until='load')
                collision = page.evaluate("""(() => {
                  const label = document.querySelector('.technology-hero__datum span').getBoundingClientRect();
                  const title = document.querySelector('.technology-hero__title').getBoundingClientRect();
                  const overlaps = !(label.right <= title.left || label.left >= title.right || label.bottom <= title.top || label.top >= title.bottom);
                  return { overlaps, label: label.toJSON(), title: title.toJSON() };
                })()""")
                page.close()
                self.assertFalse(collision['overlaps'], f"Technology threshold annotation crosses headline: {collision}")
            finally:
                browser.close()

    def test_lab_desktop_title_preserves_gap_before_evidence_record(self):
        docs = qa.build_documents()
        html = qa.inline_assets(docs['lab'])
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
            try:
                page = browser.new_page(viewport={'width': 1440, 'height': 900})
                page.set_content(html, wait_until='load')
                metrics = page.evaluate("""(() => {
                  const title = document.querySelector('.lab-hero__title');
                  const record = document.querySelector('.lab-hero__record');
                  const titleBox = title.getBoundingClientRect();
                  const recordBox = record.getBoundingClientRect();
                  const lines = Array.from(title.querySelectorAll('.cinematic-heading__inner')).map((line) => ({
                    text: line.textContent.trim(),
                    right: line.getBoundingClientRect().right,
                  }));
                  return { titleRight: titleBox.right, recordLeft: recordBox.left, lines };
                })()""")
                page.close()
                self.assertLessEqual(
                    metrics['titleRight'] + 28,
                    metrics['recordLeft'],
                    f"Lab desktop headline collides with evidence record: {metrics}",
                )
            finally:
                browser.close()

    def test_static_renderer_preserves_global_css_after_removing_font_imports(self):
        css = qa.production_css()
        self.assertNotIn('@import', css)
        self.assertIn('body{', css)
        self.assertIn('font-family:var(--font-sans)', css.replace(' ', ''))
        self.assertIn('.button{', css)
        self.assertIn(':focus-visible', css)
        docs = qa.build_documents()
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
            try:
                page = browser.new_page(viewport={'width': 390, 'height': 844})
                page.set_content(qa.inline_assets(docs['privacy']), wait_until='load')
                body_family = page.locator('body').evaluate('(node) => getComputedStyle(node).fontFamily')
                page.close()
                self.assertIn('IBM Plex Sans', body_family)
            finally:
                browser.close()


if __name__ == '__main__':
    unittest.main()
