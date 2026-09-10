import type { ReactNode } from 'react'

export function MetricReadout({ label, value, unit, note, children }: { label:string; value:string|number; unit?:string; note?:string; children?:ReactNode }) {
  return <article className="metric-readout">
    <div className="metric-readout__label"><span>{label}</span>{children}</div>
    <p><strong>{value}</strong>{unit && <small>{unit}</small>}</p>
    {note && <div className="metric-readout__note">{note}</div>}
  </article>
}
