import { describe, expect, it } from 'vitest'
import { safeHref } from '../src/lib/links'

describe('configurable links', () => {
  it('keeps missing or unsafe configuration unavailable', () => {
    for (const link of [null, undefined, '', 'javascript:alert(1)', 'data:text/html,test', '//example.com', '/\\example.com', '/cv\n.pdf', ' https://example.com', 'not a url']) {
      expect(safeHref(link)).toBeUndefined()
    }
  })
  it('accepts absolute site assets and explicit web links', () => {
    expect(safeHref('/assets/adam-elouardi-cv.pdf')).toBe('/assets/adam-elouardi-cv.pdf')
    expect(safeHref('https://github.com/example')).toBe('https://github.com/example')
  })
})
