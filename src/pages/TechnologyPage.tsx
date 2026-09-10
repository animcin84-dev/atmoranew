import { TechnologyHero } from '../marketing/route-heroes/TechnologyHero'
import { ClimateReality } from '../marketing/ClimateReality'
import { CondensationStory } from '../marketing/CondensationStory'
import { Device } from '../marketing/Device'
import { Energy } from '../marketing/Energy'
import { ChapterNext } from '../marketing/RouteTeasers'
import { ATMORA_ASSETS } from '../lib/assets'

export function TechnologyPage() {
  return <><TechnologyHero/><ClimateReality/><CondensationStory/><Device/><Energy/><ChapterNext to="/platform" index="03" label="Platform" title="Measure what changes." asset={ATMORA_ASSETS.atmosphereLight}/></>
}
