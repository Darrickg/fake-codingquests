// The playable slice: lessons 1 and 2 of 2D Top-Down Character Movement.
// Every line of GDScript here must be valid Godot 4. Code uses tabs, as Godot does by default.
// Blanks are written {{id}} inside a template.

export const playableQuest = '2d-top-down-character-movement'

export interface Choice {
  id: string
  label: string
}

export interface Blank {
  id: string
  /** Read out to screen readers, e.g. "the two left and right actions". */
  label: string
  options: string[]
  answer: string
  /** Extra typed forms that count as the answer (desktop typing). */
  accept?: string[]
}

export interface PredictStep {
  kind: 'predict'
  title: string
  prompt: string
  code: string
  choices: Choice[]
  correct: string
  runLabel: string
  /** Shown after the preview has run. */
  explain: string
}

export interface WriteStep {
  kind: 'write' | 'prove'
  title: string
  prompt: string
  template: string
  blanks: Blank[]
  hint: string
  aside?: string
  checkGoal: string
  passLine: string
}

export type Step = PredictStep | WriteStep

export interface Lesson {
  number: number
  slug: string
  title: string
  summary: string
  xp: number
  proveXp?: number
  camp: 'tent' | 'fire'
  campLine: string
  steps: Step[]
}

const header = `extends CharacterBody2D

@export var speed := 120.0
`

export const lessons: Lesson[] = [
  {
    number: 1,
    slug: '1',
    title: 'Make the knight walk',
    summary: 'Read input, turn it into a direction, and move with move_and_slide().',
    xp: 40,
    camp: 'tent',
    campLine: 'The tent is up.',
    steps: [
      {
        kind: 'predict',
        title: 'Predict',
        prompt: 'Read this script. When the game runs, what will the knight do?',
        code: `${header}
func _physics_process(_delta: float) -> void:
	velocity = Vector2.RIGHT * speed
	move_and_slide()
`,
        choices: [
          { id: 'still', label: 'Stand still until you press a key' },
          { id: 'right', label: 'Walk right on its own and keep going' },
          { id: 'follow', label: 'Walk wherever you press' },
        ],
        correct: 'right',
        runLabel: 'Run it',
        explain:
          'Nothing in this script reads input. Vector2.RIGHT is (1, 0), so every physics frame the knight is told to go right at speed pixels per second, and move_and_slide() stops it at the wall.',
      },
      {
        kind: 'write',
        title: 'Write',
        prompt: 'Make the knight follow the arrow keys. Fill the three blanks.',
        template: `${header}
func _physics_process(_delta: float) -> void:
	var direction := Vector2(
		Input.get_axis({{x}}),
		Input.get_axis({{y}})
	)
	velocity = {{v}} * speed
	move_and_slide()
`,
        blanks: [
          {
            id: 'x',
            label: 'the left and right actions',
            options: ['"move_left", "move_right"', '"move_right", "move_left"'],
            answer: '"move_left", "move_right"',
          },
          {
            id: 'y',
            label: 'the up and down actions',
            options: ['"move_up", "move_down"', '"move_down", "move_up"'],
            answer: '"move_up", "move_down"',
          },
          {
            id: 'v',
            label: 'what the velocity is built from',
            options: ['direction', 'Vector2.RIGHT', 'Vector2.ZERO'],
            answer: 'direction',
          },
        ],
        hint: 'get_axis(negative, positive) gives -1, 0 or 1. In Godot 2D, y grows downward, so up is the negative side.',
        aside: 'move_left, move_right, move_up and move_down are actions you add once in Project Settings, under Input Map.',
        checkGoal: 'Move the knight left, right, up and down.',
        passLine: 'The knight goes where you point it.',
      },
    ],
  },
  {
    number: 2,
    slug: '2',
    title: 'Why diagonals feel wrong',
    summary: 'Find the diagonal speed bug and fix it with normalized().',
    xp: 50,
    proveXp: 25,
    camp: 'fire',
    campLine: 'The fire is lit.',
    steps: [
      {
        kind: 'predict',
        title: 'Predict',
        prompt: 'This is your code from lesson 1. Hold right and down together. Compared with walking straight, the knight moves:',
        code: `${header}
func _physics_process(_delta: float) -> void:
	var direction := Vector2(
		Input.get_axis("move_left", "move_right"),
		Input.get_axis("move_up", "move_down")
	)
	velocity = direction * speed
	move_and_slide()
`,
        choices: [
          { id: 'same', label: 'At the same speed' },
          { id: 'faster', label: 'Faster' },
          { id: 'slower', label: 'Slower' },
        ],
        correct: 'faster',
        runLabel: 'Run it and watch the speed',
        explain:
          'Right and down together make Vector2(1, 1). That vector is about 1.41 long, not 1, so the knight covers about 170 pixels a second on a diagonal and 120 in a straight line. Players feel it even when they cannot name it.',
      },
      {
        kind: 'write',
        title: 'Write',
        prompt: 'Make every direction the same speed. Fill the blank.',
        template: `${header}
func _physics_process(_delta: float) -> void:
	var direction := Vector2(
		Input.get_axis("move_left", "move_right"),
		Input.get_axis("move_up", "move_down")
	)
	direction = direction.{{n}}()
	velocity = direction * speed
	move_and_slide()
`,
        blanks: [
          {
            id: 'n',
            label: 'the method that fixes the length',
            options: ['normalized', 'abs', 'round'],
            answer: 'normalized',
          },
        ],
        hint: 'A normalized vector points the same way but always has a length of 1.',
        aside:
          'Godot can do both steps in one call. Input.get_vector("move_left", "move_right", "move_up", "move_down") returns a direction that is never longer than 1.',
        checkGoal: 'Walk in a straight line, then on a diagonal. The readout must say 120 both times.',
        passLine: 'Same speed in every direction.',
      },
      {
        kind: 'prove',
        title: 'Prove It',
        prompt: 'Make the knight half again as fast without touching the movement code.',
        template: `extends CharacterBody2D

@export var speed := {{s}}

func _physics_process(_delta: float) -> void:
	var direction := Vector2(
		Input.get_axis("move_left", "move_right"),
		Input.get_axis("move_up", "move_down")
	)
	direction = direction.normalized()
	velocity = direction * speed
	move_and_slide()
`,
        blanks: [
          {
            id: 's',
            label: 'the speed value',
            options: ['60.0', '180.0', '240.0'],
            answer: '180.0',
            accept: ['180', '180.00'],
          },
        ],
        hint: 'Half again as fast as 120 means 120 plus half of 120.',
        aside: 'Because speed is exported, you could also change it in the Inspector without opening the script at all.',
        checkGoal: 'Move the knight. The readout should say 180, straight or diagonal.',
        passLine: 'Faster, and still even on the diagonals.',
      },
    ],
  },
]

export const lessonBySlug = Object.fromEntries(lessons.map((l) => [l.slug, l])) as Record<string, Lesson>

export const lessonCopy = {
  nudgeTitle: 'One more and the fire is lit.',
  nudgeBody: 'Lesson 2 finds a bug hiding in the code you just wrote. It takes a few minutes.',
  nudgeCta: 'Start lesson 2',
  doneTitle: 'Camp is set.',
  nextTitle: 'Where to next',
  nextLesson: { title: 'Lesson 3', body: 'The next lesson in this quest. Free.' },
  ownTopic: { title: 'Own this topic', body: 'The Top-Down Starter Pack: this quest, the tile world and enemy AI, with project files.' },
  seeMemberships: { title: 'See memberships', body: 'Every Beginner quest from a level plan, or everything with Guild Hall.' },
  keyboardHelp: 'Arrow keys or WASD move the knight when the preview has focus.',
  padHelp: 'Hold an arrow. Corners move diagonally.',
}

/** Lesson titles we know. Other lessons are listed by number only. */
export const knownLessonTitles: Record<string, Record<number, string>> = {
  [playableQuest]: { 1: lessons[0].title, 2: lessons[1].title },
}
