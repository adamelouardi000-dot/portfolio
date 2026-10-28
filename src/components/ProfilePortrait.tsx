import { useState } from 'react'
import { ScanFace } from 'lucide-react'
import type { Locale } from '../data/types'
import { publicAssetUrl } from '../lib/assets'
import '../styles/personalisation.css'

interface PortraitProps {
  src: string | null
  name: string
  locale: Locale
}

/** A new source resets the loading fallback without an effect or a broken image. */
export function ProfilePortrait({ src, name, locale }: PortraitProps) {
  const photo = publicAssetUrl(src)
  return <PortraitFrame key={photo ?? 'placeholder'} src={photo} name={name} locale={locale} />
}

function PortraitFrame({ src, name, locale }: Omit<PortraitProps, 'src'> & { src: string | undefined }) {
  const [failed, setFailed] = useState(false)
  const fr = locale === 'fr'
  const hasPhoto = Boolean(src) && !failed
  const words = name.trim().split(/\s+/)
  const initials = `${words[0]?.[0] ?? ''}${words.at(-1)?.[0] ?? ''}`
  const caption = failed
    ? (fr ? 'Photo momentanément indisponible' : 'Photo temporarily unavailable')
    : (fr ? 'Photo professionnelle à ajouter' : 'Professional photo to be added')

  return <>
    <div className={`profile-portrait${hasPhoto ? ' has-photo' : ''}`}>
      {hasPhoto ? (
        <img
          src={src}
          alt={`${fr ? 'Portrait professionnel de' : 'Professional portrait of'} ${name}`}
          loading="lazy"
          decoding="async"
          width="158"
          height="216"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="profile-photo-placeholder">
          <div className="profile-photo-grid" aria-hidden="true" />
          <span className="profile-portrait-initials" aria-hidden="true">{initials}</span>
          <span className="profile-portrait-scan" aria-hidden="true"><ScanFace size={36} strokeWidth={1.2} /></span>
          <span className="profile-photo-caption">{caption}</span>
        </div>
      )}
      <span className="profile-portrait-corner profile-portrait-corner-tl" aria-hidden="true" />
      <span className="profile-portrait-corner profile-portrait-corner-br" aria-hidden="true" />
    </div>
    <div className="profile-portrait-footer">
      <span className="profile-status-light" aria-hidden="true" />
      <span>{hasPhoto ? `portrait / ${name}` : (fr ? 'portrait / à personnaliser' : 'portrait / to personalize')}</span>
      <span aria-hidden="true">.01</span>
    </div>
  </>
}
