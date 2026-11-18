// The catalogue as it exists on CodingQuests today. Names and lesson counts follow the real site.
// Do not invent quests here. Level tags follow the rule in the brief.

export type Level = 'Beginner' | 'Intermediate' | 'Advanced'
export const levels: Level[] = ['Beginner', 'Intermediate', 'Advanced']

/** free = every lesson free; partial = early lessons free; members = members only */
export type Access = 'free' | 'partial' | 'members'

export type ShelfId =
  | 'start'
  | 'movement'
  | 'combat'
  | 'enemies'
  | 'worlds'
  | 'items'
  | 'story'
  | 'multiplayer'
  | 'design'
  | 'keep-building'
  | 'finish'

export type CampaignSlug = '2d-platformer' | '2d-top-down-rpg' | '2d-roguelike' | '3d-roguelike' | 'co-op-multiplayer'

export interface Quest {
  slug: string
  title: string
  /** null when the count is not listed in the brief (follow-on quests) */
  lessons: number | null
  shelf: ShelfId
  level: Level
  access: Access
  /** The campaign this quest is closest to, used for follow-on and design quests. */
  campaign?: CampaignSlug
}

export interface Shelf {
  id: ShelfId
  name: string
  /** Shown after the listed quests, for shelves that are longer than what we list. */
  andMore?: string
}

/** How many early lessons are free on a quest that is partly free. */
export const freePreviewLessons = (q: Quest) => (q.lessons !== null && q.lessons <= 3 ? 1 : 2)

export const shelves: Shelf[] = [
  { id: 'start', name: 'Start here' },
  { id: 'movement', name: 'Movement and controls' },
  { id: 'combat', name: 'Combat and game feel' },
  { id: 'enemies', name: 'Enemies and AI' },
  { id: 'worlds', name: 'Worlds and levels' },
  { id: 'items', name: 'Items and progression' },
  { id: 'story', name: 'Story, HUD and menus' },
  { id: 'multiplayer', name: 'Multiplayer' },
  { id: 'design', name: 'Game design' },
  {
    id: 'keep-building',
    name: 'Keep building',
    andMore: '14 more follow-on quests, four or five for each campaign.',
  },
  { id: 'finish', name: 'Finish and ship' },
]

const q = (
  slug: string,
  title: string,
  lessons: number | null,
  shelf: ShelfId,
  level: Level,
  access: Access = 'partial',
  campaign?: CampaignSlug,
): Quest => ({ slug, title, lessons, shelf, level, access, campaign })

export const quests: Quest[] = [
  // Start here
  q('code-from-zero', 'Code From Zero', 11, 'start', 'Beginner', 'free'),
  q('godot-for-programmers', 'Godot for Programmers', 6, 'start', 'Beginner', 'free'),

  // Movement and controls
  q('move-and-jump', 'Move & Jump', 3, 'movement', 'Beginner', 'free'),
  q('a-jump-that-feels-amazing', 'A Jump That Feels Amazing', 3, 'movement', 'Beginner', 'free'),
  q('dash-double-jump-wall-jump', 'Dash, Double Jump & Wall Jump', 4, 'movement', 'Beginner'),
  q('2d-top-down-character-movement', '2D Top-Down Character Movement', 9, 'movement', 'Beginner', 'free'),
  q('2d-roguelike-top-down-controller', '2D Roguelike: Top-Down Controller', 8, 'movement', 'Intermediate', 'free'),
  q('3d-roguelike-controller', '3D Roguelike Controller', 11, 'movement', 'Advanced'),

  // Combat and game feel
  q('2d-top-down-combat-and-damage', '2D Top-Down Combat & Damage', 10, 'combat', 'Beginner'),
  q('2d-roguelike-combat-core', '2D Roguelike: Combat Core', 8, 'combat', 'Intermediate'),
  q('combat-core-and-juice', 'Combat Core & Juice', 16, 'combat', 'Advanced'),
  q('game-feel-make-combat-hit', 'Game Feel: Make Combat Hit', 9, 'combat', 'Beginner'),
  q('juice-it-shake-squash-particles', 'Juice It: Shake, Squash & Particles', 4, 'combat', 'Beginner'),

  // Enemies and AI
  q('2d-top-down-enemy-ai', '2D Top-Down Enemy AI', 10, 'enemies', 'Beginner'),
  q('2d-roguelike-enemies-and-ai', '2D Roguelike: Enemies & AI', 8, 'enemies', 'Intermediate'),
  q('state-machine-ai-for-3d-enemies', 'State Machine AI for 3D Enemies', 14, 'enemies', 'Advanced'),

  // Worlds and levels
  q('tile-based-world-and-map-building', 'Tile-Based World & Map Building', 10, 'worlds', 'Beginner'),
  q('coins-combos-and-stomping', 'Coins, Combos & Stomping', 4, 'worlds', 'Beginner'),
  q('traps-and-hazards', 'Traps & Hazards', 4, 'worlds', 'Beginner'),
  q('2d-roguelike-rooms-and-dungeon', '2D Roguelike: Rooms & Dungeon', 8, 'worlds', 'Intermediate'),
  q('procedural-dungeon-and-run', 'Procedural Dungeon & Run', 12, 'worlds', 'Advanced'),

  // Items and progression
  q('inventory-system', 'Inventory System', 10, 'items', 'Beginner', 'free'),
  q('advanced-inventory-ui', 'Advanced Inventory UI', 11, 'items', 'Advanced', 'members'),
  q('stats-and-leveling-system', 'Stats & Leveling System', 8, 'items', 'Beginner'),
  q('2d-roguelike-loot-and-corruption', '2D Roguelike: Loot & Corruption', 8, 'items', 'Intermediate'),
  q('save-and-load-system', 'Save + Load System', 11, 'items', 'Beginner'),

  // Story, HUD and menus
  q('dialogue-and-quest-system', 'Dialogue & Quest System', 11, 'story', 'Beginner'),
  q('2d-roguelike-hud-and-meta', '2D Roguelike: HUD & Meta', 8, 'story', 'Intermediate'),
  q('hud-and-world', 'HUD & World', 11, 'story', 'Advanced'),
  q('menus-sound-and-polish', 'Menus, Sound & Polish', 8, 'story', 'Advanced'),

  // Multiplayer
  q('co-op-crate-combustion', 'Co-op Crate Combustion', 13, 'multiplayer', 'Advanced', 'free'),
  q('two-windows-talking', 'Two Windows Talking', 9, 'multiplayer', 'Advanced', 'free'),
  q('rpcs-who-is-allowed-to-say-what', 'RPCs: Who Is Allowed To Say What', 8, 'multiplayer', 'Advanced', 'free'),
  q('spawning-and-syncing-players', 'Spawning and Syncing Players', 8, 'multiplayer', 'Advanced'),
  q('never-trust-the-client', 'Never Trust the Client', 9, 'multiplayer', 'Advanced'),
  q('prediction-and-reconciliation', 'Prediction and Reconciliation', 9, 'multiplayer', 'Advanced'),
  q('real-systems-over-a-network', 'Real Systems Over a Network', 9, 'multiplayer', 'Advanced'),
  q('lobbies-connectivity-and-shipping', 'Lobbies, Connectivity, and Shipping', 9, 'multiplayer', 'Advanced'),
  q('signal-lost-the-capstone', 'Signal Lost: The Capstone', 8, 'multiplayer', 'Advanced'),

  // Game design: one per campaign
  q('design-the-game', 'Design the Game', 3, 'design', 'Beginner', 'partial', '2d-platformer'),
  q('design-a-side-quest', 'Design a Side Quest', 3, 'design', 'Beginner', 'partial', '2d-top-down-rpg'),
  q('design-the-run', 'Design the Run', 3, 'design', 'Intermediate', 'partial', '2d-roguelike'),
  q('design-a-fight', 'Design a Fight', 3, 'design', 'Advanced', 'partial', '3d-roguelike'),
  q('design-for-two', 'Design for Two', 3, 'design', 'Advanced', 'partial', 'co-op-multiplayer'),

  // Keep building: the named follow-on quests. Lesson counts are not listed.
  q('the-final-boss', 'The Final Boss', null, 'keep-building', 'Beginner', 'partial', '2d-platformer'),
  q('race-the-clock', 'Race the Clock', null, 'keep-building', 'Beginner', 'partial', '2d-platformer'),
  q('the-village-merchant', 'The Village Merchant', null, 'keep-building', 'Beginner', 'partial', '2d-top-down-rpg'),
  q('the-crypt-below', 'The Crypt Below', null, 'keep-building', 'Beginner', 'partial', '2d-top-down-rpg'),
  q('endless-descent', 'Endless Descent', null, 'keep-building', 'Intermediate', 'partial', '2d-roguelike'),
  q('builds-that-combine', 'Builds That Combine', null, 'keep-building', 'Intermediate', 'partial', '2d-roguelike'),
  q('a-boss-worth-the-key', 'A Boss Worth the Key', null, 'keep-building', 'Advanced', 'partial', '3d-roguelike'),
  q('roles-that-need-each-other', 'Roles That Need Each Other', null, 'keep-building', 'Advanced', 'partial', 'co-op-multiplayer'),

  // Finish and ship
  q('capstone-build-the-whole-game', 'Capstone: Build the Whole Game', 8, 'finish', 'Beginner'),
  q('2d-roguelike-capstone', '2D Roguelike: Capstone', 8, 'finish', 'Intermediate'),
  q('ship-your-game-itch-and-steam', 'Ship Your Game: itch.io & Steam', 10, 'finish', 'Beginner'),
  q('make-it-yours-the-courier-room', 'Make It Yours: The Courier Room', 6, 'finish', 'Beginner'),
]

export const questBySlug = Object.fromEntries(quests.map((x) => [x.slug, x])) as Record<string, Quest>

export interface Waypoint {
  label: string
  /** The quest this waypoint opens, when there is a clear match. */
  quest?: string
}

export interface Campaign {
  slug: CampaignSlug
  name: string
  levelLabel: string
  /** Used for tags and membership mapping. */
  level: Level
  questCount: number
  lessonCount: number
  blurb: string
  waypoints: Waypoint[]
}

export const campaigns: Campaign[] = [
  {
    slug: '2d-platformer',
    name: '2D Platformer',
    levelLabel: 'Beginner',
    level: 'Beginner',
    questCount: 9,
    lessonCount: 46,
    blurb: 'Run, jump and stomp through a level you built, then put it online.',
    waypoints: [
      { label: 'Move & Jump', quest: 'move-and-jump' },
      { label: 'Game Feel', quest: 'a-jump-that-feels-amazing' },
      { label: 'Moveset', quest: 'dash-double-jump-wall-jump' },
      { label: 'Juice', quest: 'juice-it-shake-squash-particles' },
      { label: 'Game Loop', quest: 'coins-combos-and-stomping' },
      { label: 'Traps', quest: 'traps-and-hazards' },
      { label: 'Full Game', quest: 'capstone-build-the-whole-game' },
      { label: 'Ship It', quest: 'ship-your-game-itch-and-steam' },
      { label: 'Your Room', quest: 'make-it-yours-the-courier-room' },
    ],
  },
  {
    slug: '2d-top-down-rpg',
    name: '2D Top-Down RPG',
    levelLabel: 'Beginner to intermediate',
    level: 'Beginner',
    questCount: 9,
    lessonCount: 107,
    blurb: 'A small world with a hero, enemies, loot, talk and a save file.',
    waypoints: [
      { label: 'GDScript Basics', quest: 'code-from-zero' },
      { label: 'Movement', quest: '2d-top-down-character-movement' },
      { label: 'Tile Maps', quest: 'tile-based-world-and-map-building' },
      { label: 'Combat', quest: '2d-top-down-combat-and-damage' },
      { label: 'Enemy AI', quest: '2d-top-down-enemy-ai' },
      { label: 'Game Feel', quest: 'game-feel-make-combat-hit' },
      { label: 'Inventory', quest: 'inventory-system' },
      { label: 'Stats', quest: 'stats-and-leveling-system' },
      { label: 'Dialogue', quest: 'dialogue-and-quest-system' },
      { label: 'Save/Load', quest: 'save-and-load-system' },
      { label: 'Full Game', quest: 'capstone-build-the-whole-game' },
    ],
  },
  {
    slug: '2d-roguelike',
    name: '2D Roguelike',
    levelLabel: 'Beginner to intermediate',
    level: 'Intermediate',
    questCount: 7,
    lessonCount: 56,
    blurb: 'Rooms, runs and loot that changes how you play each time.',
    waypoints: [
      { label: 'Controller', quest: '2d-roguelike-top-down-controller' },
      { label: 'Combat', quest: '2d-roguelike-combat-core' },
      { label: 'Enemies & AI', quest: '2d-roguelike-enemies-and-ai' },
      { label: 'Rooms', quest: '2d-roguelike-rooms-and-dungeon' },
      { label: 'Loot', quest: '2d-roguelike-loot-and-corruption' },
      { label: 'HUD & Meta', quest: '2d-roguelike-hud-and-meta' },
      { label: 'Full Game', quest: '2d-roguelike-capstone' },
    ],
  },
  {
    slug: '3d-roguelike',
    name: '3D Roguelike',
    levelLabel: 'Advanced',
    level: 'Advanced',
    questCount: 11,
    lessonCount: 120,
    blurb: 'A third-person dungeon run with real combat, menus and polish.',
    waypoints: [
      { label: 'Controller', quest: '3d-roguelike-controller' },
      { label: 'Inventory', quest: 'inventory-system' },
      { label: 'Stats', quest: 'stats-and-leveling-system' },
      { label: 'Combat', quest: 'combat-core-and-juice' },
      { label: 'Enemy AI', quest: 'state-machine-ai-for-3d-enemies' },
      { label: 'Dialogue', quest: 'dialogue-and-quest-system' },
      { label: 'Save/Load', quest: 'save-and-load-system' },
      { label: 'Dungeon & Run', quest: 'procedural-dungeon-and-run' },
      { label: 'HUD & World', quest: 'hud-and-world' },
      { label: 'Menus & Polish', quest: 'menus-sound-and-polish' },
      { label: 'Full Game', quest: 'capstone-build-the-whole-game' },
    ],
  },
  {
    slug: 'co-op-multiplayer',
    name: 'Co-op Multiplayer',
    levelLabel: 'Intermediate to advanced',
    level: 'Advanced',
    questCount: 8,
    lessonCount: 69,
    blurb: 'Two players, one game, and a server that does not trust either of them.',
    waypoints: [
      { label: 'Two Windows', quest: 'two-windows-talking' },
      { label: 'RPCs', quest: 'rpcs-who-is-allowed-to-say-what' },
      { label: 'Spawn & Sync', quest: 'spawning-and-syncing-players' },
      { label: 'Server Rules', quest: 'never-trust-the-client' },
      { label: 'Prediction', quest: 'prediction-and-reconciliation' },
      { label: 'Game Systems', quest: 'real-systems-over-a-network' },
      { label: 'Lobbies', quest: 'lobbies-connectivity-and-shipping' },
      { label: 'Full Game', quest: 'signal-lost-the-capstone' },
    ],
  },
]

export const campaignBySlug = Object.fromEntries(campaigns.map((c) => [c.slug, c])) as Record<CampaignSlug, Campaign>

/** Campaigns whose map includes this quest. */
export const campaignsForQuest = (slug: string) =>
  campaigns.filter((c) => c.waypoints.some((w) => w.quest === slug) || questBySlug[slug]?.campaign === c.slug)

/** Includes the follow-on quests that are not listed one by one. */
export const totalQuestCount = 70

export const libraryCopy = {
  title: 'Every quest, shelved by topic.',
  sub: '70 quests on 11 shelves. Each one builds a single game system you can reuse.',
  searchPlaceholder: 'Search quests',
}

export const campaignCopy = {
  boardTitle: 'Pick a game. Follow the road.',
  boardSub: 'Each campaign is a chain of quests that ends in a finished game. Easiest first. The first quest of every campaign is free.',
}
