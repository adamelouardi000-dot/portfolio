// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SecurityOrbit } from '../src/components/SecurityOrbit'
import { VisualEffectsContext } from '../src/hooks/useVisualEffects'

const activeEffects = { enabled: true, paused: false, reduced: false, toggle: () => {} }

beforeEach(() => {
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} }))
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('hooded character rotation', () => {
  it('supports complete turns and a front-view reset through accessible controls', () => {
    const { container } = render(<SecurityOrbit locale="fr" />)
    const scene = screen.getByRole('slider', { name: 'Rotation du personnage à 360 degrés' })
    const right = screen.getByRole('button', { name: 'Tourner le personnage vers la droite' })
    fireEvent.click(right)
    expect(scene.getAttribute('aria-valuenow')).toBe('45')
    for (let step = 0; step < 7; step++) fireEvent.click(right)
    expect(scene.getAttribute('aria-valuenow')).toBe('0')
    expect(container.querySelector('.hologram-character-turntable')?.getAttribute('data-rotation')).toBe('360')
    fireEvent.click(screen.getByRole('button', { name: 'Tourner le personnage vers la gauche' }))
    expect(scene.getAttribute('aria-valuenow')).toBe('315')
    fireEvent.click(screen.getByRole('button', { name: 'Revenir à la vue de face' }))
    expect(scene.getAttribute('aria-valuenow')).toBe('0')
    for (let step = 0; step < 9; step++) fireEvent.click(right)
    expect(container.querySelector('.hologram-character-turntable')?.getAttribute('data-rotation')).toBe('765')
    fireEvent.click(screen.getByRole('button', { name: 'Revenir à la vue de face' }))
    expect(container.querySelector('.hologram-character-turntable')?.getAttribute('data-rotation')).toBe('720')
    expect(scene.getAttribute('aria-valuenow')).toBe('0')
    fireEvent.keyDown(scene, { key: 'End' })
    expect(container.querySelector('.hologram-character-turntable')?.getAttribute('data-rotation')).toBe('719')
    expect(scene.getAttribute('aria-valuenow')).toBe('359')
    expect(scene.getAttribute('aria-valuemax')).toBe('359')
    fireEvent.keyDown(scene, { key: 'Home' })
    expect(container.querySelector('.hologram-character-turntable')?.getAttribute('data-rotation')).toBe('720')
    expect(container.querySelectorAll('.hologram-character-back')).toHaveLength(1)
    expect(container.querySelectorAll('.hologram-laptop-front, .hologram-laptop-rear')).toHaveLength(2)
    expect(container.querySelector('.hologram-character-turntable')?.textContent).toBe('')
  })

  it('allows precise keyboard rotation and exposes English control names', () => {
    render(<SecurityOrbit locale="en" />)
    const scene = screen.getByRole('slider', { name: '360 degree character rotation' })
    fireEvent.keyDown(scene, { key: 'ArrowRight' })
    expect(scene.getAttribute('aria-valuenow')).toBe('15')
    fireEvent.keyDown(scene, { key: 'ArrowRight', shiftKey: true })
    expect(scene.getAttribute('aria-valuenow')).toBe('60')
    fireEvent.keyDown(scene, { key: 'End' })
    expect(scene.getAttribute('aria-valuenow')).toBe('359')
    fireEvent.keyDown(scene, { key: 'Home' })
    expect(scene.getAttribute('aria-valuenow')).toBe('0')
    expect(screen.getByRole('button', { name: 'Reset to front view' })).toBeTruthy()
  })

  it('returns to a static front view and disables every control when effects are paused or reduced', () => {
    const { rerender, container } = render(<VisualEffectsContext value={activeEffects}><SecurityOrbit locale="en" /></VisualEffectsContext>)
    fireEvent.click(screen.getByRole('button', { name: 'Rotate character right' }))
    expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('45')
    for (const reason of ['paused', 'reduced'] as const) {
      rerender(<VisualEffectsContext value={{ ...activeEffects, enabled: false, [reason]: true }}><SecurityOrbit locale="en" /></VisualEffectsContext>)
      const scene = screen.getByRole('slider')
      expect(scene.getAttribute('aria-disabled')).toBe('true')
      expect(scene.getAttribute('tabindex')).toBe('-1')
      expect(scene.getAttribute('aria-valuenow')).toBe('0')
      expect(container.querySelector('.hologram-character-turntable')?.getAttribute('data-rotation')).toBe('0')
      expect(screen.getAllByRole('button').every(button => (button as HTMLButtonElement).disabled)).toBe(true)
      fireEvent.keyDown(scene, { key: 'ArrowRight' })
      expect(scene.getAttribute('aria-valuenow')).toBe('0')
    }
    rerender(<VisualEffectsContext value={activeEffects}><SecurityOrbit locale="en" /></VisualEffectsContext>)
    expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('0')
    expect(container.querySelector('.hologram-character-turntable')?.getAttribute('data-rotation')).toBe('0')
    fireEvent.click(screen.getByRole('button', { name: 'Rotate character right' }))
    expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('45')
  })

  it('ignores rotation while offscreen or hidden and resumes interaction when visible', () => {
    let notify: IntersectionObserverCallback = () => {}
    const disconnect = vi.fn()
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: IntersectionObserverCallback) { notify = callback }
      observe() {}
      disconnect = disconnect
    })
    const { unmount } = render(<SecurityOrbit locale="en" />)
    const scene = screen.getByRole('slider')
    const right = screen.getByRole('button', { name: 'Rotate character right' })
    act(() => notify([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver))
    fireEvent.click(right)
    expect(scene.getAttribute('aria-valuenow')).toBe('0')
    act(() => notify([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver))
    fireEvent.click(right)
    expect(scene.getAttribute('aria-valuenow')).toBe('45')
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    fireEvent(document, new Event('visibilitychange'))
    fireEvent.click(right)
    expect(scene.getAttribute('aria-valuenow')).toBe('45')
    unmount()
    expect(disconnect).toHaveBeenCalledOnce()
  })

  it('rotates on horizontal drags while leaving vertical touch scrolling unclaimed', () => {
    class TestPointerEvent extends MouseEvent {
      pointerId: number
      constructor(type: string, init: MouseEventInit & { pointerId?: number } = {}) { super(type, init); this.pointerId = init.pointerId ?? 1 }
    }
    vi.stubGlobal('PointerEvent', TestPointerEvent)
    let pending: FrameRequestCallback | undefined
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => { pending = callback; return 5 }))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    render(<SecurityOrbit locale="en" />)
    const scene = screen.getByRole('slider')
    const capture = vi.fn()
    const release = vi.fn()
    scene.setPointerCapture = capture
    scene.hasPointerCapture = vi.fn(() => true)
    scene.releasePointerCapture = release
    fireEvent.pointerDown(scene, { clientX: 100, clientY: 100, pointerId: 1, button: 0 })
    const vertical = new TestPointerEvent('pointermove', { bubbles: true, cancelable: true, clientX: 103, clientY: 160, pointerId: 1 })
    fireEvent(scene, vertical)
    expect(vertical.defaultPrevented).toBe(false)
    expect(scene.getAttribute('aria-valuenow')).toBe('0')
    expect(release).toHaveBeenCalledWith(1)
    fireEvent.pointerDown(scene, { clientX: 100, clientY: 100, pointerId: 2, button: 0 })
    fireEvent.pointerMove(scene, { clientX: 200, clientY: 102, pointerId: 2 })
    act(() => pending?.(0))
    expect(scene.getAttribute('aria-valuenow')).toBe('70')
    fireEvent.pointerCancel(scene, { pointerId: 2 })
    expect(scene.dataset.dragging).toBeUndefined()
    expect(release).toHaveBeenCalledWith(2)
    fireEvent.pointerDown(scene, { clientX: 100, clientY: 100, pointerId: 3, button: 0 })
    fireEvent.pointerMove(scene, { clientX: 250, clientY: 102, pointerId: 3 })
    const canceled = pending
    fireEvent.pointerCancel(scene, { pointerId: 3 })
    act(() => canceled?.(0))
    expect(scene.getAttribute('aria-valuenow')).toBe('70')
  })
})
