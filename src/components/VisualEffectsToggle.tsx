import { Minus, Pause, Play } from 'lucide-react'
import type { Locale } from '../data/types'
import { useVisualEffects } from '../hooks/useVisualEffects'

export function VisualEffectsToggle({ locale }: { locale: Locale }) {
  const { enabled, reduced, toggle } = useVisualEffects()
  const fr = locale === 'fr'
  const title = reduced
    ? (fr ? 'Mouvements réduits selon vos préférences système' : 'Reduced motion follows your system preference')
    : enabled
      ? (fr ? 'Mettre les animations en pause' : 'Pause animations')
      : (fr ? 'Activer les animations' : 'Enable animations')
  const Icon = reduced ? Minus : enabled ? Pause : Play

  return <button type="button" className="visual-effects-toggle mono" aria-label={fr ? 'Animations décoratives' : 'Decorative animations'} aria-pressed={enabled} disabled={reduced} title={title} onClick={toggle}>
    <Icon size={11} aria-hidden="true" />
    <span>{reduced ? (fr ? 'EFFETS CALMES' : 'QUIET EFFECTS') : enabled ? (fr ? 'ANIMATIONS' : 'ANIMATIONS') : (fr ? 'EN PAUSE' : 'PAUSED')}</span>
  </button>
}
