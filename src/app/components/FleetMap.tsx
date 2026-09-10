import { DEVICES } from '../../data/devices'
import { RouteLink } from '../../components/RouteLink'
import { StatusChip } from './StatusChip'

export function FleetMap() {
  return <section className="fleet-map" aria-labelledby="fleet-map-title">
    <div className="fleet-map__header"><div><span className="console-kicker">Geographic schematic / synthetic demo</span><h2 id="fleet-map-title">Operating field</h2></div><div className="fleet-map__legend"><span><i data-status="online"/>online</span><span><i data-status="warning"/>attention</span><span><i data-status="offline"/>offline</span></div></div>
    <div className="fleet-map__stage" role="group" aria-label="Schematic global distribution of eight synthetic Atmora devices">
      <svg className="fleet-map__grid" viewBox="0 0 1000 520" aria-hidden="true"><path d="M0 104H1000M0 208H1000M0 312H1000M0 416H1000M166 0V520M332 0V520M498 0V520M664 0V520M830 0V520"/><path className="fleet-map__arc" d="M40 356C170 90 342 76 465 245S730 430 954 115"/></svg>
      {DEVICES.map(device=><RouteLink key={device.id} to={`/app/devices/${device.id}`} className="fleet-map__pin" data-status={device.status} style={{left:`${device.x}%`,top:`${device.y}%`}} aria-label={`${device.id}, ${device.region}, ${device.status}`}><i/><span><b>{device.region}</b><small>{device.id}</small></span></RouteLink>)}
      <div className="fleet-map__readout"><span className="console-kicker">Fleet state</span><strong>{DEVICES.filter(d=>d.status==='online').length}/{DEVICES.length}</strong><small>online / synthetic</small><StatusChip status="warning" label="2 attention"/></div>
    </div>
  </section>
}
