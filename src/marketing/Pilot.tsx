const stages = [
  ['01', 'SITE', 'Define location, intended use and constraints.', 'CONTEXT'],
  ['02', 'ASSESSMENT', 'Review climate context and decide what must be measured.', 'ASSUMPTIONS'],
  ['03', 'PILOT', 'Operate a defined system for a defined purpose and window.', 'OPERATION'],
  ['04', 'MEASUREMENT', 'Capture climate, water, energy and operational state.', 'EVIDENCE'],
  ['05', 'REPORT', 'Separate measured results from estimates and unknowns.', 'INTERPRETATION'],
  ['06', 'DECISION', 'Scale, change the system, or stop based on evidence.', 'GO / CHANGE / STOP'],
] as const

export function Pilot() {
  return (
    <section id="pilot" className="pilot section section--light" aria-labelledby="pilot-title">
      <div className="container pilot__head" data-reveal>
        <div>
          <p className="kicker">Pilot methodology / 08</p>
          <h2 id="pilot-title" className="display display--md">Pilot before<br />scale.</h2>
        </div>
        <div className="pilot__head-copy">
          <p className="body-lg">The commercial path is not “buy now.” A credible pilot reduces uncertainty at the site before a larger decision is made.</p>
          <p className="mono">THE OUTPUT IS NOT A SALES BADGE. IT IS A DECISION.</p>
        </div>
      </div>

      <div className="container pilot__framework" data-reveal>
        <div className="pilot__framework-head mono">
          <span>INPUT</span>
          <span>MEASUREMENT WINDOW</span>
          <span>DECISION</span>
        </div>
        <ol className="pilot__decision-rail">
          {stages.map(([index, title, copy, evidence]) => (
            <li key={index}>
              <span className="pilot__index mono">{index}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <strong className="mono">{evidence}</strong>
            </li>
          ))}
        </ol>
        <div className="pilot__outcome">
          <p className="data-label">Decision boundary</p>
          <strong className="mono">GO / CHANGE / STOP</strong>
          <p>Confidence is useful only when it changes the next decision. A pilot can justify expansion, reveal a redesign requirement, or show that the site is not suitable.</p>
        </div>
      </div>
    </section>
  )
}
