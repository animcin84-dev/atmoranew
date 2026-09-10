#!/usr/bin/env python3
from __future__ import annotations
import argparse, base64, mimetypes
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'artifacts'/'qa'/'console-static-render-proof'
ROUTES=('overview','devices','device','fleet','analytics','water','batch','alerts','maintenance','reports','settings')
WIDTHS=(1440,1280,1024,768,430,390,360)

def css():
    g=(ROOT/'src/styles/global.css').read_text()
    g='\n'.join(line for line in g.splitlines() if not line.lstrip().startswith('@import'))
    return '\n'.join([(ROOT/'src/styles/tokens.css').read_text(),g,(ROOT/'src/styles/console.css').read_text(),(ROOT/'src/styles/console-responsive.css').read_text()])

def data_uri(name:str)->str:
    p=ROOT/'public'/'assets'/name
    mime=mimetypes.guess_type(p.name)[0] or 'application/octet-stream'
    return f'data:{mime};base64,'+base64.b64encode(p.read_bytes()).decode()

DEVICE=data_uri('device-concept.webp')

def chip(status,label=None): return f'<span class="status-chip" data-status="{status}"><i></i>{label or status}</span>'
def water(state):
    tone='verified' if state.startswith('VERIFIED') else 'verification' if state=='VERIFICATION' else 'treated' if state=='TREATED' else 'raw'
    return f'<span class="water-state-badge" data-water-state="{tone}">{state}</span>'

def nav(active):
    items=[('Overview','overview','⌁','01'),('Devices','devices','▤','02'),('Fleet','fleet','⌖','03'),('Analytics','analytics','⌁','04'),('Water','water','◌','05'),('Alerts','alerts','!','06'),('Maintenance','maintenance','◇','07'),('Reports','reports','▧','08'),('Settings','settings','··','09')]
    links=''.join(f'<a aria-current="page"' if key==active else '<a' for _,key,_,_ in [])
    out=[]
    for label,key,icon,idx in items:
        current=' aria-current="page"' if (active==key or (active=='device' and key=='devices') or (active=='batch' and key=='water')) else ''
        out.append(f'<a{current}><i>{icon}</i><span>{label}</span><small>{idx}</small></a>')
    return f'''<aside class="console-rail"><div class="console-rail__brand"><a><svg viewBox="0 0 220 44" width="104"><text x="0" y="31" fill="white" font-family="Arial" font-size="30" font-weight="600">ATMORA</text><path d="M0 40H220" stroke="#80d7f5"/></svg></a><span>OPERATOR</span></div><nav class="console-rail__nav">{''.join(out)}</nav><div class="console-rail__foot"><div><span class="console-kicker">Environment</span><strong><i class="status-dot"></i>Synthetic demo</strong><small>No live device connection</small></div><a>Return to site <span>↗</span></a></div></aside>'''

def header(title,index): return f'<header class="console-header"><div><span class="console-kicker">Operator console / SYNTHETIC DEMO DATA</span><h1>{title}</h1></div><div class="console-header__meta"><span><i class="status-dot"></i>Demo environment</span><span class="mono">{index} / APP</span></div></header>'

def metric(label,value,unit,note='Synthetic demo'): return f'<article class="metric-readout"><div class="metric-readout__label"><span>{label}</span></div><p><strong>{value}</strong><small>{unit}</small></p><div class="metric-readout__note">{note}</div></article>'
def chart(label,value='527 L'):
    pts='M8 158 L62 150 L116 132 L170 119 L224 93 L278 101 L332 72 L386 83 L440 54 L494 46 L548 34 L592 28'
    return f'''<figure class="console-chart"><figcaption><span>{label}</span><strong>{value}</strong></figcaption><svg viewBox="0 0 600 180" preserveAspectRatio="none"><g class="console-chart__grid"><path d="M0 30H600M0 75H600M0 120H600M0 165H600"/></g><path class="console-chart__area" d="{pts} L592 180 L8 180 Z"/><path class="console-chart__line" d="{pts}"/><circle class="is-last" cx="592" cy="28" r="4"/></svg></figure>'''

def overview(): return f'''<section class="overview-hero"><div class="overview-hero__copy"><span class="console-kicker">Primary device / synthetic demo</span><div class="overview-hero__title"><div><h2>A-001</h2>{chip('online')}</div><p>Site Alpha<br><span>Almaty</span></p></div><a class="console-link">Inspect device ↗</a></div><figure class="overview-hero__device"><span class="media-label">Concept system view</span><img src="{DEVICE}"><figcaption class="mono">SN A001-24-7F3</figcaption></figure><div class="overview-hero__water"><span class="console-kicker">Water produced today</span><strong>527</strong><span>L</span>{water('VERIFICATION')}</div></section><section class="metric-band">{metric('Temperature','27.1','°C','Ambient')}{metric('Relative humidity','64','%','Ambient')}{metric('Dew point','19.6','°C','Calculated demo')}{metric('Tank level','72','%')}{metric('Energy intensity','.71','kWh/L')}</section><section class="overview-grid">{chart('Water production / 24H')}<div class="overview-grid__conditions">{chart('Temperature','27.1°C')}{chart('Relative humidity','64%')}</div></section><section class="activity-panel"><div class="console-section-head"><div><span class="console-kicker">Latest synthetic events</span><h2>Recent activity</h2></div><a class="console-link">Open alerts ↗</a></div><ol class="activity-list"><li><time>14:42</time><strong>A-001</strong><p>Batch A-00284 entered VERIFICATION</p><i></i></li><li><time>14:37</time><strong>A-006</strong><p>Energy intensity moved above planning band</p><i></i></li><li><time>12:08</time><strong>A-005</strong><p>Maintenance mode entered</p><i></i></li></ol></section>'''

def devices():
    rows=[]
    for i,(site,status,l,waterstate) in enumerate([('Site Alpha','online',527,'VERIFICATION'),('Vancouver Lab','online',384,'TREATED'),('Nordic Test','warning',163,'RAW CONDENSATE'),('East Field','online',612,'VERIFIED FOR INTENDED USE'),('Research Annex','maintenance',0,'TREATED'),('Dry Air Lab','warning',118,'VERIFICATION')],1):
        rows.append(f'<tr><td><strong>A-00{i}</strong><small>Array {i}</small></td><td>{site}<small>Region</small></td><td>{chip(status)}</td><td>27.1°C<small>64% RH</small></td><td>{l} L</td><td>{water(waterstate)}</td><td>.71 kWh/L</td><td>↗</td></tr>')
    cards=''.join(f'<a class="device-card"><div><strong>A-00{i}</strong>{chip(status)}</div><h3>{site}</h3><p>Region</p><dl><div><dt>Water</dt><dd>{l} L</dd></div><div><dt>Climate</dt><dd>27° / 64%</dd></div><div><dt>Tank</dt><dd>72%</dd></div></dl>{water(ws)}</a>' for i,(site,status,l,ws) in enumerate([('Site Alpha','online',527,'VERIFICATION'),('Nordic Test','warning',163,'RAW CONDENSATE'),('East Field','online',612,'VERIFIED FOR INTENDED USE')],1))
    return f'''<section class="console-toolbar"><label class="console-search"><span>Search devices</span><input value="" placeholder="ID, site or region"></label><div class="console-toolbar__filters"><div class="filter-chips"><button aria-pressed="true">all</button><button>online</button><button>warning</button><button>maintenance</button></div><select aria-label="Device water state"><option>All water states</option><option>RAW CONDENSATE</option><option>TREATED</option><option>VERIFICATION</option><option>VERIFIED FOR INTENDED USE</option></select></div></section><section class="device-ledger"><div class="console-section-head"><div><span class="console-kicker">Device fleet / SYNTHETIC DEMO DATA</span><h2>06 visible devices</h2></div><span class="mono">4 online / 8 total</span></div><div class="device-table-wrap"><table class="device-table"><thead><tr><th>Device</th><th>Site</th><th>Status</th><th>Climate</th><th>Water today</th><th>Water state</th><th>Energy</th><th></th></tr></thead><tbody>{''.join(rows)}</tbody></table></div><div class="device-cards">{cards}</div></section>'''

def device(): return f'''<section class="device-detail__hero"><div class="device-detail__identity"><a class="console-back">← Devices</a><span class="console-kicker">Device record / synthetic demo</span><div><h2>A-001</h2>{chip('online')}</div><p>Site Alpha<br><span>Almaty / SN A001-24-7F3</span></p>{water('VERIFICATION')}</div><figure><span class="media-label">Concept system view</span><img src="{DEVICE}"></figure></section><section class="metric-band">{metric('Water today','527','L')}{metric('Temperature','27.1','°C')}{metric('RH','64','%')}{metric('Dew point','19.6','°C')}{metric('Energy','.71','kWh/L')}</section><section class="device-detail__charts">{chart('Production response')}{chart('Energy intensity','.71 kWh/L')}{chart('Temperature','27.1°C')}{chart('Relative humidity','64%')}</section>'''

def fleet():
    pins=''.join(f'<a class="fleet-map__pin" data-status="{status}" style="left:{x}%;top:{y}%"><i></i><span><b>{city}</b><small>{id}</small></span></a>' for city,id,status,x,y in [('Vancouver','A-002','online',14,27),('Reykjavik','A-003','warning',44,18),('Almaty','A-001','online',67,32),('Tokyo','A-004','online',84,37),('Nairobi','A-005','maintenance',58,60),('Sydney','A-007','online',88,75)])
    return f'''<section class="fleet-statement"><div><span class="console-kicker">Fleet health / synthetic demo</span><h2>A CLEARER WORLD<br>RUNS ON A<br><em>HEALTHY FLEET.</em></h2></div><p>One spatial view of device availability, local atmospheric conditions and operator attention — without implying a live deployment.</p></section><section class="fleet-map"><div class="fleet-map__header"><div><span class="console-kicker">Geographic schematic / synthetic demo</span><h2>Operating field</h2></div><div class="fleet-map__legend"><span><i></i>online</span><span><i data-status="warning"></i>attention</span><span><i data-status="offline"></i>offline</span></div></div><div class="fleet-map__stage"><svg class="fleet-map__grid" viewBox="0 0 1000 520"><path d="M0 104H1000M0 208H1000M0 312H1000M0 416H1000M166 0V520M332 0V520M498 0V520M664 0V520M830 0V520"/><path class="fleet-map__arc" d="M40 356C170 90 342 76 465 245S730 430 954 115"/></svg>{pins}<div class="fleet-map__readout"><span class="console-kicker">Fleet state</span><strong>4/8</strong><small>online / synthetic</small>{chip('warning','2 attention')}</div></div></section>'''

def analytics(): return f'''<section class="analytics-lead"><div><span class="console-kicker">Measured response / SYNTHETIC DEMO DATA</span><h2>Conditions shape<br><em>the result.</em></h2></div><div class="range-tabs"><button data-active="true">24H</button><button>7D</button><button>30D</button><button>90D</button></div></section><section class="analytics-primary">{chart('Production / 24H')}<div class="analytics-primary__summary"><span class="console-kicker">Selected window</span><strong>24H</strong><p>Numbers demonstrate interface behaviour only. They are not field validation or rated output.</p></div></section><section class="analytics-grid">{chart('Energy intensity','.71 kWh/L')}{chart('Ambient temperature','27.1°C')}{chart('Relative humidity','64%')}<div class="operating-window"><span class="console-kicker">Operating window</span><div class="operating-window__field"><i></i><i></i><i></i><span>dry / constrained</span><span>measured-demo band</span><span>humid / favourable</span></div><p>Physics sets the range.</p></div></section>'''

def water_page():
    states=''.join(f'<div><span>0{i}</span><strong>{st}</strong><i></i></div>' for i,st in enumerate(['RAW CONDENSATE','TREATED','VERIFICATION','VERIFIED FOR INTENDED USE'],1))
    rows=''.join(f'<a><span class="mono">A-0028{i}</span><div><strong>A-00{i}</strong><small>Site Alpha</small></div><div><strong>{70+i*4} L</strong><small>2026-09-10 14:42</small></div>{water(st)}<b>↗</b></a>' for i,st in enumerate(['VERIFICATION','TREATED','VERIFIED FOR INTENDED USE','RAW CONDENSATE'],1))
    return f'''<section class="water-states"><span class="console-kicker">Evidence chain</span><h2>EVERY LITRE<br>HAS A STATE.</h2><div class="water-states__rail">{states}</div><p>RAW CONDENSATE is not TREATED water. Treatment alone does not mean drinking-water certification.</p></section><section class="console-toolbar"><label class="console-search"><span>Search batches</span><input placeholder="Batch, device or site"></label><select><option>All water states</option></select></section><section class="batch-ledger"><div class="console-section-head"><div><span class="console-kicker">Batch ledger / synthetic demo</span><h2>04 evidence records</h2></div></div><div class="batch-list">{rows}</div></section>'''

def batch():
    path=''.join(f'<div data-state="{state}"><span>0{i}</span><strong>{label}</strong><i></i></div>' for i,(label,state) in enumerate([('RAW CONDENSATE','complete'),('TREATED','complete'),('VERIFICATION','active'),('VERIFIED FOR INTENDED USE','pending')],1))
    return f'''<section class="batch-detail__hero"><a class="console-back">← Water ledger</a><span class="console-kicker">Water batch / SYNTHETIC DEMO DATA</span><h2>A-00284</h2><div><strong>84<small>L</small></strong>{water('VERIFICATION')}</div><p>Site Alpha / A-001<br><span>2026-09-10 14:42</span></p></section><section class="batch-state-path">{path}</section><section class="batch-evidence-grid"><article><span class="console-kicker">Climate</span><dl><div><dt>Temperature</dt><dd>27.1°C</dd></div><div><dt>RH</dt><dd>64%</dd></div><div><dt>Dew point</dt><dd>19.6°C</dd></div></dl></article><article><span class="console-kicker">Treatment</span><h3>Treatment cycle complete</h3><p>No treatment label implies potable certification.</p></article><article><span class="console-kicker">Verification</span><h3>Awaiting intended-use verification</h3></article><article><span class="console-kicker">Provenance</span><h3>synthetic-demo</h3></article></section>'''

def alerts():
    rows=''.join(f'<article>{chip(sev)}<div><div class="alert-list__id"><strong>{id}</strong><span>AL-04{i}</span></div><h3>{title}</h3><p>Synthetic operator signal with explicit frontend-only context.</p></div><time>{i*5}m</time><div class="alert-list__actions"><a>Device ↗</a><button>Acknowledge locally</button></div></article>' for i,(sev,id,title) in enumerate([('critical','A-008','Telemetry offline'),('warning','A-006','Energy outside planning band'),('maintenance','A-005','Filter service active'),('info','A-001','Batch entered verification')],1))
    return f'''<section class="alerts-head"><div><span class="console-kicker">Operator attention / SYNTHETIC DEMO DATA</span><h2>Signals that<br><em>need context.</em></h2></div><div class="filter-chips"><button aria-pressed="true">all</button><button>critical</button><button>warning</button></div></section><section class="alert-list">{rows}</section><p class="console-boundary-note">Acknowledgement is local UI state only. No remote alert is modified.</p>'''

def maintenance():
    rows=''.join(f'<article><div class="maintenance-list__meta">{chip(status)}<a>A-00{i} ↗</a></div><div><h3>{component}</h3><p>Illustrative remaining-life estimate.</p></div><div class="life-bar"><i style="width:{pct}%"></i><span>{pct}%</span></div><strong>{due}</strong></article>' for i,(status,component,pct,due) in enumerate([('good','Intake filter',68,'184 h'),('attention','Humidity sensor',32,'48 h'),('service','Treatment filter',4,'now'),('good','UV module',81,'410 h')],1))
    return f'''<section class="maintenance-lead"><div><span class="console-kicker">Service planning / SYNTHETIC DEMO DATA</span><h2>KEEP THE<br>WATER PATH<br><em>LEGIBLE.</em></h2></div><p>Component-life values are illustrative frontend states, not predictive maintenance claims.</p></section><section class="maintenance-list">{rows}</section>'''

def reports():
    rows=''.join(f'<article><div class="report-library__index mono">R-02{i}</div><div><span>{typ}</span><h3>{title}</h3><p>Frontend-only report preview with synthetic evidence context.</p></div><strong>Sep 2026</strong><button>Preview</button></article>' for i,(typ,title) in enumerate([('pilot','Pilot decision brief'),('water','Water batch evidence'),('energy','Energy intensity review'),('climate','Climate operating window'),('maintenance','Maintenance summary')],2))
    return f'''<section class="reports-lead"><div><span class="console-kicker">Evidence library / FRONTEND PREVIEWS</span><h2>REPORTS<br>WITHOUT<br><em>THEATRE.</em></h2></div><p>No PDF is claimed to exist until a real document is connected.</p></section><section class="report-library">{rows}</section>'''

def settings(): return '''<section class="settings-lead"><div><span class="console-kicker">Local interface preferences</span><h2>SET THE<br><em>INSTRUMENT.</em></h2></div><p>These settings are stored in this browser only. No account or backend exists.</p></section><section class="settings-groups"><fieldset><legend>Units</legend><label><span>Temperature</span><select><option>Celsius / °C</option></select></label><label><span>Volume</span><select><option>Litres / L</option></select></label></fieldset><fieldset><legend>Interface</legend><label><span>Density</span><select><option>Comfortable</option></select></label><label class="setting-toggle"><span><b>Reduced motion</b><small>Reduce console transitions.</small></span><input type="checkbox"></label><label class="setting-toggle"><span><b>Notification preferences</b><small>Frontend display preference only.</small></span><input type="checkbox" checked></label></fieldset></section>'''

PAGES={'overview':('Overview','01',overview),'devices':('Devices','02',devices),'device':('Device A-001','02',device),'fleet':('Fleet','03',fleet),'analytics':('Analytics','04',analytics),'water':('Water','05',water_page),'batch':('Batch A-00284','05',batch),'alerts':('Alerts','06',alerts),'maintenance':('Maintenance','07',maintenance),'reports':('Reports','08',reports),'settings':('Settings','09',settings)}

def html(route):
    title,index,fn=PAGES[route]
    return f'''<!doctype html><html><head><meta charset="utf-8"><style>{css()}</style></head><body><div class="console-shell">{nav(route)}<div class="console-workspace">{header(title,index)}<main class="console-main"><div class="console-page">{fn()}</div></main><footer class="console-footer"><span>ATMORA / OPERATOR</span><span>SYNTHETIC DEMO DATA</span><span>Frontend-only environment</span></footer></div></div></body></html>'''

def render(routes,widths):
    OUT.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        for route in routes:
            for width in widths:
                page=browser.new_page(viewport={'width':width,'height':900},device_scale_factor=1)
                page.set_content(html(route),wait_until='load')
                page.wait_for_timeout(80)
                overflow=page.evaluate('Math.max(document.documentElement.scrollWidth-document.documentElement.clientWidth,0)')
                if overflow>1: raise RuntimeError(f'{route} {width}: overflow {overflow}px')
                page.screenshot(path=str(OUT/f'{route}-{width}.png'),full_page=True)
                page.close()
                print(f'{route:12} {width:4} overflow={overflow}')
        browser.close()

def sheet(routes,width=390):
    images=[]
    for route in routes:
        p=OUT/f'{route}-{width}.png'
        if not p.exists(): continue
        im=Image.open(p).convert('RGB')
        crop=ImageOps.fit(im,(390,620),method=Image.Resampling.LANCZOS,centering=(.5,0))
        canvas=Image.new('RGB',(410,670),'white');canvas.paste(crop,(10,40));ImageDraw.Draw(canvas).text((12,12),route.upper(),fill='black');images.append(canvas)
    cols=3;rows=(len(images)+cols-1)//cols
    out=Image.new('RGB',(cols*410,rows*670),(232,232,232))
    for i,im in enumerate(images):out.paste(im,((i%cols)*410,(i//cols)*670))
    out.save(OUT/f'console-{width}-contactsheet.jpg',quality=88)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--route',action='append',choices=ROUTES);parser.add_argument('--width',action='append',type=int,choices=WIDTHS);args=parser.parse_args()
    routes=tuple(args.route or ROUTES);widths=tuple(args.width or (1440,390))
    render(routes,widths)
    for w in widths:
        if w in (1440,390): sheet(routes,w)
