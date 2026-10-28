import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { VisualEffectsContext } from '../hooks/useVisualEffects'

const storageKey = 'portfolio-visual-effects'
const query = '(prefers-reduced-motion: reduce)'

function subscribe(callback: () => void) {
  const media = window.matchMedia?.(query)
  media?.addEventListener('change', callback)
  return () => media?.removeEventListener('change', callback)
}

function getReducedMotion() {
  return window.matchMedia?.(query).matches ?? false
}

export function VisualEffectsProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(() => {
    try { return localStorage.getItem(storageKey) === 'paused' }
    catch { return false }
  })
  const reduced = useSyncExternalStore(subscribe, getReducedMotion, () => true)
  const enabled = !paused && !reduced

  useEffect(() => {
    const root = document.documentElement
    const update = () => { root.dataset.pageVisible = String(!document.hidden) }
    update()
    document.addEventListener('visibilitychange', update)
    return () => {
      document.removeEventListener('visibilitychange', update)
      delete root.dataset.pageVisible
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const previous = root.dataset.visualMotion
    root.dataset.visualMotion = reduced ? 'reduced' : paused ? 'paused' : 'active'
    try { localStorage.setItem(storageKey, paused ? 'paused' : 'active') }
    catch { /* Effects also work when browser storage is unavailable. */ }
    return () => {
      if (previous === undefined) delete root.dataset.visualMotion
      else root.dataset.visualMotion = previous
    }
  }, [paused, reduced])

  return <VisualEffectsContext value={{ enabled, paused, reduced, toggle: () => setPaused(value => !value) }}>
    <MotionConfig reducedMotion={enabled ? 'user' : 'always'}>{children}</MotionConfig>
  </VisualEffectsContext>
}
