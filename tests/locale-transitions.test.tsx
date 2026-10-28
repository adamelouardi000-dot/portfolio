// @vitest-environment jsdom

import type { ReactNode } from 'react'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLocale } from '../src/hooks/useLocale'
import { VisualEffectsContext } from '../src/hooks/useVisualEffects'
import { Contact } from '../src/sections/Contact'
import { CyberTerminal } from '../src/sections/CyberTerminal'
import { Projects } from '../src/sections/Projects'
import { projectCategories, localize } from '../src/data/portfolio'

vi.mock('../src/components/Reveal', () => ({
  Reveal: ({ children, className }: { children: ReactNode; className?: string }) => <div className={className}>{children}</div>,
}))

function PortfolioState() {
  const { locale, setLocale } = useLocale()
  return <><button onClick={() => setLocale('en')}>English</button><button onClick={() => setLocale('fr')}>Français</button><Contact locale={locale} /><CyberTerminal locale={locale} /><Projects locale={locale} /></>
}

beforeEach(() => {
  localStorage.clear()
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  Reflect.deleteProperty(document, 'startViewTransition')
})

describe('language transitions preserve the working portfolio', () => {
  it('crossfades the same components without losing form, project filter or terminal state', () => {
    const transition = vi.fn((update: () => void) => {
      update()
      return { finished: Promise.resolve(), skipTransition: vi.fn() }
    })
    Object.defineProperty(document, 'startViewTransition', { configurable: true, value: transition })
    render(<PortfolioState />)
    const name = screen.getByRole('textbox', { name: /Votre nom/ }) as HTMLInputElement
    fireEvent.change(name, { target: { value: 'Recrutement' } })
    fireEvent.click(screen.getByRole('button', { name: 'skills' }))
    const category = projectCategories[1]
    fireEvent.click(screen.getByRole('button', { name: localize(category.label, 'fr') }))
    fireEvent.click(screen.getByRole('button', { name: 'English' }))

    expect(transition).toHaveBeenCalledOnce()
    expect(screen.getByRole('textbox', { name: /Your name/ })).toBe(name)
    expect(name.value).toBe('Recrutement')
    expect(screen.getByRole('button', { name: localize(category.label, 'en') }).getAttribute('aria-pressed')).toBe('true')
    const history = screen.getByRole('region', { name: 'Terminal history' })
    expect(within(history).getByText('skills')).toBeTruthy()
    expect(history.querySelectorAll('.terminal-entry')).toHaveLength(1)
    expect(document.documentElement.lang).toBe('en')
    expect(localStorage.getItem('portfolio-locale')).toBe('en')
  })

  it('applies the language immediately while animations are paused or the API is unavailable', () => {
    const transition = vi.fn()
    Object.defineProperty(document, 'startViewTransition', { configurable: true, value: transition })
    const first = render(<VisualEffectsContext value={{ enabled: false, paused: true, reduced: false, toggle: () => {} }}><PortfolioState /></VisualEffectsContext>)
    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    expect(transition).not.toHaveBeenCalled()
    expect(screen.getByRole('textbox', { name: /Your name/ })).toBeTruthy()
    first.unmount()
    localStorage.clear()
    Reflect.deleteProperty(document, 'startViewTransition')
    render(<PortfolioState />)
    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    expect(screen.getByRole('textbox', { name: /Your name/ })).toBeTruthy()
  })

  it('honors the last requested language when native snapshot callbacks are delayed', () => {
    const callbacks: Array<() => void> = []
    const skip = vi.fn()
    Object.defineProperty(document, 'startViewTransition', { configurable: true, value: (update: () => void) => {
      callbacks.push(update)
      return { finished: Promise.resolve(), skipTransition: skip }
    } })
    render(<PortfolioState />)
    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    fireEvent.click(screen.getByRole('button', { name: 'Français' }))
    expect(callbacks).toHaveLength(2)
    expect(skip).toHaveBeenCalledOnce()
    act(() => callbacks.forEach(update => update()))
    expect(screen.getByRole('textbox', { name: /Votre nom/ })).toBeTruthy()
    expect(document.documentElement.lang).toBe('fr')
  })
})
