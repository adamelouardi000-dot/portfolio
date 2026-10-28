import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Terminal } from 'lucide-react'
import type { Locale } from '../data/types'
import { useVisualEffects } from '../hooks/useVisualEffects'
import '../styles/terminal-intro.css'

const sessionKey = 'portfolio-terminal-intro-seen'
let seenWithoutStorage = false

function canStart() {
  try { return sessionStorage.getItem(sessionKey) !== 'true' && !document.hidden }
  catch { return !seenWithoutStorage && !document.hidden }
}

/** A brief, optional opening. It never traps focus or blocks the portfolio. */
export function TerminalIntro({ locale }: { locale: Locale }) {
  const { enabled } = useVisualEffects()
  const [open, setOpen] = useState(() => enabled && canStart())
  const [stage, setStage] = useState(0)
  const panelRef = useRef<HTMLElement>(null)
  const fr = locale === 'fr'
  const lines = fr
    ? ['Initialisation de l’interface…', 'Chargement des projets et du profil…', 'Connexion établie. Bienvenue.']
    : ['Initializing interface…', 'Loading projects and profile…', 'Connection established. Welcome.']

  const close = useCallback(() => {
    const hadFocus = panelRef.current?.contains(document.activeElement)
    setOpen(false)
    if (hadFocus) {
      const destination = document.querySelector<HTMLElement>('.skip-link') ?? document.getElementById('main')
      destination?.focus({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    // Mark the attempt immediately, including when reduced motion skips it.
    try { sessionStorage.setItem(sessionKey, 'true') }
    catch { seenWithoutStorage = true }
    if (!open) return
    if (!enabled) {
      const timer = window.setTimeout(close, 0)
      return () => window.clearTimeout(timer)
    }
    const timers = [
      window.setTimeout(() => setStage(1), 420),
      window.setTimeout(() => setStage(2), 980),
      window.setTimeout(() => setStage(3), 1600),
      window.setTimeout(close, 2400),
    ]
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close() }
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !panelRef.current?.contains(event.target)) close()
    }
    const onVisibility = () => { if (document.hidden) close() }
    document.addEventListener('keydown', onKey)
    document.addEventListener('focusin', onFocus)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      timers.forEach(timer => window.clearTimeout(timer))
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('focusin', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [enabled, open, close])

  if (!open || !enabled) return null

  return <aside className="terminal-intro" ref={panelRef} aria-label={fr ? 'Introduction du portfolio' : 'Portfolio introduction'}>
    <motion.div className="terminal-intro-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>
      <div className="terminal-intro-bar mono"><span><Terminal size={13} aria-hidden="true" /> PORTFOLIO / INIT</span><span className="terminal-intro-led" aria-hidden="true" /></div>
      <div className="terminal-intro-output mono" aria-hidden="true">
        <p className="terminal-intro-command"><span>›</span> ./initialize</p>
        {lines.map((line, index) => <p key={index} className={stage > index ? 'boot-line boot-line-visible' : 'boot-line'}><span>{stage === 3 ? '✓' : '›'}</span>{line}</p>)}
      </div>
      <div className="terminal-intro-footer">
        <span className="mono">{fr ? 'OUVERTURE DE LA SESSION' : 'OPENING SESSION'}</span>
        <button type="button" onClick={close}>{fr ? 'Passer' : 'Skip'}<ArrowRight size={13} aria-hidden="true" /></button>
      </div>
      <motion.div className="terminal-intro-progress" aria-hidden="true" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2.4, ease: 'linear' }} />
    </motion.div>
  </aside>
}
