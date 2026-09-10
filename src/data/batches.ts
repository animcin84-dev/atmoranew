export type WaterState = 'RAW CONDENSATE' | 'TREATED' | 'VERIFICATION' | 'VERIFIED FOR INTENDED USE'
export type WaterBatch = { id:string; deviceId:string; site:string; collectedAt:string; volumeL:number; state:WaterState; temperatureC:number; humidityRh:number; dewPointC:number; treatment:string; verification:string; provenance:'synthetic-demo' }
export const WATER_STATES: readonly WaterState[] = ['RAW CONDENSATE','TREATED','VERIFICATION','VERIFIED FOR INTENDED USE']
export const BATCHES: readonly WaterBatch[] = [
  {id:'A-00284',deviceId:'A-001',site:'Site Alpha',collectedAt:'2026-09-10 14:42',volumeL:84,state:'VERIFICATION',temperatureC:27.1,humidityRh:64,dewPointC:19.6,treatment:'Treatment cycle complete',verification:'Awaiting intended-use verification',provenance:'synthetic-demo'},
  {id:'A-00283',deviceId:'A-001',site:'Site Alpha',collectedAt:'2026-09-10 12:16',volumeL:77,state:'TREATED',temperatureC:26.4,humidityRh:67,dewPointC:19.8,treatment:'Treatment cycle complete',verification:'Not yet verified',provenance:'synthetic-demo'},
  {id:'A-00282',deviceId:'A-004',site:'East Field',collectedAt:'2026-09-10 11:08',volumeL:96,state:'VERIFIED FOR INTENDED USE',temperatureC:29.2,humidityRh:72,dewPointC:23.8,treatment:'Treatment cycle complete',verification:'Synthetic demo — intended-use verification recorded',provenance:'synthetic-demo'},
  {id:'A-00281',deviceId:'A-003',site:'Nordic Test',collectedAt:'2026-09-10 09:33',volumeL:38,state:'RAW CONDENSATE',temperatureC:12.4,humidityRh:83,dewPointC:9.6,treatment:'Not started',verification:'Not applicable',provenance:'synthetic-demo'},
  {id:'A-00280',deviceId:'A-007',site:'South Lab',collectedAt:'2026-09-09 18:22',volumeL:81,state:'TREATED',temperatureC:24.7,humidityRh:70,dewPointC:18.8,treatment:'Treatment cycle complete',verification:'Not yet verified',provenance:'synthetic-demo'},
  {id:'A-00279',deviceId:'A-006',site:'Dry Air Lab',collectedAt:'2026-09-09 16:45',volumeL:29,state:'VERIFICATION',temperatureC:21.3,humidityRh:43,dewPointC:8.2,treatment:'Treatment cycle complete',verification:'Sampling window active',provenance:'synthetic-demo'},
  {id:'A-00278',deviceId:'A-002',site:'Vancouver Lab',collectedAt:'2026-09-09 14:06',volumeL:74,state:'TREATED',temperatureC:19.7,humidityRh:76,dewPointC:15.4,treatment:'Treatment cycle complete',verification:'Not yet verified',provenance:'synthetic-demo'},
]
export const batchById = (id:string) => BATCHES.find((batch)=>batch.id.toLowerCase()===id.toLowerCase())
