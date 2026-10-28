// @vitest-environment jsdom

import { useRef } from 'react'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { VisualEffectsProvider } from '../src/components/VisualEffectsProvider'
import { VisualEffectsToggle } from '../src/components/VisualEffectsToggle'
import { usePointerLighting } from '../src/hooks/usePointerLighting'
import { useSceneVisibility } from '../src/hooks/useSceneVisibility'

let reduced = false
let finePointer = true
const preferenceListeners = new Set<() => void>()

beforeEach(() => {
  reduced = false
  finePointer = true
  preferenceListeners.clear()
  localStorage.clear()
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('prefers-reduced-motion') ? reduced : finePointer,
    addEventListener: (_event: string, callback: () => void) => { preferenceListeners.add(callback) },
    removeEventListener: (_event: string, callback: () => void) => { preferenceListeners.delete(callback) },
    addListener: () => {},
    removeListener: () => {},
  }))
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  delete document.documentElement.dataset.visualMotion
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function LightingHarness() {
  const ref = useRef<HTMLElement>(null)
  usePointerLighting(ref, 'cards')
  return <main ref={ref}><article className="project-card" data-testid="lit-card"><span>Project</span><button type="button" className="button">Explore</button></article></main>
}

describe('decorative motion controls', () => {
  it('pauses decorations, persists the choice and restores it on the next visit', () => {
    const { unmount } = render(<VisualEffectsProvider><VisualEffectsToggle locale="fr" /></VisualEffectsProvider>)
    const toggle = screen.getByRole('button', { name: 'Animations décoratives' })
    expect(toggle.getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(toggle)
    expect(toggle.getAttribute('aria-pressed')).toBe('false')
    expect(document.documentElement.dataset.visualMotion).toBe('paused')
    expect(localStorage.getItem('portfolio-visual-effects')).toBe('paused')
    unmount()

    render(<VisualEffectsProvider><VisualEffectsToggle locale="en" /></VisualEffectsProvider>)
    const restored = screen.getByRole('button', { name: 'Decorative animations' })
    expect(restored.getAttribute('aria-pressed')).toBe('false')
    fireEvent.click(restored)
    expect(document.documentElement.dataset.visualMotion).toBe('active')
  })

  it('immediately follows a change in the system reduced-motion preference', () => {
    render(<VisualEffectsProvider><VisualEffectsToggle locale="fr" /></VisualEffectsProvider>)
    const toggle = screen.getByRole('button', { name: 'Animations décoratives' }) as HTMLButtonElement
    act(() => {
      reduced = true
      preferenceListeners.forEach(callback => callback())
    })
    expect(document.documentElement.dataset.visualMotion).toBe('reduced')
    expect(toggle.disabled).toBe(true)
    expect(toggle.getAttribute('aria-pressed')).toBe('false')
    fireEvent.click(toggle)
    expect(document.documentElement.dataset.visualMotion).toBe('reduced')
    act(() => {
      reduced = false
      preferenceListeners.forEach(callback => callback())
    })
    expect(toggle.disabled).toBe(false)
    expect(document.documentElement.dataset.visualMotion).toBe('active')
  })

  it('clears pointer lighting and cancels pending updates when animations are paused', () => {
    let pending: FrameRequestCallback | undefined
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => { pending = callback; return 7 }))
    const cancel = vi.fn()
    vi.stubGlobal('cancelAnimationFrame', cancel)
    render(<VisualEffectsProvider><VisualEffectsToggle locale="en" /><LightingHarness /></VisualEffectsProvider>)
    const card = screen.getByTestId('lit-card')
    vi.spyOn(card, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 400, height: 200 } as DOMRect)
    const move = new MouseEvent('pointermove', { bubbles: true, clientX: 300, clientY: 50 })
    fireEvent(card, move)
    act(() => pending?.(0))
    expect(card.style.getPropertyValue('--light-x')).toBe('75.00%')
    expect(card.dataset.lightActive).toBe('true')
    expect(card.style.getPropertyValue('--card-rx')).toBe('0.75deg')
    expect(card.style.getPropertyValue('--card-ry')).toBe('0.75deg')
    fireEvent(card, move)
    fireEvent.click(screen.getByRole('button', { name: 'Decorative animations' }))
    expect(cancel).toHaveBeenCalledWith(7)
    expect(card.dataset.lightActive).toBeUndefined()
    expect(card.style.getPropertyValue('--light-x')).toBe('')
    expect(card.style.getPropertyValue('--card-rx')).toBe('')
    expect(card.style.getPropertyValue('--card-ry')).toBe('')
    pending = undefined
    fireEvent(card, move)
    expect(pending).toBeUndefined()
  })

  it('keeps touch-only devices free of pointer lighting listeners', () => {
    finePointer = false
    const schedule = vi.fn()
    vi.stubGlobal('requestAnimationFrame', schedule)
    render(<VisualEffectsProvider><LightingHarness /></VisualEffectsProvider>)
    fireEvent(screen.getByTestId('lit-card'), new MouseEvent('pointermove', { bubbles: true, clientX: 10 }))
    expect(schedule).not.toHaveBeenCalled()
  })

  it('bounds magnetic movement and resets both button and card on keyboard focus or scrolling', () => {
    let pending: FrameRequestCallback | undefined
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => { pending = callback; return 9 }))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    render(<VisualEffectsProvider><LightingHarness /></VisualEffectsProvider>)
    const card = screen.getByTestId('lit-card')
    const button = screen.getByRole('button', { name: 'Explore' })
    vi.spyOn(card, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 400, height: 200 } as DOMRect)
    vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 100, height: 50 } as DOMRect)
    const move = () => {
      fireEvent(button, new MouseEvent('pointermove', { bubbles: true, clientX: 100, clientY: 50 }))
      act(() => pending?.(0))
    }
    move()
    expect(button.style.getPropertyValue('--magnetic-x')).toBe('2.50px')
    expect(button.style.getPropertyValue('--magnetic-y')).toBe('2.50px')
    expect(card.dataset.lightActive).toBe('true')
    fireEvent.focusIn(button)
    expect(button.style.getPropertyValue('--magnetic-x')).toBe('')
    expect(card.dataset.lightActive).toBeUndefined()
    move()
    fireEvent.scroll(window)
    expect(button.style.getPropertyValue('--magnetic-y')).toBe('')
    expect(card.dataset.lightActive).toBeUndefined()
  })
})

describe('background animation visibility', () => {
  it('suspends the scene outside the viewport and when the browser tab is hidden', () => {
    let observe: IntersectionObserverCallback = () => {}
    const disconnect = vi.fn()
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: IntersectionObserverCallback) { observe = callback }
      observe() {}
      disconnect = disconnect
    })
    function Scene() {
      const ref = useRef<HTMLElement>(null)
      useSceneVisibility(ref)
      return <section ref={ref} data-testid="scene" />
    }
    const { unmount } = render(<Scene />)
    const scene = screen.getByTestId('scene')
    act(() => observe([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver))
    expect(scene.dataset.sceneVisible).toBe('false')
    act(() => observe([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver))
    expect(scene.dataset.sceneVisible).toBe('true')
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    fireEvent(document, new Event('visibilitychange'))
    expect(scene.dataset.sceneVisible).toBe('false')
    unmount()
    expect(disconnect).toHaveBeenCalledOnce()
  })
})
