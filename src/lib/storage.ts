// localStorage when it works, memory when it does not (private windows, in-app QR browsers).
import type { StateStorage } from 'zustand/middleware'

const memory = new Map<string, string>()

function canUseLocal(): boolean {
  try {
    const k = '__cq_probe__'
    window.localStorage.setItem(k, '1')
    window.localStorage.removeItem(k)
    return true
  } catch {
    return false
  }
}

const local = typeof window !== 'undefined' && canUseLocal()

export const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      if (local) return window.localStorage.getItem(name)
    } catch {
      /* fall through */
    }
    return memory.get(name) ?? null
  },
  setItem: (name, value) => {
    memory.set(name, value)
    try {
      if (local) window.localStorage.setItem(name, value)
    } catch {
      /* memory copy is enough */
    }
  },
  removeItem: (name) => {
    memory.delete(name)
    try {
      if (local) window.localStorage.removeItem(name)
    } catch {
      /* ignore */
    }
  },
}
