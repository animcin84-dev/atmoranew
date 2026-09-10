import { PlatformHero } from '../marketing/route-heroes/PlatformHero'
import { Intelligence } from '../marketing/Intelligence'
import { Cloud } from '../marketing/Cloud'
import { Energy } from '../marketing/Energy'
import { ChapterNext } from '../marketing/RouteTeasers'
import { ATMORA_ASSETS } from '../lib/assets'

export function PlatformPage() {
  return <><PlatformHero/><Intelligence/><Cloud/><Energy/><ChapterNext to="/lab" index="04" label="Atmora Lab" title="Make evidence visible." asset={ATMORA_ASSETS.condensationGrowth}/></>
}
