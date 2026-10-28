// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ScrollSignal } from '../src/components/ScrollSignal'
import { VisualEffectsContext } from '../src/hooks/useVisualEffects'

const active = { enabled: true, paused: false, reduced: false, toggle: () => {} }
let hidden = false
let observers: TestIntersectionObserver[] = []
let previousScrollingElement: PropertyDescriptor | undefined

class TestIntersectionObserver {
  readonly targets = new Set<Element>()
  readonly observe = vi.fn((target: Element) => this.targets.add(target))
  readonly unobserve = vi.fn((target: Element) => this.targets.delete(target))
  readonly disconnect = vi.fn(() => this.targets.clear())

  constructor(readonly callback: IntersectionObserverCallback, readonly options?: IntersectionObserverInit) {
    observers.push(this)
  }

  intersect(target: Element, isIntersecting: boolean) {
    this.callback([{ target, isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
  }
}

function intersect(target: Element, isIntersecting: boolean) {
  const observedTarget = target.querySelector('.scroll-signal-anchor') ?? target
  const observer = observers.find(candidate => candidate.targets.has(observedTarget))
  expect(observer).toBeDefined()
  act(() => observer?.intersect(observedTarget, isIntersecting))
}

beforeEach(() => {
  hidden = false
  observers = []
  vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden)
  vi.stubGlobal('IntersectionObserver', TestIntersectionObserver)
  // jsdom has no scrollingElement; provide the browser's standards-mode root.
  previousScrollingElement = Object.getOwnPropertyDescriptor(document, 'scrollingElement')
  Object.defineProperty(document, 'scrollingElement', { configurable: true, value: document.documentElement })
})

afterEach(() => {
  cleanup()
  if (previousScrollingElement) Object.defineProperty(document, 'scrollingElement', previousScrollingElement)
  else Reflect.deleteProperty(document, 'scrollingElement')
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('decorative scroll signals', () => {
  it('keeps its glyph outside the accessibility tree and keyboard order', () => {
    const view = render(<ScrollSignal tone="amber" side="left" />)
    const layer = view.container.querySelector('.scroll-signal-layer')!
    intersect(layer, true)

    expect(layer.getAttribute('aria-hidden')).toBe('true')
    expect(layer.classList.contains('signal-amber')).toBe(true)
    expect(layer.classList.contains('signal-left')).toBe(true)
    expect(layer.querySelector('svg')?.getAttribute('focusable')).toBe('false')
    expect(layer.querySelector('a, button, input, select, textarea, [tabindex], [contenteditable="true"]')).toBeNull()
    expect(layer.querySelector('[role="alert"], [role="status"], [aria-live]')).toBeNull()
    expect(screen.queryByRole('alert')).toBeNull()
    expect(layer.textContent).toBe('')
  })

  it('attaches the real scroll subscription only in the viewport and removes it on exit and unmount', () => {
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')
    const removeDocument = vi.spyOn(document, 'removeEventListener')
    const view = render(<ScrollSignal />)
    const layer = view.container.querySelector('.scroll-signal-layer')!
    const scrollAdds = () => add.mock.calls.filter(([event]) => event === 'scroll')
    const scrollRemoves = () => remove.mock.calls.filter(([event]) => event === 'scroll')

    expect(layer.getAttribute('data-signal-active')).toBe('false')
    expect(layer.querySelector('.scroll-signal-drift')).toBeNull()
    expect(scrollAdds()).toHaveLength(0)
    const anchor = layer.querySelector('.scroll-signal-anchor')!
    expect(observers[0].targets.has(anchor)).toBe(true)
    expect(observers[0].targets.has(layer)).toBe(false)

    intersect(layer, true)
    expect(layer.getAttribute('data-signal-active')).toBe('true')
    expect(layer.querySelector('.scroll-signal-drift')).not.toBeNull()
    expect(scrollAdds()).toHaveLength(1)

    intersect(layer, false)
    expect(layer.querySelector('.scroll-signal-drift')).toBeNull()
    expect(scrollRemoves()).toHaveLength(1)
    expect(scrollRemoves()[0][1]).toBe(scrollAdds()[0][1])

    intersect(layer, true)
    expect(layer.querySelector('.scroll-signal-drift')).not.toBeNull()
    expect(scrollAdds()).toHaveLength(2)
    view.unmount()
    expect(scrollRemoves()).toHaveLength(2)
    expect(scrollRemoves()[1][1]).toBe(scrollAdds()[1][1])
    expect(observers[0].disconnect).toHaveBeenCalledOnce()
    expect(removeDocument.mock.calls.some(([event]) => event === 'visibilitychange')).toBe(true)
  })

  it.each([
    { label: 'paused', paused: true, reduced: false },
    { label: 'reduced motion', paused: false, reduced: true },
  ])('removes the glyph and subscription for $label, then restores them when enabled', preference => {
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')
    const view = render(<VisualEffectsContext value={active}><ScrollSignal /></VisualEffectsContext>)
    const layer = view.container.querySelector('.scroll-signal-layer')!
    intersect(layer, true)
    expect(layer.querySelector('svg')).not.toBeNull()

    view.rerender(<VisualEffectsContext value={{ ...active, enabled: false, paused: preference.paused, reduced: preference.reduced }}><ScrollSignal /></VisualEffectsContext>)
    expect(layer.getAttribute('data-signal-active')).toBe('false')
    expect(layer.querySelector('svg')).toBeNull()
    expect(remove.mock.calls.filter(([event]) => event === 'scroll')).toHaveLength(1)

    view.rerender(<VisualEffectsContext value={active}><ScrollSignal /></VisualEffectsContext>)
    expect(layer.getAttribute('data-signal-active')).toBe('true')
    expect(layer.querySelector('svg')).not.toBeNull()
    expect(add.mock.calls.filter(([event]) => event === 'scroll')).toHaveLength(2)
  })

  it('stops tracking in a hidden tab and remounts the scroll effect when visible again', () => {
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')
    const view = render(<ScrollSignal />)
    const layer = view.container.querySelector('.scroll-signal-layer')!
    intersect(layer, true)
    expect(layer.getAttribute('data-signal-active')).toBe('true')

    hidden = true
    fireEvent(document, new Event('visibilitychange'))
    expect(layer.getAttribute('data-signal-active')).toBe('false')
    expect(layer.querySelector('.scroll-signal-drift')).toBeNull()
    expect(remove.mock.calls.filter(([event]) => event === 'scroll')).toHaveLength(1)

    hidden = false
    fireEvent(document, new Event('visibilitychange'))
    expect(layer.getAttribute('data-signal-active')).toBe('true')
    expect(layer.querySelector('.scroll-signal-drift')).not.toBeNull()
    expect(add.mock.calls.filter(([event]) => event === 'scroll')).toHaveLength(2)
  })

  it('does not subscribe while initially hidden even when its glyph anchor intersects the viewport', () => {
    hidden = true
    const add = vi.spyOn(window, 'addEventListener')
    const view = render(<ScrollSignal />)
    const layer = view.container.querySelector('.scroll-signal-layer')!
    intersect(layer, true)
    expect(layer.getAttribute('data-signal-active')).toBe('false')
    expect(add.mock.calls.some(([event]) => event === 'scroll')).toBe(false)

    hidden = false
    fireEvent(document, new Event('visibilitychange'))
    expect(layer.getAttribute('data-signal-active')).toBe('true')
    expect(add.mock.calls.filter(([event]) => event === 'scroll')).toHaveLength(1)
  })

  it('gracefully omits the decoration and scroll subscription without IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    const add = vi.spyOn(window, 'addEventListener')
    const view = render(<ScrollSignal />)
    const layer = view.container.querySelector('.scroll-signal-layer')!

    expect(layer.getAttribute('aria-hidden')).toBe('true')
    expect(layer.getAttribute('data-signal-active')).toBe('false')
    expect(layer.querySelector('.scroll-signal-drift')).toBeNull()
    expect(observers).toHaveLength(0)
    expect(add.mock.calls.some(([event]) => event === 'scroll')).toBe(false)

    hidden = true
    fireEvent(document, new Event('visibilitychange'))
    hidden = false
    fireEvent(document, new Event('visibilitychange'))
    expect(layer.getAttribute('data-signal-active')).toBe('false')
    expect(add.mock.calls.some(([event]) => event === 'scroll')).toBe(false)
  })
})
