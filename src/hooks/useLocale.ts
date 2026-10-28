import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import type { Locale } from '../data/types'
import { useVisualEffects } from './useVisualEffects'

export function useLocale() {
  const { enabled } = useVisualEffects()
  const transition = useRef<ViewTransition | null>(null)
  const [locale, setLocale] = useState<Locale>(() => {
    try { return localStorage.getItem('portfolio-locale') === 'en' ? 'en' : 'fr' }
    catch { return 'fr' }
  })
  const requested = useRef(locale)
  const requestId = useRef(0)
  useEffect(() => {
    if (!enabled) transition.current?.skipTransition()
  }, [enabled])
  useEffect(() => () => {
    requestId.current += 1
    transition.current?.skipTransition()
  }, [])
  useEffect(() => {
    document.documentElement.lang = locale
    try { localStorage.setItem('portfolio-locale', locale) } catch { /* Storage is optional. */ }
  }, [locale])
  function changeLocale(next: Locale) {
    if (next === requested.current) return
    requested.current = next
    const currentRequest = ++requestId.current
    transition.current?.skipTransition()
    if (!enabled || document.hidden || !document.startViewTransition) {
      setLocale(next)
      return
    }
    // Snapshot the same mounted components: forms, filters and history survive.
    const update = document.startViewTransition(() => {
      if (requestId.current === currentRequest) flushSync(() => setLocale(next))
    })
    transition.current = update
    void update.finished.catch(() => { /* An interrupted transition still applies the locale. */ })
  }
  return { locale, setLocale: changeLocale }
}
