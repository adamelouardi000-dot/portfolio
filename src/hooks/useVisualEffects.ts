import { createContext, useContext } from 'react'

export const VisualEffectsContext = createContext({
  enabled: true,
  paused: false,
  reduced: false,
  toggle: () => {},
})

export function useVisualEffects() {
  return useContext(VisualEffectsContext)
}
