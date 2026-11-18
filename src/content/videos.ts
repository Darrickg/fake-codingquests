// Video to quest (recommendation B). Real videos from the CodingQuests channel, each matched to
// the closest existing quest. No thumbnails, no embeds, no view counts.

export type VideoOffer =
  | { kind: 'pack'; pack: string }
  | { kind: 'campaign'; campaign: string }
  | { kind: 'vote'; candidate: string }
  | { kind: 'plan'; plan: 'guild' }

export interface Video {
  slug: string
  title: string
  quest: string
  offer: VideoOffer
  /** Short label drawn on the SVG card. */
  card: { glyph: 'walk' | 'sword' | 'eye' | 'maze' | 'spring' | 'door' | 'pencil' | 'coin' | 'menu' | 'cube'; tint: string }
}

export const videos: Video[] = [
  {
    slug: 'why-most-top-down-movement-feels-bad',
    title: 'Why Most Top-Down Movement Feels Bad',
    quest: '2d-top-down-character-movement',
    offer: { kind: 'pack', pack: 'top-down-starter' },
    card: { glyph: 'walk', tint: '#2f4a3a' },
  },
  {
    slug: 'why-your-combat-feels-weak',
    title: 'Why Your Combat Feels Weak',
    quest: 'game-feel-make-combat-hit',
    offer: { kind: 'pack', pack: 'combat-feel' },
    card: { glyph: 'sword', tint: '#7a2e1f' },
  },
  {
    slug: 'why-your-enemies-look-so-stupid',
    title: 'Why Your Enemies Look So Stupid',
    quest: '2d-top-down-enemy-ai',
    offer: { kind: 'pack', pack: 'top-down-starter' },
    card: { glyph: 'eye', tint: '#4a3a2a' },
  },
  {
    slug: 'how-do-random-levels-always-have-a-way-out',
    title: 'How Do Random Levels Always Have a Way Out?',
    quest: 'procedural-dungeon-and-run',
    offer: { kind: 'vote', candidate: 'procedural-dungeons' },
    card: { glyph: 'maze', tint: '#2b3a55' },
  },
  {
    slug: 'i-turned-a-boring-platformer-into-an-addicting-one',
    title: 'I Turned a Boring Platformer Into an Addicting One',
    quest: 'juice-it-shake-squash-particles',
    offer: { kind: 'campaign', campaign: '2d-platformer' },
    card: { glyph: 'spring', tint: '#6a4a1f' },
  },
  {
    slug: 'you-finished-a-godot-tutorial-now-what',
    title: 'You Finished a Godot Tutorial. Now What?',
    quest: 'code-from-zero',
    offer: { kind: 'campaign', campaign: '2d-platformer' },
    card: { glyph: 'door', tint: '#3a3a2a' },
  },
  {
    slug: 'how-i-design-a-game-before-writing-any-code',
    title: 'How I Design a Game Before Writing Any Code',
    quest: 'design-the-game',
    offer: { kind: 'campaign', campaign: '2d-platformer' },
    card: { glyph: 'pencil', tint: '#4a2f3a' },
  },
  {
    slug: 'why-collecting-coins-can-feel-so-satisfying',
    title: 'Why Collecting Coins Can Feel So Satisfying',
    quest: 'coins-combos-and-stomping',
    offer: { kind: 'campaign', campaign: '2d-platformer' },
    card: { glyph: 'coin', tint: '#5a4a1a' },
  },
  {
    slug: 'make-your-godot-menu-look-like-a-real-game',
    title: 'Make Your Godot Menu Look Like a Real Game',
    quest: 'menus-sound-and-polish',
    offer: { kind: 'plan', plan: 'guild' },
    card: { glyph: 'menu', tint: '#33402f' },
  },
  {
    slug: 'why-3d-games-look-bad-in-godot',
    title: 'Why 3D Games Look Bad in Godot',
    quest: '3d-roguelike-controller',
    offer: { kind: 'vote', candidate: '3d-look-and-lighting' },
    card: { glyph: 'cube', tint: '#2a3a4a' },
  },
]

export const videoBySlug = Object.fromEntries(videos.map((v) => [v.slug, v])) as Record<string, Video>
export const videoForQuest = (questSlug: string) => videos.find((v) => v.quest === questSlug)

export const videoCopy = {
  watched: 'You watched',
  headline: 'Now build it yourself.',
  playableLead: 'The first lesson starts right here. No signup, no detour.',
  listLead: 'This is the quest that continues the video. Start with the first lesson.',
  nextTitle: 'When you want the rest',
  // What the founder would paste under a video, shown on /concept.
  descriptionFirstLine: 'Build what you just watched, free:',
  pinnedComment: 'The lesson that goes with this video is here, and it runs in your browser:',
  spokenLine: 'The link at the top of the description goes straight to the lesson for this video. It is free.',
}
