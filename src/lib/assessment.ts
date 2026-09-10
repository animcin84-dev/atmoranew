export type AssessmentData = {
  site: string
  intendedUse: string
  temperature: string
  humidity: string
  name: string
  email: string
  organization: string
  privacyAccepted: boolean
}

export type AssessmentErrors = Partial<Record<keyof AssessmentData, string>>
export type AssessmentValidationOptions = { requirePrivacyAcceptance?: boolean }

export type AssessmentSubmissionResult =
  | { ok: true; mode: 'remote' | 'local-demo' }
  | { ok: false; mode: 'remote'; error: string }

export function validateAssessmentStep(step: number, data: AssessmentData, options: AssessmentValidationOptions = {}): AssessmentErrors {
  const errors: AssessmentErrors = {}
  if (step === 0 && data.site.trim().length < 2) errors.site = 'Enter a city, region, or site name.'
  if (step === 1 && !data.intendedUse) errors.intendedUse = 'Choose an intended use.'
  if (step === 2) {
    const temperatureText = data.temperature.trim()
    const humidityText = data.humidity.trim()
    const temperature = Number(temperatureText)
    const humidity = Number(humidityText)
    if (!temperatureText || !Number.isFinite(temperature) || temperature < -30 || temperature > 60) {
      errors.temperature = 'Enter an approximate temperature between −30 and 60°C.'
    }
    if (!humidityText || !Number.isFinite(humidity) || humidity < 1 || humidity > 100) {
      errors.humidity = 'Enter relative humidity between 1 and 100%.'
    }
  }
  if (step === 3) {
    if (data.name.trim().length < 2) errors.name = 'Enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(data.email)) errors.email = 'Enter a valid email address.'
    if (options.requirePrivacyAcceptance && !data.privacyAccepted) errors.privacyAccepted = 'Confirm the privacy notice before sending contact details.'
  }
  return errors
}

export async function submitAssessment(data: AssessmentData, endpoint?: string): Promise<AssessmentSubmissionResult> {
  const target = endpoint?.trim()
  if (!target) {
    await new Promise((resolve) => setTimeout(resolve, 240))
    return { ok: true, mode: 'local-demo' }
  }

  if (!data.privacyAccepted) return { ok: false, mode: 'remote', error: 'Confirm the privacy notice before sending contact details.' }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8_000)
  try {
    const response = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        site: data.site.trim(),
        intendedUse: data.intendedUse,
        temperature: data.temperature.trim(),
        humidity: data.humidity.trim(),
        name: data.name.trim(),
        email: data.email.trim(),
        organization: data.organization.trim(),
        source: 'atmora-site-assessment',
      }),
      signal: controller.signal,
    })
    if (!response.ok) return { ok: false, mode: 'remote', error: 'The assessment could not be submitted. Please try again.' }
    return { ok: true, mode: 'remote' }
  } catch {
    return { ok: false, mode: 'remote', error: 'The assessment service is temporarily unavailable. Please try again.' }
  } finally {
    clearTimeout(timeout)
  }
}
