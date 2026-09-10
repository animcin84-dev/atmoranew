const fields = [
  {
    index: '01',
    axis: 'PHYSICS',
    first: ['TRUTH OVER HYPE.', 'Claims stay behind evidence, never ahead of it.'],
    second: ['PHYSICS BEFORE AI.', 'The atmosphere and machine define the operating envelope before software interprets it.'],
  },
  {
    index: '02',
    axis: 'EVIDENCE',
    first: ['MEASUREMENT BEFORE PREDICTION.', 'Models become useful only when measured behavior can ground them.'],
    second: ['UNCERTAINTY STAYS VISIBLE.', 'Unknown is a valid evidence state — not a space to fill with marketing.'],
  },
  {
    index: '03',
    axis: 'DECISION',
    first: ['SAFETY BEFORE GROWTH.', 'Raw, treated and verified water states remain visibly distinct.'],
    second: ['PILOT BEFORE SCALE.', 'A site earns confidence through measured operation in its own conditions.'],
  },
] as const

export function EvidencePrinciples() {
  return (
    <section className="principles section section--dark" aria-labelledby="principles-title">
      <div className="container principles__intro" data-reveal>
        <p className="kicker">Atmora Lab / operating principles</p>
        <div className="principles__intro-grid">
          <h2 id="principles-title" className="display display--md">Confidence<br />is earned.</h2>
          <p className="body-lg">Atmora treats honesty as part of the interface. Each claim crosses a boundary only when the evidence underneath it has changed state.</p>
        </div>
      </div>
      <ol className="principles__thresholds">
        {fields.map((field) => (
          <li key={field.axis} data-reveal>
            <div className="container principles__threshold-grid">
              <div className="principles__axis"><span className="mono">{field.index}</span><strong>{field.axis}</strong></div>
              <div className="principles__threshold-line" aria-hidden="true"><i /></div>
              <article><h3>{field.first[0]}</h3><p>{field.first[1]}</p></article>
              <article><h3>{field.second[0]}</h3><p>{field.second[1]}</p></article>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
