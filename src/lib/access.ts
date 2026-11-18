// What is open under the current "view as" plan and purchases.
import { campaignsForQuest, freePreviewLessons, questBySlug, type Campaign, type Quest } from '../content/catalog'
import { packs, packCredit, type Pack } from '../content/packs'
import { planById, plans, type Plan, type PlanId } from '../content/plans'
import type { DemoState } from './store'
import { ownedPackSlugs } from './store'

export function planOpensCampaign(plan: Plan, c: Campaign): boolean {
  return plan.opens.campaigns === 'all' || plan.opens.campaigns.includes(c.slug)
}

export function planOpensQuest(plan: Plan, q: Quest): boolean {
  if (plan.opens.levels === 'all') return true
  if (plan.opens.levels.includes(q.level)) return true
  return campaignsForQuest(q.slug).some((c) => planOpensCampaign(plan, c))
}

/** The cheapest new level plan that opens this quest. */
export function levelPlanForQuest(q: Quest): Plan | undefined {
  return plans.filter((p) => p.isNew).find((p) => planOpensQuest(p, q))
}

export function levelPlanForCampaign(c: Campaign): Plan | undefined {
  return plans.filter((p) => p.isNew).find((p) => planOpensCampaign(p, c))
}

export const packsForQuest = (slug: string): Pack[] => packs.filter((p) => p.quests.includes(slug))

export type QuestOpenReason = 'free' | 'pack' | 'plan' | null

export function questAccess(s: DemoState, slug: string): { open: boolean; reason: QuestOpenReason; freeLessons: number } {
  const q = questBySlug[slug]
  if (!q) return { open: false, reason: null, freeLessons: 0 }
  const free = q.access === 'free' ? (q.lessons ?? 0) : q.access === 'partial' ? freePreviewLessons(q) : 0
  if (q.access === 'free') return { open: true, reason: 'free', freeLessons: free }
  const owned = ownedPackSlugs(s)
  if (packsForQuest(slug).some((p) => owned.has(p.slug))) return { open: true, reason: 'pack', freeLessons: free }
  if (planOpensQuest(planById[s.viewAs], q) && s.viewAs !== 'free') return { open: true, reason: 'plan', freeLessons: free }
  return { open: false, reason: null, freeLessons: free }
}

export function lessonOpen(s: DemoState, slug: string, lessonNumber: number): boolean {
  const a = questAccess(s, slug)
  return a.open || lessonNumber <= a.freeLessons
}

export function campaignOpen(s: DemoState, c: Campaign): boolean {
  return s.viewAs !== 'free' && planOpensCampaign(planById[s.viewAs], c)
}

/** Pack credit available toward a first membership payment. */
export function availableCredit(s: DemoState, now = Date.now()): number {
  if (s.joinedAt) return 0
  const windowMs = packCredit.days * 24 * 60 * 60 * 1000
  return s.purchases.filter((p) => now - p.at <= windowMs).reduce((sum, p) => sum + p.paid, 0)
}

export const isMember = (id: PlanId) => id !== 'free'
