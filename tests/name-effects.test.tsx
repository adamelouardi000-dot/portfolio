// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { InteractiveName } from '../src/components/InteractiveName'

afterEach(() => {
  cleanup()
  delete document.documentElement.dataset.visualMotion
  vi.unstubAllGlobals()
})

describe('interactive name motion preferences', () => {
  it('keeps the exact accessible name and ignores pointer movement while paused', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('pointer: fine') }))
    document.documentElement.dataset.visualMotion = 'paused'
    render(<InteractiveName name="Adam ELOUARDI" firstName="Adam" lastName="ELOUARDI" />)
    const heading = screen.getByRole('heading', { level: 1, name: 'Adam ELOUARDI' })
    vi.spyOn(heading, 'getBoundingClientRect').mockReturnValue({
      x: 0, y: 0, left: 0, top: 0, width: 400, height: 200, right: 400, bottom: 200,
      toJSON: () => ({}),
    })
    fireEvent.pointerMove(heading, { pointerType: 'mouse', clientX: 250, clientY: 40 })
    expect(heading.style.getPropertyValue('--name-pointer-x')).toBe('')
    expect(heading.style.getPropertyValue('--name-rotate-x')).toBe('')
    expect(screen.getByRole('heading', { level: 1, name: 'Adam ELOUARDI' })).toBe(heading)
  })

  it('remains usable when matchMedia is unavailable', () => {
    vi.stubGlobal('matchMedia', undefined)
    render(<InteractiveName name="Adam ELOUARDI" firstName="Adam" lastName="ELOUARDI" />)
    const heading = screen.getByRole('heading', { level: 1, name: 'Adam ELOUARDI' })
    fireEvent.pointerMove(heading, { pointerType: 'mouse' })
    expect(heading.style.getPropertyValue('--name-pointer-x')).toBe('')
    heading.focus()
    expect(document.activeElement).toBe(heading)
  })
})
