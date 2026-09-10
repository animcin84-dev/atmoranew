import { useState } from 'react'
import { ENERGY_SERIES, HUMIDITY_SERIES, PRODUCTION_SERIES, TEMPERATURE_SERIES, type RangeKey } from '../../data/telemetry'
import { RangeTabs } from '../components/RangeTabs'
import { Sparkline } from '../components/Sparkline'
import { useConsoleUnits } from '../useConsoleUnits'

export function AnalyticsPage(){
  const [range,setRange]=useState<RangeKey>('24H')
  const units=useConsoleUnits()
  const production=PRODUCTION_SERIES[range], energy=ENERGY_SERIES[range]
  const productionUnit=range==='24H'?` ${units.volumeUnit}`:` ${units.volumeUnit}/day`
  return <div className="console-page analytics-page"><section className="analytics-lead"><div><span className="console-kicker">Measured response / SYNTHETIC DEMO DATA</span><h2>Conditions shape<br/><em>the result.</em></h2></div><RangeTabs value={range} onChange={setRange}/></section>
    <section className="analytics-primary"><Sparkline values={units.volumeSeries(production.values)} label={`Production / ${range}`} unit={productionUnit}/><div className="analytics-primary__summary"><span className="console-kicker">Selected window</span><strong>{range}</strong><p>Numbers demonstrate interface behaviour only. They are not field validation or rated output.</p></div></section>
    <section className="analytics-grid"><Sparkline values={units.energySeries(energy.values)} label="Energy intensity" unit={` ${units.energyUnit}`}/><Sparkline values={units.temperatureSeries(TEMPERATURE_SERIES.values)} label="Ambient temperature" unit={units.temperatureUnit}/><Sparkline values={HUMIDITY_SERIES.values} label="Relative humidity" unit="%"/><div className="operating-window"><span className="console-kicker">Operating window</span><div className="operating-window__field"><i/><i/><i/><span>dry / constrained</span><span>measured-demo band</span><span>humid / favourable</span></div><p>Physics sets the range. A real performance model requires measured device data.</p></div></section>
  </div>
}
