import type { CSSProperties, PointerEvent } from 'react'
import '../styles/personalisation.css'
import '../styles/name-signature.css'

function canFollowPointer(event: PointerEvent<HTMLHeadingElement>) {
  const motion = document.documentElement.dataset.visualMotion
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const hasFinePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false
  return event.pointerType !== 'touch'
    && motion !== 'paused'
    && motion !== 'reduced'
    && !prefersReducedMotion
    && hasFinePointer
}

function moveSignatureLight(event: PointerEvent<HTMLHeadingElement>) {
  if (!canFollowPointer(event)) return
  const title = event.currentTarget
  const bounds = title.getBoundingClientRect()
  if (!bounds.width || !bounds.height) return
  const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width))
  const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height))
  title.style.setProperty('--name-pointer-x', `${(x * 100).toFixed(1)}%`)
  title.style.setProperty('--name-pointer-y', `${(y * 100).toFixed(1)}%`)
  title.style.setProperty('--name-rotate-x', `${((.5 - y) * 5).toFixed(2)}deg`)
  title.style.setProperty('--name-rotate-y', `${((x - .5) * 5).toFixed(2)}deg`)
}

function resetSignatureLight(event: PointerEvent<HTMLHeadingElement>) {
  for (const property of ['--name-pointer-x', '--name-pointer-y', '--name-rotate-x', '--name-rotate-y']) {
    event.currentTarget.style.removeProperty(property)
  }
}

/** Decorative effects never replace or scramble the accessible name. */
export function InteractiveName({ name, firstName, lastName }: {
  name: string
  firstName: string
  lastName: string
}) {
  const letters = (word: string, offset = 0) => Array.from(word).map((letter, index) => (
    <span
      className="name-letter"
      key={`${index}-${letter}`}
      style={{ '--letter-index': index + offset } as CSSProperties}
    >{letter}</span>
  ))

  return (
    <h1
      className="title-interactive"
      tabIndex={0}
      aria-label={name}
      onPointerMove={moveSignatureLight}
      onPointerLeave={resetSignatureLight}
      onPointerCancel={resetSignatureLight}
    >
      <span className="name-energy" aria-hidden="true" />
      <span className="name-visible-text" aria-hidden="true">
        <span className="name-word">{letters(firstName)}</span>
        <span className="name-word surname">{letters(lastName, firstName.length)}<span className="title-dot">.</span></span>
      </span>
      <span className="name-circuit" aria-hidden="true">
        <svg viewBox="0 0 500 190" fill="none" preserveAspectRatio="none">
          <path className="name-circuit-corners" d="M15 38V13H58M442 13H485V42M485 148V177H427M72 177H15V150" />
          <path className="name-circuit-detail" d="M23 49V23H72M428 23H475V52M475 138V167H415M84 167H25V140" />
          <path className="name-circuit-trace" d="M15 177H170L188 165H302L320 177H485" />
          <path className="name-circuit-upper" d="M58 13H164L178 23H296L310 13H442" />
          <circle cx="178" cy="23" r="2" />
          <circle cx="302" cy="165" r="2" />
        </svg>
        <span className="name-scan" />
        <i className="name-particle name-particle-one" />
        <i className="name-particle name-particle-two" />
        <i className="name-particle name-particle-three" />
        <i className="name-particle name-particle-four" />
        <i className="name-particle name-particle-five" />
      </span>
    </h1>
  )
}
