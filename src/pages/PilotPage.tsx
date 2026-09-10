import { PilotHero } from '../marketing/route-heroes/PilotHero'
import { UseCases } from '../marketing/UseCases'
import { Pilot } from '../marketing/Pilot'
import { HardQuestions } from '../marketing/HardQuestions'
import { SiteAssessment } from '../marketing/SiteAssessment'
import { ChapterNext } from '../marketing/RouteTeasers'
import { ATMORA_ASSETS } from '../lib/assets'

export function PilotPage() {
  return <><PilotHero/><UseCases/><Pilot/><HardQuestions/><SiteAssessment/><ChapterNext to="/" index="01" label="Home" title="Return to the atmosphere." asset={ATMORA_ASSETS.hero}/></>
}
