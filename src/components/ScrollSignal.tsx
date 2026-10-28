import { useRef, useSyncExternalStore, type RefObject } from 'react'
import { motion, useInView, useScroll, useTransform, type MotionStyle } from 'motion/react'
import { useVisualEffects } from '../hooks/useVisualEffects'
import '../styles/scroll-signals.css'

function subscribeVisibility(callback: () => void) {
  document.addEventListener('visibilitychange', callback)
  return () => document.removeEventListener('visibilitychange', callback)
}

const pageVisible = () => !document.hidden
const serverVisible = () => false

/** Decorative interface signals, never actual security warnings or live alerts. */
export function ScrollSignal({ tone = 'cyan', side = 'right' }: {
  tone?: 'cyan' | 'amber'
  side?: 'left' | 'right'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const canObserve = typeof IntersectionObserver !== 'undefined'
  const { enabled } = useVisualEffects()
  const visible = useSyncExternalStore(subscribeVisibility, pageVisible, serverVisible)
  const inView = useInView(ref, { margin: '100px 0px' })
  const active = canObserve && enabled && visible && inView

  return <div className={`scroll-signal-layer signal-${tone} signal-${side}`} aria-hidden="true" data-signal-active={active}>
    <div ref={canObserve ? ref : undefined} className="scroll-signal-anchor">
      {active && <TrackedSignal target={ref} />}
    </div>
  </div>
}

function TrackedSignal({ target }: { target: RefObject<HTMLDivElement | null> }) {
  // Mount the scroll subscription only while this section can be seen.
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] })
  const travel = useTransform(scrollYProgress, [0, 1], [1, -1])
  const opacity = useTransform(scrollYProgress, [0, .2, .6, 1], [0, .65, .5, 0])

  return <motion.div className="scroll-signal-drift" style={{ '--signal-progress': travel, opacity } as MotionStyle}>
    <motion.div className="scroll-signal-entry" initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }}>
      <svg className="scroll-signal-glyph" viewBox="0 0 240 240" fill="none" focusable="false">
        <path className="signal-circuit" d="M0 180H29L53 156H91M149 57H187L209 35H240M18 32V18H32M209 207H223V193" />
        <circle cx="29" cy="180" r="2.5" fill="currentColor" opacity=".65" />
        <circle cx="187" cy="57" r="2.5" fill="currentColor" opacity=".5" />
        <path className="signal-outer" d="M120 30L218 201H22Z" strokeDasharray="4 12" />
        <path className="signal-triangle" d="M116 58Q120 51 124 58L195 182Q199 189 191 189H49Q41 189 45 182Z" />
        <path className="signal-inset" d="M120 72L181 179H59Z" />
        <path className="signal-mark" d="M120 110V141" />
        <circle cx="120" cy="158" r="3" fill="currentColor" />
        <path className="signal-track" d="M77 211H163M99 217H141" />
        <path className="signal-echo" d="M197 73L209 94H185Z" />
        <path className="signal-echo" d="M31 111L39 125H23Z" />
      </svg>
    </motion.div>
  </motion.div>
}
