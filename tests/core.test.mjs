import test from 'node:test'
import assert from 'node:assert/strict'
import { dewPointC } from '../artifacts/core-test-build/dewPoint.js'
import { validateAssessmentStep } from '../artifacts/core-test-build/assessment.js'
const validAssessment={site:'Almaty region',intendedUse:'Research / technical',temperature:'27',humidity:'64',name:'Test User',email:'test@example.com',organization:'',privacyAccepted:false}
test('dewPointC reproduces the illustrative 27.1C / 64% RH condition',()=>{assert.ok(Math.abs(dewPointC(27.1,64)-19.7)<.15)})
test('climate assessment rejects a blank temperature instead of treating it as 0C',()=>{const e=validateAssessmentStep(2,{...validAssessment,temperature:''});assert.equal(e.temperature,'Enter an approximate temperature between −30 and 60°C.')})
test('climate assessment rejects a blank humidity instead of coercing it to zero',()=>{const e=validateAssessmentStep(2,{...validAssessment,humidity:'  '});assert.equal(e.humidity,'Enter relative humidity between 1 and 100%.')})



test('remote assessment validation requires explicit privacy acknowledgement',()=>{
  const e=validateAssessmentStep(3,validAssessment,{requirePrivacyAcceptance:true})
  assert.equal(e.privacyAccepted,'Confirm the privacy notice before sending contact details.')
  const ok=validateAssessmentStep(3,{...validAssessment,privacyAccepted:true},{requirePrivacyAcceptance:true})
  assert.equal(ok.privacyAccepted,undefined)
})

test('route resolver normalizes canonical Atmora paths and returns a true not-found route', async () => {
  const { normalizePathname, routeForPath } = await import('../artifacts/core-test-build/routes.js')
  assert.equal(normalizePathname('/technology/'), '/technology')
  assert.equal(normalizePathname('//platform///'), '/platform')
  assert.equal(routeForPath('/lab').title, 'Atmora Lab')
  assert.equal(routeForPath('/pilot').index, '05')
  assert.equal(routeForPath('/not-a-route').path, '/404')
})

test('route metadata covers the complete public website', async () => {
  const { ATMORA_ROUTES } = await import('../artifacts/core-test-build/routes.js')
  assert.deepEqual(ATMORA_ROUTES.map((route) => route.path), ['/', '/technology', '/platform', '/lab', '/pilot', '/privacy'])
  assert.ok(ATMORA_ROUTES.every((route) => route.title && route.transitionLabel))
})


test('condensation timeline cannot show visible water before the dew-point threshold', async () => {
  const { condensationStateAt } = await import('../artifacts/core-test-build/condensationTimeline.js')
  for (let i = 0; i <= 100; i += 1) {
    const state = condensationStateAt(i / 100)
    if (state.surfaceTempC > state.dewPointC + 1e-6) assert.equal(state.waterVisible, false)
  }
})

test('dew-point crossing happens inside Threshold before Nucleation begins', async () => {
  const { condensationStateAt } = await import('../artifacts/core-test-build/condensationTimeline.js')
  const before = condensationStateAt(0.49)
  const crossing = condensationStateAt(0.50)
  const preNucleation = condensationStateAt(0.53)
  const nucleation = condensationStateAt(0.54)
  assert.equal(before.stage.key, 'threshold')
  assert.equal(before.thresholdCrossed, false)
  assert.equal(crossing.stage.key, 'threshold')
  assert.equal(crossing.thresholdCrossed, true)
  assert.equal(preNucleation.waterVisible, false)
  assert.equal(nucleation.stage.key, 'nucleation')
  assert.equal(nucleation.thresholdCrossed, true)
  assert.equal(nucleation.waterVisible, true)
})


test('operator route resolver covers console and dynamic evidence details', async () => {
  const { routeForPath, isOperatorRoute, APP_ROUTES } = await import('../artifacts/core-test-build/routes.js')
  assert.equal(routeForPath('/app').path, '/app/overview')
  assert.equal(routeForPath('/app/devices').title, 'Devices')
  assert.equal(routeForPath('/app/devices/A-001').entityId, 'A-001')
  assert.equal(routeForPath('/app/water/A-00284').entityId, 'A-00284')
  assert.equal(isOperatorRoute(routeForPath('/app/fleet')), true)
  assert.equal(APP_ROUTES.length, 9)
})

test('operator console unit conversions are deterministic and internally consistent', async () => {
  const { convertTemperature, convertVolume, convertEnergyIntensity } = await import('../artifacts/core-test-build/consoleUnits.js')
  assert.equal(convertTemperature(27.1, 'C'), 27.1)
  assert.equal(convertTemperature(27.1, 'F'), 80.8)
  assert.equal(convertVolume(527, 'L'), 527)
  assert.equal(convertVolume(527, 'gal'), 139.2)
  assert.equal(convertEnergyIntensity(0.71, 'L'), 0.71)
  assert.equal(convertEnergyIntensity(0.71, 'gal'), 2.69)
})
