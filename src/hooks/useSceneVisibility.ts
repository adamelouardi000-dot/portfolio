import { useEffect, type RefObject } from 'react'

/** Suspend decorative CSS loops when the hero is offscreen or the tab is hidden. */
export function useSceneVisibility(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scene = ref.current
    if (!scene) return
    let inView = true
    const update = () => { scene.dataset.sceneVisible = String(inView && !document.hidden) }
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
      inView = entries[0]?.isIntersecting ?? false
      update()
    }, { rootMargin: '80px' })
    observer?.observe(scene)
    document.addEventListener('visibilitychange', update)
    update()
    return () => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', update)
      delete scene.dataset.sceneVisible
    }
  }, [ref])
}
