import type { RangeKey } from '../../data/telemetry'
const ranges: readonly RangeKey[] = ['24H','7D','30D','90D']
export function RangeTabs({ value, onChange }: { value:RangeKey; onChange:(value:RangeKey)=>void }) {
  return <div className="range-tabs" role="group" aria-label="Analytics period">
    {ranges.map(range=><button key={range} type="button" data-active={value===range} aria-pressed={value===range} onClick={()=>onChange(range)}>{range}</button>)}
  </div>
}
