import { DEVICES } from '../../data/devices'
import { ALERTS } from '../../data/alerts'
import { RouteLink } from '../../components/RouteLink'
import { FleetMap } from '../components/FleetMap'
import { StatusChip } from '../components/StatusChip'

export function FleetPage(){return <div className="console-page fleet-page">
  <section className="fleet-statement"><span className="console-kicker">Fleet health / synthetic demo</span><h2>A CLEARER WORLD<br/>RUNS ON A<br/><em>HEALTHY FLEET.</em></h2><p>One spatial view of device availability, local atmospheric conditions and operator attention — without implying a live deployment.</p></section>
  <FleetMap/>
  <section className="fleet-bottom"><div className="fleet-alerts"><div className="console-section-head"><div><span className="console-kicker">Attention rail</span><h2>Current signals</h2></div><RouteLink to="/app/alerts" className="console-link">All alerts ↗</RouteLink></div>{ALERTS.slice(0,4).map(alert=><article key={alert.id}><StatusChip status={alert.severity}/><div><strong>{alert.deviceId}</strong><h3>{alert.title}</h3><p>{alert.detail}</p></div><time>{alert.time}</time></article>)}</div><div className="fleet-summary"><span className="console-kicker">Fleet state</span>{(['online','warning','maintenance','offline'] as const).map(status=><div key={status}><span>{status}</span><strong>{DEVICES.filter(d=>d.status===status).length}</strong></div>)}</div></section>
</div>}
