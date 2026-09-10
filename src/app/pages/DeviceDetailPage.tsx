import { deviceById } from '../../data/devices'
import { MAINTENANCE } from '../../data/maintenance'
import { ENERGY_SERIES, HUMIDITY_SERIES, PRODUCTION_SERIES, TEMPERATURE_SERIES } from '../../data/telemetry'
import { ATMORA_ASSETS } from '../../lib/assets'
import { RouteLink } from '../../components/RouteLink'
import { MetricReadout } from '../components/MetricReadout'
import { Sparkline } from '../components/Sparkline'
import { StatusChip } from '../components/StatusChip'
import { WaterStateBadge } from '../components/WaterStateBadge'
import { useConsoleUnits } from '../useConsoleUnits'

export function DeviceDetailPage({ id }: { id:string }){
  const device=deviceById(id)
  const units=useConsoleUnits()
  if(!device) return <div className="console-page console-empty"><h2>Device not found</h2><p>No synthetic device record exists for {id}.</p><RouteLink to="/app/devices" className="console-link">Return to devices →</RouteLink></div>
  const maintenance=MAINTENANCE.filter(item=>item.deviceId===device.id)
  return <div className="console-page device-detail">
    <section className="device-detail__hero"><div className="device-detail__identity"><RouteLink className="console-back" to="/app/devices">← Devices</RouteLink><span className="console-kicker">Device record / synthetic demo</span><div><h2>{device.id}</h2><StatusChip status={device.status}/></div><p>{device.site}<br/><span>{device.region} / SN {device.serial}</span></p><WaterStateBadge state={device.waterState}/></div><figure><span className="media-label">Concept system view</span><img src={ATMORA_ASSETS.device.src} alt={ATMORA_ASSETS.device.alt} width={ATMORA_ASSETS.device.width} height={ATMORA_ASSETS.device.height}/></figure></section>
    <section className="metric-band"><MetricReadout label="Water today" value={units.volume(device.waterTodayL)} unit={units.volumeUnit}/><MetricReadout label="Temperature" value={units.temperature(device.temperatureC)} unit={units.temperatureUnit}/><MetricReadout label="Relative humidity" value={device.humidityRh} unit="%"/><MetricReadout label="Dew point" value={units.temperature(device.dewPointC)} unit={units.temperatureUnit}/><MetricReadout label="Energy" value={units.energy(device.energyKwhPerL)} unit={units.energyUnit}/></section>
    <section className="device-detail__charts"><Sparkline values={units.volumeSeries(PRODUCTION_SERIES['24H'].values)} label="Production response" unit={` ${units.volumeUnit}`}/><Sparkline values={units.energySeries(ENERGY_SERIES['24H'].values)} label="Energy intensity" unit={` ${units.energyUnit}`}/><Sparkline values={units.temperatureSeries(TEMPERATURE_SERIES.values)} label="Temperature" unit={units.temperatureUnit}/><Sparkline values={HUMIDITY_SERIES.values} label="Relative humidity" unit="%"/></section>
    <section className="service-panel"><div className="console-section-head"><div><span className="console-kicker">Service state</span><h2>Maintenance window</h2></div><span className="mono">last seen {device.lastSeen}</span></div>{maintenance.length?<div className="service-list">{maintenance.map(item=><article key={item.id}><StatusChip status={item.state}/><div><h3>{item.component}</h3><p>{item.note}</p></div><strong>{item.remainingPercent}%<small>{item.due}</small></strong></article>)}</div>:<p className="console-empty">No active synthetic maintenance items for this device.</p>}</section>
  </div>
}
