import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowDownLeft, Check, Command, Terminal as TerminalIcon } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { CodeRain } from '../components/CodeRain'
import { ScrollSignal } from '../components/ScrollSignal'
import { localize, type Locale } from '../data/types'
import { getTerminalResponse, terminalCommandDescriptions, terminalCommands } from '../lib/terminal'
import '../styles/interactive-sections.css'

type Entry = { id: number; command: string }

export function CyberTerminal({ locale }: { locale: Locale }) {
  const fr = locale === 'fr'
  const [input, setInput] = useState('')
  const [entries, setEntries] = useState<Entry[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [draft, setDraft] = useState('')
  const [announcementEntry, setAnnouncementEntry] = useState<Entry | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const entryId = useRef(0)

  useEffect(() => {
    const output = outputRef.current
    if (output) output.scrollTop = output.scrollHeight
  }, [entries])

  function runCommand(value: string) {
    const command = value.trim().slice(0, 120)
    if (!command) return
    const response = getTerminalResponse(command, locale)
    const nextEntry = { id: entryId.current++, command }
    setHistory((current) => [...current, command].slice(-40))
    setEntries((current) => response.kind === 'clear' ? [] : [...current, nextEntry].slice(-30))
    setAnnouncementEntry(nextEntry)
    setInput('')
    setDraft('')
    setHistoryIndex(-1)
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    runCommand(input)
  }

  function navigateHistory(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    if (history.length === 0) return
    event.preventDefault()
    if (event.key === 'ArrowUp') {
      if (historyIndex === -1) setDraft(input)
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setInput(history[nextIndex])
    } else {
      if (historyIndex === -1) return
      const nextIndex = historyIndex + 1
      setHistoryIndex(nextIndex >= history.length ? -1 : nextIndex)
      setInput(nextIndex >= history.length ? draft : history[nextIndex])
    }
  }

  const announcement = announcementEntry === null ? null : getTerminalResponse(announcementEntry.command, locale)

  return (
    <section id="terminal" className="section cyber-terminal-section" aria-label={fr ? 'Terminal cyber' : 'Cyber terminal'}>
      <ScrollSignal tone="amber" />
      <CodeRain variant="terminal" />
      <div className="container">
        <SectionHeading
          index="06"
          eyebrow={fr ? 'Une autre façon de faire connaissance' : 'Another way to get acquainted'}
          title={fr ? 'Sous le capot.' : 'Under the hood.'}
          description={fr ? 'Un terminal pour les curieux. Explorez mon profil, une commande à la fois.' : 'A terminal for curious minds. Explore my profile, one command at a time.'}
        />
        <Reveal>
          <div className="cyber-terminal" aria-label={fr ? 'Terminal interactif simulé' : 'Simulated interactive terminal'}>
            <div className="terminal-titlebar">
              <div className="terminal-window-dots" aria-hidden="true"><span /><span /><span /></div>
              <span className="terminal-window-label"><TerminalIcon size={14} aria-hidden="true" /> portfolio — {fr ? 'session interactive' : 'interactive session'}</span>
              <span className="terminal-local-badge"><span /> LOCAL</span>
            </div>
            <div className="terminal-output" ref={outputRef} tabIndex={0} role="region" aria-label={fr ? 'Historique du terminal' : 'Terminal history'}>
              <div className="terminal-welcome">
                <div className="terminal-welcome-kicker"><Check size={14} aria-hidden="true" /> {fr ? 'Session initialisée' : 'Session initialized'}</div>
                <p>{fr ? 'Bienvenue dans mon espace cyber.' : 'Welcome to my cyber space.'}</p>
                <p className="terminal-dim">{fr ? 'Tapez' : 'Type'} <span className="terminal-command-word">help</span> {fr ? 'pour commencer, ou choisissez une commande ci-dessous.' : 'to get started, or choose a command below.'}</p>
              </div>
              {entries.map((entry) => {
                const response = getTerminalResponse(entry.command, locale)
                return (
                  <div className="terminal-entry" key={entry.id}>
                    <div className="terminal-entry-command"><span className="terminal-prompt" aria-hidden="true">visitor@portfolio <span>~</span> $</span><span className="sr-only">{fr ? 'Commande : ' : 'Command: '}</span>{entry.command}</div>
                    <div className={`terminal-response${response.kind === 'error' ? ' terminal-response-error' : ''}`}>
                      {response.lines.map((line, index) => <div key={index}>{line}</div>)}
                    </div>
                  </div>
                )
              })}
            </div>
            <form className="terminal-input-row" onSubmit={submit}>
              <label className="sr-only" htmlFor="terminal-command">{fr ? 'Saisir une commande du terminal' : 'Enter a terminal command'}</label>
              <span className="terminal-prompt" aria-hidden="true">visitor@portfolio <span>~</span> $</span>
              <input
                id="terminal-command"
                ref={inputRef}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                maxLength={120}
                value={input}
                onChange={(event) => { setInput(event.target.value); setHistoryIndex(-1) }}
                onKeyDown={navigateHistory}
                placeholder={fr ? 'entrez une commande…' : 'enter a command…'}
                aria-describedby="terminal-keyboard-hint"
              />
              <button className="terminal-submit" type="submit" aria-label={fr ? 'Exécuter la commande' : 'Run command'}><ArrowDownLeft size={17} aria-hidden="true" /></button>
            </form>
            <div className="terminal-toolbar">
              <span id="terminal-keyboard-hint"><Command size={13} aria-hidden="true" /> {fr ? '↑ ↓ historique · Entrée pour exécuter' : '↑ ↓ history · Enter to run'}</span>
              <span>{fr ? 'Simulation locale · aucun accès système' : 'Local simulation · no system access'}</span>
            </div>
          </div>
          <div className="terminal-shortcuts" aria-label={fr ? 'Raccourcis des commandes' : 'Command shortcuts'}>
            {terminalCommands.map((command) => (
              <button
                key={command}
                type="button"
                title={localize(terminalCommandDescriptions[command], locale)}
                onClick={() => { runCommand(command); inputRef.current?.focus({ preventScroll: true }) }}
              ><span aria-hidden="true">$</span> {command}</button>
            ))}
          </div>
          <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {announcement && <span key={announcementEntry?.id}>{announcement.kind === 'clear' ? (fr ? 'Terminal effacé.' : 'Terminal cleared.') : announcement.lines.join('. ')}</span>}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
