import { useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { motion, useScroll, useSpring } from 'motion/react'
import type { Locale } from '../data/types'
import { profile } from '../data/portfolio'
import { useActiveSection } from '../hooks/useActiveSection'
import { useVisualEffects } from '../hooks/useVisualEffects'

const links = [
  { id: 'about', fr: 'À propos', en: 'About' },
  { id: 'skills', fr: 'Domaines', en: 'Focus areas' },
  { id: 'projects', fr: 'Projets', en: 'Projects' },
  { id: 'journey', fr: 'Parcours', en: 'Journey' },
  { id: 'terminal', fr: 'Terminal', en: 'Terminal' },
]

export function Navigation({ locale, setLocale }: { locale: Locale; setLocale: (locale: Locale) => void }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLButtonElement>(null)
  const active = useActiveSection(['home', ...links.map(link => link.id), 'certifications', 'contact'])
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 180, damping: 35 })
  const { enabled } = useVisualEffects()
  const reduced = !enabled
  return <header className="site-header">
    <a className="skip-link" href="#main">{locale === 'fr' ? 'Aller au contenu' : 'Skip to content'}</a>
    <div className="container nav-inner">
      <a href="#home" className="brand" aria-label={`${profile.name} — ${locale === 'fr' ? 'Accueil' : 'Home'}`} onClick={() => setOpen(false)}>
        <span className="brand-symbol">{profile.firstName[0]}{profile.lastName[0]}<span>.</span></span><span className="brand-wordmark">{profile.firstName.toUpperCase()}<span>{profile.lastName}</span></span>
      </a>
      <nav className="desktop-nav" aria-label={locale === 'fr' ? 'Navigation principale' : 'Main navigation'}>
        {links.map(link => <a key={link.id} className={active === link.id ? 'active' : ''} href={`#${link.id}`} aria-current={active === link.id ? 'location' : undefined}>{link[locale]}</a>)}
      </nav>
      <div className="nav-actions">
        <div className="language-switch" role="group" aria-label={locale === 'fr' ? 'Langue' : 'Language'}>
          {(['fr', 'en'] as const).map(lang => <button key={lang} type="button" lang={lang} aria-label={lang === 'fr' ? 'Français' : 'English'} aria-pressed={locale === lang} onClick={() => { setLocale(lang); setOpen(false) }}>{lang.toUpperCase()}</button>)}
        </div>
        <a href="#contact" className="nav-contact">{locale === 'fr' ? 'Échangeons' : 'Let’s talk'}<ArrowUpRight size={15} /></a>
        <button ref={menuRef} type="button" className="menu-toggle icon-button" aria-expanded={open} aria-controls={open ? 'mobile-nav' : undefined} aria-label={open ? (locale === 'fr' ? 'Fermer le menu' : 'Close menu') : (locale === 'fr' ? 'Ouvrir le menu' : 'Open menu')} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </div>
    {open && <nav id="mobile-nav" className="mobile-nav" aria-label={locale === 'fr' ? 'Navigation mobile' : 'Mobile navigation'} onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); menuRef.current?.focus() } }}>
      {[...links, { id: 'certifications', fr: 'Certifications', en: 'Certifications' }, { id: 'contact', fr: 'Contact', en: 'Contact' }].map((link, index) => <a href={`#${link.id}`} key={link.id} onClick={() => setOpen(false)}><span className="mono">0{index + 1}</span>{link[locale]}<ArrowUpRight size={17} /></a>)}
    </nav>}
    <motion.div className="scroll-progress" style={{ scaleX: reduced ? scrollYProgress : smooth }} />
  </header>
}
