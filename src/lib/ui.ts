// Transient UI state that is never persisted.
import { create } from 'zustand'
import type { PinId } from '../content/pins'
import type { Period, PlanId } from '../content/plans'

export type CheckoutItem =
  | { kind: 'pack'; pack: string }
  | { kind: 'bundle' }
  | { kind: 'plan'; plan: Exclude<PlanId, 'free'>; period: Period }

interface UIState {
  pin: { id: PinId; rect: DOMRect | null; trigger: HTMLElement | null } | null
  openPin: (id: PinId, trigger: HTMLElement | null) => void
  closePin: () => void
  checkout: CheckoutItem | null
  openCheckout: (item: CheckoutItem) => void
  closeCheckout: () => void
}

export const useUI = create<UIState>()((set) => ({
  pin: null,
  openPin: (id, trigger) => set({ pin: { id, rect: trigger?.getBoundingClientRect() ?? null, trigger } }),
  closePin: () => set({ pin: null }),
  checkout: null,
  openCheckout: (checkout) => set({ checkout, pin: null }),
  closeCheckout: () => set({ checkout: null }),
}))
