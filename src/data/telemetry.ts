export type RangeKey = '24H' | '7D' | '30D' | '90D'
export type TelemetrySeries = { label: string; values: readonly number[]; unit: string; provenance: 'synthetic-demo' }

export const PRODUCTION_SERIES: Record<RangeKey, TelemetrySeries> = {
  '24H': { label:'Water production', values:[4,7,12,19,28,42,61,83,108,137,171,208,247,291,336,378,415,449,478,501,517,527], unit:'L', provenance:'synthetic-demo' },
  '7D': { label:'Water production', values:[402,468,491,455,538,512,527], unit:'L/day', provenance:'synthetic-demo' },
  '30D': { label:'Water production', values:[382,401,447,432,471,498,487,510,526,503,476,521,548,559,537,518,530,561,574,552,533,521,546,570,591,567,550,536,518,527], unit:'L/day', provenance:'synthetic-demo' },
  '90D': { label:'Water production', values:[356,371,392,411,430,452,477,491,505,522,538,551,545,532,519,527,543,559], unit:'L/day', provenance:'synthetic-demo' },
}

export const ENERGY_SERIES: Record<RangeKey, TelemetrySeries> = {
  '24H': { label:'Energy intensity', values:[.91,.88,.84,.81,.79,.76,.75,.73,.71,.70,.72,.71], unit:'kWh/L', provenance:'synthetic-demo' },
  '7D': { label:'Energy intensity', values:[.78,.75,.77,.74,.72,.73,.71], unit:'kWh/L', provenance:'synthetic-demo' },
  '30D': { label:'Energy intensity', values:[.86,.84,.81,.79,.77,.76,.74,.73,.72,.71,.70,.72], unit:'kWh/L', provenance:'synthetic-demo' },
  '90D': { label:'Energy intensity', values:[.94,.90,.86,.83,.80,.78,.76,.74,.73,.72,.71,.71], unit:'kWh/L', provenance:'synthetic-demo' },
}

export const TEMPERATURE_SERIES: TelemetrySeries = { label:'Ambient temperature', values:[22.3,22.7,23.4,24.2,25.1,26.0,26.7,27.1,27.4,27.1,26.6,25.8], unit:'°C', provenance:'synthetic-demo' }
export const HUMIDITY_SERIES: TelemetrySeries = { label:'Relative humidity', values:[78,76,73,70,67,65,63,64,66,69,72,75], unit:'% RH', provenance:'synthetic-demo' }
export const ACTIVITY = [
  ['14:42','A-001','Batch A-00284 entered VERIFICATION'],
  ['14:37','A-006','Energy intensity moved above planning band'],
  ['14:09','A-004','Treatment cycle complete'],
  ['13:51','A-003','Humidity window narrowed'],
  ['12:08','A-005','Maintenance mode entered'],
] as const
