#!/usr/bin/env python3
"""STATIC RENDER PROOF for the Atmora multi-page art direction.

This is a local DOM mirror that uses the production CSS and production image assets.
It is intentionally not presented as proof of the bundled React runtime.
"""
from __future__ import annotations

import argparse
import base64
import mimetypes
import re
from copy import deepcopy
from pathlib import Path

from bs4 import BeautifulSoup
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'scripts' / 'fixtures' / 'preview-original.html'
OUT = ROOT / 'artifacts' / 'qa' / 'multipage-static-render-proof'
ROUTES = ('home', 'technology', 'platform', 'lab', 'pilot', 'privacy')
WIDTHS = (1440, 1280, 1024, 768, 430, 390, 360)


def production_css() -> str:
    global_css = (ROOT / 'src/styles/global.css').read_text()
    global_css = '\n'.join(line for line in global_css.splitlines() if not line.lstrip().startswith('@import'))
    return '\n\n'.join([
        (ROOT / 'src/styles/tokens.css').read_text(),
        global_css,
        (ROOT / 'src/styles/site.css').read_text(),
        (ROOT / 'src/styles/responsive.css').read_text(),
        (ROOT / 'src/styles/motion.css').read_text(),
        '[data-reveal],[data-media-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}',
        '.cinematic-heading__inner{transform:none!important;animation:none!important}',
    ])


def cinematic_heading(lines: tuple[str, ...], *, tag: str = 'h1', class_name: str = '', element_id: str = '') -> str:
    id_attr = f' id="{element_id}"' if element_id else ''
    rendered = ''.join(
        f'<span class="cinematic-heading__line"><span class="cinematic-heading__inner">{line}</span></span>'
        for line in lines
    )
    return f'<{tag}{id_attr} class="cinematic-heading {class_name}">{rendered}</{tag}>'


def optical_picture(asset: str, class_name: str = '') -> str:
    """Small static equivalent of OpticalMedia.

    The static renderer intentionally uses one local WebP instead of emulating the
    runtime responsive picture source selection. Responsive source selection is
    covered by source/runtime QA; this mirror is for composition and overflow.
    """
    cls = f'optical-media {class_name}'.strip()
    return f'<div class="{cls}" data-media-reveal data-visible="true"><img src="../public/assets/{asset}" alt=""></div>'


def technology_hero() -> str:
    return f'''<section class="route-hero technology-hero section--dark" aria-labelledby="technology-page-title">
      <div class="technology-hero__media" data-route-hero-media aria-hidden="true">
        {optical_picture('condensation-flow.webp')}
        <div class="technology-hero__veil"></div>
      </div>
      <div class="technology-hero__datum" aria-hidden="true"><i></i><span class="mono">DEW POINT / THRESHOLD</span></div>
      <div class="container technology-hero__grid">
        <div class="technology-hero__copy" data-route-hero-copy data-reveal data-visible="true">
          <p class="route-hero__eyebrow mono"><span>02 / 05</span><span>Technology / physical threshold</span></p>
          {cinematic_heading(('Air crosses', 'a line.'), class_name='display technology-hero__title', element_id='technology-page-title')}
          <p class="route-hero__support">Atmospheric water begins with a measurable condition: a surface cools to the local dew point before visible condensation can begin.</p>
          <a class="button"><span>Explore the physics</span><span aria-hidden="true">→</span></a>
        </div>
        <aside class="technology-hero__instrument" aria-label="Illustrative dew-point instrument">
          <span class="route-hero__state mono">ILLUSTRATIVE PHYSICS</span>
          <div><span>Ambient</span><strong class="mono">27.1°C</strong></div>
          <div><span>RH</span><strong class="mono">64%</strong></div>
          <div class="is-threshold"><span>Dew point</span><strong class="mono">19.6°C</strong></div>
          <p class="mono">SURFACE → THRESHOLD → NUCLEATION</p>
        </aside>
      </div>
    </section>'''


def platform_hero() -> str:
    trace = ''.join([
        '<div><span class="mono">01</span><strong>Conditions</strong><small>Temperature / RH / dew point</small></div>',
        '<div><span class="mono">02</span><strong>Telemetry</strong><small>Water / energy / operating state</small></div>',
        '<div><span class="mono">03</span><strong>Interpretation</strong><small>Context before recommendation</small></div>',
    ])
    return f'''<section class="route-hero platform-hero section--dark" aria-labelledby="platform-page-title">
      <div class="container platform-hero__head" data-route-hero-copy data-reveal data-visible="true">
        <p class="route-hero__eyebrow mono"><span>03 / 05</span><span>Platform / conditions into operation</span></p>
        <div class="platform-hero__headline-grid">
          {cinematic_heading(('Measure', 'what changes.'), class_name='platform-hero__title', element_id='platform-page-title')}
          <p class="route-hero__support">Climate, energy, water state and system behavior remain connected to the conditions that produced them.</p>
        </div>
      </div>
      <div class="platform-hero__stage" data-route-hero-media>
        <div class="platform-hero__trace" aria-label="Conditions become operational telemetry">{trace}</div>
        {optical_picture('cloud-dashboard.webp', 'platform-hero__media')}
        <span class="route-hero__state platform-hero__state mono">SYNTHETIC DEMO / INTERFACE STUDY</span>
      </div>
      <div class="container platform-hero__footer"><a class="button button--ghost"><span>Enter Atmora Cloud</span><span>→</span></a><p class="mono">MEASUREMENT FIRST / PREDICTION WHEN DATA EARNS IT</p></div>
    </section>'''


def lab_hero() -> str:
    states = ''.join(
        f'<li><span class="mono">0{i}</span><strong>{label}</strong></li>'
        for i, label in enumerate(('RAW CONDENSATE', 'TREATED WATER', 'VERIFICATION', 'VERIFIED FOR INTENDED USE'), start=1)
    )
    return f'''<section class="route-hero lab-hero" aria-labelledby="lab-page-title">
      <div class="container lab-hero__grid">
        <div class="lab-hero__ledger" data-route-hero-copy data-reveal data-visible="true">
          <p class="route-hero__eyebrow mono"><span>04 / 05</span><span>Atmora Lab / evidence chain</span></p>
          <span class="lab-hero__batch mono">BATCH / A-00284</span>
          {cinematic_heading(('Evidence', 'before confidence.'), class_name='lab-hero__title', element_id='lab-page-title')}
          <p class="route-hero__support">A litre is not just a volume. Conditions, treatment, verification scope and evidence class determine what can truthfully be said about it.</p>
          <a class="button button--dark"><span>Read the evidence chain</span><span>→</span></a>
        </div>
        <div class="lab-hero__record" data-route-hero-media>{optical_picture('water-batch.webp', 'lab-hero__media')}<span class="route-hero__state mono">SYNTHETIC DEMO / EVIDENCE RECORD</span></div>
        <ol class="lab-hero__states" aria-label="Water evidence states">{states}</ol>
      </div>
    </section>'''


def pilot_hero() -> str:
    return f'''<section class="route-hero pilot-hero" aria-labelledby="pilot-page-title">
      <div class="pilot-hero__scene" data-route-hero-media>
        {optical_picture('usecase-hospitality.webp')}
        <div class="pilot-hero__veil"></div>
        <span class="route-hero__state pilot-hero__state mono">CONCEPT SITE / ASSESSMENT CONTEXT</span>
        <div class="pilot-hero__site-note mono"><span>SITE FIRST</span><i></i><span>CONDITIONS BEFORE CAPACITY</span></div>
      </div>
      <div class="container pilot-hero__panel" data-route-hero-copy data-reveal data-visible="true">
        <p class="route-hero__eyebrow mono"><span>05 / 05</span><span>Pilot / conditions into decision</span></p>
        <div class="pilot-hero__copy">
          {cinematic_heading(('A site', 'before a machine.'), class_name='pilot-hero__title', element_id='pilot-page-title')}
          <div class="pilot-hero__aside"><p>A site assessment defines the question. A measured pilot tests climate, device behavior, water pathway and energy context before a larger decision.</p><a class="button button--dark"><span>Assess your site</span><span>→</span></a></div>
        </div>
        <div class="pilot-hero__protocol mono"><span>SITE</span><i></i><span>ASSESSMENT</span><i></i><span>PILOT</span><i></i><span>MEASUREMENT</span><i></i><span>DECISION</span></div>
      </div>
    </section>'''


def privacy_hero() -> str:
    return '''<header class="legal-page__hero container">
      <p class="route-hero__eyebrow mono"><span>UTILITY</span><span>Privacy / data state</span></p>
      <h1 id="privacy-title" class="legal-page__title">Privacy<br>by state.</h1>
      <p class="legal-page__lede">Atmora treats personal data the same way it treats water and evidence: the state must be explicit before a claim or action is made.</p>
    </header>'''


def privacy_body() -> str:
    rows = (
        ('01','Local demo','Nothing leaves the browser.','When no production assessment endpoint is configured, the Site Assessment remains a local interface demonstration and does not transmit the entered information.'),
        ('02','Remote submission','Consent comes before contact.','If a production endpoint is configured, assessment context and contact details can be sent only after explicit privacy acknowledgement.'),
        ('03','Purpose','Assessment context, not hidden profiling.','The supplied frontend uses these fields to provide context for a site conversation and does not invent advertising or sensitive-profile claims.'),
        ('04','Deployment responsibility','The operator must define the real policy.','A live deployment must publish the responsible legal entity, contact, retention and processor details instead of fabricating them in a template.'),
    )
    items = ''.join(f'<section><span class="legal-page__index mono">{idx}</span><div><p class="kicker">{kicker}</p><h2>{title}</h2><p>{copy}</p></div></section>' for idx,kicker,title,copy in rows)
    return f'<div class="legal-page__body container">{items}<aside class="legal-page__boundary"><span class="mono">DATA THRESHOLD</span><strong>LOCAL STATE <i></i> EXPLICIT CONSENT <i></i> REMOTE REQUEST</strong><a>Return to site assessment →</a></aside></div>'


def route_teasers() -> str:
    rows = [
        ('02','Technology','Cross the physical threshold.','condensation-growth.webp','technology'),
        ('03','Platform','Turn conditions into legible operation.','cloud-dashboard.webp','platform'),
        ('04','Atmora Lab','Give every litre an evidence state.','water-batch.webp','lab'),
    ]
    html = ['<section class="route-teasers section--dark"><div class="container route-teasers__head"><p class="kicker">Explore the system</p><h2 class="display display--md">One atmosphere.<br>Three deeper views.</h2></div><div class="route-teasers__list">']
    for idx,label,title,asset,cls in rows:
        html.append(f'''<a class="route-teaser route-teaser--{cls}"><div class="container route-teaser__grid"><span class="route-teaser__index mono">{idx}</span><div class="route-teaser__copy"><span class="data-label">{label}</span><h3>{title}</h3><span class="route-teaser__action">Explore chapter <b>↗</b></span></div><div class="optical-media route-teaser__media"><img src="../public/assets/{asset}" alt=""></div></div></a>''')
    html.append('</div></section>')
    return ''.join(html)


def principles() -> str:
    fields = [
        ('01','PHYSICS','TRUTH OVER HYPE.','Claims stay behind evidence, never ahead of it.','PHYSICS BEFORE AI.','The atmosphere and machine define the operating envelope before software interprets it.'),
        ('02','EVIDENCE','MEASUREMENT BEFORE PREDICTION.','Models become useful only when measured behavior can ground them.','UNCERTAINTY STAYS VISIBLE.','Unknown is a valid evidence state — not a space to fill with marketing.'),
        ('03','DECISION','SAFETY BEFORE GROWTH.','Raw, treated and verified water states remain visibly distinct.','PILOT BEFORE SCALE.','A site earns confidence through measured operation in its own conditions.'),
    ]
    items = ''.join(
        f'''<li data-reveal data-visible="true"><div class="container principles__threshold-grid">
          <div class="principles__axis"><span class="mono">{idx}</span><strong>{axis}</strong></div>
          <div class="principles__threshold-line" aria-hidden="true"><i></i></div>
          <article><h3>{t1}</h3><p>{p1}</p></article><article><h3>{t2}</h3><p>{p2}</p></article>
        </div></li>'''
        for idx,axis,t1,p1,t2,p2 in fields
    )
    return f'''<section class="principles section section--dark" aria-labelledby="principles-title">
      <div class="container principles__intro" data-reveal data-visible="true"><p class="kicker">Atmora Lab / operating principles</p><div class="principles__intro-grid"><h2 id="principles-title" class="display display--md">Confidence<br>is earned.</h2><p class="body-lg">Atmora treats honesty as part of the interface. Each claim crosses a boundary only when the evidence underneath it has changed state.</p></div></div>
      <ol class="principles__thresholds">{items}</ol>
    </section>'''


def climate_instrument() -> str:
    return '''<section id="technology" class="climate section section--light" aria-labelledby="climate-title">
      <div class="container climate__intro" data-reveal data-visible="true"><p class="kicker">Climate reality / 01</p><div class="climate__intro-grid"><h2 id="climate-title" class="display display--md">Same machine.<br>Different air.<br>Different result.</h2><div><p class="body-lg">No fixed litre claim can describe every atmosphere. Temperature and relative humidity change the dew point — and the physical range.</p><p class="climate__note mono">Interactive physics only. This instrument calculates dew point; it does not predict Atmora litres or SEC.</p></div></div></div>
      <div class="container climate__instrument" data-reveal data-visible="true" aria-label="Interactive dew-point instrument" style="--dew-position:61%;--humidity-alpha:.22">
        <header class="climate__instrument-head"><div><span class="data-label">Ambient air</span><strong class="mono">27.0°C</strong></div><div><span class="data-label">Relative humidity</span><strong class="mono">64% RH</strong></div><div class="climate__dew-readout"><span class="data-label">Calculated dew point</span><strong class="mono">19.6°C</strong></div></header>
        <div class="climate__condition-field" aria-hidden="true"><div class="climate__field-atmosphere"></div><div class="climate__field-grid"></div><div class="climate__threshold-axis"><span class="mono">DEW POINT / 19.6°C</span><i></i></div><div class="climate__field-copy"><span class="mono">AIR / 27.0°C</span><strong>COOL A SURFACE<br>TO THIS THRESHOLD.</strong></div><div class="climate__phase-labels mono"><span>VAPOUR</span><span>CONDENSATION POSSIBLE</span></div></div>
        <div class="climate__controls"><label class="climate__control"><span><b>Temperature</b><output class="mono">27°C</output></span><input aria-label="Temperature in degrees Celsius" type="range" min="0" max="45" value="27"></label><label class="climate__control"><span><b>Relative humidity</b><output class="mono">64%</output></span><input aria-label="Relative humidity percentage" type="range" min="10" max="95" value="64"></label><p class="climate__explain">When surface temperature reaches the calculated dew point, condensation becomes thermodynamically possible. Actual production still depends on the system and operating conditions.</p></div>
      </div>
    </section>'''


def intelligence_field() -> str:
    traces = ''.join([
        '<div><span class="mono">01</span><strong>CONDITIONS</strong><small>Air defines the envelope.</small></div><i aria-hidden="true"></i>',
        '<div><span class="mono">02</span><strong>MEASUREMENT</strong><small>Sensors record what happened.</small></div><i aria-hidden="true"></i>',
        '<div><span class="mono">03</span><strong>INTERPRETATION</strong><small>Relationships become visible.</small></div><i aria-hidden="true"></i>',
        '<div><span class="mono">04</span><strong>DECISION</strong><small>Prediction waits for evidence.</small></div>',
    ])
    readouts = ''.join(
        f'<div><dt class="mono">{label}</dt><dd>{value}</dd><span class="mono">{status}</span></div>'
        for label,value,status in (
            ('TEMP','27.1°C','ILLUSTRATIVE'),('RH','64%','ILLUSTRATIVE'),('DEW','19.6°C','DERIVED'),('SEC','— kWh/L','AWAIT MEASUREMENT')
        )
    )
    return f'''<section class="intelligence section--dark" aria-labelledby="intelligence-title">
      <img class="intelligence__bg" src="../public/assets/measurement-mountains.webp" alt=""><div class="intelligence__veil"></div>
      <div class="container intelligence__content"><div class="intelligence__head" data-reveal data-visible="true"><div><p class="kicker">Intelligence / 04</p><h2 id="intelligence-title" class="display display--md">Measure first.<br>Predict when the<br>data earns it.</h2></div><p class="body-lg">Atmora Intelligence starts with physical measurements. Predictions and operating recommendations should come later, after evidence is sufficient.</p></div>
      <div class="intelligence__telemetry" data-reveal data-visible="true"><div class="telemetry__trace" aria-label="Atmora intelligence evidence flow">{traces}</div><div class="telemetry__field"><div class="telemetry__grid" aria-hidden="true"></div><svg class="telemetry__signal" viewBox="0 0 1000 250" preserveAspectRatio="none" aria-hidden="true"><path d="M0 160 C70 150 100 105 170 124 S285 190 350 137 S455 84 525 112 S650 186 720 132 S830 91 1000 106"></path><path class="telemetry__signal--secondary" d="M0 82 C100 98 155 62 240 77 S355 115 440 91 S590 49 670 73 S820 119 1000 86"></path></svg><div class="telemetry__annotation mono"><span>ILLUSTRATIVE SIGNAL SHAPE</span><span>NOT FIELD PERFORMANCE DATA</span></div><div class="telemetry__threshold mono"><span>EVIDENCE THRESHOLD</span><i></i></div></div><dl class="telemetry__readouts">{readouts}</dl></div></div>
    </section>'''


def pilot_framework() -> str:
    stages = (
        ('01','SITE','Define location, intended use and constraints.','CONTEXT'),
        ('02','ASSESSMENT','Review climate context and decide what must be measured.','ASSUMPTIONS'),
        ('03','PILOT','Operate a defined system for a defined purpose and window.','OPERATION'),
        ('04','MEASUREMENT','Capture climate, water, energy and operational state.','EVIDENCE'),
        ('05','REPORT','Separate measured results from estimates and unknowns.','INTERPRETATION'),
        ('06','DECISION','Scale, change the system, or stop based on evidence.','GO / CHANGE / STOP'),
    )
    rail = ''.join(f'<li><span class="pilot__index mono">{idx}</span><h3>{title}</h3><p>{copy}</p><strong class="mono">{state}</strong></li>' for idx,title,copy,state in stages)
    return f'''<section id="pilot" class="pilot section section--light" aria-labelledby="pilot-title">
      <div class="container pilot__head" data-reveal data-visible="true"><div><p class="kicker">Pilot methodology / 08</p><h2 id="pilot-title" class="display display--md">Pilot before<br>scale.</h2></div><div class="pilot__head-copy"><p class="body-lg">The commercial path is not “buy now.” A credible pilot reduces uncertainty at the site before a larger decision is made.</p><p class="mono">THE OUTPUT IS NOT A SALES BADGE. IT IS A DECISION.</p></div></div>
      <div class="container pilot__framework" data-reveal data-visible="true"><div class="pilot__framework-head mono"><span>INPUT</span><span>MEASUREMENT WINDOW</span><span>DECISION</span></div><ol class="pilot__decision-rail">{rail}</ol><div class="pilot__outcome"><p class="data-label">Decision boundary</p><strong class="mono">GO / CHANGE / STOP</strong><p>Confidence is useful only when it changes the next decision. A pilot can justify expansion, reveal a redesign requirement, or show that the site is not suitable.</p></div></div>
    </section>'''


def chapter_next(index: str, label: str, title: str, asset: str) -> str:
    return f'''<a class="chapter-next section--dark"><div class="optical-media chapter-next__media"><img src="../public/assets/{asset}" alt=""></div><div class="chapter-next__veil"></div><div class="container chapter-next__layout"><span class="chapter-next__index mono">{index}</span><div><span class="kicker">Next / {label}</span><h2 class="display display--lg">{title}</h2><span class="chapter-next__action">Open chapter <b>↗</b></span></div></div></a>'''


def section_html(soup: BeautifulSoup, selector: str) -> str:
    node = soup.select_one(selector)
    if not node:
        raise RuntimeError(f'missing base selector {selector}')
    return str(deepcopy(node))


def nav_html(surface: str = 'dark') -> str:
    wordmark = '''<svg class="atmora-wordmark" viewBox="0 0 176 28" aria-hidden="true" fill="none"><g class="atmora-wordmark__letters" stroke="currentColor" stroke-width="1.65"><path d="M2 23 11 4l9 19M6.2 14.2h9.6"/><path d="M27 4h18M36 4v19"/><path d="M53 23V4l10 12 10-12v19"/><path d="M84 13.5C84 7.1 88.2 3.5 94 3.5s10 3.6 10 10-4.2 10-10 10-10-3.6-10-10Z"/><path d="M114 23V4h8.7c5.1 0 8.1 2.5 8.1 6.4 0 4-3 6.5-8.1 6.5H114M123 16.9l9.7 6.1"/><path d="M141 23 150 4l9 19M145.2 14.2h9.6"/></g><g class="wordmark-threshold" stroke="currentColor" stroke-width="1" opacity=".46"><path d="M54 26.5h49"/><circle cx="94" cy="26.5" r="1.45" fill="currentColor" stroke="none"/></g><path d="M166 8v9" stroke="currentColor" opacity=".38"/><circle cx="166" cy="20.5" r="1.7" fill="currentColor"/></svg>'''
    return f'''<header class="site-nav" data-surface="{surface}" data-scrolled="false"><a class="site-nav__brand">{wordmark}<span class="sr-only">Atmora home</span></a><nav class="site-nav__links"><a>Technology</a><a>Platform</a><a>Pilot</a><a>Atmora Lab</a></nav><a class="site-nav__cta">Assess your site <span>→</span></a><button class="site-nav__menu-button" aria-label="Open menu"><i></i><i></i></button></header><div class="dew-progress"><span style="transform:scaleX(.18)"></span><i style="left:18%"></i></div>'''


def transition_markup(label: str = 'Measurement into insight', index: str = '03', asset: str = 'cloud-dashboard.webp') -> str:
    return f'''<div class="page-transition" data-transition-phase="cover" data-route="/platform" data-reduced-data="false" aria-hidden="true">
      <div class="page-transition__atmosphere"></div><div class="page-transition__dry-state"></div>
      <div class="page-transition__media-wrap page-transition__condensed-state"><img class="page-transition__media" src="../public/assets/{asset}" alt=""><div class="page-transition__media-veil"></div></div>
      <div class="page-transition__dew-line"><i></i><span class="mono">SURFACE = DEW POINT</span></div>
      <div class="page-transition__content container"><span class="page-transition__index mono">{index} / 05</span><div><span class="page-transition__eyebrow mono">ATMORA / STATE CHANGE</span><strong>{label}</strong></div><span class="page-transition__line"></span></div>
      <div class="page-transition__datum mono">DRY STATE / THRESHOLD / CONDENSED STATE</div>
    </div>'''


def footer_html(soup: BeautifulSoup) -> str:
    footer = deepcopy(soup.select_one('.footer'))
    if footer:
        nav = footer.select_one('nav')
        if nav and not nav.find(string=lambda value: value and value.strip() == 'Privacy'):
            link = soup.new_tag('a')
            link.string = 'Privacy'
            nav.append(link)
    return str(footer)


def build_documents() -> dict[str, str]:
    soup = BeautifulSoup(BASE.read_text(), 'html.parser')
    home_title = soup.select_one('.hero__title')
    if home_title:
        home_title['class'] = list(home_title.get('class', [])) + ['cinematic-heading']
        home_title.clear()
        for line_text in ('Water is', 'already here.'):
            outer = soup.new_tag('span', attrs={'class':'cinematic-heading__line'})
            inner = soup.new_tag('span', attrs={'class':'cinematic-heading__inner'})
            inner.string = line_text
            outer.append(inner)
            home_title.append(outer)
    footer = footer_html(soup)
    home = ''.join([
        section_html(soup, '.hero'), section_html(soup, '.physical-thesis'), section_html(soup, '.condensation'), section_html(soup, '.manifesto'), route_teasers(), section_html(soup, '.closing')
    ])
    technology = ''.join([
        technology_hero(), climate_instrument(), section_html(soup, '.condensation'), section_html(soup, '.device'), section_html(soup, '.energy'), chapter_next('03','Platform','Measure what changes.','atmosphere-light.webp')
    ])
    platform = ''.join([
        platform_hero(), intelligence_field(), section_html(soup, '.cloud'), section_html(soup, '.energy'), chapter_next('04','Atmora Lab','Make evidence visible.','condensation-growth.webp')
    ])
    lab = ''.join([
        lab_hero(), principles(), section_html(soup, '.evidence'), section_html(soup, '.batch'), chapter_next('05','Pilot','Prove it on site.','usecase-research.webp')
    ])
    pilot = ''.join([
        pilot_hero(), section_html(soup, '.use-cases'), pilot_framework(), section_html(soup, '.questions'), section_html(soup, '.assessment'), chapter_next('01','Home','Return to the atmosphere.','hero-condensation.webp')
    ])
    privacy = '<article class="legal-page section--light">' + privacy_hero() + privacy_body() + '</article>'
    body = {'home':home,'technology':technology,'platform':platform,'lab':lab,'pilot':pilot,'privacy':privacy}
    docs = {}
    for name, content in body.items():
        docs[name] = f'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>{production_css()}</style></head><body>{nav_html('light') if name == 'privacy' else nav_html()}<main id="main">{content}</main>{footer}</body></html>'
    return docs


def inline_assets(html: str) -> str:
    pat = re.compile(r'\.\./public/assets/([A-Za-z0-9_.-]+)')
    cache: dict[str,str] = {}
    def repl(match: re.Match[str]) -> str:
        name = match.group(1)
        if name not in cache:
            path = ROOT / 'public' / 'assets' / name
            mime = mimetypes.guess_type(name)[0] or 'application/octet-stream'
            cache[name] = f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode()
        return cache[name]
    return pat.sub(repl, html)


def contact(route: str, width: int, shots: list[Path]) -> None:
    thumb = 260 if width >= 768 else 180
    cells = []
    for shot in shots:
        image = Image.open(shot).convert('RGB')
        h = round(image.height * thumb / image.width)
        image = image.resize((thumb,h))
        cell = Image.new('RGB',(thumb,h+28),'white')
        cell.paste(image,(0,28))
        ImageDraw.Draw(cell).text((7,7),shot.stem,fill='black')
        cells.append(cell)
    sheet = Image.new('RGB',(thumb*len(cells),max(c.height for c in cells)),(226,226,226))
    for i,cell in enumerate(cells): sheet.paste(cell,(i*thumb,0))
    sheet.save(OUT/f'{route}-{width}-contact.jpg',quality=88)


def main() -> None:
    parser = argparse.ArgumentParser(description='Render Atmora static QA proofs in reproducible route/width batches.')
    parser.add_argument('--route', action='append', choices=tuple(ROUTES) + ('all',), help='Route key to render; repeat for multiple routes.')
    parser.add_argument('--width', action='append', type=int, choices=WIDTHS, help='Viewport width to render; repeat for multiple widths.')
    args = parser.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    docs = build_documents()
    selected_routes = list(docs) if not args.route or 'all' in args.route else list(dict.fromkeys(args.route))
    selected_widths = list(WIDTHS) if not args.width else list(dict.fromkeys(args.width))
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-dev-shm-usage'])
        for route in selected_routes:
            doc = docs[route]
            html = inline_assets(doc)
            for width in selected_widths:
                height = 900 if width >= 768 else 844
                page = browser.new_page(viewport={'width':width,'height':height})
                page.set_content(html, wait_until='load')
                overflow = page.evaluate('Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-window.innerWidth')
                cinematicClip = page.evaluate('''() => Math.max(0, ...Array.from(document.querySelectorAll('.route-hero .cinematic-heading__line')).map(el => el.scrollWidth - el.clientWidth))''')
                if cinematicClip > 1:
                    raise RuntimeError(f'{route} {width}: cinematic heading clip {cinematicClip}px')
                hero_path = OUT / f'{route}-{width}-hero.png'
                page.screenshot(path=str(hero_path))
                if width in (1440,390):
                    section = page.locator('.legal-page__body').first if route == 'privacy' else page.locator('main > :nth-child(2)').first
                    if section.count():
                        section.scroll_into_view_if_needed()
                        page.wait_for_timeout(60)
                        second_path = OUT / f'{route}-{width}-second.png'
                        page.screenshot(path=str(second_path))
                        contact(route,width,[hero_path,second_path])
                print(route,width,'overflow',overflow)
                page.close()
        for width in (w for w in (1440, 390) if w in selected_widths):
            height = 900 if width >= 768 else 844
            transition = browser.new_page(viewport={'width':width,'height':height})
            transition_doc = f'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>{production_css()}</style></head><body>{transition_markup()}</body></html>'
            transition.set_content(inline_assets(transition_doc), wait_until='load')
            transition.wait_for_timeout(620)
            transition.screenshot(path=str(OUT/f'transition-v12-{width}.png'))
            transition.close()
        if 'technology' in selected_routes and 390 in selected_widths:
            reduced = browser.new_page(viewport={'width':390,'height':844})
            reduced.emulate_media(reduced_motion='reduce')
            reduced.set_content(inline_assets(docs['technology']), wait_until='load')
            reduced.screenshot(path=str(OUT/'technology-390-reduced-hero.png'))
            reduced.close()
        browser.close()
    print('STATIC RENDER PROOF', OUT)

if __name__ == '__main__':
    main()
