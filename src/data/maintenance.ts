export type MaintenanceItem = { id:string; deviceId:string; component:string; state:'good'|'attention'|'service'; remainingPercent:number; due:string; note:string; provenance:'synthetic-demo' }
export const MAINTENANCE: readonly MaintenanceItem[] = [
{id:'M-101',deviceId:'A-001',component:'Intake filter',state:'good',remainingPercent:68,due:'184 h',note:'Illustrative remaining-life estimate.',provenance:'synthetic-demo'},
{id:'M-102',deviceId:'A-001',component:'UV module',state:'good',remainingPercent:81,due:'410 h',note:'Illustrative operating-hour estimate.',provenance:'synthetic-demo'},
{id:'M-103',deviceId:'A-003',component:'Humidity sensor',state:'attention',remainingPercent:32,due:'48 h',note:'Synthetic calibration attention state.',provenance:'synthetic-demo'},
{id:'M-104',deviceId:'A-005',component:'Treatment filter',state:'service',remainingPercent:4,due:'now',note:'Synthetic service state.',provenance:'synthetic-demo'},
{id:'M-105',deviceId:'A-006',component:'Condenser inspection',state:'attention',remainingPercent:26,due:'72 h',note:'Illustrative inspection interval.',provenance:'synthetic-demo'},
{id:'M-106',deviceId:'A-007',component:'Collection pathway',state:'good',remainingPercent:73,due:'230 h',note:'Synthetic maintenance planning data.',provenance:'synthetic-demo'},
]
