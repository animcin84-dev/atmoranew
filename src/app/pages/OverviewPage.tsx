import { DEVICES } from '../../data/devices'
import { ACTIVITY, HUMIDITY_SERIES, PRODUCTION_SERIES, TEMPERATURE_SERIES } from '../../data/telemetry'
import { ATMORA_ASSETS } from '../../lib/assets'
import { RouteLink } from '../../components/RouteLink'
import { MetricReadout } from '../components/MetricReadout'
import { Sparkline } from '../components/Sparkline'
import { StatusChip } from '../components/StatusChip'
import { WaterStateBadge } from '../components/WaterStateBadge'
import { useConsoleUnits } from '../useConsoleUnits'

export function OverviewPage(){
  const device=DEVICES[0]
  const units=useConsoleUnits()
  return <div className="console-page console-overview">
    <section className="overview-hero">
      <div className="overview-hero__copy"><span className="console-kicker">Primary device / synthetic demo</span><div className="overview-hero__title"><div><h2>{device.id}</h2><StatusChip status={device.status}/></div><p>{device.site}<br/><span>{device.region}</span></p></div><RouteLink className="console-link" to={`/app/devices/${device.id}`}>Inspect device <span aria-hidden="true">↗</span></RouteLink></div>
      <figure className="overview-hero__device"><span className="media-label">Concept system view</span><img src={ATMORA_ASSETS.device.src} alt={ATMORA_ASSETS.device.alt} width={ATMORA_ASSETS.device.width} height={ATMORA_ASSETS.device.height}/><figcaption className="mono">SN {device.serial}</figcaption></figure>
      <div className="overview-hero__water"><span className="console-kicker">Water produced today</span><strong>{units.volume(device.waterTodayL)}</strong><span>{units.volumeUnit}</span><WaterStateBadge state={device.waterState}/></div>
    </section>
    <section className="metric-band" aria-label="Current synthetic conditions">
      <MetricReadout label="Temperature" value={units.temperature(device.temperatureC)} unit={units.temperatureUnit} note="Ambient"/>
      <MetricReadout label="Relative humidity" value={device.humidityRh} unit="%" note="Ambient"/>
      <MetricReadout label="Dew point" value={units.temperature(device.dewPointC)} unit={units.temperatureUnit} note="Calculated demo"/>
      <MetricReadout label="Tank level" value={device.tankPercent} unit="%" note="Synthetic sensor"/>
      <MetricReadout label="Energy intensity" value={units.energy(device.energyKwhPerL)} unit={units.energyUnit} note="Synthetic demo"/>
    </section>
    <section className="overview-grid">
      <Sparkline values={units.volumeSeries(PRODUCTION_SERIES['24H'].values)} label="Water production / 24H" unit={` ${units.volumeUnit}`}/>
      <div className="overview-grid__conditions"><Sparkline values={units.temperatureSeries(TEMPERATURE_SERIES.values)} label="Temperature" unit={units.temperatureUnit}/><Sparkline values={HUMIDITY_SERIES.values} label="Relative humidity" unit="%"/></div>
    </section>
    <section className="activity-panel">
      <div className="console-section-head"><div><span className="console-kicker">Latest synthetic events</span><h2>Recent activity</h2></div><RouteLink to="/app/alerts" className="console-link">Open alerts <span aria-hidden="true">↗</span></RouteLink></div>
      <ol className="activity-list">{ACTIVITY.map(([time,id,event])=><li key={`${time}-${id}`}><time>{time}</time><strong>{id}</strong><p>{event}</p><i aria-hidden="true"/></li>)}</ol>
    </section>
  </div>
}
