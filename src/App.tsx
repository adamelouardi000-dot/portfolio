import { useRef } from 'react'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { Seo } from './components/Seo'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Skills } from './sections/Skills'
import { Projects } from './sections/Projects'
import { Journey } from './sections/Journey'
import { Certifications } from './sections/Certifications'
import { CyberTerminal } from './sections/CyberTerminal'
import { Contact } from './sections/Contact'
import { useLocale } from './hooks/useLocale'
import { usePointerLighting } from './hooks/usePointerLighting'
import { VisualEffectsProvider } from './components/VisualEffectsProvider'
import { TerminalIntro } from './components/TerminalIntro'
import './styles/visual-experience.css'

export default function App() {
  return <VisualEffectsProvider><Portfolio /></VisualEffectsProvider>
}

function Portfolio() {
  const { locale, setLocale } = useLocale()
  const mainRef = useRef<HTMLElement>(null)
  usePointerLighting(mainRef, 'cards')
  return <>
    <Seo locale={locale} />
    <TerminalIntro locale={locale} />
    <Navigation locale={locale} setLocale={setLocale} />
    <main id="main" ref={mainRef} tabIndex={-1}>
      <Hero locale={locale} />
      <About locale={locale} />
      <Skills locale={locale} />
      <Projects locale={locale} />
      <Journey locale={locale} />
      <Certifications locale={locale} />
      <CyberTerminal locale={locale} />
      <Contact locale={locale} />
    </main>
    <Footer locale={locale} />
  </>
}
