import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { safeStorage } from './storage'
import type { PlanId, Period } from '../content/plans'

export interface Purchase {
  kind: 'pack' | 'bundle'
  packs: string[]
  paid: number
  at: number
}

export interface DemoState {
  viewAs: PlanId
  period: Period
  joinedAt: number | null
  purchases: Purchase[]
  /** lesson key "quest/lesson" -> completed */
  lessonsDone: Record<string, boolean>
  proveDone: Record<string, boolean>
  xp: number
  votes: Record<string, boolean>
  pollAnswer: string | null
  leaveAnswer: string | null
  pinsOn: boolean
  hintDismissed: boolean
}

interface Actions {
  setViewAs: (p: PlanId) => void
  setPeriod: (p: Period) => void
  buyPacks: (packs: string[], paid: number, kind: Purchase['kind']) => void
  joinPlan: (p: PlanId, period: Period) => void
  cancelPlan: () => void
  completeLesson: (key: string, xp: number) => void
  completeProve: (key: string, xp: number) => void
  toggleVote: (id: string) => void
  setPoll: (id: string) => void
  setLeaveAnswer: (id: string) => void
  setPinsOn: (on: boolean) => void
  dismissHint: () => void
  reset: () => void
}

const initial: DemoState = {
  viewAs: 'free',
  period: 'month',
  joinedAt: null,
  purchases: [],
  lessonsDone: {},
  proveDone: {},
  xp: 0,
  votes: {},
  pollAnswer: null,
  leaveAnswer: null,
  pinsOn: true,
  hintDismissed: false,
}

export const useDemo = create<DemoState & Actions>()(
  persist(
    (set) => ({
      ...initial,
      setViewAs: (viewAs) => set({ viewAs, joinedAt: viewAs === 'free' ? null : Date.now() }),
      setPeriod: (period) => set({ period }),
      buyPacks: (packs, paid, kind) =>
        set((s) => ({ purchases: [...s.purchases, { kind, packs, paid, at: Date.now() }] })),
      joinPlan: (viewAs, period) => set({ viewAs, period, joinedAt: Date.now() }),
      cancelPlan: () => set({ viewAs: 'free', joinedAt: null }),
      completeLesson: (key, xp) =>
        set((s) => (s.lessonsDone[key] ? s : { lessonsDone: { ...s.lessonsDone, [key]: true }, xp: s.xp + xp })),
      completeProve: (key, xp) =>
        set((s) => (s.proveDone[key] ? s : { proveDone: { ...s.proveDone, [key]: true }, xp: s.xp + xp })),
      toggleVote: (id) => set((s) => ({ votes: { ...s.votes, [id]: !s.votes[id] } })),
      setPoll: (pollAnswer) => set({ pollAnswer }),
      setLeaveAnswer: (leaveAnswer) => set({ leaveAnswer }),
      setPinsOn: (pinsOn) => set({ pinsOn }),
      dismissHint: () => set({ hintDismissed: true }),
      reset: () => set({ ...initial, hintDismissed: true }),
    }),
    {
      name: 'cq-concept-demo-v1',
      storage: createJSONStorage(() => safeStorage),
      version: 1,
    },
  ),
)

export const ownedPackSlugs = (s: Pick<DemoState, 'purchases'>): Set<string> => new Set(s.purchases.flatMap((p) => p.packs))
