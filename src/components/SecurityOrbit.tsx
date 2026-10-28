import { useEffect, useId, useRef, useSyncExternalStore, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import type { Locale } from '../data/types'
import { useVisualEffects } from '../hooks/useVisualEffects'
import '../styles/hologram.css'

// Fixed coordinates keep the scene deterministic and intentionally sparse.
const particles = Array.from({ length: 16 }, (_, index) => ({
  left: `${8 + (index * 29) % 85}%`,
  top: `${13 + (index * 37) % 76}%`,
  '--particle-delay': `${-(index * 1.7)}s`,
  '--particle-duration': `${9 + index % 5}s`,
  '--particle-size': `${index % 3 === 0 ? 2 : 1}px`,
}))

const ticks = Array.from({ length: 48 }, (_, index) => {
  const angle = index * Math.PI / 24
  const inner = index % 4 === 0 ? 231 : 236
  return { x1: 280 + Math.sin(angle) * inner, y1: 280 - Math.cos(angle) * inner, x2: 280 + Math.sin(angle) * 241, y2: 280 - Math.cos(angle) * 241 }
})

function releasePointer(surface: HTMLDivElement | null, pointerId: number | undefined) {
  if (pointerId === undefined || !surface?.hasPointerCapture?.(pointerId)) return
  surface.releasePointerCapture(pointerId)
}

/** An original, entirely faceless SVG figure. All copy stays outside the character. */
export function SecurityOrbit({ locale }: { locale: Locale }) {
  const id = useId().replace(/:/g, '')
  const { enabled } = useVisualEffects()
  const fr = locale === 'fr'
  const stage = useRef<HTMLDivElement>(null)
  const frame = useRef(0)
  const pendingAngle = useRef(0)
  const sceneActive = useRef(true)
  const drag = useRef<{ id: number; x: number; y: number; angle: number; horizontal: boolean } | null>(null)
  const targetAngle = useMotionValue(0)
  // React only observes requested angles; spring frames stay outside React renders.
  const angle = useSyncExternalStore(callback => targetAngle.on('change', callback), () => targetAngle.get(), () => 0)
  const rotation = useSpring(targetAngle, { stiffness: 115, damping: 24, mass: .8 })
  const normalized = enabled ? ((Math.round(angle) % 360) + 360) % 360 : 0
  const paint = (name: string) => `url(#${id}-${name})`
  const changeAngle = (next: number) => {
    if (!enabled || !sceneActive.current) return
    targetAngle.set(next)
  }
  const nearestOrientation = (orientation: number) => Math.round((targetAngle.get() - orientation) / 360) * 360 + orientation
  const endDrag = () => {
    cancelAnimationFrame(frame.current)
    frame.current = 0
    const pointerId = drag.current?.id
    drag.current = null
    if (stage.current) delete stage.current.dataset.dragging
    releasePointer(stage.current, pointerId)
  }

  useEffect(() => {
    const surface = stage.current
    const stop = () => {
      cancelAnimationFrame(frame.current)
      frame.current = 0
      const pointerId = drag.current?.id
      drag.current = null
      if (surface) delete surface.dataset.dragging
      releasePointer(surface, pointerId)
      // Finish at the requested angle without leaving a spring running offscreen.
      rotation.jump(targetAngle.get())
      rotation.stop()
    }
    if (!enabled) {
      targetAngle.set(0)
      stop()
    }
    let intersecting = true
    const update = () => {
      sceneActive.current = intersecting && !document.hidden
      if (!sceneActive.current) stop()
    }
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
      intersecting = entries[0]?.isIntersecting ?? false
      update()
    }, { rootMargin: '40px' })
    if (surface) observer?.observe(surface)
    document.addEventListener('visibilitychange', update)
    update()
    return () => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', update)
      stop()
    }
  }, [enabled, rotation, targetAngle])

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled || !sceneActive.current || event.button !== 0) return
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, angle: targetAngle.get(), horizontal: false }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }
  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = drag.current
    if (!gesture || gesture.id !== event.pointerId || !enabled || !sceneActive.current) return
    const dx = event.clientX - gesture.x
    const dy = event.clientY - gesture.y
    if (!gesture.horizontal) {
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { endDrag(); return }
      if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy) * 1.2) return
      gesture.horizontal = true
      event.currentTarget.dataset.dragging = 'true'
    }
    pendingAngle.current = gesture.angle + dx * .7
    if (!frame.current) frame.current = requestAnimationFrame(() => {
      frame.current = 0
      if (!drag.current?.horizontal) return
      changeAngle(pendingAngle.current)
    })
  }
  const rotateWithKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!enabled) return
    const step = event.shiftKey ? 45 : 15
    const next = event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? targetAngle.get() - step
      : event.key === 'ArrowRight' || event.key === 'ArrowUp' ? targetAngle.get() + step
        : event.key === 'Home' ? nearestOrientation(0)
          : event.key === 'End' ? nearestOrientation(359) : null
    if (next === null) return
    event.preventDefault()
    changeAngle(next)
  }

  return <div className="security-visual hologram-visual anonymous-visual">
    <div className="hologram-caption mono" aria-hidden="true"><span><i /> SECURITY BY DESIGN</span><span className="hologram-channel">CYAN / 01</span></div>
    <div ref={stage} className="hologram-stage" role="slider" tabIndex={enabled ? 0 : -1} aria-label={fr ? 'Rotation du personnage à 360 degrés' : '360 degree character rotation'} aria-describedby={`${id}-rotation-hint`} aria-valuemin={0} aria-valuemax={359} aria-valuenow={normalized} aria-valuetext={`${normalized}°`} aria-disabled={!enabled} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag} onKeyDown={rotateWithKeyboard}>
      <div className="hologram-scenery" aria-hidden="true">
      <div className="hologram-aura" />
      <div className="hologram-halo" />
      <div className="hologram-floor" />
      <div className="hologram-plane hologram-plane-back">
        <svg viewBox="0 0 560 560" fill="none" className="hologram-svg">
          <defs>
            <linearGradient id={`${id}-ring`} x1="74" y1="70" x2="482" y2="484" gradientUnits="userSpaceOnUse"><stop stopColor="#7eefff" stopOpacity=".7" /><stop offset=".36" stopColor="#38a4bd" stopOpacity=".08" /><stop offset=".75" stopColor="#518fdb" stopOpacity=".17" /><stop offset="1" stopColor="#6ae1ee" stopOpacity=".65" /></linearGradient>
            <linearGradient id={`${id}-rim`} x1="170" y1="130" x2="385" y2="367" gradientUnits="userSpaceOnUse"><stop stopColor="#a1f7ff" /><stop offset=".34" stopColor="#36cce6" stopOpacity=".58" /><stop offset=".68" stopColor="#215177" stopOpacity=".14" /><stop offset="1" stopColor="#518adb" stopOpacity=".55" /></linearGradient>
            <linearGradient id={`${id}-hood`} x1="165" y1="147" x2="357" y2="323" gradientUnits="userSpaceOnUse"><stop stopColor="#103240" /><stop offset=".28" stopColor="#0a1d2a" /><stop offset=".58" stopColor="#06101c" /><stop offset="1" stopColor="#07101c" /></linearGradient>
            <linearGradient id={`${id}-body`} x1="133" y1="335" x2="423" y2="481" gradientUnits="userSpaceOnUse"><stop stopColor="#0c2432" /><stop offset=".28" stopColor="#091624" /><stop offset=".65" stopColor="#050c16" /><stop offset="1" stopColor="#091522" /></linearGradient>
            <linearGradient id={`${id}-fold`} x1="192" y1="311" x2="280" y2="490" gradientUnits="userSpaceOnUse"><stop stopColor="#19414c" stopOpacity=".55" /><stop offset="1" stopColor="#08121d" stopOpacity="0" /></linearGradient>
            <linearGradient id={`${id}-laptop`} x1="174" y1="342" x2="389" y2="430" gradientUnits="userSpaceOnUse"><stop stopColor="#13303f" /><stop offset=".45" stopColor="#0b1a29" /><stop offset="1" stopColor="#122d3a" /></linearGradient>
            <linearGradient id={`${id}-back`} x1="167" y1="145" x2="392" y2="450" gradientUnits="userSpaceOnUse"><stop stopColor="#102936" /><stop offset=".45" stopColor="#0b1b29" /><stop offset="1" stopColor="#050d17" /></linearGradient>
            <linearGradient id={`${id}-fade`} x1="280" y1="413" x2="280" y2="520" gradientUnits="userSpaceOnUse"><stop stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient>
            <mask id={`${id}-body-mask`}><path d="M51 321H509V530H51Z" fill={paint('fade')} /></mask>
          </defs>
          <path d="M280 16V54M280 506V544M16 280H52M508 280H544" stroke="#5993ac" strokeOpacity=".32" />
          <circle cx="280" cy="280" r="241" stroke="#417289" strokeOpacity=".12" />
          <g stroke="#5f9bb0" strokeOpacity=".35">{ticks.map((tick, index) => <path key={index} d={`M${tick.x1} ${tick.y1}L${tick.x2} ${tick.y2}`} />)}</g>
          <g className="hologram-rim-turn"><circle cx="280" cy="280" r="220" stroke={paint('ring')} /><circle cx="280" cy="280" r="220" stroke="#99f4ff" strokeOpacity=".6" strokeWidth="1.4" strokeDasharray="42 520 14 807" strokeLinecap="round" /></g>
          <circle cx="280" cy="280" r="194" stroke="#33849c" strokeOpacity=".12" strokeDasharray="2 9" />
          <g className="hologram-ring-reverse"><ellipse cx="280" cy="315" rx="245" ry="103" transform="rotate(-25 280 315)" stroke={paint('ring')} strokeWidth=".8" /></g>
          <path d="M65 145V119H91M469 119H495V145M65 415V441H91M469 441H495V415" stroke="#69d4e5" strokeOpacity=".4" />
          <path d="M77 125H86M77 125V134M483 426V435H474" stroke="#a1f3f7" strokeOpacity=".75" strokeWidth="1.5" />
          <path d="M54 354H89L111 332H150M410 211H451L472 190H505" stroke="#3992aa" strokeOpacity=".3" /><circle cx="150" cy="332" r="2" fill="#6ae1ee" fillOpacity=".5" /><circle cx="410" cy="211" r="2" fill="#6ae1ee" fillOpacity=".5" />
        </svg>
      </div>
      <div className="hologram-plane hologram-plane-front">
        <div className="hologram-character-perspective">
          <motion.div className="hologram-character-turntable" data-rotation={enabled ? Math.round(angle) : 0} style={{ rotateY: enabled ? rotation : 0 }}>
            {[-.7, -.35, 0, .35, .7].map(depth => <svg key={depth} viewBox="0 0 560 560" fill="none" className="hologram-svg hologram-volume-slice" style={{ '--slice-depth': depth } as CSSProperties}>
              <path d="M193 307C176 330 135 337 110 361C86 386 78 443 71 512H490C484 449 477 388 452 364C426 339 384 332 365 308L280 295Z" fill="#07131f" mask={paint('body-mask')} />
              <path d="M280 83C215 83 174 128 161 192C151 238 154 286 177 323C195 349 233 361 280 376C328 360 367 349 384 322C407 286 410 238 399 191C385 128 345 83 280 83Z" fill={paint('back')} />
            </svg>)}
            <svg viewBox="0 0 560 560" fill="none" className="hologram-svg hologram-side-shell">
              <path d="M270 85C228 95 216 151 217 210C213 249 218 291 238 316C210 341 197 377 196 425L193 507H363L357 439C352 404 349 368 331 341L322 309C340 277 342 229 338 186C334 125 310 85 270 85Z" fill={paint('back')} stroke="#2c6375" strokeOpacity=".45" mask={paint('body-mask')} />
              <path d="M270 85C228 95 216 151 217 210C213 249 218 291 238 316L322 309C340 277 342 229 338 186C334 125 310 85 270 85Z" fill={paint('back')} stroke="#2c6375" strokeOpacity=".45" />
              <path d="M312 354L365 416L399 423L397 435L354 435L291 395Z" fill="#0d2230" stroke="#315768" strokeOpacity=".6" />
              <path d="M368 345L375 345L401 421L421 438H352L348 432H397Z" fill="#173444" stroke="#6cbfca" strokeOpacity=".5" />
            </svg>
            <svg viewBox="0 0 560 560" fill="none" className="hologram-svg hologram-character hologram-character-front">
          {/* The shoulders dissolve into the scene rather than ending in a hard crop. */}
          <g mask={paint('body-mask')}>
            <path d="M193 307C176 330 135 337 110 361C86 386 78 443 71 512H490C484 449 477 388 452 364C426 339 384 332 365 308L280 295Z" fill={paint('body')} />
            <path d="M193 316C164 341 130 343 113 366C94 392 91 439 87 486" stroke="#51bfce" strokeOpacity=".52" strokeWidth="1.3" />
            <path d="M365 316C397 344 426 343 447 368C466 392 472 436 477 485" stroke="#38699a" strokeOpacity=".4" />
            <path d="M194 324L156 379L189 404L167 489M367 324L405 379L373 403L393 489" stroke="#316375" strokeOpacity=".31" />
            <path d="M197 325L252 377L269 499L209 443Z" fill={paint('fold')} />
            <path d="M357 326L307 374L293 498L351 444Z" fill="#0c1b2a" fillOpacity=".5" />
            <path d="M212 358L246 387M350 357L316 387M129 381L120 454M431 382L443 454" stroke="#1b3f51" strokeOpacity=".55" />
            <path d="M278 356V493" stroke="#1c3445" strokeOpacity=".32" />
          </g>
          {/* Layered fabric rims surround an opaque, featureless void. */}
          <path d="M280 83C215 83 174 128 161 192C151 238 154 286 177 323C195 349 233 361 280 376C328 360 367 349 384 322C407 286 410 238 399 191C385 128 345 83 280 83Z" fill={paint('hood')} stroke="#1c4558" strokeOpacity=".65" />
          <path d="M280 93C225 94 187 135 174 195C165 234 167 278 185 310C204 332 239 346 280 362C321 346 357 332 375 310C393 277 395 234 386 195C372 136 336 94 280 93Z" stroke={paint('rim')} strokeWidth="1.5" />
          <path d="M280 118C240 120 205 155 191 204C181 238 187 271 205 292C228 310 253 325 280 341C308 325 333 310 355 292C373 271 379 238 369 204C355 155 320 120 280 118Z" fill="#02050a" />
          <path d="M280 118C238 121 205 156 191 204C184 226 184 249 190 266" stroke="#57bfd0" strokeOpacity=".35" strokeWidth="1.5" />
          <path d="M280 118C321 121 355 156 369 204C376 226 376 249 370 266" stroke="#2d5476" strokeOpacity=".35" />
          <path d="M191 204C201 172 230 133 253 124M178 268C181 301 211 327 254 346" stroke="#69d7e4" strokeOpacity=".16" strokeWidth="3" strokeLinecap="round" />
          <path d="M173 223L165 265L180 291M387 222L396 263L381 291M192 309L219 321L246 340M368 309L342 321L315 340" stroke="#205064" strokeOpacity=".5" />
          <path d="M280 341L251 327L269 358M280 341L309 327L291 358" stroke="#17313f" strokeOpacity=".8" />
          {/* Bent sleeves support the laptop from below. */}
          <path d="M121 367C106 386 109 414 126 431L164 450L183 426L148 405L147 377Z" fill="#0d2330" stroke="#285567" strokeOpacity=".6" />
          <path d="M439 367C454 386 451 414 434 431L396 450L377 426L412 405L413 377Z" fill="#0a1b29" stroke="#28475e" strokeOpacity=".6" />
          <path d="M115 398L137 421L164 435M445 398L423 421L396 435" stroke="#488495" strokeOpacity=".37" />
            </svg>
            <svg viewBox="0 0 560 560" fill="none" className="hologram-svg hologram-character hologram-character-back">
              <g mask={paint('body-mask')}>
                <path d="M194 304C173 332 137 338 113 363C86 391 79 446 71 512H490C483 446 476 391 449 363C424 338 386 331 365 304Z" fill={paint('back')} />
                <path d="M197 317C165 340 132 348 116 371C101 397 94 440 89 485M363 317C395 340 428 348 444 371C459 397 466 440 471 485" stroke="#397b8b" strokeOpacity=".45" />
                <path d="M280 342V497M194 351L181 407L189 487M366 351L379 407L371 487M215 380L204 459M345 380L356 459" stroke="#245066" strokeOpacity=".4" />
                <path d="M125 390L141 427L166 440M435 390L419 427L394 440" stroke="#305a70" strokeOpacity=".5" />
              </g>
              <path d="M280 83C215 83 174 128 161 192C151 238 154 286 177 323C197 350 237 365 280 369C324 365 364 350 384 322C407 286 410 238 399 191C385 128 345 83 280 83Z" fill={paint('back')} stroke={paint('rim')} strokeWidth="1.2" />
              <path d="M280 92C267 142 265 207 278 265C284 291 286 329 280 361M281 94C330 99 366 144 380 199M279 94C232 101 196 141 180 199" stroke="#2f6477" strokeOpacity=".45" />
              <path d="M173 234C184 286 211 320 256 339M388 235C377 286 350 320 306 339M198 295L229 326M362 295L331 326" stroke="#2f6074" strokeOpacity=".32" />
              <path d="M269 116C263 160 264 198 268 226" stroke="#70c7d2" strokeOpacity=".11" strokeWidth="3" />
            </svg>
            <div className="hologram-laptop-volume">
              <svg viewBox="0 0 560 560" fill="none" className="hologram-svg hologram-laptop-front">
                <path d="M172 343H388L402 421H158Z" fill={paint('laptop')} stroke="#67becb" strokeOpacity=".7" strokeWidth="1.3" strokeLinejoin="round" />
                <path d="M179 350H381L393 415H167Z" stroke="#20465a" strokeOpacity=".7" />
                <path d="M175 345H386" stroke="#b5f1f4" strokeOpacity=".3" />
                <path d="M158 421H402L425 438L421 442H139L135 438Z" fill="#112b3a" stroke="#44869a" strokeOpacity=".65" strokeLinejoin="round" />
                <path d="M136 437H424M250 437H310" stroke="#75c9d2" strokeOpacity=".35" />
                <path d="M141 420C143 413 150 411 157 414L175 424C181 428 184 434 180 439C177 444 170 443 165 441L144 433Z" fill="#0b1b27" stroke="#386d7c" strokeOpacity=".75" />
                <path d="M419 420C417 413 410 411 403 414L385 424C379 428 376 434 380 439C383 444 390 443 395 441L416 433Z" fill="#091925" stroke="#315f74" strokeOpacity=".75" />
                <path d="M151 422L168 432M149 427L164 436M409 422L392 432M411 427L396 436" stroke="#467c8c" strokeOpacity=".5" strokeLinecap="round" />
              </svg>
              <svg viewBox="0 0 560 560" fill="none" className="hologram-svg hologram-laptop-rear">
                <path d="M172 343H388L402 421H158Z" fill="#08131f" stroke="#5398ac" strokeOpacity=".7" />
                <path d="M180 350H380L391 413H169Z" fill="#081c28" stroke="#285769" strokeOpacity=".55" />
                <path d="M183 354H376L386 405H174Z" fill="#10313d" fillOpacity=".45" />
                <path d="M158 421H402L425 438H135Z" fill="#0c2230" stroke="#3f7c91" strokeOpacity=".5" />
                <path d="M176 424H384L396 433H164Z" stroke="#326273" strokeWidth=".6" />
                <path d="M189 425L182 432M207 425L202 432M226 425L223 432M245 425L244 432M265 425V432M285 425V432M305 425L306 432M325 425L328 432M345 425L350 432M365 425L372 432M170 428H390" stroke="#2e5b6b" strokeWidth=".6" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="hologram-mist hologram-mist-back" />
      <div className="hologram-mist hologram-mist-front" />
      <div className="hologram-particles">{particles.map((style, index) => <i key={index} style={style as CSSProperties} />)}</div>
      <div className="hologram-front-scan"><svg viewBox="0 0 560 560" fill="none" className="hologram-svg"><ellipse cx="280" cy="439" rx="184" ry="29" stroke="#62dded" strokeOpacity=".3" /><path d="M96 439C96 455 178 468 280 468C382 468 464 455 464 439" stroke="#7eebf3" strokeOpacity=".42" /></svg></div>
      <span className="hologram-axis hologram-axis-left mono">[ + ]</span><span className="hologram-axis hologram-axis-right mono">[ + ]</span>
      </div>
    </div>
    <div className="hologram-rotation-controls" role="group" aria-label={fr ? 'Contrôles de rotation du personnage' : 'Character rotation controls'}>
      <span id={`${id}-rotation-hint`} className="hologram-rotation-hint mono">{enabled ? (fr ? 'GLISSER · FLÈCHES CLAVIER' : 'DRAG · ARROW KEYS') : (fr ? 'VUE FIXE · EFFETS EN PAUSE' : 'STILL VIEW · EFFECTS PAUSED')}</span>
      <div className="hologram-rotation-buttons">
        <button type="button" disabled={!enabled} aria-label={fr ? 'Tourner le personnage vers la gauche' : 'Rotate character left'} onClick={() => changeAngle(targetAngle.get() - 45)}><ArrowLeft size={13} aria-hidden="true" /></button>
        <button type="button" disabled={!enabled} className="hologram-rotation-reset mono" aria-label={fr ? 'Revenir à la vue de face' : 'Reset to front view'} onClick={() => changeAngle(nearestOrientation(0))}><RotateCcw size={11} aria-hidden="true" /><span aria-hidden="true">{String(normalized).padStart(3, '0')}°</span></button>
        <button type="button" disabled={!enabled} aria-label={fr ? 'Tourner le personnage vers la droite' : 'Rotate character right'} onClick={() => changeAngle(targetAngle.get() + 45)}><ArrowRight size={13} aria-hidden="true" /></button>
      </div>
    </div>
    <div className="hologram-caption hologram-caption-bottom mono" aria-hidden="true"><span>{locale === 'fr' ? 'CURIOSITÉ → MÉTHODE → IMPACT' : 'CURIOSITY → METHOD → IMPACT'}</span><span className="hologram-signal"><i /><i /><i /><i /></span></div>
  </div>
}
