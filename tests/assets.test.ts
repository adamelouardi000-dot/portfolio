import { afterEach, describe, expect, it, vi } from 'vitest'
import { publicAssetUrl } from '../src/lib/assets'
import { profile, certifications, projects } from '../src/data/portfolio'
import { statSync } from 'node:fs'
import path from 'node:path'

afterEach(() => vi.unstubAllEnvs())

describe('GitHub Pages public assets', () => {
  it('serves every configured local asset under the deployment base', () => {
    vi.stubEnv('BASE_URL', '/portfolio/')
    const sources = [profile.cv, profile.photo, ...certifications.flatMap(item => [item.logo, item.evidenceUrl]), ...projects.flatMap(project => project.screenshots.map(item => item.src))]
      .filter((source): source is string => Boolean(source?.startsWith('/')))
    expect(sources.length).toBeGreaterThan(0)
    for (const source of sources) {
      const resolved = publicAssetUrl(source)!
      expect(resolved).toBe(`/portfolio${source}`)
      expect(statSync(path.resolve('public', resolved.slice('/portfolio/'.length))).isFile()).toBe(true)
    }
  })

  it('avoids duplicating the base and supports a root deployment', () => {
    vi.stubEnv('BASE_URL', '/portfolio/')
    expect(publicAssetUrl('/portfolio/assets/cv.pdf')).toBe('/portfolio/assets/cv.pdf')
    vi.stubEnv('BASE_URL', '/')
    expect(publicAssetUrl('/assets/cv.pdf')).toBe('/assets/cv.pdf')
  })

  it('preserves external URLs and rejects unsafe or unavailable links', () => {
    vi.stubEnv('BASE_URL', '/portfolio/')
    expect(publicAssetUrl('https://github.com/adamelouardi000-dot')).toBe('https://github.com/adamelouardi000-dot')
    for (const source of [null, undefined, '//example.com/file', '/\\example.com', 'javascript:alert(1)']) {
      expect(publicAssetUrl(source)).toBeUndefined()
    }
  })
})
