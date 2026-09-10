import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { submitAssessment, validateAssessmentStep, type AssessmentData } from '../lib/assessment'
import { RouteLink } from '../components/RouteLink'

const initialData: AssessmentData = { site: '', intendedUse: '', temperature: '27', humidity: '64', name: '', email: '', organization: '', privacyAccepted: false }
const uses = ['Hospitality', 'Research / technical', 'Operational resilience', 'Other / exploring'] as const
const labels = ['Where is the site?', 'What would the water support?', 'What are the approximate conditions?', 'Who should we contact?'] as const

export function SiteAssessment() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState(initialData)
  const [errors, setErrors] = useState<ReturnType<typeof validateAssessmentStep>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submissionMode, setSubmissionMode] = useState<'remote' | 'local-demo'>('local-demo')
  const [submitError, setSubmitError] = useState('')
  const stepHeadingRef = useRef<HTMLDivElement>(null)
  const previousStepRef = useRef(step)
  const progress = useMemo(() => ((step + 1) / 4) * 100, [step])
  const endpoint = import.meta.env.VITE_ATMORA_ASSESSMENT_ENDPOINT?.trim()

  useEffect(() => {
    if (previousStepRef.current === step) return
    previousStepRef.current = step
    requestAnimationFrame(() => stepHeadingRef.current?.focus({ preventScroll: true }))
  }, [step])

  const patch = (key: keyof AssessmentData, value: string) => {
    setData((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
    setSubmitError('')
  }

  const next = () => {
    const nextErrors = validateAssessmentStep(step, data)
    setErrors(nextErrors)
    if (!Object.keys(nextErrors).length) setStep((value) => Math.min(3, value + 1))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validateAssessmentStep(3, data, { requirePrivacyAcceptance: Boolean(endpoint) })
    setErrors(nextErrors)
    setSubmitError('')
    if (Object.keys(nextErrors).length) return
    setSubmitting(true)
    const result = await submitAssessment(data, endpoint)
    setSubmitting(false)
    if (result.ok) {
      setSubmissionMode(result.mode)
      setSubmitted(true)
    } else {
      setSubmitError(result.error)
    }
  }

  return (
    <section id="assessment" className="assessment section section--dark" aria-labelledby="assessment-title">
      <div className="container assessment__grid">
        <div className="assessment__intro" data-reveal>
          <p className="kicker">Site assessment</p>
          <h2 id="assessment-title" className="display display--md">Start with<br />the conditions.</h2>
          <p className="body-lg">A useful conversation begins with location, intended use and approximate climate — not a generic “book a demo” form.</p>
          {!endpoint ? <p className="assessment__demo-note">Local demo mode is active. No contact data is transmitted until a production assessment endpoint is configured.</p> : null}
        </div>
        <div className="assessment__panel" data-reveal>
          {submitted ? (
            <div className="assessment__success" role="status">
              <span className="mono">{submissionMode === 'remote' ? 'ASSESSMENT / RECEIVED' : 'LOCAL DEMO / COMPLETE'}</span>
              <h3>{submissionMode === 'remote' ? 'Your site context has been received.' : 'Assessment captured in this browser state.'}</h3>
              <p>{submissionMode === 'remote' ? 'The submitted context can now be reviewed as the starting point for a site conversation.' : 'No data was sent anywhere. Configure the production endpoint before collecting real leads.'}</p>
              <button className="button button--ghost" type="button" onClick={() => { setSubmitted(false); setStep(0); setData(initialData); setSubmitError('') }}>Start again <span aria-hidden="true">↺</span></button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="assessment__progress" role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={step + 1} aria-label={`Step ${step + 1} of 4`}><i style={{ width: `${progress}%` }} /></div>
              <div ref={stepHeadingRef} id="assessment-step-heading" className="assessment__step-head" tabIndex={-1}><span className="mono">0{step + 1} / 04</span><span>{labels[step]}</span></div>

              {step === 0 ? <label className="field" htmlFor="assessment-site"><span>City, region or site name</span><input id="assessment-site" autoComplete="address-level2" value={data.site} onChange={(event: ChangeEvent<HTMLInputElement>) => patch('site', event.target.value)} placeholder="e.g. Almaty region" aria-invalid={Boolean(errors.site)} aria-describedby={errors.site ? 'site-error' : undefined} />{errors.site ? <small id="site-error" role="alert">{errors.site}</small> : null}</label> : null}

              {step === 1 ? <fieldset className="choice-group" aria-describedby={errors.intendedUse ? 'use-error' : undefined}><legend>Intended use</legend>{uses.map((use) => <label key={use}><input type="radio" name="use" value={use} checked={data.intendedUse === use} onChange={(event: ChangeEvent<HTMLInputElement>) => patch('intendedUse', event.target.value)} /><span>{use}</span></label>)}{errors.intendedUse ? <small id="use-error" role="alert">{errors.intendedUse}</small> : null}</fieldset> : null}

              {step === 2 ? <div className="field-grid"><label className="field" htmlFor="assessment-temperature"><span>Typical temperature (°C)</span><input id="assessment-temperature" inputMode="decimal" value={data.temperature} onChange={(event: ChangeEvent<HTMLInputElement>) => patch('temperature', event.target.value)} aria-invalid={Boolean(errors.temperature)} aria-describedby={errors.temperature ? 'temperature-error' : undefined} />{errors.temperature ? <small id="temperature-error" role="alert">{errors.temperature}</small> : null}</label><label className="field" htmlFor="assessment-humidity"><span>Relative humidity (%)</span><input id="assessment-humidity" inputMode="decimal" value={data.humidity} onChange={(event: ChangeEvent<HTMLInputElement>) => patch('humidity', event.target.value)} aria-invalid={Boolean(errors.humidity)} aria-describedby={errors.humidity ? 'humidity-error' : undefined} />{errors.humidity ? <small id="humidity-error" role="alert">{errors.humidity}</small> : null}</label><p className="field-grid__note">Approximate values are enough. They are used for qualification context only, not a yield promise.</p></div> : null}

              {step === 3 ? <div className="field-grid"><label className="field" htmlFor="assessment-name"><span>Name</span><input id="assessment-name" autoComplete="name" value={data.name} onChange={(event: ChangeEvent<HTMLInputElement>) => patch('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />{errors.name ? <small id="name-error" role="alert">{errors.name}</small> : null}</label><label className="field" htmlFor="assessment-email"><span>Email</span><input id="assessment-email" type="email" autoComplete="email" value={data.email} onChange={(event: ChangeEvent<HTMLInputElement>) => patch('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />{errors.email ? <small id="email-error" role="alert">{errors.email}</small> : null}</label><label className="field field--full" htmlFor="assessment-organization"><span>Organization <em>optional</em></span><input id="assessment-organization" autoComplete="organization" value={data.organization} onChange={(event: ChangeEvent<HTMLInputElement>) => patch('organization', event.target.value)} /></label>{endpoint ? <label className="assessment__consent field--full" htmlFor="assessment-privacy"><input id="assessment-privacy" type="checkbox" checked={data.privacyAccepted} required={Boolean(endpoint)} aria-invalid={Boolean(errors.privacyAccepted)} aria-describedby={errors.privacyAccepted ? 'privacy-help privacy-error' : 'privacy-help'} onChange={(event) => { setData((current) => ({ ...current, privacyAccepted: event.target.checked })); setErrors((current) => ({ ...current, privacyAccepted: undefined })); setSubmitError('') }} /><span><b>Privacy acknowledgement</b><small id="privacy-help">I have read the <RouteLink to="/privacy">Privacy notice</RouteLink> and agree that these assessment details may be sent to the configured Atmora assessment endpoint so I can be contacted about this request.</small>{errors.privacyAccepted ? <em id="privacy-error" role="alert">{errors.privacyAccepted}</em> : null}</span></label> : null}</div> : null}

              {submitError ? <p className="assessment__submit-error" role="alert">{submitError}</p> : null}
              <div className="assessment__actions"><button className="button button--ghost" type="button" disabled={step === 0} onClick={() => { setErrors({}); setSubmitError(''); setStep((value) => Math.max(0, value - 1)) }}>← Back</button>{step < 3 ? <button className="button" type="button" onClick={next}>Continue <span aria-hidden="true">→</span></button> : <button className="button" type="submit" disabled={submitting}>{submitting ? 'Submitting…' : endpoint ? 'Submit assessment' : 'Complete local demo'} <span aria-hidden="true">→</span></button>}</div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
