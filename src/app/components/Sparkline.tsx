type Props = { values: readonly number[]; label: string; unit?: string; className?: string; showArea?: boolean }

function points(values: readonly number[], width=600, height=180, pad=8) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = Math.max(max-min, .0001)
  return values.map((value,index)=>{
    const x = pad + (index / Math.max(values.length-1,1)) * (width-pad*2)
    const y = height-pad - ((value-min)/range)*(height-pad*2)
    return [x,y] as const
  })
}

export function Sparkline({ values, label, unit='', className='', showArea=true }: Props) {
  const pts = points(values)
  const path = pts.map(([x,y],i)=>`${i?'L':'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${path} L ${pts.at(-1)?.[0] ?? 592} 180 L ${pts[0]?.[0] ?? 8} 180 Z`
  const last = values.at(-1)
  return <figure className={`console-chart ${className}`}>
    <figcaption><span>{label}</span><strong>{last}{unit}</strong></figcaption>
    <svg viewBox="0 0 600 180" role="img" aria-label={`${label}, synthetic demo trend ending at ${last}${unit}`} preserveAspectRatio="none">
      <g className="console-chart__grid" aria-hidden="true"><path d="M0 30H600M0 75H600M0 120H600M0 165H600" /></g>
      {showArea && <path className="console-chart__area" d={area} />}
      <path className="console-chart__line" d={path} pathLength="1" />
      {pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i===pts.length-1?4:1.7} className={i===pts.length-1?'is-last':''} />)}
    </svg>
  </figure>
}
