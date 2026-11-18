// Memberships. Apprentice and Adventurer are our proposal (recommendation A). All prices are placeholders.
import type { CampaignSlug, Level } from './catalog'
import { packCredit } from './packs'

export type PlanId = 'free' | 'apprentice' | 'adventurer' | 'guild'
export type Period = 'month' | 'year'

export interface Plan {
  id: PlanId
  name: string
  /** True for plans that are part of our proposal. They get a brass pin. */
  isNew: boolean
  short: string
  price: { month: number; year: number }
  opens: { levels: Level[] | 'all'; campaigns: CampaignSlug[] | 'all' }
  includes: string[]
  /** Order used when comparing plans. */
  rank: number
}

export const trialDays = 7

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    isNew: false,
    short: 'As today. Free for good.',
    price: { month: 0, year: 0 },
    opens: { levels: [], campaigns: [] },
    includes: ['10 complete quests', 'The first lessons of every campaign', 'Progress and XP saved'],
    rank: 0,
  },
  {
    id: 'apprentice',
    name: 'Apprentice',
    isNew: true,
    short: 'Every Beginner quest, plus the 2D Platformer and 2D Top-Down RPG campaigns.',
    price: { month: 12, year: 96 },
    opens: { levels: ['Beginner'], campaigns: ['2d-platformer', '2d-top-down-rpg'] },
    includes: [
      'All Beginner quests',
      '2D Platformer campaign',
      '2D Top-Down RPG campaign',
      'Project files for those campaigns',
    ],
    rank: 1,
  },
  {
    id: 'adventurer',
    name: 'Adventurer',
    isNew: true,
    short: 'Every Intermediate and Advanced quest, plus the 2D Roguelike, 3D Roguelike and Co-op campaigns.',
    price: { month: 18, year: 144 },
    opens: {
      levels: ['Intermediate', 'Advanced'],
      campaigns: ['2d-roguelike', '3d-roguelike', 'co-op-multiplayer'],
    },
    includes: [
      'All Intermediate and Advanced quests',
      '2D Roguelike campaign',
      '3D Roguelike campaign',
      'Co-op Multiplayer campaign',
      'Project files for those campaigns',
    ],
    rank: 2,
  },
  {
    id: 'guild',
    name: 'Guild Hall',
    isNew: false,
    short: 'Everything. Unchanged from today.',
    price: { month: 25, year: 200 },
    opens: { levels: 'all', campaigns: 'all' },
    includes: [
      'Every quest and campaign',
      'Downloadable Godot project files',
      'New quests each month',
      'Feedback on your builds from the creator',
      'Daily challenges',
      'Early access to prototypes',
    ],
    rank: 3,
  },
]

export const planById = Object.fromEntries(plans.map((p) => [p.id, p])) as Record<PlanId, Plan>
export const paidPlans = plans.filter((p) => p.id !== 'free')

export const planCopy = {
  trialLine: `Every paid plan starts with a ${trialDays}-day free trial. A card is needed to start it, and you can cancel before it ends.`,
  currentMembersLine: 'Already in the Guild Hall? Nothing changes. You keep your plan and your price.',
  yearlyNote: 'Billed once a year',
  monthlyNote: 'Billed monthly',
}

export const pricingCopy = {
  title: 'Pay the way you learn.',
  sub: 'Buy one topic and keep it, or join for a level or for everything. Free stays free.',
  tabOnce: 'Pay once',
  tabMember: 'Membership',
  periodMonth: 'Monthly',
  periodYear: 'Yearly',
  freeTitle: 'Or start free',
  freeBody: '10 complete quests and the first lessons of every campaign. No card, no trial, no end date.',
  faqTitle: 'Straight answers',
  faq: [
    {
      q: 'Do I keep a pack if I never subscribe?',
      a: 'Yes. A pack is one payment and it stays yours, with its project files, whether or not you ever join.',
    },
    {
      q: 'Does a pack count toward a membership?',
      a: `Yes. Join any membership within ${packCredit.days} days of buying a pack and what you paid for packs comes off your first payment.`,
    },
    {
      q: 'I already pay for Guild Hall. What changes?',
      a: 'Nothing. You already have everything, and you keep your plan and your price.',
    },
    {
      q: 'Is a card needed for the trial?',
      a: `Yes, the ${trialDays}-day free trial on a paid plan needs a card, and you can cancel before it ends. The free quests never need one.`,
    },
    {
      q: 'Can I move between plans?',
      a: 'Yes. Move up, down or across at any time from your Realm. In this concept, use "View the site as" to try each one.',
    },
  ],
}

// Recommendation C, question 1.
export const poll = {
  question: 'If you paid for something like this, how would you rather pay?',
  options: [
    { id: 'monthly-all', label: 'Monthly, with everything included' },
    { id: 'monthly-level', label: 'Monthly, for my level only' },
    { id: 'once-topic', label: 'Once, for one topic' },
    { id: 'once-bundle', label: 'Once, for a bundle of topics' },
    { id: 'free-only', label: 'I would stick to the free quests' },
  ],
}

// Recommendation C, question 3, plus the offers that follow it (recommendation A).
export const leaveFlow = {
  title: 'Before you go',
  question: 'What made you stop?',
  reasons: [
    { id: 'finished', label: 'I finished what I came for', offer: 'pack' },
    { id: 'time', label: "I don't have time right now", offer: 'pack' },
    { id: 'one-topic', label: 'I only needed one topic', offer: 'pack' },
    { id: 'cost', label: 'It costs too much', offer: 'cheaper' },
    { id: 'broken', label: 'Something was confusing or broken', offer: 'text' },
  ] as const,
  packOfferTitle: 'Keep one topic instead',
  packOfferBody: 'Pick the topic you care about and keep it as a pack. One payment, no monthly bill, and it stays yours.',
  cheaperOfferTitle: 'Try a cheaper plan',
  cheaperOfferBody: (name: string, price: string) => `${name} costs ${price} a month and keeps the quests for your level.`,
  noCheaperBody: 'You are already on the cheapest plan. A pack might suit you better: one payment, yours to keep.',
  textTitle: 'Tell us what went wrong',
  textBody: 'In this concept this box goes nowhere. On the real site it would go to the founder.',
  textPlaceholder: 'What happened?',
  textSend: 'Send',
  textSent: 'Thanks. In this concept nothing was sent.',
  cancelAnyway: 'Cancel anyway',
  cancelled: 'Your membership is cancelled. Your progress and anything you bought stay in your Realm.',
  back: 'Back to Realm',
}
