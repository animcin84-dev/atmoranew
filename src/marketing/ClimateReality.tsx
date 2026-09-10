import { useMemo, useState, type ChangeEvent, type CSSProperties } from 'react'
import { dewPointC } from '../lib/dewPoint'

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function ClimateReality() {
  const [temperature, setTemperature] = useState(27)
  const [humidity, setHumidity] = useState(64)
  const dewPoint = useMemo(() => dewPointC(temperature, humidity), [temperature, humidity])
  const dewPosition = clamp(((dewPoint + 20) / 65) * 100, 8, 92)
  const saturation = clamp(humidity, 10, 95)
  const instrumentStyle = {
    '--dew-position': `${dewPosition}%`,
    '--humidity-alpha': (0.08 + (saturation / 100) * 0.22).toFixed(3),
  } as CSSProperties

  return (
    <section id="technology" className="climate section section--light" aria-labelledby="climate-title">
      <div className="container climate__intro" data-reveal>
        <p className="kicker">Climate reality / 01</p>
        <div className="climate__intro-grid">
          <h2 id="climate-title" className="display display--md">Same machine.<br />Different air.<br />Different result.</h2>
          <div>
            <p className="body-lg">No fixed litre claim can describe every atmosphere. Temperature and relative humidity change the dew point — and the physical range.</p>
            <p className="climate__note mono">Interactive physics only. This instrument calculates dew point; it does not predict Atmora litres or SEC.</p>
          </div>
        </div>
      </div>

      <div className="container climate__instrument" data-reveal aria-label="Interactive dew-point instrument" style={instrumentStyle}>
        <header className="climate__instrument-head">
          <div><span className="data-label">Ambient air</span><strong className="mono">{temperature.toFixed(1)}°C</strong></div>
          <div><span className="data-label">Relative humidity</span><strong className="mono">{humidity}% RH</strong></div>
          <div className="climate__dew-readout"><span className="data-label">Calculated dew point</span><strong className="mono">{dewPoint.toFixed(1)}°C</strong></div>
        </header>

        <div className="climate__condition-field" aria-hidden="true">
          <div className="climate__field-atmosphere" />
          <div className="climate__field-grid" />
          <div className="climate__threshold-axis">
            <span className="mono">DEW POINT / {dewPoint.toFixed(1)}°C</span>
            <i />
          </div>
          <div className="climate__field-copy">
            <span className="mono">AIR / {temperature.toFixed(1)}°C</span>
            <strong>COOL A SURFACE<br />TO THIS THRESHOLD.</strong>
          </div>
          <div className="climate__phase-labels mono"><span>VAPOUR</span><span>CONDENSATION POSSIBLE</span></div>
        </div>

        <div className="climate__controls">
          <label className="climate__control">
            <span><b>Temperature</b><output className="mono">{temperature}°C</output></span>
            <input aria-label="Temperature in degrees Celsius" type="range" min="0" max="45" value={temperature} onChange={(event: ChangeEvent<HTMLInputElement>) => setTemperature(Number(event.target.value))} />
          </label>
          <label className="climate__control">
            <span><b>Relative humidity</b><output className="mono">{humidity}%</output></span>
            <input aria-label="Relative humidity percentage" type="range" min="10" max="95" value={humidity} onChange={(event: ChangeEvent<HTMLInputElement>) => setHumidity(Number(event.target.value))} />
          </label>
          <p className="climate__explain">When surface temperature reaches the calculated dew point, condensation becomes thermodynamically possible. Actual production still depends on the system and operating conditions.</p>
        </div>
      </div>
    </section>
  )
}
