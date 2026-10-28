import { useEffect, type RefObject } from 'react'
import { useVisualEffects } from './useVisualEffects'

const cards = '.project-card, .profile-skill-card, .profile-cert-card, .profile-training-card, .profile-next-chapter, .cyber-terminal, .contact-form'
const buttons = '.button, .nav-contact, .contact-send-button'
const properties = ['--light-x', '--light-y', '--scene-x', '--scene-y', '--card-rx', '--card-ry', '--magnetic-x', '--magnetic-y']

/** One scheduled update per pointer frame; no continuous render loop or React state. */
export function usePointerLighting(ref: RefObject<HTMLElement | null>, mode: 'scene' | 'cards') {
  const { enabled } = useVisualEffects()

  useEffect(() => {
    const scope = ref.current
    if (!scope || !enabled || !window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return
    let active: HTMLElement | null = null
    let button: HTMLElement | null = null
    let frame = 0
    let x = 0
    let y = 0

    const clear = (element: HTMLElement | null) => {
      if (!element) return
      delete element.dataset.lightActive
      properties.forEach(property => element.style.removeProperty(property))
    }
    const update = () => {
      frame = 0
      if (document.hidden) return
      // Read both surfaces before writing styles, once per pointer frame.
      const bounds = [active, button].map(element => ({ element, rect: element?.getBoundingClientRect() }))
      for (const { element, rect } of bounds) {
        if (!element || !rect?.width || !rect.height) continue
        const px = Math.min(1, Math.max(0, (x - rect.left) / rect.width))
        const py = Math.min(1, Math.max(0, (y - rect.top) / rect.height))
        element.style.setProperty('--light-x', `${(px * 100).toFixed(2)}%`)
        element.style.setProperty('--light-y', `${(py * 100).toFixed(2)}%`)
        element.dataset.lightActive = 'true'
        if (element === button) {
          element.style.setProperty('--magnetic-x', `${((px - .5) * 5).toFixed(2)}px`)
          element.style.setProperty('--magnetic-y', `${((py - .5) * 5).toFixed(2)}px`)
        } else if (mode === 'scene') {
          element.style.setProperty('--scene-x', (px * 2 - 1).toFixed(3))
          element.style.setProperty('--scene-y', (py * 2 - 1).toFixed(3))
        } else if (element.matches('.project-card')) {
          element.style.setProperty('--card-rx', `${((.5 - py) * 3).toFixed(2)}deg`)
          element.style.setProperty('--card-ry', `${((px - .5) * 3).toFixed(2)}deg`)
        }
      }
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || document.hidden) return
      const target = mode === 'scene' ? scope : event.target instanceof Element ? event.target.closest<HTMLElement>(cards) : null
      const nextButton = mode === 'cards' && event.target instanceof Element ? event.target.closest<HTMLElement>(buttons) : null
      if (target !== active) {
        clear(active)
        active = target
      }
      if (button !== nextButton) { clear(button); button = nextButton }
      x = event.clientX
      y = event.clientY
      if ((active || button) && !frame) frame = requestAnimationFrame(update)
    }
    const leave = () => {
      cancelAnimationFrame(frame)
      frame = 0
      clear(active)
      clear(button)
      active = button = null
    }
    scope.addEventListener('pointermove', move, { passive: true })
    scope.addEventListener('pointerleave', leave)
    scope.addEventListener('pointercancel', leave)
    scope.addEventListener('focusin', leave)
    document.addEventListener('visibilitychange', leave)
    window.addEventListener('scroll', leave, { passive: true })
    return () => {
      scope.removeEventListener('pointermove', move)
      scope.removeEventListener('pointerleave', leave)
      scope.removeEventListener('pointercancel', leave)
      scope.removeEventListener('focusin', leave)
      document.removeEventListener('visibilitychange', leave)
      window.removeEventListener('scroll', leave)
      leave()
    }
  }, [enabled, mode, ref])
}
