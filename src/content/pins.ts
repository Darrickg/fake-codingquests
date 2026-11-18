// The concept layer. Only our three recommendations get pins.
// Each pin names its recommendation and says, in one sentence, what changes at that spot.
// The "why" and "measure" lines come from the recommendation. Plain words, no numbers.

export type RecId = 'packs' | 'video' | 'ask'

export interface Recommendation {
  id: RecId
  letter: 'A' | 'B' | 'C'
  name: string
  summary: string
  why: string
  measure: string
  /** Where to see it on this site. */
  seeIt: { label: string; to: string }[]
}

export const recommendations: Record<RecId, Recommendation> = {
  packs: {
    id: 'packs',
    letter: 'A',
    name: 'Packs and tiers',
    summary:
      'More ways in, all built from lessons that already exist: two cheaper memberships by level beside Guild Hall, and Quest Packs you buy once and keep.',
    why: 'Hobbyists learn in bursts, one project at a time, so a monthly all-access plan asks for more commitment than many of them want, and most rival Godot courses are sold once. The lessons already exist, so a pack is a repackaging job for a solo founder, not new content.',
    measure: 'Pack sales by topic, how many pack buyers later join, and how many members stay past their first month.',
    seeIt: [
      { label: 'Packs', to: '/packs' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Ways to open a quest', to: '/quests/2d-top-down-combat-and-damage' },
    ],
  },
  video: {
    id: 'video',
    letter: 'B',
    name: 'Video to quest',
    summary: 'Every YouTube video links to the one lesson that continues it, so a viewer lands on something they already care about.',
    why: 'The channel is how most people find CodingQuests, and a link to the exact lesson gives a viewer a reason to click that a link to the home page does not. It costs the founder one line of text per video.',
    measure: 'Site visitors per thousand views for each video, the share who start a lesson, and the share who finish two.',
    seeIt: [
      { label: 'A video landing page', to: '/from/why-most-top-down-movement-feels-bad' },
      { label: 'Video row on the home page', to: '/#videos' },
    ],
  },
  ask: {
    id: 'ask',
    letter: 'C',
    name: 'Ask the members',
    summary: 'Three small questions inside the site: how people would rather pay, which pack should come next, and why a member leaves.',
    why: 'A young one-person business knows little about what its customers want. A question asked inside the site costs close to nothing.',
    measure: 'Responses per week, the split between pay-monthly and pay-once answers, and votes per pack topic.',
    seeIt: [
      { label: 'Pricing poll', to: '/pricing#poll' },
      { label: 'Next pack vote', to: '/packs#vote' },
      { label: 'Leave flow', to: '/realm/leave' },
    ],
  },
}

export const recList: Recommendation[] = [recommendations.packs, recommendations.video, recommendations.ask]

export const pins = {
  'nav-packs': { rec: 'packs', change: 'Packs gets its own place in the menu.' },
  'home-videos': { rec: 'video', change: 'A new row on the home page: pick the video you came from and go straight to its lesson.' },
  'home-packs': { rec: 'packs', change: 'Packs appear on the home page for people who need one system, not a whole course.' },
  'home-ways': { rec: 'packs', change: 'A plain summary of the ways to pay, including the new ones.' },
  'packs-page': { rec: 'packs', change: 'A new page for Quest Packs: existing quests bundled by topic, bought once and kept.' },
  'pack-credit': { rec: 'packs', change: 'Pack credit: money spent on packs counts toward a membership, so nobody pays twice.' },
  'vote-board': { rec: 'ask', change: 'A vote on which pack to make next, so the next topic is one people asked for.' },
  'pricing-tabs': { rec: 'packs', change: 'Pricing is split into paying once and paying monthly.' },
  'level-plans': { rec: 'packs', change: 'Two cheaper plans by level sit beside Guild Hall, which stays as it is.' },
  'pricing-poll': { rec: 'ask', change: 'A one-question poll on how people would rather pay.' },
  'from-page': { rec: 'video', change: 'A landing page for each video that starts its matching lesson.' },
  'from-offer': { rec: 'packs', change: 'After the lesson, the pack or campaign that fits the video.' },
  'quest-ways': { rec: 'packs', change: 'Each quest lists every way to open it, not only the full membership.' },
  'quest-video': { rec: 'video', change: 'The quest names the video it continues.' },
  'campaign-plan': { rec: 'packs', change: 'Each campaign says which level plan opens it.' },
  'library-pack-filter': { rec: 'packs', change: 'Filter the library to quests that come in a pack.' },
  'leave-question': { rec: 'ask', change: 'One question when a member leaves, before anything else happens.' },
  'leave-offers': { rec: 'packs', change: 'Leaving offers a pack or a cheaper plan instead of all or nothing.' },
  'lesson-next': { rec: 'packs', change: 'After lesson 2, one of the next steps is owning the topic as a pack.' },
  'lesson-nudge': { rec: 'video', change: 'Lesson 1 ends by sending you straight into lesson 2.' },
  'realm-packs': { rec: 'packs', change: 'Packs you own stay in your Realm for good.' },
  'checkout-credit': { rec: 'packs', change: 'Checkout shows pack credit coming off the first payment.' },
  'concept-paste': { rec: 'video', change: 'What the founder pastes under each video.' },
} satisfies Record<string, { rec: RecId; change: string }>

export type PinId = keyof typeof pins
