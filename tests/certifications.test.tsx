// @vitest-environment jsdom

import type { ReactNode } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Certifications } from '../src/sections/Certifications'
import { certifications, trainings } from '../src/data/profile'

vi.mock('../src/components/Reveal', () => ({
  Reveal: ({ children, className }: { children: ReactNode; className?: string }) => <div className={className}>{children}</div>,
}))

afterEach(cleanup)

describe('certification evidence', () => {
  it('keeps the Oracle edition separate from an unknown award date', () => {
    const badge = certifications.find((entry) => entry.id === 'oci-architect-associate-2026')!
    const original = { date: badge.date, verificationUrl: badge.verificationUrl }
    badge.date = undefined
    badge.verificationUrl = undefined
    try {
      render(<Certifications locale="fr" />)
      expect(screen.getByText('Badge fourni')).toBeTruthy()
      expect(screen.getByText('Édition').nextElementSibling?.textContent).toBe('2026')
      expect(screen.getByText('Obtention').nextElementSibling?.textContent).toBe('Date à compléter')
      expect(screen.queryByRole('link', { name: 'Vérifier la certification' })).toBeNull()
      expect(screen.getByText('Vérification non renseignée')).toBeTruthy()
      expect(screen.getByText(badge.note!.fr)).toBeTruthy()
    } finally {
      Object.assign(badge, original)
    }
  })

  it('shows the supplied badge image and links directly to its safe local evidence', () => {
    render(<Certifications locale="fr" />)
    const badge = certifications.find((entry) => entry.id === 'oci-architect-associate-2026')!
    const image = screen.getByRole('img', { name: `Badge ${badge.name}` })
    expect(image.getAttribute('src')).toBe('/assets/oracle-oci-architect-associate-2026.jpg')
    expect(image.getAttribute('width')).toBe('560')
    expect(image.parentElement?.className).toBe('profile-cert-badge-art')
    const evidence = screen.getByRole('link', { name: 'Voir le badge' })
    expect(evidence.getAttribute('href')).toBe(badge.evidenceUrl)
    expect(evidence.getAttribute('rel')).toContain('noopener')
  })

  it('retains separate CV training and translates the available evidence', () => {
    const { rerender } = render(<Certifications locale="fr" />)
    expect(screen.getByRole('heading', { name: 'Formations mentionnées dans mon CV' })).toBeTruthy()
    for (const training of trainings) {
      expect(screen.getByRole('heading', { name: training.name })).toBeTruthy()
      expect(screen.getByText(training.note.fr)).toBeTruthy()
    }
    const badge = screen.getByRole('heading', { name: certifications.find((entry) => entry.id === 'oci-architect-associate-2026')!.name })
    const trainingTitle = screen.getByRole('heading', { name: 'Formations mentionnées dans mon CV' })
    expect(badge.compareDocumentPosition(trainingTitle) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    rerender(<Certifications locale="en" />)
    expect(screen.getByText('Badge provided')).toBeTruthy()
    expect(screen.getByText('Edition').nextElementSibling?.textContent).toBe('2026')
    expect(screen.getByText('Date earned').nextElementSibling?.textContent).toBe('Date to be added')
    expect(screen.getByRole('link', { name: 'View badge' })).toBeTruthy()
    expect(screen.getByText('Verification not provided')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Training listed in my CV' })).toBeTruthy()
    for (const training of trainings) expect(screen.getByText(training.note.en)).toBeTruthy()
    expect(screen.queryByText('Badge fourni')).toBeNull()
  })

  it('only offers a verification link when a safe URL is configured', () => {
    const badge = certifications.find((entry) => entry.id === 'oci-architect-associate-2026')!
    const originalUrl = badge.verificationUrl
    try {
      badge.verificationUrl = 'javascript:alert(1)'
      const { rerender } = render(<Certifications locale="en" />)
      expect(screen.queryByRole('link', { name: 'Verify certification' })).toBeNull()
      badge.verificationUrl = 'https://example.com/verify/credential'
      rerender(<Certifications locale="en" />)
      const link = screen.getByRole('link', { name: 'Verify certification' })
      expect(link.getAttribute('href')).toBe(badge.verificationUrl)
      expect(link.getAttribute('rel')).toContain('noopener')
    } finally {
      badge.verificationUrl = originalUrl
    }
  })

  it('preserves the empty state when no credentials are configured', () => {
    const configured = certifications.splice(0)
    try {
      render(<Certifications locale="fr" />)
      expect(screen.getByText('Certifications à renseigner')).toBeTruthy()
      expect(screen.queryByRole('link', { name: 'Voir le badge' })).toBeNull()
      expect(screen.getByRole('heading', { name: 'Formations mentionnées dans mon CV' })).toBeTruthy()
    } finally {
      certifications.push(...configured)
    }
  })
})
