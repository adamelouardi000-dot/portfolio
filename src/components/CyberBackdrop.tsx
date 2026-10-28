import { useId, type CSSProperties } from 'react'
import { CodeRain } from './CodeRain'

const traces = [
  'M-60 310H155L225 380H410L490 460H710',
  'M60 730H250L335 645H570L650 565H930',
  'M870 70V150L960 240H1160L1240 320H1500',
  'M1060 880V730L1160 630H1390L1490 530',
]

/** A code-native decorative scene: no video, bitmap download, canvas, or tracking. */
export function CyberBackdrop() {
  const id = useId().replace(/:/g, '')
  return <div className="cyber-backdrop" aria-hidden="true">
    <div className="scene-aurora scene-aurora-blue" />
    <div className="scene-aurora scene-aurora-cyan" />
    <div className="scene-fine-grid" />
    <CodeRain />
    <div className="scene-pointer-light" />
    <svg className="scene-circuits" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id={`${id}-trace`} x1="0" y1="0" x2="1440" y2="900" gradientUnits="userSpaceOnUse"><stop stopColor="#527fff" /><stop offset=".6" stopColor="#62dded" /><stop offset="1" stopColor="#527fff" /></linearGradient></defs>
      {traces.map((path, index) => <g key={path} style={{ '--trace-delay': `${index * -3}s` } as CSSProperties}>
        <path d={path} stroke="#416d9b" strokeOpacity=".15" />
        <path d={path} stroke={`url(#${id}-trace)`} className="scene-trace" />
      </g>)}
      {[[155, 310], [410, 380], [250, 730], [570, 645], [960, 240], [1240, 320], [1160, 630], [1390, 630]].map(([x, y], index) => <g key={index}><circle cx={x} cy={y} r="3" fill="#62dded" opacity=".35" /><circle cx={x} cy={y} r="8" stroke="#62dded" opacity=".12" /></g>)}
    </svg>
    <div className="scene-horizon"><div /></div>
    <div className="scene-vignette" />
    <span className="scene-marker scene-marker-one">+</span>
    <span className="scene-marker scene-marker-two">+</span>
  </div>
}
