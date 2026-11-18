// Site-wide wording and switches. Teammates: edit freely, no component changes needed.

export const site = {
  wordmark: 'Coding Quests',
  brand: 'CodingQuests',
  team: 'Group Delta',
  course: 'SFU BUS 401',
  realSiteUrl: 'https://codingquests.io',
  realSiteLabel: 'codingquests.io',
  channelUrl: 'https://www.youtube.com/@codingQuests',
  channelLabel: 'youtube.com/@codingQuests',
  /** Base used when showing what a video description link would look like. */
  publicLinkBase: 'codingquests.io',

  /** Every page title starts with this. */
  titlePrefix: 'Concept:',
  defaultTitle: 'Concept: Coding Quests, by Group Delta',

  conceptBar: {
    line: 'Concept demo by Group Delta, SFU BUS 401.',
    notReal: 'Not the real CodingQuests site.',
    pill: 'Concept',
    aboutLink: 'About this concept',
    changesSwitch: 'Show our changes',
    firstVisitHint: 'Tap a brass pin to see what we changed and why.',
  },

  /** Shows a small "Example price" tag beside every price. */
  showExamplePriceTags: true,
  examplePriceLabel: 'Example price',
  currency: 'USD',

  noPaymentLine: 'This is a concept. No payment is taken.',
  fakeBuyButton: 'Pretend to buy',
  storedOnDeviceLine: 'Thanks. In this concept your answer stays on this phone.',
  onlyOneQuestPlayable:
    'Only one quest is playable in this concept: the first two lessons of 2D Top-Down Character Movement.',
  previewSimulated: 'Preview is simulated in this concept.',

  home: {
    h1: 'Build Godot games you understand.',
    sub: 'Short lessons in Godot 4 and GDScript. You write the code, a check runs it, and every quest builds a real piece of a game you keep.',
    primaryCta: 'Try a free lesson',
    secondaryCta: 'I already code',
    noSignup: 'No signup. No card. Your progress stays on this device.',
    videosTitle: 'Came from a video?',
    videosSub: 'Every video now links to the one lesson that continues it.',
    roadTitle: 'The road out of tutorial hell',
    road: [
      { title: 'Learn the basics', body: 'Variables, functions and nodes, one small step at a time.' },
      { title: 'Build game systems', body: 'Movement, combat, inventory. Each quest is one system that works.' },
      { title: 'Make them your own', body: 'Prove It challenges ask you to reuse the idea with no help.' },
      { title: 'Finish a game', body: 'A campaign chains the quests into a game you can ship.' },
    ],
    previewTitle: 'Try it right here',
    previewSub: 'This is the first lesson of 2D Top-Down Character Movement. Pick the missing word and move the knight.',
    campaignsTitle: 'Choose a game to build',
    campaignsSub: 'Five campaigns, easiest first. The first quest of each is free.',
    packsTitle: 'Just need one system?',
    packsSub: 'Quest Packs bundle the quests for one topic. Pay once and keep them.',
    waysTitle: 'Three ways in',
    ways: [
      { title: 'Start free', body: 'Ten whole quests and the first lessons of every campaign. Free for good.' },
      { title: 'Buy a pack once', body: 'One topic, its quests and project files. One payment. Yours to keep.' },
      { title: 'Join', body: 'A membership for your level, or Guild Hall for everything.' },
    ],
    closingTitle: 'Start with a knight that walks.',
    closingSub: 'Then fix the bug that makes every diagonal too fast. Both lessons are free.',
  },

  footer: {
    note: 'Concept demo by Group Delta, SFU BUS 401. Not the real CodingQuests site. Built as a class project, not run by CodingQuests. Nothing here is for sale and nothing you do leaves this device.',
  },
} as const

export type Site = typeof site

export const conceptPage = {
  title: 'About this concept',
  intro: [
    'This site is a concept made by Group Delta, a student team in the BUS 401 strategy capstone at Simon Fraser University. CodingQuests is our client for the course.',
    'It is a class project. It is not run by CodingQuests, nothing here is for sale, and the prices are examples. Everything you click is stored on your own device and nowhere else.',
    'It shows what the site could look like with our three recommendations in place. Anything that comes from one of them carries a brass "New" pin. Everything else follows the real site as it is today.',
  ],
  pasteTitle: 'What the founder would paste under a video',
  pasteSub: 'One line in the description, a pinned comment, and one sentence said on camera. That is the whole job.',
  pasteExampleVideo: 'why-most-top-down-movement-feels-bad',
  realSiteCta: 'Visit the real CodingQuests',
  channelCta: 'The CodingQuests channel',
  resetHint: 'To start over, use Reset demo in your Realm.',
}

export const realmCopy = {
  title: 'Your Realm',
  sub: 'Everything you have built and everything you own. In this concept it lives on this device only.',
  campTitle: 'Your camp',
  campSub: 'From 2D Top-Down Character Movement. It grows as you pass lessons.',
  packsTitle: 'Your packs',
  noPacks: 'No packs yet.',
  planTitle: 'Your plan',
  demoTitle: 'Demo controls',
  demoSub: 'Not part of the product. These let you see the site from each plan.',
  viewAs: 'View the site as',
  reset: 'Reset demo',
  resetConfirm: 'Clear all progress, purchases and answers on this device?',
  resetDone: 'Demo reset.',
  leave: 'Cancel membership',
}

export const notFoundCopy = {
  title: 'This path is not on the map.',
  body: 'The road you followed ends here. Head back to camp and pick another way.',
  cta: 'Back to the home page',
}
