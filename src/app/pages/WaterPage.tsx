import { useMemo, useState } from 'react'
import { BATCHES, WATER_STATES, type WaterState } from '../../data/batches'
import { RouteLink } from '../../components/RouteLink'
import { WaterStateBadge } from '../components/WaterStateBadge'
import { useConsoleUnits } from '../useConsoleUnits'

export function WaterPage(){
 const [query,setQuery]=useState(''), [state,setState]=useState<'all'|WaterState>('all')
 const units=useConsoleUnits()
 const filtered=useMemo(()=>BATCHES.filter(batch=>`${batch.id} ${batch.deviceId} ${batch.site}`.toLowerCase().includes(query.toLowerCase())&&(state==='all'||batch.state===state)),[query,state])
 return <div className="console-page water-page"><section className="water-states"><span className="console-kicker">Evidence chain</span><h2>EVERY LITRE<br/>HAS A STATE.</h2><div className="water-states__rail">{WATER_STATES.map((item,index)=><div key={item}><span>{String(index+1).padStart(2,'0')}</span><strong>{item}</strong><i aria-hidden="true"/></div>)}</div><p>RAW CONDENSATE is not TREATED water. Treatment alone does not mean drinking-water certification. VERIFICATION remains separate from VERIFIED FOR INTENDED USE.</p></section>
 <section className="console-toolbar"><label className="console-search"><span>Search batches</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Batch, device or site"/></label><select aria-label="Water state" value={state} onChange={e=>setState(e.target.value as 'all'|WaterState)}><option value="all">All water states</option>{WATER_STATES.map(item=><option key={item}>{item}</option>)}</select></section>
 <section className="batch-ledger"><div className="console-section-head"><div><span className="console-kicker">Batch ledger / synthetic demo</span><h2>{filtered.length.toString().padStart(2,'0')} evidence records</h2></div></div><div className="batch-list">{filtered.map(batch=><RouteLink key={batch.id} to={`/app/water/${batch.id}`}><span className="mono">{batch.id}</span><div><strong>{batch.deviceId}</strong><small>{batch.site}</small></div><div><strong>{units.volume(batch.volumeL)} {units.volumeUnit}</strong><small>{batch.collectedAt}</small></div><WaterStateBadge state={batch.state}/><b aria-hidden="true">↗</b></RouteLink>)}</div></section></div>
}
