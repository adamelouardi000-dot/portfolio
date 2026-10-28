// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TerminalIntro } from '../src/components/TerminalIntro'
import { DecryptText } from '../src/components/DecryptText'
import { VisualEffectsContext } from '../src/hooks/useVisualEffects'

const active = { enabled: true, paused: false, reduced: false, toggle: () => {} }

beforeEach(() => {
  vi.useFakeTimers()
  sessionStorage.clear()
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('optional terminal introduction', () => {
  it('can be skipped and is shown only once per browser session', () => {
    const first = render(<TerminalIntro locale="fr" />)
    fireEvent.click(screen.getByRole('button', { name: 'Passer' }))
    expect(screen.queryByRole('complementary')).toBeNull()
    first.unmount()
    render(<TerminalIntro locale="en" />)
    expect(screen.queryByRole('button', { name: 'Skip' })).toBeNull()
  })

  it('does not cover keyboard navigation and automatically finishes', () => {
    const first = render(<><a href="#profile">Profile</a><TerminalIntro locale="en" /></>)
    fireEvent.focus(screen.getByRole('link', { name: 'Profile' }))
    expect(screen.queryByRole('button', { name: 'Skip' })).toBeNull()
    first.unmount()
    sessionStorage.clear()
    render(<TerminalIntro locale="en" />)
    act(() => vi.advanceTimersByTime(2400))
    expect(screen.queryByRole('button', { name: 'Skip' })).toBeNull()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('skips reduced-motion visits and stops immediately when effects are disabled', () => {
    const view = render(<VisualEffectsContext value={active}><TerminalIntro locale="en" /></VisualEffectsContext>)
    expect(screen.queryByRole('button', { name: 'Skip' })).not.toBeNull()
    view.rerender(<VisualEffectsContext value={{ ...active, enabled: false, reduced: true }}><TerminalIntro locale="en" /></VisualEffectsContext>)
    expect(screen.queryByRole('button', { name: 'Skip' })).toBeNull()
    act(() => vi.runOnlyPendingTimers())
    view.rerender(<VisualEffectsContext value={active}><TerminalIntro locale="en" /></VisualEffectsContext>)
    expect(screen.queryByRole('button', { name: 'Skip' })).toBeNull()
  })

  it('closes with Escape and clears its scheduled boot steps', () => {
    render(<TerminalIntro locale="en" />)
    act(() => vi.advanceTimersByTime(500))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('button', { name: 'Skip' })).toBeNull()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('closes when the browser tab is hidden and does not resume on return', () => {
    const schedule = vi.spyOn(window, 'setTimeout')
    const clear = vi.spyOn(window, 'clearTimeout')
    render(<TerminalIntro locale="en" />)
    const bootTimers = schedule.mock.calls.flatMap((call, index) => [420, 980, 1600, 2400].includes(Number(call[1])) ? [schedule.mock.results[index].value] : [])
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    fireEvent(document, new Event('visibilitychange'))
    expect(screen.queryByRole('button', { name: 'Skip' })).toBeNull()
    expect(bootTimers).toHaveLength(4)
    bootTimers.forEach(timer => expect(clear).toHaveBeenCalledWith(timer))
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
    fireEvent(document, new Event('visibilitychange'))
    expect(screen.queryByRole('button', { name: 'Skip' })).toBeNull()
  })

  it('remains optional and remembers the attempt in memory if session storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('Blocked', 'SecurityError') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Blocked', 'SecurityError') })
    const first = render(<TerminalIntro locale="en" />)
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }))
    first.unmount()
    render(<TerminalIntro locale="en" />)
    expect(screen.queryByRole('button', { name: 'Skip' })).toBeNull()
  })

  it.each(['click', 'Escape', 'timeout'])('returns focus to the skip link after %s closes a focused introduction', method => {
    render(<><a className="skip-link" href="#main">Skip to content</a><main id="main" /><TerminalIntro locale="en" /></>)
    const skip = screen.getByRole('button', { name: 'Skip' })
    act(() => skip.focus())
    expect(document.activeElement).toBe(skip)
    if (method === 'click') fireEvent.click(skip)
    else if (method === 'Escape') fireEvent.keyDown(document, { key: 'Escape' })
    else act(() => vi.advanceTimersByTime(2400))
    expect(screen.queryByRole('button', { name: 'Skip' })).toBeNull()
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Skip to content' }))
  })
})

describe('readable heading decryption', () => {
  it('preserves the accessible final title, finishes offscreen and cleans timers', () => {
    let observe: IntersectionObserverCallback = () => {}
    const disconnect = vi.fn()
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: IntersectionObserverCallback) { observe = callback }
      observe() {}
      disconnect = disconnect
    })
    const view = render(<h2><DecryptText text="Mes projets" /></h2>)
    expect(screen.getByRole('heading', { name: 'Mes projets' })).not.toBeNull()
    act(() => observe([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver))
    act(() => vi.advanceTimersByTime(55))
    expect(view.container.querySelector('.decrypt-text-visual')?.textContent).not.toBe('Mes projets')
    expect(screen.getByRole('heading', { name: 'Mes projets' })).not.toBeNull()
    act(() => observe([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver))
    expect(view.container.querySelector('.decrypt-text-visual')?.textContent).toBe('Mes projets')
    expect(vi.getTimerCount()).toBe(0)
    view.unmount()
    expect(disconnect).toHaveBeenCalledOnce()
  })

  it('shows a changed language immediately when effects are paused', () => {
    const view = render(<VisualEffectsContext value={{ ...active, enabled: false, paused: true }}><h2><DecryptText text="Mes projets" /></h2></VisualEffectsContext>)
    view.rerender(<VisualEffectsContext value={{ ...active, enabled: false, paused: true }}><h2><DecryptText text="My projects" /></h2></VisualEffectsContext>)
    expect(screen.getByRole('heading', { name: 'My projects' })).not.toBeNull()
    expect(view.container.querySelector('.decrypt-text-visual')?.textContent).toBe('My projects')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('naturally reveals the final title within 550 ms and stops its interval', () => {
    let observe: IntersectionObserverCallback = () => {}
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: IntersectionObserverCallback) { observe = callback }
      observe() {}
      disconnect() {}
    })
    const view = render(<h2><DecryptText text="My projects" /></h2>)
    act(() => observe([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver))
    act(() => vi.advanceTimersByTime(550))
    expect(view.container.querySelector('.decrypt-text-visual')?.textContent).toBe('My projects')
    expect(screen.getByRole('heading', { name: 'My projects' })).not.toBeNull()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('cancels an active decryption and immediately shows the final title when paused', () => {
    let observe: IntersectionObserverCallback = () => {}
    const disconnect = vi.fn()
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: IntersectionObserverCallback) { observe = callback }
      observe() {}
      disconnect = disconnect
    })
    const view = render(<VisualEffectsContext value={active}><h2><DecryptText text="My projects" /></h2></VisualEffectsContext>)
    act(() => observe([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver))
    act(() => vi.advanceTimersByTime(110))
    expect(view.container.querySelector('.decrypt-text-visual')?.textContent).not.toBe('My projects')
    view.rerender(<VisualEffectsContext value={{ ...active, enabled: false, paused: true }}><h2><DecryptText text="My projects" /></h2></VisualEffectsContext>)
    expect(view.container.querySelector('.decrypt-text-visual')?.textContent).toBe('My projects')
    expect(screen.getByRole('heading', { name: 'My projects' })).not.toBeNull()
    expect(disconnect).toHaveBeenCalledOnce()
    expect(vi.getTimerCount()).toBe(0)
    act(() => vi.advanceTimersByTime(1000))
    expect(view.container.querySelector('.decrypt-text-visual')?.textContent).toBe('My projects')
  })
})
