#!/usr/bin/env python3
from pathlib import Path
import base64,re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
css=(ROOT/'artifacts/preview.css').read_text()
html=(ROOT/'artifacts/preview.html').read_text().replace('<link rel="stylesheet" href="preview.css">',f'<style>{css}</style>')
pat=re.compile(r'\.\./public/assets/([A-Za-z0-9_.-]+)')
html=pat.sub(lambda m:'data:image/webp;base64,'+base64.b64encode((ROOT/'public/assets'/m.group(1)).read_bytes()).decode(),html)
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    page=browser.new_page(viewport={'width':390,'height':844})
    page.set_content(html,wait_until='load')
    overflow=page.evaluate('Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-window.innerWidth')
    bad=page.evaluate('''() => [...document.querySelectorAll('a,button,input,summary')]
      .filter(e=>{let p=e;while(p){const s=getComputedStyle(p);if(s.display==='none'||s.visibility==='hidden')return false;p=p.parentElement}return true})
      .map(e=>{const r=e.getBoundingClientRect();return {tag:e.tagName,text:(e.textContent||e.getAttribute('aria-label')||'').trim().slice(0,40),width:r.width,height:r.height}})
      .filter(x=>x.width<44||x.height<44)''')
    headings=page.evaluate("[...document.querySelectorAll('h1,h2,h3')].map(e=>[e.tagName,(e.textContent||'').trim().replace(/\\s+/g,' ')])")
    browser.close()
print('horizontal-overflow',overflow)
print('touch-targets-below-44',bad)
print('heading-count',len(headings),'h1-count',sum(1 for h,_ in headings if h=='H1'))
if overflow or bad or sum(1 for h,_ in headings if h=='H1')!=1: raise SystemExit(1)
