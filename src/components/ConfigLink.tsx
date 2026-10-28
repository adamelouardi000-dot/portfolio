import type { ReactNode } from 'react'
import { publicAssetUrl } from '../lib/assets'

export function ConfigLink({ href, children, className = '', missingLabel, download }: {
  href: string | null | undefined; children: ReactNode; className?: string; missingLabel: string; download?: boolean
}) {
  const safe = publicAssetUrl(href)
  if (!safe) return <span className={`${className} unavailable-link`} aria-disabled="true" title={missingLabel}>{children}<span className="sr-only"> — {missingLabel}</span></span>
  const external = /^https?:/.test(safe)
  return <a className={className} href={safe} download={download || undefined} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{children}</a>
}
