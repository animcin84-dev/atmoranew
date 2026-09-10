import { LabHero } from '../marketing/route-heroes/LabHero'
import { EvidencePrinciples } from '../marketing/EvidencePrinciples'
import { Evidence } from '../marketing/Evidence'
import { WaterBatch } from '../marketing/WaterBatch'
import { ChapterNext } from '../marketing/RouteTeasers'
import { ATMORA_ASSETS } from '../lib/assets'

export function LabPage() {
  return <><LabHero/><EvidencePrinciples/><Evidence/><WaterBatch/><ChapterNext to="/pilot" index="05" label="Pilot" title="Prove it on site." asset={ATMORA_ASSETS.research}/></>
}
