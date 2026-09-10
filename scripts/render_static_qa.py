#!/usr/bin/env python3
"""Local, non-network static visual QA for Atmora.

This renders a maintained static DOM mirror with the production CSS and inlined
local assets. Outputs are labelled STATIC RENDER PROOF; they are not proof of a
bundled React runtime.
"""
from __future__ import annotations
import base64,mimetypes,re
from pathlib import Path
from PIL import Image,ImageDraw
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'artifacts'/'qa'/'static-render-proof'
WIDTHS=[1440,1280,1024,768,430,390,360]
CHECKPOINTS=[('hero','#top'),('physical','.physical-thesis'),('climate','#technology'),('condensation','#condensation'),('system','.system'),('device','.device'),('intelligence','.intelligence'),('cloud','#platform'),('evidence','#evidence'),('batch','.batch'),('use-cases','.use-cases'),('pilot','#pilot'),('questions','.questions'),('closing','.closing'),('assessment','#assessment')]
def production_css():
    (ROOT/'artifacts').mkdir(parents=True, exist_ok=True)
    g=(ROOT/'src/styles/global.css').read_text()
    g='\n'.join(x for x in g.splitlines() if not x.lstrip().startswith('@import'))
    css='\n\n'.join([(ROOT/'src/styles/tokens.css').read_text(),g,(ROOT/'src/styles/site.css').read_text(),(ROOT/'src/styles/responsive.css').read_text(),(ROOT/'src/styles/motion.css').read_text()])
    (ROOT/'artifacts/preview.css').write_text(css)
    return css
def inlined_html(css):
    html=(ROOT/'scripts/fixtures/preview-original.html').read_text().replace('<link rel="stylesheet" href="preview.css">',f'<style>{css}</style>')
    pat=re.compile(r'\.\./public/assets/([A-Za-z0-9_.-]+)'); cache={}
    def repl(m):
        n=m.group(1)
        if n not in cache:
            p=ROOT/'public/assets'/n; mime=mimetypes.guess_type(n)[0] or 'application/octet-stream'
            cache[n]=f'data:{mime};base64,'+base64.b64encode(p.read_bytes()).decode()
        return cache[n]
    return pat.sub(repl,html)
def goto(page,selector):
    page.evaluate("document.documentElement.style.scrollBehavior='auto'")
    page.evaluate("""selector=>{const e=document.querySelector(selector);if(!e)throw new Error('missing '+selector);window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY)}""",selector)
    page.wait_for_timeout(70)
def contact(width):
    ps=[OUT/f'{width}-{n}.png' for n,_ in CHECKPOINTS]
    tw=240 if width>=768 else 180; cells=[]
    for p in ps:
        im=Image.open(p).convert('RGB'); th=round(im.height*tw/im.width); im=im.resize((tw,th))
        cell=Image.new('RGB',(tw,th+28),'white');cell.paste(im,(0,28));ImageDraw.Draw(cell).text((7,7),p.stem,fill='black');cells.append(cell)
    cols=3; ch=max(c.height for c in cells); rows=(len(cells)+cols-1)//cols; sheet=Image.new('RGB',(cols*tw,rows*ch),(225,225,225))
    for i,c in enumerate(cells): sheet.paste(c,((i%cols)*tw,(i//cols)*ch))
    sheet.save(OUT/f'{width}-contact.jpg',quality=88)
def main():
    OUT.mkdir(parents=True,exist_ok=True);html=inlined_html(production_css())
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
        for w in WIDTHS:
            h=900 if w>=768 else 844; page=browser.new_page(viewport={'width':w,'height':h})
            page.set_content(html,wait_until='load'); page.screenshot(path=str(OUT/f'{w}-hero.png'))
            for n,s in CHECKPOINTS[1:]: goto(page,s);page.screenshot(path=str(OUT/f'{w}-{n}.png'))
            # overflow audit
            overflow=page.evaluate('Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-window.innerWidth')
            print('width',w,'horizontal-overflow',overflow)
            page.close();contact(w)
        reduced=browser.new_page(viewport={'width':390,'height':844}); reduced.emulate_media(reduced_motion='reduce');reduced.set_content(html,wait_until='load');goto(reduced,'#condensation');reduced.screenshot(path=str(OUT/'390-condensation-reduced-motion.png'));goto(reduced,'.condensation__static');reduced.screenshot(path=str(OUT/'390-condensation-reduced-stages.png'));reduced.close();browser.close()
    print('STATIC RENDER PROOF',OUT)
if __name__=='__main__':main()
