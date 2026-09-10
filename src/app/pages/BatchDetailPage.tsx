import { batchById, WATER_STATES } from '../../data/batches'
import { RouteLink } from '../../components/RouteLink'
import { WaterStateBadge } from '../components/WaterStateBadge'
import { useConsoleUnits } from '../useConsoleUnits'

export function BatchDetailPage({id}:{id:string}){
 const batch=batchById(id)
 const units=useConsoleUnits()
 if(!batch)return <div className="console-page console-empty"><h2>Batch not found</h2><RouteLink to="/app/water" className="console-link">Return to water ledger →</RouteLink></div>
 const active=WATER_STATES.indexOf(batch.state)
 return <div className="console-page batch-detail"><section className="batch-detail__hero"><RouteLink className="console-back" to="/app/water">← Water ledger</RouteLink><span className="console-kicker">Water batch / SYNTHETIC DEMO DATA</span><h2>{batch.id}</h2><div><strong>{units.volume(batch.volumeL)}<small>{units.volumeUnit}</small></strong><WaterStateBadge state={batch.state}/></div><p>{batch.site} / {batch.deviceId}<br/><span>{batch.collectedAt}</span></p></section>
 <section className="batch-state-path">{WATER_STATES.map((state,index)=><div key={state} data-state={index<active?'complete':index===active?'active':'pending'}><span>{String(index+1).padStart(2,'0')}</span><strong>{state}</strong><i/></div>)}</section>
 <section className="batch-evidence-grid"><article><span className="console-kicker">Climate</span><dl><div><dt>Temperature</dt><dd>{units.temperature(batch.temperatureC)}{units.temperatureUnit}</dd></div><div><dt>Relative humidity</dt><dd>{batch.humidityRh}% RH</dd></div><div><dt>Dew point</dt><dd>{units.temperature(batch.dewPointC)}{units.temperatureUnit}</dd></div></dl></article><article><span className="console-kicker">Treatment</span><h3>{batch.treatment}</h3><p>No treatment label here implies potable certification.</p></article><article><span className="console-kicker">Verification</span><h3>{batch.verification}</h3><p>Evidence remains explicitly separate from treatment state.</p></article><article><span className="console-kicker">Provenance</span><h3>synthetic-demo</h3><p>This record exists only to demonstrate frontend traceability.</p></article></section>
 </div>
}
