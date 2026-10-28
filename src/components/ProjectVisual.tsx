import { ArrowRight, Box, Code2, FileCode2, LockKeyhole, Radio, ShieldAlert, ShieldCheck, TerminalSquare } from 'lucide-react'
import type { Locale, ProjectCategory } from '../data/types'

export function ProjectVisual({ category, locale }: { category: ProjectCategory; locale: Locale }) {
  const fr = locale === 'fr'
  return <div className={`project-visual project-visual-${category}`} aria-hidden="true">
    <div className="project-visual-grid" />
    {category === 'devsecops' && <div className="devsecops-visual"><div><Code2 size={28} strokeWidth={1.2} /><span>CODE</span></div><ArrowRight size={17} /><div><Box size={28} strokeWidth={1.2} /><span>IMAGE</span></div><ArrowRight size={17} /><div><ShieldCheck size={28} strokeWidth={1.2} /><span>SCAN</span></div><p className="mono">{fr ? 'CONSTRUIRE · CONTRÔLER · DURCIR' : 'BUILD · CHECK · HARDEN'}</p></div>}
    {category === 'development' && <div className="development-visual"><span className="mono">&lt; / &gt;</span><Code2 size={30} strokeWidth={1.2} /><p className="mono">{fr ? 'STRUCTURER · DÉVELOPPER · ANALYSER' : 'STRUCTURE · DEVELOP · ANALYZE'}</p></div>}
    {category === 'cryptography' && <div className="crypto-visual"><div className="crypto-equation">n <span>=</span> p <span>×</span> q</div><div className="crypto-branches"><span>FERMAT</span><span className="crypto-line" /><LockKeyhole size={21} /><span className="crypto-line" /><span>POLLARD ρ</span></div><div className="crypto-caption mono">{fr ? 'DE LA THÉORIE AUX FACTEURS' : 'FROM THEORY TO FACTORS'}</div></div>}
    {category === 'network' && <div className="network-visual"><div className="network-device"><FileCode2 size={27} strokeWidth={1.2} /><span>CLIENT</span></div><div className="network-tunnel"><span className="mono">TLS</span><div className="tunnel-line"><i /><LockKeyhole size={20} /><ArrowRight size={17} /></div><small>HTTPS</small></div><div className="network-device"><Radio size={27} strokeWidth={1.2} /><span>SERVER</span></div><span className="network-caption mono">{fr ? 'COMPRENDRE CHAQUE ÉCHANGE' : 'UNDERSTAND EVERY EXCHANGE'}</span></div>}
    {category === 'grc' && <div className="crisis-visual"><div className="crisis-radar"><span /><span /><ShieldAlert size={33} strokeWidth={1.2} /></div><div className="crisis-steps mono"><span><i />{fr ? 'IDENTIFIER' : 'IDENTIFY'}</span><span><i />{fr ? 'DÉCIDER' : 'DECIDE'}</span><span><i />{fr ? 'RÉPONDRE' : 'RESPOND'}</span></div></div>}
    {category === 'lab' && <div className="lab-visual"><TerminalSquare size={36} strokeWidth={1} /><span className="mono">~/labs/next-exploration</span><span className="lab-cursor" /></div>}
    <span className="project-illustration-label mono">{fr ? 'SCHÉMA ILLUSTRATIF' : 'ILLUSTRATIVE DIAGRAM'}</span>
  </div>
}
