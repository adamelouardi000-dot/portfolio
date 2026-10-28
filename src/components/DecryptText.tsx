import { useEffect, useRef, useState } from 'react'
import { useVisualEffects } from '../hooks/useVisualEffects'
import '../styles/decrypt-text.css'

const glyphs = '01<>/[]{}:;_'

/** The readable label stays in the accessibility tree throughout the effect. */
export function DecryptText({ text }: { text: string }) {
  const { enabled } = useVisualEffects()
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState({ text, frame: text })

  useEffect(() => {
    const target = ref.current
    if (!target || !enabled) return
    let interval: number | undefined
    let started = false
    let inView = false
    const stop = () => {
      window.clearInterval(interval)
      interval = undefined
    }
    const finish = () => { stop(); setDisplay({ text, frame: text }) }
    const start = () => {
      if (started || !inView || document.hidden) return
      started = true
      let frame = 0
      interval = window.setInterval(() => {
        frame += 1
        const revealed = Math.ceil((frame / 10) * text.length)
        setDisplay({ text, frame: Array.from(text, (char, index) => index < revealed || /\s/.test(char) ? char : glyphs[(index * 7 + frame * 3) % glyphs.length]).join('') })
        if (frame >= 10) finish()
      }, 55)
    }
    const onVisibility = () => {
      if (document.hidden) { if (started) finish() }
      else start()
    }
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
      inView = entries[0]?.isIntersecting ?? false
      if (inView) start()
      else if (started) finish()
    }, { threshold: .25 })
    if (observer) observer.observe(target)
    else {
      inView = true
      // Keep all state updates inside scheduled work, including fallback rendering.
      interval = window.setInterval(() => { stop(); start() }, 55)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      observer?.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [text, enabled])

  const frame = enabled && display.text === text ? display.frame : text
  return <span className="decrypt-text" ref={ref}>
    <span className="sr-only">{text}</span>
    <span className="decrypt-text-layout" aria-hidden="true">{text}</span>
    <span className="decrypt-text-visual" aria-hidden="true">{frame}</span>
  </span>
}
