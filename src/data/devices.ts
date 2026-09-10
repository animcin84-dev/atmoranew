export type DeviceStatus = 'online' | 'warning' | 'offline' | 'maintenance'
export type DeviceWaterState = 'RAW CONDENSATE' | 'TREATED' | 'VERIFICATION' | 'VERIFIED FOR INTENDED USE'

export type Device = {
  id: string; name: string; site: string; region: string; status: DeviceStatus; waterState: DeviceWaterState;
  waterTodayL: number; temperatureC: number; humidityRh: number; dewPointC: number; tankPercent: number;
  energyKwhPerL: number; lastSeen: string; x: number; y: number; serial: string; provenance: 'synthetic-demo'
}

export const DEVICES: readonly Device[] = [
  { id:'A-001', name:'North Array', site:'Site Alpha', region:'Almaty', status:'online', waterState:'VERIFICATION', waterTodayL:527, temperatureC:27.1, humidityRh:64, dewPointC:19.6, tankPercent:72, energyKwhPerL:.71, lastSeen:'14:42', x:67, y:32, serial:'A001-24-7F3', provenance:'synthetic-demo' },
  { id:'A-002', name:'Harbour Unit', site:'Vancouver Lab', region:'Vancouver', status:'online', waterState:'TREATED', waterTodayL:384, temperatureC:19.4, humidityRh:77, dewPointC:15.2, tankPercent:61, energyKwhPerL:.83, lastSeen:'14:41', x:14, y:27, serial:'A002-24-8C1', provenance:'synthetic-demo' },
  { id:'A-003', name:'Geothermal Wing', site:'Nordic Test', region:'Reykjavik', status:'warning', waterState:'RAW CONDENSATE', waterTodayL:163, temperatureC:12.8, humidityRh:82, dewPointC:9.8, tankPercent:34, energyKwhPerL:1.04, lastSeen:'14:39', x:44, y:18, serial:'A003-25-1D2', provenance:'synthetic-demo' },
  { id:'A-004', name:'Bay Module', site:'East Field', region:'Tokyo', status:'online', waterState:'VERIFIED FOR INTENDED USE', waterTodayL:612, temperatureC:29.6, humidityRh:71, dewPointC:23.7, tankPercent:84, energyKwhPerL:.65, lastSeen:'14:42', x:84, y:37, serial:'A004-25-2A4', provenance:'synthetic-demo' },
  { id:'A-005', name:'Equatorial Pilot', site:'Research Annex', region:'Nairobi', status:'maintenance', waterState:'TREATED', waterTodayL:0, temperatureC:23.2, humidityRh:58, dewPointC:14.5, tankPercent:18, energyKwhPerL:.92, lastSeen:'12:08', x:58, y:60, serial:'A005-25-4B7', provenance:'synthetic-demo' },
  { id:'A-006', name:'Andes Module', site:'Dry Air Lab', region:'Santiago', status:'warning', waterState:'VERIFICATION', waterTodayL:118, temperatureC:21.1, humidityRh:42, dewPointC:7.7, tankPercent:29, energyKwhPerL:1.18, lastSeen:'14:37', x:26, y:72, serial:'A006-25-5E9', provenance:'synthetic-demo' },
  { id:'A-007', name:'Coastal Unit', site:'South Lab', region:'Sydney', status:'online', waterState:'TREATED', waterTodayL:441, temperatureC:24.3, humidityRh:69, dewPointC:18.2, tankPercent:66, energyKwhPerL:.76, lastSeen:'14:40', x:88, y:75, serial:'A007-25-6C2', provenance:'synthetic-demo' },
  { id:'A-008', name:'Desert Study', site:'Heat Envelope', region:'Dubai', status:'offline', waterState:'RAW CONDENSATE', waterTodayL:0, temperatureC:36.8, humidityRh:31, dewPointC:17.2, tankPercent:10, energyKwhPerL:1.34, lastSeen:'09:16', x:68, y:49, serial:'A008-25-7A8', provenance:'synthetic-demo' },
] as const

export const deviceById = (id: string) => DEVICES.find((device) => device.id.toLowerCase() === id.toLowerCase())
