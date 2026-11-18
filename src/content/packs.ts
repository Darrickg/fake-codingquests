// Quest Packs (recommendation A). One-time purchases built from quests that already exist.
// Prices and the credit window are placeholders.

export interface Pack {
  slug: string
  name: string
  /** One line on what you end up with. */
  promise: string
  quests: string[]
  price: number
  /** Video slug from videos.ts that leads to this pack, if any. */
  pairsWithVideo?: string
  /** Colour of the cloth binding on the pack art. */
  cloth: string
  /** Small motif drawn on the pack art. */
  motif: 'sword' | 'compass' | 'satchel' | 'lantern' | 'die' | 'spark' | 'link'
}

export const packs: Pack[] = [
  {
    slug: 'combat-feel',
    name: 'Combat Feel Pack',
    promise: 'Damage that registers, hits that feel heavy, and shake, squash and particles on top.',
    quests: ['2d-top-down-combat-and-damage', 'game-feel-make-combat-hit', 'juice-it-shake-squash-particles'],
    price: 19,
    pairsWithVideo: 'why-your-combat-feels-weak',
    cloth: '#7a2e1f',
    motif: 'sword',
  },
  {
    slug: 'top-down-starter',
    name: 'Top-Down Starter Pack',
    promise: 'A character that moves well, a world to walk in, and enemies that chase you.',
    quests: ['2d-top-down-character-movement', 'tile-based-world-and-map-building', '2d-top-down-enemy-ai'],
    price: 19,
    pairsWithVideo: 'why-most-top-down-movement-feels-bad',
    cloth: '#2f4a3a',
    motif: 'compass',
  },
  {
    slug: 'inventory-and-save',
    name: 'Inventory & Save Pack',
    promise: 'Items, a proper inventory screen, stats that grow, and a save file that works.',
    quests: ['inventory-system', 'advanced-inventory-ui', 'stats-and-leveling-system', 'save-and-load-system'],
    price: 19,
    cloth: '#2b3a55',
    motif: 'satchel',
  },
]

export const packBySlug = Object.fromEntries(packs.map((p) => [p.slug, p])) as Record<string, Pack>

export const bundle = {
  slug: 'all-three',
  name: 'All three packs',
  price: 45,
  line: 'Every launch pack, one payment.',
}

const creditDays = 60

export const packCredit = {
  days: creditDays,
  title: 'Pack credit',
  rule: `Join any membership within ${creditDays} days and what you paid for packs comes off your first payment.`,
  short: `Counts toward a membership for ${creditDays} days.`,
}

export const packCopy = {
  keepLine: 'One payment. Yours to keep.',
  includesFiles: 'Includes the Godot project files.',
  ownedLabel: 'Yours',
  bundleOwnedSome: (n: number) => `You already own ${n}. You only pay the difference.`,
}

// "Which pack should come next?" board (recommendation C).
export interface PackCandidate {
  id: string
  name: string
  line: string
  motif: Pack['motif']
}

export const nextPackCandidates: PackCandidate[] = [
  { id: '3d-look-and-lighting', name: '3D Look & Lighting', line: 'Light, shadows and materials that make a Godot 3D scene look finished.', motif: 'lantern' },
  { id: 'procedural-dungeons', name: 'Procedural Dungeons', line: 'Random levels that always have a way out.', motif: 'die' },
  { id: 'platformer-juice', name: 'Platformer Juice', line: 'Squash, stretch, dust and sound for every jump and landing.', motif: 'spark' },
  { id: 'multiplayer-basics', name: 'Multiplayer Basics', line: 'Two windows, one game, and the first rules of networking.', motif: 'link' },
]

export const candidateById = Object.fromEntries(nextPackCandidates.map((c) => [c.id, c])) as Record<string, PackCandidate>

export const voteCopy = {
  title: 'Which pack should come next?',
  sub: 'Tap the ones you would want. Vote for as many as you like.',
  vote: 'I want this',
  voted: 'Voted',
}
