import { ArrowUp, ArrowUpRight } from 'lucide-react'
import type { Locale } from '../data/types'
import { profile } from '../data/portfolio'

export function Footer({ locale }: { locale: Locale }) {
  const fr = locale === 'fr'
  return <footer className="site-footer"><div className="container">
    <div className="footer-top"><a href="#home" className="brand"><span className="brand-symbol">{profile.firstName[0]}{profile.lastName[0]}<span>.</span></span><span className="footer-name">{profile.name}<small>{fr ? 'La curiosité au service de la sécurité.' : 'Curiosity, in the service of security.'}</small></span></a><a href="#certifications" className="footer-cert-link">{fr ? 'Certifications & parcours' : 'Certifications & journey'}<ArrowUpRight size={14} /></a><a href="#home" className="back-to-top" aria-label={fr ? 'Retour en haut' : 'Back to top'}><ArrowUp size={18} /></a></div>
    <div className="footer-bottom mono"><span>© {new Date().getFullYear()} {profile.name}</span><span>{fr ? 'PENSÉ AVEC MÉTHODE. CONSTRUIT AVEC CURIOSITÉ.' : 'THOUGHTFULLY ENGINEERED. BUILT WITH CURIOSITY.'}</span><span><i className="status-dot" />{fr ? 'TOUJOURS EN APPRENTISSAGE' : 'ALWAYS LEARNING'}</span></div>
  </div></footer>
}
