import { useMemo, useState } from 'react'
import { DEVICES, type DeviceStatus, type DeviceWaterState } from '../../data/devices'
import { RouteLink } from '../../components/RouteLink'
import { StatusChip } from '../components/StatusChip'
import { WaterStateBadge } from '../components/WaterStateBadge'
import { useConsoleUnits } from '../useConsoleUnits'

const statuses: Array<'all'|DeviceStatus>=['all','online','warning','maintenance','offline']
const waterStates: Array<'all'|DeviceWaterState>=['all','RAW CONDENSATE','TREATED','VERIFICATION','VERIFIED FOR INTENDED USE']
export function DevicesPage(){
  const [query,setQuery]=useState('')
  const [status,setStatus]=useState<'all'|DeviceStatus>('all')
  const [waterState,setWaterState]=useState<'all'|DeviceWaterState>('all')
  const units=useConsoleUnits()
  const filtered=useMemo(()=>DEVICES.filter(device=>{
    const match=`${device.id} ${device.name} ${device.site} ${device.region}`.toLowerCase().includes(query.toLowerCase())
    return match&&(status==='all'||device.status===status)&&(waterState==='all'||device.waterState===waterState)
  }),[query,status,waterState])
  return <div className="console-page">
    <section className="console-toolbar"><label className="console-search"><span>Search devices</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ID, site or region" type="search"/></label><div className="console-toolbar__filters"><div className="filter-chips" role="group" aria-label="Device status">{statuses.map(item=><button key={item} type="button" aria-pressed={status===item} onClick={()=>setStatus(item)}>{item}</button>)}</div><select aria-label="Device water state" value={waterState} onChange={e=>setWaterState(e.target.value as 'all'|DeviceWaterState)}>{waterStates.map(item=><option key={item} value={item}>{item==='all'?'All water states':item}</option>)}</select></div></section>
    <section className="device-ledger" aria-labelledby="device-ledger-title"><div className="console-section-head"><div><span className="console-kicker">Device fleet / SYNTHETIC DEMO DATA</span><h2 id="device-ledger-title">{filtered.length.toString().padStart(2,'0')} visible devices</h2></div><span className="mono">{DEVICES.filter(d=>d.status==='online').length} online / {DEVICES.length} total</span></div>
      <div className="device-table-wrap"><table className="device-table"><thead><tr><th>Device</th><th>Site</th><th>Status</th><th>Climate</th><th>Water today</th><th>Water state</th><th>Energy</th><th><span className="sr-only">Open</span></th></tr></thead><tbody>{filtered.map(device=><tr key={device.id}><td><strong>{device.id}</strong><small>{device.name}</small></td><td>{device.site}<small>{device.region}</small></td><td><StatusChip status={device.status}/></td><td>{units.temperature(device.temperatureC)}{units.temperatureUnit}<small>{device.humidityRh}% RH</small></td><td>{units.volume(device.waterTodayL)} {units.volumeUnit}</td><td><WaterStateBadge state={device.waterState}/></td><td>{units.energy(device.energyKwhPerL)} {units.energyUnit}</td><td><RouteLink to={`/app/devices/${device.id}`} aria-label={`Open ${device.id}`}>↗</RouteLink></td></tr>)}</tbody></table></div>
      <div className="device-cards">{filtered.map(device=><RouteLink className="device-card" key={device.id} to={`/app/devices/${device.id}`}><div><strong>{device.id}</strong><StatusChip status={device.status}/></div><h3>{device.site}</h3><p>{device.region}</p><dl><div><dt>Water</dt><dd>{units.volume(device.waterTodayL)} {units.volumeUnit}</dd></div><div><dt>Climate</dt><dd>{units.temperature(device.temperatureC)}{units.temperatureUnit} / {device.humidityRh}%</dd></div><div><dt>Tank</dt><dd>{device.tankPercent}%</dd></div></dl><WaterStateBadge state={device.waterState}/></RouteLink>)}</div>
      {!filtered.length&&<p className="console-empty">No synthetic devices match this filter.</p>}
    </section>
  </div>
}
