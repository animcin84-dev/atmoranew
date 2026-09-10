export type Report = { id:string; title:string; type:'pilot'|'water'|'energy'|'climate'|'maintenance'; period:string; summary:string; status:'preview'; provenance:'synthetic-demo' }
export const REPORTS: readonly Report[] = [
{id:'R-026',title:'Pilot decision brief',type:'pilot',period:'Sep 2026',summary:'Site conditions, measured-demo window and decision framing.',status:'preview',provenance:'synthetic-demo'},
{id:'R-025',title:'Water batch evidence',type:'water',period:'A-00284',summary:'Synthetic chain from condensate through treatment and verification.',status:'preview',provenance:'synthetic-demo'},
{id:'R-024',title:'Energy intensity review',type:'energy',period:'30 days',summary:'Synthetic SEC distribution against illustrative operating conditions.',status:'preview',provenance:'synthetic-demo'},
{id:'R-023',title:'Climate operating window',type:'climate',period:'90 days',summary:'Synthetic temperature, RH and dew-point relationship.',status:'preview',provenance:'synthetic-demo'},
{id:'R-022',title:'Maintenance summary',type:'maintenance',period:'Current',summary:'Synthetic component attention and service planning.',status:'preview',provenance:'synthetic-demo'},
]
