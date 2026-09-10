export type AlertSeverity = 'critical'|'warning'|'info'|'maintenance'
export type Alert = { id:string; severity:AlertSeverity; deviceId:string; title:string; detail:string; time:string; provenance:'synthetic-demo' }
export const ALERTS: readonly Alert[] = [
{id:'AL-041',severity:'critical',deviceId:'A-008',title:'Telemetry offline',detail:'No synthetic telemetry received since 09:16.',time:'5h 26m',provenance:'synthetic-demo'},
{id:'AL-040',severity:'warning',deviceId:'A-006',title:'Energy outside planning band',detail:'Synthetic SEC is above the current illustrative planning band.',time:'5m',provenance:'synthetic-demo'},
{id:'AL-039',severity:'maintenance',deviceId:'A-005',title:'Filter service active',detail:'Frontend demo marks this device as intentionally unavailable.',time:'2h 34m',provenance:'synthetic-demo'},
{id:'AL-038',severity:'warning',deviceId:'A-003',title:'Operating window narrowing',detail:'Relative humidity is falling toward the current illustrative threshold.',time:'51m',provenance:'synthetic-demo'},
{id:'AL-037',severity:'info',deviceId:'A-001',title:'Batch entered verification',detail:'A-00284 moved from treated water to verification.',time:'now',provenance:'synthetic-demo'},
]
