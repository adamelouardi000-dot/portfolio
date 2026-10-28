import { ArrowDown, ArrowDownRight, ArrowRight, Download, GraduationCap } from 'lucide-react'
import { Github, Linkedin } from '../components/BrandIcons'
import { useRef } from 'react'
import { motion } from 'motion/react'
import { profile, localize } from '../data/portfolio'
import type { Locale } from '../data/types'
import { ConfigLink } from '../components/ConfigLink'
import { SecurityOrbit } from '../components/SecurityOrbit'
import { InteractiveName } from '../components/InteractiveName'
import { CyberBackdrop } from '../components/CyberBackdrop'
import { VisualEffectsToggle } from '../components/VisualEffectsToggle'
import { useVisualEffects } from '../hooks/useVisualEffects'
import { usePointerLighting } from '../hooks/usePointerLighting'
import { useSceneVisibility } from '../hooks/useSceneVisibility'

export function Hero({ locale }: { locale: Locale }) {
  const { enabled } = useVisualEffects()
  const reduced = !enabled
  const sceneRef = useRef<HTMLElement>(null)
  usePointerLighting(sceneRef, 'scene')
  useSceneVisibility(sceneRef)
  const fr = locale === 'fr'
  return <section id="home" className="hero" ref={sceneRef}>
    <CyberBackdrop />
    <div className="container">
      <div className="hero-topline mono"><span>{fr ? 'PORTFOLIO PERSONNEL' : 'PERSONAL PORTFOLIO'} <span className="text-muted">/ CYBERSECURITY</span></span><div className="hero-visual-tools"><span className="hero-edition">{fr ? 'ESPRIT CURIEUX. VISION INGÉNIEUR.' : 'CURIOUS MIND. ENGINEERING VISION.'}</span><VisualEffectsToggle locale={locale} /></div></div>
      <div className="hero-layout">
        <motion.div className="hero-copy" initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: enabled ? .7 : 0, ease: [.22, 1, .36, 1] }}>
          <div className="availability"><span className="status-dot" />{localize(profile.availability, locale)}<ArrowUpRightSmall /></div>
          <p className="hero-greeting mono">{fr ? 'BONJOUR, JE SUIS' : 'HELLO, I’M'}</p>
          <InteractiveName name={profile.name} firstName={profile.firstName} lastName={profile.lastName} />
          <motion.p key={locale} initial={reduced ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: enabled ? .3 : 0 }} className="hero-role"><span className="prompt-marker">&gt;_</span>{localize(profile.role, locale)}</motion.p>
          <p className="hero-education"><GraduationCap size={16} aria-hidden="true" /><strong>{profile.schoolShort}</strong><span className="education-separator" aria-hidden="true">/</span><span>{localize(profile.educationLevel, locale)} · {localize(profile.educationLabel, locale)}</span></p>
          <p className="hero-description">{localize(profile.heroDescription, locale)}</p>
          <div className="hero-buttons">
            <a href="#projects" className="button button-primary">{fr ? 'Explorer mes projets' : 'Explore My Projects'}<ArrowRight size={17} /></a>
            <ConfigLink href={profile.cv} className="button button-secondary" download missingLabel={fr ? 'CV à ajouter' : 'CV to be added'}><Download size={16} />{fr ? 'Télécharger mon CV' : 'Download CV'}{!profile.cv && <span className="button-note">{fr ? 'bientôt' : 'soon'}</span>}</ConfigLink>
          </div>
          <div className="hero-socials">
            <ConfigLink href={profile.github} missingLabel={fr ? 'GitHub à renseigner' : 'GitHub to be added'} className="social-link"><Github size={16} /><span>GitHub</span></ConfigLink>
            <ConfigLink href={profile.linkedin} missingLabel={fr ? 'LinkedIn à renseigner' : 'LinkedIn to be added'} className="social-link"><Linkedin size={16} /><span>LinkedIn</span></ConfigLink>
            <span className="social-divider" />
            <a href="#contact" className="hero-contact">{fr ? 'Me contacter' : 'Contact Me'}<ArrowDownRight size={14} /></a>
          </div>
        </motion.div>
        <motion.div className="hero-art" initial={reduced ? false : { opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: enabled ? 1 : 0, delay: enabled ? .15 : 0 }}><SecurityOrbit locale={locale} /></motion.div>
      </div>
      <div className="hero-footer">
        <div className="hero-fact"><span className="mono">01 / {fr ? 'FORMATION' : 'EDUCATION'}</span><strong>{profile.schoolShort} <span>— {localize(profile.educationLevel, locale)} · {localize(profile.educationLabel, locale)}</span></strong></div>
        <div className="hero-fact"><span className="mono">02 / {fr ? 'PROCHAINE ÉTAPE' : 'NEXT CHAPTER'}</span><strong>PFE {profile.internshipYear} <span>— {localize(profile.discipline, locale)}</span></strong></div>
        <a href="#about" className="scroll-cue mono">{fr ? 'DÉCOUVRIR LE PROFIL' : 'SCROLL TO EXPLORE'}<span><ArrowDown size={16} /></span></a>
      </div>
    </div>
  </section>
}

function ArrowUpRightSmall() { return <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 9L9 3M3 3H9V9" stroke="currentColor" strokeWidth="1.2" /></svg> }
