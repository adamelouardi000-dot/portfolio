import { useRef, type CSSProperties } from 'react'
import { useSceneVisibility } from '../hooks/useSceneVisibility'

const streams = [
  '0101 / 0x7F > 1010 : 0011', 'F2 A9 // 0110 1001 / C4',
  '1010 { 0011 } 0xAF : 01', '0F 1A > 0010 // 11 C8',
  '0110 : FF / 1001 > 0010', 'A1 0C { 1010 } 0101 / F0',
  '1100 // 0x3F : 0110 > 01', '0B 01 / 1011 { 00 } 1F',
]

/** Eight fixed CSS streams; no canvas, character timer or per-frame React work. */
export function CodeRain({ variant = 'hero' }: { variant?: 'hero' | 'terminal' }) {
  const ref = useRef<HTMLDivElement>(null)
  useSceneVisibility(ref)
  return <div ref={ref} className={`code-rain code-rain-${variant}`} aria-hidden="true">
    {streams.map((stream, index) => <span key={index} style={{
      '--rain-left': `${7 + index * 12}%`,
      '--rain-duration': `${19 + index % 4 * 3}s`,
      '--rain-delay': `${index * -4.7}s`,
    } as CSSProperties}>{stream}</span>)}
  </div>
}
