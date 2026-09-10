import { ATMORA_ASSETS } from '../lib/assets'

const signals = [
  ['TEMP', '27.1°C', 'ILLUSTRATIVE'],
  ['RH', '64%', 'ILLUSTRATIVE'],
  ['DEW', '19.6°C', 'DERIVED'],
  ['SEC', '— kWh/L', 'AWAIT MEASUREMENT'],
] as const

export function Intelligence() {
  return (
    <section className="intelligence section--dark" aria-labelledby="intelligence-title">
      <img className="intelligence__bg" src={ATMORA_ASSETS.measurementMountains.src} alt="" width={ATMORA_ASSETS.measurementMountains.width} height={ATMORA_ASSETS.measurementMountains.height} loading="lazy" decoding="async" />
      <div className="intelligence__veil" />
      <div className="container intelligence__content">
        <div className="intelligence__head" data-reveal>
          <div>
            <p className="kicker">Intelligence / 04</p>
            <h2 id="intelligence-title" className="display display--md">Measure first.<br />Predict when the<br />data earns it.</h2>
          </div>
          <p className="body-lg">Atmora Intelligence starts with physical measurements. Predictions and operating recommendations should come later, after evidence is sufficient.</p>
        </div>

        <div className="intelligence__telemetry" data-reveal>
          <div className="telemetry__trace" aria-label="Atmora intelligence evidence flow">
            <div><span className="mono">01</span><strong>CONDITIONS</strong><small>Air defines the envelope.</small></div>
            <i aria-hidden="true" />
            <div><span className="mono">02</span><strong>MEASUREMENT</strong><small>Sensors record what happened.</small></div>
            <i aria-hidden="true" />
            <div><span className="mono">03</span><strong>INTERPRETATION</strong><small>Relationships become visible.</small></div>
            <i aria-hidden="true" />
            <div><span className="mono">04</span><strong>DECISION</strong><small>Prediction waits for evidence.</small></div>
          </div>

          <div className="telemetry__field">
            <div className="telemetry__grid" aria-hidden="true" />
            <svg className="telemetry__signal" viewBox="0 0 1000 250" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 160 C70 150 100 105 170 124 S285 190 350 137 S455 84 525 112 S650 186 720 132 S830 91 1000 106" />
              <path className="telemetry__signal--secondary" d="M0 82 C100 98 155 62 240 77 S355 115 440 91 S590 49 670 73 S820 119 1000 86" />
            </svg>
            <div className="telemetry__annotation mono"><span>ILLUSTRATIVE SIGNAL SHAPE</span><span>NOT FIELD PERFORMANCE DATA</span></div>
            <div className="telemetry__threshold mono"><span>EVIDENCE THRESHOLD</span><i /></div>
          </div>

          <dl className="telemetry__readouts">
            {signals.map(([label, value, status]) => (
              <div key={label}>
                <dt className="mono">{label}</dt>
                <dd>{value}</dd>
                <span className="mono">{status}</span>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
